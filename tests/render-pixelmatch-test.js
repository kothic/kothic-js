/* eslint-env node */

var fs = require('fs');
var http = require('http');
var os = require('os');
var path = require('path');
var assert = require('assert');
var {URL} = require('url');
var {PNG} = require('pngjs');
var {chromium} = require('playwright');

var repoRoot = path.join(__dirname, '..');
var expectedPath = path.join(__dirname, 'fixtures', 'render-pixelmatch-expected.png');
var expectedPrefix = 'render-pixelmatch-expected';
var updateExpected = process.env.UPDATE_RENDER_FIXTURES === '1';
// Keep allowance for browser/font antialiasing differences in the text-heavy fixture.
var allowedMismatchFraction = 0.02;
var pixelmatchThreshold = 0.1285;

function imageFromBuffer(buffer) {
    return PNG.sync.read(buffer);
}

function countDistinctOpaqueColors(image) {
    var colors = {};
    var x, y, idx, key;

    for (y = 0; y < image.height; y += 16) {
        for (x = 0; x < image.width; x += 16) {
            idx = (image.width * y + x) << 2;
            if (image.data[idx + 3] === 0) {
                continue;
            }
            key = [
                image.data[idx],
                image.data[idx + 1],
                image.data[idx + 2],
                image.data[idx + 3]
            ].join(',');
            colors[key] = true;
        }
    }

    return Object.keys(colors).length;
}

function getExpectedPaths() {
    var fixturesDir = path.dirname(expectedPath);

    if (!fs.existsSync(fixturesDir)) {
        return [];
    }

    return fs.readdirSync(fixturesDir).filter(function (file) {
        return file.indexOf(expectedPrefix) === 0 && path.extname(file) === '.png';
    }).map(function (file) {
        return path.join(fixturesDir, file);
    });
}

function createOutputDir() {
    var configuredOutputDir = process.env.RENDER_TEST_OUTPUT_DIR;

    if (!configuredOutputDir) {
        return fs.mkdtempSync(path.join(os.tmpdir(), 'kothic-render-'));
    }

    configuredOutputDir = path.resolve(configuredOutputDir);
    fs.mkdirSync(configuredOutputDir, {
        recursive: true
    });
    return configuredOutputDir;
}

function contentType(filePath) {
    var ext = path.extname(filePath);

    if (ext === '.html') {
        return 'text/html; charset=utf-8';
    }
    if (ext === '.js') {
        return 'application/javascript; charset=utf-8';
    }
    if (ext === '.png') {
        return 'image/png';
    }

    return 'application/octet-stream';
}

function startStaticServer() {
    var server = http.createServer(function (request, response) {
        var requestUrl = new URL(request.url, 'http://127.0.0.1');
        var filePath = path.normalize(path.join(repoRoot, decodeURIComponent(requestUrl.pathname)));

        if (filePath.indexOf(repoRoot + path.sep) !== 0) {
            response.writeHead(403);
            response.end('Forbidden');
            return;
        }

        fs.readFile(filePath, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.end('Not found');
                return;
            }

            response.writeHead(200, {
                'Content-Type': contentType(filePath)
            });
            response.end(data);
        });
    });

    return new Promise(function (resolve) {
        server.listen(0, '127.0.0.1', function () {
            resolve({
                url: 'http://127.0.0.1:' + server.address().port,
                close: function () {
                    return new Promise(function (closeResolve) {
                        server.close(closeResolve);
                    });
                }
            });
        });
    });
}

async function renderFixture() {
    var staticServer = await startStaticServer();
    var browser = await chromium.launch();
    var page = await browser.newPage({
        viewport: {
            width: 384,
            height: 384
        },
        deviceScaleFactor: 1
    });
    var consoleErrors = [];
    var pageErrors = [];
    var screenshot;

    page.on('console', function (message) {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });
    page.on('pageerror', function (error) {
        pageErrors.push(error.stack || error.message);
    });

    try {
        await page.goto(staticServer.url + '/tests/render-pixelmatch.html');
        await page.waitForFunction(function () {
            return window.__kothicRenderComplete === true;
        }, null, {
            timeout: 10000
        });

        screenshot = await page.locator('#map').screenshot({
            type: 'png'
        });
    } finally {
        await browser.close();
        await staticServer.close();
    }

    assert.deepStrictEqual(pageErrors, [], 'render fixture must not throw page errors');
    assert.deepStrictEqual(consoleErrors, [], 'render fixture must not log console errors');

    return imageFromBuffer(screenshot);
}

function compareWithExpected(actual, pixelmatch) {
    var expectedPaths = getExpectedPaths();
    var diff = new PNG({
        width: actual.width,
        height: actual.height
    });
    var bestDiff = diff;
    var bestMismatch = Infinity;
    var mismatchedPixels;
    var allowedPixels;
    var outputDir;
    var actualPath;
    var diffPath;
    var expected;
    var i;

    assert(
        expectedPaths.length > 0,
        'render fixture must have an expected PNG; run UPDATE_RENDER_FIXTURES=1 node tests/render-pixelmatch-test.js'
    );

    for (i = 0; i < expectedPaths.length; i++) {
        expected = PNG.sync.read(fs.readFileSync(expectedPaths[i]));

        assert.strictEqual(actual.width, expected.width, 'actual render width must match fixture');
        assert.strictEqual(actual.height, expected.height, 'actual render height must match fixture');

        diff = new PNG({
            width: actual.width,
            height: actual.height
        });
        mismatchedPixels = pixelmatch(
            actual.data,
            expected.data,
            diff.data,
            actual.width,
            actual.height,
            {
                threshold: pixelmatchThreshold
            }
        );

        if (mismatchedPixels < bestMismatch) {
            bestMismatch = mismatchedPixels;
            bestDiff = diff;
        }
    }

    allowedPixels = Math.floor(actual.width * actual.height * allowedMismatchFraction);

    if (bestMismatch > allowedPixels) {
        outputDir = createOutputDir();
        actualPath = path.join(outputDir, 'actual.png');
        diffPath = path.join(outputDir, 'diff.png');

        fs.writeFileSync(actualPath, PNG.sync.write(actual));
        fs.writeFileSync(diffPath, PNG.sync.write(bestDiff));

        throw new Error(
            'render pixelmatch failed: ' + bestMismatch + ' pixels differ, ' +
            'allowed ' + allowedPixels + '. Actual: ' + actualPath + ', diff: ' + diffPath
        );
    }
}

(async function () {
    var pixelmatch = (await import('pixelmatch')).default;
    var actual = await renderFixture();

    assert(
        countDistinctOpaqueColors(actual) >= 4,
        'render fixture must produce a non-blank multi-color map'
    );

    if (updateExpected) {
        fs.mkdirSync(path.dirname(expectedPath), {
            recursive: true
        });
        fs.writeFileSync(expectedPath, PNG.sync.write(actual));
        console.log('Updated ' + expectedPath);
        return;
    }

    compareWithExpected(actual, pixelmatch);
    console.log('Render pixelmatch test passed');
}()).catch(function (error) {
    console.error(error.stack || error.message);
    process.exit(1);
});

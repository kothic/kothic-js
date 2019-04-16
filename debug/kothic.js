(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//TODO: Extract kothic-leaflet to another project
window.Kothic = require("./src/kothic");
window.MapCSS = require("./src/style/mapcss");

window.Kothic.loadJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        try {
          callback(JSON.parse(xhr.responseText));
        } catch (err) {
          console.error(url, err);
        }
      } else {
        console.debug("failed:", url, xhr.status);
      }
    }
  }
  xhr.open("GET", url, true);
  xhr.send(null);
}

},{"./src/kothic":8,"./src/style/mapcss":19}],2:[function(require,module,exports){
/* globals document, ImageData */

const parseFont = require('./lib/parse-font')

exports.parseFont = parseFont

exports.createCanvas = function (width, height) {
  return Object.assign(document.createElement('canvas'), { width, height })
}

exports.createImageData = function (array, width, height) {
  // Browser implementation of ImageData looks at the number of arguments passed
  switch (arguments.length) {
    case 0: return new ImageData()
    case 1: return new ImageData(array)
    case 2: return new ImageData(array, width)
    default: return new ImageData(array, width, height)
  }
}

exports.loadImage = function (src) {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img')

    function cleanup () {
      image.onload = null
      image.onerror = null
    }

    image.onload = () => { cleanup(); resolve(image) }
    image.onerror = () => { cleanup(); reject(new Error(`Failed to load the image "${src}"`)) }

    image.src = src
  })
}

},{"./lib/parse-font":3}],3:[function(require,module,exports){
'use strict'

/**
 * Font RegExp helpers.
 */

const weights = 'bold|bolder|lighter|[1-9]00'
  , styles = 'italic|oblique'
  , variants = 'small-caps'
  , stretches = 'ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded'
  , units = 'px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q'
  , string = '\'([^\']+)\'|"([^"]+)"|[\\w\\s-]+'

// [ [ <‘font-style’> || <font-variant-css21> || <‘font-weight’> || <‘font-stretch’> ]?
//    <‘font-size’> [ / <‘line-height’> ]? <‘font-family’> ]
// https://drafts.csswg.org/css-fonts-3/#font-prop
const weightRe = new RegExp(`(${weights}) +`, 'i')
const styleRe = new RegExp(`(${styles}) +`, 'i')
const variantRe = new RegExp(`(${variants}) +`, 'i')
const stretchRe = new RegExp(`(${stretches}) +`, 'i')
const sizeFamilyRe = new RegExp(
  '([\\d\\.]+)(' + units + ') *'
  + '((?:' + string + ')( *, *(?:' + string + '))*)')

/**
 * Cache font parsing.
 */

const cache = {}

const defaultHeight = 16 // pt, common browser default

/**
 * Parse font `str`.
 *
 * @param {String} str
 * @return {Object} Parsed font. `size` is in device units. `unit` is the unit
 *   appearing in the input string.
 * @api private
 */

module.exports = function (str) {
  // Cached
  if (cache[str]) return cache[str]

  // Try for required properties first.
  const sizeFamily = sizeFamilyRe.exec(str)
  if (!sizeFamily) return // invalid

  // Default values and required properties
  const font = {
    weight: 'normal',
    style: 'normal',
    stretch: 'normal',
    variant: 'normal',
    size: parseFloat(sizeFamily[1]),
    unit: sizeFamily[2],
    family: sizeFamily[3].replace(/["']/g, '').replace(/ *, */g, ',')
  }

  // Optional, unordered properties.
  let weight, style, variant, stretch
  // Stop search at `sizeFamily.index`
  let substr = str.substring(0, sizeFamily.index)
  if ((weight = weightRe.exec(substr))) font.weight = weight[1]
  if ((style = styleRe.exec(substr))) font.style = style[1]
  if ((variant = variantRe.exec(substr))) font.variant = variant[1]
  if ((stretch = stretchRe.exec(substr))) font.stretch = stretch[1]

  // Convert to device units. (`font.unit` is the original unit)
  // TODO: ch, ex
  switch (font.unit) {
    case 'pt':
      font.size /= 0.75
      break
    case 'pc':
      font.size *= 16
      break
    case 'in':
      font.size *= 96
      break
    case 'cm':
      font.size *= 96.0 / 2.54
      break
    case 'mm':
      font.size *= 96.0 / 25.4
      break
    case '%':
      // TODO disabled because existing unit tests assume 100
      // font.size *= defaultHeight / 100 / 0.75
      break
    case 'em':
    case 'rem':
      font.size *= defaultHeight / 0.75
      break
    case 'q':
      font.size *= 96 / 25.4 / 4
      break
  }

  return (cache[str] = font)
}

},{}],4:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
'use strict';

module.exports = partialSort;

// Floyd-Rivest selection algorithm:
// Rearrange items so that all items in the [left, k] range are smaller than all items in (k, right];
// The k-th element will have the (k - left + 1)th smallest value in [left, right]

function partialSort(arr, k, left, right, compare) {
    left = left || 0;
    right = right || (arr.length - 1);
    compare = compare || defaultCompare;

    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            partialSort(arr, k, newLeft, newRight, compare);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);
        if (compare(arr[right], t) > 0) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }

        if (compare(arr[left], t) === 0) swap(arr, left, j);
        else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

},{}],7:[function(require,module,exports){
'use strict';

module.exports = rbush;

var quickselect = require('quickselect');

function rbush(maxEntries, format) {
    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    if (format) {
        this._initFormat(format);
    }

    this.clear();
}

rbush.prototype = {

    all: function () {
        return this._all(this.data, []);
    },

    search: function (bbox) {

        var node = this.data,
            result = [],
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return result;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (contains(bbox, childBBox)) this._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return result;
    },

    collides: function (bbox) {

        var node = this.data,
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return false;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf || contains(bbox, childBBox)) return true;
                    nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return false;
    },

    load: function (data) {
        if (!(data && data.length)) return this;

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from stratch using OMT algorithm
        var node = this._build(data.slice(), 0, data.length - 1, 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    insert: function (item) {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    },

    clear: function () {
        this.data = createNode([]);
        return this;
    },

    remove: function (item, equalsFn) {
        if (!item) return this;

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = findItem(item, node.children, equalsFn);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else node = null; // nothing found
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: compareNodeMinX,
    compareMinY: compareNodeMinY,

    toJSON: function () { return this.data; },

    fromJSON: function (data) {
        this.data = data;
        return this;
    },

    _all: function (node, result) {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, left, right, height) {

        var N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = createNode(items.slice(left, right + 1));
            calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        node = createNode([]);
        node.leaf = false;
        node.height = height;

        // split the items into M mostly square tiles

        var N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        calcBBox(node, this.toBBox);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path) {

        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode || node.children[0];
        }

        return node;
    },

    _insert: function (item, level, isNode) {

        var toBBox = this.toBBox,
            bbox = isNode ? item : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        extend(node, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level) {

        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var splitIndex = this._chooseSplitIndex(node, m, M);

        var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;

        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    },

    _splitRoot: function (node, newNode) {
        // split root node
        this.data = createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        calcBBox(this.data, this.toBBox);
    },

    _chooseSplitIndex: function (node, m, M) {

        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = distBBox(node, 0, i, this.toBBox);
            bbox2 = distBBox(node, i, M, this.toBBox);

            overlap = intersectionArea(bbox1, bbox2);
            area = bboxArea(bbox1) + bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M) {

        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare) {

        node.children.sort(compare);

        var toBBox = this.toBBox,
            leftBBox = distBBox(node, 0, m, toBBox),
            rightBBox = distBBox(node, M - m, M, toBBox),
            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            extend(leftBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            extend(rightBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(rightBBox);
        }

        return margin;
    },

    _adjustParentBBoxes: function (bbox, path, level) {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            extend(path[i], bbox);
        }
    },

    _condense: function (path) {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else calcBBox(path[i], this.toBBox);
        }
    },

    _initFormat: function (format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        var compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a',
            'return {minX: a' + format[0] +
            ', minY: a' + format[1] +
            ', maxX: a' + format[2] +
            ', maxY: a' + format[3] + '};');
    }
};

function findItem(item, items, equalsFn) {
    if (!equalsFn) return items.indexOf(item);

    for (var i = 0; i < items.length; i++) {
        if (equalsFn(item, items[i])) return i;
    }
    return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox(node, toBBox) {
    distBBox(node, 0, node.children.length, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node, k, p, toBBox, destNode) {
    if (!destNode) destNode = createNode(null);
    destNode.minX = Infinity;
    destNode.minY = Infinity;
    destNode.maxX = -Infinity;
    destNode.maxY = -Infinity;

    for (var i = k, child; i < p; i++) {
        child = node.children[i];
        extend(destNode, node.leaf ? toBBox(child) : child);
    }

    return destNode;
}

function extend(a, b) {
    a.minX = Math.min(a.minX, b.minX);
    a.minY = Math.min(a.minY, b.minY);
    a.maxX = Math.max(a.maxX, b.maxX);
    a.maxY = Math.max(a.maxY, b.maxY);
    return a;
}

function compareNodeMinX(a, b) { return a.minX - b.minX; }
function compareNodeMinY(a, b) { return a.minY - b.minY; }

function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

function enlargedArea(a, b) {
    return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
           (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea(a, b) {
    var minX = Math.max(a.minX, b.minX),
        minY = Math.max(a.minY, b.minY),
        maxX = Math.min(a.maxX, b.maxX),
        maxY = Math.min(a.maxY, b.maxY);

    return Math.max(0, maxX - minX) *
           Math.max(0, maxY - minY);
}

function contains(a, b) {
    return a.minX <= b.minX &&
           a.minY <= b.minY &&
           b.maxX <= a.maxX &&
           b.maxY <= a.maxY;
}

function intersects(a, b) {
    return b.minX <= a.maxX &&
           b.minY <= a.maxY &&
           b.maxX >= a.minX &&
           b.maxY >= a.minY;
}

function createNode(children) {
    return {
        children: children,
        height: 1,
        leaf: true,
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect(arr, left, right, n, compare) {
    var stack = [left, right],
        mid;

    while (stack.length) {
        right = stack.pop();
        left = stack.pop();

        if (right - left <= n) continue;

        mid = left + Math.ceil((right - left) / n / 2) * n;
        quickselect(arr, mid, left, right, compare);

        stack.push(left, mid, mid, right);
    }
}

},{"quickselect":6}],8:[function(require,module,exports){
/*
 (c) 2013, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 http://github.com/kothic/kothic-js
*/

'use strict';

const StyleManager = require("./style/style-manager");
const Gallery = require("./style/gallery")
const Renderer = require("./renderer/renderer");

/**
 ** Available options:
 ** getFrame:Function — Function, will be called prior the heavy operations
 ** debug {boolean} — render debug information
 ** browserOptimizations {boolean} — enable set of optimizations for HTML5 Canvas implementation
 **/
function Kothic(mapcss, options) {
  this.setOptions(options);

  this.styleManager = new StyleManager(mapcss, {groupFeaturesByActions: this.browserOptimizations});

  const images = mapcss.listImageReferences();
  const gallery = new Gallery(options.gallery || {});

  this.rendererPromise = gallery.preloadImages(images).then(() => {
     return new Renderer(gallery, {
      groupFeaturesByActions: this.browserOptimizations,
      debug: this.debug,
      getFrame: this.getFrame
    });
  }, (err) => console.error(err));
}

Kothic.prototype.setOptions = function(options) {
  // if (options && typeof options.devicePixelRatio !== 'undefined') {
  //     this.devicePixelRatio = options.devicePixelRatio;
  // } else {
  //     this.devicePixelRatio = 1;
  // }

  if (options && typeof options.debug !== 'undefined') {
    this.debug = !!options.debug;
  } else {
    this.debug = false;
  }

  if (options && typeof options.getFrame === 'function') {
    this.getFrame = options.getFrame;
  } else {
    if (typeof window !== "undefined") {
      this.getFrame = function (fn) {
        var reqFrame = window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;

        reqFrame.call(window, fn);
      }
    } else {
      this.getFrame = function(callback) {
        setTimeout(callback, 0);
      }
    }
  }

  if (options && typeof options.browserOptimizations !== 'undefined') {
    this.browserOptimizations = !!options.browserOptimizations;
  } else {
    this.browserOptimizations = false;
  }
};

Kothic.prototype.render = function (canvas, geojson, zoom, callback) {
  // if (typeof canvas === 'string') {
  // TODO: Avoid document
  //     canvas = document.getElementById(canvas);
  // }
  // TODO: Consider moving this logic outside
  // var devicePixelRatio = 1; //Math.max(this.devicePixelRatio || 1, 2);

  const width = canvas.width;
  const height = canvas.height;

  // if (devicePixelRatio !== 1) {
  //     canvas.style.width = width + 'px';
  //     canvas.style.height = height + 'px';
  //     canvas.width = canvas.width * devicePixelRatio;
  //     canvas.height = canvas.height * devicePixelRatio;
  // }

  var ctx = canvas.getContext('2d');

  //TODO: move to options node-canvas specific setting
  //ctx.globalCompositeOperation = 'copy'

  // ctx.scale(devicePixelRatio, devicePixelRatio);

  // var granularity = data.granularity,
  //     ws = width / granularity, hs = height / granularity;

  const bbox = geojson.bbox;
  const hscale = width / (bbox[2] - bbox[0]);
  const vscale = height / (bbox[3] - bbox[1]);
  function project(point) {
    return [
      (point[0] - bbox[0]) * hscale,
      height - ((point[1] - bbox[1]) * vscale)
    ];
  }

  console.time('styles');

  // setup layer styles
  // Layer is an array of objects, already sorted
  const layers = this.styleManager.createLayers(geojson.features, zoom);

  console.timeEnd('styles');

  this.rendererPromise.then((renderer) => {
    renderer.render(layers, ctx, width, height, project, callback);
  }).catch((err) => console.error(err))
};

module.exports = Kothic;

},{"./renderer/renderer":14,"./style/gallery":18,"./style/style-manager":22}],9:[function(require,module,exports){
'use strict';

const colors = require('../utils/colors.js');

function deg(rad) {
	return rad * 180 / Math.PI;
}

function rad(deg) {
	return deg * Math.PI / 180;
}

function quadrant(angle) {
  if (angle < Math.PI / 2 && angle > -Math.PI / 2)  {
    return '1,3';
  } else {
    return '2,4';
  }
}

function createSegments(points) {
  const segments = [];
  //TODO: Make this angle configurable
  const maxSegmentAngle = rad(45);

  // Offset of each segment from the beginning og the line
  var offset = 0;
  for (var i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Try to attach current point to a previous segment
    if (segments.length > 0) {
      const prevSegment = segments[segments.length - 1];
      const prevAngle = prevSegment.angles[prevSegment.angles.length - 1];

      // Angles more than 180 degrees are reversed to different direction
      var angleDiff = Math.abs(prevAngle - angle);
      if (angleDiff > Math.PI) {
        angleDiff = (2 * Math.PI) - angleDiff;
      }

      // The segment can be continued, if
      // 1. Angle between two parts is lesser then maxSegmentAngle to avoid sharp corners
      // 2. Part is direcred to the same hemicircle as the previous segment
      //
      // Otherwise, the new segment will be created
      if (angleDiff < maxSegmentAngle && quadrant(angle) == prevSegment.quadrant) {
        prevSegment.points.push(end);
        prevSegment.angles.push(angle);
        prevSegment.partsLength.push(length);
        prevSegment.length += length;
        offset += length;
        continue;
      }
    }

    segments.push({
      angles: [angle],
      partsLength: [length],
      offset: offset,
      length: length,
      points: [start, end],
      quadrant: quadrant(angle)
    });

    offset += length;
  }

  return segments;
}

/** Find index of segemnt part and offset from beginning of the part by offset.
 ** This method is used to put label to the center of a segment
 ** @param parts {array} array of segment parts length
 ** @param offset {float} expected offset
 **/
function calculateOffset(parts, offset) {
  var totalOffset = 0;

  for (var i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (totalOffset + part > offset) {
      return [i, offset - totalOffset];
    } else {
      totalOffset += part;
    }
  }

  throw new Error("Sanity check: path is shorter than an offset");
}

function drawGlyph(ctx, glyph, hasHalo=false) {
  ctx.translate(glyph.position[0], glyph.position[1]);
  ctx.rotate(glyph.angle);
	if (hasHalo) {
  	ctx.strokeText(glyph.glyph, glyph.offset[0], glyph.offset[1]);
	} else {
		ctx.fillText(glyph.glyph, glyph.offset[0], glyph.offset[1]);
	}

  ctx.rotate(-glyph.angle);
  ctx.translate(-glyph.position[0], -glyph.position[1]);
}

function renderSegments(ctx, segments) {
  ctx.save();
  segments.forEach((seg) => {
    ctx.strokeStyle = colors.nextColor();
    ctx.lineWidth = 3;
    ctx.beginPath()
    ctx.moveTo(seg.points[0][0], seg.points[0][1]);
    for (var i = 1; i < seg.points.length; i++) {
      ctx.lineTo(seg.points[i][0], seg.points[i][1]);
    }
    ctx.stroke();
  });
  ctx.restore();
}

function calculateGlyphsPositions(segment, glyphs) {
  const textWidth = glyphs.reduce((acc, glyph) => acc + glyph.width, 0);

  //Reverse segment to avoid text, flipped upside down
  if (segment.quadrant == '2,4') {
    segment.angles = segment.angles.map((angle) => angle - Math.PI);
    segment.partsLength.reverse();
    segment.points.reverse();
		segment.quadrant = '1,3'
  }

	//Align text to the middle of current segment
  const startOffset = (segment.length - textWidth) / 2;

	// Get point index and offset from that point of the starting position
	// 'index' is an index of current segment partsLength
	// 'offset' is an offset from the beggining of the part
  var [index, offset] = calculateOffset(segment.partsLength, startOffset);
  for (var i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];

		const startPointIndex = index;
    const offsetX = offset;

		//Iterate by points until space for current glyph was reserved
		var reserved = 0;
    while (reserved < glyph.width) {
      const requiredSpace = glyph.width - reserved;
			//Current part is longer than required space
      if (segment.partsLength[index] > offset + requiredSpace) {
        offset += requiredSpace;
        reserved += requiredSpace;
        break;
      }

			//Current part is shorter than required space. Reserve the whole part
			//and increment index
      reserved += segment.partsLength[index] - offset;
      index += 1;
      offset = 0;
    }

		// Text glyph may cover multiple segment parts, so a glyph angle should
		// be averaged between start ans end position
		const angle = adjustAngle(segment.points[startPointIndex], segment.angles[startPointIndex], segment.points[index], segment.angles[index], offset, 0);

		glyph.position = segment.points[startPointIndex];
		glyph.angle = angle;
		glyph.offset = [offsetX, 0];
  }

	return glyphs;
}

function adjustAngle(pointStart, angleStart, pointNext, angleNext, offsetX, offsetY) {
	//If glyph can be fitted to a single segment part, no adjustment is needed
	if (pointStart === pointNext) {
		return angleStart;
	}

	//Draw a line from start point to end point of a glyph
	const x = pointNext[0] + offsetX * Math.sin(angleNext) + offsetY * Math.sin(angleNext);
	const y = pointNext[1] + offsetX * Math.cos(angleNext) + offsetY * Math.cos(angleNext);

	//return angle of this line
	return Math.atan2(y - pointStart[1], x - pointStart[0]);
}

function checkCollisions(segment, collisions) {
	const box = segment.points.reduce((acc, point) => ({
			minX: Math.min(acc.minX, point[0]),
			minY: Math.min(acc.minY, point[1]),
			maxX: Math.max(acc.maxX, point[0]),
			maxY: Math.max(acc.maxX, point[1])
		}), {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity});

		return collisions.check(box);
}

function render(ctx, points, text, hasHalo, collisions, debug=false) {
  const glyphs = text.split("")
      .map((l) => {
        const metrics = ctx.measureText(l);
        return {
          glyph: l,
          width: metrics.width,
          ascent: metrics.emHeightAscent,
          descent: metrics.emHeightDescent,
        }
      });

  const textWidth = glyphs.reduce((acc, glyph) => acc + glyph.width, 0);

  var segments = createSegments(points);

  if (debug) {
    renderSegments(ctx, segments);
  }

  //TODO: Merge first and last segments if possible

  segments = segments.filter((seg) => seg.length > textWidth);

	segments = segments.filter((seg) => checkCollisions(seg, collisions))


  //TODO Choose best segments

  //Render text
  segments.forEach((seg) => {
		const positions = calculateGlyphsPositions(seg, glyphs);

		if (hasHalo) {
			positions.forEach((glyph) => {
				drawGlyph(ctx, glyph, true);
			});
		}
		positions.forEach((glyph) => {
			drawGlyph(ctx, glyph, false);
		});
	});
}

module.exports.render = render;

},{"../utils/colors.js":25}],10:[function(require,module,exports){
'use strict';
const geom = require('../utils/geom');

function renderIcon(ctx, feature, nextFeature, {projectPointFunction, collisionBuffer, gallery}) {
  //TODO: Refactor, calculate representative point only once
  const point = geom.getReprPoint(feature.geometry, projectPointFunction);
  if (!point) {
    return;
  }

  const actions = feature.actions;

  const image = gallery.getImage(actions['icon-image']);
  if (!image) {
    return;
  }

  var w = image.width, h = image.height;

  //Zoom image according to values, specified in MapCSS
  if (actions['icon-width'] || actions['icon-height']) {
    if (actions['icon-width']) {
      w = actions['icon-width'];
      h = image.height * w / image.width;
    }
    if (actions['icon-height']) {
      h = actions['icon-height'];
      if (!actions['icon-width']) {
        w = image.width * h / image.height;
      }
    }
  }

  if (!actions['allow-overlap']) {
    if (collisionBuffer.checkPointWH(point, w, h, feature.kothicId)) {
      return;
    }
  }


  const x = Math.floor(point[0] - w / 2);
  const y = Math.floor(point[1] - h / 2);

  ctx.save();
  ctx.beginPath();
  //ctx.strokeStyle = 'black'
  //ctx.lineWidth = 1
  ctx.ellipse(point[0], point[1], w / 2, h / 2, 0, 0, 2*Math.PI);
  //ctx.rect(x, y, w, h);
  ctx.clip("evenodd");
  //ctx.stroke()
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();

  const padding = parseFloat(actions['-x-kothic-padding']);
  collisionBuffer.addPointWH(point, w, h, padding, feature.kothicId);
}

module.exports.render = renderIcon;

},{"../utils/geom":27}],11:[function(require,module,exports){
//'use strict';
const path = require('./path');
const contextUtils = require('../utils/style');

//TODO: Refactor to class
module.exports = {
  pathOpened: false,
  renderCasing: function (ctx, feature, nextFeature, {projectPointFunction, tileWidth, tileHeight, groupFeaturesByActions}) {
    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;

   if (!this.pathOpened) {
     this.pathOpened = true;
      ctx.beginPath();
   }

    //TODO: Is MapCSS spec really allows a fallback from "casing-dashes" to "dashes"?
    const dashes = actions['casing-dashes'] || actions['dashes'];
    path(ctx, feature.geometry, dashes, false, projectPointFunction, tileWidth, tileHeight);

    if (groupFeaturesByActions &&
        nextFeature &&
        nextFeature.key === feature.key) {
      return;
    }

    const style = {
      'lineWidth': 2 * actions["casing-width"] + actions['width'],
      'strokeStyle': actions["casing-color"],
      'lineCap': actions["casing-linecap"] || actions['linecap'],
      'lineJoin': actions["casing-linejoin"] || actions['linejoin'],
      'globalAlpha': actions["casing-opacity"]
    }

    contextUtils.applyStyle(ctx, style);

    ctx.stroke();
    this.pathOpened = false;
  },

  render: function (ctx, feature, nextFeature, {projectPointFunction, tileWidth, tileHeight, groupFeaturesByActions, gallery}) {
    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;
    if (!this.pathOpened) {
      this.pathOpened = true;
       ctx.beginPath();
    }

    path(ctx, feature.geometry, actions['dashes'], false, projectPointFunction, tileWidth, tileHeight);

    if (groupFeaturesByActions &&
        nextFeature &&
        nextFeature.key === feature.key) {
      return;
    }

    const defaultLinejoin = actions['width'] <= 2 ? "miter" : "round";
    const defaultLinecap = actions['width'] <= 2 ? "butt" : "round";

    var strokeStyle;
    if ('image' in actions) {
      const image = gallery.getImage(actions['image']);
      if (image) {
        strokeStyle = ctx.createPattern(image, 'repeat');
      }
    }
    strokeStyle = strokeStyle || actions['color'];

    const style = {
      'strokeStyle': strokeStyle,
      'lineWidth': actions['width'],
      'lineCap': actions['linecap'] || defaultLinejoin,
      'lineJoin': actions['linejoin'] || defaultLinecap,
      'globalAlpha': actions['opacity'],
      'miterLimit': 4
    }

    contextUtils.applyStyle(ctx, style);
    ctx.stroke();

    this.pathOpened = false;
  }
};

},{"../utils/style":28,"./path":12}],12:[function(require,module,exports){
'use strict';

const geom = require('../utils/geom');

/**
 ** Render features on Canvas
 **/

function drawRing(points, ctx, tileWidth, tileHeight, drawOnTileEdges) {
  if (points.length <= 1) {
    //Geometry is too short
    return;
  }

  ctx.moveTo(points[0][0], points[0][1]);

  const padding = 50;
  const skip = 1;

  for (let j = 1, pointsLen = points.length; j < pointsLen; j++) {
    const point = points[j];
    //const prevPoint = points[j - 1]

    //TODO: Make padding as option to let user prepare data with padding
    // continue path off the tile by some amount to fix path edges between tiles
    if ((j === 0 || j === pointsLen - 1) && geom.isOnTileBoundary(point, tileWidth, tileHeight)) {
      let k = j;
      let dist, dx, dy;
      do {
        k = j ? k - 1 : k + 1;
        if (k < 0 || k >= pointsLen) {
          break;
        }

        const prevPoint = points[k];

        dx = point[0] - prevPoint[0];
        dy = point[1] - prevPoint[1];
        dist = Math.sqrt(dx * dx + dy * dy);
      } while (dist <= skip);

      // all points are so close to each other that it doesn't make sense to
      // draw the line beyond the tile border, simply skip the entire line from
      // here
      if (k < 0 || k >= pointsLen) {
        break;
      }

      point[0] = point[0] + padding * dx / dist;
      point[1] = point[1] + padding * dy / dist;
    }

    if (!drawOnTileEdges && geom.checkSameBoundary(point, points[j - 1], tileWidth, tileHeight)) {
      // Don't draw lines on tile boundaries
      ctx.moveTo(point[0], point[1]);
    } else {
      // Draw a line or filling contour
      ctx.lineTo(point[0], point[1]);
    }
  }
}

module.exports = function(ctx, geometry, dashes, drawOnTileEdges, projectPointFunction, tileWidth, tileHeight) {
  var type = geometry.type,
    coords = geometry.coordinates;
  //TODO: Those constants MUST be configured un upper design level
  var pad = 50, // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
    skip = 0;//2; // do not draw line segments shorter than this

  //Convert single feature to a mult-type to make rendering easier
  if (type === "Polygon") {
    coords = [coords];
    type = "MultiPolygon";
  } else if (type === "LineString") {
    coords = [coords];
    type = "MultiLineString";
  }

  if (dashes) {
    ctx.setLineDash(dashes);
  } else {
    ctx.setLineDash([]);
  }

  if (type === "MultiPolygon") {
    //Iterate by Polygons in MultiPolygon
    for (let i = 0, polygonsLength = coords.length; i < polygonsLength; i++) {
      //Iterate by Rings of the Polygon
      for (let j = 0, ringsLength = coords[i].length; j < ringsLength; j++) {
        if (!coords[i][j]) {
          console.log(geometry, i, j);
        }
        const points = coords[i][j].map(projectPointFunction);

        drawRing(points, ctx, tileWidth, tileHeight, drawOnTileEdges);
      }
    }
  } else if (type === "MultiLineString") {
    //Iterate by Lines in MultiLineString
    for (let i = 0, linesLength = coords.length; i < linesLength; i++) {
      const points = coords[i].map(projectPointFunction);

      drawRing(points, ctx, tileWidth, tileHeight, false)
    }
  }
};

},{"../utils/geom":27}],13:[function(require,module,exports){
//'use strict';

const path = require('./path');
const contextUtils = require('../utils/style');

module.exports = {
  pathOpened: false,
  render: function (ctx, feature, nextFeature, {projectPointFunction, tileWidth, tileHeight, groupFeaturesByActions, gallery}) {
    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;
    if (!this.pathOpened) {
      this.pathOpened = true;
      ctx.beginPath();
    }

    path(ctx, feature.geometry, false, true, projectPointFunction, tileWidth, tileHeight);

    if (groupFeaturesByActions &&
        nextFeature &&
        nextFeature.key === feature.key) {
      return;
    }

    if ('fill-color' in actions) {
      // first pass fills with solid color
      let style = {
        fillStyle: actions["fill-color"],
        globalAlpha: actions["fill-opacity"] || actions['opacity']
      };

      contextUtils.applyStyle(ctx, style);
      ctx.fill();
    }

    if ('fill-image' in actions) {
      // second pass fills with texture
      const image = gallery.getImage(actions['fill-image']);
      if (image) {
        let style = {
          fillStyle: ctx.createPattern(image, 'repeat'),
          globalAlpha: actions["fill-opacity"] || actions['opacity']
        };
        contextUtils.applyStyle(ctx, style);
        ctx.fill();
      }
    }

    this.pathOpened = false;
  }
};

},{"../utils/style":28,"./path":12}],14:[function(require,module,exports){
'use strict';

const CollisionBuffer = require("../utils/collisions");
const canvasContext = require("../utils/style");
const flow = require("../utils/flow");

const line = require("./line");
const polygon = require("./polygon");
const text = require("./text");
const shield = require("./shield");
const icon = require("./icon");

const renders = {
  casing: line.renderCasing,
  line: line.render,
  polygon: polygon.render,
  text: text.render,
  icon: icon.render,
  shield: shield.render
}

function Renderer(gallery, options) {
  this.groupFeaturesByActions = options.groupFeaturesByActions || false;
  this.debug = options.debug || false;
  this.projectPointFunction = options.projectPointFunction;
  this.getFrame = options.getFrame;
  this.gallery = gallery;
}

Renderer.prototype.renderBackground = function(layers, ctx, width, height, zoom) {
  ctx.fillStyle = '#ddd';
  ctx.fillRect(0, 0, width, height);

  //TODO: StyleManager should create background as a layer instead of messing with styles manually
  // var style = this.styleManager.restyle(styles, {}, {}, zoom, 'canvas', 'canvas');
  //
  // var fillRect = function () {
  //     ctx.fillRect(-1, -1, width + 1, height + 1);
  // };
  //
  // for (var i in style) {
  //     polygon.fill(ctx, style[i], fillRect);
  // }
}

function renderCollisions(ctx, node) {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  if (node.leaf) {
    node.children.forEach((box) => ctx.strokeRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY));
  } else {
    node.children.forEach((child) => renderCollisions(ctx, child));
  }
}

Renderer.prototype.render = function(layers, ctx, tileWidth, tileHeight, projectPointFunction, callback) {
  const self = this;

  var collisionBuffer = new CollisionBuffer(tileHeight, tileWidth);
  // render the map
  canvasContext.applyDefaults(ctx);

  const context = {
    collisionBuffer: collisionBuffer,
    gallery: this.gallery,
    tileWidth: tileWidth,
    tileHeight: tileHeight,
    projectPointFunction: projectPointFunction,
    groupFeaturesByActions: self.groupFeaturesByActions
  }

  const funcs = layers.map((layer) => ((next) => {
    const features = layer.features;

    //TODO: Emit event
    console.time(layer.render);

    const renderFn = renders[layer.render];
    for (var j = 0, len = features.length; j < len; j++) {
      renderFn(ctx, features[j], features[j + 1], context);
    }

    //TODO: Emit event
    console.timeEnd(layer.render);

    next();
  }));

  flow.series(funcs, self.getFrame, () => {
    if (self.debug) {
      renderCollisions(ctx, collisionBuffer.buffer.data);
    }
    callback();
  });
}

module.exports = Renderer;

},{"../utils/collisions":24,"../utils/flow":26,"../utils/style":28,"./icon":10,"./line":11,"./polygon":13,"./shield":15,"./text":16}],15:[function(require,module,exports){
'use strict';

const path = require('./path');
const contextUtils = require('../utils/style');
const geom = require('../utils/geom');

module.exports = {
  render: function (ctx, feature, nextFeature, {projectPointFunction, collisionBuffer, gallery}) {
    const actions = feature.actions;

    const point = geom.getReprPoint(feature.geometry, projectPointFunction);
    if (!point) {
      return;
    }

    var img, len = 0, found = false, i, sgn;

    if (actions["shield-image"]) {
      img = gallery.getImage(actions["shield-image"]);
    }

    const style = {
      font: contextUtils.composeFontDeclaration(actions["shield-font-family"] || actions["font-family"], actions["shield-font-size"] || actions["font-size"], actions),
      fillStyle: actions["shield-text-color"],
      globalAlpha: actions["shield-text-opacity"] || actions['opacity'],
      textAlign: 'center',
      textBaseline: 'middle'
    };

    contextUtils.applyStyle(ctx, style);

    var text = String(style['shield-text']),
      textWidth = ctx.measureText(text).width,
      letterWidth = textWidth / text.length,
      collisionWidth = textWidth + 2,
      collisionHeight = letterWidth * 1.8;

    if (feature.type === 'LineString') {
      len = geom.getPolyLength(feature.coordinates);

      if (Math.max(collisionHeight / hs, collisionWidth / ws) > len) {
        return;
      }

      for (i = 0, sgn = 1; i < len / 2; i += Math.max(len / 30, collisionHeight / ws), sgn *= -1) {
        var reprPoint = geom.getAngleAndCoordsAtLength(feature.coordinates, len / 2 + sgn * i, 0);
        if (!reprPoint) {
          break;
        }

        reprPoint = [reprPoint[1], reprPoint[2]];

        point = geom.transformPoint(reprPoint, ws, hs);
        if (img && !actions["allow-overlap"] && collisionBuffer.checkPointWH(point, img.width, img.height, feature.kothicId)) {
          continue;
        }
        if ((!actions["allow-overlap"]) &&
                        collisionBuffer.checkPointWH(point, collisionWidth, collisionHeight, feature.kothicId)) {
          continue;
        }
        found = true;
        break;
      }
    }

    if (!found) {
      return;
    }

    if (style["shield-casing-width"]) {
      contextUtils.applyStyle(ctx, {
        fillStyle: style["shield-casing-color"] || "#000000",
        globalAlpha: style["shield-casing-opacity"] || style['opacity'] || 1
      });
      var p = style["shield-casing-width"] + (style["shield-frame-width"] || 0);
      ctx.fillRect(point[0] - collisionWidth / 2 - p,
        point[1] - collisionHeight / 2 - p,
        collisionWidth + 2 * p,
        collisionHeight + 2 * p);
    }

    if (style["shield-frame-width"]) {
      contextUtils.applyStyle(ctx, {
        fillStyle: style["shield-frame-color"] || "#000000",
        globalAlpha: style["shield-frame-opacity"] || style['opacity'] || 1
      });
      ctx.fillRect(point[0] - collisionWidth / 2 - style["shield-frame-width"],
        point[1] - collisionHeight / 2 - style["shield-frame-width"],
        collisionWidth + 2 * style["shield-frame-width"],
        collisionHeight + 2 * style["shield-frame-width"]);
    }

    if (style["shield-color"]) {
      contextUtils.applyStyle(ctx, {
        fillStyle: style["shield-color"] || "#000000",
        globalAlpha: style["shield-opacity"] || style['opacity'] || 1
      });
      ctx.fillRect(point[0] - collisionWidth / 2,
        point[1] - collisionHeight / 2,
        collisionWidth,
        collisionHeight);
    }

    if (img) {
      ctx.drawImage(img,
        Math.floor(point[0] - img.width / 2),
        Math.floor(point[1] - img.height / 2));
    }
    contextUtils.applyStyle(ctx, {
      fillStyle: style["shield-text-color"] || "#000000",
      globalAlpha: style["shield-text-opacity"] || style['opacity'] || 1
    });

    ctx.fillText(text, point[0], Math.ceil(point[1]));
    if (img) {
      collisionBuffer.addPointWH(point, img.width, img.height, 0, feature.kothicId);
    }

    collisionBuffer.addPointWH(point, collisionHeight, collisionWidth,
      (parseFloat(style["shield-casing-width"]) || 0) + (parseFloat(style["shield-frame-width"]) || 0) + (parseFloat(style["-x-mapnik-min-distance"]) || 30), feature.kothicId);

  }
};

},{"../utils/geom":27,"../utils/style":28,"./path":12}],16:[function(require,module,exports){
'use strict';

const geom = require('../utils/geom');
const contextUtils = require('../utils/style');
//var textOnPath = require("./textonpath").textOnPath;
const textOnPath = require("./curvedtext").render

function renderText(ctx, feature, nextFeature, {projectPointFunction, collisionBuffer}) {
  const actions = feature.actions;

  const hasHalo = 'text-halo-radius' in actions && parseInt(actions['text-halo-radius']) > 0;

  const style = {
    lineWidth: actions['text-halo-radius'],
    font: contextUtils.composeFontDeclaration(actions['font-family'], actions['font-size'], actions),
    fillStyle: actions['text-color'],
    strokeStyle: actions['text-halo-color'],
    globalAlpha: actions['text-opacity'] || actions['opacity'],
    textAlign: 'center',
    textBaseline: 'middle'
  };

  contextUtils.applyStyle(ctx, style);

  var text = String(actions.text).trim();
  if (actions['text-transform'] === 'uppercase') {
    text = text.toUpperCase();
  } else if (actions['text-transform'] === 'lowercase') {
    text = text.toLowerCase();
  } else if (actions['text-transform'] === 'capitalize') {
    text = text.replace(/(^|\s)\S/g, function(ch) { return ch.toUpperCase(); });
  }

  if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'Point') {
    //TODO: Refactor, calculate representative point only once
    const point = geom.getReprPoint(feature.geometry, projectPointFunction);
    if (!point) {
      return;
    }

    const textWidth = ctx.measureText(text).width;
    const letterWidth = textWidth / text.length;
    const width = textWidth;
    const height = letterWidth * 2.5;
    const offsetY = actions['text-offset'];

    const center = [point[0], point[1] + offsetY];
    if (!actions['text-allow-overlap']) {
      if (collisionBuffer.checkPointWH(center, width, height, feature.kothicId)) {
        return;
      }
    }

    if (hasHalo) {
      ctx.strokeText(text, center[0], center[1]);
    }
    ctx.fillText(text, center[0], center[1]);

    const padding = parseFloat(actions['-x-kothic-padding']);
    collisionBuffer.addPointWH(point, width, height, padding, feature.kothicId);
  } else if (feature.geometry.type === 'LineString') {
    const points = feature.geometry.coordinates.map(projectPointFunction);
    textOnPath(ctx, points, text, hasHalo, collisionBuffer);
  }
}

module.exports.render = renderText;

},{"../utils/geom":27,"../utils/style":28,"./curvedtext":9}],17:[function(require,module,exports){
'use strict';

const EVAL_FUNCTIONS = {
  min: function (/*...*/) {
    return Math.min.apply(null, arguments);
  },

  max: function (/*...*/) {
    return Math.max.apply(null, arguments);
  },

  any: function (/*...*/) {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof(arguments[i]) !== 'undefined' && arguments[i] !== '') {
        return arguments[i];
      }
    }

    return '';
  },

  num: function (arg) {
    const n = parseFloat(arg);
    return isNaN(n) ? 0 : n;
  },

  str: function (arg) {
    return '' + arg;
  },

  int: function (arg) {
    const n = parseInt(arg, 10);
    return isNaN(n) ? 0 : n;
  },

  sqrt: function (arg) {
    return Math.sqrt(arg);
  },

  cond: function (arg, trueExpr, falseExpr) {
    trueExpr = trueExpr || true;
    falseExpr = falseExpr || false;

    return arg ? trueExpr : falseExpr;
  },

  metric: function (arg) {
    if (/\d\s*mm$/.test(arg)) {
      return 0.001 * parseFloat(arg);
    } else if (/\d\s*cm$/.test(arg)) {
      return 0.01 * parseFloat(arg);
    } else if (/\d\s*dm$/.test(arg)) {
      return 0.1 * parseFloat(arg);
    } else if (/\d\s*km$/.test(arg)) {
      return 1000 * parseFloat(arg);
    } else if (/\d\s*(in|")$/.test(arg)) {
      return 0.0254 * parseFloat(arg);
    } else if (/\d\s*(ft|')$/.test(arg)) {
      return 0.3048 * parseFloat(arg);
    } else {
      return parseFloat(arg);
    }
  },

  join: function () {
    if (arguments.length === 2 && Object.prototype.toString.call(arguments[1]) === '[object Array]') {
      return arguments[1].join(arguments[0]);
    }
    var tagString = "";

    for (var i = 1; i < arguments.length; i++) {
      tagString = tagString.concat(arguments[0]).concat(arguments[i]);
    }

    return tagString.substr(arguments[0].length);
  },

  split: function (sep, text) {
    return text.split(sep);
  },

  get: function(arr, index) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return "";
    }

    if (!/^[0-9]+$/.test(index) || index >= arr.length) {
      return "";
    }

    return arr[index];
  },

  set: function(arr, index, text) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return arr;
    }

    if (!/^[0-9]+$/.test(index)) {
      return arr;
    }

    arr[index] = text;

    return arr;
  },

  count: function(arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return 0;
    }

    return arr.length;
  },

  list: function() {
    return Array.from(arguments);
  },

  append: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    lst.push(v);

    return lst;
  },

  contains: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return false;
    }

    return (lst.indexOf(v) >= 0);
  },

  sort: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    lst.sort();

    return lst;
  },

  reverse: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    return lst.reverse();
  },
};

function evalBinaryOp(left, op, right) {
  switch (op) {
  case '+':
    return left + right;
  case '-':
    return left - right;
  case '*':
    return left * right;
  case '/':
    return left / right;
  case '%':
    return left % right;
  default:
    throw new TypeError("Unexpected binary opertator in eval " + JSON.stringify(op));
  }
}

function evalFunc(func, args, tags, actions, locales) {
  switch (func) {
  case 'tag':
    if (args.length != 1) {
      throw new Error("tag() function allows only one argument");
    }
    return args[0] in tags ? tags[args[0]] : '';
  case 'prop':
    if (args.length != 1) {
      throw new Error("prop() function allows only one argument");
    }
    return args[0] in actions ? actions[args[0]] : '';
  case 'localize':
    if (args.length != 1) {
      throw new Error("localize() function allows only one argument");
    }
    for (var i = 0; i < locales.length; i++) {
      const tag = args[0] + ':' + locales[i];
      if (tag in tags) {
        return tags[tag];
      }
    }

    return args[0] in tags ? tags[args[0]] : '';
  default:
    if (!(func in EVAL_FUNCTIONS)) {
      throw new Error("Unexpected function in eval " + JSON.stringify(func));
    }
    return EVAL_FUNCTIONS[func].apply(this, args);
  }
}

function evalExpr(expr, tags={}, actions={}, locales=[]) {
  if (!expr) {
    return null;
  }
  switch (expr.type) {
  case "binary_op":
    return evalBinaryOp(evalExpr(expr.left, tags, actions, locales), expr.op, evalExpr(expr.right, tags, actions, locales));
  case "function":
    return evalFunc(expr.func, expr.args.map((x) => evalExpr(x, tags, actions)), tags, actions, locales);
  case "string":
  case "number":
    return expr.value;
  default:
    throw new TypeError("Unexpected expression type " + JSON.stringify(expr));
  }
}

function appendKnownTags(tags, expr, locales) {

  switch (expr.type) {
  case "binary_op":
    appendKnownTags(tags, expr.left);
    appendKnownTags(tags, expr.right);
    break;
  case "function":
    if (expr.func === "tag") {
      if (expr.args && expr.args.length == 1) {
        const tag = evalExpr(expr.args[0], {}, {});
        tags[tag] = 'kv';
      }
    } else if (expr.func === "localize") {
      if (expr.args && expr.args.length == 1) {
        const tag = evalExpr(expr.args[0], {}, {});
        tags[tag] = 'kv';
        locales.map((locale) => tag + ":" + locale)
          .forEach((k) => tags[k] = 'kv');
      }
    } else {
      expr.args.forEach((arg) => appendKnownTags(tags, arg, locales));
    }
    break;
  case "string":
  case "number":
    break;
  default:
    throw new TypeError("Unexpected eval type " + JSON.stringify(expr));
  }
}

module.exports = {
  evalExpr: evalExpr,
  appendKnownTags: appendKnownTags
};

},{}],18:[function(require,module,exports){
const path = require('path');
const { loadImage } = require('canvas')

function Gallery(options) {
  this.localImagesDirectory = options && options.localImagesDirectory;
  this.images = {};
}

Gallery.prototype.preloadImages = function(images) {
  const self = this;
  const uriRegexp = /https?:\/\//;

  //External images
  var promises = images.filter((image) => image.match(uriRegexp))
      .map((image) => loadImage(image).then((data) => self.images[image] = data));

  if (this.localImagesDirectory) {
    const localPromises = images.filter((image) => !image.match(uriRegexp))
      .map((image) => loadImage(path.join(self.localImagesDirectory, image)).then((data) => self.images[image] = data));
    promises = promises.concat(localPromises);
  }

  promises = promises.map((promise) => promise);

  return Promise.all(promises);
}

Gallery.prototype.getImage = function(image) {
  return this.images[image];
}

module.exports = Gallery;

},{"canvas":2,"path":4}],19:[function(require,module,exports){
'use strict';

const rules = require("./rules");
const mapcss = require("mapcss");

/**
 ** @constructor
 ** @param {string} css — MapCSS style in a plain text
 ** @param {Object} options — style options
 ** @param {Object} options.cache:Object — cache implementation. If not specified, caching will be disabled.
 ** @param {Object} options.locales:Array[String] list of supported locales sorted by most prefered first. If not specified, localization will be disabled
 **/
function MapCSS(css, options={}) {
  if (typeof(css) !== 'string' ) {
    throw new TypeError("'css' parameter is required");
  }

  const ast = mapcss.parse(css);

  this.rules = ast;

  if (options.cache) {
    this.cache = options.cache;
  } else {
    this.cache = null;
  }

  if (options.locales) {
    this.locales = options.locales;
  } else {
    this.locales = [];
  }

  this.knownTags = rules.listKnownTags(ast, this.locales);
  this.images = rules.listKnownImages(ast);
}

MapCSS.prototype.listImageReferences = function() {
  return this.images;
}

MapCSS.prototype.createCacheKey = function(tags, zoom, featureType) {
  var keys = [];
  for (var k in tags) {
    //Test only tags, mentioned in CSS selectors
    if (k in this.knownTags) {
      if (this.knownTags[k] === 'kv') {
        //Tag key and values are checked in MapCSS
        keys.push(k + "=" + tags[k]);
      } else {
        //Only tag presence is checked in MapCSS, we don't need to take value in account
        keys.push(k);
      }
    }
  }

  return [zoom, featureType, keys.join(':')].join(':');
}

/**
 ** Apply MapCSS to a feature and return set of layer styles
 ** @param tags {Object} — maps of the feature properties
 ** @param zoom {int} — current zoom level
 ** @param featureType {String} ­— Feature geometry type in terms of GeoJSON
 ** @returns {Object} — {'layer': {'property': 'value'}}
 **/
MapCSS.prototype.apply = function(tags, zoom, featureType) {
  var key;

  if (this.cache) {
    key = this.createCacheKey(tags, zoom, featureType);

    if (this.cache && key in this.cache) {
      return this.cache[key];
    }
  }

  const classes = [];
  const layers = rules.apply(this.rules, tags, classes, zoom, featureType, this.locales);

  if (this.cache) {
    this.cache[key] = layers;
  }
  return layers;
}

module.exports = MapCSS;

},{"./rules":21,"mapcss":30}],20:[function(require,module,exports){
'use strict';

function matchSelector(selector, tags, classes, zoom, featureType) {
  if (!matchFeatureType(selector.type, featureType)) {
    return false;
  }

  if (!matchZoom(selector.zoom, zoom)) {
    return false;
  }

  if (!matchAttributes(selector.attributes, tags)) {
    return false;
  }

  if (!matchClasses(selector.classes, classes)) {
    return false;
  }

  return true;
}


/**
 ** Has side effects for performance reasons (argumant if modified)
 ** knownTags:{tag: 'k'|'kv'}
 ** attributes:[{type, key, value}]
 **/
function appendKnownTags(knownTags, attributes) {
  if (!attributes) {
    return;
  }

  for (var i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    switch (attr.type) {
    case 'presence':
    case 'absence':
      if (knownTags[attr.key] != 'kv') {
        knownTags[attr.key] = 'k';
      }
      break;
    case 'cmp':
    case 'regexp':
      //'kv' should override 'k'
      knownTags[attr.key] = 'kv';
      break;
    }
  }
}


/**
 ** range:Object = {type: 'z', begin: int, end: int}
 ** zoom:int
 **/
function matchZoom(range, zoom) {
  if (!range) {
    return true;
  }

  if (range.type !== 'z') {
    throw new Error("Zoom selector '" + range.type + "' is not supported");
  }

  return zoom >= (range.begin || 0) && zoom <= (range.end || 9000);
}

/**
 ** @param selectorType {string} — "node", "way", "relation", "line", "area", "canvas", "*"
 ** @param featureType {string} — "Point", "MultiPoint", "Polygon", "MultiPolygon", "LineString", "MultiLineString"
 **/
function matchFeatureType(selectorType, featureType) {
  if (selectorType === '*') {
    return true;
  }

  switch (featureType) {
  case 'LineString':
  case 'MultiLineString':
    return selectorType === 'way' || selectorType === 'line';
  case 'Polygon':
  case 'MultiPolygon':
    return selectorType === 'way' || selectorType === 'area';
  case 'Point':
  case 'MultiPoint':
    return selectorType === 'node';
  default:
    //Note: Canvas and Relation are virtual features and cannot be supported at this level
    throw new TypeError("Feature type is not supported: " + featureType);
  }
}

function matchAttributes(attributes, tags) {
  if (!attributes) {
    return true;
  }

  for (var i = 0; i < attributes.length; i++) {
    if (!matchAttribute(attributes[i], tags)) {
      return false;
    }
  }

  return true;
}

/**
 ** Classes are concatenated by AND statement
 ** selectorClasses:[{class:String, not:Boolean}]
 ** classes:[String]
 **/
function matchClasses(selectorClasses, classes) {
  if (!selectorClasses) {
    return true;
  }

  for (var i = 0; i < selectorClasses.length; i++) {
    const selClass = selectorClasses[i];
    if (!matchClass(selClass, classes)) {
      return false;
    }
  }

  return true;
}

function matchClass(selectorClass, classes) {
  for (var i = 0; i < classes.length; i++) {
    const cls = classes[i];
    if (selectorClass.class == cls) {
      return !selectorClass.not;
    }
  }
  return false;
}

/**
 ** op:String — one of "=", "!=", "<", "<=", ">", ">="
 ** expect:String — expected value
 ** value:String — actual value
 **/
function compare(op, expect, value) {
  // parseFloat returns NaN if failed, and NaN compared to anything is false, so
  // no additional type checks are required
  const val = parseFloat(value);
  const exp = parseFloat(expect);

  switch (op) {
  case '=':
    return isNaN(val) || isNaN(exp) ? expect == value : val == exp;
  case '!=':
    return isNaN(val) || isNaN(exp) ? expect != value : val != exp;
  case '<':
    return val < exp;
  case '<=':
    return val <= exp;
  case '>':
    return val > exp;
  case '>=':
    return val >= exp;
  default:
    return false;
  }
}


/**
 ** regexp:String — regular expression
 ** flags:String — regular expression flags
 ** value:String — actual value
 **/
function regexp(regexp, flags, value) {
  const re = new RegExp(regexp, flags);
  return re.test(value);
}

/**
 ** Match tags against single attribute selector
 ** attr:{type:String, key:String, value:String}
 ** tags:{*: *}
 **/
function matchAttribute(attr, tags) {
  switch (attr.type) {
  case 'presence':
    return attr.key in tags;
  case 'absence':
    return !(attr.key in tags);
  case 'cmp':
    return attr.key in tags && compare(attr.op, attr.value, tags[attr.key]);
  case 'regexp':
    return attr.key in tags && regexp(attr.value.regexp, attr.value.flags, tags[attr.key]);
  default:
    throw new Error("Attribute type is not supported: " + attr.type);
  }
}

module.exports = {
  matchZoom: matchZoom,
  matchFeatureType: matchFeatureType,
  matchAttributes: matchAttributes,
  matchAttribute: matchAttribute,
  matchClasses: matchClasses,
  matchSelector: matchSelector,
  appendKnownTags: appendKnownTags
}

},{}],21:[function(require,module,exports){
'use strict';

const matchers = require("./matchers");
const evalProcessor = require("./eval");

/**
 ** Extract all tags, referenced in MapCSS rules.
 **
 ** @param rules {array} — list of MapCSS rules from AST
 ** @param locales {array} — list of supported locales
 ** @return {Object} ­tags — map of tags
 **   key — tag name
 **   value — 'k' if tag value is not used
 **           'kv' if tag value is used
 **/
function listKnownTags(rules, locales=[]) {
  const tags = {};
  rules.forEach((rule) => {
    rule.selectors.forEach((selector) => {
      matchers.appendKnownTags(tags, selector.attributes);
    });

    rule.actions.forEach((action) => {
      const value = action.v;

      if (action.action === 'kv' && action.k === 'text') {
        if (value.type === "string") {
          //Support 'text: "tagname";' syntax sugar statement
          tags[value.v] = 'kv';
        } else if (value.type === "eval") {
          //Support tag() function in eval
          evalProcessor.appendKnownTags(tags, value.v, locales);
        }
      }
    });
  });

  return tags;
}

/**
 ** Extract all images, referenced in MapCSS rules.
 ** @param rules {array} — list of MapCSS rules from AST
 ** @return {array} — unique list of images
 **/
function listKnownImages(rules) {
  const images = {};

  const imageActions = ['image', 'shield-image', 'icon-image', 'fill-image'];

  rules.forEach((rule) => {
    rule.actions.forEach((action) => {
      const value = action.v;

      if (action.action === 'kv' && imageActions.includes(action.k)) {
        if (value.type === "string") {
          images[value.v.trim()] = true;
        }
      }
    });
  });

  return Object.keys(images);
}

/**
 ** Apply MapCSS style to a specified feature in specified context
 ** @param rules {array} — list of MapCSS rules from AST
 ** @param tags {Object} — key-value map of feature properties
 ** @param classes {array} — list of feature classes
 ** @param zoom {int} — zoom level in terms of tiling scheme
 ** @param featureType {string} — feature type in terms of GeoJSON features
 ** @param locales {array} — list of supported locales in prefered order
 ** @returns {Object} — map of layers for rendering
 **
 ** NB: this method is called for each rendered feature, so it must be
 ** as performance optimized as possible.
 **/
function apply(rules, tags, classes, zoom, featureType, locales) {
  const layers = {};

  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    const ruleLayers = applyRule(rule, tags, classes, zoom, featureType, locales);
    var exit = false;
    for (var layer in ruleLayers) {
      layers[layer] = layers[layer] || {};
      if ('exit' in ruleLayers[layer]) {
        exit = true;
        delete ruleLayers[layer]['exit'];
      }
      Object.assign(layers[layer], ruleLayers[layer]);
    }

    if (exit) {
      break;
    }
  }

  return layers;
}

/**
 ** return {layer, {prop, value}};
 **/
function applyRule(rule, tags, classes, zoom, featureType, locales) {
  const selectors = rule.selectors;
  const actions = rule.actions;
  const result = {};

  for (var i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    if (matchers.matchSelector(selector, tags, classes, zoom, featureType)) {
      const layer = selector.layer || 'default';
      const properties = result[layer] || {}
      const props = unwindActions(actions, tags, properties, locales, classes);

      result[layer] = Object.assign(properties, props);

      if ('exit' in properties) {
        break;
      }
    }
  }

  return result;
}

function unwindActions(actions, tags, properties, locales, classes) {
  const result = {};

  for (var i = 0; i < actions.length; i++) {
    const action = actions[i];

    switch (action.action) {
    case 'kv':
      if (action.k === 'text') {
        if (action.v.type === 'string') {
          if (action.v.v in tags) {
            result[action.k] = tags[action.v.v];
          } else {
            result[action.k] = '';
          }
        } else {
          result[action.k] = unwindValue(action.v, tags, properties, locales);
        }
      } else {
        const value = unwindValue(action.v, tags, properties, locales);
        result[action.k] = value;
      }
      break;
    case 'set_class':
      if (!classes.includes(action.v.class)) {
        classes.push(action.v.class);
      }
      break;
    case 'set_tag':
      tags[action.k] = unwindValue(action.v, tags, properties, locales);
      break;
    case 'exit':
      result['exit'] = true;
      return result;
    default:
      throw new TypeError("Action type is not supproted: " + JSON.stringify(action));
    }
  }
  return result;
}

function unwindValue(value, tags, properties, locales) {
  switch (value.type) {
  case 'string':
    return value.v;
  case 'csscolor':
    return formatCssColor(value.v);
  case 'eval':
    return evalProcessor.evalExpr(value.v, tags, properties, locales);
  default:
    throw new TypeError("Value type is not supproted: " + JSON.stringify(value));
  }
}

function formatCssColor(color) {
  if ('r' in color && 'g' in color && 'b' in color && 'a' in color) {
    return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
  } else if ('r' in color && 'g' in color && 'b' in color) {
    return "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  } else if ('h' in color && 's' in color && 'l' in color && 'a' in color) {
    return "hsla(" + color.h + ", " + color.s + ", " + color.l + ", " + color.a + ")";
  } else if ('h' in color && 's' in color && 'l' in color) {
    return "hsl(" + color.h + ", " + color.s + ", " + color.l + ")";
  }

  throw new TypeError("Unexpected color space " + JSON.stringify(color));
}

module.exports = {
  listKnownTags: listKnownTags,
  listKnownImages: listKnownImages,
  apply: apply,
}

},{"./eval":17,"./matchers":20}],22:[function(require,module,exports){
'use strict';

const supports = require("./supports");

/**
 ** @param options {Object}
 ** @param options.groupFeaturesByActions {boolean} sort features by performed actions.
 **     This optimization significately improves performance in Chrome canvas implementation, but slows down node-canvas
 **/
function StyleManager(mapcss, options) {
  this.mapcss = mapcss;

  this.groupFeaturesByActions = (options && options.groupFeaturesByActions) || false;
}

function checkActions(actions, requiredActions) {
  for (var k in actions) {
    if (requiredActions.includes(k)) {
      return true;
    }
  }

  return false;
}

//TODO Extract to supports.js
function createRenders(featureType, actions) {
  const renders = {};

  supports.forEach((renderSpec) => {
    if (!renderSpec.featureTypes.includes(featureType)) {
      return;
    }

    if (!checkActions(actions, renderSpec.requiredActions)) {
      return;
    }

    const renderActions = {
      'major-z-index': renderSpec.priority
    };

    renderSpec.actions.forEach((spec) => {
      const value = extractActionValue(spec, actions);
      if (typeof(value) !== 'undefined' && value != null) {
        renderActions[spec.action] = value;
      }
    });

    renders[renderSpec.name] = renderActions;
  });

  return renders;
}

function extractActionValue(spec, actions) {
  //TODO: Override values by priority. e.g. fill-opacity <- opacity <- default
  if (!(spec.action in actions)) {
    return typeof(spec.default) !== 'undefined' ? spec.default : null;
  }

  var value = actions[spec.action];
  switch (spec.type) {
  case 'number':
    value = parseFloat(value);
    break;
  case 'dashes':
    value = value.split(",").map(parseFloat);
    break;
  case 'boolean':
    value = value === 'true' ? true : !!value;
    break;
  case 'string':
    value = value === '' ? null : value;
    break;
  case 'color':
  case 'uri':
  default:
    break;
  }
  return [value, spec.default].find((x) => x !== null && typeof(x) !== 'undefined');
}



StyleManager.prototype.createFeatureRenders = function(feature, kothicId, zoom) {
  const featureActions = this.mapcss.apply(feature.properties, zoom, feature.geometry.type);

  const layers = {};

  for (var layerName in featureActions) {
    const renders = createRenders(feature.geometry.type, featureActions[layerName]);
    for (var render in renders) {
      const actions = renders[render];
      const zIndex = parseInt(actions['z-index']) || 0;
      const majorZIndex = parseInt(actions['major-z-index']);
      delete actions['z-index'];
      delete actions['major-z-index'];

      const restyledFeature = {
        kothicId: kothicId,
        geometry: feature.geometry,
        actions: actions,
      };

      if (this.groupFeaturesByActions) {
        restyledFeature['key'] = JSON.stringify(actions);
      }

      const layer = [zIndex, majorZIndex, layerName, render].join(',');

      layers[layer] = restyledFeature;
    }
  }
  return layers;
}
/**
 ** @param a {array} [zIndex, majorZIndex, layerName, render]
 ** @return <0 — prefer a
 ** @return >0 — prefer b
 **/
function compareLayers(a, b) {
  const layerNameA = a[2];
  const layerNameB = b[2];

  const zIndexA = parseInt(a[0]);
  const zIndexB = parseInt(b[0]);

  const majorZIndexA = parseInt(a[1]);
  const majorZIndexB = parseInt(b[1]);
  if (layerNameA == layerNameB) {
    if (majorZIndexA != majorZIndexB) {
      return majorZIndexA - majorZIndexB;
    }

    if (zIndexA != zIndexB) {
      return zIndexA - zIndexB;
    }

    throw new Error("Duplicate layers: " + JSON.stringify(a) + " and " + JSON.stringify(b));
  } else if (layerNameA == 'default') {
    return -1;
  } else if (layerNameB == 'default') {
    return 1;
  } else {
    if (zIndexA != zIndexB) {
      return zIndexA - zIndexB;
    }

    return layerNameA.localeCompare(layerNameB);
  }
}
/**
 **
 **
 ** @return {array} [{render: 'casing', zIndex: 0, features: []}, {render: 'line', features: []}, {render: 'line', features: []}]
 **
 **/
StyleManager.prototype.createLayers = function(features, zoom) {
  const layers = {};

  for (var i = 0; i < features.length; i++) {
    const renders = this.createFeatureRenders(features[i], i + 1, zoom);

    for (var key in renders) {
      layers[key] = layers[key] || [];

      layers[key].push(renders[key]);
    }
  }

  const result = [];
  const layerKeys = Object.keys(layers)   // ["0,casings", "1,lines"]
    .map((k) => k.split(","))             // [["0", "casings"], ["1", "lines"]]
    .sort(compareLayers)
    .forEach(([zIndex, majorZIndex, layerName, render]) => {
      const features = layers[[zIndex, majorZIndex, layerName, render].join(',')];

      if (this.groupFeaturesByActions) {
        features.sort((a, b) => a.key.localeCompare(b.key));
      }

      result.push({
        render: render,
        zIndex: parseInt(zIndex),
        majorZIndex: parseInt(majorZIndex),
        objectZIndex: layerName,
        features: features
      });
    });

  return result;
}

module.exports = StyleManager;

},{"./supports":23}],23:[function(require,module,exports){
module.exports = [
  {
    "name": "polygon",
    "featureTypes": ["Polygon", "MultiPolygon"],
    "requiredActions": ["fill-color", "fill-image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "fill-color",
        "default": "rgb(0, 0, 0)",
        "type": "color"
      }, {
        "action": "fill-image",
        "type": "uri"
      }, {
        "action": "fill-opacity",
        "type": "number",
        "default": 1
      },
    ],
    "priority": 10
  }, {
    "name": "casing",
    "featureTypes": ["LineString", "MultiLineString", "Polygon", "MultiPolygon"],
    "requiredActions": ["casing-width"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "casing-width",
        "default": 1,
        "type": "number"
      }, {
        "action": "width",
        "default": 0,
        "type": "number"
      }, {
        "action": "casing-color",
        "default": "rgb(0, 0, 0)",
        "type": "color"
      }, {
        "action": "casing-dashes",
        "type": "dashes"
      }, {
        "action": "casing-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "casing-linecap",
        "default": "butt",
        "type": "string"
      }, {
        "action": "casing-linejoin",
        "default": "round",
        "type": "string"
      }, {
        "action": "linecap",
        "default": "butt",
        "type": "string"
      }, {
        "action": "linejoin",
        "default": "round",
        "type": "string"
      },

    ],
    "priority": 20
  }, {
    "name": "line",
    "featureTypes": ["LineString", "MultiLineString", "Polygon", "MultiPolygon"],
    "requiredActions": ["width", "image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "width",
        "type": "number"
      }, {
        "action": "image",
        "type": "uri"
      }, {
        "action": "color",
        "type": "color",
        "default": "rgb(0, 0, 0)"
      }, {
        "action": "dashes",
        "type": "dashes"
      }, {
        "action": "opacity",
        "type": "number",
        "default": 1
      }, {
        "action": "linecap",
        "type": "string"
      }, {
        "action": "linejoin",
        "type": "string"
      },
    ],
    "priority": 30
  }, {
    "name": "icon",
    "featureTypes": ["Point", "MultiPoint", "Polygon", "MultiPolygon"],
    "requiredActions": ["icon-image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "icon-image",
        "type": "uri"
      }, {
        "action": "icon-width",
        "type": "number"
      }, {
        "action": "icon-height",
        "type": "number"
      }, {
        "action": "allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 40
  }, {
    "name": "text",
    "featureTypes": ["LineString", "MultiLineString", "Point", "MultiPoint", "Polygon", "MultiPolygon"],
    "requiredActions": ["text"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "text",
        "type": "string"
      }, {
        "action": "text-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "text-opacity",
        "type": "number",
        "default": 1
      }, {
        "action": "text-halo-radius",
        "type": "number"
      }, {
        "action": "text-halo-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "font-family",
        "type": "string"
      }, {
        "action": "font-size",
        "type": "string"
      }, {
        "action": "text-transform",
        "type": "string"
      }, {
        "action": "text-offset",
        "type": "number"
      }, {
        "action": "text-allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 50
  }, {
    "name": "shield",
    "featureTypes": ["LineString", "MultiLineString"],
    "requiredActions": ["shield-image", "shield-text"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "shield-image",
        "type": "uri"
      }, {
        "action": "shield-text",
        "type": "string"
      }, {
        "action": "shield-text-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "shield-text-opacity",
        "type": "number",
      }, {
        "action": "opacity",
        "type": "number",
      }, {
        "action": "shield-font-family",
        "type": "string"
      }, {
        "action": "shield-font-size",
        "type": "string"
      }, {
        "action": "font-family",
        "type": "string"
      }, {
        "action": "font-size",
        "type": "string"
      }, {
        "action": "shield-casing-width",
        "type": "number"
      }, {
        "action": "shield-casing-color",
        "default": "#000000",
        "type": "color"
      }, {
        "action": "shield-casing-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "shield-frame-width",
        "type": "number"
      }, {
        "action": "shield-frame-color",
        "default": "#000000",
        "type": "color"
      }, {
        "action": "shield-frame-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 60
  },
];

},{}],24:[function(require,module,exports){
'use strict';
const rbush = require('rbush');

const CollisionBuffer = function (height, width) {
  this.buffer = rbush(256);
  this.height = height;
  this.width = width;
};

function getBoxFromPoint(point, width, height, padding, id) {
  const dx = width / 2 + padding;
  const dy = height / 2 + padding;

  return {
    minX: point[0] - dx,
    minY: point[1] - dy,
    maxX: point[0] + dx,
    maxY: point[1] + dy,
    id: id
  };
}

CollisionBuffer.prototype.addPointWH = function (point, width, height, padding, id) {
  this.buffer.insert(getBoxFromPoint(point, width, height, padding, id));
}

CollisionBuffer.prototype.addPoints = function (params) {
  const points = params.map((args) => getBoxFromPoint.apply(null, args));
  this.buffer.load(points);
}

CollisionBuffer.prototype.check = function(box) {
  const result = this.buffer.search(box);
  return result.length == 0;
}

CollisionBuffer.prototype.checkPointWH = function (point, width, height, id) {
  const box = getBoxFromPoint(point, width, height, 0);

  //Always show collision outside the CollisionBuffer
  //TODO: Why do we need this???
  if (box.minX < 0 || box.minY < 0 || box.maxX > this.width || box.maxY > this.height) {
    return true;
  }

  const result = this.buffer.search(box);

  for (var i = 0, len = result.length; i < len; i++) {
    // Object with same ID doesn't induce a collision, but different ids does
    if (id !== result[i].id) {
      return true;
    }
  }

  return false;
}

module.exports = CollisionBuffer;

},{"rbush":7}],25:[function(require,module,exports){
const colors = {
  'aliceblue': '#F0F8FF',
  'antiquewhite': '#FAEBD7',
  'aqua': '#00FFFF',
  'aquamarine': '#7FFFD4',
  'azure': '#F0FFFF',
  'beige': '#F5F5DC',
  'bisque': '#FFE4C4',
  'black': '#000000',
  'blanchedalmond': '#FFEBCD',
  'blue': '#0000FF',
  'blueviolet': '#8A2BE2',
  'brown': '#A52A2A',
  'burlywood': '#DEB887',
  'cadetblue': '#5F9EA0',
  'chartreuse': '#7FFF00',
  'chocolate': '#D2691E',
  'coral': '#FF7F50',
  'cornflowerblue': '#6495ED',
  'cornsilk': '#FFF8DC',
  'crimson': '#DC143C',
  'cyan': '#00FFFF',
  'darkblue': '#00008B',
  'darkcyan': '#008B8B',
  'darkgoldenrod': '#B8860B',
  'darkgray': '#A9A9A9',
  'darkgreen': '#006400',
  'darkgrey': '#A9A9A9',
  'darkkhaki': '#BDB76B',
  'darkmagenta': '#8B008B',
  'darkolivegreen': '#556B2F',
  'darkorange': '#FF8C00',
  'darkorchid': '#9932CC',
  'darkred': '#8B0000',
  'darksalmon': '#E9967A',
  'darkseagreen': '#8FBC8F',
  'darkslateblue': '#483D8B',
  'darkslategray': '#2F4F4F',
  'darkslategrey': '#2F4F4F',
  'darkturquoise': '#00CED1',
  'darkviolet': '#9400D3',
  'deeppink': '#FF1493',
  'deepskyblue': '#00BFFF',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1E90FF',
  'firebrick': '#B22222',
  'floralwhite': '#FFFAF0',
  'forestgreen': '#228B22',
  'fuchsia': '#FF00FF',
  'gainsboro': '#DCDCDC',
  'ghostwhite': '#F8F8FF',
  'gold': '#FFD700',
  'goldenrod': '#DAA520',
  'gray': '#808080',
  'green': '#008000',
  'greenyellow': '#ADFF2F',
  'grey': '#808080',
  'honeydew': '#F0FFF0',
  'hotpink': '#FF69B4',
  'indianred': '#CD5C5C',
  'indigo': '#4B0082',
  'ivory': '#FFFFF0',
  'khaki': '#F0E68C',
  'lavender': '#E6E6FA',
  'lavenderblush': '#FFF0F5',
  'lawngreen': '#7CFC00',
  'lemonchiffon': '#FFFACD',
  'lightblue': '#ADD8E6',
  'lightcoral': '#F08080',
  'lightcyan': '#E0FFFF',
  'lightgoldenrodyellow': '#FAFAD2',
  'lightgray': '#D3D3D3',
  'lightgreen': '#90EE90',
  'lightgrey': '#D3D3D3',
  'lightpink': '#FFB6C1',
  'lightsalmon': '#FFA07A',
  'lightseagreen': '#20B2AA',
  'lightskyblue': '#87CEFA',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#B0C4DE',
  'lightyellow': '#FFFFE0',
  'lime': '#00FF00',
  'limegreen': '#32CD32',
  'linen': '#FAF0E6',
  'magenta': '#FF00FF',
  'maroon': '#800000',
  'mediumaquamarine': '#66CDAA',
  'mediumblue': '#0000CD',
  'mediumorchid': '#BA55D3',
  'mediumpurple': '#9370DB',
  'mediumseagreen': '#3CB371',
  'mediumslateblue': '#7B68EE',
  'mediumspringgreen': '#00FA9A',
  'mediumturquoise': '#48D1CC',
  'mediumvioletred': '#C71585',
  'midnightblue': '#191970',
  'mintcream': '#F5FFFA',
  'mistyrose': '#FFE4E1',
  'moccasin': '#FFE4B5',
  'navajowhite': '#FFDEAD',
  'navy': '#000080',
  'oldlace': '#FDF5E6',
  'olive': '#808000',
  'olivedrab': '#6B8E23',
  'orange': '#FFA500',
  'orangered': '#FF4500',
  'orchid': '#DA70D6',
  'palegoldenrod': '#EEE8AA',
  'palegreen': '#98FB98',
  'paleturquoise': '#AFEEEE',
  'palevioletred': '#DB7093',
  'papayawhip': '#FFEFD5',
  'peachpuff': '#FFDAB9',
  'peru': '#CD853F',
  'pink': '#FFC0CB',
  'plum': '#DDA0DD',
  'powderblue': '#B0E0E6',
  'purple': '#800080',
  'red': '#FF0000',
  'rosybrown': '#BC8F8F',
  'royalblue': '#4169E1',
  'saddlebrown': '#8B4513',
  'salmon': '#FA8072',
  'sandybrown': '#F4A460',
  'seagreen': '#2E8B57',
  'seashell': '#FFF5EE',
  'sienna': '#A0522D',
  'silver': '#C0C0C0',
  'skyblue': '#87CEEB',
  'slateblue': '#6A5ACD',
  'slategray': '#708090',
  'slategrey': '#708090',
  'snow': '#FFFAFA',
  'springgreen': '#00FF7F',
  'steelblue': '#4682B4',
  'tan': '#D2B48C',
  'teal': '#008080',
  'thistle': '#D8BFD8',
  'tomato': '#FF6347',
  'turquoise': '#40E0D0',
  'violet': '#EE82EE',
  'wheat': '#F5DEB3',
  'white': '#FFFFFF',
  'whitesmoke': '#F5F5F5',
  'yellow': '#FFFF00',
  'yellowgreen': '#9ACD32'
}

const colors_values = Object.values(colors)
  .sort((a, b) => 0.5 - Math.random());
var index = 0;

function nextColor() {
  const color = colors_values[index++];
  if (index > colors_values.length) {
    index = 0;
  }
  return color;
}

module.exports.nextColor = nextColor;

},{}],26:[function(require,module,exports){
'use strict';
function series(fns, getFrame, callback) {
  if (fns.length == 0) {
    return callback();
  }

  var current = 0;

  function next() {
    if (current >= fns.length) {
      callback();
    } else {
      getFrame(() => fns[current++](next));
    }
  }

  next();
}

module.exports.series = series;

},{}],27:[function(require,module,exports){
/**
  * Collection of geometry utillities
  */

// check if the point [in XY coordinates] is on tile's edge
// returns 4-bits bitmask of affected tile boundaries:
//   bit 0 - left
//   bit 1 - right
//   bit 2 - top
//   bit 3 - bottom
exports.isOnTileBoundary = function(p, tile_width, tile_height) {
  var r = 0;
  if (p[0] === 0) {
    r |= 1;
  } else if (p[0] === tile_width) {
    r |= 2;
  }

  if (p[1] === 0) {
    r |= 4;
  } else if (p[1] === tile_height) {
    r |= 8;
  }
  return r;
}

/* check if 2 points are both on the same tile boundary
 *
 * If points of the object are on the same tile boundary it is assumed
 * that the object is cut here and would originally continue beyond the
 * tile borders.
 *
 * This check does not catch the case where the object is located exactly
 * on the tile boundaries, but this case can't properly be detected here.
 */
exports.checkSameBoundary = function(p, q, tile_width, tile_height) {
  var bp = exports.isOnTileBoundary(p, tile_width, tile_height);

  if (!bp) {
    return false;
  }

  return (bp & exports.isOnTileBoundary(q, tile_width, tile_height));
}

// get a single point representing geometry feature (e.g. centroid)
exports.getReprPoint = function (geometry, projectPointFunction) {
  switch (geometry.type) {
  case 'Point':
    point = geometry.coordinates;
    break;
  case 'Polygon':
    //TODO: Don't expect we're have this field. We may have plain JSON here,
    // so it's better to check a feature property and calculate polygon centroid here
    // if server doesn't provide representative point
    point = geometry.reprpoint;
    break;
  case 'LineString':
    // Use center of line here
    // TODO: This approach is pretty rough: we need to check not only single point,
    // for label placing, but any point on the line
    var len = exports.getPolyLength(geometry.coordinates);
    var point = exports.getAngleAndCoordsAtLength(geometry.coordinates, len / 2, 0);
    point = [point[1], point[2]];
    break;
  case 'GeometryCollection':
    //TODO: Disassemble geometry collection
    return;
  case 'MultiPoint':
    //TODO: Disassemble multi point
    return;
  case 'MultiPolygon':
    point = geometry.reprpoint;
    break;
  case 'MultiLineString':
    //TODO: Disassemble geometry collection
    return;
  }
  return projectPointFunction(point);
};

// Calculate length of line
exports.getPolyLength = function (points) {
  var length = 0;

  for (var i = 1; i < points.length; i++) {
    var c = points[i],
      pc = points[i - 1],
      dx = pc[0] - c[0],
      dy = pc[1] - c[1];

    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
};

exports.getAngleAndCoordsAtLength = function (points, dist, width) {
  var x, y,
    length = 0,
    angle, sameseg = true,
    gotxy = false;

  width = width || 0; // by default we think that a letter is 0 px wide

  for (var i = 1; i < points.length; i++) {
    if (gotxy) {
      sameseg = false;
    }

    var c = points[i],
      pc = points[i - 1],
      dx = c[0] - pc[0],
      dy = c[1] - pc[1];

    var segLen = Math.sqrt(dx * dx + dy * dy);

    if (!gotxy && length + segLen >= dist) {
      var partLen = dist - length;
      x = pc[0] + dx * partLen / segLen;
      y = pc[1] + dy * partLen / segLen;

      gotxy = true;
    }

    if (gotxy && length + segLen >= dist + width) {
      var partLen = dist + width - length;

      dx = pc[0] + dx * partLen / segLen;
      dy = pc[1] + dy * partLen / segLen;
      angle = Math.atan2(dy - y, dx - x);

      if (sameseg) {
        return [angle, x, y, segLen - partLen];
      } else {
        return [angle, x, y, 0];
      }
    }

    length += segLen;
  }
};

},{}],28:[function(require,module,exports){
'use strict';

/**
 ** Utillity class for managing Canvas context style properties
 **/

const defaultCanvasStyle = {
  strokeStyle: 'rgba(0,0,0,0.5)',
  fillStyle: 'rgba(0,0,0,0.5)',
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'round',
  textAlign: 'center',
  textBaseline: 'middle'
};

/**
 ** Compose font declaration string for Canvas context
 **/
exports.composeFontDeclaration = function(name='', size=9, style) {
  var family = name ? name + ', ' : '';
  name = name.toLowerCase();

  var parts = [];
  if (style['font-style'] === 'italic' || style['font-style'] === 'oblique') {
    parts.push(style['font-style']);
  }

  if (style['font-variant'] === 'small-caps') {
    parts.push(style['font-variant']);
  }

  if (style['font-weight'] === 'bold') {
    parts.push(style['font-weight']);
  }

  parts.push(size + 'px');

  if (name.indexOf('serif') !== -1 && name.indexOf('sans-serif') === -1) {
    family += 'Georgia, serif';
  } else {
    family += '"Helvetica Neue", Arial, Helvetica, sans-serif';
  }
  parts.push(family);

  return parts.join(' ');
}

/**
 ** Apply styles to Canvas context
 **/
exports.applyStyle = function(ctx, style) {
  for (var key in style) {
    if (style.hasOwnProperty(key)) {
      ctx[key] = style[key];
    }
  }
}

/**
 ** Apply default style to Canvas context
 **/
exports.applyDefaults = function(ctx) {
  exports.applyStyle(ctx, defaultCanvasStyle);
}

},{}],29:[function(require,module,exports){
// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function nth(n) {
    return function(d) {
        return d[n];
    };
}


// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function $(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        });
        return ret;
    };
}
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "csscolor", "symbols": [{"literal":"#"}, "hexdigit", "hexdigit", "hexdigit", "hexdigit", "hexdigit", "hexdigit"], "postprocess": 
        function(d) {
            return {
                "r": parseInt(d[1]+d[2], 16),
                "g": parseInt(d[3]+d[4], 16),
                "b": parseInt(d[5]+d[6], 16),
            }
        }
        },
    {"name": "csscolor", "symbols": [{"literal":"#"}, "hexdigit", "hexdigit", "hexdigit"], "postprocess": 
        function(d) {
            return {
                "r": parseInt(d[1]+d[1], 16),
                "g": parseInt(d[2]+d[2], 16),
                "b": parseInt(d[3]+d[3], 16),
            }
        }
        },
    {"name": "csscolor$string$1", "symbols": [{"literal":"r"}, {"literal":"g"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "csscolor", "symbols": ["csscolor$string$1", "_", {"literal":"("}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":")"}], "postprocess": $({"r": 4, "g": 8, "b": 12})},
    {"name": "csscolor$string$2", "symbols": [{"literal":"h"}, {"literal":"s"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "csscolor", "symbols": ["csscolor$string$2", "_", {"literal":"("}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":")"}], "postprocess": $({"h": 4, "s": 8, "l": 12})},
    {"name": "csscolor$string$3", "symbols": [{"literal":"r"}, {"literal":"g"}, {"literal":"b"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "csscolor", "symbols": ["csscolor$string$3", "_", {"literal":"("}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "decimal", "_", {"literal":")"}], "postprocess": $({"r": 4, "g": 8, "b": 12, "a": 16})},
    {"name": "csscolor$string$4", "symbols": [{"literal":"h"}, {"literal":"s"}, {"literal":"l"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "csscolor", "symbols": ["csscolor$string$4", "_", {"literal":"("}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "colnum", "_", {"literal":","}, "_", "decimal", "_", {"literal":")"}], "postprocess": $({"h": 4, "s": 8, "l": 12, "a": 16})},
    {"name": "hexdigit", "symbols": [/[a-fA-F0-9]/]},
    {"name": "colnum", "symbols": ["unsigned_int"], "postprocess": id},
    {"name": "colnum", "symbols": ["percentage"], "postprocess": 
        function(d) {return Math.floor(d[0]*255); }
        },
    {"name": "eval$string$1", "symbols": [{"literal":"e"}, {"literal":"v"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "eval$ebnf$1", "symbols": ["AS"], "postprocess": id},
    {"name": "eval$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "eval", "symbols": ["eval$string$1", "_", {"literal":"("}, "_", "eval$ebnf$1", "_", {"literal":")"}], "postprocess": nth(4)},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": ([a, _1, _2, _3, b]) => ({type: 'binary_op', op: "+", left: a, right: b})},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": ([a, _1, _2, _3, b]) => ({type: 'binary_op', op: "-", left: a, right: b})},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "P"], "postprocess": ([a, _1, _2, _3, b]) => ({type: 'binary_op', op: "*", left: a, right: b})},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "P"], "postprocess": ([a, _1, _2, _3, b]) => ({type: 'binary_op', op: "/", left: a, right: b})},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"%"}, "_", "P"], "postprocess": ([a, _1, _2, _3, b]) => ({type: 'binary_op', op: "%", left: a, right: b})},
    {"name": "MD", "symbols": ["P"], "postprocess": id},
    {"name": "P", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": nth(2)},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "N", "symbols": ["float"], "postprocess": ([x]) => ({type: 'number', value: x})},
    {"name": "N", "symbols": ["func"], "postprocess": id},
    {"name": "N", "symbols": ["dqstring"], "postprocess": ([x]) => ({type: 'string', value: x})},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": (d) => parseFloat(d[0] + d[1] + d[2])},
    {"name": "float", "symbols": ["int"], "postprocess": (d) => parseInt(d[0])},
    {"name": "func$ebnf$1$subexpression$1", "symbols": ["_", "function_arg"]},
    {"name": "func$ebnf$1", "symbols": ["func$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "func$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "func", "symbols": ["term", "_", {"literal":"("}, "func$ebnf$1", "_", {"literal":")"}], "postprocess": ([func, _1, _2, args]) => ({type: 'function', func: func, args: args ? args[1] : []})},
    {"name": "function_arg", "symbols": ["AS"], "postprocess": ([arg]) => [arg]},
    {"name": "function_arg", "symbols": ["function_arg", "_", {"literal":","}, "_", "AS"], "postprocess": ([args, _1, _2, _3, arg]) => args.concat(arg)},
    {"name": "css$ebnf$1", "symbols": []},
    {"name": "css$ebnf$1", "symbols": ["css$ebnf$1", "rule"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "css", "symbols": ["_", "css$ebnf$1"], "postprocess": ([_1, rules]) => rules},
    {"name": "rule$ebnf$1", "symbols": ["action"]},
    {"name": "rule$ebnf$1", "symbols": ["rule$ebnf$1", "action"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "rule", "symbols": ["selectors", "rule$ebnf$1"], "postprocess": ([s, a]) => ({selectors: s, actions: a ? a.reduce((x,y) => x.concat(y), []) : []})},
    {"name": "rule", "symbols": ["import"], "postprocess": ([imp]) => ({'import' : imp})},
    {"name": "selectors", "symbols": ["selector"]},
    {"name": "selectors", "symbols": ["selectors", "_", {"literal":","}, "_", "selector"], "postprocess": ([list, _1, _2, _3, item]) => list.concat(item)},
    {"name": "selectors", "symbols": ["nested_selector"]},
    {"name": "selector$ebnf$1", "symbols": []},
    {"name": "selector$ebnf$1", "symbols": ["selector$ebnf$1", "class"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "selector$ebnf$2", "symbols": ["zoom"], "postprocess": id},
    {"name": "selector$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selector$ebnf$3", "symbols": ["attributes"], "postprocess": id},
    {"name": "selector$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selector$ebnf$4", "symbols": ["pseudoclasses"], "postprocess": id},
    {"name": "selector$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selector$ebnf$5", "symbols": ["layer"], "postprocess": id},
    {"name": "selector$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selector", "symbols": ["type", "selector$ebnf$1", "selector$ebnf$2", "selector$ebnf$3", "selector$ebnf$4", "selector$ebnf$5", "_"], "postprocess": 
        ([type, classes, zoom, attributes, pseudoclasses, layer]) => ({
            type: type,
            zoom: zoom,
            attributes: attributes,
            pseudoclasses: pseudoclasses,
            classes: classes,
            layer: layer
          })
                                                      },
    {"name": "nested_selector", "symbols": ["selector", "__", "selector"], "postprocess": ([parent, _, child]) => {child.parent = parent; return child;}},
    {"name": "nested_selector", "symbols": ["nested_selector", "__", "selector"], "postprocess": ([parent, _, child]) => {child.parent = parent; return child;}},
    {"name": "pseudoclasses$ebnf$1", "symbols": ["pseudoclass"]},
    {"name": "pseudoclasses$ebnf$1", "symbols": ["pseudoclasses$ebnf$1", "pseudoclass"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pseudoclasses", "symbols": ["pseudoclasses$ebnf$1"], "postprocess": id},
    {"name": "pseudoclass", "symbols": ["_", {"literal":":"}, "term"], "postprocess": ([_1, _2, pseudoclass]) => pseudoclass},
    {"name": "layer$string$1", "symbols": [{"literal":":"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "layer", "symbols": ["_", "layer$string$1", "term"], "postprocess": ([_1, _2, value]) => value},
    {"name": "attributes$ebnf$1", "symbols": ["attribute"]},
    {"name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes", "symbols": ["attributes$ebnf$1"], "postprocess": id},
    {"name": "attribute", "symbols": ["_", {"literal":"["}, "predicate", {"literal":"]"}], "postprocess": ([_0, _1, predicates, _2]) => predicates},
    {"name": "predicate", "symbols": ["tag"], "postprocess": ([tag]) => ({type: "presence", key: tag})},
    {"name": "predicate", "symbols": ["tag", "_", "operator", "_", "value"], "postprocess": ([tag, _1, op, _2, value]) => ({type: "cmp", key: tag, value: value, op: op})},
    {"name": "predicate", "symbols": [{"literal":"!"}, "tag"], "postprocess": ([_, tag]) => ({type: "absence", key: tag})},
    {"name": "predicate$string$1", "symbols": [{"literal":"~"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "predicate", "symbols": ["tag", "predicate$string$1", "regexp"], "postprocess": ([tag, op, value]) => ({type: "regexp", key: tag, value: value, op: op})},
    {"name": "tag", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "string", "symbols": ["dqstring"], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [/[a-zA-Z0-9:_\-]/]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[a-zA-Z0-9:_\-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": ["string$ebnf$1"], "postprocess": ([chars]) => chars.join("")},
    {"name": "term$ebnf$1", "symbols": [/[a-zA-Z0-9_]/]},
    {"name": "term$ebnf$1", "symbols": ["term$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "term", "symbols": ["term$ebnf$1"], "postprocess": ([chars]) => chars.join("")},
    {"name": "operator", "symbols": [{"literal":"="}], "postprocess": id},
    {"name": "operator$string$1", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "operator", "symbols": ["operator$string$1"], "postprocess": id},
    {"name": "operator", "symbols": [{"literal":"<"}], "postprocess": id},
    {"name": "operator$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "operator", "symbols": ["operator$string$2"], "postprocess": id},
    {"name": "operator", "symbols": [{"literal":">"}], "postprocess": id},
    {"name": "operator$string$3", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "operator", "symbols": ["operator$string$3"], "postprocess": id},
    {"name": "zoom", "symbols": ["_", {"literal":"|"}, /[zs]/, "zoom_interval"], "postprocess":  ([_, pipe, type, value]) => {
        	                                                 value.type = type;
        	                                                 return value;
        }
                                                      },
    {"name": "zoom_interval", "symbols": ["unsigned_int"], "postprocess": ([value]) => ({begin: value, end: value})},
    {"name": "zoom_interval$ebnf$1", "symbols": ["unsigned_int"], "postprocess": id},
    {"name": "zoom_interval$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "zoom_interval$ebnf$2", "symbols": ["unsigned_int"], "postprocess": id},
    {"name": "zoom_interval$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "zoom_interval", "symbols": ["zoom_interval$ebnf$1", {"literal":"-"}, "zoom_interval$ebnf$2"], "postprocess": ([begin, interval, end]) => ({begin: begin, end: end})},
    {"name": "regexp$ebnf$1", "symbols": []},
    {"name": "regexp$ebnf$1", "symbols": ["regexp$ebnf$1", "regexp_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "regexp$ebnf$2", "symbols": []},
    {"name": "regexp$ebnf$2", "symbols": ["regexp$ebnf$2", "regexp_flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "regexp", "symbols": [{"literal":"/"}, "regexp$ebnf$1", {"literal":"/"}, "regexp$ebnf$2"], "postprocess": ([_1, arr, _2, flags]) => ({regexp: arr.join(""), flags: flags.join("")})},
    {"name": "regexp_char", "symbols": [/[^\/]/]},
    {"name": "regexp_char", "symbols": [{"literal":"/"}]},
    {"name": "regexp_flag", "symbols": [{"literal":"i"}]},
    {"name": "regexp_flag", "symbols": [{"literal":"g"}]},
    {"name": "regexp_flag", "symbols": [{"literal":"m"}]},
    {"name": "action$ebnf$1", "symbols": ["statement"]},
    {"name": "action$ebnf$1", "symbols": ["action$ebnf$1", "statement"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "action", "symbols": [{"literal":"{"}, "_", "action$ebnf$1", {"literal":"}"}, "_"], "postprocess": ([_1, _2, statements, _3, _4]) => (statements)},
    {"name": "action", "symbols": [{"literal":"{"}, "_", {"literal":"}"}, "_"], "postprocess": () => []},
    {"name": "statement", "symbols": ["string", "_", {"literal":":"}, "_", "statement_value", "_", {"literal":";"}, "_"], "postprocess": ([key, _1, _2, _3, value, _4]) => ({action: "kv", k: key, v: value})},
    {"name": "statement$string$1", "symbols": [{"literal":"e"}, {"literal":"x"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$1", "_", {"literal":";"}, "_"], "postprocess": () => ({action: "exit"})},
    {"name": "statement$string$2", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$2", "class", "_", {"literal":";"}, "_"], "postprocess": ([_1, cls]) => ({action: 'set_class', v: cls})},
    {"name": "statement$string$3", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$3", "_", "tag", "_", {"literal":";"}, "_"], "postprocess": ([_1, _2, tag]) => ({action: 'set_tag', k: tag})},
    {"name": "statement$string$4", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$4", "_", "tag", "_", {"literal":"="}, "_", "statement_value", "_", {"literal":";"}, "_"], "postprocess": ([_1, _2, tag, _3, _4, _5, value]) => ({action: 'set_tag', k: tag, v: value})},
    {"name": "class$ebnf$1$subexpression$1", "symbols": [{"literal":"!"}, "_"]},
    {"name": "class$ebnf$1", "symbols": ["class$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "class$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "class", "symbols": ["_", "class$ebnf$1", {"literal":"."}, "term"], "postprocess": ([_1, not, _2, cls]) => ({'class': cls, not: not ? !!not : false})},
    {"name": "type$string$1", "symbols": [{"literal":"w"}, {"literal":"a"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$1"], "postprocess": id},
    {"name": "type$string$2", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$2"], "postprocess": id},
    {"name": "type$string$3", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"l"}, {"literal":"a"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$3"], "postprocess": id},
    {"name": "type$string$4", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$4"], "postprocess": id},
    {"name": "type$string$5", "symbols": [{"literal":"l"}, {"literal":"i"}, {"literal":"n"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$5"], "postprocess": id},
    {"name": "type$string$6", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"n"}, {"literal":"v"}, {"literal":"a"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$6"], "postprocess": id},
    {"name": "type", "symbols": [{"literal":"*"}], "postprocess": id},
    {"name": "statement_value", "symbols": ["dqstring"], "postprocess": ([x]) => ({type: 'string', v: x})},
    {"name": "statement_value", "symbols": ["csscolor"], "postprocess": ([x]) => ({type: 'csscolor', v: x})},
    {"name": "statement_value", "symbols": ["eval"], "postprocess": ([x]) => ({type: 'eval', v: x})},
    {"name": "statement_value", "symbols": ["uqstring"], "postprocess": ([x]) => ({type: 'string', v: x})},
    {"name": "import$string$1", "symbols": [{"literal":"@"}, {"literal":"i"}, {"literal":"m"}, {"literal":"p"}, {"literal":"o"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "import$string$2", "symbols": [{"literal":"u"}, {"literal":"r"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "import$ebnf$1$subexpression$1", "symbols": ["_", "term"]},
    {"name": "import$ebnf$1", "symbols": ["import$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "import$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "import", "symbols": ["import$string$1", "_", "import$string$2", "_", {"literal":"("}, "_", "dqstring", "_", {"literal":")"}, "import$ebnf$1", "_", {"literal":";"}], "postprocess": (d) => ({ url: d[6], pseudoclass: d[9] ? d[9][1] : null})},
    {"name": "uqstring$ebnf$1", "symbols": ["spchar"]},
    {"name": "uqstring$ebnf$1", "symbols": ["uqstring$ebnf$1", "spchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "uqstring", "symbols": ["uqstring$ebnf$1"], "postprocess": ([chars]) => chars.join("")},
    {"name": "spchar", "symbols": [/[a-zA-Z0-9\-_:.,\\\/]/]},
    {"name": "mcomment$string$1", "symbols": [{"literal":"/"}, {"literal":"*"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mcomment$ebnf$1", "symbols": []},
    {"name": "mcomment$ebnf$1", "symbols": ["mcomment$ebnf$1", /[^*]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment$ebnf$2", "symbols": []},
    {"name": "mcomment$ebnf$2$subexpression$1$ebnf$1", "symbols": [{"literal":"*"}]},
    {"name": "mcomment$ebnf$2$subexpression$1$ebnf$1", "symbols": ["mcomment$ebnf$2$subexpression$1$ebnf$1", {"literal":"*"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment$ebnf$2$subexpression$1$ebnf$2", "symbols": []},
    {"name": "mcomment$ebnf$2$subexpression$1$ebnf$2", "symbols": ["mcomment$ebnf$2$subexpression$1$ebnf$2", /[^*]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment$ebnf$2$subexpression$1", "symbols": ["mcomment$ebnf$2$subexpression$1$ebnf$1", /[^\/*]/, "mcomment$ebnf$2$subexpression$1$ebnf$2"]},
    {"name": "mcomment$ebnf$2", "symbols": ["mcomment$ebnf$2", "mcomment$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment$ebnf$3", "symbols": []},
    {"name": "mcomment$ebnf$3", "symbols": ["mcomment$ebnf$3", {"literal":"*"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment$string$2", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mcomment", "symbols": ["mcomment$string$1", "mcomment$ebnf$1", "mcomment$ebnf$2", "mcomment$ebnf$3", "mcomment$string$2"], "postprocess": () => null},
    {"name": "mcomment$string$3", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mcomment$ebnf$4", "symbols": []},
    {"name": "mcomment$ebnf$4", "symbols": ["mcomment$ebnf$4", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mcomment", "symbols": ["mcomment$string$3", "mcomment$ebnf$4"], "postprocess": () => null},
    {"name": "wschar", "symbols": ["mcomment"], "postprocess": () => null}
]
  , ParserStart: "css"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

},{}],30:[function(require,module,exports){
'use strict';

const nearley = require("nearley");

const grammar = require("./grammar.js");

function parse(text) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  parser.feed(text.trim());

  if (!parser.results) {
    throw "Unexpected end of file"
  }

  if (parser.results.length != 1) {
    throw "Ambiguous grammar: " + JSON.stringify(parser.results, 2, 2)
  }

  return parser.results[0];
}

const parser = {
  parse: parse
}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
  module.exports = parser;
} else {
  window.MapCSSParser = parser;
}

},{"./grammar.js":29,"nearley":31}],31:[function(require,module,exports){
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        function stringifySymbolSequence (e) {
            return e.literal ? JSON.stringify(e.literal) :
                   e.type ? '%' + e.type : e.toString();
        }
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(stringifySymbolSequence).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var line = buffer.substring(this.lastLineBreak, nextLineBreak)
            var col = this.index - this.lastLineBreak;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += "  " + line + "\n"
            message += "  " + Array(col).join(" ") + "^"
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }
    }


    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (token = lexer.next()) {
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var message = this.lexer.formatError(token, "invalid syntax") + "\n";
                message += "Unexpected " + (token.type ? token.type + " token: " : "");
                message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
                var err = new Error(message);
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJrb3RoaWMtYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jYW52YXMvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jYW52YXMvbGliL3BhcnNlLWZvbnQuanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9xdWlja3NlbGVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYnVzaC9pbmRleC5qcyIsInNyYy9rb3RoaWMuanMiLCJzcmMvcmVuZGVyZXIvY3VydmVkdGV4dC5qcyIsInNyYy9yZW5kZXJlci9pY29uLmpzIiwic3JjL3JlbmRlcmVyL2xpbmUuanMiLCJzcmMvcmVuZGVyZXIvcGF0aC5qcyIsInNyYy9yZW5kZXJlci9wb2x5Z29uLmpzIiwic3JjL3JlbmRlcmVyL3JlbmRlcmVyLmpzIiwic3JjL3JlbmRlcmVyL3NoaWVsZC5qcyIsInNyYy9yZW5kZXJlci90ZXh0LmpzIiwic3JjL3N0eWxlL2V2YWwuanMiLCJzcmMvc3R5bGUvZ2FsbGVyeS5qcyIsInNyYy9zdHlsZS9tYXBjc3MuanMiLCJzcmMvc3R5bGUvbWF0Y2hlcnMuanMiLCJzcmMvc3R5bGUvcnVsZXMuanMiLCJzcmMvc3R5bGUvc3R5bGUtbWFuYWdlci5qcyIsInNyYy9zdHlsZS9zdXBwb3J0cy5qcyIsInNyYy91dGlscy9jb2xsaXNpb25zLmpzIiwic3JjL3V0aWxzL2NvbG9ycy5qcyIsInNyYy91dGlscy9mbG93LmpzIiwic3JjL3V0aWxzL2dlb20uanMiLCJzcmMvdXRpbHMvc3R5bGUuanMiLCIuLi9tYXBjc3MtanMvbGliL2dyYW1tYXIuanMiLCIuLi9tYXBjc3MtanMvbGliL21hcGNzcy1wYXJzZXIuanMiLCIuLi9tYXBjc3MtanMvbm9kZV9tb2R1bGVzL25lYXJsZXkvbGliL25lYXJsZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vVE9ETzogRXh0cmFjdCBrb3RoaWMtbGVhZmxldCB0byBhbm90aGVyIHByb2plY3RcbndpbmRvdy5Lb3RoaWMgPSByZXF1aXJlKFwiLi9zcmMva290aGljXCIpO1xud2luZG93Lk1hcENTUyA9IHJlcXVpcmUoXCIuL3NyYy9zdHlsZS9tYXBjc3NcIik7XG5cbndpbmRvdy5Lb3RoaWMubG9hZEpTT04gPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjYWxsYmFjayhKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcih1cmwsIGVycik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJmYWlsZWQ6XCIsIHVybCwgeGhyLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gIHhoci5zZW5kKG51bGwpO1xufVxuIiwiLyogZ2xvYmFscyBkb2N1bWVudCwgSW1hZ2VEYXRhICovXG5cbmNvbnN0IHBhcnNlRm9udCA9IHJlcXVpcmUoJy4vbGliL3BhcnNlLWZvbnQnKVxuXG5leHBvcnRzLnBhcnNlRm9udCA9IHBhcnNlRm9udFxuXG5leHBvcnRzLmNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLCB7IHdpZHRoLCBoZWlnaHQgfSlcbn1cblxuZXhwb3J0cy5jcmVhdGVJbWFnZURhdGEgPSBmdW5jdGlvbiAoYXJyYXksIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gQnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBJbWFnZURhdGEgbG9va3MgYXQgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIG5ldyBJbWFnZURhdGEoKVxuICAgIGNhc2UgMTogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXkpXG4gICAgY2FzZSAyOiByZXR1cm4gbmV3IEltYWdlRGF0YShhcnJheSwgd2lkdGgpXG4gICAgZGVmYXVsdDogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXksIHdpZHRoLCBoZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0cy5sb2FkSW1hZ2UgPSBmdW5jdGlvbiAoc3JjKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cCAoKSB7XG4gICAgICBpbWFnZS5vbmxvYWQgPSBudWxsXG4gICAgICBpbWFnZS5vbmVycm9yID0gbnVsbFxuICAgIH1cblxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHsgY2xlYW51cCgpOyByZXNvbHZlKGltYWdlKSB9XG4gICAgaW1hZ2Uub25lcnJvciA9ICgpID0+IHsgY2xlYW51cCgpOyByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCB0aGUgaW1hZ2UgXCIke3NyY31cImApKSB9XG5cbiAgICBpbWFnZS5zcmMgPSBzcmNcbiAgfSlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEZvbnQgUmVnRXhwIGhlbHBlcnMuXG4gKi9cblxuY29uc3Qgd2VpZ2h0cyA9ICdib2xkfGJvbGRlcnxsaWdodGVyfFsxLTldMDAnXG4gICwgc3R5bGVzID0gJ2l0YWxpY3xvYmxpcXVlJ1xuICAsIHZhcmlhbnRzID0gJ3NtYWxsLWNhcHMnXG4gICwgc3RyZXRjaGVzID0gJ3VsdHJhLWNvbmRlbnNlZHxleHRyYS1jb25kZW5zZWR8Y29uZGVuc2VkfHNlbWktY29uZGVuc2VkfHNlbWktZXhwYW5kZWR8ZXhwYW5kZWR8ZXh0cmEtZXhwYW5kZWR8dWx0cmEtZXhwYW5kZWQnXG4gICwgdW5pdHMgPSAncHh8cHR8cGN8aW58Y218bW18JXxlbXxleHxjaHxyZW18cSdcbiAgLCBzdHJpbmcgPSAnXFwnKFteXFwnXSspXFwnfFwiKFteXCJdKylcInxbXFxcXHdcXFxccy1dKydcblxuLy8gWyBbIDzigJhmb250LXN0eWxl4oCZPiB8fCA8Zm9udC12YXJpYW50LWNzczIxPiB8fCA84oCYZm9udC13ZWlnaHTigJk+IHx8IDzigJhmb250LXN0cmV0Y2jigJk+IF0/XG4vLyAgICA84oCYZm9udC1zaXpl4oCZPiBbIC8gPOKAmGxpbmUtaGVpZ2h04oCZPiBdPyA84oCYZm9udC1mYW1pbHnigJk+IF1cbi8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtZm9udHMtMy8jZm9udC1wcm9wXG5jb25zdCB3ZWlnaHRSZSA9IG5ldyBSZWdFeHAoYCgke3dlaWdodHN9KSArYCwgJ2knKVxuY29uc3Qgc3R5bGVSZSA9IG5ldyBSZWdFeHAoYCgke3N0eWxlc30pICtgLCAnaScpXG5jb25zdCB2YXJpYW50UmUgPSBuZXcgUmVnRXhwKGAoJHt2YXJpYW50c30pICtgLCAnaScpXG5jb25zdCBzdHJldGNoUmUgPSBuZXcgUmVnRXhwKGAoJHtzdHJldGNoZXN9KSArYCwgJ2knKVxuY29uc3Qgc2l6ZUZhbWlseVJlID0gbmV3IFJlZ0V4cChcbiAgJyhbXFxcXGRcXFxcLl0rKSgnICsgdW5pdHMgKyAnKSAqJ1xuICArICcoKD86JyArIHN0cmluZyArICcpKCAqLCAqKD86JyArIHN0cmluZyArICcpKSopJylcblxuLyoqXG4gKiBDYWNoZSBmb250IHBhcnNpbmcuXG4gKi9cblxuY29uc3QgY2FjaGUgPSB7fVxuXG5jb25zdCBkZWZhdWx0SGVpZ2h0ID0gMTYgLy8gcHQsIGNvbW1vbiBicm93c2VyIGRlZmF1bHRcblxuLyoqXG4gKiBQYXJzZSBmb250IGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH0gUGFyc2VkIGZvbnQuIGBzaXplYCBpcyBpbiBkZXZpY2UgdW5pdHMuIGB1bml0YCBpcyB0aGUgdW5pdFxuICogICBhcHBlYXJpbmcgaW4gdGhlIGlucHV0IHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuICAvLyBDYWNoZWRcbiAgaWYgKGNhY2hlW3N0cl0pIHJldHVybiBjYWNoZVtzdHJdXG5cbiAgLy8gVHJ5IGZvciByZXF1aXJlZCBwcm9wZXJ0aWVzIGZpcnN0LlxuICBjb25zdCBzaXplRmFtaWx5ID0gc2l6ZUZhbWlseVJlLmV4ZWMoc3RyKVxuICBpZiAoIXNpemVGYW1pbHkpIHJldHVybiAvLyBpbnZhbGlkXG5cbiAgLy8gRGVmYXVsdCB2YWx1ZXMgYW5kIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgY29uc3QgZm9udCA9IHtcbiAgICB3ZWlnaHQ6ICdub3JtYWwnLFxuICAgIHN0eWxlOiAnbm9ybWFsJyxcbiAgICBzdHJldGNoOiAnbm9ybWFsJyxcbiAgICB2YXJpYW50OiAnbm9ybWFsJyxcbiAgICBzaXplOiBwYXJzZUZsb2F0KHNpemVGYW1pbHlbMV0pLFxuICAgIHVuaXQ6IHNpemVGYW1pbHlbMl0sXG4gICAgZmFtaWx5OiBzaXplRmFtaWx5WzNdLnJlcGxhY2UoL1tcIiddL2csICcnKS5yZXBsYWNlKC8gKiwgKi9nLCAnLCcpXG4gIH1cblxuICAvLyBPcHRpb25hbCwgdW5vcmRlcmVkIHByb3BlcnRpZXMuXG4gIGxldCB3ZWlnaHQsIHN0eWxlLCB2YXJpYW50LCBzdHJldGNoXG4gIC8vIFN0b3Agc2VhcmNoIGF0IGBzaXplRmFtaWx5LmluZGV4YFxuICBsZXQgc3Vic3RyID0gc3RyLnN1YnN0cmluZygwLCBzaXplRmFtaWx5LmluZGV4KVxuICBpZiAoKHdlaWdodCA9IHdlaWdodFJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQud2VpZ2h0ID0gd2VpZ2h0WzFdXG4gIGlmICgoc3R5bGUgPSBzdHlsZVJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQuc3R5bGUgPSBzdHlsZVsxXVxuICBpZiAoKHZhcmlhbnQgPSB2YXJpYW50UmUuZXhlYyhzdWJzdHIpKSkgZm9udC52YXJpYW50ID0gdmFyaWFudFsxXVxuICBpZiAoKHN0cmV0Y2ggPSBzdHJldGNoUmUuZXhlYyhzdWJzdHIpKSkgZm9udC5zdHJldGNoID0gc3RyZXRjaFsxXVxuXG4gIC8vIENvbnZlcnQgdG8gZGV2aWNlIHVuaXRzLiAoYGZvbnQudW5pdGAgaXMgdGhlIG9yaWdpbmFsIHVuaXQpXG4gIC8vIFRPRE86IGNoLCBleFxuICBzd2l0Y2ggKGZvbnQudW5pdCkge1xuICAgIGNhc2UgJ3B0JzpcbiAgICAgIGZvbnQuc2l6ZSAvPSAwLjc1XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3BjJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSAxNlxuICAgICAgYnJlYWtcbiAgICBjYXNlICdpbic6XG4gICAgICBmb250LnNpemUgKj0gOTZcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnY20nOlxuICAgICAgZm9udC5zaXplICo9IDk2LjAgLyAyLjU0XG4gICAgICBicmVha1xuICAgIGNhc2UgJ21tJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5Ni4wIC8gMjUuNFxuICAgICAgYnJlYWtcbiAgICBjYXNlICclJzpcbiAgICAgIC8vIFRPRE8gZGlzYWJsZWQgYmVjYXVzZSBleGlzdGluZyB1bml0IHRlc3RzIGFzc3VtZSAxMDBcbiAgICAgIC8vIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMTAwIC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlbSc6XG4gICAgY2FzZSAncmVtJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdxJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5NiAvIDI1LjQgLyA0XG4gICAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIChjYWNoZVtzdHJdID0gZm9udClcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJ0aWFsU29ydDtcblxuLy8gRmxveWQtUml2ZXN0IHNlbGVjdGlvbiBhbGdvcml0aG06XG4vLyBSZWFycmFuZ2UgaXRlbXMgc28gdGhhdCBhbGwgaXRlbXMgaW4gdGhlIFtsZWZ0LCBrXSByYW5nZSBhcmUgc21hbGxlciB0aGFuIGFsbCBpdGVtcyBpbiAoaywgcmlnaHRdO1xuLy8gVGhlIGstdGggZWxlbWVudCB3aWxsIGhhdmUgdGhlIChrIC0gbGVmdCArIDEpdGggc21hbGxlc3QgdmFsdWUgaW4gW2xlZnQsIHJpZ2h0XVxuXG5mdW5jdGlvbiBwYXJ0aWFsU29ydChhcnIsIGssIGxlZnQsIHJpZ2h0LCBjb21wYXJlKSB7XG4gICAgbGVmdCA9IGxlZnQgfHwgMDtcbiAgICByaWdodCA9IHJpZ2h0IHx8IChhcnIubGVuZ3RoIC0gMSk7XG4gICAgY29tcGFyZSA9IGNvbXBhcmUgfHwgZGVmYXVsdENvbXBhcmU7XG5cbiAgICB3aGlsZSAocmlnaHQgPiBsZWZ0KSB7XG4gICAgICAgIGlmIChyaWdodCAtIGxlZnQgPiA2MDApIHtcbiAgICAgICAgICAgIHZhciBuID0gcmlnaHQgLSBsZWZ0ICsgMTtcbiAgICAgICAgICAgIHZhciBtID0gayAtIGxlZnQgKyAxO1xuICAgICAgICAgICAgdmFyIHogPSBNYXRoLmxvZyhuKTtcbiAgICAgICAgICAgIHZhciBzID0gMC41ICogTWF0aC5leHAoMiAqIHogLyAzKTtcbiAgICAgICAgICAgIHZhciBzZCA9IDAuNSAqIE1hdGguc3FydCh6ICogcyAqIChuIC0gcykgLyBuKSAqIChtIC0gbiAvIDIgPCAwID8gLTEgOiAxKTtcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gTWF0aC5tYXgobGVmdCwgTWF0aC5mbG9vcihrIC0gbSAqIHMgLyBuICsgc2QpKTtcbiAgICAgICAgICAgIHZhciBuZXdSaWdodCA9IE1hdGgubWluKHJpZ2h0LCBNYXRoLmZsb29yKGsgKyAobiAtIG0pICogcyAvIG4gKyBzZCkpO1xuICAgICAgICAgICAgcGFydGlhbFNvcnQoYXJyLCBrLCBuZXdMZWZ0LCBuZXdSaWdodCwgY29tcGFyZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdCA9IGFycltrXTtcbiAgICAgICAgdmFyIGkgPSBsZWZ0O1xuICAgICAgICB2YXIgaiA9IHJpZ2h0O1xuXG4gICAgICAgIHN3YXAoYXJyLCBsZWZ0LCBrKTtcbiAgICAgICAgaWYgKGNvbXBhcmUoYXJyW3JpZ2h0XSwgdCkgPiAwKSBzd2FwKGFyciwgbGVmdCwgcmlnaHQpO1xuXG4gICAgICAgIHdoaWxlIChpIDwgaikge1xuICAgICAgICAgICAgc3dhcChhcnIsIGksIGopO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgd2hpbGUgKGNvbXBhcmUoYXJyW2ldLCB0KSA8IDApIGkrKztcbiAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKGFycltqXSwgdCkgPiAwKSBqLS07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcGFyZShhcnJbbGVmdF0sIHQpID09PSAwKSBzd2FwKGFyciwgbGVmdCwgaik7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgc3dhcChhcnIsIGosIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChqIDw9IGspIGxlZnQgPSBqICsgMTtcbiAgICAgICAgaWYgKGsgPD0gaikgcmlnaHQgPSBqIC0gMTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN3YXAoYXJyLCBpLCBqKSB7XG4gICAgdmFyIHRtcCA9IGFycltpXTtcbiAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgYXJyW2pdID0gdG1wO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJidXNoO1xuXG52YXIgcXVpY2tzZWxlY3QgPSByZXF1aXJlKCdxdWlja3NlbGVjdCcpO1xuXG5mdW5jdGlvbiByYnVzaChtYXhFbnRyaWVzLCBmb3JtYXQpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgcmJ1c2gpKSByZXR1cm4gbmV3IHJidXNoKG1heEVudHJpZXMsIGZvcm1hdCk7XG5cbiAgICAvLyBtYXggZW50cmllcyBpbiBhIG5vZGUgaXMgOSBieSBkZWZhdWx0OyBtaW4gbm9kZSBmaWxsIGlzIDQwJSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoaXMuX21heEVudHJpZXMgPSBNYXRoLm1heCg0LCBtYXhFbnRyaWVzIHx8IDkpO1xuICAgIHRoaXMuX21pbkVudHJpZXMgPSBNYXRoLm1heCgyLCBNYXRoLmNlaWwodGhpcy5fbWF4RW50cmllcyAqIDAuNCkpO1xuXG4gICAgaWYgKGZvcm1hdCkge1xuICAgICAgICB0aGlzLl9pbml0Rm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xufVxuXG5yYnVzaC5wcm90b3R5cGUgPSB7XG5cbiAgICBhbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbCh0aGlzLmRhdGEsIFtdKTtcbiAgICB9LFxuXG4gICAgc2VhcmNoOiBmdW5jdGlvbiAoYmJveCkge1xuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICB0b0JCb3ggPSB0aGlzLnRvQkJveDtcblxuICAgICAgICBpZiAoIWludGVyc2VjdHMoYmJveCwgbm9kZSkpIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgdmFyIG5vZGVzVG9TZWFyY2ggPSBbXSxcbiAgICAgICAgICAgIGksIGxlbiwgY2hpbGQsIGNoaWxkQkJveDtcblxuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkQkJveCA9IG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZDtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKGJib3gsIGNoaWxkQkJveCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubGVhZikgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjb250YWlucyhiYm94LCBjaGlsZEJCb3gpKSB0aGlzLl9hbGwoY2hpbGQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Ugbm9kZXNUb1NlYXJjaC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZXNUb1NlYXJjaC5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGNvbGxpZGVzOiBmdW5jdGlvbiAoYmJveCkge1xuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgdG9CQm94ID0gdGhpcy50b0JCb3g7XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKGJib3gsIG5vZGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIG5vZGVzVG9TZWFyY2ggPSBbXSxcbiAgICAgICAgICAgIGksIGxlbiwgY2hpbGQsIGNoaWxkQkJveDtcblxuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkQkJveCA9IG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZDtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKGJib3gsIGNoaWxkQkJveCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubGVhZiB8fCBjb250YWlucyhiYm94LCBjaGlsZEJCb3gpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNUb1NlYXJjaC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZXNUb1NlYXJjaC5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbG9hZDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCEoZGF0YSAmJiBkYXRhLmxlbmd0aCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA8IHRoaXMuX21pbkVudHJpZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnQoZGF0YVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGJ1aWxkIHRoZSB0cmVlIHdpdGggdGhlIGdpdmVuIGRhdGEgZnJvbSBzdHJhdGNoIHVzaW5nIE9NVCBhbGdvcml0aG1cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9idWlsZChkYXRhLnNsaWNlKCksIDAsIGRhdGEubGVuZ3RoIC0gMSwgMCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGEuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzYXZlIGFzIGlzIGlmIHRyZWUgaXMgZW1wdHlcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5vZGU7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuaGVpZ2h0ID09PSBub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgLy8gc3BsaXQgcm9vdCBpZiB0cmVlcyBoYXZlIHRoZSBzYW1lIGhlaWdodFxuICAgICAgICAgICAgdGhpcy5fc3BsaXRSb290KHRoaXMuZGF0YSwgbm9kZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaGVpZ2h0IDwgbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAvLyBzd2FwIHRyZWVzIGlmIGluc2VydGVkIG9uZSBpcyBiaWdnZXJcbiAgICAgICAgICAgICAgICB2YXIgdG1wTm9kZSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBub2RlO1xuICAgICAgICAgICAgICAgIG5vZGUgPSB0bXBOb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnNlcnQgdGhlIHNtYWxsIHRyZWUgaW50byB0aGUgbGFyZ2UgdHJlZSBhdCBhcHByb3ByaWF0ZSBsZXZlbFxuICAgICAgICAgICAgdGhpcy5faW5zZXJ0KG5vZGUsIHRoaXMuZGF0YS5oZWlnaHQgLSBub2RlLmhlaWdodCAtIDEsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGluc2VydDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0pIHRoaXMuX2luc2VydChpdGVtLCB0aGlzLmRhdGEuaGVpZ2h0IC0gMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBjcmVhdGVOb2RlKFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24gKGl0ZW0sIGVxdWFsc0ZuKSB7XG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBiYm94ID0gdGhpcy50b0JCb3goaXRlbSksXG4gICAgICAgICAgICBwYXRoID0gW10sXG4gICAgICAgICAgICBpbmRleGVzID0gW10sXG4gICAgICAgICAgICBpLCBwYXJlbnQsIGluZGV4LCBnb2luZ1VwO1xuXG4gICAgICAgIC8vIGRlcHRoLWZpcnN0IGl0ZXJhdGl2ZSB0cmVlIHRyYXZlcnNhbFxuICAgICAgICB3aGlsZSAobm9kZSB8fCBwYXRoLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHsgLy8gZ28gdXBcbiAgICAgICAgICAgICAgICBub2RlID0gcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaSA9IGluZGV4ZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgZ29pbmdVcCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLmxlYWYpIHsgLy8gY2hlY2sgY3VycmVudCBub2RlXG4gICAgICAgICAgICAgICAgaW5kZXggPSBmaW5kSXRlbShpdGVtLCBub2RlLmNoaWxkcmVuLCBlcXVhbHNGbik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZW0gZm91bmQsIHJlbW92ZSB0aGUgaXRlbSBhbmQgY29uZGVuc2UgdHJlZSB1cHdhcmRzXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25kZW5zZShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdvaW5nVXAgJiYgIW5vZGUubGVhZiAmJiBjb250YWlucyhub2RlLCBiYm94KSkgeyAvLyBnbyBkb3duXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBub2RlO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudCkgeyAvLyBnbyByaWdodFxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBub2RlID0gcGFyZW50LmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGdvaW5nVXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgfSBlbHNlIG5vZGUgPSBudWxsOyAvLyBub3RoaW5nIGZvdW5kXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgdG9CQm94OiBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbTsgfSxcblxuICAgIGNvbXBhcmVNaW5YOiBjb21wYXJlTm9kZU1pblgsXG4gICAgY29tcGFyZU1pblk6IGNvbXBhcmVOb2RlTWluWSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5kYXRhOyB9LFxuXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfYWxsOiBmdW5jdGlvbiAobm9kZSwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBub2Rlc1RvU2VhcmNoID0gW107XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5sZWFmKSByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZWxzZSBub2Rlc1RvU2VhcmNoLnB1c2guYXBwbHkobm9kZXNUb1NlYXJjaCwgbm9kZS5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIG5vZGUgPSBub2Rlc1RvU2VhcmNoLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIF9idWlsZDogZnVuY3Rpb24gKGl0ZW1zLCBsZWZ0LCByaWdodCwgaGVpZ2h0KSB7XG5cbiAgICAgICAgdmFyIE4gPSByaWdodCAtIGxlZnQgKyAxLFxuICAgICAgICAgICAgTSA9IHRoaXMuX21heEVudHJpZXMsXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIGlmIChOIDw9IE0pIHtcbiAgICAgICAgICAgIC8vIHJlYWNoZWQgbGVhZiBsZXZlbDsgcmV0dXJuIGxlYWZcbiAgICAgICAgICAgIG5vZGUgPSBjcmVhdGVOb2RlKGl0ZW1zLnNsaWNlKGxlZnQsIHJpZ2h0ICsgMSkpO1xuICAgICAgICAgICAgY2FsY0JCb3gobm9kZSwgdGhpcy50b0JCb3gpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhlaWdodCkge1xuICAgICAgICAgICAgLy8gdGFyZ2V0IGhlaWdodCBvZiB0aGUgYnVsay1sb2FkZWQgdHJlZVxuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5jZWlsKE1hdGgubG9nKE4pIC8gTWF0aC5sb2coTSkpO1xuXG4gICAgICAgICAgICAvLyB0YXJnZXQgbnVtYmVyIG9mIHJvb3QgZW50cmllcyB0byBtYXhpbWl6ZSBzdG9yYWdlIHV0aWxpemF0aW9uXG4gICAgICAgICAgICBNID0gTWF0aC5jZWlsKE4gLyBNYXRoLnBvdyhNLCBoZWlnaHQgLSAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlID0gY3JlYXRlTm9kZShbXSk7XG4gICAgICAgIG5vZGUubGVhZiA9IGZhbHNlO1xuICAgICAgICBub2RlLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvLyBzcGxpdCB0aGUgaXRlbXMgaW50byBNIG1vc3RseSBzcXVhcmUgdGlsZXNcblxuICAgICAgICB2YXIgTjIgPSBNYXRoLmNlaWwoTiAvIE0pLFxuICAgICAgICAgICAgTjEgPSBOMiAqIE1hdGguY2VpbChNYXRoLnNxcnQoTSkpLFxuICAgICAgICAgICAgaSwgaiwgcmlnaHQyLCByaWdodDM7XG5cbiAgICAgICAgbXVsdGlTZWxlY3QoaXRlbXMsIGxlZnQsIHJpZ2h0LCBOMSwgdGhpcy5jb21wYXJlTWluWCk7XG5cbiAgICAgICAgZm9yIChpID0gbGVmdDsgaSA8PSByaWdodDsgaSArPSBOMSkge1xuXG4gICAgICAgICAgICByaWdodDIgPSBNYXRoLm1pbihpICsgTjEgLSAxLCByaWdodCk7XG5cbiAgICAgICAgICAgIG11bHRpU2VsZWN0KGl0ZW1zLCBpLCByaWdodDIsIE4yLCB0aGlzLmNvbXBhcmVNaW5ZKTtcblxuICAgICAgICAgICAgZm9yIChqID0gaTsgaiA8PSByaWdodDI7IGogKz0gTjIpIHtcblxuICAgICAgICAgICAgICAgIHJpZ2h0MyA9IE1hdGgubWluKGogKyBOMiAtIDEsIHJpZ2h0Mik7XG5cbiAgICAgICAgICAgICAgICAvLyBwYWNrIGVhY2ggZW50cnkgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuLnB1c2godGhpcy5fYnVpbGQoaXRlbXMsIGosIHJpZ2h0MywgaGVpZ2h0IC0gMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsY0JCb3gobm9kZSwgdGhpcy50b0JCb3gpO1xuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICBfY2hvb3NlU3VidHJlZTogZnVuY3Rpb24gKGJib3gsIG5vZGUsIGxldmVsLCBwYXRoKSB7XG5cbiAgICAgICAgdmFyIGksIGxlbiwgY2hpbGQsIHRhcmdldE5vZGUsIGFyZWEsIGVubGFyZ2VtZW50LCBtaW5BcmVhLCBtaW5FbmxhcmdlbWVudDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuXG4gICAgICAgICAgICBpZiAobm9kZS5sZWFmIHx8IHBhdGgubGVuZ3RoIC0gMSA9PT0gbGV2ZWwpIGJyZWFrO1xuXG4gICAgICAgICAgICBtaW5BcmVhID0gbWluRW5sYXJnZW1lbnQgPSBJbmZpbml0eTtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBhcmVhID0gYmJveEFyZWEoY2hpbGQpO1xuICAgICAgICAgICAgICAgIGVubGFyZ2VtZW50ID0gZW5sYXJnZWRBcmVhKGJib3gsIGNoaWxkKSAtIGFyZWE7XG5cbiAgICAgICAgICAgICAgICAvLyBjaG9vc2UgZW50cnkgd2l0aCB0aGUgbGVhc3QgYXJlYSBlbmxhcmdlbWVudFxuICAgICAgICAgICAgICAgIGlmIChlbmxhcmdlbWVudCA8IG1pbkVubGFyZ2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbkVubGFyZ2VtZW50ID0gZW5sYXJnZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIG1pbkFyZWEgPSBhcmVhIDwgbWluQXJlYSA/IGFyZWEgOiBtaW5BcmVhO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gY2hpbGQ7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVubGFyZ2VtZW50ID09PSBtaW5FbmxhcmdlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgY2hvb3NlIG9uZSB3aXRoIHRoZSBzbWFsbGVzdCBhcmVhXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmVhIDwgbWluQXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluQXJlYSA9IGFyZWE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gY2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5vZGUgPSB0YXJnZXROb2RlIHx8IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuXG4gICAgX2luc2VydDogZnVuY3Rpb24gKGl0ZW0sIGxldmVsLCBpc05vZGUpIHtcblxuICAgICAgICB2YXIgdG9CQm94ID0gdGhpcy50b0JCb3gsXG4gICAgICAgICAgICBiYm94ID0gaXNOb2RlID8gaXRlbSA6IHRvQkJveChpdGVtKSxcbiAgICAgICAgICAgIGluc2VydFBhdGggPSBbXTtcblxuICAgICAgICAvLyBmaW5kIHRoZSBiZXN0IG5vZGUgZm9yIGFjY29tbW9kYXRpbmcgdGhlIGl0ZW0sIHNhdmluZyBhbGwgbm9kZXMgYWxvbmcgdGhlIHBhdGggdG9vXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fY2hvb3NlU3VidHJlZShiYm94LCB0aGlzLmRhdGEsIGxldmVsLCBpbnNlcnRQYXRoKTtcblxuICAgICAgICAvLyBwdXQgdGhlIGl0ZW0gaW50byB0aGUgbm9kZVxuICAgICAgICBub2RlLmNoaWxkcmVuLnB1c2goaXRlbSk7XG4gICAgICAgIGV4dGVuZChub2RlLCBiYm94KTtcblxuICAgICAgICAvLyBzcGxpdCBvbiBub2RlIG92ZXJmbG93OyBwcm9wYWdhdGUgdXB3YXJkcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgd2hpbGUgKGxldmVsID49IDApIHtcbiAgICAgICAgICAgIGlmIChpbnNlcnRQYXRoW2xldmVsXS5jaGlsZHJlbi5sZW5ndGggPiB0aGlzLl9tYXhFbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXQoaW5zZXJ0UGF0aCwgbGV2ZWwpO1xuICAgICAgICAgICAgICAgIGxldmVsLS07XG4gICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGp1c3QgYmJveGVzIGFsb25nIHRoZSBpbnNlcnRpb24gcGF0aFxuICAgICAgICB0aGlzLl9hZGp1c3RQYXJlbnRCQm94ZXMoYmJveCwgaW5zZXJ0UGF0aCwgbGV2ZWwpO1xuICAgIH0sXG5cbiAgICAvLyBzcGxpdCBvdmVyZmxvd2VkIG5vZGUgaW50byB0d29cbiAgICBfc3BsaXQ6IGZ1bmN0aW9uIChpbnNlcnRQYXRoLCBsZXZlbCkge1xuXG4gICAgICAgIHZhciBub2RlID0gaW5zZXJ0UGF0aFtsZXZlbF0sXG4gICAgICAgICAgICBNID0gbm9kZS5jaGlsZHJlbi5sZW5ndGgsXG4gICAgICAgICAgICBtID0gdGhpcy5fbWluRW50cmllcztcblxuICAgICAgICB0aGlzLl9jaG9vc2VTcGxpdEF4aXMobm9kZSwgbSwgTSk7XG5cbiAgICAgICAgdmFyIHNwbGl0SW5kZXggPSB0aGlzLl9jaG9vc2VTcGxpdEluZGV4KG5vZGUsIG0sIE0pO1xuXG4gICAgICAgIHZhciBuZXdOb2RlID0gY3JlYXRlTm9kZShub2RlLmNoaWxkcmVuLnNwbGljZShzcGxpdEluZGV4LCBub2RlLmNoaWxkcmVuLmxlbmd0aCAtIHNwbGl0SW5kZXgpKTtcbiAgICAgICAgbmV3Tm9kZS5oZWlnaHQgPSBub2RlLmhlaWdodDtcbiAgICAgICAgbmV3Tm9kZS5sZWFmID0gbm9kZS5sZWFmO1xuXG4gICAgICAgIGNhbGNCQm94KG5vZGUsIHRoaXMudG9CQm94KTtcbiAgICAgICAgY2FsY0JCb3gobmV3Tm9kZSwgdGhpcy50b0JCb3gpO1xuXG4gICAgICAgIGlmIChsZXZlbCkgaW5zZXJ0UGF0aFtsZXZlbCAtIDFdLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSk7XG4gICAgICAgIGVsc2UgdGhpcy5fc3BsaXRSb290KG5vZGUsIG5ld05vZGUpO1xuICAgIH0sXG5cbiAgICBfc3BsaXRSb290OiBmdW5jdGlvbiAobm9kZSwgbmV3Tm9kZSkge1xuICAgICAgICAvLyBzcGxpdCByb290IG5vZGVcbiAgICAgICAgdGhpcy5kYXRhID0gY3JlYXRlTm9kZShbbm9kZSwgbmV3Tm9kZV0pO1xuICAgICAgICB0aGlzLmRhdGEuaGVpZ2h0ID0gbm9kZS5oZWlnaHQgKyAxO1xuICAgICAgICB0aGlzLmRhdGEubGVhZiA9IGZhbHNlO1xuICAgICAgICBjYWxjQkJveCh0aGlzLmRhdGEsIHRoaXMudG9CQm94KTtcbiAgICB9LFxuXG4gICAgX2Nob29zZVNwbGl0SW5kZXg6IGZ1bmN0aW9uIChub2RlLCBtLCBNKSB7XG5cbiAgICAgICAgdmFyIGksIGJib3gxLCBiYm94Miwgb3ZlcmxhcCwgYXJlYSwgbWluT3ZlcmxhcCwgbWluQXJlYSwgaW5kZXg7XG5cbiAgICAgICAgbWluT3ZlcmxhcCA9IG1pbkFyZWEgPSBJbmZpbml0eTtcblxuICAgICAgICBmb3IgKGkgPSBtOyBpIDw9IE0gLSBtOyBpKyspIHtcbiAgICAgICAgICAgIGJib3gxID0gZGlzdEJCb3gobm9kZSwgMCwgaSwgdGhpcy50b0JCb3gpO1xuICAgICAgICAgICAgYmJveDIgPSBkaXN0QkJveChub2RlLCBpLCBNLCB0aGlzLnRvQkJveCk7XG5cbiAgICAgICAgICAgIG92ZXJsYXAgPSBpbnRlcnNlY3Rpb25BcmVhKGJib3gxLCBiYm94Mik7XG4gICAgICAgICAgICBhcmVhID0gYmJveEFyZWEoYmJveDEpICsgYmJveEFyZWEoYmJveDIpO1xuXG4gICAgICAgICAgICAvLyBjaG9vc2UgZGlzdHJpYnV0aW9uIHdpdGggbWluaW11bSBvdmVybGFwXG4gICAgICAgICAgICBpZiAob3ZlcmxhcCA8IG1pbk92ZXJsYXApIHtcbiAgICAgICAgICAgICAgICBtaW5PdmVybGFwID0gb3ZlcmxhcDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cbiAgICAgICAgICAgICAgICBtaW5BcmVhID0gYXJlYSA8IG1pbkFyZWEgPyBhcmVhIDogbWluQXJlYTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVybGFwID09PSBtaW5PdmVybGFwKSB7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGNob29zZSBkaXN0cmlidXRpb24gd2l0aCBtaW5pbXVtIGFyZWFcbiAgICAgICAgICAgICAgICBpZiAoYXJlYSA8IG1pbkFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluQXJlYSA9IGFyZWE7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIC8vIHNvcnRzIG5vZGUgY2hpbGRyZW4gYnkgdGhlIGJlc3QgYXhpcyBmb3Igc3BsaXRcbiAgICBfY2hvb3NlU3BsaXRBeGlzOiBmdW5jdGlvbiAobm9kZSwgbSwgTSkge1xuXG4gICAgICAgIHZhciBjb21wYXJlTWluWCA9IG5vZGUubGVhZiA/IHRoaXMuY29tcGFyZU1pblggOiBjb21wYXJlTm9kZU1pblgsXG4gICAgICAgICAgICBjb21wYXJlTWluWSA9IG5vZGUubGVhZiA/IHRoaXMuY29tcGFyZU1pblkgOiBjb21wYXJlTm9kZU1pblksXG4gICAgICAgICAgICB4TWFyZ2luID0gdGhpcy5fYWxsRGlzdE1hcmdpbihub2RlLCBtLCBNLCBjb21wYXJlTWluWCksXG4gICAgICAgICAgICB5TWFyZ2luID0gdGhpcy5fYWxsRGlzdE1hcmdpbihub2RlLCBtLCBNLCBjb21wYXJlTWluWSk7XG5cbiAgICAgICAgLy8gaWYgdG90YWwgZGlzdHJpYnV0aW9ucyBtYXJnaW4gdmFsdWUgaXMgbWluaW1hbCBmb3IgeCwgc29ydCBieSBtaW5YLFxuICAgICAgICAvLyBvdGhlcndpc2UgaXQncyBhbHJlYWR5IHNvcnRlZCBieSBtaW5ZXG4gICAgICAgIGlmICh4TWFyZ2luIDwgeU1hcmdpbikgbm9kZS5jaGlsZHJlbi5zb3J0KGNvbXBhcmVNaW5YKTtcbiAgICB9LFxuXG4gICAgLy8gdG90YWwgbWFyZ2luIG9mIGFsbCBwb3NzaWJsZSBzcGxpdCBkaXN0cmlidXRpb25zIHdoZXJlIGVhY2ggbm9kZSBpcyBhdCBsZWFzdCBtIGZ1bGxcbiAgICBfYWxsRGlzdE1hcmdpbjogZnVuY3Rpb24gKG5vZGUsIG0sIE0sIGNvbXBhcmUpIHtcblxuICAgICAgICBub2RlLmNoaWxkcmVuLnNvcnQoY29tcGFyZSk7XG5cbiAgICAgICAgdmFyIHRvQkJveCA9IHRoaXMudG9CQm94LFxuICAgICAgICAgICAgbGVmdEJCb3ggPSBkaXN0QkJveChub2RlLCAwLCBtLCB0b0JCb3gpLFxuICAgICAgICAgICAgcmlnaHRCQm94ID0gZGlzdEJCb3gobm9kZSwgTSAtIG0sIE0sIHRvQkJveCksXG4gICAgICAgICAgICBtYXJnaW4gPSBiYm94TWFyZ2luKGxlZnRCQm94KSArIGJib3hNYXJnaW4ocmlnaHRCQm94KSxcbiAgICAgICAgICAgIGksIGNoaWxkO1xuXG4gICAgICAgIGZvciAoaSA9IG07IGkgPCBNIC0gbTsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBleHRlbmQobGVmdEJCb3gsIG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZCk7XG4gICAgICAgICAgICBtYXJnaW4gKz0gYmJveE1hcmdpbihsZWZ0QkJveCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSBNIC0gbSAtIDE7IGkgPj0gbTsgaS0tKSB7XG4gICAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBleHRlbmQocmlnaHRCQm94LCBub2RlLmxlYWYgPyB0b0JCb3goY2hpbGQpIDogY2hpbGQpO1xuICAgICAgICAgICAgbWFyZ2luICs9IGJib3hNYXJnaW4ocmlnaHRCQm94KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXJnaW47XG4gICAgfSxcblxuICAgIF9hZGp1c3RQYXJlbnRCQm94ZXM6IGZ1bmN0aW9uIChiYm94LCBwYXRoLCBsZXZlbCkge1xuICAgICAgICAvLyBhZGp1c3QgYmJveGVzIGFsb25nIHRoZSBnaXZlbiB0cmVlIHBhdGhcbiAgICAgICAgZm9yICh2YXIgaSA9IGxldmVsOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgZXh0ZW5kKHBhdGhbaV0sIGJib3gpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb25kZW5zZTogZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgLy8gZ28gdGhyb3VnaCB0aGUgcGF0aCwgcmVtb3ZpbmcgZW1wdHkgbm9kZXMgYW5kIHVwZGF0aW5nIGJib3hlc1xuICAgICAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxLCBzaWJsaW5nczsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoW2ldLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncyA9IHBhdGhbaSAtIDFdLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncy5zcGxpY2Uoc2libGluZ3MuaW5kZXhPZihwYXRoW2ldKSwgMSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICB9IGVsc2UgY2FsY0JCb3gocGF0aFtpXSwgdGhpcy50b0JCb3gpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbml0Rm9ybWF0OiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIC8vIGRhdGEgZm9ybWF0IChtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZIGFjY2Vzc29ycylcblxuICAgICAgICAvLyB1c2VzIGV2YWwtdHlwZSBmdW5jdGlvbiBjb21waWxhdGlvbiBpbnN0ZWFkIG9mIGp1c3QgYWNjZXB0aW5nIGEgdG9CQm94IGZ1bmN0aW9uXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIGFsZ29yaXRobXMgYXJlIHZlcnkgc2Vuc2l0aXZlIHRvIHNvcnRpbmcgZnVuY3Rpb25zIHBlcmZvcm1hbmNlLFxuICAgICAgICAvLyBzbyB0aGV5IHNob3VsZCBiZSBkZWFkIHNpbXBsZSBhbmQgd2l0aG91dCBpbm5lciBjYWxsc1xuXG4gICAgICAgIHZhciBjb21wYXJlQXJyID0gWydyZXR1cm4gYScsICcgLSBiJywgJzsnXTtcblxuICAgICAgICB0aGlzLmNvbXBhcmVNaW5YID0gbmV3IEZ1bmN0aW9uKCdhJywgJ2InLCBjb21wYXJlQXJyLmpvaW4oZm9ybWF0WzBdKSk7XG4gICAgICAgIHRoaXMuY29tcGFyZU1pblkgPSBuZXcgRnVuY3Rpb24oJ2EnLCAnYicsIGNvbXBhcmVBcnIuam9pbihmb3JtYXRbMV0pKTtcblxuICAgICAgICB0aGlzLnRvQkJveCA9IG5ldyBGdW5jdGlvbignYScsXG4gICAgICAgICAgICAncmV0dXJuIHttaW5YOiBhJyArIGZvcm1hdFswXSArXG4gICAgICAgICAgICAnLCBtaW5ZOiBhJyArIGZvcm1hdFsxXSArXG4gICAgICAgICAgICAnLCBtYXhYOiBhJyArIGZvcm1hdFsyXSArXG4gICAgICAgICAgICAnLCBtYXhZOiBhJyArIGZvcm1hdFszXSArICd9OycpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGZpbmRJdGVtKGl0ZW0sIGl0ZW1zLCBlcXVhbHNGbikge1xuICAgIGlmICghZXF1YWxzRm4pIHJldHVybiBpdGVtcy5pbmRleE9mKGl0ZW0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZXF1YWxzRm4oaXRlbSwgaXRlbXNbaV0pKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG4vLyBjYWxjdWxhdGUgbm9kZSdzIGJib3ggZnJvbSBiYm94ZXMgb2YgaXRzIGNoaWxkcmVuXG5mdW5jdGlvbiBjYWxjQkJveChub2RlLCB0b0JCb3gpIHtcbiAgICBkaXN0QkJveChub2RlLCAwLCBub2RlLmNoaWxkcmVuLmxlbmd0aCwgdG9CQm94LCBub2RlKTtcbn1cblxuLy8gbWluIGJvdW5kaW5nIHJlY3RhbmdsZSBvZiBub2RlIGNoaWxkcmVuIGZyb20gayB0byBwLTFcbmZ1bmN0aW9uIGRpc3RCQm94KG5vZGUsIGssIHAsIHRvQkJveCwgZGVzdE5vZGUpIHtcbiAgICBpZiAoIWRlc3ROb2RlKSBkZXN0Tm9kZSA9IGNyZWF0ZU5vZGUobnVsbCk7XG4gICAgZGVzdE5vZGUubWluWCA9IEluZmluaXR5O1xuICAgIGRlc3ROb2RlLm1pblkgPSBJbmZpbml0eTtcbiAgICBkZXN0Tm9kZS5tYXhYID0gLUluZmluaXR5O1xuICAgIGRlc3ROb2RlLm1heFkgPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKHZhciBpID0gaywgY2hpbGQ7IGkgPCBwOyBpKyspIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBleHRlbmQoZGVzdE5vZGUsIG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc3ROb2RlO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgIGEubWluWCA9IE1hdGgubWluKGEubWluWCwgYi5taW5YKTtcbiAgICBhLm1pblkgPSBNYXRoLm1pbihhLm1pblksIGIubWluWSk7XG4gICAgYS5tYXhYID0gTWF0aC5tYXgoYS5tYXhYLCBiLm1heFgpO1xuICAgIGEubWF4WSA9IE1hdGgubWF4KGEubWF4WSwgYi5tYXhZKTtcbiAgICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY29tcGFyZU5vZGVNaW5YKGEsIGIpIHsgcmV0dXJuIGEubWluWCAtIGIubWluWDsgfVxuZnVuY3Rpb24gY29tcGFyZU5vZGVNaW5ZKGEsIGIpIHsgcmV0dXJuIGEubWluWSAtIGIubWluWTsgfVxuXG5mdW5jdGlvbiBiYm94QXJlYShhKSAgIHsgcmV0dXJuIChhLm1heFggLSBhLm1pblgpICogKGEubWF4WSAtIGEubWluWSk7IH1cbmZ1bmN0aW9uIGJib3hNYXJnaW4oYSkgeyByZXR1cm4gKGEubWF4WCAtIGEubWluWCkgKyAoYS5tYXhZIC0gYS5taW5ZKTsgfVxuXG5mdW5jdGlvbiBlbmxhcmdlZEFyZWEoYSwgYikge1xuICAgIHJldHVybiAoTWF0aC5tYXgoYi5tYXhYLCBhLm1heFgpIC0gTWF0aC5taW4oYi5taW5YLCBhLm1pblgpKSAqXG4gICAgICAgICAgIChNYXRoLm1heChiLm1heFksIGEubWF4WSkgLSBNYXRoLm1pbihiLm1pblksIGEubWluWSkpO1xufVxuXG5mdW5jdGlvbiBpbnRlcnNlY3Rpb25BcmVhKGEsIGIpIHtcbiAgICB2YXIgbWluWCA9IE1hdGgubWF4KGEubWluWCwgYi5taW5YKSxcbiAgICAgICAgbWluWSA9IE1hdGgubWF4KGEubWluWSwgYi5taW5ZKSxcbiAgICAgICAgbWF4WCA9IE1hdGgubWluKGEubWF4WCwgYi5tYXhYKSxcbiAgICAgICAgbWF4WSA9IE1hdGgubWluKGEubWF4WSwgYi5tYXhZKTtcblxuICAgIHJldHVybiBNYXRoLm1heCgwLCBtYXhYIC0gbWluWCkgKlxuICAgICAgICAgICBNYXRoLm1heCgwLCBtYXhZIC0gbWluWSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGEsIGIpIHtcbiAgICByZXR1cm4gYS5taW5YIDw9IGIubWluWCAmJlxuICAgICAgICAgICBhLm1pblkgPD0gYi5taW5ZICYmXG4gICAgICAgICAgIGIubWF4WCA8PSBhLm1heFggJiZcbiAgICAgICAgICAgYi5tYXhZIDw9IGEubWF4WTtcbn1cblxuZnVuY3Rpb24gaW50ZXJzZWN0cyhhLCBiKSB7XG4gICAgcmV0dXJuIGIubWluWCA8PSBhLm1heFggJiZcbiAgICAgICAgICAgYi5taW5ZIDw9IGEubWF4WSAmJlxuICAgICAgICAgICBiLm1heFggPj0gYS5taW5YICYmXG4gICAgICAgICAgIGIubWF4WSA+PSBhLm1pblk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgbGVhZjogdHJ1ZSxcbiAgICAgICAgbWluWDogSW5maW5pdHksXG4gICAgICAgIG1pblk6IEluZmluaXR5LFxuICAgICAgICBtYXhYOiAtSW5maW5pdHksXG4gICAgICAgIG1heFk6IC1JbmZpbml0eVxuICAgIH07XG59XG5cbi8vIHNvcnQgYW4gYXJyYXkgc28gdGhhdCBpdGVtcyBjb21lIGluIGdyb3VwcyBvZiBuIHVuc29ydGVkIGl0ZW1zLCB3aXRoIGdyb3VwcyBzb3J0ZWQgYmV0d2VlbiBlYWNoIG90aGVyO1xuLy8gY29tYmluZXMgc2VsZWN0aW9uIGFsZ29yaXRobSB3aXRoIGJpbmFyeSBkaXZpZGUgJiBjb25xdWVyIGFwcHJvYWNoXG5cbmZ1bmN0aW9uIG11bHRpU2VsZWN0KGFyciwgbGVmdCwgcmlnaHQsIG4sIGNvbXBhcmUpIHtcbiAgICB2YXIgc3RhY2sgPSBbbGVmdCwgcmlnaHRdLFxuICAgICAgICBtaWQ7XG5cbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIHJpZ2h0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgIGxlZnQgPSBzdGFjay5wb3AoKTtcblxuICAgICAgICBpZiAocmlnaHQgLSBsZWZ0IDw9IG4pIGNvbnRpbnVlO1xuXG4gICAgICAgIG1pZCA9IGxlZnQgKyBNYXRoLmNlaWwoKHJpZ2h0IC0gbGVmdCkgLyBuIC8gMikgKiBuO1xuICAgICAgICBxdWlja3NlbGVjdChhcnIsIG1pZCwgbGVmdCwgcmlnaHQsIGNvbXBhcmUpO1xuXG4gICAgICAgIHN0YWNrLnB1c2gobGVmdCwgbWlkLCBtaWQsIHJpZ2h0KTtcbiAgICB9XG59XG4iLCIvKlxuIChjKSAyMDEzLCBEYXJhZmVpIFByYWxpYXNrb3Vza2ksIFZsYWRpbWlyIEFnYWZvbmtpbiwgTWFrc2ltIEd1cnRvdmVua29cbiBLb3RoaWMgSlMgaXMgYSBmdWxsLWZlYXR1cmVkIEphdmFTY3JpcHQgbWFwIHJlbmRlcmluZyBlbmdpbmUgdXNpbmcgSFRNTDUgQ2FudmFzLlxuIGh0dHA6Ly9naXRodWIuY29tL2tvdGhpYy9rb3RoaWMtanNcbiovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgU3R5bGVNYW5hZ2VyID0gcmVxdWlyZShcIi4vc3R5bGUvc3R5bGUtbWFuYWdlclwiKTtcbmNvbnN0IEdhbGxlcnkgPSByZXF1aXJlKFwiLi9zdHlsZS9nYWxsZXJ5XCIpXG5jb25zdCBSZW5kZXJlciA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyL3JlbmRlcmVyXCIpO1xuXG4vKipcbiAqKiBBdmFpbGFibGUgb3B0aW9uczpcbiAqKiBnZXRGcmFtZTpGdW5jdGlvbiDigJQgRnVuY3Rpb24sIHdpbGwgYmUgY2FsbGVkIHByaW9yIHRoZSBoZWF2eSBvcGVyYXRpb25zXG4gKiogZGVidWcge2Jvb2xlYW59IOKAlCByZW5kZXIgZGVidWcgaW5mb3JtYXRpb25cbiAqKiBicm93c2VyT3B0aW1pemF0aW9ucyB7Ym9vbGVhbn0g4oCUIGVuYWJsZSBzZXQgb2Ygb3B0aW1pemF0aW9ucyBmb3IgSFRNTDUgQ2FudmFzIGltcGxlbWVudGF0aW9uXG4gKiovXG5mdW5jdGlvbiBLb3RoaWMobWFwY3NzLCBvcHRpb25zKSB7XG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICB0aGlzLnN0eWxlTWFuYWdlciA9IG5ldyBTdHlsZU1hbmFnZXIobWFwY3NzLCB7Z3JvdXBGZWF0dXJlc0J5QWN0aW9uczogdGhpcy5icm93c2VyT3B0aW1pemF0aW9uc30pO1xuXG4gIGNvbnN0IGltYWdlcyA9IG1hcGNzcy5saXN0SW1hZ2VSZWZlcmVuY2VzKCk7XG4gIGNvbnN0IGdhbGxlcnkgPSBuZXcgR2FsbGVyeShvcHRpb25zLmdhbGxlcnkgfHwge30pO1xuXG4gIHRoaXMucmVuZGVyZXJQcm9taXNlID0gZ2FsbGVyeS5wcmVsb2FkSW1hZ2VzKGltYWdlcykudGhlbigoKSA9PiB7XG4gICAgIHJldHVybiBuZXcgUmVuZGVyZXIoZ2FsbGVyeSwge1xuICAgICAgZ3JvdXBGZWF0dXJlc0J5QWN0aW9uczogdGhpcy5icm93c2VyT3B0aW1pemF0aW9ucyxcbiAgICAgIGRlYnVnOiB0aGlzLmRlYnVnLFxuICAgICAgZ2V0RnJhbWU6IHRoaXMuZ2V0RnJhbWVcbiAgICB9KTtcbiAgfSwgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbn1cblxuS290aGljLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAvLyBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5kZXZpY2VQaXhlbFJhdGlvICE9PSAndW5kZWZpbmVkJykge1xuICAvLyAgICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvID0gb3B0aW9ucy5kZXZpY2VQaXhlbFJhdGlvO1xuICAvLyB9IGVsc2Uge1xuICAvLyAgICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvID0gMTtcbiAgLy8gfVxuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmRlYnVnICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuZGVidWcgPSAhIW9wdGlvbnMuZGVidWc7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZ2V0RnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmdldEZyYW1lID0gb3B0aW9ucy5nZXRGcmFtZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5nZXRGcmFtZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICB2YXIgcmVxRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgICAgICAgcmVxRnJhbWUuY2FsbCh3aW5kb3csIGZuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXRGcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmJyb3dzZXJPcHRpbWl6YXRpb25zICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuYnJvd3Nlck9wdGltaXphdGlvbnMgPSAhIW9wdGlvbnMuYnJvd3Nlck9wdGltaXphdGlvbnM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5icm93c2VyT3B0aW1pemF0aW9ucyA9IGZhbHNlO1xuICB9XG59O1xuXG5Lb3RoaWMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjYW52YXMsIGdlb2pzb24sIHpvb20sIGNhbGxiYWNrKSB7XG4gIC8vIGlmICh0eXBlb2YgY2FudmFzID09PSAnc3RyaW5nJykge1xuICAvLyBUT0RPOiBBdm9pZCBkb2N1bWVudFxuICAvLyAgICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcbiAgLy8gfVxuICAvLyBUT0RPOiBDb25zaWRlciBtb3ZpbmcgdGhpcyBsb2dpYyBvdXRzaWRlXG4gIC8vIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gMTsgLy9NYXRoLm1heCh0aGlzLmRldmljZVBpeGVsUmF0aW8gfHwgMSwgMik7XG5cbiAgY29uc3Qgd2lkdGggPSBjYW52YXMud2lkdGg7XG4gIGNvbnN0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgLy8gaWYgKGRldmljZVBpeGVsUmF0aW8gIT09IDEpIHtcbiAgLy8gICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgLy8gICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAvLyAgICAgY2FudmFzLndpZHRoID0gY2FudmFzLndpZHRoICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgLy8gICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgLy8gfVxuXG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAvL1RPRE86IG1vdmUgdG8gb3B0aW9ucyBub2RlLWNhbnZhcyBzcGVjaWZpYyBzZXR0aW5nXG4gIC8vY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdjb3B5J1xuXG4gIC8vIGN0eC5zY2FsZShkZXZpY2VQaXhlbFJhdGlvLCBkZXZpY2VQaXhlbFJhdGlvKTtcblxuICAvLyB2YXIgZ3JhbnVsYXJpdHkgPSBkYXRhLmdyYW51bGFyaXR5LFxuICAvLyAgICAgd3MgPSB3aWR0aCAvIGdyYW51bGFyaXR5LCBocyA9IGhlaWdodCAvIGdyYW51bGFyaXR5O1xuXG4gIGNvbnN0IGJib3ggPSBnZW9qc29uLmJib3g7XG4gIGNvbnN0IGhzY2FsZSA9IHdpZHRoIC8gKGJib3hbMl0gLSBiYm94WzBdKTtcbiAgY29uc3QgdnNjYWxlID0gaGVpZ2h0IC8gKGJib3hbM10gLSBiYm94WzFdKTtcbiAgZnVuY3Rpb24gcHJvamVjdChwb2ludCkge1xuICAgIHJldHVybiBbXG4gICAgICAocG9pbnRbMF0gLSBiYm94WzBdKSAqIGhzY2FsZSxcbiAgICAgIGhlaWdodCAtICgocG9pbnRbMV0gLSBiYm94WzFdKSAqIHZzY2FsZSlcbiAgICBdO1xuICB9XG5cbiAgY29uc29sZS50aW1lKCdzdHlsZXMnKTtcblxuICAvLyBzZXR1cCBsYXllciBzdHlsZXNcbiAgLy8gTGF5ZXIgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgYWxyZWFkeSBzb3J0ZWRcbiAgY29uc3QgbGF5ZXJzID0gdGhpcy5zdHlsZU1hbmFnZXIuY3JlYXRlTGF5ZXJzKGdlb2pzb24uZmVhdHVyZXMsIHpvb20pO1xuXG4gIGNvbnNvbGUudGltZUVuZCgnc3R5bGVzJyk7XG5cbiAgdGhpcy5yZW5kZXJlclByb21pc2UudGhlbigocmVuZGVyZXIpID0+IHtcbiAgICByZW5kZXJlci5yZW5kZXIobGF5ZXJzLCBjdHgsIHdpZHRoLCBoZWlnaHQsIHByb2plY3QsIGNhbGxiYWNrKTtcbiAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLb3RoaWM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbG9ycyA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbG9ycy5qcycpO1xuXG5mdW5jdGlvbiBkZWcocmFkKSB7XG5cdHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG5mdW5jdGlvbiByYWQoZGVnKSB7XG5cdHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5mdW5jdGlvbiBxdWFkcmFudChhbmdsZSkge1xuICBpZiAoYW5nbGUgPCBNYXRoLlBJIC8gMiAmJiBhbmdsZSA+IC1NYXRoLlBJIC8gMikgIHtcbiAgICByZXR1cm4gJzEsMyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcyLDQnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlZ21lbnRzKHBvaW50cykge1xuICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAvL1RPRE86IE1ha2UgdGhpcyBhbmdsZSBjb25maWd1cmFibGVcbiAgY29uc3QgbWF4U2VnbWVudEFuZ2xlID0gcmFkKDQ1KTtcblxuICAvLyBPZmZzZXQgb2YgZWFjaCBzZWdtZW50IGZyb20gdGhlIGJlZ2lubmluZyBvZyB0aGUgbGluZVxuICB2YXIgb2Zmc2V0ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBwb2ludHNbaV07XG4gICAgY29uc3QgZW5kID0gcG9pbnRzW2kgKyAxXTtcblxuICAgIGNvbnN0IGR4ID0gZW5kWzBdIC0gc3RhcnRbMF07XG4gICAgY29uc3QgZHkgPSBlbmRbMV0gLSBzdGFydFsxXTtcblxuICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkeCAqKiAyICsgZHkgKiogMik7XG5cbiAgICAvLyBUcnkgdG8gYXR0YWNoIGN1cnJlbnQgcG9pbnQgdG8gYSBwcmV2aW91cyBzZWdtZW50XG4gICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHByZXZTZWdtZW50ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICBjb25zdCBwcmV2QW5nbGUgPSBwcmV2U2VnbWVudC5hbmdsZXNbcHJldlNlZ21lbnQuYW5nbGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAvLyBBbmdsZXMgbW9yZSB0aGFuIDE4MCBkZWdyZWVzIGFyZSByZXZlcnNlZCB0byBkaWZmZXJlbnQgZGlyZWN0aW9uXG4gICAgICB2YXIgYW5nbGVEaWZmID0gTWF0aC5hYnMocHJldkFuZ2xlIC0gYW5nbGUpO1xuICAgICAgaWYgKGFuZ2xlRGlmZiA+IE1hdGguUEkpIHtcbiAgICAgICAgYW5nbGVEaWZmID0gKDIgKiBNYXRoLlBJKSAtIGFuZ2xlRGlmZjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHNlZ21lbnQgY2FuIGJlIGNvbnRpbnVlZCwgaWZcbiAgICAgIC8vIDEuIEFuZ2xlIGJldHdlZW4gdHdvIHBhcnRzIGlzIGxlc3NlciB0aGVuIG1heFNlZ21lbnRBbmdsZSB0byBhdm9pZCBzaGFycCBjb3JuZXJzXG4gICAgICAvLyAyLiBQYXJ0IGlzIGRpcmVjcmVkIHRvIHRoZSBzYW1lIGhlbWljaXJjbGUgYXMgdGhlIHByZXZpb3VzIHNlZ21lbnRcbiAgICAgIC8vXG4gICAgICAvLyBPdGhlcndpc2UsIHRoZSBuZXcgc2VnbWVudCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgIGlmIChhbmdsZURpZmYgPCBtYXhTZWdtZW50QW5nbGUgJiYgcXVhZHJhbnQoYW5nbGUpID09IHByZXZTZWdtZW50LnF1YWRyYW50KSB7XG4gICAgICAgIHByZXZTZWdtZW50LnBvaW50cy5wdXNoKGVuZCk7XG4gICAgICAgIHByZXZTZWdtZW50LmFuZ2xlcy5wdXNoKGFuZ2xlKTtcbiAgICAgICAgcHJldlNlZ21lbnQucGFydHNMZW5ndGgucHVzaChsZW5ndGgpO1xuICAgICAgICBwcmV2U2VnbWVudC5sZW5ndGggKz0gbGVuZ3RoO1xuICAgICAgICBvZmZzZXQgKz0gbGVuZ3RoO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWdtZW50cy5wdXNoKHtcbiAgICAgIGFuZ2xlczogW2FuZ2xlXSxcbiAgICAgIHBhcnRzTGVuZ3RoOiBbbGVuZ3RoXSxcbiAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICBwb2ludHM6IFtzdGFydCwgZW5kXSxcbiAgICAgIHF1YWRyYW50OiBxdWFkcmFudChhbmdsZSlcbiAgICB9KTtcblxuICAgIG9mZnNldCArPSBsZW5ndGg7XG4gIH1cblxuICByZXR1cm4gc2VnbWVudHM7XG59XG5cbi8qKiBGaW5kIGluZGV4IG9mIHNlZ2VtbnQgcGFydCBhbmQgb2Zmc2V0IGZyb20gYmVnaW5uaW5nIG9mIHRoZSBwYXJ0IGJ5IG9mZnNldC5cbiAqKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHB1dCBsYWJlbCB0byB0aGUgY2VudGVyIG9mIGEgc2VnbWVudFxuICoqIEBwYXJhbSBwYXJ0cyB7YXJyYXl9IGFycmF5IG9mIHNlZ21lbnQgcGFydHMgbGVuZ3RoXG4gKiogQHBhcmFtIG9mZnNldCB7ZmxvYXR9IGV4cGVjdGVkIG9mZnNldFxuICoqL1xuZnVuY3Rpb24gY2FsY3VsYXRlT2Zmc2V0KHBhcnRzLCBvZmZzZXQpIHtcbiAgdmFyIHRvdGFsT2Zmc2V0ID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGFydCA9IHBhcnRzW2ldO1xuXG4gICAgaWYgKHRvdGFsT2Zmc2V0ICsgcGFydCA+IG9mZnNldCkge1xuICAgICAgcmV0dXJuIFtpLCBvZmZzZXQgLSB0b3RhbE9mZnNldF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvdGFsT2Zmc2V0ICs9IHBhcnQ7XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwiU2FuaXR5IGNoZWNrOiBwYXRoIGlzIHNob3J0ZXIgdGhhbiBhbiBvZmZzZXRcIik7XG59XG5cbmZ1bmN0aW9uIGRyYXdHbHlwaChjdHgsIGdseXBoLCBoYXNIYWxvPWZhbHNlKSB7XG4gIGN0eC50cmFuc2xhdGUoZ2x5cGgucG9zaXRpb25bMF0sIGdseXBoLnBvc2l0aW9uWzFdKTtcbiAgY3R4LnJvdGF0ZShnbHlwaC5hbmdsZSk7XG5cdGlmIChoYXNIYWxvKSB7XG4gIFx0Y3R4LnN0cm9rZVRleHQoZ2x5cGguZ2x5cGgsIGdseXBoLm9mZnNldFswXSwgZ2x5cGgub2Zmc2V0WzFdKTtcblx0fSBlbHNlIHtcblx0XHRjdHguZmlsbFRleHQoZ2x5cGguZ2x5cGgsIGdseXBoLm9mZnNldFswXSwgZ2x5cGgub2Zmc2V0WzFdKTtcblx0fVxuXG4gIGN0eC5yb3RhdGUoLWdseXBoLmFuZ2xlKTtcbiAgY3R4LnRyYW5zbGF0ZSgtZ2x5cGgucG9zaXRpb25bMF0sIC1nbHlwaC5wb3NpdGlvblsxXSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNlZ21lbnRzKGN0eCwgc2VnbWVudHMpIHtcbiAgY3R4LnNhdmUoKTtcbiAgc2VnbWVudHMuZm9yRWFjaCgoc2VnKSA9PiB7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzLm5leHRDb2xvcigpO1xuICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5tb3ZlVG8oc2VnLnBvaW50c1swXVswXSwgc2VnLnBvaW50c1swXVsxXSk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzZWcucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdHgubGluZVRvKHNlZy5wb2ludHNbaV1bMF0sIHNlZy5wb2ludHNbaV1bMV0pO1xuICAgIH1cbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0pO1xuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVHbHlwaHNQb3NpdGlvbnMoc2VnbWVudCwgZ2x5cGhzKSB7XG4gIGNvbnN0IHRleHRXaWR0aCA9IGdseXBocy5yZWR1Y2UoKGFjYywgZ2x5cGgpID0+IGFjYyArIGdseXBoLndpZHRoLCAwKTtcblxuICAvL1JldmVyc2Ugc2VnbWVudCB0byBhdm9pZCB0ZXh0LCBmbGlwcGVkIHVwc2lkZSBkb3duXG4gIGlmIChzZWdtZW50LnF1YWRyYW50ID09ICcyLDQnKSB7XG4gICAgc2VnbWVudC5hbmdsZXMgPSBzZWdtZW50LmFuZ2xlcy5tYXAoKGFuZ2xlKSA9PiBhbmdsZSAtIE1hdGguUEkpO1xuICAgIHNlZ21lbnQucGFydHNMZW5ndGgucmV2ZXJzZSgpO1xuICAgIHNlZ21lbnQucG9pbnRzLnJldmVyc2UoKTtcblx0XHRzZWdtZW50LnF1YWRyYW50ID0gJzEsMydcbiAgfVxuXG5cdC8vQWxpZ24gdGV4dCB0byB0aGUgbWlkZGxlIG9mIGN1cnJlbnQgc2VnbWVudFxuICBjb25zdCBzdGFydE9mZnNldCA9IChzZWdtZW50Lmxlbmd0aCAtIHRleHRXaWR0aCkgLyAyO1xuXG5cdC8vIEdldCBwb2ludCBpbmRleCBhbmQgb2Zmc2V0IGZyb20gdGhhdCBwb2ludCBvZiB0aGUgc3RhcnRpbmcgcG9zaXRpb25cblx0Ly8gJ2luZGV4JyBpcyBhbiBpbmRleCBvZiBjdXJyZW50IHNlZ21lbnQgcGFydHNMZW5ndGhcblx0Ly8gJ29mZnNldCcgaXMgYW4gb2Zmc2V0IGZyb20gdGhlIGJlZ2dpbmluZyBvZiB0aGUgcGFydFxuICB2YXIgW2luZGV4LCBvZmZzZXRdID0gY2FsY3VsYXRlT2Zmc2V0KHNlZ21lbnQucGFydHNMZW5ndGgsIHN0YXJ0T2Zmc2V0KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBnbHlwaCA9IGdseXBoc1tpXTtcblxuXHRcdGNvbnN0IHN0YXJ0UG9pbnRJbmRleCA9IGluZGV4O1xuICAgIGNvbnN0IG9mZnNldFggPSBvZmZzZXQ7XG5cblx0XHQvL0l0ZXJhdGUgYnkgcG9pbnRzIHVudGlsIHNwYWNlIGZvciBjdXJyZW50IGdseXBoIHdhcyByZXNlcnZlZFxuXHRcdHZhciByZXNlcnZlZCA9IDA7XG4gICAgd2hpbGUgKHJlc2VydmVkIDwgZ2x5cGgud2lkdGgpIHtcbiAgICAgIGNvbnN0IHJlcXVpcmVkU3BhY2UgPSBnbHlwaC53aWR0aCAtIHJlc2VydmVkO1xuXHRcdFx0Ly9DdXJyZW50IHBhcnQgaXMgbG9uZ2VyIHRoYW4gcmVxdWlyZWQgc3BhY2VcbiAgICAgIGlmIChzZWdtZW50LnBhcnRzTGVuZ3RoW2luZGV4XSA+IG9mZnNldCArIHJlcXVpcmVkU3BhY2UpIHtcbiAgICAgICAgb2Zmc2V0ICs9IHJlcXVpcmVkU3BhY2U7XG4gICAgICAgIHJlc2VydmVkICs9IHJlcXVpcmVkU3BhY2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG5cdFx0XHQvL0N1cnJlbnQgcGFydCBpcyBzaG9ydGVyIHRoYW4gcmVxdWlyZWQgc3BhY2UuIFJlc2VydmUgdGhlIHdob2xlIHBhcnRcblx0XHRcdC8vYW5kIGluY3JlbWVudCBpbmRleFxuICAgICAgcmVzZXJ2ZWQgKz0gc2VnbWVudC5wYXJ0c0xlbmd0aFtpbmRleF0gLSBvZmZzZXQ7XG4gICAgICBpbmRleCArPSAxO1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9XG5cblx0XHQvLyBUZXh0IGdseXBoIG1heSBjb3ZlciBtdWx0aXBsZSBzZWdtZW50IHBhcnRzLCBzbyBhIGdseXBoIGFuZ2xlIHNob3VsZFxuXHRcdC8vIGJlIGF2ZXJhZ2VkIGJldHdlZW4gc3RhcnQgYW5zIGVuZCBwb3NpdGlvblxuXHRcdGNvbnN0IGFuZ2xlID0gYWRqdXN0QW5nbGUoc2VnbWVudC5wb2ludHNbc3RhcnRQb2ludEluZGV4XSwgc2VnbWVudC5hbmdsZXNbc3RhcnRQb2ludEluZGV4XSwgc2VnbWVudC5wb2ludHNbaW5kZXhdLCBzZWdtZW50LmFuZ2xlc1tpbmRleF0sIG9mZnNldCwgMCk7XG5cblx0XHRnbHlwaC5wb3NpdGlvbiA9IHNlZ21lbnQucG9pbnRzW3N0YXJ0UG9pbnRJbmRleF07XG5cdFx0Z2x5cGguYW5nbGUgPSBhbmdsZTtcblx0XHRnbHlwaC5vZmZzZXQgPSBbb2Zmc2V0WCwgMF07XG4gIH1cblxuXHRyZXR1cm4gZ2x5cGhzO1xufVxuXG5mdW5jdGlvbiBhZGp1c3RBbmdsZShwb2ludFN0YXJ0LCBhbmdsZVN0YXJ0LCBwb2ludE5leHQsIGFuZ2xlTmV4dCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xuXHQvL0lmIGdseXBoIGNhbiBiZSBmaXR0ZWQgdG8gYSBzaW5nbGUgc2VnbWVudCBwYXJ0LCBubyBhZGp1c3RtZW50IGlzIG5lZWRlZFxuXHRpZiAocG9pbnRTdGFydCA9PT0gcG9pbnROZXh0KSB7XG5cdFx0cmV0dXJuIGFuZ2xlU3RhcnQ7XG5cdH1cblxuXHQvL0RyYXcgYSBsaW5lIGZyb20gc3RhcnQgcG9pbnQgdG8gZW5kIHBvaW50IG9mIGEgZ2x5cGhcblx0Y29uc3QgeCA9IHBvaW50TmV4dFswXSArIG9mZnNldFggKiBNYXRoLnNpbihhbmdsZU5leHQpICsgb2Zmc2V0WSAqIE1hdGguc2luKGFuZ2xlTmV4dCk7XG5cdGNvbnN0IHkgPSBwb2ludE5leHRbMV0gKyBvZmZzZXRYICogTWF0aC5jb3MoYW5nbGVOZXh0KSArIG9mZnNldFkgKiBNYXRoLmNvcyhhbmdsZU5leHQpO1xuXG5cdC8vcmV0dXJuIGFuZ2xlIG9mIHRoaXMgbGluZVxuXHRyZXR1cm4gTWF0aC5hdGFuMih5IC0gcG9pbnRTdGFydFsxXSwgeCAtIHBvaW50U3RhcnRbMF0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0NvbGxpc2lvbnMoc2VnbWVudCwgY29sbGlzaW9ucykge1xuXHRjb25zdCBib3ggPSBzZWdtZW50LnBvaW50cy5yZWR1Y2UoKGFjYywgcG9pbnQpID0+ICh7XG5cdFx0XHRtaW5YOiBNYXRoLm1pbihhY2MubWluWCwgcG9pbnRbMF0pLFxuXHRcdFx0bWluWTogTWF0aC5taW4oYWNjLm1pblksIHBvaW50WzFdKSxcblx0XHRcdG1heFg6IE1hdGgubWF4KGFjYy5tYXhYLCBwb2ludFswXSksXG5cdFx0XHRtYXhZOiBNYXRoLm1heChhY2MubWF4WCwgcG9pbnRbMV0pXG5cdFx0fSksIHttaW5YOiBJbmZpbml0eSwgbWluWTogSW5maW5pdHksIG1heFg6IC1JbmZpbml0eSwgbWF4WTogLUluZmluaXR5fSk7XG5cblx0XHRyZXR1cm4gY29sbGlzaW9ucy5jaGVjayhib3gpO1xufVxuXG5mdW5jdGlvbiByZW5kZXIoY3R4LCBwb2ludHMsIHRleHQsIGhhc0hhbG8sIGNvbGxpc2lvbnMsIGRlYnVnPWZhbHNlKSB7XG4gIGNvbnN0IGdseXBocyA9IHRleHQuc3BsaXQoXCJcIilcbiAgICAgIC5tYXAoKGwpID0+IHtcbiAgICAgICAgY29uc3QgbWV0cmljcyA9IGN0eC5tZWFzdXJlVGV4dChsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnbHlwaDogbCxcbiAgICAgICAgICB3aWR0aDogbWV0cmljcy53aWR0aCxcbiAgICAgICAgICBhc2NlbnQ6IG1ldHJpY3MuZW1IZWlnaHRBc2NlbnQsXG4gICAgICAgICAgZGVzY2VudDogbWV0cmljcy5lbUhlaWdodERlc2NlbnQsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGdseXBocy5yZWR1Y2UoKGFjYywgZ2x5cGgpID0+IGFjYyArIGdseXBoLndpZHRoLCAwKTtcblxuICB2YXIgc2VnbWVudHMgPSBjcmVhdGVTZWdtZW50cyhwb2ludHMpO1xuXG4gIGlmIChkZWJ1Zykge1xuICAgIHJlbmRlclNlZ21lbnRzKGN0eCwgc2VnbWVudHMpO1xuICB9XG5cbiAgLy9UT0RPOiBNZXJnZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBpZiBwb3NzaWJsZVxuXG4gIHNlZ21lbnRzID0gc2VnbWVudHMuZmlsdGVyKChzZWcpID0+IHNlZy5sZW5ndGggPiB0ZXh0V2lkdGgpO1xuXG5cdHNlZ21lbnRzID0gc2VnbWVudHMuZmlsdGVyKChzZWcpID0+IGNoZWNrQ29sbGlzaW9ucyhzZWcsIGNvbGxpc2lvbnMpKVxuXG5cbiAgLy9UT0RPIENob29zZSBiZXN0IHNlZ21lbnRzXG5cbiAgLy9SZW5kZXIgdGV4dFxuICBzZWdtZW50cy5mb3JFYWNoKChzZWcpID0+IHtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBjYWxjdWxhdGVHbHlwaHNQb3NpdGlvbnMoc2VnLCBnbHlwaHMpO1xuXG5cdFx0aWYgKGhhc0hhbG8pIHtcblx0XHRcdHBvc2l0aW9ucy5mb3JFYWNoKChnbHlwaCkgPT4ge1xuXHRcdFx0XHRkcmF3R2x5cGgoY3R4LCBnbHlwaCwgdHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cG9zaXRpb25zLmZvckVhY2goKGdseXBoKSA9PiB7XG5cdFx0XHRkcmF3R2x5cGgoY3R4LCBnbHlwaCwgZmFsc2UpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZ2VvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL2dlb20nKTtcblxuZnVuY3Rpb24gcmVuZGVySWNvbihjdHgsIGZlYXR1cmUsIG5leHRGZWF0dXJlLCB7cHJvamVjdFBvaW50RnVuY3Rpb24sIGNvbGxpc2lvbkJ1ZmZlciwgZ2FsbGVyeX0pIHtcbiAgLy9UT0RPOiBSZWZhY3RvciwgY2FsY3VsYXRlIHJlcHJlc2VudGF0aXZlIHBvaW50IG9ubHkgb25jZVxuICBjb25zdCBwb2ludCA9IGdlb20uZ2V0UmVwclBvaW50KGZlYXR1cmUuZ2VvbWV0cnksIHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgaWYgKCFwb2ludCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG5cbiAgY29uc3QgaW1hZ2UgPSBnYWxsZXJ5LmdldEltYWdlKGFjdGlvbnNbJ2ljb24taW1hZ2UnXSk7XG4gIGlmICghaW1hZ2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdyA9IGltYWdlLndpZHRoLCBoID0gaW1hZ2UuaGVpZ2h0O1xuXG4gIC8vWm9vbSBpbWFnZSBhY2NvcmRpbmcgdG8gdmFsdWVzLCBzcGVjaWZpZWQgaW4gTWFwQ1NTXG4gIGlmIChhY3Rpb25zWydpY29uLXdpZHRoJ10gfHwgYWN0aW9uc1snaWNvbi1oZWlnaHQnXSkge1xuICAgIGlmIChhY3Rpb25zWydpY29uLXdpZHRoJ10pIHtcbiAgICAgIHcgPSBhY3Rpb25zWydpY29uLXdpZHRoJ107XG4gICAgICBoID0gaW1hZ2UuaGVpZ2h0ICogdyAvIGltYWdlLndpZHRoO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uc1snaWNvbi1oZWlnaHQnXSkge1xuICAgICAgaCA9IGFjdGlvbnNbJ2ljb24taGVpZ2h0J107XG4gICAgICBpZiAoIWFjdGlvbnNbJ2ljb24td2lkdGgnXSkge1xuICAgICAgICB3ID0gaW1hZ2Uud2lkdGggKiBoIC8gaW1hZ2UuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghYWN0aW9uc1snYWxsb3ctb3ZlcmxhcCddKSB7XG4gICAgaWYgKGNvbGxpc2lvbkJ1ZmZlci5jaGVja1BvaW50V0gocG9pbnQsIHcsIGgsIGZlYXR1cmUua290aGljSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cblxuICBjb25zdCB4ID0gTWF0aC5mbG9vcihwb2ludFswXSAtIHcgLyAyKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IocG9pbnRbMV0gLSBoIC8gMik7XG5cbiAgY3R4LnNhdmUoKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICAvL2N0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcbiAgLy9jdHgubGluZVdpZHRoID0gMVxuICBjdHguZWxsaXBzZShwb2ludFswXSwgcG9pbnRbMV0sIHcgLyAyLCBoIC8gMiwgMCwgMCwgMipNYXRoLlBJKTtcbiAgLy9jdHgucmVjdCh4LCB5LCB3LCBoKTtcbiAgY3R4LmNsaXAoXCJldmVub2RkXCIpO1xuICAvL2N0eC5zdHJva2UoKVxuICBjdHguZHJhd0ltYWdlKGltYWdlLCB4LCB5LCB3LCBoKTtcbiAgY3R4LnJlc3RvcmUoKTtcblxuICBjb25zdCBwYWRkaW5nID0gcGFyc2VGbG9hdChhY3Rpb25zWycteC1rb3RoaWMtcGFkZGluZyddKTtcbiAgY29sbGlzaW9uQnVmZmVyLmFkZFBvaW50V0gocG9pbnQsIHcsIGgsIHBhZGRpbmcsIGZlYXR1cmUua290aGljSWQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJJY29uO1xuIiwiLy8ndXNlIHN0cmljdCc7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG5jb25zdCBjb250ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9zdHlsZScpO1xuXG4vL1RPRE86IFJlZmFjdG9yIHRvIGNsYXNzXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGF0aE9wZW5lZDogZmFsc2UsXG4gIHJlbmRlckNhc2luZzogZnVuY3Rpb24gKGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBncm91cEZlYXR1cmVzQnlBY3Rpb25zfSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG4gICAgY29uc3QgbmV4dEFjdGlvbnMgPSBuZXh0RmVhdHVyZSAmJiBuZXh0RmVhdHVyZS5hY3Rpb25zO1xuXG4gICBpZiAoIXRoaXMucGF0aE9wZW5lZCkge1xuICAgICB0aGlzLnBhdGhPcGVuZWQgPSB0cnVlO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgfVxuXG4gICAgLy9UT0RPOiBJcyBNYXBDU1Mgc3BlYyByZWFsbHkgYWxsb3dzIGEgZmFsbGJhY2sgZnJvbSBcImNhc2luZy1kYXNoZXNcIiB0byBcImRhc2hlc1wiP1xuICAgIGNvbnN0IGRhc2hlcyA9IGFjdGlvbnNbJ2Nhc2luZy1kYXNoZXMnXSB8fCBhY3Rpb25zWydkYXNoZXMnXTtcbiAgICBwYXRoKGN0eCwgZmVhdHVyZS5nZW9tZXRyeSwgZGFzaGVzLCBmYWxzZSwgcHJvamVjdFBvaW50RnVuY3Rpb24sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cbiAgICBpZiAoZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucyAmJlxuICAgICAgICBuZXh0RmVhdHVyZSAmJlxuICAgICAgICBuZXh0RmVhdHVyZS5rZXkgPT09IGZlYXR1cmUua2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAnbGluZVdpZHRoJzogMiAqIGFjdGlvbnNbXCJjYXNpbmctd2lkdGhcIl0gKyBhY3Rpb25zWyd3aWR0aCddLFxuICAgICAgJ3N0cm9rZVN0eWxlJzogYWN0aW9uc1tcImNhc2luZy1jb2xvclwiXSxcbiAgICAgICdsaW5lQ2FwJzogYWN0aW9uc1tcImNhc2luZy1saW5lY2FwXCJdIHx8IGFjdGlvbnNbJ2xpbmVjYXAnXSxcbiAgICAgICdsaW5lSm9pbic6IGFjdGlvbnNbXCJjYXNpbmctbGluZWpvaW5cIl0gfHwgYWN0aW9uc1snbGluZWpvaW4nXSxcbiAgICAgICdnbG9iYWxBbHBoYSc6IGFjdGlvbnNbXCJjYXNpbmctb3BhY2l0eVwiXVxuICAgIH1cblxuICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwgc3R5bGUpO1xuXG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIHRoaXMucGF0aE9wZW5lZCA9IGZhbHNlO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBncm91cEZlYXR1cmVzQnlBY3Rpb25zLCBnYWxsZXJ5fSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG4gICAgY29uc3QgbmV4dEFjdGlvbnMgPSBuZXh0RmVhdHVyZSAmJiBuZXh0RmVhdHVyZS5hY3Rpb25zO1xuICAgIGlmICghdGhpcy5wYXRoT3BlbmVkKSB7XG4gICAgICB0aGlzLnBhdGhPcGVuZWQgPSB0cnVlO1xuICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB9XG5cbiAgICBwYXRoKGN0eCwgZmVhdHVyZS5nZW9tZXRyeSwgYWN0aW9uc1snZGFzaGVzJ10sIGZhbHNlLCBwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblxuICAgIGlmIChncm91cEZlYXR1cmVzQnlBY3Rpb25zICYmXG4gICAgICAgIG5leHRGZWF0dXJlICYmXG4gICAgICAgIG5leHRGZWF0dXJlLmtleSA9PT0gZmVhdHVyZS5rZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0TGluZWpvaW4gPSBhY3Rpb25zWyd3aWR0aCddIDw9IDIgPyBcIm1pdGVyXCIgOiBcInJvdW5kXCI7XG4gICAgY29uc3QgZGVmYXVsdExpbmVjYXAgPSBhY3Rpb25zWyd3aWR0aCddIDw9IDIgPyBcImJ1dHRcIiA6IFwicm91bmRcIjtcblxuICAgIHZhciBzdHJva2VTdHlsZTtcbiAgICBpZiAoJ2ltYWdlJyBpbiBhY3Rpb25zKSB7XG4gICAgICBjb25zdCBpbWFnZSA9IGdhbGxlcnkuZ2V0SW1hZ2UoYWN0aW9uc1snaW1hZ2UnXSk7XG4gICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgc3Ryb2tlU3R5bGUgPSBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlIHx8IGFjdGlvbnNbJ2NvbG9yJ107XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICdzdHJva2VTdHlsZSc6IHN0cm9rZVN0eWxlLFxuICAgICAgJ2xpbmVXaWR0aCc6IGFjdGlvbnNbJ3dpZHRoJ10sXG4gICAgICAnbGluZUNhcCc6IGFjdGlvbnNbJ2xpbmVjYXAnXSB8fCBkZWZhdWx0TGluZWpvaW4sXG4gICAgICAnbGluZUpvaW4nOiBhY3Rpb25zWydsaW5lam9pbiddIHx8IGRlZmF1bHRMaW5lY2FwLFxuICAgICAgJ2dsb2JhbEFscGhhJzogYWN0aW9uc1snb3BhY2l0eSddLFxuICAgICAgJ21pdGVyTGltaXQnOiA0XG4gICAgfVxuXG4gICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCBzdHlsZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgdGhpcy5wYXRoT3BlbmVkID0gZmFsc2U7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdlb20gPSByZXF1aXJlKCcuLi91dGlscy9nZW9tJyk7XG5cbi8qKlxuICoqIFJlbmRlciBmZWF0dXJlcyBvbiBDYW52YXNcbiAqKi9cblxuZnVuY3Rpb24gZHJhd1JpbmcocG9pbnRzLCBjdHgsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgZHJhd09uVGlsZUVkZ2VzKSB7XG4gIGlmIChwb2ludHMubGVuZ3RoIDw9IDEpIHtcbiAgICAvL0dlb21ldHJ5IGlzIHRvbyBzaG9ydFxuICAgIHJldHVybjtcbiAgfVxuXG4gIGN0eC5tb3ZlVG8ocG9pbnRzWzBdWzBdLCBwb2ludHNbMF1bMV0pO1xuXG4gIGNvbnN0IHBhZGRpbmcgPSA1MDtcbiAgY29uc3Qgc2tpcCA9IDE7XG5cbiAgZm9yIChsZXQgaiA9IDEsIHBvaW50c0xlbiA9IHBvaW50cy5sZW5ndGg7IGogPCBwb2ludHNMZW47IGorKykge1xuICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzW2pdO1xuICAgIC8vY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2ogLSAxXVxuXG4gICAgLy9UT0RPOiBNYWtlIHBhZGRpbmcgYXMgb3B0aW9uIHRvIGxldCB1c2VyIHByZXBhcmUgZGF0YSB3aXRoIHBhZGRpbmdcbiAgICAvLyBjb250aW51ZSBwYXRoIG9mZiB0aGUgdGlsZSBieSBzb21lIGFtb3VudCB0byBmaXggcGF0aCBlZGdlcyBiZXR3ZWVuIHRpbGVzXG4gICAgaWYgKChqID09PSAwIHx8IGogPT09IHBvaW50c0xlbiAtIDEpICYmIGdlb20uaXNPblRpbGVCb3VuZGFyeShwb2ludCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KSkge1xuICAgICAgbGV0IGsgPSBqO1xuICAgICAgbGV0IGRpc3QsIGR4LCBkeTtcbiAgICAgIGRvIHtcbiAgICAgICAgayA9IGogPyBrIC0gMSA6IGsgKyAxO1xuICAgICAgICBpZiAoayA8IDAgfHwgayA+PSBwb2ludHNMZW4pIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByZXZQb2ludCA9IHBvaW50c1trXTtcblxuICAgICAgICBkeCA9IHBvaW50WzBdIC0gcHJldlBvaW50WzBdO1xuICAgICAgICBkeSA9IHBvaW50WzFdIC0gcHJldlBvaW50WzFdO1xuICAgICAgICBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgIH0gd2hpbGUgKGRpc3QgPD0gc2tpcCk7XG5cbiAgICAgIC8vIGFsbCBwb2ludHMgYXJlIHNvIGNsb3NlIHRvIGVhY2ggb3RoZXIgdGhhdCBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG9cbiAgICAgIC8vIGRyYXcgdGhlIGxpbmUgYmV5b25kIHRoZSB0aWxlIGJvcmRlciwgc2ltcGx5IHNraXAgdGhlIGVudGlyZSBsaW5lIGZyb21cbiAgICAgIC8vIGhlcmVcbiAgICAgIGlmIChrIDwgMCB8fCBrID49IHBvaW50c0xlbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcG9pbnRbMF0gPSBwb2ludFswXSArIHBhZGRpbmcgKiBkeCAvIGRpc3Q7XG4gICAgICBwb2ludFsxXSA9IHBvaW50WzFdICsgcGFkZGluZyAqIGR5IC8gZGlzdDtcbiAgICB9XG5cbiAgICBpZiAoIWRyYXdPblRpbGVFZGdlcyAmJiBnZW9tLmNoZWNrU2FtZUJvdW5kYXJ5KHBvaW50LCBwb2ludHNbaiAtIDFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpKSB7XG4gICAgICAvLyBEb24ndCBkcmF3IGxpbmVzIG9uIHRpbGUgYm91bmRhcmllc1xuICAgICAgY3R4Lm1vdmVUbyhwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgbGluZSBvciBmaWxsaW5nIGNvbnRvdXJcbiAgICAgIGN0eC5saW5lVG8ocG9pbnRbMF0sIHBvaW50WzFdKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGdlb21ldHJ5LCBkYXNoZXMsIGRyYXdPblRpbGVFZGdlcywgcHJvamVjdFBvaW50RnVuY3Rpb24sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCkge1xuICB2YXIgdHlwZSA9IGdlb21ldHJ5LnR5cGUsXG4gICAgY29vcmRzID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIC8vVE9ETzogVGhvc2UgY29uc3RhbnRzIE1VU1QgYmUgY29uZmlndXJlZCB1biB1cHBlciBkZXNpZ24gbGV2ZWxcbiAgdmFyIHBhZCA9IDUwLCAvLyBob3cgbWFueSBwaXhlbHMgdG8gZHJhdyBvdXQgb2YgdGhlIHRpbGUgdG8gYXZvaWQgcGF0aCBlZGdlcyB3aGVuIGxpbmVzIGNyb3NzZXMgdGlsZSBib3JkZXJzXG4gICAgc2tpcCA9IDA7Ly8yOyAvLyBkbyBub3QgZHJhdyBsaW5lIHNlZ21lbnRzIHNob3J0ZXIgdGhhbiB0aGlzXG5cbiAgLy9Db252ZXJ0IHNpbmdsZSBmZWF0dXJlIHRvIGEgbXVsdC10eXBlIHRvIG1ha2UgcmVuZGVyaW5nIGVhc2llclxuICBpZiAodHlwZSA9PT0gXCJQb2x5Z29uXCIpIHtcbiAgICBjb29yZHMgPSBbY29vcmRzXTtcbiAgICB0eXBlID0gXCJNdWx0aVBvbHlnb25cIjtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcIkxpbmVTdHJpbmdcIikge1xuICAgIGNvb3JkcyA9IFtjb29yZHNdO1xuICAgIHR5cGUgPSBcIk11bHRpTGluZVN0cmluZ1wiO1xuICB9XG5cbiAgaWYgKGRhc2hlcykge1xuICAgIGN0eC5zZXRMaW5lRGFzaChkYXNoZXMpO1xuICB9IGVsc2Uge1xuICAgIGN0eC5zZXRMaW5lRGFzaChbXSk7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gXCJNdWx0aVBvbHlnb25cIikge1xuICAgIC8vSXRlcmF0ZSBieSBQb2x5Z29ucyBpbiBNdWx0aVBvbHlnb25cbiAgICBmb3IgKGxldCBpID0gMCwgcG9seWdvbnNMZW5ndGggPSBjb29yZHMubGVuZ3RoOyBpIDwgcG9seWdvbnNMZW5ndGg7IGkrKykge1xuICAgICAgLy9JdGVyYXRlIGJ5IFJpbmdzIG9mIHRoZSBQb2x5Z29uXG4gICAgICBmb3IgKGxldCBqID0gMCwgcmluZ3NMZW5ndGggPSBjb29yZHNbaV0ubGVuZ3RoOyBqIDwgcmluZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIWNvb3Jkc1tpXVtqXSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGdlb21ldHJ5LCBpLCBqKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludHMgPSBjb29yZHNbaV1bal0ubWFwKHByb2plY3RQb2ludEZ1bmN0aW9uKTtcblxuICAgICAgICBkcmF3UmluZyhwb2ludHMsIGN0eCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBkcmF3T25UaWxlRWRnZXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSBcIk11bHRpTGluZVN0cmluZ1wiKSB7XG4gICAgLy9JdGVyYXRlIGJ5IExpbmVzIGluIE11bHRpTGluZVN0cmluZ1xuICAgIGZvciAobGV0IGkgPSAwLCBsaW5lc0xlbmd0aCA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBsaW5lc0xlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwb2ludHMgPSBjb29yZHNbaV0ubWFwKHByb2plY3RQb2ludEZ1bmN0aW9uKTtcblxuICAgICAgZHJhd1JpbmcocG9pbnRzLCBjdHgsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgZmFsc2UpXG4gICAgfVxuICB9XG59O1xuIiwiLy8ndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCcuL3BhdGgnKTtcbmNvbnN0IGNvbnRleHRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3N0eWxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXRoT3BlbmVkOiBmYWxzZSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoY3R4LCBmZWF0dXJlLCBuZXh0RmVhdHVyZSwge3Byb2plY3RQb2ludEZ1bmN0aW9uLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIGdyb3VwRmVhdHVyZXNCeUFjdGlvbnMsIGdhbGxlcnl9KSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZlYXR1cmUuYWN0aW9ucztcbiAgICBjb25zdCBuZXh0QWN0aW9ucyA9IG5leHRGZWF0dXJlICYmIG5leHRGZWF0dXJlLmFjdGlvbnM7XG4gICAgaWYgKCF0aGlzLnBhdGhPcGVuZWQpIHtcbiAgICAgIHRoaXMucGF0aE9wZW5lZCA9IHRydWU7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgfVxuXG4gICAgcGF0aChjdHgsIGZlYXR1cmUuZ2VvbWV0cnksIGZhbHNlLCB0cnVlLCBwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblxuICAgIGlmIChncm91cEZlYXR1cmVzQnlBY3Rpb25zICYmXG4gICAgICAgIG5leHRGZWF0dXJlICYmXG4gICAgICAgIG5leHRGZWF0dXJlLmtleSA9PT0gZmVhdHVyZS5rZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoJ2ZpbGwtY29sb3InIGluIGFjdGlvbnMpIHtcbiAgICAgIC8vIGZpcnN0IHBhc3MgZmlsbHMgd2l0aCBzb2xpZCBjb2xvclxuICAgICAgbGV0IHN0eWxlID0ge1xuICAgICAgICBmaWxsU3R5bGU6IGFjdGlvbnNbXCJmaWxsLWNvbG9yXCJdLFxuICAgICAgICBnbG9iYWxBbHBoYTogYWN0aW9uc1tcImZpbGwtb3BhY2l0eVwiXSB8fCBhY3Rpb25zWydvcGFjaXR5J11cbiAgICAgIH07XG5cbiAgICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwgc3R5bGUpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG5cbiAgICBpZiAoJ2ZpbGwtaW1hZ2UnIGluIGFjdGlvbnMpIHtcbiAgICAgIC8vIHNlY29uZCBwYXNzIGZpbGxzIHdpdGggdGV4dHVyZVxuICAgICAgY29uc3QgaW1hZ2UgPSBnYWxsZXJ5LmdldEltYWdlKGFjdGlvbnNbJ2ZpbGwtaW1hZ2UnXSk7XG4gICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgbGV0IHN0eWxlID0ge1xuICAgICAgICAgIGZpbGxTdHlsZTogY3R4LmNyZWF0ZVBhdHRlcm4oaW1hZ2UsICdyZXBlYXQnKSxcbiAgICAgICAgICBnbG9iYWxBbHBoYTogYWN0aW9uc1tcImZpbGwtb3BhY2l0eVwiXSB8fCBhY3Rpb25zWydvcGFjaXR5J11cbiAgICAgICAgfTtcbiAgICAgICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCBzdHlsZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXRoT3BlbmVkID0gZmFsc2U7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IENvbGxpc2lvbkJ1ZmZlciA9IHJlcXVpcmUoXCIuLi91dGlscy9jb2xsaXNpb25zXCIpO1xuY29uc3QgY2FudmFzQ29udGV4dCA9IHJlcXVpcmUoXCIuLi91dGlscy9zdHlsZVwiKTtcbmNvbnN0IGZsb3cgPSByZXF1aXJlKFwiLi4vdXRpbHMvZmxvd1wiKTtcblxuY29uc3QgbGluZSA9IHJlcXVpcmUoXCIuL2xpbmVcIik7XG5jb25zdCBwb2x5Z29uID0gcmVxdWlyZShcIi4vcG9seWdvblwiKTtcbmNvbnN0IHRleHQgPSByZXF1aXJlKFwiLi90ZXh0XCIpO1xuY29uc3Qgc2hpZWxkID0gcmVxdWlyZShcIi4vc2hpZWxkXCIpO1xuY29uc3QgaWNvbiA9IHJlcXVpcmUoXCIuL2ljb25cIik7XG5cbmNvbnN0IHJlbmRlcnMgPSB7XG4gIGNhc2luZzogbGluZS5yZW5kZXJDYXNpbmcsXG4gIGxpbmU6IGxpbmUucmVuZGVyLFxuICBwb2x5Z29uOiBwb2x5Z29uLnJlbmRlcixcbiAgdGV4dDogdGV4dC5yZW5kZXIsXG4gIGljb246IGljb24ucmVuZGVyLFxuICBzaGllbGQ6IHNoaWVsZC5yZW5kZXJcbn1cblxuZnVuY3Rpb24gUmVuZGVyZXIoZ2FsbGVyeSwgb3B0aW9ucykge1xuICB0aGlzLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMgPSBvcHRpb25zLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMgfHwgZmFsc2U7XG4gIHRoaXMuZGVidWcgPSBvcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICB0aGlzLnByb2plY3RQb2ludEZ1bmN0aW9uID0gb3B0aW9ucy5wcm9qZWN0UG9pbnRGdW5jdGlvbjtcbiAgdGhpcy5nZXRGcmFtZSA9IG9wdGlvbnMuZ2V0RnJhbWU7XG4gIHRoaXMuZ2FsbGVyeSA9IGdhbGxlcnk7XG59XG5cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24obGF5ZXJzLCBjdHgsIHdpZHRoLCBoZWlnaHQsIHpvb20pIHtcbiAgY3R4LmZpbGxTdHlsZSA9ICcjZGRkJztcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gIC8vVE9ETzogU3R5bGVNYW5hZ2VyIHNob3VsZCBjcmVhdGUgYmFja2dyb3VuZCBhcyBhIGxheWVyIGluc3RlYWQgb2YgbWVzc2luZyB3aXRoIHN0eWxlcyBtYW51YWxseVxuICAvLyB2YXIgc3R5bGUgPSB0aGlzLnN0eWxlTWFuYWdlci5yZXN0eWxlKHN0eWxlcywge30sIHt9LCB6b29tLCAnY2FudmFzJywgJ2NhbnZhcycpO1xuICAvL1xuICAvLyB2YXIgZmlsbFJlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vICAgICBjdHguZmlsbFJlY3QoLTEsIC0xLCB3aWR0aCArIDEsIGhlaWdodCArIDEpO1xuICAvLyB9O1xuICAvL1xuICAvLyBmb3IgKHZhciBpIGluIHN0eWxlKSB7XG4gIC8vICAgICBwb2x5Z29uLmZpbGwoY3R4LCBzdHlsZVtpXSwgZmlsbFJlY3QpO1xuICAvLyB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbGxpc2lvbnMoY3R4LCBub2RlKSB7XG4gIGN0eC5zdHJva2VTdHlsZSA9ICdyZWQnO1xuICBjdHgubGluZVdpZHRoID0gMTtcbiAgaWYgKG5vZGUubGVhZikge1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoYm94KSA9PiBjdHguc3Ryb2tlUmVjdChib3gubWluWCwgYm94Lm1pblksIGJveC5tYXhYIC0gYm94Lm1pblgsIGJveC5tYXhZIC0gYm94Lm1pblkpKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiByZW5kZXJDb2xsaXNpb25zKGN0eCwgY2hpbGQpKTtcbiAgfVxufVxuXG5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24obGF5ZXJzLCBjdHgsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgcHJvamVjdFBvaW50RnVuY3Rpb24sIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gIHZhciBjb2xsaXNpb25CdWZmZXIgPSBuZXcgQ29sbGlzaW9uQnVmZmVyKHRpbGVIZWlnaHQsIHRpbGVXaWR0aCk7XG4gIC8vIHJlbmRlciB0aGUgbWFwXG4gIGNhbnZhc0NvbnRleHQuYXBwbHlEZWZhdWx0cyhjdHgpO1xuXG4gIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgY29sbGlzaW9uQnVmZmVyOiBjb2xsaXNpb25CdWZmZXIsXG4gICAgZ2FsbGVyeTogdGhpcy5nYWxsZXJ5LFxuICAgIHRpbGVXaWR0aDogdGlsZVdpZHRoLFxuICAgIHRpbGVIZWlnaHQ6IHRpbGVIZWlnaHQsXG4gICAgcHJvamVjdFBvaW50RnVuY3Rpb246IHByb2plY3RQb2ludEZ1bmN0aW9uLFxuICAgIGdyb3VwRmVhdHVyZXNCeUFjdGlvbnM6IHNlbGYuZ3JvdXBGZWF0dXJlc0J5QWN0aW9uc1xuICB9XG5cbiAgY29uc3QgZnVuY3MgPSBsYXllcnMubWFwKChsYXllcikgPT4gKChuZXh0KSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSBsYXllci5mZWF0dXJlcztcblxuICAgIC8vVE9ETzogRW1pdCBldmVudFxuICAgIGNvbnNvbGUudGltZShsYXllci5yZW5kZXIpO1xuXG4gICAgY29uc3QgcmVuZGVyRm4gPSByZW5kZXJzW2xheWVyLnJlbmRlcl07XG4gICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IGZlYXR1cmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICByZW5kZXJGbihjdHgsIGZlYXR1cmVzW2pdLCBmZWF0dXJlc1tqICsgMV0sIGNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vVE9ETzogRW1pdCBldmVudFxuICAgIGNvbnNvbGUudGltZUVuZChsYXllci5yZW5kZXIpO1xuXG4gICAgbmV4dCgpO1xuICB9KSk7XG5cbiAgZmxvdy5zZXJpZXMoZnVuY3MsIHNlbGYuZ2V0RnJhbWUsICgpID0+IHtcbiAgICBpZiAoc2VsZi5kZWJ1Zykge1xuICAgICAgcmVuZGVyQ29sbGlzaW9ucyhjdHgsIGNvbGxpc2lvbkJ1ZmZlci5idWZmZXIuZGF0YSk7XG4gICAgfVxuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG5jb25zdCBjb250ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9zdHlsZScpO1xuY29uc3QgZ2VvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL2dlb20nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlbmRlcjogZnVuY3Rpb24gKGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgY29sbGlzaW9uQnVmZmVyLCBnYWxsZXJ5fSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG5cbiAgICBjb25zdCBwb2ludCA9IGdlb20uZ2V0UmVwclBvaW50KGZlYXR1cmUuZ2VvbWV0cnksIHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgICBpZiAoIXBvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGltZywgbGVuID0gMCwgZm91bmQgPSBmYWxzZSwgaSwgc2duO1xuXG4gICAgaWYgKGFjdGlvbnNbXCJzaGllbGQtaW1hZ2VcIl0pIHtcbiAgICAgIGltZyA9IGdhbGxlcnkuZ2V0SW1hZ2UoYWN0aW9uc1tcInNoaWVsZC1pbWFnZVwiXSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBmb250OiBjb250ZXh0VXRpbHMuY29tcG9zZUZvbnREZWNsYXJhdGlvbihhY3Rpb25zW1wic2hpZWxkLWZvbnQtZmFtaWx5XCJdIHx8IGFjdGlvbnNbXCJmb250LWZhbWlseVwiXSwgYWN0aW9uc1tcInNoaWVsZC1mb250LXNpemVcIl0gfHwgYWN0aW9uc1tcImZvbnQtc2l6ZVwiXSwgYWN0aW9ucyksXG4gICAgICBmaWxsU3R5bGU6IGFjdGlvbnNbXCJzaGllbGQtdGV4dC1jb2xvclwiXSxcbiAgICAgIGdsb2JhbEFscGhhOiBhY3Rpb25zW1wic2hpZWxkLXRleHQtb3BhY2l0eVwiXSB8fCBhY3Rpb25zWydvcGFjaXR5J10sXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgdGV4dEJhc2VsaW5lOiAnbWlkZGxlJ1xuICAgIH07XG5cbiAgICBjb250ZXh0VXRpbHMuYXBwbHlTdHlsZShjdHgsIHN0eWxlKTtcblxuICAgIHZhciB0ZXh0ID0gU3RyaW5nKHN0eWxlWydzaGllbGQtdGV4dCddKSxcbiAgICAgIHRleHRXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCxcbiAgICAgIGxldHRlcldpZHRoID0gdGV4dFdpZHRoIC8gdGV4dC5sZW5ndGgsXG4gICAgICBjb2xsaXNpb25XaWR0aCA9IHRleHRXaWR0aCArIDIsXG4gICAgICBjb2xsaXNpb25IZWlnaHQgPSBsZXR0ZXJXaWR0aCAqIDEuODtcblxuICAgIGlmIChmZWF0dXJlLnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgbGVuID0gZ2VvbS5nZXRQb2x5TGVuZ3RoKGZlYXR1cmUuY29vcmRpbmF0ZXMpO1xuXG4gICAgICBpZiAoTWF0aC5tYXgoY29sbGlzaW9uSGVpZ2h0IC8gaHMsIGNvbGxpc2lvbldpZHRoIC8gd3MpID4gbGVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMCwgc2duID0gMTsgaSA8IGxlbiAvIDI7IGkgKz0gTWF0aC5tYXgobGVuIC8gMzAsIGNvbGxpc2lvbkhlaWdodCAvIHdzKSwgc2duICo9IC0xKSB7XG4gICAgICAgIHZhciByZXByUG9pbnQgPSBnZW9tLmdldEFuZ2xlQW5kQ29vcmRzQXRMZW5ndGgoZmVhdHVyZS5jb29yZGluYXRlcywgbGVuIC8gMiArIHNnbiAqIGksIDApO1xuICAgICAgICBpZiAoIXJlcHJQb2ludCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVwclBvaW50ID0gW3JlcHJQb2ludFsxXSwgcmVwclBvaW50WzJdXTtcblxuICAgICAgICBwb2ludCA9IGdlb20udHJhbnNmb3JtUG9pbnQocmVwclBvaW50LCB3cywgaHMpO1xuICAgICAgICBpZiAoaW1nICYmICFhY3Rpb25zW1wiYWxsb3ctb3ZlcmxhcFwiXSAmJiBjb2xsaXNpb25CdWZmZXIuY2hlY2tQb2ludFdIKHBvaW50LCBpbWcud2lkdGgsIGltZy5oZWlnaHQsIGZlYXR1cmUua290aGljSWQpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCghYWN0aW9uc1tcImFsbG93LW92ZXJsYXBcIl0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25CdWZmZXIuY2hlY2tQb2ludFdIKHBvaW50LCBjb2xsaXNpb25XaWR0aCwgY29sbGlzaW9uSGVpZ2h0LCBmZWF0dXJlLmtvdGhpY0lkKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzdHlsZVtcInNoaWVsZC1jYXNpbmctd2lkdGhcIl0pIHtcbiAgICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwge1xuICAgICAgICBmaWxsU3R5bGU6IHN0eWxlW1wic2hpZWxkLWNhc2luZy1jb2xvclwiXSB8fCBcIiMwMDAwMDBcIixcbiAgICAgICAgZ2xvYmFsQWxwaGE6IHN0eWxlW1wic2hpZWxkLWNhc2luZy1vcGFjaXR5XCJdIHx8IHN0eWxlWydvcGFjaXR5J10gfHwgMVxuICAgICAgfSk7XG4gICAgICB2YXIgcCA9IHN0eWxlW1wic2hpZWxkLWNhc2luZy13aWR0aFwiXSArIChzdHlsZVtcInNoaWVsZC1mcmFtZS13aWR0aFwiXSB8fCAwKTtcbiAgICAgIGN0eC5maWxsUmVjdChwb2ludFswXSAtIGNvbGxpc2lvbldpZHRoIC8gMiAtIHAsXG4gICAgICAgIHBvaW50WzFdIC0gY29sbGlzaW9uSGVpZ2h0IC8gMiAtIHAsXG4gICAgICAgIGNvbGxpc2lvbldpZHRoICsgMiAqIHAsXG4gICAgICAgIGNvbGxpc2lvbkhlaWdodCArIDIgKiBwKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGVbXCJzaGllbGQtZnJhbWUtd2lkdGhcIl0pIHtcbiAgICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwge1xuICAgICAgICBmaWxsU3R5bGU6IHN0eWxlW1wic2hpZWxkLWZyYW1lLWNvbG9yXCJdIHx8IFwiIzAwMDAwMFwiLFxuICAgICAgICBnbG9iYWxBbHBoYTogc3R5bGVbXCJzaGllbGQtZnJhbWUtb3BhY2l0eVwiXSB8fCBzdHlsZVsnb3BhY2l0eSddIHx8IDFcbiAgICAgIH0pO1xuICAgICAgY3R4LmZpbGxSZWN0KHBvaW50WzBdIC0gY29sbGlzaW9uV2lkdGggLyAyIC0gc3R5bGVbXCJzaGllbGQtZnJhbWUtd2lkdGhcIl0sXG4gICAgICAgIHBvaW50WzFdIC0gY29sbGlzaW9uSGVpZ2h0IC8gMiAtIHN0eWxlW1wic2hpZWxkLWZyYW1lLXdpZHRoXCJdLFxuICAgICAgICBjb2xsaXNpb25XaWR0aCArIDIgKiBzdHlsZVtcInNoaWVsZC1mcmFtZS13aWR0aFwiXSxcbiAgICAgICAgY29sbGlzaW9uSGVpZ2h0ICsgMiAqIHN0eWxlW1wic2hpZWxkLWZyYW1lLXdpZHRoXCJdKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGVbXCJzaGllbGQtY29sb3JcIl0pIHtcbiAgICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwge1xuICAgICAgICBmaWxsU3R5bGU6IHN0eWxlW1wic2hpZWxkLWNvbG9yXCJdIHx8IFwiIzAwMDAwMFwiLFxuICAgICAgICBnbG9iYWxBbHBoYTogc3R5bGVbXCJzaGllbGQtb3BhY2l0eVwiXSB8fCBzdHlsZVsnb3BhY2l0eSddIHx8IDFcbiAgICAgIH0pO1xuICAgICAgY3R4LmZpbGxSZWN0KHBvaW50WzBdIC0gY29sbGlzaW9uV2lkdGggLyAyLFxuICAgICAgICBwb2ludFsxXSAtIGNvbGxpc2lvbkhlaWdodCAvIDIsXG4gICAgICAgIGNvbGxpc2lvbldpZHRoLFxuICAgICAgICBjb2xsaXNpb25IZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChpbWcpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLFxuICAgICAgICBNYXRoLmZsb29yKHBvaW50WzBdIC0gaW1nLndpZHRoIC8gMiksXG4gICAgICAgIE1hdGguZmxvb3IocG9pbnRbMV0gLSBpbWcuaGVpZ2h0IC8gMikpO1xuICAgIH1cbiAgICBjb250ZXh0VXRpbHMuYXBwbHlTdHlsZShjdHgsIHtcbiAgICAgIGZpbGxTdHlsZTogc3R5bGVbXCJzaGllbGQtdGV4dC1jb2xvclwiXSB8fCBcIiMwMDAwMDBcIixcbiAgICAgIGdsb2JhbEFscGhhOiBzdHlsZVtcInNoaWVsZC10ZXh0LW9wYWNpdHlcIl0gfHwgc3R5bGVbJ29wYWNpdHknXSB8fCAxXG4gICAgfSk7XG5cbiAgICBjdHguZmlsbFRleHQodGV4dCwgcG9pbnRbMF0sIE1hdGguY2VpbChwb2ludFsxXSkpO1xuICAgIGlmIChpbWcpIHtcbiAgICAgIGNvbGxpc2lvbkJ1ZmZlci5hZGRQb2ludFdIKHBvaW50LCBpbWcud2lkdGgsIGltZy5oZWlnaHQsIDAsIGZlYXR1cmUua290aGljSWQpO1xuICAgIH1cblxuICAgIGNvbGxpc2lvbkJ1ZmZlci5hZGRQb2ludFdIKHBvaW50LCBjb2xsaXNpb25IZWlnaHQsIGNvbGxpc2lvbldpZHRoLFxuICAgICAgKHBhcnNlRmxvYXQoc3R5bGVbXCJzaGllbGQtY2FzaW5nLXdpZHRoXCJdKSB8fCAwKSArIChwYXJzZUZsb2F0KHN0eWxlW1wic2hpZWxkLWZyYW1lLXdpZHRoXCJdKSB8fCAwKSArIChwYXJzZUZsb2F0KHN0eWxlW1wiLXgtbWFwbmlrLW1pbi1kaXN0YW5jZVwiXSkgfHwgMzApLCBmZWF0dXJlLmtvdGhpY0lkKTtcblxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZW9tID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2VvbScpO1xuY29uc3QgY29udGV4dFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvc3R5bGUnKTtcbi8vdmFyIHRleHRPblBhdGggPSByZXF1aXJlKFwiLi90ZXh0b25wYXRoXCIpLnRleHRPblBhdGg7XG5jb25zdCB0ZXh0T25QYXRoID0gcmVxdWlyZShcIi4vY3VydmVkdGV4dFwiKS5yZW5kZXJcblxuZnVuY3Rpb24gcmVuZGVyVGV4dChjdHgsIGZlYXR1cmUsIG5leHRGZWF0dXJlLCB7cHJvamVjdFBvaW50RnVuY3Rpb24sIGNvbGxpc2lvbkJ1ZmZlcn0pIHtcbiAgY29uc3QgYWN0aW9ucyA9IGZlYXR1cmUuYWN0aW9ucztcblxuICBjb25zdCBoYXNIYWxvID0gJ3RleHQtaGFsby1yYWRpdXMnIGluIGFjdGlvbnMgJiYgcGFyc2VJbnQoYWN0aW9uc1sndGV4dC1oYWxvLXJhZGl1cyddKSA+IDA7XG5cbiAgY29uc3Qgc3R5bGUgPSB7XG4gICAgbGluZVdpZHRoOiBhY3Rpb25zWyd0ZXh0LWhhbG8tcmFkaXVzJ10sXG4gICAgZm9udDogY29udGV4dFV0aWxzLmNvbXBvc2VGb250RGVjbGFyYXRpb24oYWN0aW9uc1snZm9udC1mYW1pbHknXSwgYWN0aW9uc1snZm9udC1zaXplJ10sIGFjdGlvbnMpLFxuICAgIGZpbGxTdHlsZTogYWN0aW9uc1sndGV4dC1jb2xvciddLFxuICAgIHN0cm9rZVN0eWxlOiBhY3Rpb25zWyd0ZXh0LWhhbG8tY29sb3InXSxcbiAgICBnbG9iYWxBbHBoYTogYWN0aW9uc1sndGV4dC1vcGFjaXR5J10gfHwgYWN0aW9uc1snb3BhY2l0eSddLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgdGV4dEJhc2VsaW5lOiAnbWlkZGxlJ1xuICB9O1xuXG4gIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwgc3R5bGUpO1xuXG4gIHZhciB0ZXh0ID0gU3RyaW5nKGFjdGlvbnMudGV4dCkudHJpbSgpO1xuICBpZiAoYWN0aW9uc1sndGV4dC10cmFuc2Zvcm0nXSA9PT0gJ3VwcGVyY2FzZScpIHtcbiAgICB0ZXh0ID0gdGV4dC50b1VwcGVyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKGFjdGlvbnNbJ3RleHQtdHJhbnNmb3JtJ10gPT09ICdsb3dlcmNhc2UnKSB7XG4gICAgdGV4dCA9IHRleHQudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmIChhY3Rpb25zWyd0ZXh0LXRyYW5zZm9ybSddID09PSAnY2FwaXRhbGl6ZScpIHtcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXnxcXHMpXFxTL2csIGZ1bmN0aW9uKGNoKSB7IHJldHVybiBjaC50b1VwcGVyQ2FzZSgpOyB9KTtcbiAgfVxuXG4gIGlmIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJyB8fCBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAvL1RPRE86IFJlZmFjdG9yLCBjYWxjdWxhdGUgcmVwcmVzZW50YXRpdmUgcG9pbnQgb25seSBvbmNlXG4gICAgY29uc3QgcG9pbnQgPSBnZW9tLmdldFJlcHJQb2ludChmZWF0dXJlLmdlb21ldHJ5LCBwcm9qZWN0UG9pbnRGdW5jdGlvbik7XG4gICAgaWYgKCFwb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHRXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICBjb25zdCBsZXR0ZXJXaWR0aCA9IHRleHRXaWR0aCAvIHRleHQubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gdGV4dFdpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IGxldHRlcldpZHRoICogMi41O1xuICAgIGNvbnN0IG9mZnNldFkgPSBhY3Rpb25zWyd0ZXh0LW9mZnNldCddO1xuXG4gICAgY29uc3QgY2VudGVyID0gW3BvaW50WzBdLCBwb2ludFsxXSArIG9mZnNldFldO1xuICAgIGlmICghYWN0aW9uc1sndGV4dC1hbGxvdy1vdmVybGFwJ10pIHtcbiAgICAgIGlmIChjb2xsaXNpb25CdWZmZXIuY2hlY2tQb2ludFdIKGNlbnRlciwgd2lkdGgsIGhlaWdodCwgZmVhdHVyZS5rb3RoaWNJZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNIYWxvKSB7XG4gICAgICBjdHguc3Ryb2tlVGV4dCh0ZXh0LCBjZW50ZXJbMF0sIGNlbnRlclsxXSk7XG4gICAgfVxuICAgIGN0eC5maWxsVGV4dCh0ZXh0LCBjZW50ZXJbMF0sIGNlbnRlclsxXSk7XG5cbiAgICBjb25zdCBwYWRkaW5nID0gcGFyc2VGbG9hdChhY3Rpb25zWycteC1rb3RoaWMtcGFkZGluZyddKTtcbiAgICBjb2xsaXNpb25CdWZmZXIuYWRkUG9pbnRXSChwb2ludCwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZmVhdHVyZS5rb3RoaWNJZCk7XG4gIH0gZWxzZSBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICBjb25zdCBwb2ludHMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLm1hcChwcm9qZWN0UG9pbnRGdW5jdGlvbik7XG4gICAgdGV4dE9uUGF0aChjdHgsIHBvaW50cywgdGV4dCwgaGFzSGFsbywgY29sbGlzaW9uQnVmZmVyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJUZXh0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFVkFMX0ZVTkNUSU9OUyA9IHtcbiAgbWluOiBmdW5jdGlvbiAoLyouLi4qLykge1xuICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICB9LFxuXG4gIG1heDogZnVuY3Rpb24gKC8qLi4uKi8pIHtcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfSxcblxuICBhbnk6IGZ1bmN0aW9uICgvKi4uLiovKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0eXBlb2YoYXJndW1lbnRzW2ldKSAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJndW1lbnRzW2ldICE9PSAnJykge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSxcblxuICBudW06IGZ1bmN0aW9uIChhcmcpIHtcbiAgICBjb25zdCBuID0gcGFyc2VGbG9hdChhcmcpO1xuICAgIHJldHVybiBpc05hTihuKSA/IDAgOiBuO1xuICB9LFxuXG4gIHN0cjogZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiAnJyArIGFyZztcbiAgfSxcblxuICBpbnQ6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICBjb25zdCBuID0gcGFyc2VJbnQoYXJnLCAxMCk7XG4gICAgcmV0dXJuIGlzTmFOKG4pID8gMCA6IG47XG4gIH0sXG5cbiAgc3FydDogZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBNYXRoLnNxcnQoYXJnKTtcbiAgfSxcblxuICBjb25kOiBmdW5jdGlvbiAoYXJnLCB0cnVlRXhwciwgZmFsc2VFeHByKSB7XG4gICAgdHJ1ZUV4cHIgPSB0cnVlRXhwciB8fCB0cnVlO1xuICAgIGZhbHNlRXhwciA9IGZhbHNlRXhwciB8fCBmYWxzZTtcblxuICAgIHJldHVybiBhcmcgPyB0cnVlRXhwciA6IGZhbHNlRXhwcjtcbiAgfSxcblxuICBtZXRyaWM6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICBpZiAoL1xcZFxccyptbSQvLnRlc3QoYXJnKSkge1xuICAgICAgcmV0dXJuIDAuMDAxICogcGFyc2VGbG9hdChhcmcpO1xuICAgIH0gZWxzZSBpZiAoL1xcZFxccypjbSQvLnRlc3QoYXJnKSkge1xuICAgICAgcmV0dXJuIDAuMDEgKiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgfSBlbHNlIGlmICgvXFxkXFxzKmRtJC8udGVzdChhcmcpKSB7XG4gICAgICByZXR1cm4gMC4xICogcGFyc2VGbG9hdChhcmcpO1xuICAgIH0gZWxzZSBpZiAoL1xcZFxccyprbSQvLnRlc3QoYXJnKSkge1xuICAgICAgcmV0dXJuIDEwMDAgKiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgfSBlbHNlIGlmICgvXFxkXFxzKihpbnxcIikkLy50ZXN0KGFyZykpIHtcbiAgICAgIHJldHVybiAwLjAyNTQgKiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgfSBlbHNlIGlmICgvXFxkXFxzKihmdHwnKSQvLnRlc3QoYXJnKSkge1xuICAgICAgcmV0dXJuIDAuMzA0OCAqIHBhcnNlRmxvYXQoYXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXJnKTtcbiAgICB9XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudHNbMV0pID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzWzFdLmpvaW4oYXJndW1lbnRzWzBdKTtcbiAgICB9XG4gICAgdmFyIHRhZ1N0cmluZyA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGFnU3RyaW5nID0gdGFnU3RyaW5nLmNvbmNhdChhcmd1bWVudHNbMF0pLmNvbmNhdChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0YWdTdHJpbmcuc3Vic3RyKGFyZ3VtZW50c1swXS5sZW5ndGgpO1xuICB9LFxuXG4gIHNwbGl0OiBmdW5jdGlvbiAoc2VwLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQuc3BsaXQoc2VwKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uKGFyciwgaW5kZXgpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIGlmICghL15bMC05XSskLy50ZXN0KGluZGV4KSB8fCBpbmRleCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyW2luZGV4XTtcbiAgfSxcblxuICBzZXQ6IGZ1bmN0aW9uKGFyciwgaW5kZXgsIHRleHQpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgaWYgKCEvXlswLTldKyQvLnRlc3QoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cblxuICAgIGFycltpbmRleF0gPSB0ZXh0O1xuXG4gICAgcmV0dXJuIGFycjtcbiAgfSxcblxuICBjb3VudDogZnVuY3Rpb24oYXJyKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyLmxlbmd0aDtcbiAgfSxcblxuICBsaXN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICB9LFxuXG4gIGFwcGVuZDogZnVuY3Rpb24obHN0LCB2KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChsc3QpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbHN0LnB1c2godik7XG5cbiAgICByZXR1cm4gbHN0O1xuICB9LFxuXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihsc3QsIHYpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGxzdCkgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGxzdC5pbmRleE9mKHYpID49IDApO1xuICB9LFxuXG4gIHNvcnQ6IGZ1bmN0aW9uKGxzdCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobHN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxzdC5zb3J0KCk7XG5cbiAgICByZXR1cm4gbHN0O1xuICB9LFxuXG4gIHJldmVyc2U6IGZ1bmN0aW9uKGxzdCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobHN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBsc3QucmV2ZXJzZSgpO1xuICB9LFxufTtcblxuZnVuY3Rpb24gZXZhbEJpbmFyeU9wKGxlZnQsIG9wLCByaWdodCkge1xuICBzd2l0Y2ggKG9wKSB7XG4gIGNhc2UgJysnOlxuICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gIGNhc2UgJy0nOlxuICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gIGNhc2UgJyonOlxuICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gIGNhc2UgJy8nOlxuICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gIGNhc2UgJyUnOlxuICAgIHJldHVybiBsZWZ0ICUgcmlnaHQ7XG4gIGRlZmF1bHQ6XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgYmluYXJ5IG9wZXJ0YXRvciBpbiBldmFsIFwiICsgSlNPTi5zdHJpbmdpZnkob3ApKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmFsRnVuYyhmdW5jLCBhcmdzLCB0YWdzLCBhY3Rpb25zLCBsb2NhbGVzKSB7XG4gIHN3aXRjaCAoZnVuYykge1xuICBjYXNlICd0YWcnOlxuICAgIGlmIChhcmdzLmxlbmd0aCAhPSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YWcoKSBmdW5jdGlvbiBhbGxvd3Mgb25seSBvbmUgYXJndW1lbnRcIik7XG4gICAgfVxuICAgIHJldHVybiBhcmdzWzBdIGluIHRhZ3MgPyB0YWdzW2FyZ3NbMF1dIDogJyc7XG4gIGNhc2UgJ3Byb3AnOlxuICAgIGlmIChhcmdzLmxlbmd0aCAhPSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwcm9wKCkgZnVuY3Rpb24gYWxsb3dzIG9ubHkgb25lIGFyZ3VtZW50XCIpO1xuICAgIH1cbiAgICByZXR1cm4gYXJnc1swXSBpbiBhY3Rpb25zID8gYWN0aW9uc1thcmdzWzBdXSA6ICcnO1xuICBjYXNlICdsb2NhbGl6ZSc6XG4gICAgaWYgKGFyZ3MubGVuZ3RoICE9IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImxvY2FsaXplKCkgZnVuY3Rpb24gYWxsb3dzIG9ubHkgb25lIGFyZ3VtZW50XCIpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2FsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHRhZyA9IGFyZ3NbMF0gKyAnOicgKyBsb2NhbGVzW2ldO1xuICAgICAgaWYgKHRhZyBpbiB0YWdzKSB7XG4gICAgICAgIHJldHVybiB0YWdzW3RhZ107XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3NbMF0gaW4gdGFncyA/IHRhZ3NbYXJnc1swXV0gOiAnJztcbiAgZGVmYXVsdDpcbiAgICBpZiAoIShmdW5jIGluIEVWQUxfRlVOQ1RJT05TKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBmdW5jdGlvbiBpbiBldmFsIFwiICsgSlNPTi5zdHJpbmdpZnkoZnVuYykpO1xuICAgIH1cbiAgICByZXR1cm4gRVZBTF9GVU5DVElPTlNbZnVuY10uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZhbEV4cHIoZXhwciwgdGFncz17fSwgYWN0aW9ucz17fSwgbG9jYWxlcz1bXSkge1xuICBpZiAoIWV4cHIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzd2l0Y2ggKGV4cHIudHlwZSkge1xuICBjYXNlIFwiYmluYXJ5X29wXCI6XG4gICAgcmV0dXJuIGV2YWxCaW5hcnlPcChldmFsRXhwcihleHByLmxlZnQsIHRhZ3MsIGFjdGlvbnMsIGxvY2FsZXMpLCBleHByLm9wLCBldmFsRXhwcihleHByLnJpZ2h0LCB0YWdzLCBhY3Rpb25zLCBsb2NhbGVzKSk7XG4gIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgIHJldHVybiBldmFsRnVuYyhleHByLmZ1bmMsIGV4cHIuYXJncy5tYXAoKHgpID0+IGV2YWxFeHByKHgsIHRhZ3MsIGFjdGlvbnMpKSwgdGFncywgYWN0aW9ucywgbG9jYWxlcyk7XG4gIGNhc2UgXCJzdHJpbmdcIjpcbiAgY2FzZSBcIm51bWJlclwiOlxuICAgIHJldHVybiBleHByLnZhbHVlO1xuICBkZWZhdWx0OlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGV4cHJlc3Npb24gdHlwZSBcIiArIEpTT04uc3RyaW5naWZ5KGV4cHIpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmRLbm93blRhZ3ModGFncywgZXhwciwgbG9jYWxlcykge1xuXG4gIHN3aXRjaCAoZXhwci50eXBlKSB7XG4gIGNhc2UgXCJiaW5hcnlfb3BcIjpcbiAgICBhcHBlbmRLbm93blRhZ3ModGFncywgZXhwci5sZWZ0KTtcbiAgICBhcHBlbmRLbm93blRhZ3ModGFncywgZXhwci5yaWdodCk7XG4gICAgYnJlYWs7XG4gIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgIGlmIChleHByLmZ1bmMgPT09IFwidGFnXCIpIHtcbiAgICAgIGlmIChleHByLmFyZ3MgJiYgZXhwci5hcmdzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IGV2YWxFeHByKGV4cHIuYXJnc1swXSwge30sIHt9KTtcbiAgICAgICAgdGFnc1t0YWddID0gJ2t2JztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV4cHIuZnVuYyA9PT0gXCJsb2NhbGl6ZVwiKSB7XG4gICAgICBpZiAoZXhwci5hcmdzICYmIGV4cHIuYXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICBjb25zdCB0YWcgPSBldmFsRXhwcihleHByLmFyZ3NbMF0sIHt9LCB7fSk7XG4gICAgICAgIHRhZ3NbdGFnXSA9ICdrdic7XG4gICAgICAgIGxvY2FsZXMubWFwKChsb2NhbGUpID0+IHRhZyArIFwiOlwiICsgbG9jYWxlKVxuICAgICAgICAgIC5mb3JFYWNoKChrKSA9PiB0YWdzW2tdID0gJ2t2Jyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cHIuYXJncy5mb3JFYWNoKChhcmcpID0+IGFwcGVuZEtub3duVGFncyh0YWdzLCBhcmcsIGxvY2FsZXMpKTtcbiAgICB9XG4gICAgYnJlYWs7XG4gIGNhc2UgXCJzdHJpbmdcIjpcbiAgY2FzZSBcIm51bWJlclwiOlxuICAgIGJyZWFrO1xuICBkZWZhdWx0OlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGV2YWwgdHlwZSBcIiArIEpTT04uc3RyaW5naWZ5KGV4cHIpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXZhbEV4cHI6IGV2YWxFeHByLFxuICBhcHBlbmRLbm93blRhZ3M6IGFwcGVuZEtub3duVGFnc1xufTtcbiIsImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IGxvYWRJbWFnZSB9ID0gcmVxdWlyZSgnY2FudmFzJylcblxuZnVuY3Rpb24gR2FsbGVyeShvcHRpb25zKSB7XG4gIHRoaXMubG9jYWxJbWFnZXNEaXJlY3RvcnkgPSBvcHRpb25zICYmIG9wdGlvbnMubG9jYWxJbWFnZXNEaXJlY3Rvcnk7XG4gIHRoaXMuaW1hZ2VzID0ge307XG59XG5cbkdhbGxlcnkucHJvdG90eXBlLnByZWxvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGNvbnN0IHVyaVJlZ2V4cCA9IC9odHRwcz86XFwvXFwvLztcblxuICAvL0V4dGVybmFsIGltYWdlc1xuICB2YXIgcHJvbWlzZXMgPSBpbWFnZXMuZmlsdGVyKChpbWFnZSkgPT4gaW1hZ2UubWF0Y2godXJpUmVnZXhwKSlcbiAgICAgIC5tYXAoKGltYWdlKSA9PiBsb2FkSW1hZ2UoaW1hZ2UpLnRoZW4oKGRhdGEpID0+IHNlbGYuaW1hZ2VzW2ltYWdlXSA9IGRhdGEpKTtcblxuICBpZiAodGhpcy5sb2NhbEltYWdlc0RpcmVjdG9yeSkge1xuICAgIGNvbnN0IGxvY2FsUHJvbWlzZXMgPSBpbWFnZXMuZmlsdGVyKChpbWFnZSkgPT4gIWltYWdlLm1hdGNoKHVyaVJlZ2V4cCkpXG4gICAgICAubWFwKChpbWFnZSkgPT4gbG9hZEltYWdlKHBhdGguam9pbihzZWxmLmxvY2FsSW1hZ2VzRGlyZWN0b3J5LCBpbWFnZSkpLnRoZW4oKGRhdGEpID0+IHNlbGYuaW1hZ2VzW2ltYWdlXSA9IGRhdGEpKTtcbiAgICBwcm9taXNlcyA9IHByb21pc2VzLmNvbmNhdChsb2NhbFByb21pc2VzKTtcbiAgfVxuXG4gIHByb21pc2VzID0gcHJvbWlzZXMubWFwKChwcm9taXNlKSA9PiBwcm9taXNlKTtcblxuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5HYWxsZXJ5LnByb3RvdHlwZS5nZXRJbWFnZSA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gIHJldHVybiB0aGlzLmltYWdlc1tpbWFnZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FsbGVyeTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcnVsZXMgPSByZXF1aXJlKFwiLi9ydWxlc1wiKTtcbmNvbnN0IG1hcGNzcyA9IHJlcXVpcmUoXCJtYXBjc3NcIik7XG5cbi8qKlxuICoqIEBjb25zdHJ1Y3RvclxuICoqIEBwYXJhbSB7c3RyaW5nfSBjc3Mg4oCUIE1hcENTUyBzdHlsZSBpbiBhIHBsYWluIHRleHRcbiAqKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDigJQgc3R5bGUgb3B0aW9uc1xuICoqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmNhY2hlOk9iamVjdCDigJQgY2FjaGUgaW1wbGVtZW50YXRpb24uIElmIG5vdCBzcGVjaWZpZWQsIGNhY2hpbmcgd2lsbCBiZSBkaXNhYmxlZC5cbiAqKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5sb2NhbGVzOkFycmF5W1N0cmluZ10gbGlzdCBvZiBzdXBwb3J0ZWQgbG9jYWxlcyBzb3J0ZWQgYnkgbW9zdCBwcmVmZXJlZCBmaXJzdC4gSWYgbm90IHNwZWNpZmllZCwgbG9jYWxpemF0aW9uIHdpbGwgYmUgZGlzYWJsZWRcbiAqKi9cbmZ1bmN0aW9uIE1hcENTUyhjc3MsIG9wdGlvbnM9e30pIHtcbiAgaWYgKHR5cGVvZihjc3MpICE9PSAnc3RyaW5nJyApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ2NzcycgcGFyYW1ldGVyIGlzIHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgY29uc3QgYXN0ID0gbWFwY3NzLnBhcnNlKGNzcyk7XG5cbiAgdGhpcy5ydWxlcyA9IGFzdDtcblxuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIHRoaXMuY2FjaGUgPSBvcHRpb25zLmNhY2hlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMubG9jYWxlcykge1xuICAgIHRoaXMubG9jYWxlcyA9IG9wdGlvbnMubG9jYWxlcztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmxvY2FsZXMgPSBbXTtcbiAgfVxuXG4gIHRoaXMua25vd25UYWdzID0gcnVsZXMubGlzdEtub3duVGFncyhhc3QsIHRoaXMubG9jYWxlcyk7XG4gIHRoaXMuaW1hZ2VzID0gcnVsZXMubGlzdEtub3duSW1hZ2VzKGFzdCk7XG59XG5cbk1hcENTUy5wcm90b3R5cGUubGlzdEltYWdlUmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5pbWFnZXM7XG59XG5cbk1hcENTUy5wcm90b3R5cGUuY3JlYXRlQ2FjaGVLZXkgPSBmdW5jdGlvbih0YWdzLCB6b29tLCBmZWF0dXJlVHlwZSkge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrIGluIHRhZ3MpIHtcbiAgICAvL1Rlc3Qgb25seSB0YWdzLCBtZW50aW9uZWQgaW4gQ1NTIHNlbGVjdG9yc1xuICAgIGlmIChrIGluIHRoaXMua25vd25UYWdzKSB7XG4gICAgICBpZiAodGhpcy5rbm93blRhZ3Nba10gPT09ICdrdicpIHtcbiAgICAgICAgLy9UYWcga2V5IGFuZCB2YWx1ZXMgYXJlIGNoZWNrZWQgaW4gTWFwQ1NTXG4gICAgICAgIGtleXMucHVzaChrICsgXCI9XCIgKyB0YWdzW2tdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vT25seSB0YWcgcHJlc2VuY2UgaXMgY2hlY2tlZCBpbiBNYXBDU1MsIHdlIGRvbid0IG5lZWQgdG8gdGFrZSB2YWx1ZSBpbiBhY2NvdW50XG4gICAgICAgIGtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gW3pvb20sIGZlYXR1cmVUeXBlLCBrZXlzLmpvaW4oJzonKV0uam9pbignOicpO1xufVxuXG4vKipcbiAqKiBBcHBseSBNYXBDU1MgdG8gYSBmZWF0dXJlIGFuZCByZXR1cm4gc2V0IG9mIGxheWVyIHN0eWxlc1xuICoqIEBwYXJhbSB0YWdzIHtPYmplY3R9IOKAlCBtYXBzIG9mIHRoZSBmZWF0dXJlIHByb3BlcnRpZXNcbiAqKiBAcGFyYW0gem9vbSB7aW50fSDigJQgY3VycmVudCB6b29tIGxldmVsXG4gKiogQHBhcmFtIGZlYXR1cmVUeXBlIHtTdHJpbmd9IMKt4oCUIEZlYXR1cmUgZ2VvbWV0cnkgdHlwZSBpbiB0ZXJtcyBvZiBHZW9KU09OXG4gKiogQHJldHVybnMge09iamVjdH0g4oCUIHsnbGF5ZXInOiB7J3Byb3BlcnR5JzogJ3ZhbHVlJ319XG4gKiovXG5NYXBDU1MucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24odGFncywgem9vbSwgZmVhdHVyZVR5cGUpIHtcbiAgdmFyIGtleTtcblxuICBpZiAodGhpcy5jYWNoZSkge1xuICAgIGtleSA9IHRoaXMuY3JlYXRlQ2FjaGVLZXkodGFncywgem9vbSwgZmVhdHVyZVR5cGUpO1xuXG4gICAgaWYgKHRoaXMuY2FjaGUgJiYga2V5IGluIHRoaXMuY2FjaGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW2tleV07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgY2xhc3NlcyA9IFtdO1xuICBjb25zdCBsYXllcnMgPSBydWxlcy5hcHBseSh0aGlzLnJ1bGVzLCB0YWdzLCBjbGFzc2VzLCB6b29tLCBmZWF0dXJlVHlwZSwgdGhpcy5sb2NhbGVzKTtcblxuICBpZiAodGhpcy5jYWNoZSkge1xuICAgIHRoaXMuY2FjaGVba2V5XSA9IGxheWVycztcbiAgfVxuICByZXR1cm4gbGF5ZXJzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENTUztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gbWF0Y2hTZWxlY3RvcihzZWxlY3RvciwgdGFncywgY2xhc3Nlcywgem9vbSwgZmVhdHVyZVR5cGUpIHtcbiAgaWYgKCFtYXRjaEZlYXR1cmVUeXBlKHNlbGVjdG9yLnR5cGUsIGZlYXR1cmVUeXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghbWF0Y2hab29tKHNlbGVjdG9yLnpvb20sIHpvb20pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFtYXRjaEF0dHJpYnV0ZXMoc2VsZWN0b3IuYXR0cmlidXRlcywgdGFncykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIW1hdGNoQ2xhc3NlcyhzZWxlY3Rvci5jbGFzc2VzLCBjbGFzc2VzKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5cbi8qKlxuICoqIEhhcyBzaWRlIGVmZmVjdHMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMgKGFyZ3VtYW50IGlmIG1vZGlmaWVkKVxuICoqIGtub3duVGFnczp7dGFnOiAnayd8J2t2J31cbiAqKiBhdHRyaWJ1dGVzOlt7dHlwZSwga2V5LCB2YWx1ZX1dXG4gKiovXG5mdW5jdGlvbiBhcHBlbmRLbm93blRhZ3Moa25vd25UYWdzLCBhdHRyaWJ1dGVzKSB7XG4gIGlmICghYXR0cmlidXRlcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGF0dHIgPSBhdHRyaWJ1dGVzW2ldO1xuICAgIHN3aXRjaCAoYXR0ci50eXBlKSB7XG4gICAgY2FzZSAncHJlc2VuY2UnOlxuICAgIGNhc2UgJ2Fic2VuY2UnOlxuICAgICAgaWYgKGtub3duVGFnc1thdHRyLmtleV0gIT0gJ2t2Jykge1xuICAgICAgICBrbm93blRhZ3NbYXR0ci5rZXldID0gJ2snO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY21wJzpcbiAgICBjYXNlICdyZWdleHAnOlxuICAgICAgLy8na3YnIHNob3VsZCBvdmVycmlkZSAnaydcbiAgICAgIGtub3duVGFnc1thdHRyLmtleV0gPSAna3YnO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiogcmFuZ2U6T2JqZWN0ID0ge3R5cGU6ICd6JywgYmVnaW46IGludCwgZW5kOiBpbnR9XG4gKiogem9vbTppbnRcbiAqKi9cbmZ1bmN0aW9uIG1hdGNoWm9vbShyYW5nZSwgem9vbSkge1xuICBpZiAoIXJhbmdlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAocmFuZ2UudHlwZSAhPT0gJ3onKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiWm9vbSBzZWxlY3RvciAnXCIgKyByYW5nZS50eXBlICsgXCInIGlzIG5vdCBzdXBwb3J0ZWRcIik7XG4gIH1cblxuICByZXR1cm4gem9vbSA+PSAocmFuZ2UuYmVnaW4gfHwgMCkgJiYgem9vbSA8PSAocmFuZ2UuZW5kIHx8IDkwMDApO1xufVxuXG4vKipcbiAqKiBAcGFyYW0gc2VsZWN0b3JUeXBlIHtzdHJpbmd9IOKAlCBcIm5vZGVcIiwgXCJ3YXlcIiwgXCJyZWxhdGlvblwiLCBcImxpbmVcIiwgXCJhcmVhXCIsIFwiY2FudmFzXCIsIFwiKlwiXG4gKiogQHBhcmFtIGZlYXR1cmVUeXBlIHtzdHJpbmd9IOKAlCBcIlBvaW50XCIsIFwiTXVsdGlQb2ludFwiLCBcIlBvbHlnb25cIiwgXCJNdWx0aVBvbHlnb25cIiwgXCJMaW5lU3RyaW5nXCIsIFwiTXVsdGlMaW5lU3RyaW5nXCJcbiAqKi9cbmZ1bmN0aW9uIG1hdGNoRmVhdHVyZVR5cGUoc2VsZWN0b3JUeXBlLCBmZWF0dXJlVHlwZSkge1xuICBpZiAoc2VsZWN0b3JUeXBlID09PSAnKicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN3aXRjaCAoZmVhdHVyZVR5cGUpIHtcbiAgY2FzZSAnTGluZVN0cmluZyc6XG4gIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgcmV0dXJuIHNlbGVjdG9yVHlwZSA9PT0gJ3dheScgfHwgc2VsZWN0b3JUeXBlID09PSAnbGluZSc7XG4gIGNhc2UgJ1BvbHlnb24nOlxuICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgIHJldHVybiBzZWxlY3RvclR5cGUgPT09ICd3YXknIHx8IHNlbGVjdG9yVHlwZSA9PT0gJ2FyZWEnO1xuICBjYXNlICdQb2ludCc6XG4gIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIHJldHVybiBzZWxlY3RvclR5cGUgPT09ICdub2RlJztcbiAgZGVmYXVsdDpcbiAgICAvL05vdGU6IENhbnZhcyBhbmQgUmVsYXRpb24gYXJlIHZpcnR1YWwgZmVhdHVyZXMgYW5kIGNhbm5vdCBiZSBzdXBwb3J0ZWQgYXQgdGhpcyBsZXZlbFxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGZWF0dXJlIHR5cGUgaXMgbm90IHN1cHBvcnRlZDogXCIgKyBmZWF0dXJlVHlwZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWF0Y2hBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHRhZ3MpIHtcbiAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIW1hdGNoQXR0cmlidXRlKGF0dHJpYnV0ZXNbaV0sIHRhZ3MpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICoqIENsYXNzZXMgYXJlIGNvbmNhdGVuYXRlZCBieSBBTkQgc3RhdGVtZW50XG4gKiogc2VsZWN0b3JDbGFzc2VzOlt7Y2xhc3M6U3RyaW5nLCBub3Q6Qm9vbGVhbn1dXG4gKiogY2xhc3NlczpbU3RyaW5nXVxuICoqL1xuZnVuY3Rpb24gbWF0Y2hDbGFzc2VzKHNlbGVjdG9yQ2xhc3NlcywgY2xhc3Nlcykge1xuICBpZiAoIXNlbGVjdG9yQ2xhc3Nlcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RvckNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzZWxDbGFzcyA9IHNlbGVjdG9yQ2xhc3Nlc1tpXTtcbiAgICBpZiAoIW1hdGNoQ2xhc3Moc2VsQ2xhc3MsIGNsYXNzZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1hdGNoQ2xhc3Moc2VsZWN0b3JDbGFzcywgY2xhc3Nlcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjbHMgPSBjbGFzc2VzW2ldO1xuICAgIGlmIChzZWxlY3RvckNsYXNzLmNsYXNzID09IGNscykge1xuICAgICAgcmV0dXJuICFzZWxlY3RvckNsYXNzLm5vdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqKiBvcDpTdHJpbmcg4oCUIG9uZSBvZiBcIj1cIiwgXCIhPVwiLCBcIjxcIiwgXCI8PVwiLCBcIj5cIiwgXCI+PVwiXG4gKiogZXhwZWN0OlN0cmluZyDigJQgZXhwZWN0ZWQgdmFsdWVcbiAqKiB2YWx1ZTpTdHJpbmcg4oCUIGFjdHVhbCB2YWx1ZVxuICoqL1xuZnVuY3Rpb24gY29tcGFyZShvcCwgZXhwZWN0LCB2YWx1ZSkge1xuICAvLyBwYXJzZUZsb2F0IHJldHVybnMgTmFOIGlmIGZhaWxlZCwgYW5kIE5hTiBjb21wYXJlZCB0byBhbnl0aGluZyBpcyBmYWxzZSwgc29cbiAgLy8gbm8gYWRkaXRpb25hbCB0eXBlIGNoZWNrcyBhcmUgcmVxdWlyZWRcbiAgY29uc3QgdmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gIGNvbnN0IGV4cCA9IHBhcnNlRmxvYXQoZXhwZWN0KTtcblxuICBzd2l0Y2ggKG9wKSB7XG4gIGNhc2UgJz0nOlxuICAgIHJldHVybiBpc05hTih2YWwpIHx8IGlzTmFOKGV4cCkgPyBleHBlY3QgPT0gdmFsdWUgOiB2YWwgPT0gZXhwO1xuICBjYXNlICchPSc6XG4gICAgcmV0dXJuIGlzTmFOKHZhbCkgfHwgaXNOYU4oZXhwKSA/IGV4cGVjdCAhPSB2YWx1ZSA6IHZhbCAhPSBleHA7XG4gIGNhc2UgJzwnOlxuICAgIHJldHVybiB2YWwgPCBleHA7XG4gIGNhc2UgJzw9JzpcbiAgICByZXR1cm4gdmFsIDw9IGV4cDtcbiAgY2FzZSAnPic6XG4gICAgcmV0dXJuIHZhbCA+IGV4cDtcbiAgY2FzZSAnPj0nOlxuICAgIHJldHVybiB2YWwgPj0gZXhwO1xuICBkZWZhdWx0OlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cbi8qKlxuICoqIHJlZ2V4cDpTdHJpbmcg4oCUIHJlZ3VsYXIgZXhwcmVzc2lvblxuICoqIGZsYWdzOlN0cmluZyDigJQgcmVndWxhciBleHByZXNzaW9uIGZsYWdzXG4gKiogdmFsdWU6U3RyaW5nIOKAlCBhY3R1YWwgdmFsdWVcbiAqKi9cbmZ1bmN0aW9uIHJlZ2V4cChyZWdleHAsIGZsYWdzLCB2YWx1ZSkge1xuICBjb25zdCByZSA9IG5ldyBSZWdFeHAocmVnZXhwLCBmbGFncyk7XG4gIHJldHVybiByZS50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiogTWF0Y2ggdGFncyBhZ2FpbnN0IHNpbmdsZSBhdHRyaWJ1dGUgc2VsZWN0b3JcbiAqKiBhdHRyOnt0eXBlOlN0cmluZywga2V5OlN0cmluZywgdmFsdWU6U3RyaW5nfVxuICoqIHRhZ3M6eyo6ICp9XG4gKiovXG5mdW5jdGlvbiBtYXRjaEF0dHJpYnV0ZShhdHRyLCB0YWdzKSB7XG4gIHN3aXRjaCAoYXR0ci50eXBlKSB7XG4gIGNhc2UgJ3ByZXNlbmNlJzpcbiAgICByZXR1cm4gYXR0ci5rZXkgaW4gdGFncztcbiAgY2FzZSAnYWJzZW5jZSc6XG4gICAgcmV0dXJuICEoYXR0ci5rZXkgaW4gdGFncyk7XG4gIGNhc2UgJ2NtcCc6XG4gICAgcmV0dXJuIGF0dHIua2V5IGluIHRhZ3MgJiYgY29tcGFyZShhdHRyLm9wLCBhdHRyLnZhbHVlLCB0YWdzW2F0dHIua2V5XSk7XG4gIGNhc2UgJ3JlZ2V4cCc6XG4gICAgcmV0dXJuIGF0dHIua2V5IGluIHRhZ3MgJiYgcmVnZXhwKGF0dHIudmFsdWUucmVnZXhwLCBhdHRyLnZhbHVlLmZsYWdzLCB0YWdzW2F0dHIua2V5XSk7XG4gIGRlZmF1bHQ6XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0cmlidXRlIHR5cGUgaXMgbm90IHN1cHBvcnRlZDogXCIgKyBhdHRyLnR5cGUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtYXRjaFpvb206IG1hdGNoWm9vbSxcbiAgbWF0Y2hGZWF0dXJlVHlwZTogbWF0Y2hGZWF0dXJlVHlwZSxcbiAgbWF0Y2hBdHRyaWJ1dGVzOiBtYXRjaEF0dHJpYnV0ZXMsXG4gIG1hdGNoQXR0cmlidXRlOiBtYXRjaEF0dHJpYnV0ZSxcbiAgbWF0Y2hDbGFzc2VzOiBtYXRjaENsYXNzZXMsXG4gIG1hdGNoU2VsZWN0b3I6IG1hdGNoU2VsZWN0b3IsXG4gIGFwcGVuZEtub3duVGFnczogYXBwZW5kS25vd25UYWdzXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG1hdGNoZXJzID0gcmVxdWlyZShcIi4vbWF0Y2hlcnNcIik7XG5jb25zdCBldmFsUHJvY2Vzc29yID0gcmVxdWlyZShcIi4vZXZhbFwiKTtcblxuLyoqXG4gKiogRXh0cmFjdCBhbGwgdGFncywgcmVmZXJlbmNlZCBpbiBNYXBDU1MgcnVsZXMuXG4gKipcbiAqKiBAcGFyYW0gcnVsZXMge2FycmF5fSDigJQgbGlzdCBvZiBNYXBDU1MgcnVsZXMgZnJvbSBBU1RcbiAqKiBAcGFyYW0gbG9jYWxlcyB7YXJyYXl9IOKAlCBsaXN0IG9mIHN1cHBvcnRlZCBsb2NhbGVzXG4gKiogQHJldHVybiB7T2JqZWN0fSDCrXRhZ3Mg4oCUIG1hcCBvZiB0YWdzXG4gKiogICBrZXkg4oCUIHRhZyBuYW1lXG4gKiogICB2YWx1ZSDigJQgJ2snIGlmIHRhZyB2YWx1ZSBpcyBub3QgdXNlZFxuICoqICAgICAgICAgICAna3YnIGlmIHRhZyB2YWx1ZSBpcyB1c2VkXG4gKiovXG5mdW5jdGlvbiBsaXN0S25vd25UYWdzKHJ1bGVzLCBsb2NhbGVzPVtdKSB7XG4gIGNvbnN0IHRhZ3MgPSB7fTtcbiAgcnVsZXMuZm9yRWFjaCgocnVsZSkgPT4ge1xuICAgIHJ1bGUuc2VsZWN0b3JzLmZvckVhY2goKHNlbGVjdG9yKSA9PiB7XG4gICAgICBtYXRjaGVycy5hcHBlbmRLbm93blRhZ3ModGFncywgc2VsZWN0b3IuYXR0cmlidXRlcyk7XG4gICAgfSk7XG5cbiAgICBydWxlLmFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGFjdGlvbi52O1xuXG4gICAgICBpZiAoYWN0aW9uLmFjdGlvbiA9PT0gJ2t2JyAmJiBhY3Rpb24uayA9PT0gJ3RleHQnKSB7XG4gICAgICAgIGlmICh2YWx1ZS50eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgLy9TdXBwb3J0ICd0ZXh0OiBcInRhZ25hbWVcIjsnIHN5bnRheCBzdWdhciBzdGF0ZW1lbnRcbiAgICAgICAgICB0YWdzW3ZhbHVlLnZdID0gJ2t2JztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS50eXBlID09PSBcImV2YWxcIikge1xuICAgICAgICAgIC8vU3VwcG9ydCB0YWcoKSBmdW5jdGlvbiBpbiBldmFsXG4gICAgICAgICAgZXZhbFByb2Nlc3Nvci5hcHBlbmRLbm93blRhZ3ModGFncywgdmFsdWUudiwgbG9jYWxlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhZ3M7XG59XG5cbi8qKlxuICoqIEV4dHJhY3QgYWxsIGltYWdlcywgcmVmZXJlbmNlZCBpbiBNYXBDU1MgcnVsZXMuXG4gKiogQHBhcmFtIHJ1bGVzIHthcnJheX0g4oCUIGxpc3Qgb2YgTWFwQ1NTIHJ1bGVzIGZyb20gQVNUXG4gKiogQHJldHVybiB7YXJyYXl9IOKAlCB1bmlxdWUgbGlzdCBvZiBpbWFnZXNcbiAqKi9cbmZ1bmN0aW9uIGxpc3RLbm93bkltYWdlcyhydWxlcykge1xuICBjb25zdCBpbWFnZXMgPSB7fTtcblxuICBjb25zdCBpbWFnZUFjdGlvbnMgPSBbJ2ltYWdlJywgJ3NoaWVsZC1pbWFnZScsICdpY29uLWltYWdlJywgJ2ZpbGwtaW1hZ2UnXTtcblxuICBydWxlcy5mb3JFYWNoKChydWxlKSA9PiB7XG4gICAgcnVsZS5hY3Rpb25zLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhY3Rpb24udjtcblxuICAgICAgaWYgKGFjdGlvbi5hY3Rpb24gPT09ICdrdicgJiYgaW1hZ2VBY3Rpb25zLmluY2x1ZGVzKGFjdGlvbi5rKSkge1xuICAgICAgICBpZiAodmFsdWUudHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIGltYWdlc1t2YWx1ZS52LnRyaW0oKV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhpbWFnZXMpO1xufVxuXG4vKipcbiAqKiBBcHBseSBNYXBDU1Mgc3R5bGUgdG8gYSBzcGVjaWZpZWQgZmVhdHVyZSBpbiBzcGVjaWZpZWQgY29udGV4dFxuICoqIEBwYXJhbSBydWxlcyB7YXJyYXl9IOKAlCBsaXN0IG9mIE1hcENTUyBydWxlcyBmcm9tIEFTVFxuICoqIEBwYXJhbSB0YWdzIHtPYmplY3R9IOKAlCBrZXktdmFsdWUgbWFwIG9mIGZlYXR1cmUgcHJvcGVydGllc1xuICoqIEBwYXJhbSBjbGFzc2VzIHthcnJheX0g4oCUIGxpc3Qgb2YgZmVhdHVyZSBjbGFzc2VzXG4gKiogQHBhcmFtIHpvb20ge2ludH0g4oCUIHpvb20gbGV2ZWwgaW4gdGVybXMgb2YgdGlsaW5nIHNjaGVtZVxuICoqIEBwYXJhbSBmZWF0dXJlVHlwZSB7c3RyaW5nfSDigJQgZmVhdHVyZSB0eXBlIGluIHRlcm1zIG9mIEdlb0pTT04gZmVhdHVyZXNcbiAqKiBAcGFyYW0gbG9jYWxlcyB7YXJyYXl9IOKAlCBsaXN0IG9mIHN1cHBvcnRlZCBsb2NhbGVzIGluIHByZWZlcmVkIG9yZGVyXG4gKiogQHJldHVybnMge09iamVjdH0g4oCUIG1hcCBvZiBsYXllcnMgZm9yIHJlbmRlcmluZ1xuICoqXG4gKiogTkI6IHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmb3IgZWFjaCByZW5kZXJlZCBmZWF0dXJlLCBzbyBpdCBtdXN0IGJlXG4gKiogYXMgcGVyZm9ybWFuY2Ugb3B0aW1pemVkIGFzIHBvc3NpYmxlLlxuICoqL1xuZnVuY3Rpb24gYXBwbHkocnVsZXMsIHRhZ3MsIGNsYXNzZXMsIHpvb20sIGZlYXR1cmVUeXBlLCBsb2NhbGVzKSB7XG4gIGNvbnN0IGxheWVycyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBydWxlID0gcnVsZXNbaV07XG5cbiAgICBjb25zdCBydWxlTGF5ZXJzID0gYXBwbHlSdWxlKHJ1bGUsIHRhZ3MsIGNsYXNzZXMsIHpvb20sIGZlYXR1cmVUeXBlLCBsb2NhbGVzKTtcbiAgICB2YXIgZXhpdCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGxheWVyIGluIHJ1bGVMYXllcnMpIHtcbiAgICAgIGxheWVyc1tsYXllcl0gPSBsYXllcnNbbGF5ZXJdIHx8IHt9O1xuICAgICAgaWYgKCdleGl0JyBpbiBydWxlTGF5ZXJzW2xheWVyXSkge1xuICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgZGVsZXRlIHJ1bGVMYXllcnNbbGF5ZXJdWydleGl0J107XG4gICAgICB9XG4gICAgICBPYmplY3QuYXNzaWduKGxheWVyc1tsYXllcl0sIHJ1bGVMYXllcnNbbGF5ZXJdKTtcbiAgICB9XG5cbiAgICBpZiAoZXhpdCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxheWVycztcbn1cblxuLyoqXG4gKiogcmV0dXJuIHtsYXllciwge3Byb3AsIHZhbHVlfX07XG4gKiovXG5mdW5jdGlvbiBhcHBseVJ1bGUocnVsZSwgdGFncywgY2xhc3Nlcywgem9vbSwgZmVhdHVyZVR5cGUsIGxvY2FsZXMpIHtcbiAgY29uc3Qgc2VsZWN0b3JzID0gcnVsZS5zZWxlY3RvcnM7XG4gIGNvbnN0IGFjdGlvbnMgPSBydWxlLmFjdGlvbnM7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnNbaV07XG4gICAgaWYgKG1hdGNoZXJzLm1hdGNoU2VsZWN0b3Ioc2VsZWN0b3IsIHRhZ3MsIGNsYXNzZXMsIHpvb20sIGZlYXR1cmVUeXBlKSkge1xuICAgICAgY29uc3QgbGF5ZXIgPSBzZWxlY3Rvci5sYXllciB8fCAnZGVmYXVsdCc7XG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcmVzdWx0W2xheWVyXSB8fCB7fVxuICAgICAgY29uc3QgcHJvcHMgPSB1bndpbmRBY3Rpb25zKGFjdGlvbnMsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMsIGNsYXNzZXMpO1xuXG4gICAgICByZXN1bHRbbGF5ZXJdID0gT2JqZWN0LmFzc2lnbihwcm9wZXJ0aWVzLCBwcm9wcyk7XG5cbiAgICAgIGlmICgnZXhpdCcgaW4gcHJvcGVydGllcykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1bndpbmRBY3Rpb25zKGFjdGlvbnMsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMsIGNsYXNzZXMpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYWN0aW9uID0gYWN0aW9uc1tpXTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLmFjdGlvbikge1xuICAgIGNhc2UgJ2t2JzpcbiAgICAgIGlmIChhY3Rpb24uayA9PT0gJ3RleHQnKSB7XG4gICAgICAgIGlmIChhY3Rpb24udi50eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChhY3Rpb24udi52IGluIHRhZ3MpIHtcbiAgICAgICAgICAgIHJlc3VsdFthY3Rpb24ua10gPSB0YWdzW2FjdGlvbi52LnZdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRbYWN0aW9uLmtdID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFthY3Rpb24ua10gPSB1bndpbmRWYWx1ZShhY3Rpb24udiwgdGFncywgcHJvcGVydGllcywgbG9jYWxlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdW53aW5kVmFsdWUoYWN0aW9uLnYsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMpO1xuICAgICAgICByZXN1bHRbYWN0aW9uLmtdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzZXRfY2xhc3MnOlxuICAgICAgaWYgKCFjbGFzc2VzLmluY2x1ZGVzKGFjdGlvbi52LmNsYXNzKSkge1xuICAgICAgICBjbGFzc2VzLnB1c2goYWN0aW9uLnYuY2xhc3MpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2V0X3RhZyc6XG4gICAgICB0YWdzW2FjdGlvbi5rXSA9IHVud2luZFZhbHVlKGFjdGlvbi52LCB0YWdzLCBwcm9wZXJ0aWVzLCBsb2NhbGVzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2V4aXQnOlxuICAgICAgcmVzdWx0WydleGl0J10gPSB0cnVlO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFjdGlvbiB0eXBlIGlzIG5vdCBzdXBwcm90ZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoYWN0aW9uKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVud2luZFZhbHVlKHZhbHVlLCB0YWdzLCBwcm9wZXJ0aWVzLCBsb2NhbGVzKSB7XG4gIHN3aXRjaCAodmFsdWUudHlwZSkge1xuICBjYXNlICdzdHJpbmcnOlxuICAgIHJldHVybiB2YWx1ZS52O1xuICBjYXNlICdjc3Njb2xvcic6XG4gICAgcmV0dXJuIGZvcm1hdENzc0NvbG9yKHZhbHVlLnYpO1xuICBjYXNlICdldmFsJzpcbiAgICByZXR1cm4gZXZhbFByb2Nlc3Nvci5ldmFsRXhwcih2YWx1ZS52LCB0YWdzLCBwcm9wZXJ0aWVzLCBsb2NhbGVzKTtcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVmFsdWUgdHlwZSBpcyBub3Qgc3VwcHJvdGVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0Q3NzQ29sb3IoY29sb3IpIHtcbiAgaWYgKCdyJyBpbiBjb2xvciAmJiAnZycgaW4gY29sb3IgJiYgJ2InIGluIGNvbG9yICYmICdhJyBpbiBjb2xvcikge1xuICAgIHJldHVybiBcInJnYmEoXCIgKyBjb2xvci5yICsgXCIsIFwiICsgY29sb3IuZyArIFwiLCBcIiArIGNvbG9yLmIgKyBcIiwgXCIgKyBjb2xvci5hICsgXCIpXCI7XG4gIH0gZWxzZSBpZiAoJ3InIGluIGNvbG9yICYmICdnJyBpbiBjb2xvciAmJiAnYicgaW4gY29sb3IpIHtcbiAgICByZXR1cm4gXCJyZ2IoXCIgKyBjb2xvci5yICsgXCIsIFwiICsgY29sb3IuZyArIFwiLCBcIiArIGNvbG9yLmIgKyBcIilcIjtcbiAgfSBlbHNlIGlmICgnaCcgaW4gY29sb3IgJiYgJ3MnIGluIGNvbG9yICYmICdsJyBpbiBjb2xvciAmJiAnYScgaW4gY29sb3IpIHtcbiAgICByZXR1cm4gXCJoc2xhKFwiICsgY29sb3IuaCArIFwiLCBcIiArIGNvbG9yLnMgKyBcIiwgXCIgKyBjb2xvci5sICsgXCIsIFwiICsgY29sb3IuYSArIFwiKVwiO1xuICB9IGVsc2UgaWYgKCdoJyBpbiBjb2xvciAmJiAncycgaW4gY29sb3IgJiYgJ2wnIGluIGNvbG9yKSB7XG4gICAgcmV0dXJuIFwiaHNsKFwiICsgY29sb3IuaCArIFwiLCBcIiArIGNvbG9yLnMgKyBcIiwgXCIgKyBjb2xvci5sICsgXCIpXCI7XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBjb2xvciBzcGFjZSBcIiArIEpTT04uc3RyaW5naWZ5KGNvbG9yKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsaXN0S25vd25UYWdzOiBsaXN0S25vd25UYWdzLFxuICBsaXN0S25vd25JbWFnZXM6IGxpc3RLbm93bkltYWdlcyxcbiAgYXBwbHk6IGFwcGx5LFxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdXBwb3J0cyA9IHJlcXVpcmUoXCIuL3N1cHBvcnRzXCIpO1xuXG4vKipcbiAqKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICoqIEBwYXJhbSBvcHRpb25zLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMge2Jvb2xlYW59IHNvcnQgZmVhdHVyZXMgYnkgcGVyZm9ybWVkIGFjdGlvbnMuXG4gKiogICAgIFRoaXMgb3B0aW1pemF0aW9uIHNpZ25pZmljYXRlbHkgaW1wcm92ZXMgcGVyZm9ybWFuY2UgaW4gQ2hyb21lIGNhbnZhcyBpbXBsZW1lbnRhdGlvbiwgYnV0IHNsb3dzIGRvd24gbm9kZS1jYW52YXNcbiAqKi9cbmZ1bmN0aW9uIFN0eWxlTWFuYWdlcihtYXBjc3MsIG9wdGlvbnMpIHtcbiAgdGhpcy5tYXBjc3MgPSBtYXBjc3M7XG5cbiAgdGhpcy5ncm91cEZlYXR1cmVzQnlBY3Rpb25zID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5ncm91cEZlYXR1cmVzQnlBY3Rpb25zKSB8fCBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tBY3Rpb25zKGFjdGlvbnMsIHJlcXVpcmVkQWN0aW9ucykge1xuICBmb3IgKHZhciBrIGluIGFjdGlvbnMpIHtcbiAgICBpZiAocmVxdWlyZWRBY3Rpb25zLmluY2x1ZGVzKGspKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vVE9ETyBFeHRyYWN0IHRvIHN1cHBvcnRzLmpzXG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJzKGZlYXR1cmVUeXBlLCBhY3Rpb25zKSB7XG4gIGNvbnN0IHJlbmRlcnMgPSB7fTtcblxuICBzdXBwb3J0cy5mb3JFYWNoKChyZW5kZXJTcGVjKSA9PiB7XG4gICAgaWYgKCFyZW5kZXJTcGVjLmZlYXR1cmVUeXBlcy5pbmNsdWRlcyhmZWF0dXJlVHlwZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWNoZWNrQWN0aW9ucyhhY3Rpb25zLCByZW5kZXJTcGVjLnJlcXVpcmVkQWN0aW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZW5kZXJBY3Rpb25zID0ge1xuICAgICAgJ21ham9yLXotaW5kZXgnOiByZW5kZXJTcGVjLnByaW9yaXR5XG4gICAgfTtcblxuICAgIHJlbmRlclNwZWMuYWN0aW9ucy5mb3JFYWNoKChzcGVjKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGV4dHJhY3RBY3Rpb25WYWx1ZShzcGVjLCBhY3Rpb25zKTtcbiAgICAgIGlmICh0eXBlb2YodmFsdWUpICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHJlbmRlckFjdGlvbnNbc3BlYy5hY3Rpb25dID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZW5kZXJzW3JlbmRlclNwZWMubmFtZV0gPSByZW5kZXJBY3Rpb25zO1xuICB9KTtcblxuICByZXR1cm4gcmVuZGVycztcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEFjdGlvblZhbHVlKHNwZWMsIGFjdGlvbnMpIHtcbiAgLy9UT0RPOiBPdmVycmlkZSB2YWx1ZXMgYnkgcHJpb3JpdHkuIGUuZy4gZmlsbC1vcGFjaXR5IDwtIG9wYWNpdHkgPC0gZGVmYXVsdFxuICBpZiAoIShzcGVjLmFjdGlvbiBpbiBhY3Rpb25zKSkge1xuICAgIHJldHVybiB0eXBlb2Yoc3BlYy5kZWZhdWx0KSAhPT0gJ3VuZGVmaW5lZCcgPyBzcGVjLmRlZmF1bHQgOiBudWxsO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gYWN0aW9uc1tzcGVjLmFjdGlvbl07XG4gIHN3aXRjaCAoc3BlYy50eXBlKSB7XG4gIGNhc2UgJ251bWJlcic6XG4gICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICBicmVhaztcbiAgY2FzZSAnZGFzaGVzJzpcbiAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KFwiLFwiKS5tYXAocGFyc2VGbG9hdCk7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIHZhbHVlID0gdmFsdWUgPT09ICd0cnVlJyA/IHRydWUgOiAhIXZhbHVlO1xuICAgIGJyZWFrO1xuICBjYXNlICdzdHJpbmcnOlxuICAgIHZhbHVlID0gdmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlO1xuICAgIGJyZWFrO1xuICBjYXNlICdjb2xvcic6XG4gIGNhc2UgJ3VyaSc6XG4gIGRlZmF1bHQ6XG4gICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIFt2YWx1ZSwgc3BlYy5kZWZhdWx0XS5maW5kKCh4KSA9PiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSAhPT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5cblxuU3R5bGVNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVGZWF0dXJlUmVuZGVycyA9IGZ1bmN0aW9uKGZlYXR1cmUsIGtvdGhpY0lkLCB6b29tKSB7XG4gIGNvbnN0IGZlYXR1cmVBY3Rpb25zID0gdGhpcy5tYXBjc3MuYXBwbHkoZmVhdHVyZS5wcm9wZXJ0aWVzLCB6b29tLCBmZWF0dXJlLmdlb21ldHJ5LnR5cGUpO1xuXG4gIGNvbnN0IGxheWVycyA9IHt9O1xuXG4gIGZvciAodmFyIGxheWVyTmFtZSBpbiBmZWF0dXJlQWN0aW9ucykge1xuICAgIGNvbnN0IHJlbmRlcnMgPSBjcmVhdGVSZW5kZXJzKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSwgZmVhdHVyZUFjdGlvbnNbbGF5ZXJOYW1lXSk7XG4gICAgZm9yICh2YXIgcmVuZGVyIGluIHJlbmRlcnMpIHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSByZW5kZXJzW3JlbmRlcl07XG4gICAgICBjb25zdCB6SW5kZXggPSBwYXJzZUludChhY3Rpb25zWyd6LWluZGV4J10pIHx8IDA7XG4gICAgICBjb25zdCBtYWpvclpJbmRleCA9IHBhcnNlSW50KGFjdGlvbnNbJ21ham9yLXotaW5kZXgnXSk7XG4gICAgICBkZWxldGUgYWN0aW9uc1snei1pbmRleCddO1xuICAgICAgZGVsZXRlIGFjdGlvbnNbJ21ham9yLXotaW5kZXgnXTtcblxuICAgICAgY29uc3QgcmVzdHlsZWRGZWF0dXJlID0ge1xuICAgICAgICBrb3RoaWNJZDoga290aGljSWQsXG4gICAgICAgIGdlb21ldHJ5OiBmZWF0dXJlLmdlb21ldHJ5LFxuICAgICAgICBhY3Rpb25zOiBhY3Rpb25zLFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucykge1xuICAgICAgICByZXN0eWxlZEZlYXR1cmVbJ2tleSddID0gSlNPTi5zdHJpbmdpZnkoYWN0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxheWVyID0gW3pJbmRleCwgbWFqb3JaSW5kZXgsIGxheWVyTmFtZSwgcmVuZGVyXS5qb2luKCcsJyk7XG5cbiAgICAgIGxheWVyc1tsYXllcl0gPSByZXN0eWxlZEZlYXR1cmU7XG4gICAgfVxuICB9XG4gIHJldHVybiBsYXllcnM7XG59XG4vKipcbiAqKiBAcGFyYW0gYSB7YXJyYXl9IFt6SW5kZXgsIG1ham9yWkluZGV4LCBsYXllck5hbWUsIHJlbmRlcl1cbiAqKiBAcmV0dXJuIDwwIOKAlCBwcmVmZXIgYVxuICoqIEByZXR1cm4gPjAg4oCUIHByZWZlciBiXG4gKiovXG5mdW5jdGlvbiBjb21wYXJlTGF5ZXJzKGEsIGIpIHtcbiAgY29uc3QgbGF5ZXJOYW1lQSA9IGFbMl07XG4gIGNvbnN0IGxheWVyTmFtZUIgPSBiWzJdO1xuXG4gIGNvbnN0IHpJbmRleEEgPSBwYXJzZUludChhWzBdKTtcbiAgY29uc3QgekluZGV4QiA9IHBhcnNlSW50KGJbMF0pO1xuXG4gIGNvbnN0IG1ham9yWkluZGV4QSA9IHBhcnNlSW50KGFbMV0pO1xuICBjb25zdCBtYWpvclpJbmRleEIgPSBwYXJzZUludChiWzFdKTtcbiAgaWYgKGxheWVyTmFtZUEgPT0gbGF5ZXJOYW1lQikge1xuICAgIGlmIChtYWpvclpJbmRleEEgIT0gbWFqb3JaSW5kZXhCKSB7XG4gICAgICByZXR1cm4gbWFqb3JaSW5kZXhBIC0gbWFqb3JaSW5kZXhCO1xuICAgIH1cblxuICAgIGlmICh6SW5kZXhBICE9IHpJbmRleEIpIHtcbiAgICAgIHJldHVybiB6SW5kZXhBIC0gekluZGV4QjtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgbGF5ZXJzOiBcIiArIEpTT04uc3RyaW5naWZ5KGEpICsgXCIgYW5kIFwiICsgSlNPTi5zdHJpbmdpZnkoYikpO1xuICB9IGVsc2UgaWYgKGxheWVyTmFtZUEgPT0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGxheWVyTmFtZUIgPT0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHpJbmRleEEgIT0gekluZGV4Qikge1xuICAgICAgcmV0dXJuIHpJbmRleEEgLSB6SW5kZXhCO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllck5hbWVBLmxvY2FsZUNvbXBhcmUobGF5ZXJOYW1lQik7XG4gIH1cbn1cbi8qKlxuICoqXG4gKipcbiAqKiBAcmV0dXJuIHthcnJheX0gW3tyZW5kZXI6ICdjYXNpbmcnLCB6SW5kZXg6IDAsIGZlYXR1cmVzOiBbXX0sIHtyZW5kZXI6ICdsaW5lJywgZmVhdHVyZXM6IFtdfSwge3JlbmRlcjogJ2xpbmUnLCBmZWF0dXJlczogW119XVxuICoqXG4gKiovXG5TdHlsZU1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUxheWVycyA9IGZ1bmN0aW9uKGZlYXR1cmVzLCB6b29tKSB7XG4gIGNvbnN0IGxheWVycyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByZW5kZXJzID0gdGhpcy5jcmVhdGVGZWF0dXJlUmVuZGVycyhmZWF0dXJlc1tpXSwgaSArIDEsIHpvb20pO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHJlbmRlcnMpIHtcbiAgICAgIGxheWVyc1trZXldID0gbGF5ZXJzW2tleV0gfHwgW107XG5cbiAgICAgIGxheWVyc1trZXldLnB1c2gocmVuZGVyc1trZXldKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgY29uc3QgbGF5ZXJLZXlzID0gT2JqZWN0LmtleXMobGF5ZXJzKSAgIC8vIFtcIjAsY2FzaW5nc1wiLCBcIjEsbGluZXNcIl1cbiAgICAubWFwKChrKSA9PiBrLnNwbGl0KFwiLFwiKSkgICAgICAgICAgICAgLy8gW1tcIjBcIiwgXCJjYXNpbmdzXCJdLCBbXCIxXCIsIFwibGluZXNcIl1dXG4gICAgLnNvcnQoY29tcGFyZUxheWVycylcbiAgICAuZm9yRWFjaCgoW3pJbmRleCwgbWFqb3JaSW5kZXgsIGxheWVyTmFtZSwgcmVuZGVyXSkgPT4ge1xuICAgICAgY29uc3QgZmVhdHVyZXMgPSBsYXllcnNbW3pJbmRleCwgbWFqb3JaSW5kZXgsIGxheWVyTmFtZSwgcmVuZGVyXS5qb2luKCcsJyldO1xuXG4gICAgICBpZiAodGhpcy5ncm91cEZlYXR1cmVzQnlBY3Rpb25zKSB7XG4gICAgICAgIGZlYXR1cmVzLnNvcnQoKGEsIGIpID0+IGEua2V5LmxvY2FsZUNvbXBhcmUoYi5rZXkpKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICByZW5kZXI6IHJlbmRlcixcbiAgICAgICAgekluZGV4OiBwYXJzZUludCh6SW5kZXgpLFxuICAgICAgICBtYWpvclpJbmRleDogcGFyc2VJbnQobWFqb3JaSW5kZXgpLFxuICAgICAgICBvYmplY3RaSW5kZXg6IGxheWVyTmFtZSxcbiAgICAgICAgZmVhdHVyZXM6IGZlYXR1cmVzXG4gICAgICB9KTtcbiAgICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0eWxlTWFuYWdlcjtcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICB7XG4gICAgXCJuYW1lXCI6IFwicG9seWdvblwiLFxuICAgIFwiZmVhdHVyZVR5cGVzXCI6IFtcIlBvbHlnb25cIiwgXCJNdWx0aVBvbHlnb25cIl0sXG4gICAgXCJyZXF1aXJlZEFjdGlvbnNcIjogW1wiZmlsbC1jb2xvclwiLCBcImZpbGwtaW1hZ2VcIl0sXG4gICAgXCJhY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ6LWluZGV4XCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImZpbGwtY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwicmdiKDAsIDAsIDApXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImNvbG9yXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJmaWxsLWltYWdlXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInVyaVwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiZmlsbC1vcGFjaXR5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMVxuICAgICAgfSxcbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogMTBcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcImNhc2luZ1wiLFxuICAgIFwiZmVhdHVyZVR5cGVzXCI6IFtcIkxpbmVTdHJpbmdcIiwgXCJNdWx0aUxpbmVTdHJpbmdcIiwgXCJQb2x5Z29uXCIsIFwiTXVsdGlQb2x5Z29uXCJdLFxuICAgIFwicmVxdWlyZWRBY3Rpb25zXCI6IFtcImNhc2luZy13aWR0aFwiXSxcbiAgICBcImFjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImFjdGlvblwiOiBcInotaW5kZXhcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiY2FzaW5nLXdpZHRoXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAxLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcIndpZHRoXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImNhc2luZy1jb2xvclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCJyZ2IoMCwgMCwgMClcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImNhc2luZy1kYXNoZXNcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiZGFzaGVzXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJjYXNpbmctb3BhY2l0eVwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMSxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJjYXNpbmctbGluZWNhcFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCJidXR0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiY2FzaW5nLWxpbmVqb2luXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcInJvdW5kXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwibGluZWNhcFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCJidXR0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwibGluZWpvaW5cIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwicm91bmRcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sXG5cbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogMjBcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcImxpbmVcIixcbiAgICBcImZlYXR1cmVUeXBlc1wiOiBbXCJMaW5lU3RyaW5nXCIsIFwiTXVsdGlMaW5lU3RyaW5nXCIsIFwiUG9seWdvblwiLCBcIk11bHRpUG9seWdvblwiXSxcbiAgICBcInJlcXVpcmVkQWN0aW9uc1wiOiBbXCJ3aWR0aFwiLCBcImltYWdlXCJdLFxuICAgIFwiYWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiei1pbmRleFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ3aWR0aFwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImltYWdlXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInVyaVwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiY29sb3JcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwicmdiKDAsIDAsIDApXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJkYXNoZXNcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiZGFzaGVzXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJvcGFjaXR5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMVxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImxpbmVjYXBcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJsaW5lam9pblwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSxcbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogMzBcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcImljb25cIixcbiAgICBcImZlYXR1cmVUeXBlc1wiOiBbXCJQb2ludFwiLCBcIk11bHRpUG9pbnRcIiwgXCJQb2x5Z29uXCIsIFwiTXVsdGlQb2x5Z29uXCJdLFxuICAgIFwicmVxdWlyZWRBY3Rpb25zXCI6IFtcImljb24taW1hZ2VcIl0sXG4gICAgXCJhY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ6LWluZGV4XCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImljb24taW1hZ2VcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwidXJpXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJpY29uLXdpZHRoXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiaWNvbi1oZWlnaHRcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJhbGxvdy1vdmVybGFwXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcIi14LWtvdGhpYy1wYWRkaW5nXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMjBcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogNDBcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcInRleHRcIixcbiAgICBcImZlYXR1cmVUeXBlc1wiOiBbXCJMaW5lU3RyaW5nXCIsIFwiTXVsdGlMaW5lU3RyaW5nXCIsIFwiUG9pbnRcIiwgXCJNdWx0aVBvaW50XCIsIFwiUG9seWdvblwiLCBcIk11bHRpUG9seWdvblwiXSxcbiAgICBcInJlcXVpcmVkQWN0aW9uc1wiOiBbXCJ0ZXh0XCJdLFxuICAgIFwiYWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiei1pbmRleFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ0ZXh0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dC1jb2xvclwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCIjMDAwMDAwXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ0ZXh0LW9wYWNpdHlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAxXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dC1oYWxvLXJhZGl1c1wiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInRleHQtaGFsby1jb2xvclwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCIjMDAwMDAwXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJmb250LWZhbWlseVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImZvbnQtc2l6ZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInRleHQtdHJhbnNmb3JtXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dC1vZmZzZXRcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ0ZXh0LWFsbG93LW92ZXJsYXBcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiLXgta290aGljLXBhZGRpbmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAyMFxuICAgICAgfVxuICAgIF0sXG4gICAgXCJwcmlvcml0eVwiOiA1MFxuICB9LCB7XG4gICAgXCJuYW1lXCI6IFwic2hpZWxkXCIsXG4gICAgXCJmZWF0dXJlVHlwZXNcIjogW1wiTGluZVN0cmluZ1wiLCBcIk11bHRpTGluZVN0cmluZ1wiXSxcbiAgICBcInJlcXVpcmVkQWN0aW9uc1wiOiBbXCJzaGllbGQtaW1hZ2VcIiwgXCJzaGllbGQtdGV4dFwiXSxcbiAgICBcImFjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImFjdGlvblwiOiBcInotaW5kZXhcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWltYWdlXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInVyaVwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLXRleHRcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtdGV4dC1jb2xvclwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCIjMDAwMDAwXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtdGV4dC1vcGFjaXR5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcIm9wYWNpdHlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWZvbnQtZmFtaWx5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWZvbnQtc2l6ZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImZvbnQtZmFtaWx5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiZm9udC1zaXplXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWNhc2luZy13aWR0aFwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1jYXNpbmctY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiIzAwMDAwMFwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWNhc2luZy1vcGFjaXR5XCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAxLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1mcmFtZS13aWR0aFwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1mcmFtZS1jb2xvclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCIjMDAwMDAwXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImNvbG9yXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtZnJhbWUtb3BhY2l0eVwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMSxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJhbGxvdy1vdmVybGFwXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcIi14LWtvdGhpYy1wYWRkaW5nXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMjBcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogNjBcbiAgfSxcbl07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCByYnVzaCA9IHJlcXVpcmUoJ3JidXNoJyk7XG5cbmNvbnN0IENvbGxpc2lvbkJ1ZmZlciA9IGZ1bmN0aW9uIChoZWlnaHQsIHdpZHRoKSB7XG4gIHRoaXMuYnVmZmVyID0gcmJ1c2goMjU2KTtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbn07XG5cbmZ1bmN0aW9uIGdldEJveEZyb21Qb2ludChwb2ludCwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgaWQpIHtcbiAgY29uc3QgZHggPSB3aWR0aCAvIDIgKyBwYWRkaW5nO1xuICBjb25zdCBkeSA9IGhlaWdodCAvIDIgKyBwYWRkaW5nO1xuXG4gIHJldHVybiB7XG4gICAgbWluWDogcG9pbnRbMF0gLSBkeCxcbiAgICBtaW5ZOiBwb2ludFsxXSAtIGR5LFxuICAgIG1heFg6IHBvaW50WzBdICsgZHgsXG4gICAgbWF4WTogcG9pbnRbMV0gKyBkeSxcbiAgICBpZDogaWRcbiAgfTtcbn1cblxuQ29sbGlzaW9uQnVmZmVyLnByb3RvdHlwZS5hZGRQb2ludFdIID0gZnVuY3Rpb24gKHBvaW50LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBpZCkge1xuICB0aGlzLmJ1ZmZlci5pbnNlcnQoZ2V0Qm94RnJvbVBvaW50KHBvaW50LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBpZCkpO1xufVxuXG5Db2xsaXNpb25CdWZmZXIucHJvdG90eXBlLmFkZFBvaW50cyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgY29uc3QgcG9pbnRzID0gcGFyYW1zLm1hcCgoYXJncykgPT4gZ2V0Qm94RnJvbVBvaW50LmFwcGx5KG51bGwsIGFyZ3MpKTtcbiAgdGhpcy5idWZmZXIubG9hZChwb2ludHMpO1xufVxuXG5Db2xsaXNpb25CdWZmZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oYm94KSB7XG4gIGNvbnN0IHJlc3VsdCA9IHRoaXMuYnVmZmVyLnNlYXJjaChib3gpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PSAwO1xufVxuXG5Db2xsaXNpb25CdWZmZXIucHJvdG90eXBlLmNoZWNrUG9pbnRXSCA9IGZ1bmN0aW9uIChwb2ludCwgd2lkdGgsIGhlaWdodCwgaWQpIHtcbiAgY29uc3QgYm94ID0gZ2V0Qm94RnJvbVBvaW50KHBvaW50LCB3aWR0aCwgaGVpZ2h0LCAwKTtcblxuICAvL0Fsd2F5cyBzaG93IGNvbGxpc2lvbiBvdXRzaWRlIHRoZSBDb2xsaXNpb25CdWZmZXJcbiAgLy9UT0RPOiBXaHkgZG8gd2UgbmVlZCB0aGlzPz8/XG4gIGlmIChib3gubWluWCA8IDAgfHwgYm94Lm1pblkgPCAwIHx8IGJveC5tYXhYID4gdGhpcy53aWR0aCB8fCBib3gubWF4WSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSB0aGlzLmJ1ZmZlci5zZWFyY2goYm94KTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzdWx0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgLy8gT2JqZWN0IHdpdGggc2FtZSBJRCBkb2Vzbid0IGluZHVjZSBhIGNvbGxpc2lvbiwgYnV0IGRpZmZlcmVudCBpZHMgZG9lc1xuICAgIGlmIChpZCAhPT0gcmVzdWx0W2ldLmlkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGlzaW9uQnVmZmVyO1xuIiwiY29uc3QgY29sb3JzID0ge1xuICAnYWxpY2VibHVlJzogJyNGMEY4RkYnLFxuICAnYW50aXF1ZXdoaXRlJzogJyNGQUVCRDcnLFxuICAnYXF1YSc6ICcjMDBGRkZGJyxcbiAgJ2FxdWFtYXJpbmUnOiAnIzdGRkZENCcsXG4gICdhenVyZSc6ICcjRjBGRkZGJyxcbiAgJ2JlaWdlJzogJyNGNUY1REMnLFxuICAnYmlzcXVlJzogJyNGRkU0QzQnLFxuICAnYmxhY2snOiAnIzAwMDAwMCcsXG4gICdibGFuY2hlZGFsbW9uZCc6ICcjRkZFQkNEJyxcbiAgJ2JsdWUnOiAnIzAwMDBGRicsXG4gICdibHVldmlvbGV0JzogJyM4QTJCRTInLFxuICAnYnJvd24nOiAnI0E1MkEyQScsXG4gICdidXJseXdvb2QnOiAnI0RFQjg4NycsXG4gICdjYWRldGJsdWUnOiAnIzVGOUVBMCcsXG4gICdjaGFydHJldXNlJzogJyM3RkZGMDAnLFxuICAnY2hvY29sYXRlJzogJyNEMjY5MUUnLFxuICAnY29yYWwnOiAnI0ZGN0Y1MCcsXG4gICdjb3JuZmxvd2VyYmx1ZSc6ICcjNjQ5NUVEJyxcbiAgJ2Nvcm5zaWxrJzogJyNGRkY4REMnLFxuICAnY3JpbXNvbic6ICcjREMxNDNDJyxcbiAgJ2N5YW4nOiAnIzAwRkZGRicsXG4gICdkYXJrYmx1ZSc6ICcjMDAwMDhCJyxcbiAgJ2RhcmtjeWFuJzogJyMwMDhCOEInLFxuICAnZGFya2dvbGRlbnJvZCc6ICcjQjg4NjBCJyxcbiAgJ2RhcmtncmF5JzogJyNBOUE5QTknLFxuICAnZGFya2dyZWVuJzogJyMwMDY0MDAnLFxuICAnZGFya2dyZXknOiAnI0E5QTlBOScsXG4gICdkYXJra2hha2knOiAnI0JEQjc2QicsXG4gICdkYXJrbWFnZW50YSc6ICcjOEIwMDhCJyxcbiAgJ2RhcmtvbGl2ZWdyZWVuJzogJyM1NTZCMkYnLFxuICAnZGFya29yYW5nZSc6ICcjRkY4QzAwJyxcbiAgJ2RhcmtvcmNoaWQnOiAnIzk5MzJDQycsXG4gICdkYXJrcmVkJzogJyM4QjAwMDAnLFxuICAnZGFya3NhbG1vbic6ICcjRTk5NjdBJyxcbiAgJ2RhcmtzZWFncmVlbic6ICcjOEZCQzhGJyxcbiAgJ2RhcmtzbGF0ZWJsdWUnOiAnIzQ4M0Q4QicsXG4gICdkYXJrc2xhdGVncmF5JzogJyMyRjRGNEYnLFxuICAnZGFya3NsYXRlZ3JleSc6ICcjMkY0RjRGJyxcbiAgJ2Rhcmt0dXJxdW9pc2UnOiAnIzAwQ0VEMScsXG4gICdkYXJrdmlvbGV0JzogJyM5NDAwRDMnLFxuICAnZGVlcHBpbmsnOiAnI0ZGMTQ5MycsXG4gICdkZWVwc2t5Ymx1ZSc6ICcjMDBCRkZGJyxcbiAgJ2RpbWdyYXknOiAnIzY5Njk2OScsXG4gICdkaW1ncmV5JzogJyM2OTY5NjknLFxuICAnZG9kZ2VyYmx1ZSc6ICcjMUU5MEZGJyxcbiAgJ2ZpcmVicmljayc6ICcjQjIyMjIyJyxcbiAgJ2Zsb3JhbHdoaXRlJzogJyNGRkZBRjAnLFxuICAnZm9yZXN0Z3JlZW4nOiAnIzIyOEIyMicsXG4gICdmdWNoc2lhJzogJyNGRjAwRkYnLFxuICAnZ2FpbnNib3JvJzogJyNEQ0RDREMnLFxuICAnZ2hvc3R3aGl0ZSc6ICcjRjhGOEZGJyxcbiAgJ2dvbGQnOiAnI0ZGRDcwMCcsXG4gICdnb2xkZW5yb2QnOiAnI0RBQTUyMCcsXG4gICdncmF5JzogJyM4MDgwODAnLFxuICAnZ3JlZW4nOiAnIzAwODAwMCcsXG4gICdncmVlbnllbGxvdyc6ICcjQURGRjJGJyxcbiAgJ2dyZXknOiAnIzgwODA4MCcsXG4gICdob25leWRldyc6ICcjRjBGRkYwJyxcbiAgJ2hvdHBpbmsnOiAnI0ZGNjlCNCcsXG4gICdpbmRpYW5yZWQnOiAnI0NENUM1QycsXG4gICdpbmRpZ28nOiAnIzRCMDA4MicsXG4gICdpdm9yeSc6ICcjRkZGRkYwJyxcbiAgJ2toYWtpJzogJyNGMEU2OEMnLFxuICAnbGF2ZW5kZXInOiAnI0U2RTZGQScsXG4gICdsYXZlbmRlcmJsdXNoJzogJyNGRkYwRjUnLFxuICAnbGF3bmdyZWVuJzogJyM3Q0ZDMDAnLFxuICAnbGVtb25jaGlmZm9uJzogJyNGRkZBQ0QnLFxuICAnbGlnaHRibHVlJzogJyNBREQ4RTYnLFxuICAnbGlnaHRjb3JhbCc6ICcjRjA4MDgwJyxcbiAgJ2xpZ2h0Y3lhbic6ICcjRTBGRkZGJyxcbiAgJ2xpZ2h0Z29sZGVucm9keWVsbG93JzogJyNGQUZBRDInLFxuICAnbGlnaHRncmF5JzogJyNEM0QzRDMnLFxuICAnbGlnaHRncmVlbic6ICcjOTBFRTkwJyxcbiAgJ2xpZ2h0Z3JleSc6ICcjRDNEM0QzJyxcbiAgJ2xpZ2h0cGluayc6ICcjRkZCNkMxJyxcbiAgJ2xpZ2h0c2FsbW9uJzogJyNGRkEwN0EnLFxuICAnbGlnaHRzZWFncmVlbic6ICcjMjBCMkFBJyxcbiAgJ2xpZ2h0c2t5Ymx1ZSc6ICcjODdDRUZBJyxcbiAgJ2xpZ2h0c2xhdGVncmF5JzogJyM3Nzg4OTknLFxuICAnbGlnaHRzbGF0ZWdyZXknOiAnIzc3ODg5OScsXG4gICdsaWdodHN0ZWVsYmx1ZSc6ICcjQjBDNERFJyxcbiAgJ2xpZ2h0eWVsbG93JzogJyNGRkZGRTAnLFxuICAnbGltZSc6ICcjMDBGRjAwJyxcbiAgJ2xpbWVncmVlbic6ICcjMzJDRDMyJyxcbiAgJ2xpbmVuJzogJyNGQUYwRTYnLFxuICAnbWFnZW50YSc6ICcjRkYwMEZGJyxcbiAgJ21hcm9vbic6ICcjODAwMDAwJyxcbiAgJ21lZGl1bWFxdWFtYXJpbmUnOiAnIzY2Q0RBQScsXG4gICdtZWRpdW1ibHVlJzogJyMwMDAwQ0QnLFxuICAnbWVkaXVtb3JjaGlkJzogJyNCQTU1RDMnLFxuICAnbWVkaXVtcHVycGxlJzogJyM5MzcwREInLFxuICAnbWVkaXVtc2VhZ3JlZW4nOiAnIzNDQjM3MScsXG4gICdtZWRpdW1zbGF0ZWJsdWUnOiAnIzdCNjhFRScsXG4gICdtZWRpdW1zcHJpbmdncmVlbic6ICcjMDBGQTlBJyxcbiAgJ21lZGl1bXR1cnF1b2lzZSc6ICcjNDhEMUNDJyxcbiAgJ21lZGl1bXZpb2xldHJlZCc6ICcjQzcxNTg1JyxcbiAgJ21pZG5pZ2h0Ymx1ZSc6ICcjMTkxOTcwJyxcbiAgJ21pbnRjcmVhbSc6ICcjRjVGRkZBJyxcbiAgJ21pc3R5cm9zZSc6ICcjRkZFNEUxJyxcbiAgJ21vY2Nhc2luJzogJyNGRkU0QjUnLFxuICAnbmF2YWpvd2hpdGUnOiAnI0ZGREVBRCcsXG4gICduYXZ5JzogJyMwMDAwODAnLFxuICAnb2xkbGFjZSc6ICcjRkRGNUU2JyxcbiAgJ29saXZlJzogJyM4MDgwMDAnLFxuICAnb2xpdmVkcmFiJzogJyM2QjhFMjMnLFxuICAnb3JhbmdlJzogJyNGRkE1MDAnLFxuICAnb3JhbmdlcmVkJzogJyNGRjQ1MDAnLFxuICAnb3JjaGlkJzogJyNEQTcwRDYnLFxuICAncGFsZWdvbGRlbnJvZCc6ICcjRUVFOEFBJyxcbiAgJ3BhbGVncmVlbic6ICcjOThGQjk4JyxcbiAgJ3BhbGV0dXJxdW9pc2UnOiAnI0FGRUVFRScsXG4gICdwYWxldmlvbGV0cmVkJzogJyNEQjcwOTMnLFxuICAncGFwYXlhd2hpcCc6ICcjRkZFRkQ1JyxcbiAgJ3BlYWNocHVmZic6ICcjRkZEQUI5JyxcbiAgJ3BlcnUnOiAnI0NEODUzRicsXG4gICdwaW5rJzogJyNGRkMwQ0InLFxuICAncGx1bSc6ICcjRERBMEREJyxcbiAgJ3Bvd2RlcmJsdWUnOiAnI0IwRTBFNicsXG4gICdwdXJwbGUnOiAnIzgwMDA4MCcsXG4gICdyZWQnOiAnI0ZGMDAwMCcsXG4gICdyb3N5YnJvd24nOiAnI0JDOEY4RicsXG4gICdyb3lhbGJsdWUnOiAnIzQxNjlFMScsXG4gICdzYWRkbGVicm93bic6ICcjOEI0NTEzJyxcbiAgJ3NhbG1vbic6ICcjRkE4MDcyJyxcbiAgJ3NhbmR5YnJvd24nOiAnI0Y0QTQ2MCcsXG4gICdzZWFncmVlbic6ICcjMkU4QjU3JyxcbiAgJ3NlYXNoZWxsJzogJyNGRkY1RUUnLFxuICAnc2llbm5hJzogJyNBMDUyMkQnLFxuICAnc2lsdmVyJzogJyNDMEMwQzAnLFxuICAnc2t5Ymx1ZSc6ICcjODdDRUVCJyxcbiAgJ3NsYXRlYmx1ZSc6ICcjNkE1QUNEJyxcbiAgJ3NsYXRlZ3JheSc6ICcjNzA4MDkwJyxcbiAgJ3NsYXRlZ3JleSc6ICcjNzA4MDkwJyxcbiAgJ3Nub3cnOiAnI0ZGRkFGQScsXG4gICdzcHJpbmdncmVlbic6ICcjMDBGRjdGJyxcbiAgJ3N0ZWVsYmx1ZSc6ICcjNDY4MkI0JyxcbiAgJ3Rhbic6ICcjRDJCNDhDJyxcbiAgJ3RlYWwnOiAnIzAwODA4MCcsXG4gICd0aGlzdGxlJzogJyNEOEJGRDgnLFxuICAndG9tYXRvJzogJyNGRjYzNDcnLFxuICAndHVycXVvaXNlJzogJyM0MEUwRDAnLFxuICAndmlvbGV0JzogJyNFRTgyRUUnLFxuICAnd2hlYXQnOiAnI0Y1REVCMycsXG4gICd3aGl0ZSc6ICcjRkZGRkZGJyxcbiAgJ3doaXRlc21va2UnOiAnI0Y1RjVGNScsXG4gICd5ZWxsb3cnOiAnI0ZGRkYwMCcsXG4gICd5ZWxsb3dncmVlbic6ICcjOUFDRDMyJ1xufVxuXG5jb25zdCBjb2xvcnNfdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhjb2xvcnMpXG4gIC5zb3J0KChhLCBiKSA9PiAwLjUgLSBNYXRoLnJhbmRvbSgpKTtcbnZhciBpbmRleCA9IDA7XG5cbmZ1bmN0aW9uIG5leHRDb2xvcigpIHtcbiAgY29uc3QgY29sb3IgPSBjb2xvcnNfdmFsdWVzW2luZGV4KytdO1xuICBpZiAoaW5kZXggPiBjb2xvcnNfdmFsdWVzLmxlbmd0aCkge1xuICAgIGluZGV4ID0gMDtcbiAgfVxuICByZXR1cm4gY29sb3I7XG59XG5cbm1vZHVsZS5leHBvcnRzLm5leHRDb2xvciA9IG5leHRDb2xvcjtcbiIsIid1c2Ugc3RyaWN0JztcbmZ1bmN0aW9uIHNlcmllcyhmbnMsIGdldEZyYW1lLCBjYWxsYmFjaykge1xuICBpZiAoZm5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICB2YXIgY3VycmVudCA9IDA7XG5cbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBpZiAoY3VycmVudCA+PSBmbnMubGVuZ3RoKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGcmFtZSgoKSA9PiBmbnNbY3VycmVudCsrXShuZXh0KSk7XG4gICAgfVxuICB9XG5cbiAgbmV4dCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXJpZXMgPSBzZXJpZXM7XG4iLCIvKipcbiAgKiBDb2xsZWN0aW9uIG9mIGdlb21ldHJ5IHV0aWxsaXRpZXNcbiAgKi9cblxuLy8gY2hlY2sgaWYgdGhlIHBvaW50IFtpbiBYWSBjb29yZGluYXRlc10gaXMgb24gdGlsZSdzIGVkZ2Vcbi8vIHJldHVybnMgNC1iaXRzIGJpdG1hc2sgb2YgYWZmZWN0ZWQgdGlsZSBib3VuZGFyaWVzOlxuLy8gICBiaXQgMCAtIGxlZnRcbi8vICAgYml0IDEgLSByaWdodFxuLy8gICBiaXQgMiAtIHRvcFxuLy8gICBiaXQgMyAtIGJvdHRvbVxuZXhwb3J0cy5pc09uVGlsZUJvdW5kYXJ5ID0gZnVuY3Rpb24ocCwgdGlsZV93aWR0aCwgdGlsZV9oZWlnaHQpIHtcbiAgdmFyIHIgPSAwO1xuICBpZiAocFswXSA9PT0gMCkge1xuICAgIHIgfD0gMTtcbiAgfSBlbHNlIGlmIChwWzBdID09PSB0aWxlX3dpZHRoKSB7XG4gICAgciB8PSAyO1xuICB9XG5cbiAgaWYgKHBbMV0gPT09IDApIHtcbiAgICByIHw9IDQ7XG4gIH0gZWxzZSBpZiAocFsxXSA9PT0gdGlsZV9oZWlnaHQpIHtcbiAgICByIHw9IDg7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbi8qIGNoZWNrIGlmIDIgcG9pbnRzIGFyZSBib3RoIG9uIHRoZSBzYW1lIHRpbGUgYm91bmRhcnlcbiAqXG4gKiBJZiBwb2ludHMgb2YgdGhlIG9iamVjdCBhcmUgb24gdGhlIHNhbWUgdGlsZSBib3VuZGFyeSBpdCBpcyBhc3N1bWVkXG4gKiB0aGF0IHRoZSBvYmplY3QgaXMgY3V0IGhlcmUgYW5kIHdvdWxkIG9yaWdpbmFsbHkgY29udGludWUgYmV5b25kIHRoZVxuICogdGlsZSBib3JkZXJzLlxuICpcbiAqIFRoaXMgY2hlY2sgZG9lcyBub3QgY2F0Y2ggdGhlIGNhc2Ugd2hlcmUgdGhlIG9iamVjdCBpcyBsb2NhdGVkIGV4YWN0bHlcbiAqIG9uIHRoZSB0aWxlIGJvdW5kYXJpZXMsIGJ1dCB0aGlzIGNhc2UgY2FuJ3QgcHJvcGVybHkgYmUgZGV0ZWN0ZWQgaGVyZS5cbiAqL1xuZXhwb3J0cy5jaGVja1NhbWVCb3VuZGFyeSA9IGZ1bmN0aW9uKHAsIHEsIHRpbGVfd2lkdGgsIHRpbGVfaGVpZ2h0KSB7XG4gIHZhciBicCA9IGV4cG9ydHMuaXNPblRpbGVCb3VuZGFyeShwLCB0aWxlX3dpZHRoLCB0aWxlX2hlaWdodCk7XG5cbiAgaWYgKCFicCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAoYnAgJiBleHBvcnRzLmlzT25UaWxlQm91bmRhcnkocSwgdGlsZV93aWR0aCwgdGlsZV9oZWlnaHQpKTtcbn1cblxuLy8gZ2V0IGEgc2luZ2xlIHBvaW50IHJlcHJlc2VudGluZyBnZW9tZXRyeSBmZWF0dXJlIChlLmcuIGNlbnRyb2lkKVxuZXhwb3J0cy5nZXRSZXByUG9pbnQgPSBmdW5jdGlvbiAoZ2VvbWV0cnksIHByb2plY3RQb2ludEZ1bmN0aW9uKSB7XG4gIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICBjYXNlICdQb2ludCc6XG4gICAgcG9pbnQgPSBnZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICBicmVhaztcbiAgY2FzZSAnUG9seWdvbic6XG4gICAgLy9UT0RPOiBEb24ndCBleHBlY3Qgd2UncmUgaGF2ZSB0aGlzIGZpZWxkLiBXZSBtYXkgaGF2ZSBwbGFpbiBKU09OIGhlcmUsXG4gICAgLy8gc28gaXQncyBiZXR0ZXIgdG8gY2hlY2sgYSBmZWF0dXJlIHByb3BlcnR5IGFuZCBjYWxjdWxhdGUgcG9seWdvbiBjZW50cm9pZCBoZXJlXG4gICAgLy8gaWYgc2VydmVyIGRvZXNuJ3QgcHJvdmlkZSByZXByZXNlbnRhdGl2ZSBwb2ludFxuICAgIHBvaW50ID0gZ2VvbWV0cnkucmVwcnBvaW50O1xuICAgIGJyZWFrO1xuICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAvLyBVc2UgY2VudGVyIG9mIGxpbmUgaGVyZVxuICAgIC8vIFRPRE86IFRoaXMgYXBwcm9hY2ggaXMgcHJldHR5IHJvdWdoOiB3ZSBuZWVkIHRvIGNoZWNrIG5vdCBvbmx5IHNpbmdsZSBwb2ludCxcbiAgICAvLyBmb3IgbGFiZWwgcGxhY2luZywgYnV0IGFueSBwb2ludCBvbiB0aGUgbGluZVxuICAgIHZhciBsZW4gPSBleHBvcnRzLmdldFBvbHlMZW5ndGgoZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgIHZhciBwb2ludCA9IGV4cG9ydHMuZ2V0QW5nbGVBbmRDb29yZHNBdExlbmd0aChnZW9tZXRyeS5jb29yZGluYXRlcywgbGVuIC8gMiwgMCk7XG4gICAgcG9pbnQgPSBbcG9pbnRbMV0sIHBvaW50WzJdXTtcbiAgICBicmVhaztcbiAgY2FzZSAnR2VvbWV0cnlDb2xsZWN0aW9uJzpcbiAgICAvL1RPRE86IERpc2Fzc2VtYmxlIGdlb21ldHJ5IGNvbGxlY3Rpb25cbiAgICByZXR1cm47XG4gIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIC8vVE9ETzogRGlzYXNzZW1ibGUgbXVsdGkgcG9pbnRcbiAgICByZXR1cm47XG4gIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgcG9pbnQgPSBnZW9tZXRyeS5yZXBycG9pbnQ7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgLy9UT0RPOiBEaXNhc3NlbWJsZSBnZW9tZXRyeSBjb2xsZWN0aW9uXG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBwcm9qZWN0UG9pbnRGdW5jdGlvbihwb2ludCk7XG59O1xuXG4vLyBDYWxjdWxhdGUgbGVuZ3RoIG9mIGxpbmVcbmV4cG9ydHMuZ2V0UG9seUxlbmd0aCA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgdmFyIGxlbmd0aCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYyA9IHBvaW50c1tpXSxcbiAgICAgIHBjID0gcG9pbnRzW2kgLSAxXSxcbiAgICAgIGR4ID0gcGNbMF0gLSBjWzBdLFxuICAgICAgZHkgPSBwY1sxXSAtIGNbMV07XG5cbiAgICBsZW5ndGggKz0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgfVxuICByZXR1cm4gbGVuZ3RoO1xufTtcblxuZXhwb3J0cy5nZXRBbmdsZUFuZENvb3Jkc0F0TGVuZ3RoID0gZnVuY3Rpb24gKHBvaW50cywgZGlzdCwgd2lkdGgpIHtcbiAgdmFyIHgsIHksXG4gICAgbGVuZ3RoID0gMCxcbiAgICBhbmdsZSwgc2FtZXNlZyA9IHRydWUsXG4gICAgZ290eHkgPSBmYWxzZTtcblxuICB3aWR0aCA9IHdpZHRoIHx8IDA7IC8vIGJ5IGRlZmF1bHQgd2UgdGhpbmsgdGhhdCBhIGxldHRlciBpcyAwIHB4IHdpZGVcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChnb3R4eSkge1xuICAgICAgc2FtZXNlZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBjID0gcG9pbnRzW2ldLFxuICAgICAgcGMgPSBwb2ludHNbaSAtIDFdLFxuICAgICAgZHggPSBjWzBdIC0gcGNbMF0sXG4gICAgICBkeSA9IGNbMV0gLSBwY1sxXTtcblxuICAgIHZhciBzZWdMZW4gPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgaWYgKCFnb3R4eSAmJiBsZW5ndGggKyBzZWdMZW4gPj0gZGlzdCkge1xuICAgICAgdmFyIHBhcnRMZW4gPSBkaXN0IC0gbGVuZ3RoO1xuICAgICAgeCA9IHBjWzBdICsgZHggKiBwYXJ0TGVuIC8gc2VnTGVuO1xuICAgICAgeSA9IHBjWzFdICsgZHkgKiBwYXJ0TGVuIC8gc2VnTGVuO1xuXG4gICAgICBnb3R4eSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGdvdHh5ICYmIGxlbmd0aCArIHNlZ0xlbiA+PSBkaXN0ICsgd2lkdGgpIHtcbiAgICAgIHZhciBwYXJ0TGVuID0gZGlzdCArIHdpZHRoIC0gbGVuZ3RoO1xuXG4gICAgICBkeCA9IHBjWzBdICsgZHggKiBwYXJ0TGVuIC8gc2VnTGVuO1xuICAgICAgZHkgPSBwY1sxXSArIGR5ICogcGFydExlbiAvIHNlZ0xlbjtcbiAgICAgIGFuZ2xlID0gTWF0aC5hdGFuMihkeSAtIHksIGR4IC0geCk7XG5cbiAgICAgIGlmIChzYW1lc2VnKSB7XG4gICAgICAgIHJldHVybiBbYW5nbGUsIHgsIHksIHNlZ0xlbiAtIHBhcnRMZW5dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFthbmdsZSwgeCwgeSwgMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGVuZ3RoICs9IHNlZ0xlbjtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiogVXRpbGxpdHkgY2xhc3MgZm9yIG1hbmFnaW5nIENhbnZhcyBjb250ZXh0IHN0eWxlIHByb3BlcnRpZXNcbiAqKi9cblxuY29uc3QgZGVmYXVsdENhbnZhc1N0eWxlID0ge1xuICBzdHJva2VTdHlsZTogJ3JnYmEoMCwwLDAsMC41KScsXG4gIGZpbGxTdHlsZTogJ3JnYmEoMCwwLDAsMC41KScsXG4gIGxpbmVXaWR0aDogMSxcbiAgbGluZUNhcDogJ3JvdW5kJyxcbiAgbGluZUpvaW46ICdyb3VuZCcsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHRleHRCYXNlbGluZTogJ21pZGRsZSdcbn07XG5cbi8qKlxuICoqIENvbXBvc2UgZm9udCBkZWNsYXJhdGlvbiBzdHJpbmcgZm9yIENhbnZhcyBjb250ZXh0XG4gKiovXG5leHBvcnRzLmNvbXBvc2VGb250RGVjbGFyYXRpb24gPSBmdW5jdGlvbihuYW1lPScnLCBzaXplPTksIHN0eWxlKSB7XG4gIHZhciBmYW1pbHkgPSBuYW1lID8gbmFtZSArICcsICcgOiAnJztcbiAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuICB2YXIgcGFydHMgPSBbXTtcbiAgaWYgKHN0eWxlWydmb250LXN0eWxlJ10gPT09ICdpdGFsaWMnIHx8IHN0eWxlWydmb250LXN0eWxlJ10gPT09ICdvYmxpcXVlJykge1xuICAgIHBhcnRzLnB1c2goc3R5bGVbJ2ZvbnQtc3R5bGUnXSk7XG4gIH1cblxuICBpZiAoc3R5bGVbJ2ZvbnQtdmFyaWFudCddID09PSAnc21hbGwtY2FwcycpIHtcbiAgICBwYXJ0cy5wdXNoKHN0eWxlWydmb250LXZhcmlhbnQnXSk7XG4gIH1cblxuICBpZiAoc3R5bGVbJ2ZvbnQtd2VpZ2h0J10gPT09ICdib2xkJykge1xuICAgIHBhcnRzLnB1c2goc3R5bGVbJ2ZvbnQtd2VpZ2h0J10pO1xuICB9XG5cbiAgcGFydHMucHVzaChzaXplICsgJ3B4Jyk7XG5cbiAgaWYgKG5hbWUuaW5kZXhPZignc2VyaWYnKSAhPT0gLTEgJiYgbmFtZS5pbmRleE9mKCdzYW5zLXNlcmlmJykgPT09IC0xKSB7XG4gICAgZmFtaWx5ICs9ICdHZW9yZ2lhLCBzZXJpZic7XG4gIH0gZWxzZSB7XG4gICAgZmFtaWx5ICs9ICdcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWYnO1xuICB9XG4gIHBhcnRzLnB1c2goZmFtaWx5KTtcblxuICByZXR1cm4gcGFydHMuam9pbignICcpO1xufVxuXG4vKipcbiAqKiBBcHBseSBzdHlsZXMgdG8gQ2FudmFzIGNvbnRleHRcbiAqKi9cbmV4cG9ydHMuYXBwbHlTdHlsZSA9IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGN0eFtrZXldID0gc3R5bGVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiogQXBwbHkgZGVmYXVsdCBzdHlsZSB0byBDYW52YXMgY29udGV4dFxuICoqL1xuZXhwb3J0cy5hcHBseURlZmF1bHRzID0gZnVuY3Rpb24oY3R4KSB7XG4gIGV4cG9ydHMuYXBwbHlTdHlsZShjdHgsIGRlZmF1bHRDYW52YXNTdHlsZSk7XG59XG4iLCIvLyBHZW5lcmF0ZWQgYXV0b21hdGljYWxseSBieSBuZWFybGV5LCB2ZXJzaW9uIHVua25vd25cbi8vIGh0dHA6Ly9naXRodWIuY29tL0hhcmRtYXRoMTIzL25lYXJsZXlcbihmdW5jdGlvbiAoKSB7XG5mdW5jdGlvbiBpZCh4KSB7IHJldHVybiB4WzBdOyB9XG5cbi8vIEJ5cGFzc2VzIFRTNjEzMy4gQWxsb3cgZGVjbGFyZWQgYnV0IHVudXNlZCBmdW5jdGlvbnMuXG4vLyBAdHMtaWdub3JlXG5mdW5jdGlvbiBudGgobikge1xuICAgIHJldHVybiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBkW25dO1xuICAgIH07XG59XG5cblxuLy8gQnlwYXNzZXMgVFM2MTMzLiBBbGxvdyBkZWNsYXJlZCBidXQgdW51c2VkIGZ1bmN0aW9ucy5cbi8vIEB0cy1pZ25vcmVcbmZ1bmN0aW9uICQobykge1xuICAgIHJldHVybiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMobykuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICByZXRba10gPSBkW29ba11dO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xufVxudmFyIGdyYW1tYXIgPSB7XG4gICAgTGV4ZXI6IHVuZGVmaW5lZCxcbiAgICBQYXJzZXJSdWxlczogW1xuICAgIHtcIm5hbWVcIjogXCJfJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJfJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiXyRlYm5mJDFcIiwgXCJ3c2NoYXJcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIl9cIiwgXCJzeW1ib2xzXCI6IFtcIl8kZWJuZiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiX18kZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJ3c2NoYXJcIl19LFxuICAgIHtcIm5hbWVcIjogXCJfXyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcIl9fJGVibmYkMVwiLCBcIndzY2hhclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiX19cIiwgXCJzeW1ib2xzXCI6IFtcIl9fJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcIndzY2hhclwiLCBcInN5bWJvbHNcIjogWy9bIFxcdFxcblxcdlxcZl0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2ludCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2ludCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2ludCRlYm5mJDFcIiwgL1swLTldL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2ludFwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfaW50JGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGRbMF0uam9pbihcIlwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwiaW50JGVibmYkMSRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCItXCJ9XX0sXG4gICAge1wibmFtZVwiOiBcImludCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiK1wifV19LFxuICAgIHtcIm5hbWVcIjogXCJpbnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJpbnQkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImludCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiaW50JGVibmYkMlwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwiaW50JGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1wiaW50JGVibmYkMlwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiaW50XCIsIFwic3ltYm9sc1wiOiBbXCJpbnQkZWJuZiQxXCIsIFwiaW50JGVibmYkMlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgaWYgKGRbMF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZFswXVswXStkWzFdLmpvaW4oXCJcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZFsxXS5qb2luKFwiXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQxXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1swLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMiRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIuXCJ9LCBcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIl19LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfZGVjaW1hbCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbFwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfZGVjaW1hbCRlYm5mJDFcIiwgXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoXG4gICAgICAgICAgICAgICAgZFswXS5qb2luKFwiXCIpICtcbiAgICAgICAgICAgICAgICAoZFsxXSA/IFwiLlwiK2RbMV1bMV0uam9pbihcIlwiKSA6IFwiXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcImRlY2ltYWwkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLVwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMlwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcImRlY2ltYWwkZWJuZiQyXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1swLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJkZWNpbWFsJGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMyRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIuXCJ9LCBcImRlY2ltYWwkZWJuZiQzJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIl19LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkM1wiLCBcInN5bWJvbHNcIjogW1wiZGVjaW1hbCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDNcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbFwiLCBcInN5bWJvbHNcIjogW1wiZGVjaW1hbCRlYm5mJDFcIiwgXCJkZWNpbWFsJGVibmYkMlwiLCBcImRlY2ltYWwkZWJuZiQzXCJdLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChcbiAgICAgICAgICAgICAgICAoZFswXSB8fCBcIlwiKSArXG4gICAgICAgICAgICAgICAgZFsxXS5qb2luKFwiXCIpICtcbiAgICAgICAgICAgICAgICAoZFsyXSA/IFwiLlwiK2RbMl1bMV0uam9pbihcIlwiKSA6IFwiXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcInBlcmNlbnRhZ2VcIiwgXCJzeW1ib2xzXCI6IFtcImRlY2ltYWxcIiwge1wibGl0ZXJhbFwiOlwiJVwifV0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkWzBdLzEwMDtcbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLVwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcImpzb25mbG9hdCRlYm5mJDJcIiwgL1swLTldL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJqc29uZmxvYXQkZWJuZiQzJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgL1swLTldL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLlwifSwgXCJqc29uZmxvYXQkZWJuZiQzJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIl19LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXCJqc29uZmxvYXQkZWJuZiQzJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDNcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1srLV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDQkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDQkc3ViZXhwcmVzc2lvbiQxJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1wianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDEkZWJuZiQyXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogWy9bZUVdLywgXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIl19LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0XCIsIFwic3ltYm9sc1wiOiBbXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDRcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0XCIsIFwic3ltYm9sc1wiOiBbXCJqc29uZmxvYXQkZWJuZiQxXCIsIFwianNvbmZsb2F0JGVibmYkMlwiLCBcImpzb25mbG9hdCRlYm5mJDNcIiwgXCJqc29uZmxvYXQkZWJuZiQ0XCJdLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChcbiAgICAgICAgICAgICAgICAoZFswXSB8fCBcIlwiKSArXG4gICAgICAgICAgICAgICAgZFsxXS5qb2luKFwiXCIpICtcbiAgICAgICAgICAgICAgICAoZFsyXSA/IFwiLlwiK2RbMl1bMV0uam9pbihcIlwiKSA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAoZFszXSA/IFwiZVwiICsgKGRbM11bMV0gfHwgXCIrXCIpICsgZFszXVsyXS5qb2luKFwiXCIpIDogXCJcIilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwiZHFzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcImRxc3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiZHFzdHJpbmckZWJuZiQxXCIsIFwiZHN0cmNoYXJcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcImRxc3RyaW5nXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiXFxcIlwifSwgXCJkcXN0cmluZyRlYm5mJDFcIiwge1wibGl0ZXJhbFwiOlwiXFxcIlwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBkWzFdLmpvaW4oXCJcIik7IH19LFxuICAgIHtcIm5hbWVcIjogXCJzcXN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwic3FzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJzcXN0cmluZyRlYm5mJDFcIiwgXCJzc3RyY2hhclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3FzdHJpbmdcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCInXCJ9LCBcInNxc3RyaW5nJGVibmYkMVwiLCB7XCJsaXRlcmFsXCI6XCInXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIGRbMV0uam9pbihcIlwiKTsgfX0sXG4gICAge1wibmFtZVwiOiBcImJ0c3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJidHN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImJ0c3RyaW5nJGVibmYkMVwiLCAvW15gXS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJidHN0cmluZ1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImBcIn0sIFwiYnRzdHJpbmckZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcImBcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gZFsxXS5qb2luKFwiXCIpOyB9fSxcbiAgICB7XCJuYW1lXCI6IFwiZHN0cmNoYXJcIiwgXCJzeW1ib2xzXCI6IFsvW15cXFxcXCJcXG5dL10sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJkc3RyY2hhclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIlxcXFxcIn0sIFwic3RyZXNjYXBlXCJdLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShcIlxcXCJcIitkLmpvaW4oXCJcIikrXCJcXFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcInNzdHJjaGFyXCIsIFwic3ltYm9sc1wiOiBbL1teXFxcXCdcXG5dL10sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzc3RyY2hhclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIlxcXFxcIn0sIFwic3RyZXNjYXBlXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIEpTT04ucGFyc2UoXCJcXFwiXCIrZC5qb2luKFwiXCIpK1wiXFxcIlwiKTsgfX0sXG4gICAge1wibmFtZVwiOiBcInNzdHJjaGFyJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiXFxcXFwifSwge1wibGl0ZXJhbFwiOlwiJ1wifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3N0cmNoYXJcIiwgXCJzeW1ib2xzXCI6IFtcInNzdHJjaGFyJHN0cmluZyQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gXCInXCI7IH19LFxuICAgIHtcIm5hbWVcIjogXCJzdHJlc2NhcGVcIiwgXCJzeW1ib2xzXCI6IFsvW1wiXFxcXFxcL2JmbnJ0XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic3RyZXNjYXBlXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwidVwifSwgL1thLWZBLUYwLTldLywgL1thLWZBLUYwLTldLywgL1thLWZBLUYwLTldLywgL1thLWZBLUYwLTldL10sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmpvaW4oXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3JcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIjXCJ9LCBcImhleGRpZ2l0XCIsIFwiaGV4ZGlnaXRcIiwgXCJoZXhkaWdpdFwiLCBcImhleGRpZ2l0XCIsIFwiaGV4ZGlnaXRcIiwgXCJoZXhkaWdpdFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBcInJcIjogcGFyc2VJbnQoZFsxXStkWzJdLCAxNiksXG4gICAgICAgICAgICAgICAgXCJnXCI6IHBhcnNlSW50KGRbM10rZFs0XSwgMTYpLFxuICAgICAgICAgICAgICAgIFwiYlwiOiBwYXJzZUludChkWzVdK2RbNl0sIDE2KSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIiNcIn0sIFwiaGV4ZGlnaXRcIiwgXCJoZXhkaWdpdFwiLCBcImhleGRpZ2l0XCJdLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwiclwiOiBwYXJzZUludChkWzFdK2RbMV0sIDE2KSxcbiAgICAgICAgICAgICAgICBcImdcIjogcGFyc2VJbnQoZFsyXStkWzJdLCAxNiksXG4gICAgICAgICAgICAgICAgXCJiXCI6IHBhcnNlSW50KGRbM10rZFszXSwgMTYpLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiclwifSwge1wibGl0ZXJhbFwiOlwiZ1wifSwge1wibGl0ZXJhbFwiOlwiYlwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3JcIiwgXCJzeW1ib2xzXCI6IFtcImNzc2NvbG9yJHN0cmluZyQxXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIpXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAkKHtcInJcIjogNCwgXCJnXCI6IDgsIFwiYlwiOiAxMn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3Ikc3RyaW5nJDJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJoXCJ9LCB7XCJsaXRlcmFsXCI6XCJzXCJ9LCB7XCJsaXRlcmFsXCI6XCJsXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvclwiLCBcInN5bWJvbHNcIjogW1wiY3NzY29sb3Ikc3RyaW5nJDJcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIihcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6ICQoe1wiaFwiOiA0LCBcInNcIjogOCwgXCJsXCI6IDEyfSl9LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvciRzdHJpbmckM1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInJcIn0sIHtcImxpdGVyYWxcIjpcImdcIn0sIHtcImxpdGVyYWxcIjpcImJcIn0sIHtcImxpdGVyYWxcIjpcImFcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yXCIsIFwic3ltYm9sc1wiOiBbXCJjc3Njb2xvciRzdHJpbmckM1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiZGVjaW1hbFwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKVwifV0sIFwicG9zdHByb2Nlc3NcIjogJCh7XCJyXCI6IDQsIFwiZ1wiOiA4LCBcImJcIjogMTIsIFwiYVwiOiAxNn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3Ikc3RyaW5nJDRcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJoXCJ9LCB7XCJsaXRlcmFsXCI6XCJzXCJ9LCB7XCJsaXRlcmFsXCI6XCJsXCJ9LCB7XCJsaXRlcmFsXCI6XCJhXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvclwiLCBcInN5bWJvbHNcIjogW1wiY3NzY29sb3Ikc3RyaW5nJDRcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIihcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImRlY2ltYWxcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6ICQoe1wiaFwiOiA0LCBcInNcIjogOCwgXCJsXCI6IDEyLCBcImFcIjogMTZ9KX0sXG4gICAge1wibmFtZVwiOiBcImhleGRpZ2l0XCIsIFwic3ltYm9sc1wiOiBbL1thLWZBLUYwLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJjb2xudW1cIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2ludFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImNvbG51bVwiLCBcInN5bWJvbHNcIjogW1wicGVyY2VudGFnZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge3JldHVybiBNYXRoLmZsb29yKGRbMF0qMjU1KTsgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJldmFsJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwidlwifSwge1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwibFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZXZhbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcIkFTXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiZXZhbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZXZhbFwiLCBcInN5bWJvbHNcIjogW1wiZXZhbCRzdHJpbmckMVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKFwifSwgXCJfXCIsIFwiZXZhbCRlYm5mJDFcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IG50aCg0KX0sXG4gICAge1wibmFtZVwiOiBcIkFTXCIsIFwic3ltYm9sc1wiOiBbXCJBU1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiK1wifSwgXCJfXCIsIFwiTURcIl0sIFwicG9zdHByb2Nlc3NcIjogKFthLCBfMSwgXzIsIF8zLCBiXSkgPT4gKHt0eXBlOiAnYmluYXJ5X29wJywgb3A6IFwiK1wiLCBsZWZ0OiBhLCByaWdodDogYn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiQVNcIiwgXCJzeW1ib2xzXCI6IFtcIkFTXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCItXCJ9LCBcIl9cIiwgXCJNRFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2EsIF8xLCBfMiwgXzMsIGJdKSA9PiAoe3R5cGU6ICdiaW5hcnlfb3AnLCBvcDogXCItXCIsIGxlZnQ6IGEsIHJpZ2h0OiBifSl9LFxuICAgIHtcIm5hbWVcIjogXCJBU1wiLCBcInN5bWJvbHNcIjogW1wiTURcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJNRFwiLCBcInN5bWJvbHNcIjogW1wiTURcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIipcIn0sIFwiX1wiLCBcIlBcIl0sIFwicG9zdHByb2Nlc3NcIjogKFthLCBfMSwgXzIsIF8zLCBiXSkgPT4gKHt0eXBlOiAnYmluYXJ5X29wJywgb3A6IFwiKlwiLCBsZWZ0OiBhLCByaWdodDogYn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiTURcIiwgXCJzeW1ib2xzXCI6IFtcIk1EXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIvXCJ9LCBcIl9cIiwgXCJQXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbYSwgXzEsIF8yLCBfMywgYl0pID0+ICh7dHlwZTogJ2JpbmFyeV9vcCcsIG9wOiBcIi9cIiwgbGVmdDogYSwgcmlnaHQ6IGJ9KX0sXG4gICAge1wibmFtZVwiOiBcIk1EXCIsIFwic3ltYm9sc1wiOiBbXCJNRFwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiJVwifSwgXCJfXCIsIFwiUFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2EsIF8xLCBfMiwgXzMsIGJdKSA9PiAoe3R5cGU6ICdiaW5hcnlfb3AnLCBvcDogXCIlXCIsIGxlZnQ6IGEsIHJpZ2h0OiBifSl9LFxuICAgIHtcIm5hbWVcIjogXCJNRFwiLCBcInN5bWJvbHNcIjogW1wiUFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcIlBcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcIl9cIiwgXCJBU1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKVwifV0sIFwicG9zdHByb2Nlc3NcIjogbnRoKDIpfSxcbiAgICB7XCJuYW1lXCI6IFwiUFwiLCBcInN5bWJvbHNcIjogW1wiTlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcIk5cIiwgXCJzeW1ib2xzXCI6IFtcImZsb2F0XCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbeF0pID0+ICh7dHlwZTogJ251bWJlcicsIHZhbHVlOiB4fSl9LFxuICAgIHtcIm5hbWVcIjogXCJOXCIsIFwic3ltYm9sc1wiOiBbXCJmdW5jXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiTlwiLCBcInN5bWJvbHNcIjogW1wiZHFzdHJpbmdcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt4XSkgPT4gKHt0eXBlOiAnc3RyaW5nJywgdmFsdWU6IHh9KX0sXG4gICAge1wibmFtZVwiOiBcImZsb2F0XCIsIFwic3ltYm9sc1wiOiBbXCJpbnRcIiwge1wibGl0ZXJhbFwiOlwiLlwifSwgXCJpbnRcIl0sIFwicG9zdHByb2Nlc3NcIjogKGQpID0+IHBhcnNlRmxvYXQoZFswXSArIGRbMV0gKyBkWzJdKX0sXG4gICAge1wibmFtZVwiOiBcImZsb2F0XCIsIFwic3ltYm9sc1wiOiBbXCJpbnRcIl0sIFwicG9zdHByb2Nlc3NcIjogKGQpID0+IHBhcnNlSW50KGRbMF0pfSxcbiAgICB7XCJuYW1lXCI6IFwiZnVuYyRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIFwiZnVuY3Rpb25fYXJnXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiZnVuYyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImZ1bmMkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImZ1bmMkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImZ1bmNcIiwgXCJzeW1ib2xzXCI6IFtcInRlcm1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIihcIn0sIFwiZnVuYyRlYm5mJDFcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IChbZnVuYywgXzEsIF8yLCBhcmdzXSkgPT4gKHt0eXBlOiAnZnVuY3Rpb24nLCBmdW5jOiBmdW5jLCBhcmdzOiBhcmdzID8gYXJnc1sxXSA6IFtdfSl9LFxuICAgIHtcIm5hbWVcIjogXCJmdW5jdGlvbl9hcmdcIiwgXCJzeW1ib2xzXCI6IFtcIkFTXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbYXJnXSkgPT4gW2FyZ119LFxuICAgIHtcIm5hbWVcIjogXCJmdW5jdGlvbl9hcmdcIiwgXCJzeW1ib2xzXCI6IFtcImZ1bmN0aW9uX2FyZ1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiQVNcIl0sIFwicG9zdHByb2Nlc3NcIjogKFthcmdzLCBfMSwgXzIsIF8zLCBhcmddKSA9PiBhcmdzLmNvbmNhdChhcmcpfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJjc3MkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJjc3MkZWJuZiQxXCIsIFwicnVsZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIFwiY3NzJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBydWxlc10pID0+IHJ1bGVzfSxcbiAgICB7XCJuYW1lXCI6IFwicnVsZSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImFjdGlvblwiXX0sXG4gICAge1wibmFtZVwiOiBcInJ1bGUkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJydWxlJGVibmYkMVwiLCBcImFjdGlvblwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwicnVsZVwiLCBcInN5bWJvbHNcIjogW1wic2VsZWN0b3JzXCIsIFwicnVsZSRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtzLCBhXSkgPT4gKHtzZWxlY3RvcnM6IHMsIGFjdGlvbnM6IGEgPyBhLnJlZHVjZSgoeCx5KSA9PiB4LmNvbmNhdCh5KSwgW10pIDogW119KX0sXG4gICAge1wibmFtZVwiOiBcInJ1bGVcIiwgXCJzeW1ib2xzXCI6IFtcImltcG9ydFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2ltcF0pID0+ICh7J2ltcG9ydCcgOiBpbXB9KX0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yc1wiLCBcInN5bWJvbHNcIjogW1wic2VsZWN0b3JcIl19LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvcnNcIiwgXCJzeW1ib2xzXCI6IFtcInNlbGVjdG9yc1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwic2VsZWN0b3JcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtsaXN0LCBfMSwgXzIsIF8zLCBpdGVtXSkgPT4gbGlzdC5jb25jYXQoaXRlbSl9LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvcnNcIiwgXCJzeW1ib2xzXCI6IFtcIm5lc3RlZF9zZWxlY3RvclwiXX0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInNlbGVjdG9yJGVibmYkMVwiLCBcImNsYXNzXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcInpvb21cIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXCJhdHRyaWJ1dGVzXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkNFwiLCBcInN5bWJvbHNcIjogW1wicHNldWRvY2xhc3Nlc1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkNFwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDVcIiwgXCJzeW1ib2xzXCI6IFtcImxheWVyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQ1XCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yXCIsIFwic3ltYm9sc1wiOiBbXCJ0eXBlXCIsIFwic2VsZWN0b3IkZWJuZiQxXCIsIFwic2VsZWN0b3IkZWJuZiQyXCIsIFwic2VsZWN0b3IkZWJuZiQzXCIsIFwic2VsZWN0b3IkZWJuZiQ0XCIsIFwic2VsZWN0b3IkZWJuZiQ1XCIsIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgKFt0eXBlLCBjbGFzc2VzLCB6b29tLCBhdHRyaWJ1dGVzLCBwc2V1ZG9jbGFzc2VzLCBsYXllcl0pID0+ICh7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgem9vbTogem9vbSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBwc2V1ZG9jbGFzc2VzOiBwc2V1ZG9jbGFzc2VzLFxuICAgICAgICAgICAgY2xhc3NlczogY2xhc3NlcyxcbiAgICAgICAgICAgIGxheWVyOiBsYXllclxuICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJuZXN0ZWRfc2VsZWN0b3JcIiwgXCJzeW1ib2xzXCI6IFtcInNlbGVjdG9yXCIsIFwiX19cIiwgXCJzZWxlY3RvclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3BhcmVudCwgXywgY2hpbGRdKSA9PiB7Y2hpbGQucGFyZW50ID0gcGFyZW50OyByZXR1cm4gY2hpbGQ7fX0sXG4gICAge1wibmFtZVwiOiBcIm5lc3RlZF9zZWxlY3RvclwiLCBcInN5bWJvbHNcIjogW1wibmVzdGVkX3NlbGVjdG9yXCIsIFwiX19cIiwgXCJzZWxlY3RvclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3BhcmVudCwgXywgY2hpbGRdKSA9PiB7Y2hpbGQucGFyZW50ID0gcGFyZW50OyByZXR1cm4gY2hpbGQ7fX0sXG4gICAge1wibmFtZVwiOiBcInBzZXVkb2NsYXNzZXMkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJwc2V1ZG9jbGFzc1wiXX0sXG4gICAge1wibmFtZVwiOiBcInBzZXVkb2NsYXNzZXMkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJwc2V1ZG9jbGFzc2VzJGVibmYkMVwiLCBcInBzZXVkb2NsYXNzXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJwc2V1ZG9jbGFzc2VzXCIsIFwic3ltYm9sc1wiOiBbXCJwc2V1ZG9jbGFzc2VzJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInBzZXVkb2NsYXNzXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIHtcImxpdGVyYWxcIjpcIjpcIn0sIFwidGVybVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBfMiwgcHNldWRvY2xhc3NdKSA9PiBwc2V1ZG9jbGFzc30sXG4gICAge1wibmFtZVwiOiBcImxheWVyJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiOlwifSwge1wibGl0ZXJhbFwiOlwiOlwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibGF5ZXJcIiwgXCJzeW1ib2xzXCI6IFtcIl9cIiwgXCJsYXllciRzdHJpbmckMVwiLCBcInRlcm1cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgXzIsIHZhbHVlXSkgPT4gdmFsdWV9LFxuICAgIHtcIm5hbWVcIjogXCJhdHRyaWJ1dGVzJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiYXR0cmlidXRlXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiYXR0cmlidXRlcyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImF0dHJpYnV0ZXMkZWJuZiQxXCIsIFwiYXR0cmlidXRlXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJhdHRyaWJ1dGVzXCIsIFwic3ltYm9sc1wiOiBbXCJhdHRyaWJ1dGVzJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImF0dHJpYnV0ZVwiLCBcInN5bWJvbHNcIjogW1wiX1wiLCB7XCJsaXRlcmFsXCI6XCJbXCJ9LCBcInByZWRpY2F0ZVwiLCB7XCJsaXRlcmFsXCI6XCJdXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18wLCBfMSwgcHJlZGljYXRlcywgXzJdKSA9PiBwcmVkaWNhdGVzfSxcbiAgICB7XCJuYW1lXCI6IFwicHJlZGljYXRlXCIsIFwic3ltYm9sc1wiOiBbXCJ0YWdcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt0YWddKSA9PiAoe3R5cGU6IFwicHJlc2VuY2VcIiwga2V5OiB0YWd9KX0sXG4gICAge1wibmFtZVwiOiBcInByZWRpY2F0ZVwiLCBcInN5bWJvbHNcIjogW1widGFnXCIsIFwiX1wiLCBcIm9wZXJhdG9yXCIsIFwiX1wiLCBcInZhbHVlXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbdGFnLCBfMSwgb3AsIF8yLCB2YWx1ZV0pID0+ICh7dHlwZTogXCJjbXBcIiwga2V5OiB0YWcsIHZhbHVlOiB2YWx1ZSwgb3A6IG9wfSl9LFxuICAgIHtcIm5hbWVcIjogXCJwcmVkaWNhdGVcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIhXCJ9LCBcInRhZ1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18sIHRhZ10pID0+ICh7dHlwZTogXCJhYnNlbmNlXCIsIGtleTogdGFnfSl9LFxuICAgIHtcIm5hbWVcIjogXCJwcmVkaWNhdGUkc3RyaW5nJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJ+XCJ9LCB7XCJsaXRlcmFsXCI6XCI9XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJwcmVkaWNhdGVcIiwgXCJzeW1ib2xzXCI6IFtcInRhZ1wiLCBcInByZWRpY2F0ZSRzdHJpbmckMVwiLCBcInJlZ2V4cFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3RhZywgb3AsIHZhbHVlXSkgPT4gKHt0eXBlOiBcInJlZ2V4cFwiLCBrZXk6IHRhZywgdmFsdWU6IHZhbHVlLCBvcDogb3B9KX0sXG4gICAge1wibmFtZVwiOiBcInRhZ1wiLCBcInN5bWJvbHNcIjogW1wic3RyaW5nXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidmFsdWVcIiwgXCJzeW1ib2xzXCI6IFtcInN0cmluZ1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInN0cmluZ1wiLCBcInN5bWJvbHNcIjogW1wiZHFzdHJpbmdcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1thLXpBLVowLTk6X1xcLV0vXX0sXG4gICAge1wibmFtZVwiOiBcInN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInN0cmluZyRlYm5mJDFcIiwgL1thLXpBLVowLTk6X1xcLV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3RyaW5nXCIsIFwic3ltYm9sc1wiOiBbXCJzdHJpbmckZWJuZiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbY2hhcnNdKSA9PiBjaGFycy5qb2luKFwiXCIpfSxcbiAgICB7XCJuYW1lXCI6IFwidGVybSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFsvW2EtekEtWjAtOV9dL119LFxuICAgIHtcIm5hbWVcIjogXCJ0ZXJtJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1widGVybSRlYm5mJDFcIiwgL1thLXpBLVowLTlfXS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJ0ZXJtXCIsIFwic3ltYm9sc1wiOiBbXCJ0ZXJtJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2NoYXJzXSkgPT4gY2hhcnMuam9pbihcIlwiKX0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiPVwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvciRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIiFcIn0sIHtcImxpdGVyYWxcIjpcIj1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbXCJvcGVyYXRvciRzdHJpbmckMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiPFwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvciRzdHJpbmckMlwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIjxcIn0sIHtcImxpdGVyYWxcIjpcIj1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbXCJvcGVyYXRvciRzdHJpbmckMlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiPlwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvciRzdHJpbmckM1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIj5cIn0sIHtcImxpdGVyYWxcIjpcIj1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm9wZXJhdG9yXCIsIFwic3ltYm9sc1wiOiBbXCJvcGVyYXRvciRzdHJpbmckM1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInpvb21cIiwgXCJzeW1ib2xzXCI6IFtcIl9cIiwge1wibGl0ZXJhbFwiOlwifFwifSwgL1t6c10vLCBcInpvb21faW50ZXJ2YWxcIl0sIFwicG9zdHByb2Nlc3NcIjogIChbXywgcGlwZSwgdHlwZSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnR5cGUgPSB0eXBlO1xuICAgICAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcInpvb21faW50ZXJ2YWxcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2ludFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3ZhbHVlXSkgPT4gKHtiZWdpbjogdmFsdWUsIGVuZDogdmFsdWV9KX0sXG4gICAge1wibmFtZVwiOiBcInpvb21faW50ZXJ2YWwkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9pbnRcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ6b29tX2ludGVydmFsJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJ6b29tX2ludGVydmFsJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfaW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiem9vbV9pbnRlcnZhbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiem9vbV9pbnRlcnZhbFwiLCBcInN5bWJvbHNcIjogW1wiem9vbV9pbnRlcnZhbCRlYm5mJDFcIiwge1wibGl0ZXJhbFwiOlwiLVwifSwgXCJ6b29tX2ludGVydmFsJGVibmYkMlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2JlZ2luLCBpbnRlcnZhbCwgZW5kXSkgPT4gKHtiZWdpbjogYmVnaW4sIGVuZDogZW5kfSl9LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHAkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInJlZ2V4cCRlYm5mJDFcIiwgXCJyZWdleHBfY2hhclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHAkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXCJyZWdleHAkZWJuZiQyXCIsIFwicmVnZXhwX2ZsYWdcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cFwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi9cIn0sIFwicmVnZXhwJGVibmYkMVwiLCB7XCJsaXRlcmFsXCI6XCIvXCJ9LCBcInJlZ2V4cCRlYm5mJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgYXJyLCBfMiwgZmxhZ3NdKSA9PiAoe3JlZ2V4cDogYXJyLmpvaW4oXCJcIiksIGZsYWdzOiBmbGFncy5qb2luKFwiXCIpfSl9LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHBfY2hhclwiLCBcInN5bWJvbHNcIjogWy9bXlxcL10vXX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cF9jaGFyXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiL1wifV19LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHBfZmxhZ1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImlcIn1dfSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwX2ZsYWdcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJnXCJ9XX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cF9mbGFnXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwibVwifV19LFxuICAgIHtcIm5hbWVcIjogXCJhY3Rpb24kZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJzdGF0ZW1lbnRcIl19LFxuICAgIHtcIm5hbWVcIjogXCJhY3Rpb24kZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJhY3Rpb24kZWJuZiQxXCIsIFwic3RhdGVtZW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJhY3Rpb25cIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJ7XCJ9LCBcIl9cIiwgXCJhY3Rpb24kZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcIn1cIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBfMiwgc3RhdGVtZW50cywgXzMsIF80XSkgPT4gKHN0YXRlbWVudHMpfSxcbiAgICB7XCJuYW1lXCI6IFwiYWN0aW9uXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwie1wifSwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIn1cIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoKSA9PiBbXX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudFwiLCBcInN5bWJvbHNcIjogW1wic3RyaW5nXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI6XCJ9LCBcIl9cIiwgXCJzdGF0ZW1lbnRfdmFsdWVcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIjtcIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2tleSwgXzEsIF8yLCBfMywgdmFsdWUsIF80XSkgPT4gKHthY3Rpb246IFwia3ZcIiwgazoga2V5LCB2OiB2YWx1ZX0pfSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50JHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwieFwifSwge1wibGl0ZXJhbFwiOlwiaVwifSwge1wibGl0ZXJhbFwiOlwidFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50XCIsIFwic3ltYm9sc1wiOiBbXCJzdGF0ZW1lbnQkc3RyaW5nJDFcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIjtcIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoKSA9PiAoe2FjdGlvbjogXCJleGl0XCJ9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudCRzdHJpbmckMlwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInNcIn0sIHtcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcInRcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudFwiLCBcInN5bWJvbHNcIjogW1wic3RhdGVtZW50JHN0cmluZyQyXCIsIFwiY2xhc3NcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIjtcIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBjbHNdKSA9PiAoe2FjdGlvbjogJ3NldF9jbGFzcycsIHY6IGNsc30pfSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50JHN0cmluZyQzXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwic1wifSwge1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwidFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50XCIsIFwic3ltYm9sc1wiOiBbXCJzdGF0ZW1lbnQkc3RyaW5nJDNcIiwgXCJfXCIsIFwidGFnXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgXzIsIHRhZ10pID0+ICh7YWN0aW9uOiAnc2V0X3RhZycsIGs6IHRhZ30pfSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50JHN0cmluZyQ0XCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwic1wifSwge1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwidFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50XCIsIFwic3ltYm9sc1wiOiBbXCJzdGF0ZW1lbnQkc3RyaW5nJDRcIiwgXCJfXCIsIFwidGFnXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI9XCJ9LCBcIl9cIiwgXCJzdGF0ZW1lbnRfdmFsdWVcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIjtcIn0sIFwiX1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBfMiwgdGFnLCBfMywgXzQsIF81LCB2YWx1ZV0pID0+ICh7YWN0aW9uOiAnc2V0X3RhZycsIGs6IHRhZywgdjogdmFsdWV9KX0sXG4gICAge1wibmFtZVwiOiBcImNsYXNzJGVibmYkMSRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIhXCJ9LCBcIl9cIl19LFxuICAgIHtcIm5hbWVcIjogXCJjbGFzcyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImNsYXNzJGVibmYkMSRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJjbGFzcyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiY2xhc3NcIiwgXCJzeW1ib2xzXCI6IFtcIl9cIiwgXCJjbGFzcyRlYm5mJDFcIiwge1wibGl0ZXJhbFwiOlwiLlwifSwgXCJ0ZXJtXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbXzEsIG5vdCwgXzIsIGNsc10pID0+ICh7J2NsYXNzJzogY2xzLCBub3Q6IG5vdCA/ICEhbm90IDogZmFsc2V9KX0sXG4gICAge1wibmFtZVwiOiBcInR5cGUkc3RyaW5nJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJ3XCJ9LCB7XCJsaXRlcmFsXCI6XCJhXCJ9LCB7XCJsaXRlcmFsXCI6XCJ5XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlXCIsIFwic3ltYm9sc1wiOiBbXCJ0eXBlJHN0cmluZyQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZSRzdHJpbmckMlwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIm5cIn0sIHtcImxpdGVyYWxcIjpcIm9cIn0sIHtcImxpdGVyYWxcIjpcImRcIn0sIHtcImxpdGVyYWxcIjpcImVcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInR5cGVcIiwgXCJzeW1ib2xzXCI6IFtcInR5cGUkc3RyaW5nJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlJHN0cmluZyQzXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiclwifSwge1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwibFwifSwge1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwidFwifSwge1wibGl0ZXJhbFwiOlwiaVwifSwge1wibGl0ZXJhbFwiOlwib1wifSwge1wibGl0ZXJhbFwiOlwiblwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZVwiLCBcInN5bWJvbHNcIjogW1widHlwZSRzdHJpbmckM1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInR5cGUkc3RyaW5nJDRcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJhXCJ9LCB7XCJsaXRlcmFsXCI6XCJyXCJ9LCB7XCJsaXRlcmFsXCI6XCJlXCJ9LCB7XCJsaXRlcmFsXCI6XCJhXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlXCIsIFwic3ltYm9sc1wiOiBbXCJ0eXBlJHN0cmluZyQ0XCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZSRzdHJpbmckNVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImxcIn0sIHtcImxpdGVyYWxcIjpcImlcIn0sIHtcImxpdGVyYWxcIjpcIm5cIn0sIHtcImxpdGVyYWxcIjpcImVcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInR5cGVcIiwgXCJzeW1ib2xzXCI6IFtcInR5cGUkc3RyaW5nJDVcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlJHN0cmluZyQ2XCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiY1wifSwge1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwiblwifSwge1wibGl0ZXJhbFwiOlwidlwifSwge1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwic1wifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZVwiLCBcInN5bWJvbHNcIjogW1widHlwZSRzdHJpbmckNlwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInR5cGVcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIqXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudF92YWx1ZVwiLCBcInN5bWJvbHNcIjogW1wiZHFzdHJpbmdcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt4XSkgPT4gKHt0eXBlOiAnc3RyaW5nJywgdjogeH0pfSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50X3ZhbHVlXCIsIFwic3ltYm9sc1wiOiBbXCJjc3Njb2xvclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3hdKSA9PiAoe3R5cGU6ICdjc3Njb2xvcicsIHY6IHh9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudF92YWx1ZVwiLCBcInN5bWJvbHNcIjogW1wiZXZhbFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3hdKSA9PiAoe3R5cGU6ICdldmFsJywgdjogeH0pfSxcbiAgICB7XCJuYW1lXCI6IFwic3RhdGVtZW50X3ZhbHVlXCIsIFwic3ltYm9sc1wiOiBbXCJ1cXN0cmluZ1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3hdKSA9PiAoe3R5cGU6ICdzdHJpbmcnLCB2OiB4fSl9LFxuICAgIHtcIm5hbWVcIjogXCJpbXBvcnQkc3RyaW5nJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJAXCJ9LCB7XCJsaXRlcmFsXCI6XCJpXCJ9LCB7XCJsaXRlcmFsXCI6XCJtXCJ9LCB7XCJsaXRlcmFsXCI6XCJwXCJ9LCB7XCJsaXRlcmFsXCI6XCJvXCJ9LCB7XCJsaXRlcmFsXCI6XCJyXCJ9LCB7XCJsaXRlcmFsXCI6XCJ0XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJpbXBvcnQkc3RyaW5nJDJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJ1XCJ9LCB7XCJsaXRlcmFsXCI6XCJyXCJ9LCB7XCJsaXRlcmFsXCI6XCJsXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJpbXBvcnQkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogW1wiX1wiLCBcInRlcm1cIl19LFxuICAgIHtcIm5hbWVcIjogXCJpbXBvcnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJpbXBvcnQkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImltcG9ydCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiaW1wb3J0XCIsIFwic3ltYm9sc1wiOiBbXCJpbXBvcnQkc3RyaW5nJDFcIiwgXCJfXCIsIFwiaW1wb3J0JHN0cmluZyQyXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcIl9cIiwgXCJkcXN0cmluZ1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKVwifSwgXCJpbXBvcnQkZWJuZiQxXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAoZCkgPT4gKHsgdXJsOiBkWzZdLCBwc2V1ZG9jbGFzczogZFs5XSA/IGRbOV1bMV0gOiBudWxsfSl9LFxuICAgIHtcIm5hbWVcIjogXCJ1cXN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInNwY2hhclwiXX0sXG4gICAge1wibmFtZVwiOiBcInVxc3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1widXFzdHJpbmckZWJuZiQxXCIsIFwic3BjaGFyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJ1cXN0cmluZ1wiLCBcInN5bWJvbHNcIjogW1widXFzdHJpbmckZWJuZiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbY2hhcnNdKSA9PiBjaGFycy5qb2luKFwiXCIpfSxcbiAgICB7XCJuYW1lXCI6IFwic3BjaGFyXCIsIFwic3ltYm9sc1wiOiBbL1thLXpBLVowLTlcXC1fOi4sXFxcXFxcL10vXX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiL1wifSwge1wibGl0ZXJhbFwiOlwiKlwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQxXCIsIC9bXipdL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMlwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIipcIn1dfSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcIipcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIiwgL1teKl0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgL1teXFwvKl0vLCBcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQyXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudCRlYm5mJDJcIiwgXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDNcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudCRlYm5mJDNcIiwge1wibGl0ZXJhbFwiOlwiKlwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JHN0cmluZyQyXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiKlwifSwge1wibGl0ZXJhbFwiOlwiL1wifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnRcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JHN0cmluZyQxXCIsIFwibWNvbW1lbnQkZWJuZiQxXCIsIFwibWNvbW1lbnQkZWJuZiQyXCIsIFwibWNvbW1lbnQkZWJuZiQzXCIsIFwibWNvbW1lbnQkc3RyaW5nJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogKCkgPT4gbnVsbH0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JHN0cmluZyQzXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiL1wifSwge1wibGl0ZXJhbFwiOlwiL1wifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQ0XCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkNFwiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQ0XCIsIC9bXlxcbl0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnRcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JHN0cmluZyQzXCIsIFwibWNvbW1lbnQkZWJuZiQ0XCJdLCBcInBvc3Rwcm9jZXNzXCI6ICgpID0+IG51bGx9LFxuICAgIHtcIm5hbWVcIjogXCJ3c2NoYXJcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6ICgpID0+IG51bGx9XG5dXG4gICwgUGFyc2VyU3RhcnQ6IFwiY3NzXCJcbn1cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgIG1vZHVsZS5leHBvcnRzID0gZ3JhbW1hcjtcbn0gZWxzZSB7XG4gICB3aW5kb3cuZ3JhbW1hciA9IGdyYW1tYXI7XG59XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBuZWFybGV5ID0gcmVxdWlyZShcIm5lYXJsZXlcIik7XG5cbmNvbnN0IGdyYW1tYXIgPSByZXF1aXJlKFwiLi9ncmFtbWFyLmpzXCIpO1xuXG5mdW5jdGlvbiBwYXJzZSh0ZXh0KSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBuZWFybGV5LlBhcnNlcihuZWFybGV5LkdyYW1tYXIuZnJvbUNvbXBpbGVkKGdyYW1tYXIpKTtcblxuICBwYXJzZXIuZmVlZCh0ZXh0LnRyaW0oKSk7XG5cbiAgaWYgKCFwYXJzZXIucmVzdWx0cykge1xuICAgIHRocm93IFwiVW5leHBlY3RlZCBlbmQgb2YgZmlsZVwiXG4gIH1cblxuICBpZiAocGFyc2VyLnJlc3VsdHMubGVuZ3RoICE9IDEpIHtcbiAgICB0aHJvdyBcIkFtYmlndW91cyBncmFtbWFyOiBcIiArIEpTT04uc3RyaW5naWZ5KHBhcnNlci5yZXN1bHRzLCAyLCAyKVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlci5yZXN1bHRzWzBdO1xufVxuXG5jb25zdCBwYXJzZXIgPSB7XG4gIHBhcnNlOiBwYXJzZVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcGFyc2VyO1xufSBlbHNlIHtcbiAgd2luZG93Lk1hcENTU1BhcnNlciA9IHBhcnNlcjtcbn1cbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QubmVhcmxleSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gUnVsZShuYW1lLCBzeW1ib2xzLCBwb3N0cHJvY2Vzcykge1xuICAgICAgICB0aGlzLmlkID0gKytSdWxlLmhpZ2hlc3RJZDtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5zeW1ib2xzID0gc3ltYm9sczsgICAgICAgIC8vIGEgbGlzdCBvZiBsaXRlcmFsIHwgcmVnZXggY2xhc3MgfCBub250ZXJtaW5hbFxuICAgICAgICB0aGlzLnBvc3Rwcm9jZXNzID0gcG9zdHByb2Nlc3M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBSdWxlLmhpZ2hlc3RJZCA9IDA7XG5cbiAgICBSdWxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKHdpdGhDdXJzb3JBdCkge1xuICAgICAgICBmdW5jdGlvbiBzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGUubGl0ZXJhbCA/IEpTT04uc3RyaW5naWZ5KGUubGl0ZXJhbCkgOlxuICAgICAgICAgICAgICAgICAgIGUudHlwZSA/ICclJyArIGUudHlwZSA6IGUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3ltYm9sU2VxdWVuY2UgPSAodHlwZW9mIHdpdGhDdXJzb3JBdCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnN5bWJvbHMubWFwKHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlKS5qb2luKCcgJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoICAgdGhpcy5zeW1ib2xzLnNsaWNlKDAsIHdpdGhDdXJzb3JBdCkubWFwKHN0cmluZ2lmeVN5bWJvbFNlcXVlbmNlKS5qb2luKCcgJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIg4pePIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHRoaXMuc3ltYm9scy5zbGljZSh3aXRoQ3Vyc29yQXQpLm1hcChzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSkuam9pbignICcpICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgXCIg4oaSIFwiICsgc3ltYm9sU2VxdWVuY2U7XG4gICAgfVxuXG5cbiAgICAvLyBhIFN0YXRlIGlzIGEgcnVsZSBhdCBhIHBvc2l0aW9uIGZyb20gYSBnaXZlbiBzdGFydGluZyBwb2ludCBpbiB0aGUgaW5wdXQgc3RyZWFtIChyZWZlcmVuY2UpXG4gICAgZnVuY3Rpb24gU3RhdGUocnVsZSwgZG90LCByZWZlcmVuY2UsIHdhbnRlZEJ5KSB7XG4gICAgICAgIHRoaXMucnVsZSA9IHJ1bGU7XG4gICAgICAgIHRoaXMuZG90ID0gZG90O1xuICAgICAgICB0aGlzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIHRoaXMud2FudGVkQnkgPSB3YW50ZWRCeTtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlID0gdGhpcy5kb3QgPT09IHJ1bGUuc3ltYm9scy5sZW5ndGg7XG4gICAgfVxuXG4gICAgU3RhdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcIntcIiArIHRoaXMucnVsZS50b1N0cmluZyh0aGlzLmRvdCkgKyBcIn0sIGZyb206IFwiICsgKHRoaXMucmVmZXJlbmNlIHx8IDApO1xuICAgIH07XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKHRoaXMucnVsZSwgdGhpcy5kb3QgKyAxLCB0aGlzLnJlZmVyZW5jZSwgdGhpcy53YW50ZWRCeSk7XG4gICAgICAgIHN0YXRlLmxlZnQgPSB0aGlzO1xuICAgICAgICBzdGF0ZS5yaWdodCA9IGNoaWxkO1xuICAgICAgICBpZiAoc3RhdGUuaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgc3RhdGUuZGF0YSA9IHN0YXRlLmJ1aWxkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChub2RlLnJpZ2h0LmRhdGEpO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUubGVmdDtcbiAgICAgICAgfSB3aGlsZSAobm9kZS5sZWZ0KTtcbiAgICAgICAgY2hpbGRyZW4ucmV2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgfTtcblxuICAgIFN0YXRlLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucnVsZS5wb3N0cHJvY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5ydWxlLnBvc3Rwcm9jZXNzKHRoaXMuZGF0YSwgdGhpcy5yZWZlcmVuY2UsIFBhcnNlci5mYWlsKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIENvbHVtbihncmFtbWFyLCBpbmRleCkge1xuICAgICAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuc3RhdGVzID0gW107XG4gICAgICAgIHRoaXMud2FudHMgPSB7fTsgLy8gc3RhdGVzIGluZGV4ZWQgYnkgdGhlIG5vbi10ZXJtaW5hbCB0aGV5IGV4cGVjdFxuICAgICAgICB0aGlzLnNjYW5uYWJsZSA9IFtdOyAvLyBsaXN0IG9mIHN0YXRlcyB0aGF0IGV4cGVjdCBhIHRva2VuXG4gICAgICAgIHRoaXMuY29tcGxldGVkID0ge307IC8vIHN0YXRlcyB0aGF0IGFyZSBudWxsYWJsZVxuICAgIH1cblxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24obmV4dENvbHVtbikge1xuICAgICAgICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XG4gICAgICAgIHZhciB3YW50cyA9IHRoaXMud2FudHM7XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSB0aGlzLmNvbXBsZXRlZDtcblxuICAgICAgICBmb3IgKHZhciB3ID0gMDsgdyA8IHN0YXRlcy5sZW5ndGg7IHcrKykgeyAvLyBuYi4gd2UgcHVzaCgpIGR1cmluZyBpdGVyYXRpb25cbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1t3XTtcblxuICAgICAgICAgICAgaWYgKHN0YXRlLmlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5maW5pc2goKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuZGF0YSAhPT0gUGFyc2VyLmZhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdhbnRlZEJ5ID0gc3RhdGUud2FudGVkQnk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB3YW50ZWRCeS5sZW5ndGg7IGktLTsgKSB7IC8vIHRoaXMgbGluZSBpcyBob3RcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gd2FudGVkQnlbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlKGxlZnQsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwtY2FzZSBudWxsYWJsZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnJlZmVyZW5jZSA9PT0gdGhpcy5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGZ1dHVyZSBwcmVkaWN0b3JzIG9mIHRoaXMgcnVsZSBnZXQgY29tcGxldGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cCA9IHN0YXRlLnJ1bGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNvbXBsZXRlZFtleHBdID0gdGhpcy5jb21wbGV0ZWRbZXhwXSB8fCBbXSkucHVzaChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcXVldWUgc2Nhbm5hYmxlIHN0YXRlc1xuICAgICAgICAgICAgICAgIHZhciBleHAgPSBzdGF0ZS5ydWxlLnN5bWJvbHNbc3RhdGUuZG90XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV4cCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FubmFibGUucHVzaChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHByZWRpY3RcbiAgICAgICAgICAgICAgICBpZiAod2FudHNbZXhwXSkge1xuICAgICAgICAgICAgICAgICAgICB3YW50c1tleHBdLnB1c2goc3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQuaGFzT3duUHJvcGVydHkoZXhwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bGxzID0gY29tcGxldGVkW2V4cF07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJpZ2h0ID0gbnVsbHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZShzdGF0ZSwgcmlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2FudHNbZXhwXSA9IFtzdGF0ZV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZGljdChleHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvbHVtbi5wcm90b3R5cGUucHJlZGljdCA9IGZ1bmN0aW9uKGV4cCkge1xuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLmdyYW1tYXIuYnlOYW1lW2V4cF0gfHwgW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHIgPSBydWxlc1tpXTtcbiAgICAgICAgICAgIHZhciB3YW50ZWRCeSA9IHRoaXMud2FudHNbZXhwXTtcbiAgICAgICAgICAgIHZhciBzID0gbmV3IFN0YXRlKHIsIDAsIHRoaXMuaW5kZXgsIHdhbnRlZEJ5KTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzLnB1c2gocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgICAgdmFyIGNvcHkgPSBsZWZ0Lm5leHRTdGF0ZShyaWdodCk7XG4gICAgICAgIHRoaXMuc3RhdGVzLnB1c2goY29weSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBHcmFtbWFyKHJ1bGVzLCBzdGFydCkge1xuICAgICAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydCB8fCB0aGlzLnJ1bGVzWzBdLm5hbWU7XG4gICAgICAgIHZhciBieU5hbWUgPSB0aGlzLmJ5TmFtZSA9IHt9O1xuICAgICAgICB0aGlzLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24ocnVsZSkge1xuICAgICAgICAgICAgaWYgKCFieU5hbWUuaGFzT3duUHJvcGVydHkocnVsZS5uYW1lKSkge1xuICAgICAgICAgICAgICAgIGJ5TmFtZVtydWxlLm5hbWVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBieU5hbWVbcnVsZS5uYW1lXS5wdXNoKHJ1bGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTbyB3ZSBjYW4gYWxsb3cgcGFzc2luZyAocnVsZXMsIHN0YXJ0KSBkaXJlY3RseSB0byBQYXJzZXIgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgR3JhbW1hci5mcm9tQ29tcGlsZWQgPSBmdW5jdGlvbihydWxlcywgc3RhcnQpIHtcbiAgICAgICAgdmFyIGxleGVyID0gcnVsZXMuTGV4ZXI7XG4gICAgICAgIGlmIChydWxlcy5QYXJzZXJTdGFydCkge1xuICAgICAgICAgIHN0YXJ0ID0gcnVsZXMuUGFyc2VyU3RhcnQ7XG4gICAgICAgICAgcnVsZXMgPSBydWxlcy5QYXJzZXJSdWxlcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcnVsZXMgPSBydWxlcy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIChuZXcgUnVsZShyLm5hbWUsIHIuc3ltYm9scywgci5wb3N0cHJvY2VzcykpOyB9KTtcbiAgICAgICAgdmFyIGcgPSBuZXcgR3JhbW1hcihydWxlcywgc3RhcnQpO1xuICAgICAgICBnLmxleGVyID0gbGV4ZXI7IC8vIG5iLiBzdG9yaW5nIGxleGVyIG9uIEdyYW1tYXIgaXMgaWZmeSwgYnV0IHVuYXZvaWRhYmxlXG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gU3RyZWFtTGV4ZXIoKSB7XG4gICAgICB0aGlzLnJlc2V0KFwiXCIpO1xuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKGRhdGEsIHN0YXRlKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gZGF0YTtcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgIHRoaXMubGluZSA9IHN0YXRlID8gc3RhdGUubGluZSA6IDE7XG4gICAgICAgIHRoaXMubGFzdExpbmVCcmVhayA9IHN0YXRlID8gLXN0YXRlLmNvbCA6IDA7XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuYnVmZmVyW3RoaXMuaW5kZXgrK107XG4gICAgICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgIHRoaXMubGluZSArPSAxO1xuICAgICAgICAgICAgICB0aGlzLmxhc3RMaW5lQnJlYWsgPSB0aGlzLmluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTogY2h9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3RyZWFtTGV4ZXIucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpbmU6IHRoaXMubGluZSxcbiAgICAgICAgY29sOiB0aGlzLmluZGV4IC0gdGhpcy5sYXN0TGluZUJyZWFrLFxuICAgICAgfVxuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKHRva2VuLCBtZXNzYWdlKSB7XG4gICAgICAgIC8vIG5iLiB0aGlzIGdldHMgY2FsbGVkIGFmdGVyIGNvbnN1bWluZyB0aGUgb2ZmZW5kaW5nIHRva2VuLFxuICAgICAgICAvLyBzbyB0aGUgY3VscHJpdCBpcyBpbmRleC0xXG4gICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgbmV4dExpbmVCcmVhayA9IGJ1ZmZlci5pbmRleE9mKCdcXG4nLCB0aGlzLmluZGV4KTtcbiAgICAgICAgICAgIGlmIChuZXh0TGluZUJyZWFrID09PSAtMSkgbmV4dExpbmVCcmVhayA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgbGluZSA9IGJ1ZmZlci5zdWJzdHJpbmcodGhpcy5sYXN0TGluZUJyZWFrLCBuZXh0TGluZUJyZWFrKVxuICAgICAgICAgICAgdmFyIGNvbCA9IHRoaXMuaW5kZXggLSB0aGlzLmxhc3RMaW5lQnJlYWs7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiIGF0IGxpbmUgXCIgKyB0aGlzLmxpbmUgKyBcIiBjb2wgXCIgKyBjb2wgKyBcIjpcXG5cXG5cIjtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgIFwiICsgbGluZSArIFwiXFxuXCJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCIgIFwiICsgQXJyYXkoY29sKS5qb2luKFwiIFwiKSArIFwiXlwiXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlICsgXCIgYXQgaW5kZXggXCIgKyAodGhpcy5pbmRleCAtIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBQYXJzZXIocnVsZXMsIHN0YXJ0LCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChydWxlcyBpbnN0YW5jZW9mIEdyYW1tYXIpIHtcbiAgICAgICAgICAgIHZhciBncmFtbWFyID0gcnVsZXM7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHN0YXJ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGdyYW1tYXIgPSBHcmFtbWFyLmZyb21Db21waWxlZChydWxlcywgc3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG5cbiAgICAgICAgLy8gUmVhZCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGtlZXBIaXN0b3J5OiBmYWxzZSxcbiAgICAgICAgICAgIGxleGVyOiBncmFtbWFyLmxleGVyIHx8IG5ldyBTdHJlYW1MZXhlcixcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIChvcHRpb25zIHx8IHt9KSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR1cCBsZXhlclxuICAgICAgICB0aGlzLmxleGVyID0gdGhpcy5vcHRpb25zLmxleGVyO1xuICAgICAgICB0aGlzLmxleGVyU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gU2V0dXAgYSB0YWJsZVxuICAgICAgICB2YXIgY29sdW1uID0gbmV3IENvbHVtbihncmFtbWFyLCAwKTtcbiAgICAgICAgdmFyIHRhYmxlID0gdGhpcy50YWJsZSA9IFtjb2x1bW5dO1xuXG4gICAgICAgIC8vIEkgY291bGQgYmUgZXhwZWN0aW5nIGFueXRoaW5nLlxuICAgICAgICBjb2x1bW4ud2FudHNbZ3JhbW1hci5zdGFydF0gPSBbXTtcbiAgICAgICAgY29sdW1uLnByZWRpY3QoZ3JhbW1hci5zdGFydCk7XG4gICAgICAgIC8vIFRPRE8gd2hhdCBpZiBzdGFydCBydWxlIGlzIG51bGxhYmxlP1xuICAgICAgICBjb2x1bW4ucHJvY2VzcygpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwOyAvLyB0b2tlbiBpbmRleFxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIHJlc2VydmVkIHRva2VuIGZvciBpbmRpY2F0aW5nIGEgcGFyc2UgZmFpbFxuICAgIFBhcnNlci5mYWlsID0ge307XG5cbiAgICBQYXJzZXIucHJvdG90eXBlLmZlZWQgPSBmdW5jdGlvbihjaHVuaykge1xuICAgICAgICB2YXIgbGV4ZXIgPSB0aGlzLmxleGVyO1xuICAgICAgICBsZXhlci5yZXNldChjaHVuaywgdGhpcy5sZXhlclN0YXRlKTtcblxuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHdoaWxlICh0b2tlbiA9IGxleGVyLm5leHQoKSkge1xuICAgICAgICAgICAgLy8gV2UgYWRkIG5ldyBzdGF0ZXMgdG8gdGFibGVbY3VycmVudCsxXVxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMudGFibGVbdGhpcy5jdXJyZW50XTtcblxuICAgICAgICAgICAgLy8gR0MgdW51c2VkIHN0YXRlc1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMua2VlcEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy50YWJsZVt0aGlzLmN1cnJlbnQgLSAxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLmN1cnJlbnQgKyAxO1xuICAgICAgICAgICAgdmFyIG5leHRDb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMuZ3JhbW1hciwgbik7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnB1c2gobmV4dENvbHVtbik7XG5cbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYWxsIHRva2VucyB0aGF0IGV4cGVjdCB0aGUgc3ltYm9sXG4gICAgICAgICAgICB2YXIgbGl0ZXJhbCA9IHRva2VuLnRleHQgIT09IHVuZGVmaW5lZCA/IHRva2VuLnRleHQgOiB0b2tlbi52YWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGxleGVyLmNvbnN0cnVjdG9yID09PSBTdHJlYW1MZXhlciA/IHRva2VuLnZhbHVlIDogdG9rZW47XG4gICAgICAgICAgICB2YXIgc2Nhbm5hYmxlID0gY29sdW1uLnNjYW5uYWJsZTtcbiAgICAgICAgICAgIGZvciAodmFyIHcgPSBzY2FubmFibGUubGVuZ3RoOyB3LS07ICkge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHNjYW5uYWJsZVt3XTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwZWN0ID0gc3RhdGUucnVsZS5zeW1ib2xzW3N0YXRlLmRvdF07XG4gICAgICAgICAgICAgICAgLy8gVHJ5IHRvIGNvbnN1bWUgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgLy8gZWl0aGVyIHJlZ2V4IG9yIGxpdGVyYWxcbiAgICAgICAgICAgICAgICBpZiAoZXhwZWN0LnRlc3QgPyBleHBlY3QudGVzdCh2YWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICBleHBlY3QudHlwZSA/IGV4cGVjdC50eXBlID09PSB0b2tlbi50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXhwZWN0LmxpdGVyYWwgPT09IGxpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGl0XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gc3RhdGUubmV4dFN0YXRlKHtkYXRhOiB2YWx1ZSwgdG9rZW46IHRva2VuLCBpc1Rva2VuOiB0cnVlLCByZWZlcmVuY2U6IG4gLSAxfSk7XG4gICAgICAgICAgICAgICAgICAgIG5leHRDb2x1bW4uc3RhdGVzLnB1c2gobmV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOZXh0LCBmb3IgZWFjaCBvZiB0aGUgcnVsZXMsIHdlIGVpdGhlclxuICAgICAgICAgICAgLy8gKGEpIGNvbXBsZXRlIGl0LCBhbmQgdHJ5IHRvIHNlZSBpZiB0aGUgcmVmZXJlbmNlIHJvdyBleHBlY3RlZCB0aGF0XG4gICAgICAgICAgICAvLyAgICAgcnVsZVxuICAgICAgICAgICAgLy8gKGIpIHByZWRpY3QgdGhlIG5leHQgbm9udGVybWluYWwgaXQgZXhwZWN0cyBieSBhZGRpbmcgdGhhdFxuICAgICAgICAgICAgLy8gICAgIG5vbnRlcm1pbmFsJ3Mgc3RhcnQgc3RhdGVcbiAgICAgICAgICAgIC8vIFRvIHByZXZlbnQgZHVwbGljYXRpb24sIHdlIGFsc28ga2VlcCB0cmFjayBvZiBydWxlcyB3ZSBoYXZlIGFscmVhZHlcbiAgICAgICAgICAgIC8vIGFkZGVkXG5cbiAgICAgICAgICAgIG5leHRDb2x1bW4ucHJvY2VzcygpO1xuXG4gICAgICAgICAgICAvLyBJZiBuZWVkZWQsIHRocm93IGFuIGVycm9yOlxuICAgICAgICAgICAgaWYgKG5leHRDb2x1bW4uc3RhdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIHN0YXRlcyBhdCBhbGwhIFRoaXMgaXMgbm90IGdvb2QuXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLmxleGVyLmZvcm1hdEVycm9yKHRva2VuLCBcImludmFsaWQgc3ludGF4XCIpICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiVW5leHBlY3RlZCBcIiArICh0b2tlbi50eXBlID8gdG9rZW4udHlwZSArIFwiIHRva2VuOiBcIiA6IFwiXCIpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gSlNPTi5zdHJpbmdpZnkodG9rZW4udmFsdWUgIT09IHVuZGVmaW5lZCA/IHRva2VuLnZhbHVlIDogdG9rZW4pICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGVyci5vZmZzZXQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgZXJyLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtYXliZSBzYXZlIGxleGVyIHN0YXRlXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmtlZXBIaXN0b3J5KSB7XG4gICAgICAgICAgICAgIGNvbHVtbi5sZXhlclN0YXRlID0gbGV4ZXIuc2F2ZSgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICB0aGlzLmxleGVyU3RhdGUgPSBsZXhlci5zYXZlKClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluY3JlbWVudGFsbHkga2VlcCB0cmFjayBvZiByZXN1bHRzXG4gICAgICAgIHRoaXMucmVzdWx0cyA9IHRoaXMuZmluaXNoKCk7XG5cbiAgICAgICAgLy8gQWxsb3cgY2hhaW5pbmcsIGZvciB3aGF0ZXZlciBpdCdzIHdvcnRoXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBQYXJzZXIucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMudGFibGVbdGhpcy5jdXJyZW50XTtcbiAgICAgICAgY29sdW1uLmxleGVyU3RhdGUgPSB0aGlzLmxleGVyU3RhdGU7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfTtcblxuICAgIFBhcnNlci5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICB2YXIgaW5kZXggPSBjb2x1bW4uaW5kZXg7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IGluZGV4O1xuICAgICAgICB0aGlzLnRhYmxlW2luZGV4XSA9IGNvbHVtbjtcbiAgICAgICAgdGhpcy50YWJsZS5zcGxpY2UoaW5kZXggKyAxKTtcbiAgICAgICAgdGhpcy5sZXhlclN0YXRlID0gY29sdW1uLmxleGVyU3RhdGU7XG5cbiAgICAgICAgLy8gSW5jcmVtZW50YWxseSBrZWVwIHRyYWNrIG9mIHJlc3VsdHNcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5maW5pc2goKTtcbiAgICB9O1xuXG4gICAgLy8gbmIuIGRlcHJlY2F0ZWQ6IHVzZSBzYXZlL3Jlc3RvcmUgaW5zdGVhZCFcbiAgICBQYXJzZXIucHJvdG90eXBlLnJld2luZCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmtlZXBIaXN0b3J5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldCBvcHRpb24gYGtlZXBIaXN0b3J5YCB0byBlbmFibGUgcmV3aW5kaW5nJylcbiAgICAgICAgfVxuICAgICAgICAvLyBuYi4gcmVjYWxsIGNvbHVtbiAodGFibGUpIGluZGljaWVzIGZhbGwgYmV0d2VlbiB0b2tlbiBpbmRpY2llcy5cbiAgICAgICAgLy8gICAgICAgIGNvbCAwICAgLS0gICB0b2tlbiAwICAgLS0gICBjb2wgMVxuICAgICAgICB0aGlzLnJlc3RvcmUodGhpcy50YWJsZVtpbmRleF0pO1xuICAgIH07XG5cbiAgICBQYXJzZXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIHBvc3NpYmxlIHBhcnNpbmdzXG4gICAgICAgIHZhciBjb25zaWRlcmF0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLmdyYW1tYXIuc3RhcnQ7XG4gICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnRhYmxlW3RoaXMudGFibGUubGVuZ3RoIC0gMV1cbiAgICAgICAgY29sdW1uLnN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodC5ydWxlLm5hbWUgPT09IHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICYmIHQuZG90ID09PSB0LnJ1bGUuc3ltYm9scy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgJiYgdC5yZWZlcmVuY2UgPT09IDBcbiAgICAgICAgICAgICAgICAgICAgJiYgdC5kYXRhICE9PSBQYXJzZXIuZmFpbCkge1xuICAgICAgICAgICAgICAgIGNvbnNpZGVyYXRpb25zLnB1c2godCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29uc2lkZXJhdGlvbnMubWFwKGZ1bmN0aW9uKGMpIHtyZXR1cm4gYy5kYXRhOyB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgUGFyc2VyOiBQYXJzZXIsXG4gICAgICAgIEdyYW1tYXI6IEdyYW1tYXIsXG4gICAgICAgIFJ1bGU6IFJ1bGUsXG4gICAgfTtcblxufSkpO1xuIl19

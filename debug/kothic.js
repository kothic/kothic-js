(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

//TODO: split configuration and call
module.exports = function(ctx, geometry, dashes, fill, projectPointFunction, tileWidth, tileHeight) {
  var type = geometry.type,
    coords = geometry.coordinates;

  //TODO: Extract to StyleManager
  if (dashes) {
    dashes = dashes.split(",").map(parseFloat);
  }

  //Convert single feature to a mult-type to make rendering easier
  if (type === "Polygon") {
    coords = [coords];
    type = "MultiPolygon";
  } else if (type === "LineString") {
    coords = [coords];
    type = "MultiLineString";
  }

  // var points,
  //   len = coords.length,
  //   len2, pointsLen,
  //   prevPoint, point, screenPoint,
  //   dx, dy, dist;

  if (type === "MultiPolygon") {
    //Iterate by Polygons in MultiPolygon
    for (let i = 0, polygonsLength = coords.length; i < polygonsLength; i++) {
      //Iterate by Rings of the Polygon
      for (let k = 0, ringsLength = coords[i].length; k < ringsLength; k++) {
        const points = coords[i][k].map(projectPointFunction);
        //pointsLen = points.length;
        let prevPoint = points[0];

        //Iterate by points
        for (let j = 0, pointsLength = points.length; j <= pointsLength; j++) {
          //Close the ring from last to first point
          const point = points[j] || points[0];

          // const screenPoint = projectPointFunction(point);
          //Start drawing from first point
          if (j === 0) {
            ctx.moveTo(point[0], point[1]);

            if (dashes) {
              ctx.setLineDash(dashes);
            } else {
              ctx.setLineDash([]);
            }
          } else if (!fill && geom.checkSameBoundary(point, prevPoint, tileWidth, tileHeight)) {
            // Don't draw lines on tile boundaries
            ctx.moveTo(point[0], point[1]);
          } else {
            // Draw a line or filling contour
            ctx.lineTo(point[0], point[1]);
          }

          prevPoint = point;
        }
      }
    }
  } else if (type === "MultiLineString") {
    // //TODO: Those constants MUST be configured un upper design level
    var pad = 50, // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
      skip = 0;//2; // do not draw line segments shorter than this

    //Iterate by lines in MultiLineString
    for (let i = 0, linesLength = coords.length; i < linesLength; i++) {
      const points = coords[i].map(projectPointFunction);

      //Iterate by points in line
      for (let j = 0, pointsLen = points.length; j < pointsLen; j++) {
        const point = points[j];

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

          point[0] = point[0] + pad * dx / dist;
          point[1] = point[1] + pad * dy / dist;
        }

        if (j === 0) {
          ctx.moveTo(point[0], point[1]);
          if (dashes) {
            ctx.setLineDash(dashes);
          } else {
            ctx.setLineDash([]);
          }
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      }
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
      //result[layer] = properties;

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
      //TODO: set proper value type and popogate default values
      if (action.k === 'text') {
        var value;
        if (action.v.type === 'string' && action.v.v in tags) {
          value = tags[action.v.v];
        } else {
          value = unwindValue(action.v, tags, properties, locales);
        }

        if (value) {
          result[action.k] = value;
        }
      } else {
        const value = unwindValue(action.v, tags, properties, locales);
        if (typeof(value) !== 'undefined') {
          result[action.k] = value;
        }
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
        "type": "string"
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
        "type": "string"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJrb3RoaWMtYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jYW52YXMvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9jYW52YXMvbGliL3BhcnNlLWZvbnQuanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9xdWlja3NlbGVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYnVzaC9pbmRleC5qcyIsInNyYy9rb3RoaWMuanMiLCJzcmMvcmVuZGVyZXIvY3VydmVkdGV4dC5qcyIsInNyYy9yZW5kZXJlci9pY29uLmpzIiwic3JjL3JlbmRlcmVyL2xpbmUuanMiLCJzcmMvcmVuZGVyZXIvcGF0aC5qcyIsInNyYy9yZW5kZXJlci9wb2x5Z29uLmpzIiwic3JjL3JlbmRlcmVyL3JlbmRlcmVyLmpzIiwic3JjL3JlbmRlcmVyL3NoaWVsZC5qcyIsInNyYy9yZW5kZXJlci90ZXh0LmpzIiwic3JjL3N0eWxlL2V2YWwuanMiLCJzcmMvc3R5bGUvZ2FsbGVyeS5qcyIsInNyYy9zdHlsZS9tYXBjc3MuanMiLCJzcmMvc3R5bGUvbWF0Y2hlcnMuanMiLCJzcmMvc3R5bGUvcnVsZXMuanMiLCJzcmMvc3R5bGUvc3R5bGUtbWFuYWdlci5qcyIsInNyYy9zdHlsZS9zdXBwb3J0cy5qcyIsInNyYy91dGlscy9jb2xsaXNpb25zLmpzIiwic3JjL3V0aWxzL2NvbG9ycy5qcyIsInNyYy91dGlscy9mbG93LmpzIiwic3JjL3V0aWxzL2dlb20uanMiLCJzcmMvdXRpbHMvc3R5bGUuanMiLCIuLi9tYXBjc3MtanMvbGliL2dyYW1tYXIuanMiLCIuLi9tYXBjc3MtanMvbGliL21hcGNzcy1wYXJzZXIuanMiLCIuLi9tYXBjc3MtanMvbm9kZV9tb2R1bGVzL25lYXJsZXkvbGliL25lYXJsZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDampCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIndpbmRvdy5Lb3RoaWMgPSByZXF1aXJlKFwiLi9zcmMva290aGljXCIpO1xud2luZG93Lk1hcENTUyA9IHJlcXVpcmUoXCIuL3NyYy9zdHlsZS9tYXBjc3NcIik7XG5cbndpbmRvdy5Lb3RoaWMubG9hZEpTT04gPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjYWxsYmFjayhKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcih1cmwsIGVycik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJmYWlsZWQ6XCIsIHVybCwgeGhyLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gIHhoci5zZW5kKG51bGwpO1xufVxuIiwiLyogZ2xvYmFscyBkb2N1bWVudCwgSW1hZ2VEYXRhICovXG5cbmNvbnN0IHBhcnNlRm9udCA9IHJlcXVpcmUoJy4vbGliL3BhcnNlLWZvbnQnKVxuXG5leHBvcnRzLnBhcnNlRm9udCA9IHBhcnNlRm9udFxuXG5leHBvcnRzLmNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLCB7IHdpZHRoLCBoZWlnaHQgfSlcbn1cblxuZXhwb3J0cy5jcmVhdGVJbWFnZURhdGEgPSBmdW5jdGlvbiAoYXJyYXksIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gQnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBJbWFnZURhdGEgbG9va3MgYXQgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIG5ldyBJbWFnZURhdGEoKVxuICAgIGNhc2UgMTogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXkpXG4gICAgY2FzZSAyOiByZXR1cm4gbmV3IEltYWdlRGF0YShhcnJheSwgd2lkdGgpXG4gICAgZGVmYXVsdDogcmV0dXJuIG5ldyBJbWFnZURhdGEoYXJyYXksIHdpZHRoLCBoZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0cy5sb2FkSW1hZ2UgPSBmdW5jdGlvbiAoc3JjKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cCAoKSB7XG4gICAgICBpbWFnZS5vbmxvYWQgPSBudWxsXG4gICAgICBpbWFnZS5vbmVycm9yID0gbnVsbFxuICAgIH1cblxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHsgY2xlYW51cCgpOyByZXNvbHZlKGltYWdlKSB9XG4gICAgaW1hZ2Uub25lcnJvciA9ICgpID0+IHsgY2xlYW51cCgpOyByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCB0aGUgaW1hZ2UgXCIke3NyY31cImApKSB9XG5cbiAgICBpbWFnZS5zcmMgPSBzcmNcbiAgfSlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEZvbnQgUmVnRXhwIGhlbHBlcnMuXG4gKi9cblxuY29uc3Qgd2VpZ2h0cyA9ICdib2xkfGJvbGRlcnxsaWdodGVyfFsxLTldMDAnXG4gICwgc3R5bGVzID0gJ2l0YWxpY3xvYmxpcXVlJ1xuICAsIHZhcmlhbnRzID0gJ3NtYWxsLWNhcHMnXG4gICwgc3RyZXRjaGVzID0gJ3VsdHJhLWNvbmRlbnNlZHxleHRyYS1jb25kZW5zZWR8Y29uZGVuc2VkfHNlbWktY29uZGVuc2VkfHNlbWktZXhwYW5kZWR8ZXhwYW5kZWR8ZXh0cmEtZXhwYW5kZWR8dWx0cmEtZXhwYW5kZWQnXG4gICwgdW5pdHMgPSAncHh8cHR8cGN8aW58Y218bW18JXxlbXxleHxjaHxyZW18cSdcbiAgLCBzdHJpbmcgPSAnXFwnKFteXFwnXSspXFwnfFwiKFteXCJdKylcInxbXFxcXHdcXFxccy1dKydcblxuLy8gWyBbIDzigJhmb250LXN0eWxl4oCZPiB8fCA8Zm9udC12YXJpYW50LWNzczIxPiB8fCA84oCYZm9udC13ZWlnaHTigJk+IHx8IDzigJhmb250LXN0cmV0Y2jigJk+IF0/XG4vLyAgICA84oCYZm9udC1zaXpl4oCZPiBbIC8gPOKAmGxpbmUtaGVpZ2h04oCZPiBdPyA84oCYZm9udC1mYW1pbHnigJk+IF1cbi8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtZm9udHMtMy8jZm9udC1wcm9wXG5jb25zdCB3ZWlnaHRSZSA9IG5ldyBSZWdFeHAoYCgke3dlaWdodHN9KSArYCwgJ2knKVxuY29uc3Qgc3R5bGVSZSA9IG5ldyBSZWdFeHAoYCgke3N0eWxlc30pICtgLCAnaScpXG5jb25zdCB2YXJpYW50UmUgPSBuZXcgUmVnRXhwKGAoJHt2YXJpYW50c30pICtgLCAnaScpXG5jb25zdCBzdHJldGNoUmUgPSBuZXcgUmVnRXhwKGAoJHtzdHJldGNoZXN9KSArYCwgJ2knKVxuY29uc3Qgc2l6ZUZhbWlseVJlID0gbmV3IFJlZ0V4cChcbiAgJyhbXFxcXGRcXFxcLl0rKSgnICsgdW5pdHMgKyAnKSAqJ1xuICArICcoKD86JyArIHN0cmluZyArICcpKCAqLCAqKD86JyArIHN0cmluZyArICcpKSopJylcblxuLyoqXG4gKiBDYWNoZSBmb250IHBhcnNpbmcuXG4gKi9cblxuY29uc3QgY2FjaGUgPSB7fVxuXG5jb25zdCBkZWZhdWx0SGVpZ2h0ID0gMTYgLy8gcHQsIGNvbW1vbiBicm93c2VyIGRlZmF1bHRcblxuLyoqXG4gKiBQYXJzZSBmb250IGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH0gUGFyc2VkIGZvbnQuIGBzaXplYCBpcyBpbiBkZXZpY2UgdW5pdHMuIGB1bml0YCBpcyB0aGUgdW5pdFxuICogICBhcHBlYXJpbmcgaW4gdGhlIGlucHV0IHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuICAvLyBDYWNoZWRcbiAgaWYgKGNhY2hlW3N0cl0pIHJldHVybiBjYWNoZVtzdHJdXG5cbiAgLy8gVHJ5IGZvciByZXF1aXJlZCBwcm9wZXJ0aWVzIGZpcnN0LlxuICBjb25zdCBzaXplRmFtaWx5ID0gc2l6ZUZhbWlseVJlLmV4ZWMoc3RyKVxuICBpZiAoIXNpemVGYW1pbHkpIHJldHVybiAvLyBpbnZhbGlkXG5cbiAgLy8gRGVmYXVsdCB2YWx1ZXMgYW5kIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgY29uc3QgZm9udCA9IHtcbiAgICB3ZWlnaHQ6ICdub3JtYWwnLFxuICAgIHN0eWxlOiAnbm9ybWFsJyxcbiAgICBzdHJldGNoOiAnbm9ybWFsJyxcbiAgICB2YXJpYW50OiAnbm9ybWFsJyxcbiAgICBzaXplOiBwYXJzZUZsb2F0KHNpemVGYW1pbHlbMV0pLFxuICAgIHVuaXQ6IHNpemVGYW1pbHlbMl0sXG4gICAgZmFtaWx5OiBzaXplRmFtaWx5WzNdLnJlcGxhY2UoL1tcIiddL2csICcnKS5yZXBsYWNlKC8gKiwgKi9nLCAnLCcpXG4gIH1cblxuICAvLyBPcHRpb25hbCwgdW5vcmRlcmVkIHByb3BlcnRpZXMuXG4gIGxldCB3ZWlnaHQsIHN0eWxlLCB2YXJpYW50LCBzdHJldGNoXG4gIC8vIFN0b3Agc2VhcmNoIGF0IGBzaXplRmFtaWx5LmluZGV4YFxuICBsZXQgc3Vic3RyID0gc3RyLnN1YnN0cmluZygwLCBzaXplRmFtaWx5LmluZGV4KVxuICBpZiAoKHdlaWdodCA9IHdlaWdodFJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQud2VpZ2h0ID0gd2VpZ2h0WzFdXG4gIGlmICgoc3R5bGUgPSBzdHlsZVJlLmV4ZWMoc3Vic3RyKSkpIGZvbnQuc3R5bGUgPSBzdHlsZVsxXVxuICBpZiAoKHZhcmlhbnQgPSB2YXJpYW50UmUuZXhlYyhzdWJzdHIpKSkgZm9udC52YXJpYW50ID0gdmFyaWFudFsxXVxuICBpZiAoKHN0cmV0Y2ggPSBzdHJldGNoUmUuZXhlYyhzdWJzdHIpKSkgZm9udC5zdHJldGNoID0gc3RyZXRjaFsxXVxuXG4gIC8vIENvbnZlcnQgdG8gZGV2aWNlIHVuaXRzLiAoYGZvbnQudW5pdGAgaXMgdGhlIG9yaWdpbmFsIHVuaXQpXG4gIC8vIFRPRE86IGNoLCBleFxuICBzd2l0Y2ggKGZvbnQudW5pdCkge1xuICAgIGNhc2UgJ3B0JzpcbiAgICAgIGZvbnQuc2l6ZSAvPSAwLjc1XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3BjJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSAxNlxuICAgICAgYnJlYWtcbiAgICBjYXNlICdpbic6XG4gICAgICBmb250LnNpemUgKj0gOTZcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnY20nOlxuICAgICAgZm9udC5zaXplICo9IDk2LjAgLyAyLjU0XG4gICAgICBicmVha1xuICAgIGNhc2UgJ21tJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5Ni4wIC8gMjUuNFxuICAgICAgYnJlYWtcbiAgICBjYXNlICclJzpcbiAgICAgIC8vIFRPRE8gZGlzYWJsZWQgYmVjYXVzZSBleGlzdGluZyB1bml0IHRlc3RzIGFzc3VtZSAxMDBcbiAgICAgIC8vIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMTAwIC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdlbSc6XG4gICAgY2FzZSAncmVtJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSBkZWZhdWx0SGVpZ2h0IC8gMC43NVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdxJzpcbiAgICAgIGZvbnQuc2l6ZSAqPSA5NiAvIDI1LjQgLyA0XG4gICAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIChjYWNoZVtzdHJdID0gZm9udClcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJ0aWFsU29ydDtcblxuLy8gRmxveWQtUml2ZXN0IHNlbGVjdGlvbiBhbGdvcml0aG06XG4vLyBSZWFycmFuZ2UgaXRlbXMgc28gdGhhdCBhbGwgaXRlbXMgaW4gdGhlIFtsZWZ0LCBrXSByYW5nZSBhcmUgc21hbGxlciB0aGFuIGFsbCBpdGVtcyBpbiAoaywgcmlnaHRdO1xuLy8gVGhlIGstdGggZWxlbWVudCB3aWxsIGhhdmUgdGhlIChrIC0gbGVmdCArIDEpdGggc21hbGxlc3QgdmFsdWUgaW4gW2xlZnQsIHJpZ2h0XVxuXG5mdW5jdGlvbiBwYXJ0aWFsU29ydChhcnIsIGssIGxlZnQsIHJpZ2h0LCBjb21wYXJlKSB7XG4gICAgbGVmdCA9IGxlZnQgfHwgMDtcbiAgICByaWdodCA9IHJpZ2h0IHx8IChhcnIubGVuZ3RoIC0gMSk7XG4gICAgY29tcGFyZSA9IGNvbXBhcmUgfHwgZGVmYXVsdENvbXBhcmU7XG5cbiAgICB3aGlsZSAocmlnaHQgPiBsZWZ0KSB7XG4gICAgICAgIGlmIChyaWdodCAtIGxlZnQgPiA2MDApIHtcbiAgICAgICAgICAgIHZhciBuID0gcmlnaHQgLSBsZWZ0ICsgMTtcbiAgICAgICAgICAgIHZhciBtID0gayAtIGxlZnQgKyAxO1xuICAgICAgICAgICAgdmFyIHogPSBNYXRoLmxvZyhuKTtcbiAgICAgICAgICAgIHZhciBzID0gMC41ICogTWF0aC5leHAoMiAqIHogLyAzKTtcbiAgICAgICAgICAgIHZhciBzZCA9IDAuNSAqIE1hdGguc3FydCh6ICogcyAqIChuIC0gcykgLyBuKSAqIChtIC0gbiAvIDIgPCAwID8gLTEgOiAxKTtcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gTWF0aC5tYXgobGVmdCwgTWF0aC5mbG9vcihrIC0gbSAqIHMgLyBuICsgc2QpKTtcbiAgICAgICAgICAgIHZhciBuZXdSaWdodCA9IE1hdGgubWluKHJpZ2h0LCBNYXRoLmZsb29yKGsgKyAobiAtIG0pICogcyAvIG4gKyBzZCkpO1xuICAgICAgICAgICAgcGFydGlhbFNvcnQoYXJyLCBrLCBuZXdMZWZ0LCBuZXdSaWdodCwgY29tcGFyZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdCA9IGFycltrXTtcbiAgICAgICAgdmFyIGkgPSBsZWZ0O1xuICAgICAgICB2YXIgaiA9IHJpZ2h0O1xuXG4gICAgICAgIHN3YXAoYXJyLCBsZWZ0LCBrKTtcbiAgICAgICAgaWYgKGNvbXBhcmUoYXJyW3JpZ2h0XSwgdCkgPiAwKSBzd2FwKGFyciwgbGVmdCwgcmlnaHQpO1xuXG4gICAgICAgIHdoaWxlIChpIDwgaikge1xuICAgICAgICAgICAgc3dhcChhcnIsIGksIGopO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgd2hpbGUgKGNvbXBhcmUoYXJyW2ldLCB0KSA8IDApIGkrKztcbiAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKGFycltqXSwgdCkgPiAwKSBqLS07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcGFyZShhcnJbbGVmdF0sIHQpID09PSAwKSBzd2FwKGFyciwgbGVmdCwgaik7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgc3dhcChhcnIsIGosIHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChqIDw9IGspIGxlZnQgPSBqICsgMTtcbiAgICAgICAgaWYgKGsgPD0gaikgcmlnaHQgPSBqIC0gMTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN3YXAoYXJyLCBpLCBqKSB7XG4gICAgdmFyIHRtcCA9IGFycltpXTtcbiAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgYXJyW2pdID0gdG1wO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJidXNoO1xuXG52YXIgcXVpY2tzZWxlY3QgPSByZXF1aXJlKCdxdWlja3NlbGVjdCcpO1xuXG5mdW5jdGlvbiByYnVzaChtYXhFbnRyaWVzLCBmb3JtYXQpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgcmJ1c2gpKSByZXR1cm4gbmV3IHJidXNoKG1heEVudHJpZXMsIGZvcm1hdCk7XG5cbiAgICAvLyBtYXggZW50cmllcyBpbiBhIG5vZGUgaXMgOSBieSBkZWZhdWx0OyBtaW4gbm9kZSBmaWxsIGlzIDQwJSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoaXMuX21heEVudHJpZXMgPSBNYXRoLm1heCg0LCBtYXhFbnRyaWVzIHx8IDkpO1xuICAgIHRoaXMuX21pbkVudHJpZXMgPSBNYXRoLm1heCgyLCBNYXRoLmNlaWwodGhpcy5fbWF4RW50cmllcyAqIDAuNCkpO1xuXG4gICAgaWYgKGZvcm1hdCkge1xuICAgICAgICB0aGlzLl9pbml0Rm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xufVxuXG5yYnVzaC5wcm90b3R5cGUgPSB7XG5cbiAgICBhbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbCh0aGlzLmRhdGEsIFtdKTtcbiAgICB9LFxuXG4gICAgc2VhcmNoOiBmdW5jdGlvbiAoYmJveCkge1xuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICB0b0JCb3ggPSB0aGlzLnRvQkJveDtcblxuICAgICAgICBpZiAoIWludGVyc2VjdHMoYmJveCwgbm9kZSkpIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgdmFyIG5vZGVzVG9TZWFyY2ggPSBbXSxcbiAgICAgICAgICAgIGksIGxlbiwgY2hpbGQsIGNoaWxkQkJveDtcblxuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkQkJveCA9IG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZDtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKGJib3gsIGNoaWxkQkJveCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubGVhZikgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjb250YWlucyhiYm94LCBjaGlsZEJCb3gpKSB0aGlzLl9hbGwoY2hpbGQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Ugbm9kZXNUb1NlYXJjaC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZXNUb1NlYXJjaC5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGNvbGxpZGVzOiBmdW5jdGlvbiAoYmJveCkge1xuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgdG9CQm94ID0gdGhpcy50b0JCb3g7XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKGJib3gsIG5vZGUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIG5vZGVzVG9TZWFyY2ggPSBbXSxcbiAgICAgICAgICAgIGksIGxlbiwgY2hpbGQsIGNoaWxkQkJveDtcblxuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkQkJveCA9IG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZDtcblxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKGJib3gsIGNoaWxkQkJveCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubGVhZiB8fCBjb250YWlucyhiYm94LCBjaGlsZEJCb3gpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNUb1NlYXJjaC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZXNUb1NlYXJjaC5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbG9hZDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCEoZGF0YSAmJiBkYXRhLmxlbmd0aCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA8IHRoaXMuX21pbkVudHJpZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnQoZGF0YVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGJ1aWxkIHRoZSB0cmVlIHdpdGggdGhlIGdpdmVuIGRhdGEgZnJvbSBzdHJhdGNoIHVzaW5nIE9NVCBhbGdvcml0aG1cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9idWlsZChkYXRhLnNsaWNlKCksIDAsIGRhdGEubGVuZ3RoIC0gMSwgMCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGEuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzYXZlIGFzIGlzIGlmIHRyZWUgaXMgZW1wdHlcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5vZGU7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuaGVpZ2h0ID09PSBub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgLy8gc3BsaXQgcm9vdCBpZiB0cmVlcyBoYXZlIHRoZSBzYW1lIGhlaWdodFxuICAgICAgICAgICAgdGhpcy5fc3BsaXRSb290KHRoaXMuZGF0YSwgbm9kZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuaGVpZ2h0IDwgbm9kZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAvLyBzd2FwIHRyZWVzIGlmIGluc2VydGVkIG9uZSBpcyBiaWdnZXJcbiAgICAgICAgICAgICAgICB2YXIgdG1wTm9kZSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBub2RlO1xuICAgICAgICAgICAgICAgIG5vZGUgPSB0bXBOb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnNlcnQgdGhlIHNtYWxsIHRyZWUgaW50byB0aGUgbGFyZ2UgdHJlZSBhdCBhcHByb3ByaWF0ZSBsZXZlbFxuICAgICAgICAgICAgdGhpcy5faW5zZXJ0KG5vZGUsIHRoaXMuZGF0YS5oZWlnaHQgLSBub2RlLmhlaWdodCAtIDEsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGluc2VydDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0pIHRoaXMuX2luc2VydChpdGVtLCB0aGlzLmRhdGEuaGVpZ2h0IC0gMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBjcmVhdGVOb2RlKFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24gKGl0ZW0sIGVxdWFsc0ZuKSB7XG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBiYm94ID0gdGhpcy50b0JCb3goaXRlbSksXG4gICAgICAgICAgICBwYXRoID0gW10sXG4gICAgICAgICAgICBpbmRleGVzID0gW10sXG4gICAgICAgICAgICBpLCBwYXJlbnQsIGluZGV4LCBnb2luZ1VwO1xuXG4gICAgICAgIC8vIGRlcHRoLWZpcnN0IGl0ZXJhdGl2ZSB0cmVlIHRyYXZlcnNhbFxuICAgICAgICB3aGlsZSAobm9kZSB8fCBwYXRoLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHsgLy8gZ28gdXBcbiAgICAgICAgICAgICAgICBub2RlID0gcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaSA9IGluZGV4ZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgZ29pbmdVcCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlLmxlYWYpIHsgLy8gY2hlY2sgY3VycmVudCBub2RlXG4gICAgICAgICAgICAgICAgaW5kZXggPSBmaW5kSXRlbShpdGVtLCBub2RlLmNoaWxkcmVuLCBlcXVhbHNGbik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZW0gZm91bmQsIHJlbW92ZSB0aGUgaXRlbSBhbmQgY29uZGVuc2UgdHJlZSB1cHdhcmRzXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25kZW5zZShwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWdvaW5nVXAgJiYgIW5vZGUubGVhZiAmJiBjb250YWlucyhub2RlLCBiYm94KSkgeyAvLyBnbyBkb3duXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBub2RlO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudCkgeyAvLyBnbyByaWdodFxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBub2RlID0gcGFyZW50LmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGdvaW5nVXAgPSBmYWxzZTtcblxuICAgICAgICAgICAgfSBlbHNlIG5vZGUgPSBudWxsOyAvLyBub3RoaW5nIGZvdW5kXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgdG9CQm94OiBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbTsgfSxcblxuICAgIGNvbXBhcmVNaW5YOiBjb21wYXJlTm9kZU1pblgsXG4gICAgY29tcGFyZU1pblk6IGNvbXBhcmVOb2RlTWluWSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5kYXRhOyB9LFxuXG4gICAgZnJvbUpTT046IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfYWxsOiBmdW5jdGlvbiAobm9kZSwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBub2Rlc1RvU2VhcmNoID0gW107XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5sZWFmKSByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZWxzZSBub2Rlc1RvU2VhcmNoLnB1c2guYXBwbHkobm9kZXNUb1NlYXJjaCwgbm9kZS5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIG5vZGUgPSBub2Rlc1RvU2VhcmNoLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIF9idWlsZDogZnVuY3Rpb24gKGl0ZW1zLCBsZWZ0LCByaWdodCwgaGVpZ2h0KSB7XG5cbiAgICAgICAgdmFyIE4gPSByaWdodCAtIGxlZnQgKyAxLFxuICAgICAgICAgICAgTSA9IHRoaXMuX21heEVudHJpZXMsXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIGlmIChOIDw9IE0pIHtcbiAgICAgICAgICAgIC8vIHJlYWNoZWQgbGVhZiBsZXZlbDsgcmV0dXJuIGxlYWZcbiAgICAgICAgICAgIG5vZGUgPSBjcmVhdGVOb2RlKGl0ZW1zLnNsaWNlKGxlZnQsIHJpZ2h0ICsgMSkpO1xuICAgICAgICAgICAgY2FsY0JCb3gobm9kZSwgdGhpcy50b0JCb3gpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhlaWdodCkge1xuICAgICAgICAgICAgLy8gdGFyZ2V0IGhlaWdodCBvZiB0aGUgYnVsay1sb2FkZWQgdHJlZVxuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5jZWlsKE1hdGgubG9nKE4pIC8gTWF0aC5sb2coTSkpO1xuXG4gICAgICAgICAgICAvLyB0YXJnZXQgbnVtYmVyIG9mIHJvb3QgZW50cmllcyB0byBtYXhpbWl6ZSBzdG9yYWdlIHV0aWxpemF0aW9uXG4gICAgICAgICAgICBNID0gTWF0aC5jZWlsKE4gLyBNYXRoLnBvdyhNLCBoZWlnaHQgLSAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlID0gY3JlYXRlTm9kZShbXSk7XG4gICAgICAgIG5vZGUubGVhZiA9IGZhbHNlO1xuICAgICAgICBub2RlLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvLyBzcGxpdCB0aGUgaXRlbXMgaW50byBNIG1vc3RseSBzcXVhcmUgdGlsZXNcblxuICAgICAgICB2YXIgTjIgPSBNYXRoLmNlaWwoTiAvIE0pLFxuICAgICAgICAgICAgTjEgPSBOMiAqIE1hdGguY2VpbChNYXRoLnNxcnQoTSkpLFxuICAgICAgICAgICAgaSwgaiwgcmlnaHQyLCByaWdodDM7XG5cbiAgICAgICAgbXVsdGlTZWxlY3QoaXRlbXMsIGxlZnQsIHJpZ2h0LCBOMSwgdGhpcy5jb21wYXJlTWluWCk7XG5cbiAgICAgICAgZm9yIChpID0gbGVmdDsgaSA8PSByaWdodDsgaSArPSBOMSkge1xuXG4gICAgICAgICAgICByaWdodDIgPSBNYXRoLm1pbihpICsgTjEgLSAxLCByaWdodCk7XG5cbiAgICAgICAgICAgIG11bHRpU2VsZWN0KGl0ZW1zLCBpLCByaWdodDIsIE4yLCB0aGlzLmNvbXBhcmVNaW5ZKTtcblxuICAgICAgICAgICAgZm9yIChqID0gaTsgaiA8PSByaWdodDI7IGogKz0gTjIpIHtcblxuICAgICAgICAgICAgICAgIHJpZ2h0MyA9IE1hdGgubWluKGogKyBOMiAtIDEsIHJpZ2h0Mik7XG5cbiAgICAgICAgICAgICAgICAvLyBwYWNrIGVhY2ggZW50cnkgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuLnB1c2godGhpcy5fYnVpbGQoaXRlbXMsIGosIHJpZ2h0MywgaGVpZ2h0IC0gMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsY0JCb3gobm9kZSwgdGhpcy50b0JCb3gpO1xuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICBfY2hvb3NlU3VidHJlZTogZnVuY3Rpb24gKGJib3gsIG5vZGUsIGxldmVsLCBwYXRoKSB7XG5cbiAgICAgICAgdmFyIGksIGxlbiwgY2hpbGQsIHRhcmdldE5vZGUsIGFyZWEsIGVubGFyZ2VtZW50LCBtaW5BcmVhLCBtaW5FbmxhcmdlbWVudDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuXG4gICAgICAgICAgICBpZiAobm9kZS5sZWFmIHx8IHBhdGgubGVuZ3RoIC0gMSA9PT0gbGV2ZWwpIGJyZWFrO1xuXG4gICAgICAgICAgICBtaW5BcmVhID0gbWluRW5sYXJnZW1lbnQgPSBJbmZpbml0eTtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBhcmVhID0gYmJveEFyZWEoY2hpbGQpO1xuICAgICAgICAgICAgICAgIGVubGFyZ2VtZW50ID0gZW5sYXJnZWRBcmVhKGJib3gsIGNoaWxkKSAtIGFyZWE7XG5cbiAgICAgICAgICAgICAgICAvLyBjaG9vc2UgZW50cnkgd2l0aCB0aGUgbGVhc3QgYXJlYSBlbmxhcmdlbWVudFxuICAgICAgICAgICAgICAgIGlmIChlbmxhcmdlbWVudCA8IG1pbkVubGFyZ2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbkVubGFyZ2VtZW50ID0gZW5sYXJnZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIG1pbkFyZWEgPSBhcmVhIDwgbWluQXJlYSA/IGFyZWEgOiBtaW5BcmVhO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gY2hpbGQ7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVubGFyZ2VtZW50ID09PSBtaW5FbmxhcmdlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgY2hvb3NlIG9uZSB3aXRoIHRoZSBzbWFsbGVzdCBhcmVhXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmVhIDwgbWluQXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluQXJlYSA9IGFyZWE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gY2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5vZGUgPSB0YXJnZXROb2RlIHx8IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuXG4gICAgX2luc2VydDogZnVuY3Rpb24gKGl0ZW0sIGxldmVsLCBpc05vZGUpIHtcblxuICAgICAgICB2YXIgdG9CQm94ID0gdGhpcy50b0JCb3gsXG4gICAgICAgICAgICBiYm94ID0gaXNOb2RlID8gaXRlbSA6IHRvQkJveChpdGVtKSxcbiAgICAgICAgICAgIGluc2VydFBhdGggPSBbXTtcblxuICAgICAgICAvLyBmaW5kIHRoZSBiZXN0IG5vZGUgZm9yIGFjY29tbW9kYXRpbmcgdGhlIGl0ZW0sIHNhdmluZyBhbGwgbm9kZXMgYWxvbmcgdGhlIHBhdGggdG9vXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fY2hvb3NlU3VidHJlZShiYm94LCB0aGlzLmRhdGEsIGxldmVsLCBpbnNlcnRQYXRoKTtcblxuICAgICAgICAvLyBwdXQgdGhlIGl0ZW0gaW50byB0aGUgbm9kZVxuICAgICAgICBub2RlLmNoaWxkcmVuLnB1c2goaXRlbSk7XG4gICAgICAgIGV4dGVuZChub2RlLCBiYm94KTtcblxuICAgICAgICAvLyBzcGxpdCBvbiBub2RlIG92ZXJmbG93OyBwcm9wYWdhdGUgdXB3YXJkcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgd2hpbGUgKGxldmVsID49IDApIHtcbiAgICAgICAgICAgIGlmIChpbnNlcnRQYXRoW2xldmVsXS5jaGlsZHJlbi5sZW5ndGggPiB0aGlzLl9tYXhFbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXQoaW5zZXJ0UGF0aCwgbGV2ZWwpO1xuICAgICAgICAgICAgICAgIGxldmVsLS07XG4gICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGp1c3QgYmJveGVzIGFsb25nIHRoZSBpbnNlcnRpb24gcGF0aFxuICAgICAgICB0aGlzLl9hZGp1c3RQYXJlbnRCQm94ZXMoYmJveCwgaW5zZXJ0UGF0aCwgbGV2ZWwpO1xuICAgIH0sXG5cbiAgICAvLyBzcGxpdCBvdmVyZmxvd2VkIG5vZGUgaW50byB0d29cbiAgICBfc3BsaXQ6IGZ1bmN0aW9uIChpbnNlcnRQYXRoLCBsZXZlbCkge1xuXG4gICAgICAgIHZhciBub2RlID0gaW5zZXJ0UGF0aFtsZXZlbF0sXG4gICAgICAgICAgICBNID0gbm9kZS5jaGlsZHJlbi5sZW5ndGgsXG4gICAgICAgICAgICBtID0gdGhpcy5fbWluRW50cmllcztcblxuICAgICAgICB0aGlzLl9jaG9vc2VTcGxpdEF4aXMobm9kZSwgbSwgTSk7XG5cbiAgICAgICAgdmFyIHNwbGl0SW5kZXggPSB0aGlzLl9jaG9vc2VTcGxpdEluZGV4KG5vZGUsIG0sIE0pO1xuXG4gICAgICAgIHZhciBuZXdOb2RlID0gY3JlYXRlTm9kZShub2RlLmNoaWxkcmVuLnNwbGljZShzcGxpdEluZGV4LCBub2RlLmNoaWxkcmVuLmxlbmd0aCAtIHNwbGl0SW5kZXgpKTtcbiAgICAgICAgbmV3Tm9kZS5oZWlnaHQgPSBub2RlLmhlaWdodDtcbiAgICAgICAgbmV3Tm9kZS5sZWFmID0gbm9kZS5sZWFmO1xuXG4gICAgICAgIGNhbGNCQm94KG5vZGUsIHRoaXMudG9CQm94KTtcbiAgICAgICAgY2FsY0JCb3gobmV3Tm9kZSwgdGhpcy50b0JCb3gpO1xuXG4gICAgICAgIGlmIChsZXZlbCkgaW5zZXJ0UGF0aFtsZXZlbCAtIDFdLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSk7XG4gICAgICAgIGVsc2UgdGhpcy5fc3BsaXRSb290KG5vZGUsIG5ld05vZGUpO1xuICAgIH0sXG5cbiAgICBfc3BsaXRSb290OiBmdW5jdGlvbiAobm9kZSwgbmV3Tm9kZSkge1xuICAgICAgICAvLyBzcGxpdCByb290IG5vZGVcbiAgICAgICAgdGhpcy5kYXRhID0gY3JlYXRlTm9kZShbbm9kZSwgbmV3Tm9kZV0pO1xuICAgICAgICB0aGlzLmRhdGEuaGVpZ2h0ID0gbm9kZS5oZWlnaHQgKyAxO1xuICAgICAgICB0aGlzLmRhdGEubGVhZiA9IGZhbHNlO1xuICAgICAgICBjYWxjQkJveCh0aGlzLmRhdGEsIHRoaXMudG9CQm94KTtcbiAgICB9LFxuXG4gICAgX2Nob29zZVNwbGl0SW5kZXg6IGZ1bmN0aW9uIChub2RlLCBtLCBNKSB7XG5cbiAgICAgICAgdmFyIGksIGJib3gxLCBiYm94Miwgb3ZlcmxhcCwgYXJlYSwgbWluT3ZlcmxhcCwgbWluQXJlYSwgaW5kZXg7XG5cbiAgICAgICAgbWluT3ZlcmxhcCA9IG1pbkFyZWEgPSBJbmZpbml0eTtcblxuICAgICAgICBmb3IgKGkgPSBtOyBpIDw9IE0gLSBtOyBpKyspIHtcbiAgICAgICAgICAgIGJib3gxID0gZGlzdEJCb3gobm9kZSwgMCwgaSwgdGhpcy50b0JCb3gpO1xuICAgICAgICAgICAgYmJveDIgPSBkaXN0QkJveChub2RlLCBpLCBNLCB0aGlzLnRvQkJveCk7XG5cbiAgICAgICAgICAgIG92ZXJsYXAgPSBpbnRlcnNlY3Rpb25BcmVhKGJib3gxLCBiYm94Mik7XG4gICAgICAgICAgICBhcmVhID0gYmJveEFyZWEoYmJveDEpICsgYmJveEFyZWEoYmJveDIpO1xuXG4gICAgICAgICAgICAvLyBjaG9vc2UgZGlzdHJpYnV0aW9uIHdpdGggbWluaW11bSBvdmVybGFwXG4gICAgICAgICAgICBpZiAob3ZlcmxhcCA8IG1pbk92ZXJsYXApIHtcbiAgICAgICAgICAgICAgICBtaW5PdmVybGFwID0gb3ZlcmxhcDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cbiAgICAgICAgICAgICAgICBtaW5BcmVhID0gYXJlYSA8IG1pbkFyZWEgPyBhcmVhIDogbWluQXJlYTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVybGFwID09PSBtaW5PdmVybGFwKSB7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGNob29zZSBkaXN0cmlidXRpb24gd2l0aCBtaW5pbXVtIGFyZWFcbiAgICAgICAgICAgICAgICBpZiAoYXJlYSA8IG1pbkFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluQXJlYSA9IGFyZWE7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIC8vIHNvcnRzIG5vZGUgY2hpbGRyZW4gYnkgdGhlIGJlc3QgYXhpcyBmb3Igc3BsaXRcbiAgICBfY2hvb3NlU3BsaXRBeGlzOiBmdW5jdGlvbiAobm9kZSwgbSwgTSkge1xuXG4gICAgICAgIHZhciBjb21wYXJlTWluWCA9IG5vZGUubGVhZiA/IHRoaXMuY29tcGFyZU1pblggOiBjb21wYXJlTm9kZU1pblgsXG4gICAgICAgICAgICBjb21wYXJlTWluWSA9IG5vZGUubGVhZiA/IHRoaXMuY29tcGFyZU1pblkgOiBjb21wYXJlTm9kZU1pblksXG4gICAgICAgICAgICB4TWFyZ2luID0gdGhpcy5fYWxsRGlzdE1hcmdpbihub2RlLCBtLCBNLCBjb21wYXJlTWluWCksXG4gICAgICAgICAgICB5TWFyZ2luID0gdGhpcy5fYWxsRGlzdE1hcmdpbihub2RlLCBtLCBNLCBjb21wYXJlTWluWSk7XG5cbiAgICAgICAgLy8gaWYgdG90YWwgZGlzdHJpYnV0aW9ucyBtYXJnaW4gdmFsdWUgaXMgbWluaW1hbCBmb3IgeCwgc29ydCBieSBtaW5YLFxuICAgICAgICAvLyBvdGhlcndpc2UgaXQncyBhbHJlYWR5IHNvcnRlZCBieSBtaW5ZXG4gICAgICAgIGlmICh4TWFyZ2luIDwgeU1hcmdpbikgbm9kZS5jaGlsZHJlbi5zb3J0KGNvbXBhcmVNaW5YKTtcbiAgICB9LFxuXG4gICAgLy8gdG90YWwgbWFyZ2luIG9mIGFsbCBwb3NzaWJsZSBzcGxpdCBkaXN0cmlidXRpb25zIHdoZXJlIGVhY2ggbm9kZSBpcyBhdCBsZWFzdCBtIGZ1bGxcbiAgICBfYWxsRGlzdE1hcmdpbjogZnVuY3Rpb24gKG5vZGUsIG0sIE0sIGNvbXBhcmUpIHtcblxuICAgICAgICBub2RlLmNoaWxkcmVuLnNvcnQoY29tcGFyZSk7XG5cbiAgICAgICAgdmFyIHRvQkJveCA9IHRoaXMudG9CQm94LFxuICAgICAgICAgICAgbGVmdEJCb3ggPSBkaXN0QkJveChub2RlLCAwLCBtLCB0b0JCb3gpLFxuICAgICAgICAgICAgcmlnaHRCQm94ID0gZGlzdEJCb3gobm9kZSwgTSAtIG0sIE0sIHRvQkJveCksXG4gICAgICAgICAgICBtYXJnaW4gPSBiYm94TWFyZ2luKGxlZnRCQm94KSArIGJib3hNYXJnaW4ocmlnaHRCQm94KSxcbiAgICAgICAgICAgIGksIGNoaWxkO1xuXG4gICAgICAgIGZvciAoaSA9IG07IGkgPCBNIC0gbTsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBleHRlbmQobGVmdEJCb3gsIG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZCk7XG4gICAgICAgICAgICBtYXJnaW4gKz0gYmJveE1hcmdpbihsZWZ0QkJveCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSBNIC0gbSAtIDE7IGkgPj0gbTsgaS0tKSB7XG4gICAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBleHRlbmQocmlnaHRCQm94LCBub2RlLmxlYWYgPyB0b0JCb3goY2hpbGQpIDogY2hpbGQpO1xuICAgICAgICAgICAgbWFyZ2luICs9IGJib3hNYXJnaW4ocmlnaHRCQm94KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXJnaW47XG4gICAgfSxcblxuICAgIF9hZGp1c3RQYXJlbnRCQm94ZXM6IGZ1bmN0aW9uIChiYm94LCBwYXRoLCBsZXZlbCkge1xuICAgICAgICAvLyBhZGp1c3QgYmJveGVzIGFsb25nIHRoZSBnaXZlbiB0cmVlIHBhdGhcbiAgICAgICAgZm9yICh2YXIgaSA9IGxldmVsOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgZXh0ZW5kKHBhdGhbaV0sIGJib3gpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb25kZW5zZTogZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgLy8gZ28gdGhyb3VnaCB0aGUgcGF0aCwgcmVtb3ZpbmcgZW1wdHkgbm9kZXMgYW5kIHVwZGF0aW5nIGJib3hlc1xuICAgICAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxLCBzaWJsaW5nczsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoW2ldLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncyA9IHBhdGhbaSAtIDFdLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncy5zcGxpY2Uoc2libGluZ3MuaW5kZXhPZihwYXRoW2ldKSwgMSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICB9IGVsc2UgY2FsY0JCb3gocGF0aFtpXSwgdGhpcy50b0JCb3gpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbml0Rm9ybWF0OiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIC8vIGRhdGEgZm9ybWF0IChtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZIGFjY2Vzc29ycylcblxuICAgICAgICAvLyB1c2VzIGV2YWwtdHlwZSBmdW5jdGlvbiBjb21waWxhdGlvbiBpbnN0ZWFkIG9mIGp1c3QgYWNjZXB0aW5nIGEgdG9CQm94IGZ1bmN0aW9uXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIGFsZ29yaXRobXMgYXJlIHZlcnkgc2Vuc2l0aXZlIHRvIHNvcnRpbmcgZnVuY3Rpb25zIHBlcmZvcm1hbmNlLFxuICAgICAgICAvLyBzbyB0aGV5IHNob3VsZCBiZSBkZWFkIHNpbXBsZSBhbmQgd2l0aG91dCBpbm5lciBjYWxsc1xuXG4gICAgICAgIHZhciBjb21wYXJlQXJyID0gWydyZXR1cm4gYScsICcgLSBiJywgJzsnXTtcblxuICAgICAgICB0aGlzLmNvbXBhcmVNaW5YID0gbmV3IEZ1bmN0aW9uKCdhJywgJ2InLCBjb21wYXJlQXJyLmpvaW4oZm9ybWF0WzBdKSk7XG4gICAgICAgIHRoaXMuY29tcGFyZU1pblkgPSBuZXcgRnVuY3Rpb24oJ2EnLCAnYicsIGNvbXBhcmVBcnIuam9pbihmb3JtYXRbMV0pKTtcblxuICAgICAgICB0aGlzLnRvQkJveCA9IG5ldyBGdW5jdGlvbignYScsXG4gICAgICAgICAgICAncmV0dXJuIHttaW5YOiBhJyArIGZvcm1hdFswXSArXG4gICAgICAgICAgICAnLCBtaW5ZOiBhJyArIGZvcm1hdFsxXSArXG4gICAgICAgICAgICAnLCBtYXhYOiBhJyArIGZvcm1hdFsyXSArXG4gICAgICAgICAgICAnLCBtYXhZOiBhJyArIGZvcm1hdFszXSArICd9OycpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGZpbmRJdGVtKGl0ZW0sIGl0ZW1zLCBlcXVhbHNGbikge1xuICAgIGlmICghZXF1YWxzRm4pIHJldHVybiBpdGVtcy5pbmRleE9mKGl0ZW0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZXF1YWxzRm4oaXRlbSwgaXRlbXNbaV0pKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG4vLyBjYWxjdWxhdGUgbm9kZSdzIGJib3ggZnJvbSBiYm94ZXMgb2YgaXRzIGNoaWxkcmVuXG5mdW5jdGlvbiBjYWxjQkJveChub2RlLCB0b0JCb3gpIHtcbiAgICBkaXN0QkJveChub2RlLCAwLCBub2RlLmNoaWxkcmVuLmxlbmd0aCwgdG9CQm94LCBub2RlKTtcbn1cblxuLy8gbWluIGJvdW5kaW5nIHJlY3RhbmdsZSBvZiBub2RlIGNoaWxkcmVuIGZyb20gayB0byBwLTFcbmZ1bmN0aW9uIGRpc3RCQm94KG5vZGUsIGssIHAsIHRvQkJveCwgZGVzdE5vZGUpIHtcbiAgICBpZiAoIWRlc3ROb2RlKSBkZXN0Tm9kZSA9IGNyZWF0ZU5vZGUobnVsbCk7XG4gICAgZGVzdE5vZGUubWluWCA9IEluZmluaXR5O1xuICAgIGRlc3ROb2RlLm1pblkgPSBJbmZpbml0eTtcbiAgICBkZXN0Tm9kZS5tYXhYID0gLUluZmluaXR5O1xuICAgIGRlc3ROb2RlLm1heFkgPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKHZhciBpID0gaywgY2hpbGQ7IGkgPCBwOyBpKyspIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBleHRlbmQoZGVzdE5vZGUsIG5vZGUubGVhZiA/IHRvQkJveChjaGlsZCkgOiBjaGlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc3ROb2RlO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgIGEubWluWCA9IE1hdGgubWluKGEubWluWCwgYi5taW5YKTtcbiAgICBhLm1pblkgPSBNYXRoLm1pbihhLm1pblksIGIubWluWSk7XG4gICAgYS5tYXhYID0gTWF0aC5tYXgoYS5tYXhYLCBiLm1heFgpO1xuICAgIGEubWF4WSA9IE1hdGgubWF4KGEubWF4WSwgYi5tYXhZKTtcbiAgICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY29tcGFyZU5vZGVNaW5YKGEsIGIpIHsgcmV0dXJuIGEubWluWCAtIGIubWluWDsgfVxuZnVuY3Rpb24gY29tcGFyZU5vZGVNaW5ZKGEsIGIpIHsgcmV0dXJuIGEubWluWSAtIGIubWluWTsgfVxuXG5mdW5jdGlvbiBiYm94QXJlYShhKSAgIHsgcmV0dXJuIChhLm1heFggLSBhLm1pblgpICogKGEubWF4WSAtIGEubWluWSk7IH1cbmZ1bmN0aW9uIGJib3hNYXJnaW4oYSkgeyByZXR1cm4gKGEubWF4WCAtIGEubWluWCkgKyAoYS5tYXhZIC0gYS5taW5ZKTsgfVxuXG5mdW5jdGlvbiBlbmxhcmdlZEFyZWEoYSwgYikge1xuICAgIHJldHVybiAoTWF0aC5tYXgoYi5tYXhYLCBhLm1heFgpIC0gTWF0aC5taW4oYi5taW5YLCBhLm1pblgpKSAqXG4gICAgICAgICAgIChNYXRoLm1heChiLm1heFksIGEubWF4WSkgLSBNYXRoLm1pbihiLm1pblksIGEubWluWSkpO1xufVxuXG5mdW5jdGlvbiBpbnRlcnNlY3Rpb25BcmVhKGEsIGIpIHtcbiAgICB2YXIgbWluWCA9IE1hdGgubWF4KGEubWluWCwgYi5taW5YKSxcbiAgICAgICAgbWluWSA9IE1hdGgubWF4KGEubWluWSwgYi5taW5ZKSxcbiAgICAgICAgbWF4WCA9IE1hdGgubWluKGEubWF4WCwgYi5tYXhYKSxcbiAgICAgICAgbWF4WSA9IE1hdGgubWluKGEubWF4WSwgYi5tYXhZKTtcblxuICAgIHJldHVybiBNYXRoLm1heCgwLCBtYXhYIC0gbWluWCkgKlxuICAgICAgICAgICBNYXRoLm1heCgwLCBtYXhZIC0gbWluWSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGEsIGIpIHtcbiAgICByZXR1cm4gYS5taW5YIDw9IGIubWluWCAmJlxuICAgICAgICAgICBhLm1pblkgPD0gYi5taW5ZICYmXG4gICAgICAgICAgIGIubWF4WCA8PSBhLm1heFggJiZcbiAgICAgICAgICAgYi5tYXhZIDw9IGEubWF4WTtcbn1cblxuZnVuY3Rpb24gaW50ZXJzZWN0cyhhLCBiKSB7XG4gICAgcmV0dXJuIGIubWluWCA8PSBhLm1heFggJiZcbiAgICAgICAgICAgYi5taW5ZIDw9IGEubWF4WSAmJlxuICAgICAgICAgICBiLm1heFggPj0gYS5taW5YICYmXG4gICAgICAgICAgIGIubWF4WSA+PSBhLm1pblk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGUoY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgbGVhZjogdHJ1ZSxcbiAgICAgICAgbWluWDogSW5maW5pdHksXG4gICAgICAgIG1pblk6IEluZmluaXR5LFxuICAgICAgICBtYXhYOiAtSW5maW5pdHksXG4gICAgICAgIG1heFk6IC1JbmZpbml0eVxuICAgIH07XG59XG5cbi8vIHNvcnQgYW4gYXJyYXkgc28gdGhhdCBpdGVtcyBjb21lIGluIGdyb3VwcyBvZiBuIHVuc29ydGVkIGl0ZW1zLCB3aXRoIGdyb3VwcyBzb3J0ZWQgYmV0d2VlbiBlYWNoIG90aGVyO1xuLy8gY29tYmluZXMgc2VsZWN0aW9uIGFsZ29yaXRobSB3aXRoIGJpbmFyeSBkaXZpZGUgJiBjb25xdWVyIGFwcHJvYWNoXG5cbmZ1bmN0aW9uIG11bHRpU2VsZWN0KGFyciwgbGVmdCwgcmlnaHQsIG4sIGNvbXBhcmUpIHtcbiAgICB2YXIgc3RhY2sgPSBbbGVmdCwgcmlnaHRdLFxuICAgICAgICBtaWQ7XG5cbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIHJpZ2h0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgIGxlZnQgPSBzdGFjay5wb3AoKTtcblxuICAgICAgICBpZiAocmlnaHQgLSBsZWZ0IDw9IG4pIGNvbnRpbnVlO1xuXG4gICAgICAgIG1pZCA9IGxlZnQgKyBNYXRoLmNlaWwoKHJpZ2h0IC0gbGVmdCkgLyBuIC8gMikgKiBuO1xuICAgICAgICBxdWlja3NlbGVjdChhcnIsIG1pZCwgbGVmdCwgcmlnaHQsIGNvbXBhcmUpO1xuXG4gICAgICAgIHN0YWNrLnB1c2gobGVmdCwgbWlkLCBtaWQsIHJpZ2h0KTtcbiAgICB9XG59XG4iLCIvKlxuIChjKSAyMDEzLCBEYXJhZmVpIFByYWxpYXNrb3Vza2ksIFZsYWRpbWlyIEFnYWZvbmtpbiwgTWFrc2ltIEd1cnRvdmVua29cbiBLb3RoaWMgSlMgaXMgYSBmdWxsLWZlYXR1cmVkIEphdmFTY3JpcHQgbWFwIHJlbmRlcmluZyBlbmdpbmUgdXNpbmcgSFRNTDUgQ2FudmFzLlxuIGh0dHA6Ly9naXRodWIuY29tL2tvdGhpYy9rb3RoaWMtanNcbiovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgU3R5bGVNYW5hZ2VyID0gcmVxdWlyZShcIi4vc3R5bGUvc3R5bGUtbWFuYWdlclwiKTtcbmNvbnN0IEdhbGxlcnkgPSByZXF1aXJlKFwiLi9zdHlsZS9nYWxsZXJ5XCIpXG5jb25zdCBSZW5kZXJlciA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyL3JlbmRlcmVyXCIpO1xuXG4vKipcbiAqKiBBdmFpbGFibGUgb3B0aW9uczpcbiAqKiBnZXRGcmFtZTpGdW5jdGlvbiDigJQgRnVuY3Rpb24sIHdpbGwgYmUgY2FsbGVkIHByaW9yIHRoZSBoZWF2eSBvcGVyYXRpb25zXG4gKiogZGVidWcge2Jvb2xlYW59IOKAlCByZW5kZXIgZGVidWcgaW5mb3JtYXRpb25cbiAqKiBicm93c2VyT3B0aW1pemF0aW9ucyB7Ym9vbGVhbn0g4oCUIGVuYWJsZSBzZXQgb2Ygb3B0aW1pemF0aW9ucyBmb3IgSFRNTDUgQ2FudmFzIGltcGxlbWVudGF0aW9uXG4gKiovXG5mdW5jdGlvbiBLb3RoaWMobWFwY3NzLCBvcHRpb25zKSB7XG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICB0aGlzLnN0eWxlTWFuYWdlciA9IG5ldyBTdHlsZU1hbmFnZXIobWFwY3NzLCB7Z3JvdXBGZWF0dXJlc0J5QWN0aW9uczogdGhpcy5icm93c2VyT3B0aW1pemF0aW9uc30pO1xuXG4gIGNvbnN0IGltYWdlcyA9IG1hcGNzcy5saXN0SW1hZ2VSZWZlcmVuY2VzKCk7XG4gIGNvbnN0IGdhbGxlcnkgPSBuZXcgR2FsbGVyeShvcHRpb25zLmdhbGxlcnkgfHwge30pO1xuXG4gIHRoaXMucmVuZGVyZXJQcm9taXNlID0gZ2FsbGVyeS5wcmVsb2FkSW1hZ2VzKGltYWdlcykudGhlbigoKSA9PiB7XG4gICAgIHJldHVybiBuZXcgUmVuZGVyZXIoZ2FsbGVyeSwge1xuICAgICAgZ3JvdXBGZWF0dXJlc0J5QWN0aW9uczogdGhpcy5icm93c2VyT3B0aW1pemF0aW9ucyxcbiAgICAgIGRlYnVnOiB0aGlzLmRlYnVnLFxuICAgICAgZ2V0RnJhbWU6IHRoaXMuZ2V0RnJhbWVcbiAgICB9KTtcbiAgfSwgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbn1cblxuS290aGljLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAvLyBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5kZXZpY2VQaXhlbFJhdGlvICE9PSAndW5kZWZpbmVkJykge1xuICAvLyAgICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvID0gb3B0aW9ucy5kZXZpY2VQaXhlbFJhdGlvO1xuICAvLyB9IGVsc2Uge1xuICAvLyAgICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvID0gMTtcbiAgLy8gfVxuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmRlYnVnICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuZGVidWcgPSAhIW9wdGlvbnMuZGVidWc7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZ2V0RnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmdldEZyYW1lID0gb3B0aW9ucy5nZXRGcmFtZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5nZXRGcmFtZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICB2YXIgcmVxRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgICAgICAgcmVxRnJhbWUuY2FsbCh3aW5kb3csIGZuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXRGcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmJyb3dzZXJPcHRpbWl6YXRpb25zICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuYnJvd3Nlck9wdGltaXphdGlvbnMgPSAhIW9wdGlvbnMuYnJvd3Nlck9wdGltaXphdGlvbnM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5icm93c2VyT3B0aW1pemF0aW9ucyA9IGZhbHNlO1xuICB9XG59O1xuXG5Lb3RoaWMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjYW52YXMsIGdlb2pzb24sIHpvb20sIGNhbGxiYWNrKSB7XG4gIC8vIGlmICh0eXBlb2YgY2FudmFzID09PSAnc3RyaW5nJykge1xuICAvLyBUT0RPOiBBdm9pZCBkb2N1bWVudFxuICAvLyAgICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcbiAgLy8gfVxuICAvLyBUT0RPOiBDb25zaWRlciBtb3ZpbmcgdGhpcyBsb2dpYyBvdXRzaWRlXG4gIC8vIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gMTsgLy9NYXRoLm1heCh0aGlzLmRldmljZVBpeGVsUmF0aW8gfHwgMSwgMik7XG5cbiAgY29uc3Qgd2lkdGggPSBjYW52YXMud2lkdGg7XG4gIGNvbnN0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgLy8gaWYgKGRldmljZVBpeGVsUmF0aW8gIT09IDEpIHtcbiAgLy8gICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgLy8gICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAvLyAgICAgY2FudmFzLndpZHRoID0gY2FudmFzLndpZHRoICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgLy8gICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgLy8gfVxuXG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAvL1RPRE86IG1vdmUgdG8gb3B0aW9ucyBub2RlLWNhbnZhcyBzcGVjaWZpYyBzZXR0aW5nXG4gIC8vY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdjb3B5J1xuXG4gIC8vIGN0eC5zY2FsZShkZXZpY2VQaXhlbFJhdGlvLCBkZXZpY2VQaXhlbFJhdGlvKTtcblxuICAvLyB2YXIgZ3JhbnVsYXJpdHkgPSBkYXRhLmdyYW51bGFyaXR5LFxuICAvLyAgICAgd3MgPSB3aWR0aCAvIGdyYW51bGFyaXR5LCBocyA9IGhlaWdodCAvIGdyYW51bGFyaXR5O1xuXG4gIGNvbnN0IGJib3ggPSBnZW9qc29uLmJib3g7XG4gIGNvbnN0IGhzY2FsZSA9IHdpZHRoIC8gKGJib3hbMl0gLSBiYm94WzBdKTtcbiAgY29uc3QgdnNjYWxlID0gaGVpZ2h0IC8gKGJib3hbM10gLSBiYm94WzFdKTtcbiAgZnVuY3Rpb24gcHJvamVjdChwb2ludCkge1xuICAgIHJldHVybiBbXG4gICAgICAocG9pbnRbMF0gLSBiYm94WzBdKSAqIGhzY2FsZSxcbiAgICAgIGhlaWdodCAtICgocG9pbnRbMV0gLSBiYm94WzFdKSAqIHZzY2FsZSlcbiAgICBdO1xuICB9XG5cbiAgY29uc29sZS50aW1lKCdzdHlsZXMnKTtcblxuICAvLyBzZXR1cCBsYXllciBzdHlsZXNcbiAgLy8gTGF5ZXIgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgYWxyZWFkeSBzb3J0ZWRcbiAgY29uc3QgbGF5ZXJzID0gdGhpcy5zdHlsZU1hbmFnZXIuY3JlYXRlTGF5ZXJzKGdlb2pzb24uZmVhdHVyZXMsIHpvb20pO1xuXG4gIGNvbnNvbGUudGltZUVuZCgnc3R5bGVzJyk7XG5cbiAgdGhpcy5yZW5kZXJlclByb21pc2UudGhlbigocmVuZGVyZXIpID0+IHtcbiAgICByZW5kZXJlci5yZW5kZXIobGF5ZXJzLCBjdHgsIHdpZHRoLCBoZWlnaHQsIHByb2plY3QsIGNhbGxiYWNrKTtcbiAgfSkuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLb3RoaWM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbG9ycyA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbG9ycy5qcycpO1xuXG5mdW5jdGlvbiBkZWcocmFkKSB7XG5cdHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG5mdW5jdGlvbiByYWQoZGVnKSB7XG5cdHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5mdW5jdGlvbiBxdWFkcmFudChhbmdsZSkge1xuICBpZiAoYW5nbGUgPCBNYXRoLlBJIC8gMiAmJiBhbmdsZSA+IC1NYXRoLlBJIC8gMikgIHtcbiAgICByZXR1cm4gJzEsMyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcyLDQnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlZ21lbnRzKHBvaW50cykge1xuICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAvL1RPRE86IE1ha2UgdGhpcyBhbmdsZSBjb25maWd1cmFibGVcbiAgY29uc3QgbWF4U2VnbWVudEFuZ2xlID0gcmFkKDQ1KTtcblxuICAvLyBPZmZzZXQgb2YgZWFjaCBzZWdtZW50IGZyb20gdGhlIGJlZ2lubmluZyBvZyB0aGUgbGluZVxuICB2YXIgb2Zmc2V0ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBwb2ludHNbaV07XG4gICAgY29uc3QgZW5kID0gcG9pbnRzW2kgKyAxXTtcblxuICAgIGNvbnN0IGR4ID0gZW5kWzBdIC0gc3RhcnRbMF07XG4gICAgY29uc3QgZHkgPSBlbmRbMV0gLSBzdGFydFsxXTtcblxuICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkeCAqKiAyICsgZHkgKiogMik7XG5cbiAgICAvLyBUcnkgdG8gYXR0YWNoIGN1cnJlbnQgcG9pbnQgdG8gYSBwcmV2aW91cyBzZWdtZW50XG4gICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHByZXZTZWdtZW50ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICBjb25zdCBwcmV2QW5nbGUgPSBwcmV2U2VnbWVudC5hbmdsZXNbcHJldlNlZ21lbnQuYW5nbGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAvLyBBbmdsZXMgbW9yZSB0aGFuIDE4MCBkZWdyZWVzIGFyZSByZXZlcnNlZCB0byBkaWZmZXJlbnQgZGlyZWN0aW9uXG4gICAgICB2YXIgYW5nbGVEaWZmID0gTWF0aC5hYnMocHJldkFuZ2xlIC0gYW5nbGUpO1xuICAgICAgaWYgKGFuZ2xlRGlmZiA+IE1hdGguUEkpIHtcbiAgICAgICAgYW5nbGVEaWZmID0gKDIgKiBNYXRoLlBJKSAtIGFuZ2xlRGlmZjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHNlZ21lbnQgY2FuIGJlIGNvbnRpbnVlZCwgaWZcbiAgICAgIC8vIDEuIEFuZ2xlIGJldHdlZW4gdHdvIHBhcnRzIGlzIGxlc3NlciB0aGVuIG1heFNlZ21lbnRBbmdsZSB0byBhdm9pZCBzaGFycCBjb3JuZXJzXG4gICAgICAvLyAyLiBQYXJ0IGlzIGRpcmVjcmVkIHRvIHRoZSBzYW1lIGhlbWljaXJjbGUgYXMgdGhlIHByZXZpb3VzIHNlZ21lbnRcbiAgICAgIC8vXG4gICAgICAvLyBPdGhlcndpc2UsIHRoZSBuZXcgc2VnbWVudCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgIGlmIChhbmdsZURpZmYgPCBtYXhTZWdtZW50QW5nbGUgJiYgcXVhZHJhbnQoYW5nbGUpID09IHByZXZTZWdtZW50LnF1YWRyYW50KSB7XG4gICAgICAgIHByZXZTZWdtZW50LnBvaW50cy5wdXNoKGVuZCk7XG4gICAgICAgIHByZXZTZWdtZW50LmFuZ2xlcy5wdXNoKGFuZ2xlKTtcbiAgICAgICAgcHJldlNlZ21lbnQucGFydHNMZW5ndGgucHVzaChsZW5ndGgpO1xuICAgICAgICBwcmV2U2VnbWVudC5sZW5ndGggKz0gbGVuZ3RoO1xuICAgICAgICBvZmZzZXQgKz0gbGVuZ3RoO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWdtZW50cy5wdXNoKHtcbiAgICAgIGFuZ2xlczogW2FuZ2xlXSxcbiAgICAgIHBhcnRzTGVuZ3RoOiBbbGVuZ3RoXSxcbiAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICBwb2ludHM6IFtzdGFydCwgZW5kXSxcbiAgICAgIHF1YWRyYW50OiBxdWFkcmFudChhbmdsZSlcbiAgICB9KTtcblxuICAgIG9mZnNldCArPSBsZW5ndGg7XG4gIH1cblxuICByZXR1cm4gc2VnbWVudHM7XG59XG5cbi8qKiBGaW5kIGluZGV4IG9mIHNlZ2VtbnQgcGFydCBhbmQgb2Zmc2V0IGZyb20gYmVnaW5uaW5nIG9mIHRoZSBwYXJ0IGJ5IG9mZnNldC5cbiAqKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHB1dCBsYWJlbCB0byB0aGUgY2VudGVyIG9mIGEgc2VnbWVudFxuICoqIEBwYXJhbSBwYXJ0cyB7YXJyYXl9IGFycmF5IG9mIHNlZ21lbnQgcGFydHMgbGVuZ3RoXG4gKiogQHBhcmFtIG9mZnNldCB7ZmxvYXR9IGV4cGVjdGVkIG9mZnNldFxuICoqL1xuZnVuY3Rpb24gY2FsY3VsYXRlT2Zmc2V0KHBhcnRzLCBvZmZzZXQpIHtcbiAgdmFyIHRvdGFsT2Zmc2V0ID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGFydCA9IHBhcnRzW2ldO1xuXG4gICAgaWYgKHRvdGFsT2Zmc2V0ICsgcGFydCA+IG9mZnNldCkge1xuICAgICAgcmV0dXJuIFtpLCBvZmZzZXQgLSB0b3RhbE9mZnNldF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvdGFsT2Zmc2V0ICs9IHBhcnQ7XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwiU2FuaXR5IGNoZWNrOiBwYXRoIGlzIHNob3J0ZXIgdGhhbiBhbiBvZmZzZXRcIik7XG59XG5cbmZ1bmN0aW9uIGRyYXdHbHlwaChjdHgsIGdseXBoLCBoYXNIYWxvPWZhbHNlKSB7XG4gIGN0eC50cmFuc2xhdGUoZ2x5cGgucG9zaXRpb25bMF0sIGdseXBoLnBvc2l0aW9uWzFdKTtcbiAgY3R4LnJvdGF0ZShnbHlwaC5hbmdsZSk7XG5cdGlmIChoYXNIYWxvKSB7XG4gIFx0Y3R4LnN0cm9rZVRleHQoZ2x5cGguZ2x5cGgsIGdseXBoLm9mZnNldFswXSwgZ2x5cGgub2Zmc2V0WzFdKTtcblx0fSBlbHNlIHtcblx0XHRjdHguZmlsbFRleHQoZ2x5cGguZ2x5cGgsIGdseXBoLm9mZnNldFswXSwgZ2x5cGgub2Zmc2V0WzFdKTtcblx0fVxuXG4gIGN0eC5yb3RhdGUoLWdseXBoLmFuZ2xlKTtcbiAgY3R4LnRyYW5zbGF0ZSgtZ2x5cGgucG9zaXRpb25bMF0sIC1nbHlwaC5wb3NpdGlvblsxXSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNlZ21lbnRzKGN0eCwgc2VnbWVudHMpIHtcbiAgY3R4LnNhdmUoKTtcbiAgc2VnbWVudHMuZm9yRWFjaCgoc2VnKSA9PiB7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzLm5leHRDb2xvcigpO1xuICAgIGN0eC5saW5lV2lkdGggPSAzO1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5tb3ZlVG8oc2VnLnBvaW50c1swXVswXSwgc2VnLnBvaW50c1swXVsxXSk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzZWcucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdHgubGluZVRvKHNlZy5wb2ludHNbaV1bMF0sIHNlZy5wb2ludHNbaV1bMV0pO1xuICAgIH1cbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0pO1xuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVHbHlwaHNQb3NpdGlvbnMoc2VnbWVudCwgZ2x5cGhzKSB7XG4gIGNvbnN0IHRleHRXaWR0aCA9IGdseXBocy5yZWR1Y2UoKGFjYywgZ2x5cGgpID0+IGFjYyArIGdseXBoLndpZHRoLCAwKTtcblxuICAvL1JldmVyc2Ugc2VnbWVudCB0byBhdm9pZCB0ZXh0LCBmbGlwcGVkIHVwc2lkZSBkb3duXG4gIGlmIChzZWdtZW50LnF1YWRyYW50ID09ICcyLDQnKSB7XG4gICAgc2VnbWVudC5hbmdsZXMgPSBzZWdtZW50LmFuZ2xlcy5tYXAoKGFuZ2xlKSA9PiBhbmdsZSAtIE1hdGguUEkpO1xuICAgIHNlZ21lbnQucGFydHNMZW5ndGgucmV2ZXJzZSgpO1xuICAgIHNlZ21lbnQucG9pbnRzLnJldmVyc2UoKTtcblx0XHRzZWdtZW50LnF1YWRyYW50ID0gJzEsMydcbiAgfVxuXG5cdC8vQWxpZ24gdGV4dCB0byB0aGUgbWlkZGxlIG9mIGN1cnJlbnQgc2VnbWVudFxuICBjb25zdCBzdGFydE9mZnNldCA9IChzZWdtZW50Lmxlbmd0aCAtIHRleHRXaWR0aCkgLyAyO1xuXG5cdC8vIEdldCBwb2ludCBpbmRleCBhbmQgb2Zmc2V0IGZyb20gdGhhdCBwb2ludCBvZiB0aGUgc3RhcnRpbmcgcG9zaXRpb25cblx0Ly8gJ2luZGV4JyBpcyBhbiBpbmRleCBvZiBjdXJyZW50IHNlZ21lbnQgcGFydHNMZW5ndGhcblx0Ly8gJ29mZnNldCcgaXMgYW4gb2Zmc2V0IGZyb20gdGhlIGJlZ2dpbmluZyBvZiB0aGUgcGFydFxuICB2YXIgW2luZGV4LCBvZmZzZXRdID0gY2FsY3VsYXRlT2Zmc2V0KHNlZ21lbnQucGFydHNMZW5ndGgsIHN0YXJ0T2Zmc2V0KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbHlwaHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBnbHlwaCA9IGdseXBoc1tpXTtcblxuXHRcdGNvbnN0IHN0YXJ0UG9pbnRJbmRleCA9IGluZGV4O1xuICAgIGNvbnN0IG9mZnNldFggPSBvZmZzZXQ7XG5cblx0XHQvL0l0ZXJhdGUgYnkgcG9pbnRzIHVudGlsIHNwYWNlIGZvciBjdXJyZW50IGdseXBoIHdhcyByZXNlcnZlZFxuXHRcdHZhciByZXNlcnZlZCA9IDA7XG4gICAgd2hpbGUgKHJlc2VydmVkIDwgZ2x5cGgud2lkdGgpIHtcbiAgICAgIGNvbnN0IHJlcXVpcmVkU3BhY2UgPSBnbHlwaC53aWR0aCAtIHJlc2VydmVkO1xuXHRcdFx0Ly9DdXJyZW50IHBhcnQgaXMgbG9uZ2VyIHRoYW4gcmVxdWlyZWQgc3BhY2VcbiAgICAgIGlmIChzZWdtZW50LnBhcnRzTGVuZ3RoW2luZGV4XSA+IG9mZnNldCArIHJlcXVpcmVkU3BhY2UpIHtcbiAgICAgICAgb2Zmc2V0ICs9IHJlcXVpcmVkU3BhY2U7XG4gICAgICAgIHJlc2VydmVkICs9IHJlcXVpcmVkU3BhY2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG5cdFx0XHQvL0N1cnJlbnQgcGFydCBpcyBzaG9ydGVyIHRoYW4gcmVxdWlyZWQgc3BhY2UuIFJlc2VydmUgdGhlIHdob2xlIHBhcnRcblx0XHRcdC8vYW5kIGluY3JlbWVudCBpbmRleFxuICAgICAgcmVzZXJ2ZWQgKz0gc2VnbWVudC5wYXJ0c0xlbmd0aFtpbmRleF0gLSBvZmZzZXQ7XG4gICAgICBpbmRleCArPSAxO1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9XG5cblx0XHQvLyBUZXh0IGdseXBoIG1heSBjb3ZlciBtdWx0aXBsZSBzZWdtZW50IHBhcnRzLCBzbyBhIGdseXBoIGFuZ2xlIHNob3VsZFxuXHRcdC8vIGJlIGF2ZXJhZ2VkIGJldHdlZW4gc3RhcnQgYW5zIGVuZCBwb3NpdGlvblxuXHRcdGNvbnN0IGFuZ2xlID0gYWRqdXN0QW5nbGUoc2VnbWVudC5wb2ludHNbc3RhcnRQb2ludEluZGV4XSwgc2VnbWVudC5hbmdsZXNbc3RhcnRQb2ludEluZGV4XSwgc2VnbWVudC5wb2ludHNbaW5kZXhdLCBzZWdtZW50LmFuZ2xlc1tpbmRleF0sIG9mZnNldCwgMCk7XG5cblx0XHRnbHlwaC5wb3NpdGlvbiA9IHNlZ21lbnQucG9pbnRzW3N0YXJ0UG9pbnRJbmRleF07XG5cdFx0Z2x5cGguYW5nbGUgPSBhbmdsZTtcblx0XHRnbHlwaC5vZmZzZXQgPSBbb2Zmc2V0WCwgMF07XG4gIH1cblxuXHRyZXR1cm4gZ2x5cGhzO1xufVxuXG5mdW5jdGlvbiBhZGp1c3RBbmdsZShwb2ludFN0YXJ0LCBhbmdsZVN0YXJ0LCBwb2ludE5leHQsIGFuZ2xlTmV4dCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xuXHQvL0lmIGdseXBoIGNhbiBiZSBmaXR0ZWQgdG8gYSBzaW5nbGUgc2VnbWVudCBwYXJ0LCBubyBhZGp1c3RtZW50IGlzIG5lZWRlZFxuXHRpZiAocG9pbnRTdGFydCA9PT0gcG9pbnROZXh0KSB7XG5cdFx0cmV0dXJuIGFuZ2xlU3RhcnQ7XG5cdH1cblxuXHQvL0RyYXcgYSBsaW5lIGZyb20gc3RhcnQgcG9pbnQgdG8gZW5kIHBvaW50IG9mIGEgZ2x5cGhcblx0Y29uc3QgeCA9IHBvaW50TmV4dFswXSArIG9mZnNldFggKiBNYXRoLnNpbihhbmdsZU5leHQpICsgb2Zmc2V0WSAqIE1hdGguc2luKGFuZ2xlTmV4dCk7XG5cdGNvbnN0IHkgPSBwb2ludE5leHRbMV0gKyBvZmZzZXRYICogTWF0aC5jb3MoYW5nbGVOZXh0KSArIG9mZnNldFkgKiBNYXRoLmNvcyhhbmdsZU5leHQpO1xuXG5cdC8vcmV0dXJuIGFuZ2xlIG9mIHRoaXMgbGluZVxuXHRyZXR1cm4gTWF0aC5hdGFuMih5IC0gcG9pbnRTdGFydFsxXSwgeCAtIHBvaW50U3RhcnRbMF0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0NvbGxpc2lvbnMoc2VnbWVudCwgY29sbGlzaW9ucykge1xuXHRjb25zdCBib3ggPSBzZWdtZW50LnBvaW50cy5yZWR1Y2UoKGFjYywgcG9pbnQpID0+ICh7XG5cdFx0XHRtaW5YOiBNYXRoLm1pbihhY2MubWluWCwgcG9pbnRbMF0pLFxuXHRcdFx0bWluWTogTWF0aC5taW4oYWNjLm1pblksIHBvaW50WzFdKSxcblx0XHRcdG1heFg6IE1hdGgubWF4KGFjYy5tYXhYLCBwb2ludFswXSksXG5cdFx0XHRtYXhZOiBNYXRoLm1heChhY2MubWF4WCwgcG9pbnRbMV0pXG5cdFx0fSksIHttaW5YOiBJbmZpbml0eSwgbWluWTogSW5maW5pdHksIG1heFg6IC1JbmZpbml0eSwgbWF4WTogLUluZmluaXR5fSk7XG5cblx0XHRyZXR1cm4gY29sbGlzaW9ucy5jaGVjayhib3gpO1xufVxuXG5mdW5jdGlvbiByZW5kZXIoY3R4LCBwb2ludHMsIHRleHQsIGhhc0hhbG8sIGNvbGxpc2lvbnMsIGRlYnVnPWZhbHNlKSB7XG4gIGNvbnN0IGdseXBocyA9IHRleHQuc3BsaXQoXCJcIilcbiAgICAgIC5tYXAoKGwpID0+IHtcbiAgICAgICAgY29uc3QgbWV0cmljcyA9IGN0eC5tZWFzdXJlVGV4dChsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBnbHlwaDogbCxcbiAgICAgICAgICB3aWR0aDogbWV0cmljcy53aWR0aCxcbiAgICAgICAgICBhc2NlbnQ6IG1ldHJpY3MuZW1IZWlnaHRBc2NlbnQsXG4gICAgICAgICAgZGVzY2VudDogbWV0cmljcy5lbUhlaWdodERlc2NlbnQsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGdseXBocy5yZWR1Y2UoKGFjYywgZ2x5cGgpID0+IGFjYyArIGdseXBoLndpZHRoLCAwKTtcblxuICB2YXIgc2VnbWVudHMgPSBjcmVhdGVTZWdtZW50cyhwb2ludHMpO1xuXG4gIGlmIChkZWJ1Zykge1xuICAgIHJlbmRlclNlZ21lbnRzKGN0eCwgc2VnbWVudHMpO1xuICB9XG5cbiAgLy9UT0RPOiBNZXJnZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBpZiBwb3NzaWJsZVxuXG4gIHNlZ21lbnRzID0gc2VnbWVudHMuZmlsdGVyKChzZWcpID0+IHNlZy5sZW5ndGggPiB0ZXh0V2lkdGgpO1xuXG5cdHNlZ21lbnRzID0gc2VnbWVudHMuZmlsdGVyKChzZWcpID0+IGNoZWNrQ29sbGlzaW9ucyhzZWcsIGNvbGxpc2lvbnMpKVxuXG5cbiAgLy9UT0RPIENob29zZSBiZXN0IHNlZ21lbnRzXG5cbiAgLy9SZW5kZXIgdGV4dFxuICBzZWdtZW50cy5mb3JFYWNoKChzZWcpID0+IHtcblx0XHRjb25zdCBwb3NpdGlvbnMgPSBjYWxjdWxhdGVHbHlwaHNQb3NpdGlvbnMoc2VnLCBnbHlwaHMpO1xuXG5cdFx0aWYgKGhhc0hhbG8pIHtcblx0XHRcdHBvc2l0aW9ucy5mb3JFYWNoKChnbHlwaCkgPT4ge1xuXHRcdFx0XHRkcmF3R2x5cGgoY3R4LCBnbHlwaCwgdHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cG9zaXRpb25zLmZvckVhY2goKGdseXBoKSA9PiB7XG5cdFx0XHRkcmF3R2x5cGgoY3R4LCBnbHlwaCwgZmFsc2UpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZ2VvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL2dlb20nKTtcblxuZnVuY3Rpb24gcmVuZGVySWNvbihjdHgsIGZlYXR1cmUsIG5leHRGZWF0dXJlLCB7cHJvamVjdFBvaW50RnVuY3Rpb24sIGNvbGxpc2lvbkJ1ZmZlciwgZ2FsbGVyeX0pIHtcbiAgLy9UT0RPOiBSZWZhY3RvciwgY2FsY3VsYXRlIHJlcHJlc2VudGF0aXZlIHBvaW50IG9ubHkgb25jZVxuICBjb25zdCBwb2ludCA9IGdlb20uZ2V0UmVwclBvaW50KGZlYXR1cmUuZ2VvbWV0cnksIHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgaWYgKCFwb2ludCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG5cbiAgY29uc3QgaW1hZ2UgPSBnYWxsZXJ5LmdldEltYWdlKGFjdGlvbnNbJ2ljb24taW1hZ2UnXSk7XG4gIGlmICghaW1hZ2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdyA9IGltYWdlLndpZHRoLCBoID0gaW1hZ2UuaGVpZ2h0O1xuXG4gIC8vWm9vbSBpbWFnZSBhY2NvcmRpbmcgdG8gdmFsdWVzLCBzcGVjaWZpZWQgaW4gTWFwQ1NTXG4gIGlmIChhY3Rpb25zWydpY29uLXdpZHRoJ10gfHwgYWN0aW9uc1snaWNvbi1oZWlnaHQnXSkge1xuICAgIGlmIChhY3Rpb25zWydpY29uLXdpZHRoJ10pIHtcbiAgICAgIHcgPSBhY3Rpb25zWydpY29uLXdpZHRoJ107XG4gICAgICBoID0gaW1hZ2UuaGVpZ2h0ICogdyAvIGltYWdlLndpZHRoO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uc1snaWNvbi1oZWlnaHQnXSkge1xuICAgICAgaCA9IGFjdGlvbnNbJ2ljb24taGVpZ2h0J107XG4gICAgICBpZiAoIWFjdGlvbnNbJ2ljb24td2lkdGgnXSkge1xuICAgICAgICB3ID0gaW1hZ2Uud2lkdGggKiBoIC8gaW1hZ2UuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghYWN0aW9uc1snYWxsb3ctb3ZlcmxhcCddKSB7XG4gICAgaWYgKGNvbGxpc2lvbkJ1ZmZlci5jaGVja1BvaW50V0gocG9pbnQsIHcsIGgsIGZlYXR1cmUua290aGljSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cblxuICBjb25zdCB4ID0gTWF0aC5mbG9vcihwb2ludFswXSAtIHcgLyAyKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IocG9pbnRbMV0gLSBoIC8gMik7XG5cbiAgY3R4LnNhdmUoKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICAvL2N0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcbiAgLy9jdHgubGluZVdpZHRoID0gMVxuICBjdHguZWxsaXBzZShwb2ludFswXSwgcG9pbnRbMV0sIHcgLyAyLCBoIC8gMiwgMCwgMCwgMipNYXRoLlBJKTtcbiAgLy9jdHgucmVjdCh4LCB5LCB3LCBoKTtcbiAgY3R4LmNsaXAoXCJldmVub2RkXCIpO1xuICAvL2N0eC5zdHJva2UoKVxuICBjdHguZHJhd0ltYWdlKGltYWdlLCB4LCB5LCB3LCBoKTtcbiAgY3R4LnJlc3RvcmUoKTtcblxuICBjb25zdCBwYWRkaW5nID0gcGFyc2VGbG9hdChhY3Rpb25zWycteC1rb3RoaWMtcGFkZGluZyddKTtcbiAgY29sbGlzaW9uQnVmZmVyLmFkZFBvaW50V0gocG9pbnQsIHcsIGgsIHBhZGRpbmcsIGZlYXR1cmUua290aGljSWQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJJY29uO1xuIiwiLy8ndXNlIHN0cmljdCc7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG5jb25zdCBjb250ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9zdHlsZScpO1xuXG4vL1RPRE86IFJlZmFjdG9yIHRvIGNsYXNzXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGF0aE9wZW5lZDogZmFsc2UsXG4gIHJlbmRlckNhc2luZzogZnVuY3Rpb24gKGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBncm91cEZlYXR1cmVzQnlBY3Rpb25zfSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG4gICAgY29uc3QgbmV4dEFjdGlvbnMgPSBuZXh0RmVhdHVyZSAmJiBuZXh0RmVhdHVyZS5hY3Rpb25zO1xuXG4gICBpZiAoIXRoaXMucGF0aE9wZW5lZCkge1xuICAgICB0aGlzLnBhdGhPcGVuZWQgPSB0cnVlO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgfVxuXG4gICAgLy9UT0RPOiBJcyBNYXBDU1Mgc3BlYyByZWFsbHkgYWxsb3dzIGEgZmFsbGJhY2sgZnJvbSBcImNhc2luZy1kYXNoZXNcIiB0byBcImRhc2hlc1wiP1xuICAgIGNvbnN0IGRhc2hlcyA9IGFjdGlvbnNbJ2Nhc2luZy1kYXNoZXMnXSB8fCBhY3Rpb25zWydkYXNoZXMnXTtcbiAgICBwYXRoKGN0eCwgZmVhdHVyZS5nZW9tZXRyeSwgZGFzaGVzLCBmYWxzZSwgcHJvamVjdFBvaW50RnVuY3Rpb24sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cbiAgICBpZiAoZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucyAmJlxuICAgICAgICBuZXh0RmVhdHVyZSAmJlxuICAgICAgICBuZXh0RmVhdHVyZS5rZXkgPT09IGZlYXR1cmUua2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAnbGluZVdpZHRoJzogMiAqIGFjdGlvbnNbXCJjYXNpbmctd2lkdGhcIl0gKyBhY3Rpb25zWyd3aWR0aCddLFxuICAgICAgJ3N0cm9rZVN0eWxlJzogYWN0aW9uc1tcImNhc2luZy1jb2xvclwiXSxcbiAgICAgICdsaW5lQ2FwJzogYWN0aW9uc1tcImNhc2luZy1saW5lY2FwXCJdIHx8IGFjdGlvbnNbJ2xpbmVjYXAnXSxcbiAgICAgICdsaW5lSm9pbic6IGFjdGlvbnNbXCJjYXNpbmctbGluZWpvaW5cIl0gfHwgYWN0aW9uc1snbGluZWpvaW4nXSxcbiAgICAgICdnbG9iYWxBbHBoYSc6IGFjdGlvbnNbXCJjYXNpbmctb3BhY2l0eVwiXVxuICAgIH1cblxuICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwgc3R5bGUpO1xuXG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIHRoaXMucGF0aE9wZW5lZCA9IGZhbHNlO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBncm91cEZlYXR1cmVzQnlBY3Rpb25zLCBnYWxsZXJ5fSkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmZWF0dXJlLmFjdGlvbnM7XG4gICAgY29uc3QgbmV4dEFjdGlvbnMgPSBuZXh0RmVhdHVyZSAmJiBuZXh0RmVhdHVyZS5hY3Rpb25zO1xuICAgIGlmICghdGhpcy5wYXRoT3BlbmVkKSB7XG4gICAgICB0aGlzLnBhdGhPcGVuZWQgPSB0cnVlO1xuICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB9XG5cbiAgICBwYXRoKGN0eCwgZmVhdHVyZS5nZW9tZXRyeSwgYWN0aW9uc1snZGFzaGVzJ10sIGZhbHNlLCBwcm9qZWN0UG9pbnRGdW5jdGlvbiwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblxuICAgIGlmIChncm91cEZlYXR1cmVzQnlBY3Rpb25zICYmXG4gICAgICAgIG5leHRGZWF0dXJlICYmXG4gICAgICAgIG5leHRGZWF0dXJlLmtleSA9PT0gZmVhdHVyZS5rZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0TGluZWpvaW4gPSBhY3Rpb25zWyd3aWR0aCddIDw9IDIgPyBcIm1pdGVyXCIgOiBcInJvdW5kXCI7XG4gICAgY29uc3QgZGVmYXVsdExpbmVjYXAgPSBhY3Rpb25zWyd3aWR0aCddIDw9IDIgPyBcImJ1dHRcIiA6IFwicm91bmRcIjtcblxuICAgIHZhciBzdHJva2VTdHlsZTtcbiAgICBpZiAoJ2ltYWdlJyBpbiBhY3Rpb25zKSB7XG4gICAgICBjb25zdCBpbWFnZSA9IGdhbGxlcnkuZ2V0SW1hZ2UoYWN0aW9uc1snaW1hZ2UnXSk7XG4gICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgc3Ryb2tlU3R5bGUgPSBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlIHx8IGFjdGlvbnNbJ2NvbG9yJ107XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICdzdHJva2VTdHlsZSc6IHN0cm9rZVN0eWxlLFxuICAgICAgJ2xpbmVXaWR0aCc6IGFjdGlvbnNbJ3dpZHRoJ10sXG4gICAgICAnbGluZUNhcCc6IGFjdGlvbnNbJ2xpbmVjYXAnXSB8fCBkZWZhdWx0TGluZWpvaW4sXG4gICAgICAnbGluZUpvaW4nOiBhY3Rpb25zWydsaW5lam9pbiddIHx8IGRlZmF1bHRMaW5lY2FwLFxuICAgICAgJ2dsb2JhbEFscGhhJzogYWN0aW9uc1snb3BhY2l0eSddLFxuICAgICAgJ21pdGVyTGltaXQnOiA0XG4gICAgfVxuXG4gICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCBzdHlsZSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgdGhpcy5wYXRoT3BlbmVkID0gZmFsc2U7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdlb20gPSByZXF1aXJlKCcuLi91dGlscy9nZW9tJyk7XG5cbi8qKlxuICoqIFJlbmRlciBmZWF0dXJlcyBvbiBDYW52YXNcbiAqKi9cblxuLy9UT0RPOiBzcGxpdCBjb25maWd1cmF0aW9uIGFuZCBjYWxsXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgZ2VvbWV0cnksIGRhc2hlcywgZmlsbCwgcHJvamVjdFBvaW50RnVuY3Rpb24sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCkge1xuICB2YXIgdHlwZSA9IGdlb21ldHJ5LnR5cGUsXG4gICAgY29vcmRzID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG5cbiAgLy9UT0RPOiBFeHRyYWN0IHRvIFN0eWxlTWFuYWdlclxuICBpZiAoZGFzaGVzKSB7XG4gICAgZGFzaGVzID0gZGFzaGVzLnNwbGl0KFwiLFwiKS5tYXAocGFyc2VGbG9hdCk7XG4gIH1cblxuICAvL0NvbnZlcnQgc2luZ2xlIGZlYXR1cmUgdG8gYSBtdWx0LXR5cGUgdG8gbWFrZSByZW5kZXJpbmcgZWFzaWVyXG4gIGlmICh0eXBlID09PSBcIlBvbHlnb25cIikge1xuICAgIGNvb3JkcyA9IFtjb29yZHNdO1xuICAgIHR5cGUgPSBcIk11bHRpUG9seWdvblwiO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiTGluZVN0cmluZ1wiKSB7XG4gICAgY29vcmRzID0gW2Nvb3Jkc107XG4gICAgdHlwZSA9IFwiTXVsdGlMaW5lU3RyaW5nXCI7XG4gIH1cblxuICAvLyB2YXIgcG9pbnRzLFxuICAvLyAgIGxlbiA9IGNvb3Jkcy5sZW5ndGgsXG4gIC8vICAgbGVuMiwgcG9pbnRzTGVuLFxuICAvLyAgIHByZXZQb2ludCwgcG9pbnQsIHNjcmVlblBvaW50LFxuICAvLyAgIGR4LCBkeSwgZGlzdDtcblxuICBpZiAodHlwZSA9PT0gXCJNdWx0aVBvbHlnb25cIikge1xuICAgIC8vSXRlcmF0ZSBieSBQb2x5Z29ucyBpbiBNdWx0aVBvbHlnb25cbiAgICBmb3IgKGxldCBpID0gMCwgcG9seWdvbnNMZW5ndGggPSBjb29yZHMubGVuZ3RoOyBpIDwgcG9seWdvbnNMZW5ndGg7IGkrKykge1xuICAgICAgLy9JdGVyYXRlIGJ5IFJpbmdzIG9mIHRoZSBQb2x5Z29uXG4gICAgICBmb3IgKGxldCBrID0gMCwgcmluZ3NMZW5ndGggPSBjb29yZHNbaV0ubGVuZ3RoOyBrIDwgcmluZ3NMZW5ndGg7IGsrKykge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBjb29yZHNbaV1ba10ubWFwKHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgICAgICAgLy9wb2ludHNMZW4gPSBwb2ludHMubGVuZ3RoO1xuICAgICAgICBsZXQgcHJldlBvaW50ID0gcG9pbnRzWzBdO1xuXG4gICAgICAgIC8vSXRlcmF0ZSBieSBwb2ludHNcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIHBvaW50c0xlbmd0aCA9IHBvaW50cy5sZW5ndGg7IGogPD0gcG9pbnRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAvL0Nsb3NlIHRoZSByaW5nIGZyb20gbGFzdCB0byBmaXJzdCBwb2ludFxuICAgICAgICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzW2pdIHx8IHBvaW50c1swXTtcblxuICAgICAgICAgIC8vIGNvbnN0IHNjcmVlblBvaW50ID0gcHJvamVjdFBvaW50RnVuY3Rpb24ocG9pbnQpO1xuICAgICAgICAgIC8vU3RhcnQgZHJhd2luZyBmcm9tIGZpcnN0IHBvaW50XG4gICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRbMF0sIHBvaW50WzFdKTtcblxuICAgICAgICAgICAgaWYgKGRhc2hlcykge1xuICAgICAgICAgICAgICBjdHguc2V0TGluZURhc2goZGFzaGVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaChbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghZmlsbCAmJiBnZW9tLmNoZWNrU2FtZUJvdW5kYXJ5KHBvaW50LCBwcmV2UG9pbnQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCkpIHtcbiAgICAgICAgICAgIC8vIERvbid0IGRyYXcgbGluZXMgb24gdGlsZSBib3VuZGFyaWVzXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERyYXcgYSBsaW5lIG9yIGZpbGxpbmcgY29udG91clxuICAgICAgICAgICAgY3R4LmxpbmVUbyhwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByZXZQb2ludCA9IHBvaW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiTXVsdGlMaW5lU3RyaW5nXCIpIHtcbiAgICAvLyAvL1RPRE86IFRob3NlIGNvbnN0YW50cyBNVVNUIGJlIGNvbmZpZ3VyZWQgdW4gdXBwZXIgZGVzaWduIGxldmVsXG4gICAgdmFyIHBhZCA9IDUwLCAvLyBob3cgbWFueSBwaXhlbHMgdG8gZHJhdyBvdXQgb2YgdGhlIHRpbGUgdG8gYXZvaWQgcGF0aCBlZGdlcyB3aGVuIGxpbmVzIGNyb3NzZXMgdGlsZSBib3JkZXJzXG4gICAgICBza2lwID0gMDsvLzI7IC8vIGRvIG5vdCBkcmF3IGxpbmUgc2VnbWVudHMgc2hvcnRlciB0aGFuIHRoaXNcblxuICAgIC8vSXRlcmF0ZSBieSBsaW5lcyBpbiBNdWx0aUxpbmVTdHJpbmdcbiAgICBmb3IgKGxldCBpID0gMCwgbGluZXNMZW5ndGggPSBjb29yZHMubGVuZ3RoOyBpIDwgbGluZXNMZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9pbnRzID0gY29vcmRzW2ldLm1hcChwcm9qZWN0UG9pbnRGdW5jdGlvbik7XG5cbiAgICAgIC8vSXRlcmF0ZSBieSBwb2ludHMgaW4gbGluZVxuICAgICAgZm9yIChsZXQgaiA9IDAsIHBvaW50c0xlbiA9IHBvaW50cy5sZW5ndGg7IGogPCBwb2ludHNMZW47IGorKykge1xuICAgICAgICBjb25zdCBwb2ludCA9IHBvaW50c1tqXTtcblxuICAgICAgICAvLyBjb250aW51ZSBwYXRoIG9mZiB0aGUgdGlsZSBieSBzb21lIGFtb3VudCB0byBmaXggcGF0aCBlZGdlcyBiZXR3ZWVuIHRpbGVzXG4gICAgICAgIGlmICgoaiA9PT0gMCB8fCBqID09PSBwb2ludHNMZW4gLSAxKSAmJiBnZW9tLmlzT25UaWxlQm91bmRhcnkocG9pbnQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCkpIHtcbiAgICAgICAgICBsZXQgayA9IGo7XG5cbiAgICAgICAgICBsZXQgZGlzdCwgZHgsIGR5O1xuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIGsgPSBqID8gayAtIDEgOiBrICsgMTtcbiAgICAgICAgICAgIGlmIChrIDwgMCB8fCBrID49IHBvaW50c0xlbikge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJldlBvaW50ID0gcG9pbnRzW2tdO1xuXG4gICAgICAgICAgICBkeCA9IHBvaW50WzBdIC0gcHJldlBvaW50WzBdO1xuICAgICAgICAgICAgZHkgPSBwb2ludFsxXSAtIHByZXZQb2ludFsxXTtcbiAgICAgICAgICAgIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgICAgIH0gd2hpbGUgKGRpc3QgPD0gc2tpcCk7XG5cbiAgICAgICAgICAvLyBhbGwgcG9pbnRzIGFyZSBzbyBjbG9zZSB0byBlYWNoIG90aGVyIHRoYXQgaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvXG4gICAgICAgICAgLy8gZHJhdyB0aGUgbGluZSBiZXlvbmQgdGhlIHRpbGUgYm9yZGVyLCBzaW1wbHkgc2tpcCB0aGUgZW50aXJlIGxpbmUgZnJvbVxuICAgICAgICAgIC8vIGhlcmVcbiAgICAgICAgICBpZiAoayA8IDAgfHwgayA+PSBwb2ludHNMZW4pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBvaW50WzBdID0gcG9pbnRbMF0gKyBwYWQgKiBkeCAvIGRpc3Q7XG4gICAgICAgICAgcG9pbnRbMV0gPSBwb2ludFsxXSArIHBhZCAqIGR5IC8gZGlzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgICAgICAgIGlmIChkYXNoZXMpIHtcbiAgICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaChkYXNoZXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdHguc2V0TGluZURhc2goW10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHgubGluZVRvKHBvaW50WzBdLCBwb2ludFsxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIvLyd1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xuY29uc3QgY29udGV4dFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvc3R5bGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBhdGhPcGVuZWQ6IGZhbHNlLFxuICByZW5kZXI6IGZ1bmN0aW9uIChjdHgsIGZlYXR1cmUsIG5leHRGZWF0dXJlLCB7cHJvamVjdFBvaW50RnVuY3Rpb24sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucywgZ2FsbGVyeX0pIHtcbiAgICBjb25zdCBhY3Rpb25zID0gZmVhdHVyZS5hY3Rpb25zO1xuICAgIGNvbnN0IG5leHRBY3Rpb25zID0gbmV4dEZlYXR1cmUgJiYgbmV4dEZlYXR1cmUuYWN0aW9ucztcbiAgICBpZiAoIXRoaXMucGF0aE9wZW5lZCkge1xuICAgICAgdGhpcy5wYXRoT3BlbmVkID0gdHJ1ZTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB9XG5cbiAgICBwYXRoKGN0eCwgZmVhdHVyZS5nZW9tZXRyeSwgZmFsc2UsIHRydWUsIHByb2plY3RQb2ludEZ1bmN0aW9uLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuXG4gICAgaWYgKGdyb3VwRmVhdHVyZXNCeUFjdGlvbnMgJiZcbiAgICAgICAgbmV4dEZlYXR1cmUgJiZcbiAgICAgICAgbmV4dEZlYXR1cmUua2V5ID09PSBmZWF0dXJlLmtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICgnZmlsbC1jb2xvcicgaW4gYWN0aW9ucykge1xuICAgICAgLy8gZmlyc3QgcGFzcyBmaWxscyB3aXRoIHNvbGlkIGNvbG9yXG4gICAgICBsZXQgc3R5bGUgPSB7XG4gICAgICAgIGZpbGxTdHlsZTogYWN0aW9uc1tcImZpbGwtY29sb3JcIl0sXG4gICAgICAgIGdsb2JhbEFscGhhOiBhY3Rpb25zW1wiZmlsbC1vcGFjaXR5XCJdIHx8IGFjdGlvbnNbJ29wYWNpdHknXVxuICAgICAgfTtcblxuICAgICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCBzdHlsZSk7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH1cblxuICAgIGlmICgnZmlsbC1pbWFnZScgaW4gYWN0aW9ucykge1xuICAgICAgLy8gc2Vjb25kIHBhc3MgZmlsbHMgd2l0aCB0ZXh0dXJlXG4gICAgICBjb25zdCBpbWFnZSA9IGdhbGxlcnkuZ2V0SW1hZ2UoYWN0aW9uc1snZmlsbC1pbWFnZSddKTtcbiAgICAgIGlmIChpbWFnZSkge1xuICAgICAgICBsZXQgc3R5bGUgPSB7XG4gICAgICAgICAgZmlsbFN0eWxlOiBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpLFxuICAgICAgICAgIGdsb2JhbEFscGhhOiBhY3Rpb25zW1wiZmlsbC1vcGFjaXR5XCJdIHx8IGFjdGlvbnNbJ29wYWNpdHknXVxuICAgICAgICB9O1xuICAgICAgICBjb250ZXh0VXRpbHMuYXBwbHlTdHlsZShjdHgsIHN0eWxlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhdGhPcGVuZWQgPSBmYWxzZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ29sbGlzaW9uQnVmZmVyID0gcmVxdWlyZShcIi4uL3V0aWxzL2NvbGxpc2lvbnNcIik7XG5jb25zdCBjYW52YXNDb250ZXh0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3N0eWxlXCIpO1xuY29uc3QgZmxvdyA9IHJlcXVpcmUoXCIuLi91dGlscy9mbG93XCIpO1xuXG5jb25zdCBsaW5lID0gcmVxdWlyZShcIi4vbGluZVwiKTtcbmNvbnN0IHBvbHlnb24gPSByZXF1aXJlKFwiLi9wb2x5Z29uXCIpO1xuY29uc3QgdGV4dCA9IHJlcXVpcmUoXCIuL3RleHRcIik7XG5jb25zdCBzaGllbGQgPSByZXF1aXJlKFwiLi9zaGllbGRcIik7XG5jb25zdCBpY29uID0gcmVxdWlyZShcIi4vaWNvblwiKTtcblxuY29uc3QgcmVuZGVycyA9IHtcbiAgY2FzaW5nOiBsaW5lLnJlbmRlckNhc2luZyxcbiAgbGluZTogbGluZS5yZW5kZXIsXG4gIHBvbHlnb246IHBvbHlnb24ucmVuZGVyLFxuICB0ZXh0OiB0ZXh0LnJlbmRlcixcbiAgaWNvbjogaWNvbi5yZW5kZXIsXG4gIHNoaWVsZDogc2hpZWxkLnJlbmRlclxufVxuXG5mdW5jdGlvbiBSZW5kZXJlcihnYWxsZXJ5LCBvcHRpb25zKSB7XG4gIHRoaXMuZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucyA9IG9wdGlvbnMuZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucyB8fCBmYWxzZTtcbiAgdGhpcy5kZWJ1ZyA9IG9wdGlvbnMuZGVidWcgfHwgZmFsc2U7XG4gIHRoaXMucHJvamVjdFBvaW50RnVuY3Rpb24gPSBvcHRpb25zLnByb2plY3RQb2ludEZ1bmN0aW9uO1xuICB0aGlzLmdldEZyYW1lID0gb3B0aW9ucy5nZXRGcmFtZTtcbiAgdGhpcy5nYWxsZXJ5ID0gZ2FsbGVyeTtcbn1cblxuUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlckJhY2tncm91bmQgPSBmdW5jdGlvbihsYXllcnMsIGN0eCwgd2lkdGgsIGhlaWdodCwgem9vbSkge1xuICBjdHguZmlsbFN0eWxlID0gJyNkZGQnO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgLy9UT0RPOiBTdHlsZU1hbmFnZXIgc2hvdWxkIGNyZWF0ZSBiYWNrZ3JvdW5kIGFzIGEgbGF5ZXIgaW5zdGVhZCBvZiBtZXNzaW5nIHdpdGggc3R5bGVzIG1hbnVhbGx5XG4gIC8vIHZhciBzdHlsZSA9IHRoaXMuc3R5bGVNYW5hZ2VyLnJlc3R5bGUoc3R5bGVzLCB7fSwge30sIHpvb20sICdjYW52YXMnLCAnY2FudmFzJyk7XG4gIC8vXG4gIC8vIHZhciBmaWxsUmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIGN0eC5maWxsUmVjdCgtMSwgLTEsIHdpZHRoICsgMSwgaGVpZ2h0ICsgMSk7XG4gIC8vIH07XG4gIC8vXG4gIC8vIGZvciAodmFyIGkgaW4gc3R5bGUpIHtcbiAgLy8gICAgIHBvbHlnb24uZmlsbChjdHgsIHN0eWxlW2ldLCBmaWxsUmVjdCk7XG4gIC8vIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29sbGlzaW9ucyhjdHgsIG5vZGUpIHtcbiAgY3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG4gIGN0eC5saW5lV2lkdGggPSAxO1xuICBpZiAobm9kZS5sZWFmKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChib3gpID0+IGN0eC5zdHJva2VSZWN0KGJveC5taW5YLCBib3gubWluWSwgYm94Lm1heFggLSBib3gubWluWCwgYm94Lm1heFkgLSBib3gubWluWSkpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHJlbmRlckNvbGxpc2lvbnMoY3R4LCBjaGlsZCkpO1xuICB9XG59XG5cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihsYXllcnMsIGN0eCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCBwcm9qZWN0UG9pbnRGdW5jdGlvbiwgY2FsbGJhY2spIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIGNvbGxpc2lvbkJ1ZmZlciA9IG5ldyBDb2xsaXNpb25CdWZmZXIodGlsZUhlaWdodCwgdGlsZVdpZHRoKTtcbiAgLy8gcmVuZGVyIHRoZSBtYXBcbiAgY2FudmFzQ29udGV4dC5hcHBseURlZmF1bHRzKGN0eCk7XG5cbiAgY29uc3QgY29udGV4dCA9IHtcbiAgICBjb2xsaXNpb25CdWZmZXI6IGNvbGxpc2lvbkJ1ZmZlcixcbiAgICBnYWxsZXJ5OiB0aGlzLmdhbGxlcnksXG4gICAgdGlsZVdpZHRoOiB0aWxlV2lkdGgsXG4gICAgdGlsZUhlaWdodDogdGlsZUhlaWdodCxcbiAgICBwcm9qZWN0UG9pbnRGdW5jdGlvbjogcHJvamVjdFBvaW50RnVuY3Rpb24sXG4gICAgZ3JvdXBGZWF0dXJlc0J5QWN0aW9uczogc2VsZi5ncm91cEZlYXR1cmVzQnlBY3Rpb25zXG4gIH1cblxuICBjb25zdCBmdW5jcyA9IGxheWVycy5tYXAoKGxheWVyKSA9PiAoKG5leHQpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IGxheWVyLmZlYXR1cmVzO1xuXG4gICAgLy9UT0RPOiBFbWl0IGV2ZW50XG4gICAgY29uc29sZS50aW1lKGxheWVyLnJlbmRlcik7XG5cbiAgICBjb25zdCByZW5kZXJGbiA9IHJlbmRlcnNbbGF5ZXIucmVuZGVyXTtcbiAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gZmVhdHVyZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHJlbmRlckZuKGN0eCwgZmVhdHVyZXNbal0sIGZlYXR1cmVzW2ogKyAxXSwgY29udGV4dCk7XG4gICAgfVxuXG4gICAgLy9UT0RPOiBFbWl0IGV2ZW50XG4gICAgY29uc29sZS50aW1lRW5kKGxheWVyLnJlbmRlcik7XG5cbiAgICBuZXh0KCk7XG4gIH0pKTtcblxuICBmbG93LnNlcmllcyhmdW5jcywgc2VsZi5nZXRGcmFtZSwgKCkgPT4ge1xuICAgIGlmIChzZWxmLmRlYnVnKSB7XG4gICAgICByZW5kZXJDb2xsaXNpb25zKGN0eCwgY29sbGlzaW9uQnVmZmVyLmJ1ZmZlci5kYXRhKTtcbiAgICB9XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCcuL3BhdGgnKTtcbmNvbnN0IGNvbnRleHRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3N0eWxlJyk7XG5jb25zdCBnZW9tID0gcmVxdWlyZSgnLi4vdXRpbHMvZ2VvbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoY3R4LCBmZWF0dXJlLCBuZXh0RmVhdHVyZSwge3Byb2plY3RQb2ludEZ1bmN0aW9uLCBjb2xsaXNpb25CdWZmZXIsIGdhbGxlcnl9KSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZlYXR1cmUuYWN0aW9ucztcblxuICAgIGNvbnN0IHBvaW50ID0gZ2VvbS5nZXRSZXByUG9pbnQoZmVhdHVyZS5nZW9tZXRyeSwgcHJvamVjdFBvaW50RnVuY3Rpb24pO1xuICAgIGlmICghcG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW1nLCBsZW4gPSAwLCBmb3VuZCA9IGZhbHNlLCBpLCBzZ247XG5cbiAgICBpZiAoYWN0aW9uc1tcInNoaWVsZC1pbWFnZVwiXSkge1xuICAgICAgaW1nID0gZ2FsbGVyeS5nZXRJbWFnZShhY3Rpb25zW1wic2hpZWxkLWltYWdlXCJdKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGZvbnQ6IGNvbnRleHRVdGlscy5jb21wb3NlRm9udERlY2xhcmF0aW9uKGFjdGlvbnNbXCJzaGllbGQtZm9udC1mYW1pbHlcIl0gfHwgYWN0aW9uc1tcImZvbnQtZmFtaWx5XCJdLCBhY3Rpb25zW1wic2hpZWxkLWZvbnQtc2l6ZVwiXSB8fCBhY3Rpb25zW1wiZm9udC1zaXplXCJdLCBhY3Rpb25zKSxcbiAgICAgIGZpbGxTdHlsZTogYWN0aW9uc1tcInNoaWVsZC10ZXh0LWNvbG9yXCJdLFxuICAgICAgZ2xvYmFsQWxwaGE6IGFjdGlvbnNbXCJzaGllbGQtdGV4dC1vcGFjaXR5XCJdIHx8IGFjdGlvbnNbJ29wYWNpdHknXSxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICB0ZXh0QmFzZWxpbmU6ICdtaWRkbGUnXG4gICAgfTtcblxuICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwgc3R5bGUpO1xuXG4gICAgdmFyIHRleHQgPSBTdHJpbmcoc3R5bGVbJ3NoaWVsZC10ZXh0J10pLFxuICAgICAgdGV4dFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoLFxuICAgICAgbGV0dGVyV2lkdGggPSB0ZXh0V2lkdGggLyB0ZXh0Lmxlbmd0aCxcbiAgICAgIGNvbGxpc2lvbldpZHRoID0gdGV4dFdpZHRoICsgMixcbiAgICAgIGNvbGxpc2lvbkhlaWdodCA9IGxldHRlcldpZHRoICogMS44O1xuXG4gICAgaWYgKGZlYXR1cmUudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICBsZW4gPSBnZW9tLmdldFBvbHlMZW5ndGgoZmVhdHVyZS5jb29yZGluYXRlcyk7XG5cbiAgICAgIGlmIChNYXRoLm1heChjb2xsaXNpb25IZWlnaHQgLyBocywgY29sbGlzaW9uV2lkdGggLyB3cykgPiBsZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBzZ24gPSAxOyBpIDwgbGVuIC8gMjsgaSArPSBNYXRoLm1heChsZW4gLyAzMCwgY29sbGlzaW9uSGVpZ2h0IC8gd3MpLCBzZ24gKj0gLTEpIHtcbiAgICAgICAgdmFyIHJlcHJQb2ludCA9IGdlb20uZ2V0QW5nbGVBbmRDb29yZHNBdExlbmd0aChmZWF0dXJlLmNvb3JkaW5hdGVzLCBsZW4gLyAyICsgc2duICogaSwgMCk7XG4gICAgICAgIGlmICghcmVwclBvaW50KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXByUG9pbnQgPSBbcmVwclBvaW50WzFdLCByZXByUG9pbnRbMl1dO1xuXG4gICAgICAgIHBvaW50ID0gZ2VvbS50cmFuc2Zvcm1Qb2ludChyZXByUG9pbnQsIHdzLCBocyk7XG4gICAgICAgIGlmIChpbWcgJiYgIWFjdGlvbnNbXCJhbGxvdy1vdmVybGFwXCJdICYmIGNvbGxpc2lvbkJ1ZmZlci5jaGVja1BvaW50V0gocG9pbnQsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgZmVhdHVyZS5rb3RoaWNJZCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCFhY3Rpb25zW1wiYWxsb3ctb3ZlcmxhcFwiXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbkJ1ZmZlci5jaGVja1BvaW50V0gocG9pbnQsIGNvbGxpc2lvbldpZHRoLCBjb2xsaXNpb25IZWlnaHQsIGZlYXR1cmUua290aGljSWQpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlW1wic2hpZWxkLWNhc2luZy13aWR0aFwiXSkge1xuICAgICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCB7XG4gICAgICAgIGZpbGxTdHlsZTogc3R5bGVbXCJzaGllbGQtY2FzaW5nLWNvbG9yXCJdIHx8IFwiIzAwMDAwMFwiLFxuICAgICAgICBnbG9iYWxBbHBoYTogc3R5bGVbXCJzaGllbGQtY2FzaW5nLW9wYWNpdHlcIl0gfHwgc3R5bGVbJ29wYWNpdHknXSB8fCAxXG4gICAgICB9KTtcbiAgICAgIHZhciBwID0gc3R5bGVbXCJzaGllbGQtY2FzaW5nLXdpZHRoXCJdICsgKHN0eWxlW1wic2hpZWxkLWZyYW1lLXdpZHRoXCJdIHx8IDApO1xuICAgICAgY3R4LmZpbGxSZWN0KHBvaW50WzBdIC0gY29sbGlzaW9uV2lkdGggLyAyIC0gcCxcbiAgICAgICAgcG9pbnRbMV0gLSBjb2xsaXNpb25IZWlnaHQgLyAyIC0gcCxcbiAgICAgICAgY29sbGlzaW9uV2lkdGggKyAyICogcCxcbiAgICAgICAgY29sbGlzaW9uSGVpZ2h0ICsgMiAqIHApO1xuICAgIH1cblxuICAgIGlmIChzdHlsZVtcInNoaWVsZC1mcmFtZS13aWR0aFwiXSkge1xuICAgICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCB7XG4gICAgICAgIGZpbGxTdHlsZTogc3R5bGVbXCJzaGllbGQtZnJhbWUtY29sb3JcIl0gfHwgXCIjMDAwMDAwXCIsXG4gICAgICAgIGdsb2JhbEFscGhhOiBzdHlsZVtcInNoaWVsZC1mcmFtZS1vcGFjaXR5XCJdIHx8IHN0eWxlWydvcGFjaXR5J10gfHwgMVxuICAgICAgfSk7XG4gICAgICBjdHguZmlsbFJlY3QocG9pbnRbMF0gLSBjb2xsaXNpb25XaWR0aCAvIDIgLSBzdHlsZVtcInNoaWVsZC1mcmFtZS13aWR0aFwiXSxcbiAgICAgICAgcG9pbnRbMV0gLSBjb2xsaXNpb25IZWlnaHQgLyAyIC0gc3R5bGVbXCJzaGllbGQtZnJhbWUtd2lkdGhcIl0sXG4gICAgICAgIGNvbGxpc2lvbldpZHRoICsgMiAqIHN0eWxlW1wic2hpZWxkLWZyYW1lLXdpZHRoXCJdLFxuICAgICAgICBjb2xsaXNpb25IZWlnaHQgKyAyICogc3R5bGVbXCJzaGllbGQtZnJhbWUtd2lkdGhcIl0pO1xuICAgIH1cblxuICAgIGlmIChzdHlsZVtcInNoaWVsZC1jb2xvclwiXSkge1xuICAgICAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCB7XG4gICAgICAgIGZpbGxTdHlsZTogc3R5bGVbXCJzaGllbGQtY29sb3JcIl0gfHwgXCIjMDAwMDAwXCIsXG4gICAgICAgIGdsb2JhbEFscGhhOiBzdHlsZVtcInNoaWVsZC1vcGFjaXR5XCJdIHx8IHN0eWxlWydvcGFjaXR5J10gfHwgMVxuICAgICAgfSk7XG4gICAgICBjdHguZmlsbFJlY3QocG9pbnRbMF0gLSBjb2xsaXNpb25XaWR0aCAvIDIsXG4gICAgICAgIHBvaW50WzFdIC0gY29sbGlzaW9uSGVpZ2h0IC8gMixcbiAgICAgICAgY29sbGlzaW9uV2lkdGgsXG4gICAgICAgIGNvbGxpc2lvbkhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKGltZykge1xuICAgICAgY3R4LmRyYXdJbWFnZShpbWcsXG4gICAgICAgIE1hdGguZmxvb3IocG9pbnRbMF0gLSBpbWcud2lkdGggLyAyKSxcbiAgICAgICAgTWF0aC5mbG9vcihwb2ludFsxXSAtIGltZy5oZWlnaHQgLyAyKSk7XG4gICAgfVxuICAgIGNvbnRleHRVdGlscy5hcHBseVN0eWxlKGN0eCwge1xuICAgICAgZmlsbFN0eWxlOiBzdHlsZVtcInNoaWVsZC10ZXh0LWNvbG9yXCJdIHx8IFwiIzAwMDAwMFwiLFxuICAgICAgZ2xvYmFsQWxwaGE6IHN0eWxlW1wic2hpZWxkLXRleHQtb3BhY2l0eVwiXSB8fCBzdHlsZVsnb3BhY2l0eSddIHx8IDFcbiAgICB9KTtcblxuICAgIGN0eC5maWxsVGV4dCh0ZXh0LCBwb2ludFswXSwgTWF0aC5jZWlsKHBvaW50WzFdKSk7XG4gICAgaWYgKGltZykge1xuICAgICAgY29sbGlzaW9uQnVmZmVyLmFkZFBvaW50V0gocG9pbnQsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgZmVhdHVyZS5rb3RoaWNJZCk7XG4gICAgfVxuXG4gICAgY29sbGlzaW9uQnVmZmVyLmFkZFBvaW50V0gocG9pbnQsIGNvbGxpc2lvbkhlaWdodCwgY29sbGlzaW9uV2lkdGgsXG4gICAgICAocGFyc2VGbG9hdChzdHlsZVtcInNoaWVsZC1jYXNpbmctd2lkdGhcIl0pIHx8IDApICsgKHBhcnNlRmxvYXQoc3R5bGVbXCJzaGllbGQtZnJhbWUtd2lkdGhcIl0pIHx8IDApICsgKHBhcnNlRmxvYXQoc3R5bGVbXCIteC1tYXBuaWstbWluLWRpc3RhbmNlXCJdKSB8fCAzMCksIGZlYXR1cmUua290aGljSWQpO1xuXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdlb20gPSByZXF1aXJlKCcuLi91dGlscy9nZW9tJyk7XG5jb25zdCBjb250ZXh0VXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9zdHlsZScpO1xuLy92YXIgdGV4dE9uUGF0aCA9IHJlcXVpcmUoXCIuL3RleHRvbnBhdGhcIikudGV4dE9uUGF0aDtcbmNvbnN0IHRleHRPblBhdGggPSByZXF1aXJlKFwiLi9jdXJ2ZWR0ZXh0XCIpLnJlbmRlclxuXG5mdW5jdGlvbiByZW5kZXJUZXh0KGN0eCwgZmVhdHVyZSwgbmV4dEZlYXR1cmUsIHtwcm9qZWN0UG9pbnRGdW5jdGlvbiwgY29sbGlzaW9uQnVmZmVyfSkge1xuICBjb25zdCBhY3Rpb25zID0gZmVhdHVyZS5hY3Rpb25zO1xuXG4gIGNvbnN0IGhhc0hhbG8gPSAndGV4dC1oYWxvLXJhZGl1cycgaW4gYWN0aW9ucyAmJiBwYXJzZUludChhY3Rpb25zWyd0ZXh0LWhhbG8tcmFkaXVzJ10pID4gMDtcblxuICBjb25zdCBzdHlsZSA9IHtcbiAgICBsaW5lV2lkdGg6IGFjdGlvbnNbJ3RleHQtaGFsby1yYWRpdXMnXSxcbiAgICBmb250OiBjb250ZXh0VXRpbHMuY29tcG9zZUZvbnREZWNsYXJhdGlvbihhY3Rpb25zWydmb250LWZhbWlseSddLCBhY3Rpb25zWydmb250LXNpemUnXSwgYWN0aW9ucyksXG4gICAgZmlsbFN0eWxlOiBhY3Rpb25zWyd0ZXh0LWNvbG9yJ10sXG4gICAgc3Ryb2tlU3R5bGU6IGFjdGlvbnNbJ3RleHQtaGFsby1jb2xvciddLFxuICAgIGdsb2JhbEFscGhhOiBhY3Rpb25zWyd0ZXh0LW9wYWNpdHknXSB8fCBhY3Rpb25zWydvcGFjaXR5J10sXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICB0ZXh0QmFzZWxpbmU6ICdtaWRkbGUnXG4gIH07XG5cbiAgY29udGV4dFV0aWxzLmFwcGx5U3R5bGUoY3R4LCBzdHlsZSk7XG5cbiAgdmFyIHRleHQgPSBTdHJpbmcoYWN0aW9ucy50ZXh0KS50cmltKCk7XG4gIGlmIChhY3Rpb25zWyd0ZXh0LXRyYW5zZm9ybSddID09PSAndXBwZXJjYXNlJykge1xuICAgIHRleHQgPSB0ZXh0LnRvVXBwZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAoYWN0aW9uc1sndGV4dC10cmFuc2Zvcm0nXSA9PT0gJ2xvd2VyY2FzZScpIHtcbiAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKGFjdGlvbnNbJ3RleHQtdHJhbnNmb3JtJ10gPT09ICdjYXBpdGFsaXplJykge1xuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyhefFxccylcXFMvZywgZnVuY3Rpb24oY2gpIHsgcmV0dXJuIGNoLnRvVXBwZXJDYXNlKCk7IH0pO1xuICB9XG5cbiAgaWYgKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nIHx8IGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgIC8vVE9ETzogUmVmYWN0b3IsIGNhbGN1bGF0ZSByZXByZXNlbnRhdGl2ZSBwb2ludCBvbmx5IG9uY2VcbiAgICBjb25zdCBwb2ludCA9IGdlb20uZ2V0UmVwclBvaW50KGZlYXR1cmUuZ2VvbWV0cnksIHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgICBpZiAoIXBvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGV4dFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuICAgIGNvbnN0IGxldHRlcldpZHRoID0gdGV4dFdpZHRoIC8gdGV4dC5sZW5ndGg7XG4gICAgY29uc3Qgd2lkdGggPSB0ZXh0V2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gbGV0dGVyV2lkdGggKiAyLjU7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IGFjdGlvbnNbJ3RleHQtb2Zmc2V0J107XG5cbiAgICBjb25zdCBjZW50ZXIgPSBbcG9pbnRbMF0sIHBvaW50WzFdICsgb2Zmc2V0WV07XG4gICAgaWYgKCFhY3Rpb25zWyd0ZXh0LWFsbG93LW92ZXJsYXAnXSkge1xuICAgICAgaWYgKGNvbGxpc2lvbkJ1ZmZlci5jaGVja1BvaW50V0goY2VudGVyLCB3aWR0aCwgaGVpZ2h0LCBmZWF0dXJlLmtvdGhpY0lkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0hhbG8pIHtcbiAgICAgIGN0eC5zdHJva2VUZXh0KHRleHQsIGNlbnRlclswXSwgY2VudGVyWzFdKTtcbiAgICB9XG4gICAgY3R4LmZpbGxUZXh0KHRleHQsIGNlbnRlclswXSwgY2VudGVyWzFdKTtcblxuICAgIGNvbnN0IHBhZGRpbmcgPSBwYXJzZUZsb2F0KGFjdGlvbnNbJy14LWtvdGhpYy1wYWRkaW5nJ10pO1xuICAgIGNvbGxpc2lvbkJ1ZmZlci5hZGRQb2ludFdIKHBvaW50LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBmZWF0dXJlLmtvdGhpY0lkKTtcbiAgfSBlbHNlIGlmIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgIGNvbnN0IHBvaW50cyA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMubWFwKHByb2plY3RQb2ludEZ1bmN0aW9uKTtcbiAgICB0ZXh0T25QYXRoKGN0eCwgcG9pbnRzLCB0ZXh0LCBoYXNIYWxvLCBjb2xsaXNpb25CdWZmZXIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbmRlciA9IHJlbmRlclRleHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEVWQUxfRlVOQ1RJT05TID0ge1xuICBtaW46IGZ1bmN0aW9uICgvKi4uLiovKSB7XG4gICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIH0sXG5cbiAgbWF4OiBmdW5jdGlvbiAoLyouLi4qLykge1xuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICB9LFxuXG4gIGFueTogZnVuY3Rpb24gKC8qLi4uKi8pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHR5cGVvZihhcmd1bWVudHNbaV0pICE9PSAndW5kZWZpbmVkJyAmJiBhcmd1bWVudHNbaV0gIT09ICcnKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9LFxuXG4gIG51bTogZnVuY3Rpb24gKGFyZykge1xuICAgIGNvbnN0IG4gPSBwYXJzZUZsb2F0KGFyZyk7XG4gICAgcmV0dXJuIGlzTmFOKG4pID8gMCA6IG47XG4gIH0sXG5cbiAgc3RyOiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuICcnICsgYXJnO1xuICB9LFxuXG4gIGludDogZnVuY3Rpb24gKGFyZykge1xuICAgIGNvbnN0IG4gPSBwYXJzZUludChhcmcsIDEwKTtcbiAgICByZXR1cm4gaXNOYU4obikgPyAwIDogbjtcbiAgfSxcblxuICBzcXJ0OiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydChhcmcpO1xuICB9LFxuXG4gIGNvbmQ6IGZ1bmN0aW9uIChhcmcsIHRydWVFeHByLCBmYWxzZUV4cHIpIHtcbiAgICB0cnVlRXhwciA9IHRydWVFeHByIHx8IHRydWU7XG4gICAgZmFsc2VFeHByID0gZmFsc2VFeHByIHx8IGZhbHNlO1xuXG4gICAgcmV0dXJuIGFyZyA/IHRydWVFeHByIDogZmFsc2VFeHByO1xuICB9LFxuXG4gIG1ldHJpYzogZnVuY3Rpb24gKGFyZykge1xuICAgIGlmICgvXFxkXFxzKm1tJC8udGVzdChhcmcpKSB7XG4gICAgICByZXR1cm4gMC4wMDEgKiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgfSBlbHNlIGlmICgvXFxkXFxzKmNtJC8udGVzdChhcmcpKSB7XG4gICAgICByZXR1cm4gMC4wMSAqIHBhcnNlRmxvYXQoYXJnKTtcbiAgICB9IGVsc2UgaWYgKC9cXGRcXHMqZG0kLy50ZXN0KGFyZykpIHtcbiAgICAgIHJldHVybiAwLjEgKiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgfSBlbHNlIGlmICgvXFxkXFxzKmttJC8udGVzdChhcmcpKSB7XG4gICAgICByZXR1cm4gMTAwMCAqIHBhcnNlRmxvYXQoYXJnKTtcbiAgICB9IGVsc2UgaWYgKC9cXGRcXHMqKGlufFwiKSQvLnRlc3QoYXJnKSkge1xuICAgICAgcmV0dXJuIDAuMDI1NCAqIHBhcnNlRmxvYXQoYXJnKTtcbiAgICB9IGVsc2UgaWYgKC9cXGRcXHMqKGZ0fCcpJC8udGVzdChhcmcpKSB7XG4gICAgICByZXR1cm4gMC4zMDQ4ICogcGFyc2VGbG9hdChhcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChhcmcpO1xuICAgIH1cbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3VtZW50c1sxXSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHNbMV0uam9pbihhcmd1bWVudHNbMF0pO1xuICAgIH1cbiAgICB2YXIgdGFnU3RyaW5nID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWdTdHJpbmcgPSB0YWdTdHJpbmcuY29uY2F0KGFyZ3VtZW50c1swXSkuY29uY2F0KGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ1N0cmluZy5zdWJzdHIoYXJndW1lbnRzWzBdLmxlbmd0aCk7XG4gIH0sXG5cbiAgc3BsaXQ6IGZ1bmN0aW9uIChzZXAsIHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5zcGxpdChzZXApO1xuICB9LFxuXG4gIGdldDogZnVuY3Rpb24oYXJyLCBpbmRleCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKCEvXlswLTldKyQvLnRlc3QoaW5kZXgpIHx8IGluZGV4ID49IGFyci5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJbaW5kZXhdO1xuICB9LFxuXG4gIHNldDogZnVuY3Rpb24oYXJyLCBpbmRleCwgdGV4dCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG5cbiAgICBpZiAoIS9eWzAtOV0rJC8udGVzdChpbmRleCkpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgYXJyW2luZGV4XSA9IHRleHQ7XG5cbiAgICByZXR1cm4gYXJyO1xuICB9LFxuXG4gIGNvdW50OiBmdW5jdGlvbihhcnIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9LFxuXG4gIGxpc3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gIH0sXG5cbiAgYXBwZW5kOiBmdW5jdGlvbihsc3QsIHYpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGxzdCkgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBsc3QucHVzaCh2KTtcblxuICAgIHJldHVybiBsc3Q7XG4gIH0sXG5cbiAgY29udGFpbnM6IGZ1bmN0aW9uKGxzdCwgdikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobHN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAobHN0LmluZGV4T2YodikgPj0gMCk7XG4gIH0sXG5cbiAgc29ydDogZnVuY3Rpb24obHN0KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChsc3QpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbHN0LnNvcnQoKTtcblxuICAgIHJldHVybiBsc3Q7XG4gIH0sXG5cbiAgcmV2ZXJzZTogZnVuY3Rpb24obHN0KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChsc3QpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGxzdC5yZXZlcnNlKCk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBldmFsQmluYXJ5T3AobGVmdCwgb3AsIHJpZ2h0KSB7XG4gIHN3aXRjaCAob3ApIHtcbiAgY2FzZSAnKyc6XG4gICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgY2FzZSAnLSc6XG4gICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgY2FzZSAnKic6XG4gICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgY2FzZSAnLyc6XG4gICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgY2FzZSAnJSc6XG4gICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBiaW5hcnkgb3BlcnRhdG9yIGluIGV2YWwgXCIgKyBKU09OLnN0cmluZ2lmeShvcCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2YWxGdW5jKGZ1bmMsIGFyZ3MsIHRhZ3MsIGFjdGlvbnMsIGxvY2FsZXMpIHtcbiAgc3dpdGNoIChmdW5jKSB7XG4gIGNhc2UgJ3RhZyc6XG4gICAgaWYgKGFyZ3MubGVuZ3RoICE9IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRhZygpIGZ1bmN0aW9uIGFsbG93cyBvbmx5IG9uZSBhcmd1bWVudFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3NbMF0gaW4gdGFncyA/IHRhZ3NbYXJnc1swXV0gOiAnJztcbiAgY2FzZSAncHJvcCc6XG4gICAgaWYgKGFyZ3MubGVuZ3RoICE9IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInByb3AoKSBmdW5jdGlvbiBhbGxvd3Mgb25seSBvbmUgYXJndW1lbnRcIik7XG4gICAgfVxuICAgIHJldHVybiBhcmdzWzBdIGluIGFjdGlvbnMgPyBhY3Rpb25zW2FyZ3NbMF1dIDogJyc7XG4gIGNhc2UgJ2xvY2FsaXplJzpcbiAgICBpZiAoYXJncy5sZW5ndGggIT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibG9jYWxpemUoKSBmdW5jdGlvbiBhbGxvd3Mgb25seSBvbmUgYXJndW1lbnRcIik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB0YWcgPSBhcmdzWzBdICsgJzonICsgbG9jYWxlc1tpXTtcbiAgICAgIGlmICh0YWcgaW4gdGFncykge1xuICAgICAgICByZXR1cm4gdGFnc1t0YWddO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcmdzWzBdIGluIHRhZ3MgPyB0YWdzW2FyZ3NbMF1dIDogJyc7XG4gIGRlZmF1bHQ6XG4gICAgaWYgKCEoZnVuYyBpbiBFVkFMX0ZVTkNUSU9OUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgZnVuY3Rpb24gaW4gZXZhbCBcIiArIEpTT04uc3RyaW5naWZ5KGZ1bmMpKTtcbiAgICB9XG4gICAgcmV0dXJuIEVWQUxfRlVOQ1RJT05TW2Z1bmNdLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2YWxFeHByKGV4cHIsIHRhZ3M9e30sIGFjdGlvbnM9e30sIGxvY2FsZXM9W10pIHtcbiAgc3dpdGNoIChleHByLnR5cGUpIHtcbiAgY2FzZSBcImJpbmFyeV9vcFwiOlxuICAgIHJldHVybiBldmFsQmluYXJ5T3AoZXZhbEV4cHIoZXhwci5sZWZ0LCB0YWdzLCBhY3Rpb25zLCBsb2NhbGVzKSwgZXhwci5vcCwgZXZhbEV4cHIoZXhwci5yaWdodCwgdGFncywgYWN0aW9ucywgbG9jYWxlcykpO1xuICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICByZXR1cm4gZXZhbEZ1bmMoZXhwci5mdW5jLCBleHByLmFyZ3MubWFwKCh4KSA9PiBldmFsRXhwcih4LCB0YWdzLCBhY3Rpb25zKSksIHRhZ3MsIGFjdGlvbnMsIGxvY2FsZXMpO1xuICBjYXNlIFwic3RyaW5nXCI6XG4gIGNhc2UgXCJudW1iZXJcIjpcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBleHByZXNzaW9uIHR5cGUgXCIgKyBKU09OLnN0cmluZ2lmeShleHByKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwZW5kS25vd25UYWdzKHRhZ3MsIGV4cHIsIGxvY2FsZXMpIHtcblxuICBzd2l0Y2ggKGV4cHIudHlwZSkge1xuICBjYXNlIFwiYmluYXJ5X29wXCI6XG4gICAgYXBwZW5kS25vd25UYWdzKHRhZ3MsIGV4cHIubGVmdCk7XG4gICAgYXBwZW5kS25vd25UYWdzKHRhZ3MsIGV4cHIucmlnaHQpO1xuICAgIGJyZWFrO1xuICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICBpZiAoZXhwci5mdW5jID09PSBcInRhZ1wiKSB7XG4gICAgICBpZiAoZXhwci5hcmdzICYmIGV4cHIuYXJncy5sZW5ndGggPT0gMSkge1xuICAgICAgICBjb25zdCB0YWcgPSBldmFsRXhwcihleHByLmFyZ3NbMF0sIHt9LCB7fSk7XG4gICAgICAgIHRhZ3NbdGFnXSA9ICdrdic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChleHByLmZ1bmMgPT09IFwibG9jYWxpemVcIikge1xuICAgICAgaWYgKGV4cHIuYXJncyAmJiBleHByLmFyZ3MubGVuZ3RoID09IDEpIHtcbiAgICAgICAgY29uc3QgdGFnID0gZXZhbEV4cHIoZXhwci5hcmdzWzBdLCB7fSwge30pO1xuICAgICAgICB0YWdzW3RhZ10gPSAna3YnO1xuICAgICAgICBsb2NhbGVzLm1hcCgobG9jYWxlKSA9PiB0YWcgKyBcIjpcIiArIGxvY2FsZSlcbiAgICAgICAgICAuZm9yRWFjaCgoaykgPT4gdGFnc1trXSA9ICdrdicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBleHByLmFyZ3MuZm9yRWFjaCgoYXJnKSA9PiBhcHBlbmRLbm93blRhZ3ModGFncywgYXJnLCBsb2NhbGVzKSk7XG4gICAgfVxuICAgIGJyZWFrO1xuICBjYXNlIFwic3RyaW5nXCI6XG4gIGNhc2UgXCJudW1iZXJcIjpcbiAgICBicmVhaztcbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBldmFsIHR5cGUgXCIgKyBKU09OLnN0cmluZ2lmeShleHByKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV2YWxFeHByOiBldmFsRXhwcixcbiAgYXBwZW5kS25vd25UYWdzOiBhcHBlbmRLbm93blRhZ3Ncbn07XG4iLCJjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgeyBsb2FkSW1hZ2UgfSA9IHJlcXVpcmUoJ2NhbnZhcycpXG5cbmZ1bmN0aW9uIEdhbGxlcnkob3B0aW9ucykge1xuICB0aGlzLmxvY2FsSW1hZ2VzRGlyZWN0b3J5ID0gb3B0aW9ucyAmJiBvcHRpb25zLmxvY2FsSW1hZ2VzRGlyZWN0b3J5O1xuICB0aGlzLmltYWdlcyA9IHt9O1xufVxuXG5HYWxsZXJ5LnByb3RvdHlwZS5wcmVsb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBjb25zdCB1cmlSZWdleHAgPSAvaHR0cHM/OlxcL1xcLy87XG5cbiAgLy9FeHRlcm5hbCBpbWFnZXNcbiAgdmFyIHByb21pc2VzID0gaW1hZ2VzLmZpbHRlcigoaW1hZ2UpID0+IGltYWdlLm1hdGNoKHVyaVJlZ2V4cCkpXG4gICAgICAubWFwKChpbWFnZSkgPT4gbG9hZEltYWdlKGltYWdlKS50aGVuKChkYXRhKSA9PiBzZWxmLmltYWdlc1tpbWFnZV0gPSBkYXRhKSk7XG5cbiAgaWYgKHRoaXMubG9jYWxJbWFnZXNEaXJlY3RvcnkpIHtcbiAgICBjb25zdCBsb2NhbFByb21pc2VzID0gaW1hZ2VzLmZpbHRlcigoaW1hZ2UpID0+ICFpbWFnZS5tYXRjaCh1cmlSZWdleHApKVxuICAgICAgLm1hcCgoaW1hZ2UpID0+IGxvYWRJbWFnZShwYXRoLmpvaW4oc2VsZi5sb2NhbEltYWdlc0RpcmVjdG9yeSwgaW1hZ2UpKS50aGVuKChkYXRhKSA9PiBzZWxmLmltYWdlc1tpbWFnZV0gPSBkYXRhKSk7XG4gICAgcHJvbWlzZXMgPSBwcm9taXNlcy5jb25jYXQobG9jYWxQcm9taXNlcyk7XG4gIH1cblxuICBwcm9taXNlcyA9IHByb21pc2VzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZSk7XG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuR2FsbGVyeS5wcm90b3R5cGUuZ2V0SW1hZ2UgPSBmdW5jdGlvbihpbWFnZSkge1xuICByZXR1cm4gdGhpcy5pbWFnZXNbaW1hZ2VdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbGxlcnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJ1bGVzID0gcmVxdWlyZShcIi4vcnVsZXNcIik7XG5jb25zdCBtYXBjc3MgPSByZXF1aXJlKFwibWFwY3NzXCIpO1xuXG4vKipcbiAqKiBAY29uc3RydWN0b3JcbiAqKiBAcGFyYW0ge3N0cmluZ30gY3NzIOKAlCBNYXBDU1Mgc3R5bGUgaW4gYSBwbGFpbiB0ZXh0XG4gKiogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg4oCUIHN0eWxlIG9wdGlvbnNcbiAqKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5jYWNoZTpPYmplY3Qg4oCUIGNhY2hlIGltcGxlbWVudGF0aW9uLiBJZiBub3Qgc3BlY2lmaWVkLCBjYWNoaW5nIHdpbGwgYmUgZGlzYWJsZWQuXG4gKiogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMubG9jYWxlczpBcnJheVtTdHJpbmddIGxpc3Qgb2Ygc3VwcG9ydGVkIGxvY2FsZXMgc29ydGVkIGJ5IG1vc3QgcHJlZmVyZWQgZmlyc3QuIElmIG5vdCBzcGVjaWZpZWQsIGxvY2FsaXphdGlvbiB3aWxsIGJlIGRpc2FibGVkXG4gKiovXG5mdW5jdGlvbiBNYXBDU1MoY3NzLCBvcHRpb25zPXt9KSB7XG4gIGlmICh0eXBlb2YoY3NzKSAhPT0gJ3N0cmluZycgKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidjc3MnIHBhcmFtZXRlciBpcyByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIGNvbnN0IGFzdCA9IG1hcGNzcy5wYXJzZShjc3MpO1xuXG4gIHRoaXMucnVsZXMgPSBhc3Q7XG5cbiAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gb3B0aW9ucy5jYWNoZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmxvY2FsZXMpIHtcbiAgICB0aGlzLmxvY2FsZXMgPSBvcHRpb25zLmxvY2FsZXM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5sb2NhbGVzID0gW107XG4gIH1cblxuICB0aGlzLmtub3duVGFncyA9IHJ1bGVzLmxpc3RLbm93blRhZ3MoYXN0LCB0aGlzLmxvY2FsZXMpO1xuICB0aGlzLmltYWdlcyA9IHJ1bGVzLmxpc3RLbm93bkltYWdlcyhhc3QpO1xufVxuXG5NYXBDU1MucHJvdG90eXBlLmxpc3RJbWFnZVJlZmVyZW5jZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xufVxuXG5NYXBDU1MucHJvdG90eXBlLmNyZWF0ZUNhY2hlS2V5ID0gZnVuY3Rpb24odGFncywgem9vbSwgZmVhdHVyZVR5cGUpIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIgayBpbiB0YWdzKSB7XG4gICAgLy9UZXN0IG9ubHkgdGFncywgbWVudGlvbmVkIGluIENTUyBzZWxlY3RvcnNcbiAgICBpZiAoayBpbiB0aGlzLmtub3duVGFncykge1xuICAgICAgaWYgKHRoaXMua25vd25UYWdzW2tdID09PSAna3YnKSB7XG4gICAgICAgIC8vVGFnIGtleSBhbmQgdmFsdWVzIGFyZSBjaGVja2VkIGluIE1hcENTU1xuICAgICAgICBrZXlzLnB1c2goayArIFwiPVwiICsgdGFnc1trXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL09ubHkgdGFnIHByZXNlbmNlIGlzIGNoZWNrZWQgaW4gTWFwQ1NTLCB3ZSBkb24ndCBuZWVkIHRvIHRha2UgdmFsdWUgaW4gYWNjb3VudFxuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFt6b29tLCBmZWF0dXJlVHlwZSwga2V5cy5qb2luKCc6JyldLmpvaW4oJzonKTtcbn1cblxuLyoqXG4gKiogQXBwbHkgTWFwQ1NTIHRvIGEgZmVhdHVyZSBhbmQgcmV0dXJuIHNldCBvZiBsYXllciBzdHlsZXNcbiAqKiBAcGFyYW0gdGFncyB7T2JqZWN0fSDigJQgbWFwcyBvZiB0aGUgZmVhdHVyZSBwcm9wZXJ0aWVzXG4gKiogQHBhcmFtIHpvb20ge2ludH0g4oCUIGN1cnJlbnQgem9vbSBsZXZlbFxuICoqIEBwYXJhbSBmZWF0dXJlVHlwZSB7U3RyaW5nfSDCreKAlCBGZWF0dXJlIGdlb21ldHJ5IHR5cGUgaW4gdGVybXMgb2YgR2VvSlNPTlxuICoqIEByZXR1cm5zIHtPYmplY3R9IOKAlCB7J2xheWVyJzogeydwcm9wZXJ0eSc6ICd2YWx1ZSd9fVxuICoqL1xuTWFwQ1NTLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uKHRhZ3MsIHpvb20sIGZlYXR1cmVUeXBlKSB7XG4gIHZhciBrZXk7XG5cbiAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICBrZXkgPSB0aGlzLmNyZWF0ZUNhY2hlS2V5KHRhZ3MsIHpvb20sIGZlYXR1cmVUeXBlKTtcblxuICAgIGlmICh0aGlzLmNhY2hlICYmIGtleSBpbiB0aGlzLmNhY2hlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNsYXNzZXMgPSBbXTtcbiAgY29uc3QgbGF5ZXJzID0gcnVsZXMuYXBwbHkodGhpcy5ydWxlcywgdGFncywgY2xhc3Nlcywgem9vbSwgZmVhdHVyZVR5cGUsIHRoaXMubG9jYWxlcyk7XG5cbiAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlW2tleV0gPSBsYXllcnM7XG4gIH1cbiAgcmV0dXJuIGxheWVycztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDU1M7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG1hdGNoU2VsZWN0b3Ioc2VsZWN0b3IsIHRhZ3MsIGNsYXNzZXMsIHpvb20sIGZlYXR1cmVUeXBlKSB7XG4gIGlmICghbWF0Y2hGZWF0dXJlVHlwZShzZWxlY3Rvci50eXBlLCBmZWF0dXJlVHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIW1hdGNoWm9vbShzZWxlY3Rvci56b29tLCB6b29tKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghbWF0Y2hBdHRyaWJ1dGVzKHNlbGVjdG9yLmF0dHJpYnV0ZXMsIHRhZ3MpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFtYXRjaENsYXNzZXMoc2VsZWN0b3IuY2xhc3NlcywgY2xhc3NlcykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuXG4vKipcbiAqKiBIYXMgc2lkZSBlZmZlY3RzIGZvciBwZXJmb3JtYW5jZSByZWFzb25zIChhcmd1bWFudCBpZiBtb2RpZmllZClcbiAqKiBrbm93blRhZ3M6e3RhZzogJ2snfCdrdid9XG4gKiogYXR0cmlidXRlczpbe3R5cGUsIGtleSwgdmFsdWV9XVxuICoqL1xuZnVuY3Rpb24gYXBwZW5kS25vd25UYWdzKGtub3duVGFncywgYXR0cmlidXRlcykge1xuICBpZiAoIWF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICBzd2l0Y2ggKGF0dHIudHlwZSkge1xuICAgIGNhc2UgJ3ByZXNlbmNlJzpcbiAgICBjYXNlICdhYnNlbmNlJzpcbiAgICAgIGlmIChrbm93blRhZ3NbYXR0ci5rZXldICE9ICdrdicpIHtcbiAgICAgICAga25vd25UYWdzW2F0dHIua2V5XSA9ICdrJztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NtcCc6XG4gICAgY2FzZSAncmVnZXhwJzpcbiAgICAgIC8vJ2t2JyBzaG91bGQgb3ZlcnJpZGUgJ2snXG4gICAgICBrbm93blRhZ3NbYXR0ci5rZXldID0gJ2t2JztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICoqIHJhbmdlOk9iamVjdCA9IHt0eXBlOiAneicsIGJlZ2luOiBpbnQsIGVuZDogaW50fVxuICoqIHpvb206aW50XG4gKiovXG5mdW5jdGlvbiBtYXRjaFpvb20ocmFuZ2UsIHpvb20pIHtcbiAgaWYgKCFyYW5nZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHJhbmdlLnR5cGUgIT09ICd6Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlpvb20gc2VsZWN0b3IgJ1wiICsgcmFuZ2UudHlwZSArIFwiJyBpcyBub3Qgc3VwcG9ydGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHpvb20gPj0gKHJhbmdlLmJlZ2luIHx8IDApICYmIHpvb20gPD0gKHJhbmdlLmVuZCB8fCA5MDAwKTtcbn1cblxuLyoqXG4gKiogQHBhcmFtIHNlbGVjdG9yVHlwZSB7c3RyaW5nfSDigJQgXCJub2RlXCIsIFwid2F5XCIsIFwicmVsYXRpb25cIiwgXCJsaW5lXCIsIFwiYXJlYVwiLCBcImNhbnZhc1wiLCBcIipcIlxuICoqIEBwYXJhbSBmZWF0dXJlVHlwZSB7c3RyaW5nfSDigJQgXCJQb2ludFwiLCBcIk11bHRpUG9pbnRcIiwgXCJQb2x5Z29uXCIsIFwiTXVsdGlQb2x5Z29uXCIsIFwiTGluZVN0cmluZ1wiLCBcIk11bHRpTGluZVN0cmluZ1wiXG4gKiovXG5mdW5jdGlvbiBtYXRjaEZlYXR1cmVUeXBlKHNlbGVjdG9yVHlwZSwgZmVhdHVyZVR5cGUpIHtcbiAgaWYgKHNlbGVjdG9yVHlwZSA9PT0gJyonKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzd2l0Y2ggKGZlYXR1cmVUeXBlKSB7XG4gIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgIHJldHVybiBzZWxlY3RvclR5cGUgPT09ICd3YXknIHx8IHNlbGVjdG9yVHlwZSA9PT0gJ2xpbmUnO1xuICBjYXNlICdQb2x5Z29uJzpcbiAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICByZXR1cm4gc2VsZWN0b3JUeXBlID09PSAnd2F5JyB8fCBzZWxlY3RvclR5cGUgPT09ICdhcmVhJztcbiAgY2FzZSAnUG9pbnQnOlxuICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICByZXR1cm4gc2VsZWN0b3JUeXBlID09PSAnbm9kZSc7XG4gIGRlZmF1bHQ6XG4gICAgLy9Ob3RlOiBDYW52YXMgYW5kIFJlbGF0aW9uIGFyZSB2aXJ0dWFsIGZlYXR1cmVzIGFuZCBjYW5ub3QgYmUgc3VwcG9ydGVkIGF0IHRoaXMgbGV2ZWxcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmVhdHVyZSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQ6IFwiICsgZmVhdHVyZVR5cGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hdGNoQXR0cmlidXRlcyhhdHRyaWJ1dGVzLCB0YWdzKSB7XG4gIGlmICghYXR0cmlidXRlcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFtYXRjaEF0dHJpYnV0ZShhdHRyaWJ1dGVzW2ldLCB0YWdzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqKiBDbGFzc2VzIGFyZSBjb25jYXRlbmF0ZWQgYnkgQU5EIHN0YXRlbWVudFxuICoqIHNlbGVjdG9yQ2xhc3Nlczpbe2NsYXNzOlN0cmluZywgbm90OkJvb2xlYW59XVxuICoqIGNsYXNzZXM6W1N0cmluZ11cbiAqKi9cbmZ1bmN0aW9uIG1hdGNoQ2xhc3NlcyhzZWxlY3RvckNsYXNzZXMsIGNsYXNzZXMpIHtcbiAgaWYgKCFzZWxlY3RvckNsYXNzZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0b3JDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2VsQ2xhc3MgPSBzZWxlY3RvckNsYXNzZXNbaV07XG4gICAgaWYgKCFtYXRjaENsYXNzKHNlbENsYXNzLCBjbGFzc2VzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBtYXRjaENsYXNzKHNlbGVjdG9yQ2xhc3MsIGNsYXNzZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2xzID0gY2xhc3Nlc1tpXTtcbiAgICBpZiAoc2VsZWN0b3JDbGFzcy5jbGFzcyA9PSBjbHMpIHtcbiAgICAgIHJldHVybiAhc2VsZWN0b3JDbGFzcy5ub3Q7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiogb3A6U3RyaW5nIOKAlCBvbmUgb2YgXCI9XCIsIFwiIT1cIiwgXCI8XCIsIFwiPD1cIiwgXCI+XCIsIFwiPj1cIlxuICoqIGV4cGVjdDpTdHJpbmcg4oCUIGV4cGVjdGVkIHZhbHVlXG4gKiogdmFsdWU6U3RyaW5nIOKAlCBhY3R1YWwgdmFsdWVcbiAqKi9cbmZ1bmN0aW9uIGNvbXBhcmUob3AsIGV4cGVjdCwgdmFsdWUpIHtcbiAgLy8gcGFyc2VGbG9hdCByZXR1cm5zIE5hTiBpZiBmYWlsZWQsIGFuZCBOYU4gY29tcGFyZWQgdG8gYW55dGhpbmcgaXMgZmFsc2UsIHNvXG4gIC8vIG5vIGFkZGl0aW9uYWwgdHlwZSBjaGVja3MgYXJlIHJlcXVpcmVkXG4gIGNvbnN0IHZhbCA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICBjb25zdCBleHAgPSBwYXJzZUZsb2F0KGV4cGVjdCk7XG5cbiAgc3dpdGNoIChvcCkge1xuICBjYXNlICc9JzpcbiAgICByZXR1cm4gaXNOYU4odmFsKSB8fCBpc05hTihleHApID8gZXhwZWN0ID09IHZhbHVlIDogdmFsID09IGV4cDtcbiAgY2FzZSAnIT0nOlxuICAgIHJldHVybiBpc05hTih2YWwpIHx8IGlzTmFOKGV4cCkgPyBleHBlY3QgIT0gdmFsdWUgOiB2YWwgIT0gZXhwO1xuICBjYXNlICc8JzpcbiAgICByZXR1cm4gdmFsIDwgZXhwO1xuICBjYXNlICc8PSc6XG4gICAgcmV0dXJuIHZhbCA8PSBleHA7XG4gIGNhc2UgJz4nOlxuICAgIHJldHVybiB2YWwgPiBleHA7XG4gIGNhc2UgJz49JzpcbiAgICByZXR1cm4gdmFsID49IGV4cDtcbiAgZGVmYXVsdDpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuXG4vKipcbiAqKiByZWdleHA6U3RyaW5nIOKAlCByZWd1bGFyIGV4cHJlc3Npb25cbiAqKiBmbGFnczpTdHJpbmcg4oCUIHJlZ3VsYXIgZXhwcmVzc2lvbiBmbGFnc1xuICoqIHZhbHVlOlN0cmluZyDigJQgYWN0dWFsIHZhbHVlXG4gKiovXG5mdW5jdGlvbiByZWdleHAocmVnZXhwLCBmbGFncywgdmFsdWUpIHtcbiAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKHJlZ2V4cCwgZmxhZ3MpO1xuICByZXR1cm4gcmUudGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuICoqIE1hdGNoIHRhZ3MgYWdhaW5zdCBzaW5nbGUgYXR0cmlidXRlIHNlbGVjdG9yXG4gKiogYXR0cjp7dHlwZTpTdHJpbmcsIGtleTpTdHJpbmcsIHZhbHVlOlN0cmluZ31cbiAqKiB0YWdzOnsqOiAqfVxuICoqL1xuZnVuY3Rpb24gbWF0Y2hBdHRyaWJ1dGUoYXR0ciwgdGFncykge1xuICBzd2l0Y2ggKGF0dHIudHlwZSkge1xuICBjYXNlICdwcmVzZW5jZSc6XG4gICAgcmV0dXJuIGF0dHIua2V5IGluIHRhZ3M7XG4gIGNhc2UgJ2Fic2VuY2UnOlxuICAgIHJldHVybiAhKGF0dHIua2V5IGluIHRhZ3MpO1xuICBjYXNlICdjbXAnOlxuICAgIHJldHVybiBhdHRyLmtleSBpbiB0YWdzICYmIGNvbXBhcmUoYXR0ci5vcCwgYXR0ci52YWx1ZSwgdGFnc1thdHRyLmtleV0pO1xuICBjYXNlICdyZWdleHAnOlxuICAgIHJldHVybiBhdHRyLmtleSBpbiB0YWdzICYmIHJlZ2V4cChhdHRyLnZhbHVlLnJlZ2V4cCwgYXR0ci52YWx1ZS5mbGFncywgdGFnc1thdHRyLmtleV0pO1xuICBkZWZhdWx0OlxuICAgIHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQ6IFwiICsgYXR0ci50eXBlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWF0Y2hab29tOiBtYXRjaFpvb20sXG4gIG1hdGNoRmVhdHVyZVR5cGU6IG1hdGNoRmVhdHVyZVR5cGUsXG4gIG1hdGNoQXR0cmlidXRlczogbWF0Y2hBdHRyaWJ1dGVzLFxuICBtYXRjaEF0dHJpYnV0ZTogbWF0Y2hBdHRyaWJ1dGUsXG4gIG1hdGNoQ2xhc3NlczogbWF0Y2hDbGFzc2VzLFxuICBtYXRjaFNlbGVjdG9yOiBtYXRjaFNlbGVjdG9yLFxuICBhcHBlbmRLbm93blRhZ3M6IGFwcGVuZEtub3duVGFnc1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtYXRjaGVycyA9IHJlcXVpcmUoXCIuL21hdGNoZXJzXCIpO1xuY29uc3QgZXZhbFByb2Nlc3NvciA9IHJlcXVpcmUoXCIuL2V2YWxcIik7XG5cbi8qKlxuICoqIEV4dHJhY3QgYWxsIHRhZ3MsIHJlZmVyZW5jZWQgaW4gTWFwQ1NTIHJ1bGVzLlxuICoqXG4gKiogQHBhcmFtIHJ1bGVzIHthcnJheX0g4oCUIGxpc3Qgb2YgTWFwQ1NTIHJ1bGVzIGZyb20gQVNUXG4gKiogQHBhcmFtIGxvY2FsZXMge2FycmF5fSDigJQgbGlzdCBvZiBzdXBwb3J0ZWQgbG9jYWxlc1xuICoqIEByZXR1cm4ge09iamVjdH0gwq10YWdzIOKAlCBtYXAgb2YgdGFnc1xuICoqICAga2V5IOKAlCB0YWcgbmFtZVxuICoqICAgdmFsdWUg4oCUICdrJyBpZiB0YWcgdmFsdWUgaXMgbm90IHVzZWRcbiAqKiAgICAgICAgICAgJ2t2JyBpZiB0YWcgdmFsdWUgaXMgdXNlZFxuICoqL1xuZnVuY3Rpb24gbGlzdEtub3duVGFncyhydWxlcywgbG9jYWxlcz1bXSkge1xuICBjb25zdCB0YWdzID0ge307XG4gIHJ1bGVzLmZvckVhY2goKHJ1bGUpID0+IHtcbiAgICBydWxlLnNlbGVjdG9ycy5mb3JFYWNoKChzZWxlY3RvcikgPT4ge1xuICAgICAgbWF0Y2hlcnMuYXBwZW5kS25vd25UYWdzKHRhZ3MsIHNlbGVjdG9yLmF0dHJpYnV0ZXMpO1xuICAgIH0pO1xuXG4gICAgcnVsZS5hY3Rpb25zLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhY3Rpb24udjtcblxuICAgICAgaWYgKGFjdGlvbi5hY3Rpb24gPT09ICdrdicgJiYgYWN0aW9uLmsgPT09ICd0ZXh0Jykge1xuICAgICAgICBpZiAodmFsdWUudHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIC8vU3VwcG9ydCAndGV4dDogXCJ0YWduYW1lXCI7JyBzeW50YXggc3VnYXIgc3RhdGVtZW50XG4gICAgICAgICAgdGFnc1t2YWx1ZS52XSA9ICdrdic7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJldmFsXCIpIHtcbiAgICAgICAgICAvL1N1cHBvcnQgdGFnKCkgZnVuY3Rpb24gaW4gZXZhbFxuICAgICAgICAgIGV2YWxQcm9jZXNzb3IuYXBwZW5kS25vd25UYWdzKHRhZ3MsIHZhbHVlLnYsIGxvY2FsZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB0YWdzO1xufVxuXG4vKipcbiAqKiBFeHRyYWN0IGFsbCBpbWFnZXMsIHJlZmVyZW5jZWQgaW4gTWFwQ1NTIHJ1bGVzLlxuICoqIEBwYXJhbSBydWxlcyB7YXJyYXl9IOKAlCBsaXN0IG9mIE1hcENTUyBydWxlcyBmcm9tIEFTVFxuICoqIEByZXR1cm4ge2FycmF5fSDigJQgdW5pcXVlIGxpc3Qgb2YgaW1hZ2VzXG4gKiovXG5mdW5jdGlvbiBsaXN0S25vd25JbWFnZXMocnVsZXMpIHtcbiAgY29uc3QgaW1hZ2VzID0ge307XG5cbiAgY29uc3QgaW1hZ2VBY3Rpb25zID0gWydpbWFnZScsICdzaGllbGQtaW1hZ2UnLCAnaWNvbi1pbWFnZScsICdmaWxsLWltYWdlJ107XG5cbiAgcnVsZXMuZm9yRWFjaCgocnVsZSkgPT4ge1xuICAgIHJ1bGUuYWN0aW9ucy5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYWN0aW9uLnY7XG5cbiAgICAgIGlmIChhY3Rpb24uYWN0aW9uID09PSAna3YnICYmIGltYWdlQWN0aW9ucy5pbmNsdWRlcyhhY3Rpb24uaykpIHtcbiAgICAgICAgaWYgKHZhbHVlLnR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBpbWFnZXNbdmFsdWUudi50cmltKCldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMoaW1hZ2VzKTtcbn1cblxuLyoqXG4gKiogQXBwbHkgTWFwQ1NTIHN0eWxlIHRvIGEgc3BlY2lmaWVkIGZlYXR1cmUgaW4gc3BlY2lmaWVkIGNvbnRleHRcbiAqKiBAcGFyYW0gcnVsZXMge2FycmF5fSDigJQgbGlzdCBvZiBNYXBDU1MgcnVsZXMgZnJvbSBBU1RcbiAqKiBAcGFyYW0gdGFncyB7T2JqZWN0fSDigJQga2V5LXZhbHVlIG1hcCBvZiBmZWF0dXJlIHByb3BlcnRpZXNcbiAqKiBAcGFyYW0gY2xhc3NlcyB7YXJyYXl9IOKAlCBsaXN0IG9mIGZlYXR1cmUgY2xhc3Nlc1xuICoqIEBwYXJhbSB6b29tIHtpbnR9IOKAlCB6b29tIGxldmVsIGluIHRlcm1zIG9mIHRpbGluZyBzY2hlbWVcbiAqKiBAcGFyYW0gZmVhdHVyZVR5cGUge3N0cmluZ30g4oCUIGZlYXR1cmUgdHlwZSBpbiB0ZXJtcyBvZiBHZW9KU09OIGZlYXR1cmVzXG4gKiogQHBhcmFtIGxvY2FsZXMge2FycmF5fSDigJQgbGlzdCBvZiBzdXBwb3J0ZWQgbG9jYWxlcyBpbiBwcmVmZXJlZCBvcmRlclxuICoqIEByZXR1cm5zIHtPYmplY3R9IOKAlCBtYXAgb2YgbGF5ZXJzIGZvciByZW5kZXJpbmdcbiAqKlxuICoqIE5COiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgZm9yIGVhY2ggcmVuZGVyZWQgZmVhdHVyZSwgc28gaXQgbXVzdCBiZVxuICoqIGFzIHBlcmZvcm1hbmNlIG9wdGltaXplZCBhcyBwb3NzaWJsZS5cbiAqKi9cbmZ1bmN0aW9uIGFwcGx5KHJ1bGVzLCB0YWdzLCBjbGFzc2VzLCB6b29tLCBmZWF0dXJlVHlwZSwgbG9jYWxlcykge1xuICBjb25zdCBsYXllcnMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcnVsZSA9IHJ1bGVzW2ldO1xuXG4gICAgY29uc3QgcnVsZUxheWVycyA9IGFwcGx5UnVsZShydWxlLCB0YWdzLCBjbGFzc2VzLCB6b29tLCBmZWF0dXJlVHlwZSwgbG9jYWxlcyk7XG4gICAgdmFyIGV4aXQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBsYXllciBpbiBydWxlTGF5ZXJzKSB7XG4gICAgICBsYXllcnNbbGF5ZXJdID0gbGF5ZXJzW2xheWVyXSB8fCB7fTtcbiAgICAgIGlmICgnZXhpdCcgaW4gcnVsZUxheWVyc1tsYXllcl0pIHtcbiAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgIGRlbGV0ZSBydWxlTGF5ZXJzW2xheWVyXVsnZXhpdCddO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbihsYXllcnNbbGF5ZXJdLCBydWxlTGF5ZXJzW2xheWVyXSk7XG4gICAgfVxuXG4gICAgaWYgKGV4aXQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsYXllcnM7XG59XG5cbi8qKlxuICoqIHJldHVybiB7bGF5ZXIsIHtwcm9wLCB2YWx1ZX19O1xuICoqL1xuZnVuY3Rpb24gYXBwbHlSdWxlKHJ1bGUsIHRhZ3MsIGNsYXNzZXMsIHpvb20sIGZlYXR1cmVUeXBlLCBsb2NhbGVzKSB7XG4gIGNvbnN0IHNlbGVjdG9ycyA9IHJ1bGUuc2VsZWN0b3JzO1xuICBjb25zdCBhY3Rpb25zID0gcnVsZS5hY3Rpb25zO1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzW2ldO1xuICAgIGlmIChtYXRjaGVycy5tYXRjaFNlbGVjdG9yKHNlbGVjdG9yLCB0YWdzLCBjbGFzc2VzLCB6b29tLCBmZWF0dXJlVHlwZSkpIHtcbiAgICAgIGNvbnN0IGxheWVyID0gc2VsZWN0b3IubGF5ZXIgfHwgJ2RlZmF1bHQnO1xuICAgICAgY29uc3QgcHJvcGVydGllcyA9IHJlc3VsdFtsYXllcl0gfHwge31cbiAgICAgIGNvbnN0IHByb3BzID0gdW53aW5kQWN0aW9ucyhhY3Rpb25zLCB0YWdzLCBwcm9wZXJ0aWVzLCBsb2NhbGVzLCBjbGFzc2VzKTtcblxuICAgICAgcmVzdWx0W2xheWVyXSA9IE9iamVjdC5hc3NpZ24ocHJvcGVydGllcywgcHJvcHMpO1xuICAgICAgLy9yZXN1bHRbbGF5ZXJdID0gcHJvcGVydGllcztcblxuICAgICAgaWYgKCdleGl0JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVud2luZEFjdGlvbnMoYWN0aW9ucywgdGFncywgcHJvcGVydGllcywgbG9jYWxlcywgY2xhc3Nlcykge1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zW2ldO1xuXG4gICAgc3dpdGNoIChhY3Rpb24uYWN0aW9uKSB7XG4gICAgY2FzZSAna3YnOlxuICAgICAgLy9UT0RPOiBzZXQgcHJvcGVyIHZhbHVlIHR5cGUgYW5kIHBvcG9nYXRlIGRlZmF1bHQgdmFsdWVzXG4gICAgICBpZiAoYWN0aW9uLmsgPT09ICd0ZXh0Jykge1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIGlmIChhY3Rpb24udi50eXBlID09PSAnc3RyaW5nJyAmJiBhY3Rpb24udi52IGluIHRhZ3MpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRhZ3NbYWN0aW9uLnYudl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB1bndpbmRWYWx1ZShhY3Rpb24udiwgdGFncywgcHJvcGVydGllcywgbG9jYWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXN1bHRbYWN0aW9uLmtdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdW53aW5kVmFsdWUoYWN0aW9uLnYsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMpO1xuICAgICAgICBpZiAodHlwZW9mKHZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRbYWN0aW9uLmtdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NldF9jbGFzcyc6XG4gICAgICBpZiAoIWNsYXNzZXMuaW5jbHVkZXMoYWN0aW9uLnYuY2xhc3MpKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChhY3Rpb24udi5jbGFzcyk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzZXRfdGFnJzpcbiAgICAgIHRhZ3NbYWN0aW9uLmtdID0gdW53aW5kVmFsdWUoYWN0aW9uLnYsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZXhpdCc6XG4gICAgICByZXN1bHRbJ2V4aXQnXSA9IHRydWU7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQWN0aW9uIHR5cGUgaXMgbm90IHN1cHByb3RlZDogXCIgKyBKU09OLnN0cmluZ2lmeShhY3Rpb24pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdW53aW5kVmFsdWUodmFsdWUsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMpIHtcbiAgc3dpdGNoICh2YWx1ZS50eXBlKSB7XG4gIGNhc2UgJ3N0cmluZyc6XG4gICAgcmV0dXJuIHZhbHVlLnY7XG4gIGNhc2UgJ2Nzc2NvbG9yJzpcbiAgICByZXR1cm4gZm9ybWF0Q3NzQ29sb3IodmFsdWUudik7XG4gIGNhc2UgJ2V2YWwnOlxuICAgIHJldHVybiBldmFsUHJvY2Vzc29yLmV2YWxFeHByKHZhbHVlLnYsIHRhZ3MsIHByb3BlcnRpZXMsIGxvY2FsZXMpO1xuICBkZWZhdWx0OlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJWYWx1ZSB0eXBlIGlzIG5vdCBzdXBwcm90ZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRDc3NDb2xvcihjb2xvcikge1xuICBpZiAoJ3InIGluIGNvbG9yICYmICdnJyBpbiBjb2xvciAmJiAnYicgaW4gY29sb3IgJiYgJ2EnIGluIGNvbG9yKSB7XG4gICAgcmV0dXJuIFwicmdiYShcIiArIGNvbG9yLnIgKyBcIiwgXCIgKyBjb2xvci5nICsgXCIsIFwiICsgY29sb3IuYiArIFwiLCBcIiArIGNvbG9yLmEgKyBcIilcIjtcbiAgfSBlbHNlIGlmICgncicgaW4gY29sb3IgJiYgJ2cnIGluIGNvbG9yICYmICdiJyBpbiBjb2xvcikge1xuICAgIHJldHVybiBcInJnYihcIiArIGNvbG9yLnIgKyBcIiwgXCIgKyBjb2xvci5nICsgXCIsIFwiICsgY29sb3IuYiArIFwiKVwiO1xuICB9IGVsc2UgaWYgKCdoJyBpbiBjb2xvciAmJiAncycgaW4gY29sb3IgJiYgJ2wnIGluIGNvbG9yICYmICdhJyBpbiBjb2xvcikge1xuICAgIHJldHVybiBcImhzbGEoXCIgKyBjb2xvci5oICsgXCIsIFwiICsgY29sb3IucyArIFwiLCBcIiArIGNvbG9yLmwgKyBcIiwgXCIgKyBjb2xvci5hICsgXCIpXCI7XG4gIH0gZWxzZSBpZiAoJ2gnIGluIGNvbG9yICYmICdzJyBpbiBjb2xvciAmJiAnbCcgaW4gY29sb3IpIHtcbiAgICByZXR1cm4gXCJoc2woXCIgKyBjb2xvci5oICsgXCIsIFwiICsgY29sb3IucyArIFwiLCBcIiArIGNvbG9yLmwgKyBcIilcIjtcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGNvbG9yIHNwYWNlIFwiICsgSlNPTi5zdHJpbmdpZnkoY29sb3IpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxpc3RLbm93blRhZ3M6IGxpc3RLbm93blRhZ3MsXG4gIGxpc3RLbm93bkltYWdlczogbGlzdEtub3duSW1hZ2VzLFxuICBhcHBseTogYXBwbHksXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN1cHBvcnRzID0gcmVxdWlyZShcIi4vc3VwcG9ydHNcIik7XG5cbi8qKlxuICoqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gKiogQHBhcmFtIG9wdGlvbnMuZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucyB7Ym9vbGVhbn0gc29ydCBmZWF0dXJlcyBieSBwZXJmb3JtZWQgYWN0aW9ucy5cbiAqKiAgICAgVGhpcyBvcHRpbWl6YXRpb24gc2lnbmlmaWNhdGVseSBpbXByb3ZlcyBwZXJmb3JtYW5jZSBpbiBDaHJvbWUgY2FudmFzIGltcGxlbWVudGF0aW9uLCBidXQgc2xvd3MgZG93biBub2RlLWNhbnZhc1xuICoqL1xuZnVuY3Rpb24gU3R5bGVNYW5hZ2VyKG1hcGNzcywgb3B0aW9ucykge1xuICB0aGlzLm1hcGNzcyA9IG1hcGNzcztcblxuICB0aGlzLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMgPSAob3B0aW9ucyAmJiBvcHRpb25zLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMpIHx8IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjaGVja0FjdGlvbnMoYWN0aW9ucywgcmVxdWlyZWRBY3Rpb25zKSB7XG4gIGZvciAodmFyIGsgaW4gYWN0aW9ucykge1xuICAgIGlmIChyZXF1aXJlZEFjdGlvbnMuaW5jbHVkZXMoaykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy9UT0RPIEV4dHJhY3QgdG8gc3VwcG9ydHMuanNcbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlcnMoZmVhdHVyZVR5cGUsIGFjdGlvbnMpIHtcbiAgY29uc3QgcmVuZGVycyA9IHt9O1xuXG4gIHN1cHBvcnRzLmZvckVhY2goKHJlbmRlclNwZWMpID0+IHtcbiAgICBpZiAoIXJlbmRlclNwZWMuZmVhdHVyZVR5cGVzLmluY2x1ZGVzKGZlYXR1cmVUeXBlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghY2hlY2tBY3Rpb25zKGFjdGlvbnMsIHJlbmRlclNwZWMucmVxdWlyZWRBY3Rpb25zKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlckFjdGlvbnMgPSB7XG4gICAgICAnbWFqb3Itei1pbmRleCc6IHJlbmRlclNwZWMucHJpb3JpdHlcbiAgICB9O1xuXG4gICAgcmVuZGVyU3BlYy5hY3Rpb25zLmZvckVhY2goKHNwZWMpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZXh0cmFjdEFjdGlvblZhbHVlKHNwZWMsIGFjdGlvbnMpO1xuICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgcmVuZGVyQWN0aW9uc1tzcGVjLmFjdGlvbl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlbmRlcnNbcmVuZGVyU3BlYy5uYW1lXSA9IHJlbmRlckFjdGlvbnM7XG4gIH0pO1xuXG4gIHJldHVybiByZW5kZXJzO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0QWN0aW9uVmFsdWUoc3BlYywgYWN0aW9ucykge1xuICAvL1RPRE86IE92ZXJyaWRlIHZhbHVlcyBieSBwcmlvcml0eS4gZS5nLiBmaWxsLW9wYWNpdHkgPC0gb3BhY2l0eSA8LSBkZWZhdWx0XG4gIGlmICghKHNwZWMuYWN0aW9uIGluIGFjdGlvbnMpKSB7XG4gICAgcmV0dXJuIHR5cGVvZihzcGVjLmRlZmF1bHQpICE9PSAndW5kZWZpbmVkJyA/IHNwZWMuZGVmYXVsdCA6IG51bGw7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBhY3Rpb25zW3NwZWMuYWN0aW9uXTtcbiAgc3dpdGNoIChzcGVjLnR5cGUpIHtcbiAgY2FzZSAnbnVtYmVyJzpcbiAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIGJyZWFrO1xuICBjYXNlICdib29sZWFuJzpcbiAgICB2YWx1ZSA9IHZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogISF2YWx1ZTtcbiAgICBicmVhaztcbiAgY2FzZSAnc3RyaW5nJzpcbiAgICB2YWx1ZSA9IHZhbHVlID09PSAnJyA/IG51bGwgOiB2YWx1ZTtcbiAgICBicmVhaztcbiAgY2FzZSAnY29sb3InOlxuICBjYXNlICd1cmknOlxuICBkZWZhdWx0OlxuICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBbdmFsdWUsIHNwZWMuZGVmYXVsdF0uZmluZCgoeCkgPT4geCAhPT0gbnVsbCAmJiB0eXBlb2YoeCkgIT09ICd1bmRlZmluZWQnKTtcbn1cblxuXG5cblN0eWxlTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlRmVhdHVyZVJlbmRlcnMgPSBmdW5jdGlvbihmZWF0dXJlLCBrb3RoaWNJZCwgem9vbSkge1xuICBjb25zdCBmZWF0dXJlQWN0aW9ucyA9IHRoaXMubWFwY3NzLmFwcGx5KGZlYXR1cmUucHJvcGVydGllcywgem9vbSwgZmVhdHVyZS5nZW9tZXRyeS50eXBlKTtcblxuICBjb25zdCBsYXllcnMgPSB7fTtcblxuICBmb3IgKHZhciBsYXllck5hbWUgaW4gZmVhdHVyZUFjdGlvbnMpIHtcbiAgICBjb25zdCByZW5kZXJzID0gY3JlYXRlUmVuZGVycyhmZWF0dXJlLmdlb21ldHJ5LnR5cGUsIGZlYXR1cmVBY3Rpb25zW2xheWVyTmFtZV0pO1xuICAgIGZvciAodmFyIHJlbmRlciBpbiByZW5kZXJzKSB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gcmVuZGVyc1tyZW5kZXJdO1xuICAgICAgY29uc3QgekluZGV4ID0gcGFyc2VJbnQoYWN0aW9uc1snei1pbmRleCddKSB8fCAwO1xuICAgICAgY29uc3QgbWFqb3JaSW5kZXggPSBwYXJzZUludChhY3Rpb25zWydtYWpvci16LWluZGV4J10pO1xuICAgICAgZGVsZXRlIGFjdGlvbnNbJ3otaW5kZXgnXTtcbiAgICAgIGRlbGV0ZSBhY3Rpb25zWydtYWpvci16LWluZGV4J107XG5cbiAgICAgIGNvbnN0IHJlc3R5bGVkRmVhdHVyZSA9IHtcbiAgICAgICAga290aGljSWQ6IGtvdGhpY0lkLFxuICAgICAgICBnZW9tZXRyeTogZmVhdHVyZS5nZW9tZXRyeSxcbiAgICAgICAgYWN0aW9uczogYWN0aW9ucyxcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmdyb3VwRmVhdHVyZXNCeUFjdGlvbnMpIHtcbiAgICAgICAgcmVzdHlsZWRGZWF0dXJlWydrZXknXSA9IEpTT04uc3RyaW5naWZ5KGFjdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsYXllciA9IFt6SW5kZXgsIG1ham9yWkluZGV4LCBsYXllck5hbWUsIHJlbmRlcl0uam9pbignLCcpO1xuXG4gICAgICBsYXllcnNbbGF5ZXJdID0gcmVzdHlsZWRGZWF0dXJlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGF5ZXJzO1xufVxuLyoqXG4gKiogQHBhcmFtIGEge2FycmF5fSBbekluZGV4LCBtYWpvclpJbmRleCwgbGF5ZXJOYW1lLCByZW5kZXJdXG4gKiogQHJldHVybiA8MCDigJQgcHJlZmVyIGFcbiAqKiBAcmV0dXJuID4wIOKAlCBwcmVmZXIgYlxuICoqL1xuZnVuY3Rpb24gY29tcGFyZUxheWVycyhhLCBiKSB7XG4gIGNvbnN0IGxheWVyTmFtZUEgPSBhWzJdO1xuICBjb25zdCBsYXllck5hbWVCID0gYlsyXTtcblxuICBjb25zdCB6SW5kZXhBID0gcGFyc2VJbnQoYVswXSk7XG4gIGNvbnN0IHpJbmRleEIgPSBwYXJzZUludChiWzBdKTtcblxuICBjb25zdCBtYWpvclpJbmRleEEgPSBwYXJzZUludChhWzFdKTtcbiAgY29uc3QgbWFqb3JaSW5kZXhCID0gcGFyc2VJbnQoYlsxXSk7XG4gIGlmIChsYXllck5hbWVBID09IGxheWVyTmFtZUIpIHtcbiAgICBpZiAobWFqb3JaSW5kZXhBICE9IG1ham9yWkluZGV4Qikge1xuICAgICAgcmV0dXJuIG1ham9yWkluZGV4QSAtIG1ham9yWkluZGV4QjtcbiAgICB9XG5cbiAgICBpZiAoekluZGV4QSAhPSB6SW5kZXhCKSB7XG4gICAgICByZXR1cm4gekluZGV4QSAtIHpJbmRleEI7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGxheWVyczogXCIgKyBKU09OLnN0cmluZ2lmeShhKSArIFwiIGFuZCBcIiArIEpTT04uc3RyaW5naWZ5KGIpKTtcbiAgfSBlbHNlIGlmIChsYXllck5hbWVBID09ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChsYXllck5hbWVCID09ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIGlmICh6SW5kZXhBICE9IHpJbmRleEIpIHtcbiAgICAgIHJldHVybiB6SW5kZXhBIC0gekluZGV4QjtcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJOYW1lQS5sb2NhbGVDb21wYXJlKGxheWVyTmFtZUIpO1xuICB9XG59XG4vKipcbiAqKlxuICoqXG4gKiogQHJldHVybiB7YXJyYXl9IFt7cmVuZGVyOiAnY2FzaW5nJywgekluZGV4OiAwLCBmZWF0dXJlczogW119LCB7cmVuZGVyOiAnbGluZScsIGZlYXR1cmVzOiBbXX0sIHtyZW5kZXI6ICdsaW5lJywgZmVhdHVyZXM6IFtdfV1cbiAqKlxuICoqL1xuU3R5bGVNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVMYXllcnMgPSBmdW5jdGlvbihmZWF0dXJlcywgem9vbSkge1xuICBjb25zdCBsYXllcnMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmVuZGVycyA9IHRoaXMuY3JlYXRlRmVhdHVyZVJlbmRlcnMoZmVhdHVyZXNbaV0sIGkgKyAxLCB6b29tKTtcblxuICAgIGZvciAodmFyIGtleSBpbiByZW5kZXJzKSB7XG4gICAgICBsYXllcnNba2V5XSA9IGxheWVyc1trZXldIHx8IFtdO1xuXG4gICAgICBsYXllcnNba2V5XS5wdXNoKHJlbmRlcnNba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGxheWVyS2V5cyA9IE9iamVjdC5rZXlzKGxheWVycykgICAvLyBbXCIwLGNhc2luZ3NcIiwgXCIxLGxpbmVzXCJdXG4gICAgLm1hcCgoaykgPT4gay5zcGxpdChcIixcIikpICAgICAgICAgICAgIC8vIFtbXCIwXCIsIFwiY2FzaW5nc1wiXSwgW1wiMVwiLCBcImxpbmVzXCJdXVxuICAgIC5zb3J0KGNvbXBhcmVMYXllcnMpXG4gICAgLmZvckVhY2goKFt6SW5kZXgsIG1ham9yWkluZGV4LCBsYXllck5hbWUsIHJlbmRlcl0pID0+IHtcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gbGF5ZXJzW1t6SW5kZXgsIG1ham9yWkluZGV4LCBsYXllck5hbWUsIHJlbmRlcl0uam9pbignLCcpXTtcblxuICAgICAgaWYgKHRoaXMuZ3JvdXBGZWF0dXJlc0J5QWN0aW9ucykge1xuICAgICAgICBmZWF0dXJlcy5zb3J0KChhLCBiKSA9PiBhLmtleS5sb2NhbGVDb21wYXJlKGIua2V5KSk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHpJbmRleDogcGFyc2VJbnQoekluZGV4KSxcbiAgICAgICAgbWFqb3JaSW5kZXg6IHBhcnNlSW50KG1ham9yWkluZGV4KSxcbiAgICAgICAgb2JqZWN0WkluZGV4OiBsYXllck5hbWUsXG4gICAgICAgIGZlYXR1cmVzOiBmZWF0dXJlc1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdHlsZU1hbmFnZXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAge1xuICAgIFwibmFtZVwiOiBcInBvbHlnb25cIixcbiAgICBcImZlYXR1cmVUeXBlc1wiOiBbXCJQb2x5Z29uXCIsIFwiTXVsdGlQb2x5Z29uXCJdLFxuICAgIFwicmVxdWlyZWRBY3Rpb25zXCI6IFtcImZpbGwtY29sb3JcIiwgXCJmaWxsLWltYWdlXCJdLFxuICAgIFwiYWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiei1pbmRleFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJmaWxsLWNvbG9yXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcInJnYigwLCAwLCAwKVwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiZmlsbC1pbWFnZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJ1cmlcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImZpbGwtb3BhY2l0eVwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDFcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcInByaW9yaXR5XCI6IDEwXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJjYXNpbmdcIixcbiAgICBcImZlYXR1cmVUeXBlc1wiOiBbXCJMaW5lU3RyaW5nXCIsIFwiTXVsdGlMaW5lU3RyaW5nXCIsIFwiUG9seWdvblwiLCBcIk11bHRpUG9seWdvblwiXSxcbiAgICBcInJlcXVpcmVkQWN0aW9uc1wiOiBbXCJjYXNpbmctd2lkdGhcIl0sXG4gICAgXCJhY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ6LWluZGV4XCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImNhc2luZy13aWR0aFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMSxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ3aWR0aFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJjYXNpbmctY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwicmdiKDAsIDAsIDApXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImNvbG9yXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJjYXNpbmctZGFzaGVzXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiY2FzaW5nLW9wYWNpdHlcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDEsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiY2FzaW5nLWxpbmVjYXBcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiYnV0dFwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImNhc2luZy1saW5lam9pblwiLFxuICAgICAgICBcImRlZmF1bHRcIjogXCJyb3VuZFwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImxpbmVjYXBcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiYnV0dFwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImxpbmVqb2luXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcInJvdW5kXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LFxuXG4gICAgXSxcbiAgICBcInByaW9yaXR5XCI6IDIwXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJsaW5lXCIsXG4gICAgXCJmZWF0dXJlVHlwZXNcIjogW1wiTGluZVN0cmluZ1wiLCBcIk11bHRpTGluZVN0cmluZ1wiLCBcIlBvbHlnb25cIiwgXCJNdWx0aVBvbHlnb25cIl0sXG4gICAgXCJyZXF1aXJlZEFjdGlvbnNcIjogW1wid2lkdGhcIiwgXCJpbWFnZVwiXSxcbiAgICBcImFjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImFjdGlvblwiOiBcInotaW5kZXhcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwid2lkdGhcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJpbWFnZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJ1cmlcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImNvbG9yXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImNvbG9yXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcInJnYigwLCAwLCAwKVwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiZGFzaGVzXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwib3BhY2l0eVwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDFcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJsaW5lY2FwXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwibGluZWpvaW5cIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcInByaW9yaXR5XCI6IDMwXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJpY29uXCIsXG4gICAgXCJmZWF0dXJlVHlwZXNcIjogW1wiUG9pbnRcIiwgXCJNdWx0aVBvaW50XCIsIFwiUG9seWdvblwiLCBcIk11bHRpUG9seWdvblwiXSxcbiAgICBcInJlcXVpcmVkQWN0aW9uc1wiOiBbXCJpY29uLWltYWdlXCJdLFxuICAgIFwiYWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiei1pbmRleFwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMCxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJpY29uLWltYWdlXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInVyaVwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiaWNvbi13aWR0aFwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImljb24taGVpZ2h0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiYWxsb3ctb3ZlcmxhcFwiLFxuICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCIteC1rb3RoaWMtcGFkZGluZ1wiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDIwXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByaW9yaXR5XCI6IDQwXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJ0ZXh0XCIsXG4gICAgXCJmZWF0dXJlVHlwZXNcIjogW1wiTGluZVN0cmluZ1wiLCBcIk11bHRpTGluZVN0cmluZ1wiLCBcIlBvaW50XCIsIFwiTXVsdGlQb2ludFwiLCBcIlBvbHlnb25cIiwgXCJNdWx0aVBvbHlnb25cIl0sXG4gICAgXCJyZXF1aXJlZEFjdGlvbnNcIjogW1widGV4dFwiXSxcbiAgICBcImFjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImFjdGlvblwiOiBcInotaW5kZXhcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDAsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dFwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInRleHQtY29sb3JcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiIzAwMDAwMFwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dC1vcGFjaXR5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMVxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInRleHQtaGFsby1yYWRpdXNcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ0ZXh0LWhhbG8tY29sb3JcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiIzAwMDAwMFwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiZm9udC1mYW1pbHlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJmb250LXNpemVcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInRleHQtb2Zmc2V0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwidGV4dC1hbGxvdy1vdmVybGFwXCIsXG4gICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcIi14LWtvdGhpYy1wYWRkaW5nXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMjBcbiAgICAgIH1cbiAgICBdLFxuICAgIFwicHJpb3JpdHlcIjogNTBcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcInNoaWVsZFwiLFxuICAgIFwiZmVhdHVyZVR5cGVzXCI6IFtcIkxpbmVTdHJpbmdcIiwgXCJNdWx0aUxpbmVTdHJpbmdcIl0sXG4gICAgXCJyZXF1aXJlZEFjdGlvbnNcIjogW1wic2hpZWxkLWltYWdlXCIsIFwic2hpZWxkLXRleHRcIl0sXG4gICAgXCJhY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJ6LWluZGV4XCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1pbWFnZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJ1cmlcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC10ZXh0XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLXRleHQtY29sb3JcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiIzAwMDAwMFwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLXRleHQtb3BhY2l0eVwiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJvcGFjaXR5XCIsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1mb250LWZhbWlseVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1mb250LXNpemVcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJmb250LWZhbWlseVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcImZvbnQtc2l6ZVwiLFxuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1jYXNpbmctd2lkdGhcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtY2FzaW5nLWNvbG9yXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBcIiMwMDAwMDBcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIlxuICAgICAgfSwge1xuICAgICAgICBcImFjdGlvblwiOiBcInNoaWVsZC1jYXNpbmctb3BhY2l0eVwiLFxuICAgICAgICBcImRlZmF1bHRcIjogMSxcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtZnJhbWUtd2lkdGhcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCJzaGllbGQtZnJhbWUtY29sb3JcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IFwiIzAwMDAwMFwiLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwic2hpZWxkLWZyYW1lLW9wYWNpdHlcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDEsXG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LCB7XG4gICAgICAgIFwiYWN0aW9uXCI6IFwiYWxsb3ctb3ZlcmxhcFwiLFxuICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCJcbiAgICAgIH0sIHtcbiAgICAgICAgXCJhY3Rpb25cIjogXCIteC1rb3RoaWMtcGFkZGluZ1wiLFxuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJkZWZhdWx0XCI6IDIwXG4gICAgICB9XG4gICAgXSxcbiAgICBcInByaW9yaXR5XCI6IDYwXG4gIH0sXG5dO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcmJ1c2ggPSByZXF1aXJlKCdyYnVzaCcpO1xuXG5jb25zdCBDb2xsaXNpb25CdWZmZXIgPSBmdW5jdGlvbiAoaGVpZ2h0LCB3aWR0aCkge1xuICB0aGlzLmJ1ZmZlciA9IHJidXNoKDI1Nik7XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG59O1xuXG5mdW5jdGlvbiBnZXRCb3hGcm9tUG9pbnQocG9pbnQsIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGlkKSB7XG4gIGNvbnN0IGR4ID0gd2lkdGggLyAyICsgcGFkZGluZztcbiAgY29uc3QgZHkgPSBoZWlnaHQgLyAyICsgcGFkZGluZztcblxuICByZXR1cm4ge1xuICAgIG1pblg6IHBvaW50WzBdIC0gZHgsXG4gICAgbWluWTogcG9pbnRbMV0gLSBkeSxcbiAgICBtYXhYOiBwb2ludFswXSArIGR4LFxuICAgIG1heFk6IHBvaW50WzFdICsgZHksXG4gICAgaWQ6IGlkXG4gIH07XG59XG5cbkNvbGxpc2lvbkJ1ZmZlci5wcm90b3R5cGUuYWRkUG9pbnRXSCA9IGZ1bmN0aW9uIChwb2ludCwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgaWQpIHtcbiAgdGhpcy5idWZmZXIuaW5zZXJ0KGdldEJveEZyb21Qb2ludChwb2ludCwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgaWQpKTtcbn1cblxuQ29sbGlzaW9uQnVmZmVyLnByb3RvdHlwZS5hZGRQb2ludHMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gIGNvbnN0IHBvaW50cyA9IHBhcmFtcy5tYXAoKGFyZ3MpID0+IGdldEJveEZyb21Qb2ludC5hcHBseShudWxsLCBhcmdzKSk7XG4gIHRoaXMuYnVmZmVyLmxvYWQocG9pbnRzKTtcbn1cblxuQ29sbGlzaW9uQnVmZmVyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGJveCkge1xuICBjb25zdCByZXN1bHQgPSB0aGlzLmJ1ZmZlci5zZWFyY2goYm94KTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT0gMDtcbn1cblxuQ29sbGlzaW9uQnVmZmVyLnByb3RvdHlwZS5jaGVja1BvaW50V0ggPSBmdW5jdGlvbiAocG9pbnQsIHdpZHRoLCBoZWlnaHQsIGlkKSB7XG4gIGNvbnN0IGJveCA9IGdldEJveEZyb21Qb2ludChwb2ludCwgd2lkdGgsIGhlaWdodCwgMCk7XG5cbiAgLy9BbHdheXMgc2hvdyBjb2xsaXNpb24gb3V0c2lkZSB0aGUgQ29sbGlzaW9uQnVmZmVyXG4gIC8vVE9ETzogV2h5IGRvIHdlIG5lZWQgdGhpcz8/P1xuICBpZiAoYm94Lm1pblggPCAwIHx8IGJveC5taW5ZIDwgMCB8fCBib3gubWF4WCA+IHRoaXMud2lkdGggfHwgYm94Lm1heFkgPiB0aGlzLmhlaWdodCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gdGhpcy5idWZmZXIuc2VhcmNoKGJveCk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlc3VsdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIC8vIE9iamVjdCB3aXRoIHNhbWUgSUQgZG9lc24ndCBpbmR1Y2UgYSBjb2xsaXNpb24sIGJ1dCBkaWZmZXJlbnQgaWRzIGRvZXNcbiAgICBpZiAoaWQgIT09IHJlc3VsdFtpXS5pZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxpc2lvbkJ1ZmZlcjtcbiIsImNvbnN0IGNvbG9ycyA9IHtcbiAgJ2FsaWNlYmx1ZSc6ICcjRjBGOEZGJyxcbiAgJ2FudGlxdWV3aGl0ZSc6ICcjRkFFQkQ3JyxcbiAgJ2FxdWEnOiAnIzAwRkZGRicsXG4gICdhcXVhbWFyaW5lJzogJyM3RkZGRDQnLFxuICAnYXp1cmUnOiAnI0YwRkZGRicsXG4gICdiZWlnZSc6ICcjRjVGNURDJyxcbiAgJ2Jpc3F1ZSc6ICcjRkZFNEM0JyxcbiAgJ2JsYWNrJzogJyMwMDAwMDAnLFxuICAnYmxhbmNoZWRhbG1vbmQnOiAnI0ZGRUJDRCcsXG4gICdibHVlJzogJyMwMDAwRkYnLFxuICAnYmx1ZXZpb2xldCc6ICcjOEEyQkUyJyxcbiAgJ2Jyb3duJzogJyNBNTJBMkEnLFxuICAnYnVybHl3b29kJzogJyNERUI4ODcnLFxuICAnY2FkZXRibHVlJzogJyM1RjlFQTAnLFxuICAnY2hhcnRyZXVzZSc6ICcjN0ZGRjAwJyxcbiAgJ2Nob2NvbGF0ZSc6ICcjRDI2OTFFJyxcbiAgJ2NvcmFsJzogJyNGRjdGNTAnLFxuICAnY29ybmZsb3dlcmJsdWUnOiAnIzY0OTVFRCcsXG4gICdjb3Juc2lsayc6ICcjRkZGOERDJyxcbiAgJ2NyaW1zb24nOiAnI0RDMTQzQycsXG4gICdjeWFuJzogJyMwMEZGRkYnLFxuICAnZGFya2JsdWUnOiAnIzAwMDA4QicsXG4gICdkYXJrY3lhbic6ICcjMDA4QjhCJyxcbiAgJ2Rhcmtnb2xkZW5yb2QnOiAnI0I4ODYwQicsXG4gICdkYXJrZ3JheSc6ICcjQTlBOUE5JyxcbiAgJ2RhcmtncmVlbic6ICcjMDA2NDAwJyxcbiAgJ2RhcmtncmV5JzogJyNBOUE5QTknLFxuICAnZGFya2toYWtpJzogJyNCREI3NkInLFxuICAnZGFya21hZ2VudGEnOiAnIzhCMDA4QicsXG4gICdkYXJrb2xpdmVncmVlbic6ICcjNTU2QjJGJyxcbiAgJ2RhcmtvcmFuZ2UnOiAnI0ZGOEMwMCcsXG4gICdkYXJrb3JjaGlkJzogJyM5OTMyQ0MnLFxuICAnZGFya3JlZCc6ICcjOEIwMDAwJyxcbiAgJ2RhcmtzYWxtb24nOiAnI0U5OTY3QScsXG4gICdkYXJrc2VhZ3JlZW4nOiAnIzhGQkM4RicsXG4gICdkYXJrc2xhdGVibHVlJzogJyM0ODNEOEInLFxuICAnZGFya3NsYXRlZ3JheSc6ICcjMkY0RjRGJyxcbiAgJ2RhcmtzbGF0ZWdyZXknOiAnIzJGNEY0RicsXG4gICdkYXJrdHVycXVvaXNlJzogJyMwMENFRDEnLFxuICAnZGFya3Zpb2xldCc6ICcjOTQwMEQzJyxcbiAgJ2RlZXBwaW5rJzogJyNGRjE0OTMnLFxuICAnZGVlcHNreWJsdWUnOiAnIzAwQkZGRicsXG4gICdkaW1ncmF5JzogJyM2OTY5NjknLFxuICAnZGltZ3JleSc6ICcjNjk2OTY5JyxcbiAgJ2RvZGdlcmJsdWUnOiAnIzFFOTBGRicsXG4gICdmaXJlYnJpY2snOiAnI0IyMjIyMicsXG4gICdmbG9yYWx3aGl0ZSc6ICcjRkZGQUYwJyxcbiAgJ2ZvcmVzdGdyZWVuJzogJyMyMjhCMjInLFxuICAnZnVjaHNpYSc6ICcjRkYwMEZGJyxcbiAgJ2dhaW5zYm9ybyc6ICcjRENEQ0RDJyxcbiAgJ2dob3N0d2hpdGUnOiAnI0Y4RjhGRicsXG4gICdnb2xkJzogJyNGRkQ3MDAnLFxuICAnZ29sZGVucm9kJzogJyNEQUE1MjAnLFxuICAnZ3JheSc6ICcjODA4MDgwJyxcbiAgJ2dyZWVuJzogJyMwMDgwMDAnLFxuICAnZ3JlZW55ZWxsb3cnOiAnI0FERkYyRicsXG4gICdncmV5JzogJyM4MDgwODAnLFxuICAnaG9uZXlkZXcnOiAnI0YwRkZGMCcsXG4gICdob3RwaW5rJzogJyNGRjY5QjQnLFxuICAnaW5kaWFucmVkJzogJyNDRDVDNUMnLFxuICAnaW5kaWdvJzogJyM0QjAwODInLFxuICAnaXZvcnknOiAnI0ZGRkZGMCcsXG4gICdraGFraSc6ICcjRjBFNjhDJyxcbiAgJ2xhdmVuZGVyJzogJyNFNkU2RkEnLFxuICAnbGF2ZW5kZXJibHVzaCc6ICcjRkZGMEY1JyxcbiAgJ2xhd25ncmVlbic6ICcjN0NGQzAwJyxcbiAgJ2xlbW9uY2hpZmZvbic6ICcjRkZGQUNEJyxcbiAgJ2xpZ2h0Ymx1ZSc6ICcjQUREOEU2JyxcbiAgJ2xpZ2h0Y29yYWwnOiAnI0YwODA4MCcsXG4gICdsaWdodGN5YW4nOiAnI0UwRkZGRicsXG4gICdsaWdodGdvbGRlbnJvZHllbGxvdyc6ICcjRkFGQUQyJyxcbiAgJ2xpZ2h0Z3JheSc6ICcjRDNEM0QzJyxcbiAgJ2xpZ2h0Z3JlZW4nOiAnIzkwRUU5MCcsXG4gICdsaWdodGdyZXknOiAnI0QzRDNEMycsXG4gICdsaWdodHBpbmsnOiAnI0ZGQjZDMScsXG4gICdsaWdodHNhbG1vbic6ICcjRkZBMDdBJyxcbiAgJ2xpZ2h0c2VhZ3JlZW4nOiAnIzIwQjJBQScsXG4gICdsaWdodHNreWJsdWUnOiAnIzg3Q0VGQScsXG4gICdsaWdodHNsYXRlZ3JheSc6ICcjNzc4ODk5JyxcbiAgJ2xpZ2h0c2xhdGVncmV5JzogJyM3Nzg4OTknLFxuICAnbGlnaHRzdGVlbGJsdWUnOiAnI0IwQzRERScsXG4gICdsaWdodHllbGxvdyc6ICcjRkZGRkUwJyxcbiAgJ2xpbWUnOiAnIzAwRkYwMCcsXG4gICdsaW1lZ3JlZW4nOiAnIzMyQ0QzMicsXG4gICdsaW5lbic6ICcjRkFGMEU2JyxcbiAgJ21hZ2VudGEnOiAnI0ZGMDBGRicsXG4gICdtYXJvb24nOiAnIzgwMDAwMCcsXG4gICdtZWRpdW1hcXVhbWFyaW5lJzogJyM2NkNEQUEnLFxuICAnbWVkaXVtYmx1ZSc6ICcjMDAwMENEJyxcbiAgJ21lZGl1bW9yY2hpZCc6ICcjQkE1NUQzJyxcbiAgJ21lZGl1bXB1cnBsZSc6ICcjOTM3MERCJyxcbiAgJ21lZGl1bXNlYWdyZWVuJzogJyMzQ0IzNzEnLFxuICAnbWVkaXVtc2xhdGVibHVlJzogJyM3QjY4RUUnLFxuICAnbWVkaXVtc3ByaW5nZ3JlZW4nOiAnIzAwRkE5QScsXG4gICdtZWRpdW10dXJxdW9pc2UnOiAnIzQ4RDFDQycsXG4gICdtZWRpdW12aW9sZXRyZWQnOiAnI0M3MTU4NScsXG4gICdtaWRuaWdodGJsdWUnOiAnIzE5MTk3MCcsXG4gICdtaW50Y3JlYW0nOiAnI0Y1RkZGQScsXG4gICdtaXN0eXJvc2UnOiAnI0ZGRTRFMScsXG4gICdtb2NjYXNpbic6ICcjRkZFNEI1JyxcbiAgJ25hdmFqb3doaXRlJzogJyNGRkRFQUQnLFxuICAnbmF2eSc6ICcjMDAwMDgwJyxcbiAgJ29sZGxhY2UnOiAnI0ZERjVFNicsXG4gICdvbGl2ZSc6ICcjODA4MDAwJyxcbiAgJ29saXZlZHJhYic6ICcjNkI4RTIzJyxcbiAgJ29yYW5nZSc6ICcjRkZBNTAwJyxcbiAgJ29yYW5nZXJlZCc6ICcjRkY0NTAwJyxcbiAgJ29yY2hpZCc6ICcjREE3MEQ2JyxcbiAgJ3BhbGVnb2xkZW5yb2QnOiAnI0VFRThBQScsXG4gICdwYWxlZ3JlZW4nOiAnIzk4RkI5OCcsXG4gICdwYWxldHVycXVvaXNlJzogJyNBRkVFRUUnLFxuICAncGFsZXZpb2xldHJlZCc6ICcjREI3MDkzJyxcbiAgJ3BhcGF5YXdoaXAnOiAnI0ZGRUZENScsXG4gICdwZWFjaHB1ZmYnOiAnI0ZGREFCOScsXG4gICdwZXJ1JzogJyNDRDg1M0YnLFxuICAncGluayc6ICcjRkZDMENCJyxcbiAgJ3BsdW0nOiAnI0REQTBERCcsXG4gICdwb3dkZXJibHVlJzogJyNCMEUwRTYnLFxuICAncHVycGxlJzogJyM4MDAwODAnLFxuICAncmVkJzogJyNGRjAwMDAnLFxuICAncm9zeWJyb3duJzogJyNCQzhGOEYnLFxuICAncm95YWxibHVlJzogJyM0MTY5RTEnLFxuICAnc2FkZGxlYnJvd24nOiAnIzhCNDUxMycsXG4gICdzYWxtb24nOiAnI0ZBODA3MicsXG4gICdzYW5keWJyb3duJzogJyNGNEE0NjAnLFxuICAnc2VhZ3JlZW4nOiAnIzJFOEI1NycsXG4gICdzZWFzaGVsbCc6ICcjRkZGNUVFJyxcbiAgJ3NpZW5uYSc6ICcjQTA1MjJEJyxcbiAgJ3NpbHZlcic6ICcjQzBDMEMwJyxcbiAgJ3NreWJsdWUnOiAnIzg3Q0VFQicsXG4gICdzbGF0ZWJsdWUnOiAnIzZBNUFDRCcsXG4gICdzbGF0ZWdyYXknOiAnIzcwODA5MCcsXG4gICdzbGF0ZWdyZXknOiAnIzcwODA5MCcsXG4gICdzbm93JzogJyNGRkZBRkEnLFxuICAnc3ByaW5nZ3JlZW4nOiAnIzAwRkY3RicsXG4gICdzdGVlbGJsdWUnOiAnIzQ2ODJCNCcsXG4gICd0YW4nOiAnI0QyQjQ4QycsXG4gICd0ZWFsJzogJyMwMDgwODAnLFxuICAndGhpc3RsZSc6ICcjRDhCRkQ4JyxcbiAgJ3RvbWF0byc6ICcjRkY2MzQ3JyxcbiAgJ3R1cnF1b2lzZSc6ICcjNDBFMEQwJyxcbiAgJ3Zpb2xldCc6ICcjRUU4MkVFJyxcbiAgJ3doZWF0JzogJyNGNURFQjMnLFxuICAnd2hpdGUnOiAnI0ZGRkZGRicsXG4gICd3aGl0ZXNtb2tlJzogJyNGNUY1RjUnLFxuICAneWVsbG93JzogJyNGRkZGMDAnLFxuICAneWVsbG93Z3JlZW4nOiAnIzlBQ0QzMidcbn1cblxuY29uc3QgY29sb3JzX3ZhbHVlcyA9IE9iamVjdC52YWx1ZXMoY29sb3JzKVxuICAuc29ydCgoYSwgYikgPT4gMC41IC0gTWF0aC5yYW5kb20oKSk7XG52YXIgaW5kZXggPSAwO1xuXG5mdW5jdGlvbiBuZXh0Q29sb3IoKSB7XG4gIGNvbnN0IGNvbG9yID0gY29sb3JzX3ZhbHVlc1tpbmRleCsrXTtcbiAgaWYgKGluZGV4ID4gY29sb3JzX3ZhbHVlcy5sZW5ndGgpIHtcbiAgICBpbmRleCA9IDA7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5uZXh0Q29sb3IgPSBuZXh0Q29sb3I7XG4iLCIndXNlIHN0cmljdCc7XG5mdW5jdGlvbiBzZXJpZXMoZm5zLCBnZXRGcmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKGZucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnQgPSAwO1xuXG4gIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgaWYgKGN1cnJlbnQgPj0gZm5zLmxlbmd0aCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0RnJhbWUoKCkgPT4gZm5zW2N1cnJlbnQrK10obmV4dCkpO1xuICAgIH1cbiAgfVxuXG4gIG5leHQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuc2VyaWVzID0gc2VyaWVzO1xuIiwiLyoqXG4gICogQ29sbGVjdGlvbiBvZiBnZW9tZXRyeSB1dGlsbGl0aWVzXG4gICovXG5cbi8vIGNoZWNrIGlmIHRoZSBwb2ludCBbaW4gWFkgY29vcmRpbmF0ZXNdIGlzIG9uIHRpbGUncyBlZGdlXG4vLyByZXR1cm5zIDQtYml0cyBiaXRtYXNrIG9mIGFmZmVjdGVkIHRpbGUgYm91bmRhcmllczpcbi8vICAgYml0IDAgLSBsZWZ0XG4vLyAgIGJpdCAxIC0gcmlnaHRcbi8vICAgYml0IDIgLSB0b3Bcbi8vICAgYml0IDMgLSBib3R0b21cbmV4cG9ydHMuaXNPblRpbGVCb3VuZGFyeSA9IGZ1bmN0aW9uKHAsIHRpbGVfd2lkdGgsIHRpbGVfaGVpZ2h0KSB7XG4gIHZhciByID0gMDtcbiAgaWYgKHBbMF0gPT09IDApIHtcbiAgICByIHw9IDE7XG4gIH0gZWxzZSBpZiAocFswXSA9PT0gdGlsZV93aWR0aCkge1xuICAgIHIgfD0gMjtcbiAgfVxuXG4gIGlmIChwWzFdID09PSAwKSB7XG4gICAgciB8PSA0O1xuICB9IGVsc2UgaWYgKHBbMV0gPT09IHRpbGVfaGVpZ2h0KSB7XG4gICAgciB8PSA4O1xuICB9XG4gIHJldHVybiByO1xufVxuXG4vKiBjaGVjayBpZiAyIHBvaW50cyBhcmUgYm90aCBvbiB0aGUgc2FtZSB0aWxlIGJvdW5kYXJ5XG4gKlxuICogSWYgcG9pbnRzIG9mIHRoZSBvYmplY3QgYXJlIG9uIHRoZSBzYW1lIHRpbGUgYm91bmRhcnkgaXQgaXMgYXNzdW1lZFxuICogdGhhdCB0aGUgb2JqZWN0IGlzIGN1dCBoZXJlIGFuZCB3b3VsZCBvcmlnaW5hbGx5IGNvbnRpbnVlIGJleW9uZCB0aGVcbiAqIHRpbGUgYm9yZGVycy5cbiAqXG4gKiBUaGlzIGNoZWNrIGRvZXMgbm90IGNhdGNoIHRoZSBjYXNlIHdoZXJlIHRoZSBvYmplY3QgaXMgbG9jYXRlZCBleGFjdGx5XG4gKiBvbiB0aGUgdGlsZSBib3VuZGFyaWVzLCBidXQgdGhpcyBjYXNlIGNhbid0IHByb3Blcmx5IGJlIGRldGVjdGVkIGhlcmUuXG4gKi9cbmV4cG9ydHMuY2hlY2tTYW1lQm91bmRhcnkgPSBmdW5jdGlvbihwLCBxLCB0aWxlX3dpZHRoLCB0aWxlX2hlaWdodCkge1xuICB2YXIgYnAgPSBleHBvcnRzLmlzT25UaWxlQm91bmRhcnkocCwgdGlsZV93aWR0aCwgdGlsZV9oZWlnaHQpO1xuXG4gIGlmICghYnApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gKGJwICYgZXhwb3J0cy5pc09uVGlsZUJvdW5kYXJ5KHEsIHRpbGVfd2lkdGgsIHRpbGVfaGVpZ2h0KSk7XG59XG5cbi8vIGdldCBhIHNpbmdsZSBwb2ludCByZXByZXNlbnRpbmcgZ2VvbWV0cnkgZmVhdHVyZSAoZS5nLiBjZW50cm9pZClcbmV4cG9ydHMuZ2V0UmVwclBvaW50ID0gZnVuY3Rpb24gKGdlb21ldHJ5LCBwcm9qZWN0UG9pbnRGdW5jdGlvbikge1xuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgY2FzZSAnUG9pbnQnOlxuICAgIHBvaW50ID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1BvbHlnb24nOlxuICAgIC8vVE9ETzogRG9uJ3QgZXhwZWN0IHdlJ3JlIGhhdmUgdGhpcyBmaWVsZC4gV2UgbWF5IGhhdmUgcGxhaW4gSlNPTiBoZXJlLFxuICAgIC8vIHNvIGl0J3MgYmV0dGVyIHRvIGNoZWNrIGEgZmVhdHVyZSBwcm9wZXJ0eSBhbmQgY2FsY3VsYXRlIHBvbHlnb24gY2VudHJvaWQgaGVyZVxuICAgIC8vIGlmIHNlcnZlciBkb2Vzbid0IHByb3ZpZGUgcmVwcmVzZW50YXRpdmUgcG9pbnRcbiAgICBwb2ludCA9IGdlb21ldHJ5LnJlcHJwb2ludDtcbiAgICBicmVhaztcbiAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgLy8gVXNlIGNlbnRlciBvZiBsaW5lIGhlcmVcbiAgICAvLyBUT0RPOiBUaGlzIGFwcHJvYWNoIGlzIHByZXR0eSByb3VnaDogd2UgbmVlZCB0byBjaGVjayBub3Qgb25seSBzaW5nbGUgcG9pbnQsXG4gICAgLy8gZm9yIGxhYmVsIHBsYWNpbmcsIGJ1dCBhbnkgcG9pbnQgb24gdGhlIGxpbmVcbiAgICB2YXIgbGVuID0gZXhwb3J0cy5nZXRQb2x5TGVuZ3RoKGdlb21ldHJ5LmNvb3JkaW5hdGVzKTtcbiAgICB2YXIgcG9pbnQgPSBleHBvcnRzLmdldEFuZ2xlQW5kQ29vcmRzQXRMZW5ndGgoZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIGxlbiAvIDIsIDApO1xuICAgIHBvaW50ID0gW3BvaW50WzFdLCBwb2ludFsyXV07XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0dlb21ldHJ5Q29sbGVjdGlvbic6XG4gICAgLy9UT0RPOiBEaXNhc3NlbWJsZSBnZW9tZXRyeSBjb2xsZWN0aW9uXG4gICAgcmV0dXJuO1xuICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAvL1RPRE86IERpc2Fzc2VtYmxlIG11bHRpIHBvaW50XG4gICAgcmV0dXJuO1xuICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgIHBvaW50ID0gZ2VvbWV0cnkucmVwcnBvaW50O1xuICAgIGJyZWFrO1xuICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgIC8vVE9ETzogRGlzYXNzZW1ibGUgZ2VvbWV0cnkgY29sbGVjdGlvblxuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gcHJvamVjdFBvaW50RnVuY3Rpb24ocG9pbnQpO1xufTtcblxuLy8gQ2FsY3VsYXRlIGxlbmd0aCBvZiBsaW5lXG5leHBvcnRzLmdldFBvbHlMZW5ndGggPSBmdW5jdGlvbiAocG9pbnRzKSB7XG4gIHZhciBsZW5ndGggPSAwO1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGMgPSBwb2ludHNbaV0sXG4gICAgICBwYyA9IHBvaW50c1tpIC0gMV0sXG4gICAgICBkeCA9IHBjWzBdIC0gY1swXSxcbiAgICAgIGR5ID0gcGNbMV0gLSBjWzFdO1xuXG4gICAgbGVuZ3RoICs9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH1cbiAgcmV0dXJuIGxlbmd0aDtcbn07XG5cbmV4cG9ydHMuZ2V0QW5nbGVBbmRDb29yZHNBdExlbmd0aCA9IGZ1bmN0aW9uIChwb2ludHMsIGRpc3QsIHdpZHRoKSB7XG4gIHZhciB4LCB5LFxuICAgIGxlbmd0aCA9IDAsXG4gICAgYW5nbGUsIHNhbWVzZWcgPSB0cnVlLFxuICAgIGdvdHh5ID0gZmFsc2U7XG5cbiAgd2lkdGggPSB3aWR0aCB8fCAwOyAvLyBieSBkZWZhdWx0IHdlIHRoaW5rIHRoYXQgYSBsZXR0ZXIgaXMgMCBweCB3aWRlXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZ290eHkpIHtcbiAgICAgIHNhbWVzZWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYyA9IHBvaW50c1tpXSxcbiAgICAgIHBjID0gcG9pbnRzW2kgLSAxXSxcbiAgICAgIGR4ID0gY1swXSAtIHBjWzBdLFxuICAgICAgZHkgPSBjWzFdIC0gcGNbMV07XG5cbiAgICB2YXIgc2VnTGVuID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgIGlmICghZ290eHkgJiYgbGVuZ3RoICsgc2VnTGVuID49IGRpc3QpIHtcbiAgICAgIHZhciBwYXJ0TGVuID0gZGlzdCAtIGxlbmd0aDtcbiAgICAgIHggPSBwY1swXSArIGR4ICogcGFydExlbiAvIHNlZ0xlbjtcbiAgICAgIHkgPSBwY1sxXSArIGR5ICogcGFydExlbiAvIHNlZ0xlbjtcblxuICAgICAgZ290eHkgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChnb3R4eSAmJiBsZW5ndGggKyBzZWdMZW4gPj0gZGlzdCArIHdpZHRoKSB7XG4gICAgICB2YXIgcGFydExlbiA9IGRpc3QgKyB3aWR0aCAtIGxlbmd0aDtcblxuICAgICAgZHggPSBwY1swXSArIGR4ICogcGFydExlbiAvIHNlZ0xlbjtcbiAgICAgIGR5ID0gcGNbMV0gKyBkeSAqIHBhcnRMZW4gLyBzZWdMZW47XG4gICAgICBhbmdsZSA9IE1hdGguYXRhbjIoZHkgLSB5LCBkeCAtIHgpO1xuXG4gICAgICBpZiAoc2FtZXNlZykge1xuICAgICAgICByZXR1cm4gW2FuZ2xlLCB4LCB5LCBzZWdMZW4gLSBwYXJ0TGVuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbYW5nbGUsIHgsIHksIDBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxlbmd0aCArPSBzZWdMZW47XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICoqIFV0aWxsaXR5IGNsYXNzIGZvciBtYW5hZ2luZyBDYW52YXMgY29udGV4dCBzdHlsZSBwcm9wZXJ0aWVzXG4gKiovXG5cbmNvbnN0IGRlZmF1bHRDYW52YXNTdHlsZSA9IHtcbiAgc3Ryb2tlU3R5bGU6ICdyZ2JhKDAsMCwwLDAuNSknLFxuICBmaWxsU3R5bGU6ICdyZ2JhKDAsMCwwLDAuNSknLFxuICBsaW5lV2lkdGg6IDEsXG4gIGxpbmVDYXA6ICdyb3VuZCcsXG4gIGxpbmVKb2luOiAncm91bmQnLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICB0ZXh0QmFzZWxpbmU6ICdtaWRkbGUnXG59O1xuXG4vKipcbiAqKiBDb21wb3NlIGZvbnQgZGVjbGFyYXRpb24gc3RyaW5nIGZvciBDYW52YXMgY29udGV4dFxuICoqL1xuZXhwb3J0cy5jb21wb3NlRm9udERlY2xhcmF0aW9uID0gZnVuY3Rpb24obmFtZT0nJywgc2l6ZT05LCBzdHlsZSkge1xuICB2YXIgZmFtaWx5ID0gbmFtZSA/IG5hbWUgKyAnLCAnIDogJyc7XG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgdmFyIHBhcnRzID0gW107XG4gIGlmIChzdHlsZVsnZm9udC1zdHlsZSddID09PSAnaXRhbGljJyB8fCBzdHlsZVsnZm9udC1zdHlsZSddID09PSAnb2JsaXF1ZScpIHtcbiAgICBwYXJ0cy5wdXNoKHN0eWxlWydmb250LXN0eWxlJ10pO1xuICB9XG5cbiAgaWYgKHN0eWxlWydmb250LXZhcmlhbnQnXSA9PT0gJ3NtYWxsLWNhcHMnKSB7XG4gICAgcGFydHMucHVzaChzdHlsZVsnZm9udC12YXJpYW50J10pO1xuICB9XG5cbiAgaWYgKHN0eWxlWydmb250LXdlaWdodCddID09PSAnYm9sZCcpIHtcbiAgICBwYXJ0cy5wdXNoKHN0eWxlWydmb250LXdlaWdodCddKTtcbiAgfVxuXG4gIHBhcnRzLnB1c2goc2l6ZSArICdweCcpO1xuXG4gIGlmIChuYW1lLmluZGV4T2YoJ3NlcmlmJykgIT09IC0xICYmIG5hbWUuaW5kZXhPZignc2Fucy1zZXJpZicpID09PSAtMSkge1xuICAgIGZhbWlseSArPSAnR2VvcmdpYSwgc2VyaWYnO1xuICB9IGVsc2Uge1xuICAgIGZhbWlseSArPSAnXCJIZWx2ZXRpY2EgTmV1ZVwiLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmJztcbiAgfVxuICBwYXJ0cy5wdXNoKGZhbWlseSk7XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiogQXBwbHkgc3R5bGVzIHRvIENhbnZhcyBjb250ZXh0XG4gKiovXG5leHBvcnRzLmFwcGx5U3R5bGUgPSBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmIChzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjdHhba2V5XSA9IHN0eWxlW2tleV07XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICoqIEFwcGx5IGRlZmF1bHQgc3R5bGUgdG8gQ2FudmFzIGNvbnRleHRcbiAqKi9cbmV4cG9ydHMuYXBwbHlEZWZhdWx0cyA9IGZ1bmN0aW9uKGN0eCkge1xuICBleHBvcnRzLmFwcGx5U3R5bGUoY3R4LCBkZWZhdWx0Q2FudmFzU3R5bGUpO1xufVxuIiwiLy8gR2VuZXJhdGVkIGF1dG9tYXRpY2FsbHkgYnkgbmVhcmxleSwgdmVyc2lvbiB1bmtub3duXG4vLyBodHRwOi8vZ2l0aHViLmNvbS9IYXJkbWF0aDEyMy9uZWFybGV5XG4oZnVuY3Rpb24gKCkge1xuZnVuY3Rpb24gaWQoeCkgeyByZXR1cm4geFswXTsgfVxuXG4vLyBCeXBhc3NlcyBUUzYxMzMuIEFsbG93IGRlY2xhcmVkIGJ1dCB1bnVzZWQgZnVuY3Rpb25zLlxuLy8gQHRzLWlnbm9yZVxuZnVuY3Rpb24gbnRoKG4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZFtuXTtcbiAgICB9O1xufVxuXG5cbi8vIEJ5cGFzc2VzIFRTNjEzMy4gQWxsb3cgZGVjbGFyZWQgYnV0IHVudXNlZCBmdW5jdGlvbnMuXG4vLyBAdHMtaWdub3JlXG5mdW5jdGlvbiAkKG8pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgcmV0ID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgcmV0W2tdID0gZFtvW2tdXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbn1cbnZhciBncmFtbWFyID0ge1xuICAgIExleGVyOiB1bmRlZmluZWQsXG4gICAgUGFyc2VyUnVsZXM6IFtcbiAgICB7XCJuYW1lXCI6IFwiXyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwiXyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcIl8kZWJuZiQxXCIsIFwid3NjaGFyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJfXCIsIFwic3ltYm9sc1wiOiBbXCJfJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcIl9fJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wid3NjaGFyXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiX18kZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJfXyRlYm5mJDFcIiwgXCJ3c2NoYXJcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIl9fXCIsIFwic3ltYm9sc1wiOiBbXCJfXyRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJ3c2NoYXJcIiwgXCJzeW1ib2xzXCI6IFsvWyBcXHRcXG5cXHZcXGZdL10sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9pbnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1swLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9pbnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9pbnQkZWJuZiQxXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJ1bnNpZ25lZF9pbnRcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2ludCRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkWzBdLmpvaW4oXCJcIikpO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcImludCRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLVwifV19LFxuICAgIHtcIm5hbWVcIjogXCJpbnQkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIitcIn1dfSxcbiAgICB7XCJuYW1lXCI6IFwiaW50JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiaW50JGVibmYkMSRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJpbnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImludCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcImludCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcImludCRlYm5mJDJcIiwgL1swLTldL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcImludFwiLCBcInN5bWJvbHNcIjogW1wiaW50JGVibmYkMVwiLCBcImludCRlYm5mJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChkWzBdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGRbMF1bMF0rZFsxXS5qb2luKFwiXCIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGRbMV0uam9pbihcIlwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMVwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfZGVjaW1hbCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLlwifSwgXCJ1bnNpZ25lZF9kZWNpbWFsJGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQyJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcInVuc2lnbmVkX2RlY2ltYWxcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2RlY2ltYWwkZWJuZiQxXCIsIFwidW5zaWduZWRfZGVjaW1hbCRlYm5mJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KFxuICAgICAgICAgICAgICAgIGRbMF0uam9pbihcIlwiKSArXG4gICAgICAgICAgICAgICAgKGRbMV0gPyBcIi5cIitkWzFdWzFdLmpvaW4oXCJcIikgOiBcIlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJkZWNpbWFsJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcImRlY2ltYWwkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXCJkZWNpbWFsJGVibmYkMlwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiZGVjaW1hbCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiLlwifSwgXCJkZWNpbWFsJGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiZGVjaW1hbCRlYm5mJDNcIiwgXCJzeW1ib2xzXCI6IFtcImRlY2ltYWwkZWJuZiQzJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImRlY2ltYWwkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImRlY2ltYWxcIiwgXCJzeW1ib2xzXCI6IFtcImRlY2ltYWwkZWJuZiQxXCIsIFwiZGVjaW1hbCRlYm5mJDJcIiwgXCJkZWNpbWFsJGVibmYkM1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoXG4gICAgICAgICAgICAgICAgKGRbMF0gfHwgXCJcIikgK1xuICAgICAgICAgICAgICAgIGRbMV0uam9pbihcIlwiKSArXG4gICAgICAgICAgICAgICAgKGRbMl0gPyBcIi5cIitkWzJdWzFdLmpvaW4oXCJcIikgOiBcIlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJwZXJjZW50YWdlXCIsIFwic3ltYm9sc1wiOiBbXCJkZWNpbWFsXCIsIHtcImxpdGVyYWxcIjpcIiVcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gZFswXS8xMDA7XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbL1swLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXCJqc29uZmxvYXQkZWJuZiQyXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQzJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFsvWzAtOV0vXX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDMkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wianNvbmZsb2F0JGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIC9bMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQzJHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi5cIn0sIFwianNvbmZsb2F0JGVibmYkMyRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkM1wiLCBcInN5bWJvbHNcIjogW1wianNvbmZsb2F0JGVibmYkMyRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdCRlYm5mJDQkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bKy1dL10sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDEkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbL1swLTldL119LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0JHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcImpzb25mbG9hdCRlYm5mJDQkc3ViZXhwcmVzc2lvbiQxJGVibmYkMlwiLCAvWzAtOV0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFsvW2VFXS8sIFwianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDEkZWJuZiQyXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwianNvbmZsb2F0JGVibmYkNFwiLCBcInN5bWJvbHNcIjogW1wianNvbmZsb2F0JGVibmYkNCRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJqc29uZmxvYXQkZWJuZiQ0XCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImpzb25mbG9hdFwiLCBcInN5bWJvbHNcIjogW1wianNvbmZsb2F0JGVibmYkMVwiLCBcImpzb25mbG9hdCRlYm5mJDJcIiwgXCJqc29uZmxvYXQkZWJuZiQzXCIsIFwianNvbmZsb2F0JGVibmYkNFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoXG4gICAgICAgICAgICAgICAgKGRbMF0gfHwgXCJcIikgK1xuICAgICAgICAgICAgICAgIGRbMV0uam9pbihcIlwiKSArXG4gICAgICAgICAgICAgICAgKGRbMl0gPyBcIi5cIitkWzJdWzFdLmpvaW4oXCJcIikgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgKGRbM10gPyBcImVcIiArIChkWzNdWzFdIHx8IFwiK1wiKSArIGRbM11bMl0uam9pbihcIlwiKSA6IFwiXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcImRxc3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJkcXN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImRxc3RyaW5nJGVibmYkMVwiLCBcImRzdHJjaGFyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJkcXN0cmluZ1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIlxcXCJcIn0sIFwiZHFzdHJpbmckZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcIlxcXCJcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gZFsxXS5qb2luKFwiXCIpOyB9fSxcbiAgICB7XCJuYW1lXCI6IFwic3FzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcInNxc3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wic3FzdHJpbmckZWJuZiQxXCIsIFwic3N0cmNoYXJcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInNxc3RyaW5nXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiJ1wifSwgXCJzcXN0cmluZyRlYm5mJDFcIiwge1wibGl0ZXJhbFwiOlwiJ1wifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBkWzFdLmpvaW4oXCJcIik7IH19LFxuICAgIHtcIm5hbWVcIjogXCJidHN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwiYnRzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJidHN0cmluZyRlYm5mJDFcIiwgL1teYF0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiYnRzdHJpbmdcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJgXCJ9LCBcImJ0c3RyaW5nJGVibmYkMVwiLCB7XCJsaXRlcmFsXCI6XCJgXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIGRbMV0uam9pbihcIlwiKTsgfX0sXG4gICAge1wibmFtZVwiOiBcImRzdHJjaGFyXCIsIFwic3ltYm9sc1wiOiBbL1teXFxcXFwiXFxuXS9dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiZHN0cmNoYXJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJcXFxcXCJ9LCBcInN0cmVzY2FwZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoXCJcXFwiXCIrZC5qb2luKFwiXCIpK1wiXFxcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJzc3RyY2hhclwiLCBcInN5bWJvbHNcIjogWy9bXlxcXFwnXFxuXS9dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic3N0cmNoYXJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJcXFxcXCJ9LCBcInN0cmVzY2FwZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7IHJldHVybiBKU09OLnBhcnNlKFwiXFxcIlwiK2Quam9pbihcIlwiKStcIlxcXCJcIik7IH19LFxuICAgIHtcIm5hbWVcIjogXCJzc3RyY2hhciRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIlxcXFxcIn0sIHtcImxpdGVyYWxcIjpcIidcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInNzdHJjaGFyXCIsIFwic3ltYm9sc1wiOiBbXCJzc3RyY2hhciRzdHJpbmckMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIFwiJ1wiOyB9fSxcbiAgICB7XCJuYW1lXCI6IFwic3RyZXNjYXBlXCIsIFwic3ltYm9sc1wiOiBbL1tcIlxcXFxcXC9iZm5ydF0vXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInN0cmVzY2FwZVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInVcIn0sIC9bYS1mQS1GMC05XS8sIC9bYS1mQS1GMC05XS8sIC9bYS1mQS1GMC05XS8sIC9bYS1mQS1GMC05XS9dLCBcInBvc3Rwcm9jZXNzXCI6IFxuICAgICAgICBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIH0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiI1wifSwgXCJoZXhkaWdpdFwiLCBcImhleGRpZ2l0XCIsIFwiaGV4ZGlnaXRcIiwgXCJoZXhkaWdpdFwiLCBcImhleGRpZ2l0XCIsIFwiaGV4ZGlnaXRcIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgXCJyXCI6IHBhcnNlSW50KGRbMV0rZFsyXSwgMTYpLFxuICAgICAgICAgICAgICAgIFwiZ1wiOiBwYXJzZUludChkWzNdK2RbNF0sIDE2KSxcbiAgICAgICAgICAgICAgICBcImJcIjogcGFyc2VJbnQoZFs1XStkWzZdLCAxNiksXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3JcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIjXCJ9LCBcImhleGRpZ2l0XCIsIFwiaGV4ZGlnaXRcIiwgXCJoZXhkaWdpdFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBcbiAgICAgICAgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBcInJcIjogcGFyc2VJbnQoZFsxXStkWzFdLCAxNiksXG4gICAgICAgICAgICAgICAgXCJnXCI6IHBhcnNlSW50KGRbMl0rZFsyXSwgMTYpLFxuICAgICAgICAgICAgICAgIFwiYlwiOiBwYXJzZUludChkWzNdK2RbM10sIDE2KSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvciRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInJcIn0sIHtcImxpdGVyYWxcIjpcImdcIn0sIHtcImxpdGVyYWxcIjpcImJcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yXCIsIFwic3ltYm9sc1wiOiBbXCJjc3Njb2xvciRzdHJpbmckMVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKVwifV0sIFwicG9zdHByb2Nlc3NcIjogJCh7XCJyXCI6IDQsIFwiZ1wiOiA4LCBcImJcIjogMTJ9KX0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yJHN0cmluZyQyXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiaFwifSwge1wibGl0ZXJhbFwiOlwic1wifSwge1wibGl0ZXJhbFwiOlwibFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3JcIiwgXCJzeW1ib2xzXCI6IFtcImNzc2NvbG9yJHN0cmluZyQyXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIpXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAkKHtcImhcIjogNCwgXCJzXCI6IDgsIFwibFwiOiAxMn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3Ikc3RyaW5nJDNcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJyXCJ9LCB7XCJsaXRlcmFsXCI6XCJnXCJ9LCB7XCJsaXRlcmFsXCI6XCJiXCJ9LCB7XCJsaXRlcmFsXCI6XCJhXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJjc3Njb2xvclwiLCBcInN5bWJvbHNcIjogW1wiY3NzY29sb3Ikc3RyaW5nJDNcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIihcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImRlY2ltYWxcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6ICQoe1wiclwiOiA0LCBcImdcIjogOCwgXCJiXCI6IDEyLCBcImFcIjogMTZ9KX0sXG4gICAge1wibmFtZVwiOiBcImNzc2NvbG9yJHN0cmluZyQ0XCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiaFwifSwge1wibGl0ZXJhbFwiOlwic1wifSwge1wibGl0ZXJhbFwiOlwibFwifSwge1wibGl0ZXJhbFwiOlwiYVwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzY29sb3JcIiwgXCJzeW1ib2xzXCI6IFtcImNzc2NvbG9yJHN0cmluZyQ0XCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcIl9cIiwgXCJjb2xudW1cIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcImNvbG51bVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLFwifSwgXCJfXCIsIFwiY29sbnVtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIsXCJ9LCBcIl9cIiwgXCJkZWNpbWFsXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIpXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAkKHtcImhcIjogNCwgXCJzXCI6IDgsIFwibFwiOiAxMiwgXCJhXCI6IDE2fSl9LFxuICAgIHtcIm5hbWVcIjogXCJoZXhkaWdpdFwiLCBcInN5bWJvbHNcIjogWy9bYS1mQS1GMC05XS9dfSxcbiAgICB7XCJuYW1lXCI6IFwiY29sbnVtXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9pbnRcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJjb2xudW1cIiwgXCJzeW1ib2xzXCI6IFtcInBlcmNlbnRhZ2VcIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIGZ1bmN0aW9uKGQpIHtyZXR1cm4gTWF0aC5mbG9vcihkWzBdKjI1NSk7IH1cbiAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwiZXZhbCRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcInZcIn0sIHtcImxpdGVyYWxcIjpcImFcIn0sIHtcImxpdGVyYWxcIjpcImxcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcImV2YWwkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJBU1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcImV2YWwkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImV2YWxcIiwgXCJzeW1ib2xzXCI6IFtcImV2YWwkc3RyaW5nJDFcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIihcIn0sIFwiX1wiLCBcImV2YWwkZWJuZiQxXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIpXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBudGgoNCl9LFxuICAgIHtcIm5hbWVcIjogXCJBU1wiLCBcInN5bWJvbHNcIjogW1wiQVNcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIitcIn0sIFwiX1wiLCBcIk1EXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbYSwgXzEsIF8yLCBfMywgYl0pID0+ICh7dHlwZTogJ2JpbmFyeV9vcCcsIG9wOiBcIitcIiwgbGVmdDogYSwgcmlnaHQ6IGJ9KX0sXG4gICAge1wibmFtZVwiOiBcIkFTXCIsIFwic3ltYm9sc1wiOiBbXCJBU1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiLVwifSwgXCJfXCIsIFwiTURcIl0sIFwicG9zdHByb2Nlc3NcIjogKFthLCBfMSwgXzIsIF8zLCBiXSkgPT4gKHt0eXBlOiAnYmluYXJ5X29wJywgb3A6IFwiLVwiLCBsZWZ0OiBhLCByaWdodDogYn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiQVNcIiwgXCJzeW1ib2xzXCI6IFtcIk1EXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiTURcIiwgXCJzeW1ib2xzXCI6IFtcIk1EXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIqXCJ9LCBcIl9cIiwgXCJQXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbYSwgXzEsIF8yLCBfMywgYl0pID0+ICh7dHlwZTogJ2JpbmFyeV9vcCcsIG9wOiBcIipcIiwgbGVmdDogYSwgcmlnaHQ6IGJ9KX0sXG4gICAge1wibmFtZVwiOiBcIk1EXCIsIFwic3ltYm9sc1wiOiBbXCJNRFwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiL1wifSwgXCJfXCIsIFwiUFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2EsIF8xLCBfMiwgXzMsIGJdKSA9PiAoe3R5cGU6ICdiaW5hcnlfb3AnLCBvcDogXCIvXCIsIGxlZnQ6IGEsIHJpZ2h0OiBifSl9LFxuICAgIHtcIm5hbWVcIjogXCJNRFwiLCBcInN5bWJvbHNcIjogW1wiTURcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIiVcIn0sIFwiX1wiLCBcIlBcIl0sIFwicG9zdHByb2Nlc3NcIjogKFthLCBfMSwgXzIsIF8zLCBiXSkgPT4gKHt0eXBlOiAnYmluYXJ5X29wJywgb3A6IFwiJVwiLCBsZWZ0OiBhLCByaWdodDogYn0pfSxcbiAgICB7XCJuYW1lXCI6IFwiTURcIiwgXCJzeW1ib2xzXCI6IFtcIlBcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJQXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiKFwifSwgXCJfXCIsIFwiQVNcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IG50aCgyKX0sXG4gICAge1wibmFtZVwiOiBcIlBcIiwgXCJzeW1ib2xzXCI6IFtcIk5cIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJOXCIsIFwic3ltYm9sc1wiOiBbXCJmbG9hdFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3hdKSA9PiAoe3R5cGU6ICdudW1iZXInLCB2YWx1ZTogeH0pfSxcbiAgICB7XCJuYW1lXCI6IFwiTlwiLCBcInN5bWJvbHNcIjogW1wiZnVuY1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcIk5cIiwgXCJzeW1ib2xzXCI6IFtcImRxc3RyaW5nXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbeF0pID0+ICh7dHlwZTogJ3N0cmluZycsIHZhbHVlOiB4fSl9LFxuICAgIHtcIm5hbWVcIjogXCJmbG9hdFwiLCBcInN5bWJvbHNcIjogW1wiaW50XCIsIHtcImxpdGVyYWxcIjpcIi5cIn0sIFwiaW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6IChkKSA9PiBwYXJzZUZsb2F0KGRbMF0gKyBkWzFdICsgZFsyXSl9LFxuICAgIHtcIm5hbWVcIjogXCJmbG9hdFwiLCBcInN5bWJvbHNcIjogW1wiaW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6IChkKSA9PiBwYXJzZUludChkWzBdKX0sXG4gICAge1wibmFtZVwiOiBcImZ1bmMkZWJuZiQxJHN1YmV4cHJlc3Npb24kMVwiLCBcInN5bWJvbHNcIjogW1wiX1wiLCBcImZ1bmN0aW9uX2FyZ1wiXX0sXG4gICAge1wibmFtZVwiOiBcImZ1bmMkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJmdW5jJGVibmYkMSRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJmdW5jJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJmdW5jXCIsIFwic3ltYm9sc1wiOiBbXCJ0ZXJtXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIoXCJ9LCBcImZ1bmMkZWJuZiQxXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCIpXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2Z1bmMsIF8xLCBfMiwgYXJnc10pID0+ICh7dHlwZTogJ2Z1bmN0aW9uJywgZnVuYzogZnVuYywgYXJnczogYXJncyA/IGFyZ3NbMV0gOiBbXX0pfSxcbiAgICB7XCJuYW1lXCI6IFwiZnVuY3Rpb25fYXJnXCIsIFwic3ltYm9sc1wiOiBbXCJBU1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2FyZ10pID0+IFthcmddfSxcbiAgICB7XCJuYW1lXCI6IFwiZnVuY3Rpb25fYXJnXCIsIFwic3ltYm9sc1wiOiBbXCJmdW5jdGlvbl9hcmdcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcIkFTXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbYXJncywgXzEsIF8yLCBfMywgYXJnXSkgPT4gYXJncy5jb25jYXQoYXJnKX0sXG4gICAge1wibmFtZVwiOiBcImNzcyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwiY3NzJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiY3NzJGVibmYkMVwiLCBcInJ1bGVcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcImNzc1wiLCBcInN5bWJvbHNcIjogW1wiX1wiLCBcImNzcyRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgcnVsZXNdKSA9PiBydWxlc30sXG4gICAge1wibmFtZVwiOiBcInJ1bGUkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJhY3Rpb25cIl19LFxuICAgIHtcIm5hbWVcIjogXCJydWxlJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wicnVsZSRlYm5mJDFcIiwgXCJhY3Rpb25cIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInJ1bGVcIiwgXCJzeW1ib2xzXCI6IFtcInNlbGVjdG9yc1wiLCBcInJ1bGUkZWJuZiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbcywgYV0pID0+ICh7c2VsZWN0b3JzOiBzLCBhY3Rpb25zOiBhID8gYS5yZWR1Y2UoKHgseSkgPT4geC5jb25jYXQoeSksIFtdKSA6IFtdfSl9LFxuICAgIHtcIm5hbWVcIjogXCJydWxlXCIsIFwic3ltYm9sc1wiOiBbXCJpbXBvcnRcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtpbXBdKSA9PiAoeydpbXBvcnQnIDogaW1wfSl9LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvcnNcIiwgXCJzeW1ib2xzXCI6IFtcInNlbGVjdG9yXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3JzXCIsIFwic3ltYm9sc1wiOiBbXCJzZWxlY3RvcnNcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIixcIn0sIFwiX1wiLCBcInNlbGVjdG9yXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbbGlzdCwgXzEsIF8yLCBfMywgaXRlbV0pID0+IGxpc3QuY29uY2F0KGl0ZW0pfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3JzXCIsIFwic3ltYm9sc1wiOiBbXCJuZXN0ZWRfc2VsZWN0b3JcIl19LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJzZWxlY3RvciRlYm5mJDFcIiwgXCJjbGFzc1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXCJ6b29tXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkM1wiLCBcInN5bWJvbHNcIjogW1wiYXR0cmlidXRlc1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkM1wiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDRcIiwgXCJzeW1ib2xzXCI6IFtcInBzZXVkb2NsYXNzZXNcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvciRlYm5mJDRcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwic2VsZWN0b3IkZWJuZiQ1XCIsIFwic3ltYm9sc1wiOiBbXCJsYXllclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInNlbGVjdG9yJGVibmYkNVwiLCBcInN5bWJvbHNcIjogW10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24oZCkge3JldHVybiBudWxsO319LFxuICAgIHtcIm5hbWVcIjogXCJzZWxlY3RvclwiLCBcInN5bWJvbHNcIjogW1widHlwZVwiLCBcInNlbGVjdG9yJGVibmYkMVwiLCBcInNlbGVjdG9yJGVibmYkMlwiLCBcInNlbGVjdG9yJGVibmYkM1wiLCBcInNlbGVjdG9yJGVibmYkNFwiLCBcInNlbGVjdG9yJGVibmYkNVwiLCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogXG4gICAgICAgIChbdHlwZSwgY2xhc3Nlcywgem9vbSwgYXR0cmlidXRlcywgcHNldWRvY2xhc3NlcywgbGF5ZXJdKSA9PiAoe1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHpvb206IHpvb20sXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgcHNldWRvY2xhc3NlczogcHNldWRvY2xhc3NlcyxcbiAgICAgICAgICAgIGNsYXNzZXM6IGNsYXNzZXMsXG4gICAgICAgICAgICBsYXllcjogbGF5ZXJcbiAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICB7XCJuYW1lXCI6IFwibmVzdGVkX3NlbGVjdG9yXCIsIFwic3ltYm9sc1wiOiBbXCJzZWxlY3RvclwiLCBcIl9fXCIsIFwic2VsZWN0b3JcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtwYXJlbnQsIF8sIGNoaWxkXSkgPT4ge2NoaWxkLnBhcmVudCA9IHBhcmVudDsgcmV0dXJuIGNoaWxkO319LFxuICAgIHtcIm5hbWVcIjogXCJuZXN0ZWRfc2VsZWN0b3JcIiwgXCJzeW1ib2xzXCI6IFtcIm5lc3RlZF9zZWxlY3RvclwiLCBcIl9fXCIsIFwic2VsZWN0b3JcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtwYXJlbnQsIF8sIGNoaWxkXSkgPT4ge2NoaWxkLnBhcmVudCA9IHBhcmVudDsgcmV0dXJuIGNoaWxkO319LFxuICAgIHtcIm5hbWVcIjogXCJwc2V1ZG9jbGFzc2VzJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wicHNldWRvY2xhc3NcIl19LFxuICAgIHtcIm5hbWVcIjogXCJwc2V1ZG9jbGFzc2VzJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wicHNldWRvY2xhc3NlcyRlYm5mJDFcIiwgXCJwc2V1ZG9jbGFzc1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwicHNldWRvY2xhc3Nlc1wiLCBcInN5bWJvbHNcIjogW1wicHNldWRvY2xhc3NlcyRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJwc2V1ZG9jbGFzc1wiLCBcInN5bWJvbHNcIjogW1wiX1wiLCB7XCJsaXRlcmFsXCI6XCI6XCJ9LCBcInRlcm1cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgXzIsIHBzZXVkb2NsYXNzXSkgPT4gcHNldWRvY2xhc3N9LFxuICAgIHtcIm5hbWVcIjogXCJsYXllciRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIjpcIn0sIHtcImxpdGVyYWxcIjpcIjpcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcImxheWVyXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIFwibGF5ZXIkc3RyaW5nJDFcIiwgXCJ0ZXJtXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbXzEsIF8yLCB2YWx1ZV0pID0+IHZhbHVlfSxcbiAgICB7XCJuYW1lXCI6IFwiYXR0cmlidXRlcyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcImF0dHJpYnV0ZVwiXX0sXG4gICAge1wibmFtZVwiOiBcImF0dHJpYnV0ZXMkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJhdHRyaWJ1dGVzJGVibmYkMVwiLCBcImF0dHJpYnV0ZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiYXR0cmlidXRlc1wiLCBcInN5bWJvbHNcIjogW1wiYXR0cmlidXRlcyRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJhdHRyaWJ1dGVcIiwgXCJzeW1ib2xzXCI6IFtcIl9cIiwge1wibGl0ZXJhbFwiOlwiW1wifSwgXCJwcmVkaWNhdGVcIiwge1wibGl0ZXJhbFwiOlwiXVwifV0sIFwicG9zdHByb2Nlc3NcIjogKFtfMCwgXzEsIHByZWRpY2F0ZXMsIF8yXSkgPT4gcHJlZGljYXRlc30sXG4gICAge1wibmFtZVwiOiBcInByZWRpY2F0ZVwiLCBcInN5bWJvbHNcIjogW1widGFnXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbdGFnXSkgPT4gKHt0eXBlOiBcInByZXNlbmNlXCIsIGtleTogdGFnfSl9LFxuICAgIHtcIm5hbWVcIjogXCJwcmVkaWNhdGVcIiwgXCJzeW1ib2xzXCI6IFtcInRhZ1wiLCBcIl9cIiwgXCJvcGVyYXRvclwiLCBcIl9cIiwgXCJ2YWx1ZVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW3RhZywgXzEsIG9wLCBfMiwgdmFsdWVdKSA9PiAoe3R5cGU6IFwiY21wXCIsIGtleTogdGFnLCB2YWx1ZTogdmFsdWUsIG9wOiBvcH0pfSxcbiAgICB7XCJuYW1lXCI6IFwicHJlZGljYXRlXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiIVwifSwgXCJ0YWdcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfLCB0YWddKSA9PiAoe3R5cGU6IFwiYWJzZW5jZVwiLCBrZXk6IHRhZ30pfSxcbiAgICB7XCJuYW1lXCI6IFwicHJlZGljYXRlJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiflwifSwge1wibGl0ZXJhbFwiOlwiPVwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwicHJlZGljYXRlXCIsIFwic3ltYm9sc1wiOiBbXCJ0YWdcIiwgXCJwcmVkaWNhdGUkc3RyaW5nJDFcIiwgXCJyZWdleHBcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt0YWcsIG9wLCB2YWx1ZV0pID0+ICh7dHlwZTogXCJyZWdleHBcIiwga2V5OiB0YWcsIHZhbHVlOiB2YWx1ZSwgb3A6IG9wfSl9LFxuICAgIHtcIm5hbWVcIjogXCJ0YWdcIiwgXCJzeW1ib2xzXCI6IFtcInN0cmluZ1wiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInZhbHVlXCIsIFwic3ltYm9sc1wiOiBbXCJzdHJpbmdcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzdHJpbmdcIiwgXCJzeW1ib2xzXCI6IFtcImRxc3RyaW5nXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwic3RyaW5nJGVibmYkMVwiLCBcInN5bWJvbHNcIjogWy9bYS16QS1aMC05Ol9cXC1dL119LFxuICAgIHtcIm5hbWVcIjogXCJzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJzdHJpbmckZWJuZiQxXCIsIC9bYS16QS1aMC05Ol9cXC1dL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInN0cmluZ1wiLCBcInN5bWJvbHNcIjogW1wic3RyaW5nJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2NoYXJzXSkgPT4gY2hhcnMuam9pbihcIlwiKX0sXG4gICAge1wibmFtZVwiOiBcInRlcm0kZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbL1thLXpBLVowLTlfXS9dfSxcbiAgICB7XCJuYW1lXCI6IFwidGVybSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInRlcm0kZWJuZiQxXCIsIC9bYS16QS1aMC05X10vXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidGVybVwiLCBcInN5bWJvbHNcIjogW1widGVybSRlYm5mJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtjaGFyc10pID0+IGNoYXJzLmpvaW4oXCJcIil9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIj1cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwib3BlcmF0b3Ikc3RyaW5nJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIhXCJ9LCB7XCJsaXRlcmFsXCI6XCI9XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW1wib3BlcmF0b3Ikc3RyaW5nJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIjxcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwib3BlcmF0b3Ikc3RyaW5nJDJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCI8XCJ9LCB7XCJsaXRlcmFsXCI6XCI9XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW1wib3BlcmF0b3Ikc3RyaW5nJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIj5cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwib3BlcmF0b3Ikc3RyaW5nJDNcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCI+XCJ9LCB7XCJsaXRlcmFsXCI6XCI9XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJvcGVyYXRvclwiLCBcInN5bWJvbHNcIjogW1wib3BlcmF0b3Ikc3RyaW5nJDNcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ6b29tXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIHtcImxpdGVyYWxcIjpcInxcIn0sIC9benNdLywgXCJ6b29tX2ludGVydmFsXCJdLCBcInBvc3Rwcm9jZXNzXCI6ICAoW18sIHBpcGUsIHR5cGUsIHZhbHVlXSkgPT4ge1xuICAgICAgICBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50eXBlID0gdHlwZTtcbiAgICAgICAgXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIHtcIm5hbWVcIjogXCJ6b29tX2ludGVydmFsXCIsIFwic3ltYm9sc1wiOiBbXCJ1bnNpZ25lZF9pbnRcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt2YWx1ZV0pID0+ICh7YmVnaW46IHZhbHVlLCBlbmQ6IHZhbHVlfSl9LFxuICAgIHtcIm5hbWVcIjogXCJ6b29tX2ludGVydmFsJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1widW5zaWduZWRfaW50XCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiem9vbV9pbnRlcnZhbCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uKGQpIHtyZXR1cm4gbnVsbDt9fSxcbiAgICB7XCJuYW1lXCI6IFwiem9vbV9pbnRlcnZhbCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcInVuc2lnbmVkX2ludFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInpvb21faW50ZXJ2YWwkZWJuZiQyXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcInpvb21faW50ZXJ2YWxcIiwgXCJzeW1ib2xzXCI6IFtcInpvb21faW50ZXJ2YWwkZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcIi1cIn0sIFwiem9vbV9pbnRlcnZhbCRlYm5mJDJcIl0sIFwicG9zdHByb2Nlc3NcIjogKFtiZWdpbiwgaW50ZXJ2YWwsIGVuZF0pID0+ICh7YmVnaW46IGJlZ2luLCBlbmQ6IGVuZH0pfSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHAkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJyZWdleHAkZWJuZiQxXCIsIFwicmVnZXhwX2NoYXJcIl0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwJGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1wicmVnZXhwJGVibmYkMlwiLCBcInJlZ2V4cF9mbGFnXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHBcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIvXCJ9LCBcInJlZ2V4cCRlYm5mJDFcIiwge1wibGl0ZXJhbFwiOlwiL1wifSwgXCJyZWdleHAkZWJuZiQyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbXzEsIGFyciwgXzIsIGZsYWdzXSkgPT4gKHtyZWdleHA6IGFyci5qb2luKFwiXCIpLCBmbGFnczogZmxhZ3Muam9pbihcIlwiKX0pfSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwX2NoYXJcIiwgXCJzeW1ib2xzXCI6IFsvW15cXC9dL119LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHBfY2hhclwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi9cIn1dfSxcbiAgICB7XCJuYW1lXCI6IFwicmVnZXhwX2ZsYWdcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJpXCJ9XX0sXG4gICAge1wibmFtZVwiOiBcInJlZ2V4cF9mbGFnXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiZ1wifV19LFxuICAgIHtcIm5hbWVcIjogXCJyZWdleHBfZmxhZ1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIm1cIn1dfSxcbiAgICB7XCJuYW1lXCI6IFwiYWN0aW9uJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wic3RhdGVtZW50XCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiYWN0aW9uJGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiYWN0aW9uJGVibmYkMVwiLCBcInN0YXRlbWVudFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiYWN0aW9uXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwie1wifSwgXCJfXCIsIFwiYWN0aW9uJGVibmYkMVwiLCB7XCJsaXRlcmFsXCI6XCJ9XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgXzIsIHN0YXRlbWVudHMsIF8zLCBfNF0pID0+IChzdGF0ZW1lbnRzKX0sXG4gICAge1wibmFtZVwiOiBcImFjdGlvblwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIntcIn0sIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCJ9XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKCkgPT4gW119LFxuICAgIHtcIm5hbWVcIjogXCJzdGF0ZW1lbnRcIiwgXCJzeW1ib2xzXCI6IFtcInN0cmluZ1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiOlwifSwgXCJfXCIsIFwic3RhdGVtZW50X3ZhbHVlXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtrZXksIF8xLCBfMiwgXzMsIHZhbHVlLCBfNF0pID0+ICh7YWN0aW9uOiBcImt2XCIsIGs6IGtleSwgdjogdmFsdWV9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudCRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcInhcIn0sIHtcImxpdGVyYWxcIjpcImlcIn0sIHtcImxpdGVyYWxcIjpcInRcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudFwiLCBcInN5bWJvbHNcIjogW1wic3RhdGVtZW50JHN0cmluZyQxXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKCkgPT4gKHthY3Rpb246IFwiZXhpdFwifSl9LFxuICAgIHtcIm5hbWVcIjogXCJzdGF0ZW1lbnQkc3RyaW5nJDJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJzXCJ9LCB7XCJsaXRlcmFsXCI6XCJlXCJ9LCB7XCJsaXRlcmFsXCI6XCJ0XCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJzdGF0ZW1lbnRcIiwgXCJzeW1ib2xzXCI6IFtcInN0YXRlbWVudCRzdHJpbmckMlwiLCBcImNsYXNzXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgY2xzXSkgPT4gKHthY3Rpb246ICdzZXRfY2xhc3MnLCB2OiBjbHN9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudCRzdHJpbmckM1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInNcIn0sIHtcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcInRcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudFwiLCBcInN5bWJvbHNcIjogW1wic3RhdGVtZW50JHN0cmluZyQzXCIsIFwiX1wiLCBcInRhZ1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiO1wifSwgXCJfXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbXzEsIF8yLCB0YWddKSA9PiAoe2FjdGlvbjogJ3NldF90YWcnLCBrOiB0YWd9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudCRzdHJpbmckNFwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInNcIn0sIHtcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcInRcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudFwiLCBcInN5bWJvbHNcIjogW1wic3RhdGVtZW50JHN0cmluZyQ0XCIsIFwiX1wiLCBcInRhZ1wiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiPVwifSwgXCJfXCIsIFwic3RhdGVtZW50X3ZhbHVlXCIsIFwiX1wiLCB7XCJsaXRlcmFsXCI6XCI7XCJ9LCBcIl9cIl0sIFwicG9zdHByb2Nlc3NcIjogKFtfMSwgXzIsIHRhZywgXzMsIF80LCBfNSwgdmFsdWVdKSA9PiAoe2FjdGlvbjogJ3NldF90YWcnLCBrOiB0YWcsIHY6IHZhbHVlfSl9LFxuICAgIHtcIm5hbWVcIjogXCJjbGFzcyRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiIVwifSwgXCJfXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiY2xhc3MkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJjbGFzcyRlYm5mJDEkc3ViZXhwcmVzc2lvbiQxXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwiY2xhc3MkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImNsYXNzXCIsIFwic3ltYm9sc1wiOiBbXCJfXCIsIFwiY2xhc3MkZWJuZiQxXCIsIHtcImxpdGVyYWxcIjpcIi5cIn0sIFwidGVybVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW18xLCBub3QsIF8yLCBjbHNdKSA9PiAoeydjbGFzcyc6IGNscywgbm90OiBub3QgPyAhIW5vdCA6IGZhbHNlfSl9LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlJHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwid1wifSwge1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwieVwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZVwiLCBcInN5bWJvbHNcIjogW1widHlwZSRzdHJpbmckMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInR5cGUkc3RyaW5nJDJcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJuXCJ9LCB7XCJsaXRlcmFsXCI6XCJvXCJ9LCB7XCJsaXRlcmFsXCI6XCJkXCJ9LCB7XCJsaXRlcmFsXCI6XCJlXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlXCIsIFwic3ltYm9sc1wiOiBbXCJ0eXBlJHN0cmluZyQyXCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZSRzdHJpbmckM1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcInJcIn0sIHtcImxpdGVyYWxcIjpcImVcIn0sIHtcImxpdGVyYWxcIjpcImxcIn0sIHtcImxpdGVyYWxcIjpcImFcIn0sIHtcImxpdGVyYWxcIjpcInRcIn0sIHtcImxpdGVyYWxcIjpcImlcIn0sIHtcImxpdGVyYWxcIjpcIm9cIn0sIHtcImxpdGVyYWxcIjpcIm5cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInR5cGVcIiwgXCJzeW1ib2xzXCI6IFtcInR5cGUkc3RyaW5nJDNcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlJHN0cmluZyQ0XCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiYVwifSwge1wibGl0ZXJhbFwiOlwiclwifSwge1wibGl0ZXJhbFwiOlwiZVwifSwge1wibGl0ZXJhbFwiOlwiYVwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZVwiLCBcInN5bWJvbHNcIjogW1widHlwZSRzdHJpbmckNFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBpZH0sXG4gICAge1wibmFtZVwiOiBcInR5cGUkc3RyaW5nJDVcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCJsXCJ9LCB7XCJsaXRlcmFsXCI6XCJpXCJ9LCB7XCJsaXRlcmFsXCI6XCJuXCJ9LCB7XCJsaXRlcmFsXCI6XCJlXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBqb2luZXIoZCkge3JldHVybiBkLmpvaW4oJycpO319LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlXCIsIFwic3ltYm9sc1wiOiBbXCJ0eXBlJHN0cmluZyQ1XCJdLCBcInBvc3Rwcm9jZXNzXCI6IGlkfSxcbiAgICB7XCJuYW1lXCI6IFwidHlwZSRzdHJpbmckNlwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcImNcIn0sIHtcImxpdGVyYWxcIjpcImFcIn0sIHtcImxpdGVyYWxcIjpcIm5cIn0sIHtcImxpdGVyYWxcIjpcInZcIn0sIHtcImxpdGVyYWxcIjpcImFcIn0sIHtcImxpdGVyYWxcIjpcInNcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcInR5cGVcIiwgXCJzeW1ib2xzXCI6IFtcInR5cGUkc3RyaW5nJDZcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJ0eXBlXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiKlwifV0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJzdGF0ZW1lbnRfdmFsdWVcIiwgXCJzeW1ib2xzXCI6IFtcImRxc3RyaW5nXCJdLCBcInBvc3Rwcm9jZXNzXCI6IChbeF0pID0+ICh7dHlwZTogJ3N0cmluZycsIHY6IHh9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudF92YWx1ZVwiLCBcInN5bWJvbHNcIjogW1wiY3NzY29sb3JcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt4XSkgPT4gKHt0eXBlOiAnY3NzY29sb3InLCB2OiB4fSl9LFxuICAgIHtcIm5hbWVcIjogXCJzdGF0ZW1lbnRfdmFsdWVcIiwgXCJzeW1ib2xzXCI6IFtcImV2YWxcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt4XSkgPT4gKHt0eXBlOiAnZXZhbCcsIHY6IHh9KX0sXG4gICAge1wibmFtZVwiOiBcInN0YXRlbWVudF92YWx1ZVwiLCBcInN5bWJvbHNcIjogW1widXFzdHJpbmdcIl0sIFwicG9zdHByb2Nlc3NcIjogKFt4XSkgPT4gKHt0eXBlOiAnc3RyaW5nJywgdjogeH0pfSxcbiAgICB7XCJuYW1lXCI6IFwiaW1wb3J0JHN0cmluZyQxXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwiQFwifSwge1wibGl0ZXJhbFwiOlwiaVwifSwge1wibGl0ZXJhbFwiOlwibVwifSwge1wibGl0ZXJhbFwiOlwicFwifSwge1wibGl0ZXJhbFwiOlwib1wifSwge1wibGl0ZXJhbFwiOlwiclwifSwge1wibGl0ZXJhbFwiOlwidFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiaW1wb3J0JHN0cmluZyQyXCIsIFwic3ltYm9sc1wiOiBbe1wibGl0ZXJhbFwiOlwidVwifSwge1wibGl0ZXJhbFwiOlwiclwifSwge1wibGl0ZXJhbFwiOlwibFwifV0sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gam9pbmVyKGQpIHtyZXR1cm4gZC5qb2luKCcnKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwiaW1wb3J0JGVibmYkMSRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFtcIl9cIiwgXCJ0ZXJtXCJdfSxcbiAgICB7XCJuYW1lXCI6IFwiaW1wb3J0JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW1wiaW1wb3J0JGVibmYkMSRzdWJleHByZXNzaW9uJDFcIl0sIFwicG9zdHByb2Nlc3NcIjogaWR9LFxuICAgIHtcIm5hbWVcIjogXCJpbXBvcnQkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbihkKSB7cmV0dXJuIG51bGw7fX0sXG4gICAge1wibmFtZVwiOiBcImltcG9ydFwiLCBcInN5bWJvbHNcIjogW1wiaW1wb3J0JHN0cmluZyQxXCIsIFwiX1wiLCBcImltcG9ydCRzdHJpbmckMlwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiKFwifSwgXCJfXCIsIFwiZHFzdHJpbmdcIiwgXCJfXCIsIHtcImxpdGVyYWxcIjpcIilcIn0sIFwiaW1wb3J0JGVibmYkMVwiLCBcIl9cIiwge1wibGl0ZXJhbFwiOlwiO1wifV0sIFwicG9zdHByb2Nlc3NcIjogKGQpID0+ICh7IHVybDogZFs2XSwgcHNldWRvY2xhc3M6IGRbOV0gPyBkWzldWzFdIDogbnVsbH0pfSxcbiAgICB7XCJuYW1lXCI6IFwidXFzdHJpbmckZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJzcGNoYXJcIl19LFxuICAgIHtcIm5hbWVcIjogXCJ1cXN0cmluZyRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcInVxc3RyaW5nJGVibmYkMVwiLCBcInNwY2hhclwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwidXFzdHJpbmdcIiwgXCJzeW1ib2xzXCI6IFtcInVxc3RyaW5nJGVibmYkMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoW2NoYXJzXSkgPT4gY2hhcnMuam9pbihcIlwiKX0sXG4gICAge1wibmFtZVwiOiBcInNwY2hhclwiLCBcInN5bWJvbHNcIjogWy9bYS16QS1aMC05XFwtXzouLFxcXFxcXC9dL119LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRzdHJpbmckMVwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi9cIn0sIHtcImxpdGVyYWxcIjpcIipcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMVwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JGVibmYkMVwiLCAvW14qXS9dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDFcIiwgXCJzeW1ib2xzXCI6IFt7XCJsaXRlcmFsXCI6XCIqXCJ9XX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMVwiLCB7XCJsaXRlcmFsXCI6XCIqXCJ9XSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtdfSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMSRlYm5mJDJcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQyXCIsIC9bXipdL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDFcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JGVibmYkMiRzdWJleHByZXNzaW9uJDEkZWJuZiQxXCIsIC9bXlxcLypdLywgXCJtY29tbWVudCRlYm5mJDIkc3ViZXhwcmVzc2lvbiQxJGVibmYkMlwiXX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkMlwiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQyXCIsIFwibWNvbW1lbnQkZWJuZiQyJHN1YmV4cHJlc3Npb24kMVwiXSwgXCJwb3N0cHJvY2Vzc1wiOiBmdW5jdGlvbiBhcnJwdXNoKGQpIHtyZXR1cm4gZFswXS5jb25jYXQoW2RbMV1dKTt9fSxcbiAgICB7XCJuYW1lXCI6IFwibWNvbW1lbnQkZWJuZiQzXCIsIFwic3ltYm9sc1wiOiBbXX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkM1wiLCBcInN5bWJvbHNcIjogW1wibWNvbW1lbnQkZWJuZiQzXCIsIHtcImxpdGVyYWxcIjpcIipcIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGFycnB1c2goZCkge3JldHVybiBkWzBdLmNvbmNhdChbZFsxXV0pO319LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRzdHJpbmckMlwiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIipcIn0sIHtcImxpdGVyYWxcIjpcIi9cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50XCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudCRzdHJpbmckMVwiLCBcIm1jb21tZW50JGVibmYkMVwiLCBcIm1jb21tZW50JGVibmYkMlwiLCBcIm1jb21tZW50JGVibmYkM1wiLCBcIm1jb21tZW50JHN0cmluZyQyXCJdLCBcInBvc3Rwcm9jZXNzXCI6ICgpID0+IG51bGx9LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRzdHJpbmckM1wiLCBcInN5bWJvbHNcIjogW3tcImxpdGVyYWxcIjpcIi9cIn0sIHtcImxpdGVyYWxcIjpcIi9cIn1dLCBcInBvc3Rwcm9jZXNzXCI6IGZ1bmN0aW9uIGpvaW5lcihkKSB7cmV0dXJuIGQuam9pbignJyk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50JGVibmYkNFwiLCBcInN5bWJvbHNcIjogW119LFxuICAgIHtcIm5hbWVcIjogXCJtY29tbWVudCRlYm5mJDRcIiwgXCJzeW1ib2xzXCI6IFtcIm1jb21tZW50JGVibmYkNFwiLCAvW15cXG5dL10sIFwicG9zdHByb2Nlc3NcIjogZnVuY3Rpb24gYXJycHVzaChkKSB7cmV0dXJuIGRbMF0uY29uY2F0KFtkWzFdXSk7fX0sXG4gICAge1wibmFtZVwiOiBcIm1jb21tZW50XCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudCRzdHJpbmckM1wiLCBcIm1jb21tZW50JGVibmYkNFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoKSA9PiBudWxsfSxcbiAgICB7XCJuYW1lXCI6IFwid3NjaGFyXCIsIFwic3ltYm9sc1wiOiBbXCJtY29tbWVudFwiXSwgXCJwb3N0cHJvY2Vzc1wiOiAoKSA9PiBudWxsfVxuXVxuICAsIFBhcnNlclN0YXJ0OiBcImNzc1wiXG59XG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICBtb2R1bGUuZXhwb3J0cyA9IGdyYW1tYXI7XG59IGVsc2Uge1xuICAgd2luZG93LmdyYW1tYXIgPSBncmFtbWFyO1xufVxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbmVhcmxleSA9IHJlcXVpcmUoXCJuZWFybGV5XCIpO1xuXG5jb25zdCBncmFtbWFyID0gcmVxdWlyZShcIi4vZ3JhbW1hci5qc1wiKTtcblxuZnVuY3Rpb24gcGFyc2UodGV4dCkge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgbmVhcmxleS5QYXJzZXIobmVhcmxleS5HcmFtbWFyLmZyb21Db21waWxlZChncmFtbWFyKSk7XG5cbiAgcGFyc2VyLmZlZWQodGV4dC50cmltKCkpO1xuXG4gIGlmICghcGFyc2VyLnJlc3VsdHMpIHtcbiAgICB0aHJvdyBcIlVuZXhwZWN0ZWQgZW5kIG9mIGZpbGVcIlxuICB9XG5cbiAgaWYgKHBhcnNlci5yZXN1bHRzLmxlbmd0aCAhPSAxKSB7XG4gICAgdGhyb3cgXCJBbWJpZ3VvdXMgZ3JhbW1hcjogXCIgKyBKU09OLnN0cmluZ2lmeShwYXJzZXIucmVzdWx0cywgMiwgMilcbiAgfVxuXG4gIHJldHVybiBwYXJzZXIucmVzdWx0c1swXTtcbn1cblxuY29uc3QgcGFyc2VyID0ge1xuICBwYXJzZTogcGFyc2Vcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHBhcnNlcjtcbn0gZWxzZSB7XG4gIHdpbmRvdy5NYXBDU1NQYXJzZXIgPSBwYXJzZXI7XG59XG4iLCIoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290Lm5lYXJsZXkgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIFJ1bGUobmFtZSwgc3ltYm9scywgcG9zdHByb2Nlc3MpIHtcbiAgICAgICAgdGhpcy5pZCA9ICsrUnVsZS5oaWdoZXN0SWQ7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuc3ltYm9scyA9IHN5bWJvbHM7ICAgICAgICAvLyBhIGxpc3Qgb2YgbGl0ZXJhbCB8IHJlZ2V4IGNsYXNzIHwgbm9udGVybWluYWxcbiAgICAgICAgdGhpcy5wb3N0cHJvY2VzcyA9IHBvc3Rwcm9jZXNzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgUnVsZS5oaWdoZXN0SWQgPSAwO1xuXG4gICAgUnVsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbih3aXRoQ3Vyc29yQXQpIHtcbiAgICAgICAgZnVuY3Rpb24gc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UgKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlLmxpdGVyYWwgPyBKU09OLnN0cmluZ2lmeShlLmxpdGVyYWwpIDpcbiAgICAgICAgICAgICAgICAgICBlLnR5cGUgPyAnJScgKyBlLnR5cGUgOiBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN5bWJvbFNlcXVlbmNlID0gKHR5cGVvZiB3aXRoQ3Vyc29yQXQgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5zeW1ib2xzLm1hcChzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSkuam9pbignICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKCAgIHRoaXMuc3ltYm9scy5zbGljZSgwLCB3aXRoQ3Vyc29yQXQpLm1hcChzdHJpbmdpZnlTeW1ib2xTZXF1ZW5jZSkuam9pbignICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIOKXjyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0aGlzLnN5bWJvbHMuc2xpY2Uod2l0aEN1cnNvckF0KS5tYXAoc3RyaW5naWZ5U3ltYm9sU2VxdWVuY2UpLmpvaW4oJyAnKSAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArIFwiIOKGkiBcIiArIHN5bWJvbFNlcXVlbmNlO1xuICAgIH1cblxuXG4gICAgLy8gYSBTdGF0ZSBpcyBhIHJ1bGUgYXQgYSBwb3NpdGlvbiBmcm9tIGEgZ2l2ZW4gc3RhcnRpbmcgcG9pbnQgaW4gdGhlIGlucHV0IHN0cmVhbSAocmVmZXJlbmNlKVxuICAgIGZ1bmN0aW9uIFN0YXRlKHJ1bGUsIGRvdCwgcmVmZXJlbmNlLCB3YW50ZWRCeSkge1xuICAgICAgICB0aGlzLnJ1bGUgPSBydWxlO1xuICAgICAgICB0aGlzLmRvdCA9IGRvdDtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLndhbnRlZEJ5ID0gd2FudGVkQnk7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRoaXMuZG90ID09PSBydWxlLnN5bWJvbHMubGVuZ3RoO1xuICAgIH1cblxuICAgIFN0YXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJ7XCIgKyB0aGlzLnJ1bGUudG9TdHJpbmcodGhpcy5kb3QpICsgXCJ9LCBmcm9tOiBcIiArICh0aGlzLnJlZmVyZW5jZSB8fCAwKTtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLm5leHRTdGF0ZSA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZSh0aGlzLnJ1bGUsIHRoaXMuZG90ICsgMSwgdGhpcy5yZWZlcmVuY2UsIHRoaXMud2FudGVkQnkpO1xuICAgICAgICBzdGF0ZS5sZWZ0ID0gdGhpcztcbiAgICAgICAgc3RhdGUucmlnaHQgPSBjaGlsZDtcbiAgICAgICAgaWYgKHN0YXRlLmlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHN0YXRlLmRhdGEgPSBzdGF0ZS5idWlsZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuXG4gICAgU3RhdGUucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZS5yaWdodC5kYXRhKTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICAgIH0gd2hpbGUgKG5vZGUubGVmdCk7XG4gICAgICAgIGNoaWxkcmVuLnJldmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgIH07XG5cbiAgICBTdGF0ZS5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJ1bGUucG9zdHByb2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMucnVsZS5wb3N0cHJvY2Vzcyh0aGlzLmRhdGEsIHRoaXMucmVmZXJlbmNlLCBQYXJzZXIuZmFpbCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBDb2x1bW4oZ3JhbW1hciwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgICAgICB0aGlzLndhbnRzID0ge307IC8vIHN0YXRlcyBpbmRleGVkIGJ5IHRoZSBub24tdGVybWluYWwgdGhleSBleHBlY3RcbiAgICAgICAgdGhpcy5zY2FubmFibGUgPSBbXTsgLy8gbGlzdCBvZiBzdGF0ZXMgdGhhdCBleHBlY3QgYSB0b2tlblxuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IHt9OyAvLyBzdGF0ZXMgdGhhdCBhcmUgbnVsbGFibGVcbiAgICB9XG5cblxuICAgIENvbHVtbi5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKG5leHRDb2x1bW4pIHtcbiAgICAgICAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgICAgICB2YXIgd2FudHMgPSB0aGlzLndhbnRzO1xuICAgICAgICB2YXIgY29tcGxldGVkID0gdGhpcy5jb21wbGV0ZWQ7XG5cbiAgICAgICAgZm9yICh2YXIgdyA9IDA7IHcgPCBzdGF0ZXMubGVuZ3RoOyB3KyspIHsgLy8gbmIuIHdlIHB1c2goKSBkdXJpbmcgaXRlcmF0aW9uXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbd107XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmRhdGEgIT09IFBhcnNlci5mYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciB3YW50ZWRCeSA9IHN0YXRlLndhbnRlZEJ5O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gd2FudGVkQnkubGVuZ3RoOyBpLS07ICkgeyAvLyB0aGlzIGxpbmUgaXMgaG90XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IHdhbnRlZEJ5W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZShsZWZ0LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBzcGVjaWFsLWNhc2UgbnVsbGFibGVzXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5yZWZlcmVuY2UgPT09IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBmdXR1cmUgcHJlZGljdG9ycyBvZiB0aGlzIHJ1bGUgZ2V0IGNvbXBsZXRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHAgPSBzdGF0ZS5ydWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jb21wbGV0ZWRbZXhwXSA9IHRoaXMuY29tcGxldGVkW2V4cF0gfHwgW10pLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHF1ZXVlIHNjYW5uYWJsZSBzdGF0ZXNcbiAgICAgICAgICAgICAgICB2YXIgZXhwID0gc3RhdGUucnVsZS5zeW1ib2xzW3N0YXRlLmRvdF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBleHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nhbm5hYmxlLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwcmVkaWN0XG4gICAgICAgICAgICAgICAgaWYgKHdhbnRzW2V4cF0pIHtcbiAgICAgICAgICAgICAgICAgICAgd2FudHNbZXhwXS5wdXNoKHN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkLmhhc093blByb3BlcnR5KGV4cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudWxscyA9IGNvbXBsZXRlZFtleHBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByaWdodCA9IG51bGxzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGUoc3RhdGUsIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbnRzW2V4cF0gPSBbc3RhdGVdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWRpY3QoZXhwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBDb2x1bW4ucHJvdG90eXBlLnByZWRpY3QgPSBmdW5jdGlvbihleHApIHtcbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5ncmFtbWFyLmJ5TmFtZVtleHBdIHx8IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByID0gcnVsZXNbaV07XG4gICAgICAgICAgICB2YXIgd2FudGVkQnkgPSB0aGlzLndhbnRzW2V4cF07XG4gICAgICAgICAgICB2YXIgcyA9IG5ldyBTdGF0ZShyLCAwLCB0aGlzLmluZGV4LCB3YW50ZWRCeSk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ29sdW1uLnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIHZhciBjb3B5ID0gbGVmdC5uZXh0U3RhdGUocmlnaHQpO1xuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKGNvcHkpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gR3JhbW1hcihydWxlcywgc3RhcnQpIHtcbiAgICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQgfHwgdGhpcy5ydWxlc1swXS5uYW1lO1xuICAgICAgICB2YXIgYnlOYW1lID0gdGhpcy5ieU5hbWUgPSB7fTtcbiAgICAgICAgdGhpcy5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGUpIHtcbiAgICAgICAgICAgIGlmICghYnlOYW1lLmhhc093blByb3BlcnR5KHJ1bGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICBieU5hbWVbcnVsZS5uYW1lXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnlOYW1lW3J1bGUubmFtZV0ucHVzaChydWxlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU28gd2UgY2FuIGFsbG93IHBhc3NpbmcgKHJ1bGVzLCBzdGFydCkgZGlyZWN0bHkgdG8gUGFyc2VyIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIEdyYW1tYXIuZnJvbUNvbXBpbGVkID0gZnVuY3Rpb24ocnVsZXMsIHN0YXJ0KSB7XG4gICAgICAgIHZhciBsZXhlciA9IHJ1bGVzLkxleGVyO1xuICAgICAgICBpZiAocnVsZXMuUGFyc2VyU3RhcnQpIHtcbiAgICAgICAgICBzdGFydCA9IHJ1bGVzLlBhcnNlclN0YXJ0O1xuICAgICAgICAgIHJ1bGVzID0gcnVsZXMuUGFyc2VyUnVsZXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gcnVsZXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiAobmV3IFJ1bGUoci5uYW1lLCByLnN5bWJvbHMsIHIucG9zdHByb2Nlc3MpKTsgfSk7XG4gICAgICAgIHZhciBnID0gbmV3IEdyYW1tYXIocnVsZXMsIHN0YXJ0KTtcbiAgICAgICAgZy5sZXhlciA9IGxleGVyOyAvLyBuYi4gc3RvcmluZyBsZXhlciBvbiBHcmFtbWFyIGlzIGlmZnksIGJ1dCB1bmF2b2lkYWJsZVxuICAgICAgICByZXR1cm4gZztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIFN0cmVhbUxleGVyKCkge1xuICAgICAgdGhpcy5yZXNldChcIlwiKTtcbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihkYXRhLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGRhdGE7XG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICB0aGlzLmxpbmUgPSBzdGF0ZSA/IHN0YXRlLmxpbmUgOiAxO1xuICAgICAgICB0aGlzLmxhc3RMaW5lQnJlYWsgPSBzdGF0ZSA/IC1zdGF0ZS5jb2wgOiAwO1xuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5idWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4KytdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgICAgICAgdGhpcy5sYXN0TGluZUJyZWFrID0gdGhpcy5pbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IGNofTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0cmVhbUxleGVyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lOiB0aGlzLmxpbmUsXG4gICAgICAgIGNvbDogdGhpcy5pbmRleCAtIHRoaXMubGFzdExpbmVCcmVhayxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTdHJlYW1MZXhlci5wcm90b3R5cGUuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbih0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICAvLyBuYi4gdGhpcyBnZXRzIGNhbGxlZCBhZnRlciBjb25zdW1pbmcgdGhlIG9mZmVuZGluZyB0b2tlbixcbiAgICAgICAgLy8gc28gdGhlIGN1bHByaXQgaXMgaW5kZXgtMVxuICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgICAgIGlmICh0eXBlb2YgYnVmZmVyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIG5leHRMaW5lQnJlYWsgPSBidWZmZXIuaW5kZXhPZignXFxuJywgdGhpcy5pbmRleCk7XG4gICAgICAgICAgICBpZiAobmV4dExpbmVCcmVhayA9PT0gLTEpIG5leHRMaW5lQnJlYWsgPSBidWZmZXIubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBidWZmZXIuc3Vic3RyaW5nKHRoaXMubGFzdExpbmVCcmVhaywgbmV4dExpbmVCcmVhaylcbiAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmluZGV4IC0gdGhpcy5sYXN0TGluZUJyZWFrO1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiBhdCBsaW5lIFwiICsgdGhpcy5saW5lICsgXCIgY29sIFwiICsgY29sICsgXCI6XFxuXFxuXCI7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiICBcIiArIGxpbmUgKyBcIlxcblwiXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiICBcIiArIEFycmF5KGNvbCkuam9pbihcIiBcIikgKyBcIl5cIlxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZSArIFwiIGF0IGluZGV4IFwiICsgKHRoaXMuaW5kZXggLSAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gUGFyc2VyKHJ1bGVzLCBzdGFydCwgb3B0aW9ucykge1xuICAgICAgICBpZiAocnVsZXMgaW5zdGFuY2VvZiBHcmFtbWFyKSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hciA9IHJ1bGVzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBncmFtbWFyID0gR3JhbW1hci5mcm9tQ29tcGlsZWQocnVsZXMsIHN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuXG4gICAgICAgIC8vIFJlYWQgb3B0aW9uc1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBrZWVwSGlzdG9yeTogZmFsc2UsXG4gICAgICAgICAgICBsZXhlcjogZ3JhbW1hci5sZXhlciB8fCBuZXcgU3RyZWFtTGV4ZXIsXG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiAob3B0aW9ucyB8fCB7fSkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dXAgbGV4ZXJcbiAgICAgICAgdGhpcy5sZXhlciA9IHRoaXMub3B0aW9ucy5sZXhlcjtcbiAgICAgICAgdGhpcy5sZXhlclN0YXRlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIFNldHVwIGEgdGFibGVcbiAgICAgICAgdmFyIGNvbHVtbiA9IG5ldyBDb2x1bW4oZ3JhbW1hciwgMCk7XG4gICAgICAgIHZhciB0YWJsZSA9IHRoaXMudGFibGUgPSBbY29sdW1uXTtcblxuICAgICAgICAvLyBJIGNvdWxkIGJlIGV4cGVjdGluZyBhbnl0aGluZy5cbiAgICAgICAgY29sdW1uLndhbnRzW2dyYW1tYXIuc3RhcnRdID0gW107XG4gICAgICAgIGNvbHVtbi5wcmVkaWN0KGdyYW1tYXIuc3RhcnQpO1xuICAgICAgICAvLyBUT0RPIHdoYXQgaWYgc3RhcnQgcnVsZSBpcyBudWxsYWJsZT9cbiAgICAgICAgY29sdW1uLnByb2Nlc3MoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDsgLy8gdG9rZW4gaW5kZXhcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYSByZXNlcnZlZCB0b2tlbiBmb3IgaW5kaWNhdGluZyBhIHBhcnNlIGZhaWxcbiAgICBQYXJzZXIuZmFpbCA9IHt9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5mZWVkID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgICAgdmFyIGxleGVyID0gdGhpcy5sZXhlcjtcbiAgICAgICAgbGV4ZXIucmVzZXQoY2h1bmssIHRoaXMubGV4ZXJTdGF0ZSk7XG5cbiAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICB3aGlsZSAodG9rZW4gPSBsZXhlci5uZXh0KCkpIHtcbiAgICAgICAgICAgIC8vIFdlIGFkZCBuZXcgc3RhdGVzIHRvIHRhYmxlW2N1cnJlbnQrMV1cbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudF07XG5cbiAgICAgICAgICAgIC8vIEdDIHVudXNlZCBzdGF0ZXNcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmtlZXBIaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFibGVbdGhpcy5jdXJyZW50IC0gMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5jdXJyZW50ICsgMTtcbiAgICAgICAgICAgIHZhciBuZXh0Q29sdW1uID0gbmV3IENvbHVtbih0aGlzLmdyYW1tYXIsIG4pO1xuICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoKG5leHRDb2x1bW4pO1xuXG4gICAgICAgICAgICAvLyBBZHZhbmNlIGFsbCB0b2tlbnMgdGhhdCBleHBlY3QgdGhlIHN5bWJvbFxuICAgICAgICAgICAgdmFyIGxpdGVyYWwgPSB0b2tlbi50ZXh0ICE9PSB1bmRlZmluZWQgPyB0b2tlbi50ZXh0IDogdG9rZW4udmFsdWU7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBsZXhlci5jb25zdHJ1Y3RvciA9PT0gU3RyZWFtTGV4ZXIgPyB0b2tlbi52YWx1ZSA6IHRva2VuO1xuICAgICAgICAgICAgdmFyIHNjYW5uYWJsZSA9IGNvbHVtbi5zY2FubmFibGU7XG4gICAgICAgICAgICBmb3IgKHZhciB3ID0gc2Nhbm5hYmxlLmxlbmd0aDsgdy0tOyApIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzY2FubmFibGVbd107XG4gICAgICAgICAgICAgICAgdmFyIGV4cGVjdCA9IHN0YXRlLnJ1bGUuc3ltYm9sc1tzdGF0ZS5kb3RdO1xuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBjb25zdW1lIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgIC8vIGVpdGhlciByZWdleCBvciBsaXRlcmFsXG4gICAgICAgICAgICAgICAgaWYgKGV4cGVjdC50ZXN0ID8gZXhwZWN0LnRlc3QodmFsdWUpIDpcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0LnR5cGUgPyBleHBlY3QudHlwZSA9PT0gdG9rZW4udHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV4cGVjdC5saXRlcmFsID09PSBsaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHN0YXRlLm5leHRTdGF0ZSh7ZGF0YTogdmFsdWUsIHRva2VuOiB0b2tlbiwgaXNUb2tlbjogdHJ1ZSwgcmVmZXJlbmNlOiBuIC0gMX0pO1xuICAgICAgICAgICAgICAgICAgICBuZXh0Q29sdW1uLnN0YXRlcy5wdXNoKG5leHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTmV4dCwgZm9yIGVhY2ggb2YgdGhlIHJ1bGVzLCB3ZSBlaXRoZXJcbiAgICAgICAgICAgIC8vIChhKSBjb21wbGV0ZSBpdCwgYW5kIHRyeSB0byBzZWUgaWYgdGhlIHJlZmVyZW5jZSByb3cgZXhwZWN0ZWQgdGhhdFxuICAgICAgICAgICAgLy8gICAgIHJ1bGVcbiAgICAgICAgICAgIC8vIChiKSBwcmVkaWN0IHRoZSBuZXh0IG5vbnRlcm1pbmFsIGl0IGV4cGVjdHMgYnkgYWRkaW5nIHRoYXRcbiAgICAgICAgICAgIC8vICAgICBub250ZXJtaW5hbCdzIHN0YXJ0IHN0YXRlXG4gICAgICAgICAgICAvLyBUbyBwcmV2ZW50IGR1cGxpY2F0aW9uLCB3ZSBhbHNvIGtlZXAgdHJhY2sgb2YgcnVsZXMgd2UgaGF2ZSBhbHJlYWR5XG4gICAgICAgICAgICAvLyBhZGRlZFxuXG4gICAgICAgICAgICBuZXh0Q29sdW1uLnByb2Nlc3MoKTtcblxuICAgICAgICAgICAgLy8gSWYgbmVlZGVkLCB0aHJvdyBhbiBlcnJvcjpcbiAgICAgICAgICAgIGlmIChuZXh0Q29sdW1uLnN0YXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBObyBzdGF0ZXMgYXQgYWxsISBUaGlzIGlzIG5vdCBnb29kLlxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5sZXhlci5mb3JtYXRFcnJvcih0b2tlbiwgXCJpbnZhbGlkIHN5bnRheFwiKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBcIlVuZXhwZWN0ZWQgXCIgKyAodG9rZW4udHlwZSA/IHRva2VuLnR5cGUgKyBcIiB0b2tlbjogXCIgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IEpTT04uc3RyaW5naWZ5KHRva2VuLnZhbHVlICE9PSB1bmRlZmluZWQgPyB0b2tlbi52YWx1ZSA6IHRva2VuKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBlcnIub2Zmc2V0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGVyci50b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWF5YmUgc2F2ZSBsZXhlciBzdGF0ZVxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgICBjb2x1bW4ubGV4ZXJTdGF0ZSA9IGxleGVyLnNhdmUoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sdW1uKSB7XG4gICAgICAgICAgdGhpcy5sZXhlclN0YXRlID0gbGV4ZXIuc2F2ZSgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmNyZW1lbnRhbGx5IGtlZXAgdHJhY2sgb2YgcmVzdWx0c1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmZpbmlzaCgpO1xuXG4gICAgICAgIC8vIEFsbG93IGNoYWluaW5nLCBmb3Igd2hhdGV2ZXIgaXQncyB3b3J0aFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnRhYmxlW3RoaXMuY3VycmVudF07XG4gICAgICAgIGNvbHVtbi5sZXhlclN0YXRlID0gdGhpcy5sZXhlclN0YXRlO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH07XG5cbiAgICBQYXJzZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gY29sdW1uLmluZGV4O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpbmRleDtcbiAgICAgICAgdGhpcy50YWJsZVtpbmRleF0gPSBjb2x1bW47XG4gICAgICAgIHRoaXMudGFibGUuc3BsaWNlKGluZGV4ICsgMSk7XG4gICAgICAgIHRoaXMubGV4ZXJTdGF0ZSA9IGNvbHVtbi5sZXhlclN0YXRlO1xuXG4gICAgICAgIC8vIEluY3JlbWVudGFsbHkga2VlcCB0cmFjayBvZiByZXN1bHRzXG4gICAgICAgIHRoaXMucmVzdWx0cyA9IHRoaXMuZmluaXNoKCk7XG4gICAgfTtcblxuICAgIC8vIG5iLiBkZXByZWNhdGVkOiB1c2Ugc2F2ZS9yZXN0b3JlIGluc3RlYWQhXG4gICAgUGFyc2VyLnByb3RvdHlwZS5yZXdpbmQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5rZWVwSGlzdG9yeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXQgb3B0aW9uIGBrZWVwSGlzdG9yeWAgdG8gZW5hYmxlIHJld2luZGluZycpXG4gICAgICAgIH1cbiAgICAgICAgLy8gbmIuIHJlY2FsbCBjb2x1bW4gKHRhYmxlKSBpbmRpY2llcyBmYWxsIGJldHdlZW4gdG9rZW4gaW5kaWNpZXMuXG4gICAgICAgIC8vICAgICAgICBjb2wgMCAgIC0tICAgdG9rZW4gMCAgIC0tICAgY29sIDFcbiAgICAgICAgdGhpcy5yZXN0b3JlKHRoaXMudGFibGVbaW5kZXhdKTtcbiAgICB9O1xuXG4gICAgUGFyc2VyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBwb3NzaWJsZSBwYXJzaW5nc1xuICAgICAgICB2YXIgY29uc2lkZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5ncmFtbWFyLnN0YXJ0O1xuICAgICAgICB2YXIgY29sdW1uID0gdGhpcy50YWJsZVt0aGlzLnRhYmxlLmxlbmd0aCAtIDFdXG4gICAgICAgIGNvbHVtbi5zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQucnVsZS5uYW1lID09PSBzdGFydFxuICAgICAgICAgICAgICAgICAgICAmJiB0LmRvdCA9PT0gdC5ydWxlLnN5bWJvbHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICYmIHQucmVmZXJlbmNlID09PSAwXG4gICAgICAgICAgICAgICAgICAgICYmIHQuZGF0YSAhPT0gUGFyc2VyLmZhaWwpIHtcbiAgICAgICAgICAgICAgICBjb25zaWRlcmF0aW9ucy5wdXNoKHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbnNpZGVyYXRpb25zLm1hcChmdW5jdGlvbihjKSB7cmV0dXJuIGMuZGF0YTsgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIFBhcnNlcjogUGFyc2VyLFxuICAgICAgICBHcmFtbWFyOiBHcmFtbWFyLFxuICAgICAgICBSdWxlOiBSdWxlLFxuICAgIH07XG5cbn0pKTtcbiJdfQ==

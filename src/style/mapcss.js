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

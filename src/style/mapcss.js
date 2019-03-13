'use strict';

const rules = require("./rules");

function MapCSS(ast, options={}) {
  this.knownTags = rules.listKnownTags(ast);

  this.rules = ast;

  if (options.cache) {
    this.cache = options.cache;
  } else {
    this.cache = null;
  }
}

MapCSS.prototype.createCacheKey = function(tags, zoom, type, selector) {
  var keys = [];
  for (var k in tags) {
    //Test only tags, mentioned in CSS selectors
    if (k in this.knownTags) {
      if (this.knownTags[k] === 'kv') {
        //Tag key and values are checked in MapCSS
        keys.push(k + ":" + tags[k]);
      } else {
        //Only tag presence is checked in MapCSS, we don't need to take value in account
        keys.push(k);
      }
    }
  }

  return [zoom, type, selector, keys.join(':')].join(':');
}

MapCSS.prototype.apply = function(tags, zoom, type) {
  const key = this.createCacheKey(tags, zoom, type);

  if (this.cache && key in this.cache) {
    return this.cache[key];
  }

  const classes = {};
  const layers = rules.apply(this.rules, tags, classes, zoom, type);

  if (this.cache) {
    this.cache[key] = layers;
  }
  return layers;
}

module.exports = MapCSS;

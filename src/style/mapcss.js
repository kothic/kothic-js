'use strict';

const matchers = require("./matchers");

function MapCSS(ast) {
  const rules = ast;
  this.supportedTags = {};

  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    //TODO Unwrap rules!!! way::a, way::b -> [rule, rule]
    rule.apply = applyRule;
    for (var j = 0; j < rule.selectors.length; j++) {
      const selector = rule.selectors[j];
      selector.apply = applySelector;
      appendSupportedTags(this.supportedTags, selector.attributes);
    }
  }
  this.rules = rules;
  //TODO: Add options to control cache
  //TODO: Use LRU cache implementation
  this.cache = null;//{};
}

/**
 ** Has side effects for performance reasons (argumant if modified)
 **/
function appendSupportedTags(supportedTags, attributes) {
  for (var i = 0; i < attributes.length; i++) {
    const attr = attributes[i];

    switch (attr.type) {
      case 'presence':
      case 'absence':
        if (!(attr.key in supportedTags)) {
          supportedTags[attr.key] = 'k';
        }
        break;
      case 'cmp':
      case 'regexp':
        if (!(attr.key in supportedTags)) {
          supportedTags[attr.key] = 'kv';
        }
        break;
      default:
        throw "Attribute type is not supproted: " + JSON.stringify(attr);
    }
  }
}

function applySelector(tags, classes, zoom, type) {
  const selector = this;

  const key = selector.layer || 'default';
  if (!matchers.matchFeatureType(selector.type, type)) {
    return null;
  }

  if (!matchers.matchZoom(selector.zoom, zoom)) {
    return null;
  }

  if (!matchers.matchAttributes(selector.attributes, tags)) {
    return null;
  }

  return key;
}

function applyRule(tags, classes, zoom, type) {
  const selectors = this.selectors;
  const actions = this.actions;
  const result = [];

  for (var i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const key = selector.apply(tags, classes, zoom, type);
    if (key) {
      result.push({
        key: key,
        actions: unwrapActions(actions)
      });
    }
  }
  return result;
}

function unwrapActions(blocks) {
  const result = {};

  for (var i = 0; i < blocks.length; i++) {
    const actions = blocks[i];

  // console.log(JSON.stringify(actions, 2,2))
    for (var j = 0; j < actions.length; j++) {
      const action = actions[j];
      switch (action.action) {
        case 'kv':
          result[action.k] = action.v.v;
          break;
        default:
          throw "Action type is not supproted: " + JSON.stringify(action);
      }
    }
  }
  return result;
}

MapCSS.prototype.createCacheKey = function(tags, zoom, type, selector) {
  var keys = [];
  for (var k in tags) {
    //Test only tags, mentioned in CSS selectors
    if (k in this.supportedTags) {
      if (this.supportedTags[k] === 'kv') {
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

  const layers = {};
  // apply rules
  for (var i = 0; i < this.rules.length; i++) {
    const rule = this.rules[i];
    const ruleLayers = rule.apply(tags, {}, zoom, type);
    for (var j = 0; j < ruleLayers.length; j++) {
      const ruleLayer = ruleLayers[j];
      layers[ruleLayer.key] = layers[ruleLayer.key] || {};
      Object.assign(layers[ruleLayer.key], ruleLayer.actions);
    }
  }

  if (this.cache) {
    this.cache[key] = layers;
  }
  return layers;
}

module.exports = MapCSS;

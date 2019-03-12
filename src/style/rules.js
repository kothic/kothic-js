'use strict';

const matchers = require("./matchers");

function listSupportedTags(rules) {
  var result = [];
  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    for (var j = 0; j < rule.selectors.length; j++) {
      const selector = rule.selectors[j];
      matchers.appendSupportedTags(result, selector.attributes);
    }
  }

  return result;
}

function apply(rules, tags, classes, zoom, type) {
  const layers = {};

  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    const ruleLayers = applyRule(rule, tags, classes, zoom, type);
    var exit = false;
    for (var j = 0; j < ruleLayers.length; j++) {
      const ruleLayer = ruleLayers[j];
      layers[ruleLayer.key] = layers[ruleLayer.key] || {};
      //Override result of previous rules
      Object.assign(layers[ruleLayer.key], ruleLayer.actions);
      exit = exit || 'exit' in ruleLayer;
    }

    if (exit) {
      return layers;
    }
  }

  return layers;
}

function applyRule(rule, tags, classes, zoom, type) {
  const selectors = rule.selectors;
  const blocks = rule.actions;
  const result = [];

  for (var i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const layer = selector.layer || 'default';
    if (matchers.matchSelector(selector, tags, classes, zoom, type)) {
      const r = {
        rule: rule,
        actions: unwindActions(blocks, tags, classes)
      }
      result.push(r);
      if ('exit' in r) {
        return result;
      }
    }
  }

  return result;
}

function unwindActions(blocks, tags, classes) {
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
        case 'set_class':
          if (!classes.includes(action.v.class)) {
            classes.push(action.v.class);
          }
          break;
        case 'set_tag':
          tags[action.k] = action.v.v;
          break;
        case 'exit':
          result['exit'] = true;
          return result;
        default:
          throw "Action type is not supproted: " + JSON.stringify(action);
      }
    }
  }
  return result;
}

module.exports = {
  listSupportedTags: listSupportedTags,
  apply: apply,
}

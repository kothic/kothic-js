'use strict';

const matchers = require("./matchers");
const evalProcessor = require("./eval");

function listKnownTags(rules) {
  var tags = {};
  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    for (var j = 0; j < rule.selectors.length; j++) {
      const selector = rule.selectors[j];
      matchers.appendKnownTags(tags, selector.attributes);
    }

    for (var j = 0; j < rule.actions.length; j++) {
      const action = rule.actions[j];
      const value = action.v;

      if (action.action === 'kv' && action.k === 'text' && value.type === "string") {
        //Support "text: tagname"
        tags[value.v] = 'kv';
      } else if (value.type === "eval") {
        //Support tag() function in eval
        evalProcessor.appendKnownTags(tags, value.v);
      }
    }
  }

  return tags;
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
      break;
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
      const actions = {
        rule: rule,
        actions: unwindActions(blocks, tags, properties, locales, classes)
      }
      result.push(actions);
      if ('exit' in actions) {
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
        result[action.k] = unwindValue(action.v, tags, properties, locales);
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
        throw "Action type is not supproted: " + JSON.stringify(action);
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
      throw "Value type is not supproted: " + JSON.stringify(action);
  }
}

function formatCssColor(color) {
  if ('r' in color && 'g' in color && 'b' in color && 'a' in color) {
    return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
  }
  if ('h' in color && 's' in color && 'l' in color && 'a' in color) {
    return "hsla(" + color.h + ", " + color.s + ", " + color.l + ", " + color.a + ")";
  }
  if ('h' in color && 's' in color && 'l' in color) {
    return "hsl(" + color.h + ", " + color.s + ", " + color.l + ")";
  }

  if ('r' in color && 'g' in color && 'b' in color) {
    var r = color.r.toString(16);
    var g = color.g.toString(16);
    var b = color.b.toString(16);

    r = r.length == 1 ? '0' + r : r;
    g = g.length == 1 ? '0' + g : g;
    b = b.length == 1 ? '0' + b : b;

    if (r[0] == r[1] && g[0] == g[1] && b[0] == b[1]) {
      return "#" + r[0] + g[0] + b[0];
    }
    return "#" + r + g + b;
  }

  throw "Unexpected color type " + JSON.stringify(color);
}

module.exports = {
  listKnownTags: listKnownTags,
  apply: apply,
}

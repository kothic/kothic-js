'use strict';

const matchers = require("./matchers");
const evalProcessor = require("./eval");

function listKnownTags(rules, locales) {
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
        evalProcessor.appendKnownTags(tags, value.v, locales);
      }
    }
  }

  return tags;
}

function apply(rules, tags, classes, zoom, type, locales) {
  const layers = {};

  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];

    const ruleLayers = applyRule(rule, tags, classes, zoom, type, locales);
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
function applyRule(rule, tags, classes, zoom, type, locales) {
  const selectors = rule.selectors;
  const actions = rule.actions;
  const result = {};

  for (var i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    if (matchers.matchSelector(selector, tags, classes, zoom, type)) {
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
  apply: apply,
}

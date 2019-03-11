'use strict';

/**
 ** range:Object = {type: 'z', begin: int, end: int}
 ** zoom:int
 **/
function matchZoom(range, zoom) {
  if (!range) {
    return true;
  }

  if (range.type !== 'z') {
    console.warn("Zoom selector '" + range.type + "' is not supported");
    return false;
  }

  return zoom >= (range.begin || 0) && zoom <= (range.end || 9000);
}

/**
 ** selectorType:String = "node", "way", "relation", "line", "area", "canvas", "*"
 ** type:String = "Point", "MultiPoint", "Polygon", "MultiPolygon", "LineString", "MultiLineString"
 **/
function matchFeatureType(selectorType, type) {
  if (selectorType === '*') {
    return true;
  }

  switch (type) {
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
      console.warn("Selector type is not supported: " + type);
      return false;
  }
}

function matchAttributes(attributes, tags) {
  for (var i = 0; i < attributes.length; i++) {
    if (!matchAttribute(attributes[i], tags)) {
      return false;
    }
  }

  return true;
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
      console.warn("Attribute type is not supported: " + attr.type);
      return false;
  }
}

module.exports = {
  matchZoom: matchZoom,
  matchFeatureType: matchFeatureType,
  matchAttributes: matchAttributes,
  matchAttribute: matchAttribute
}

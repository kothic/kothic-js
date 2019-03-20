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

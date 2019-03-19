'use strict';

function StyleManager(mapcss) {
  this.mapcss = mapcss;
}

// Reorder featues into the natural rendering order
function reorderLayersToRender(layers) {
  const queues = {
    '_bg': {
      'id': '_bg',
      'polygons': [],
      'casings': [],
      'lines': [],
      'icons': [],
      'labels': [],
      'label_icons': [],
      'shields': []
    }
  };

  for (var i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const features = layer.features;
    const layerId = layer.id;

    const bgQueue = queues._bg;
    const queue = queues[layerId] = queues[layerId] || {
      'id': layerId,
      'polygons': [],
      'casings': [],
      'lines': [],
      'icons': [],
      'labels': [],
      'label_icons': [],
      'shields': []
    };

    for (var j = 0, len = features.length; j < len; j++) {
      const feature = features[j];
      const style = feature.style;

      if ('fill-color' in style || 'fill-image' in style) {
        if (style['fill-position'] === 'background') {
          bgQueue.polygons.push(feature);
        } else {
          queue.polygons.push(feature);
        }
      }

      if ('casing-width' in style) {
        queue.casings.push(feature);
      }

      if ('width' in style) {
        queue.lines.push(feature);
      }

      if ('icon-image' in style) {
        if ('text' in style) {
          queue.label_icons.push(feature);
        } else {
          queue.icons.push(feature);
        }
      } else if ('text' in style) {
        queue.labels.push(feature);
      }

      if ('shield-text' in style) {
        queue.shields.push(feature);
      }
    }
  }

  const result = [queues['_bg']];
  for (var i = 0; i < layers.length; i++) {
    const layer = layers[i];
    result.push(queues[layer.id]);
  }

  return result;
}

//Returns [{id: -1000, features: []}, {id: 0, features: []}]
//TODO Refactor: reduce number of for cycles
StyleManager.prototype.createLayers = function(features, zoom) {
  const visibleFeatures = [];

  for (var i = 0; i < features.length; i++) {
    const feature = features[i];

    const layers = this.mapcss.apply(feature.properties, zoom, feature.geometry.type);;

    for (var key in layers) {
      const actions = layers[key];
      const restyledFeature = key === 'default' ? feature : Object.assign({}, feature);

      restyledFeature.kothicId = i + 1;
      restyledFeature.layer = key;
      restyledFeature.style = actions;
      restyledFeature.zIndex = actions['z-index'] || 0;
      restyledFeature.sortKey = (actions['fill-color'] || '') + (actions.color || '');
      visibleFeatures.push(restyledFeature);
    }
  }

  visibleFeatures.sort(function (a, b) {
      return a.zIndex !== b.zIndex ? a.zIndex - b.zIndex :
          a.sortKey < b.sortKey ? -1 :
          a.sortKey > b.sortKey ? 1 : 0;
  });

  const layers = {};
  for (var i = 0, len = visibleFeatures.length; i < len; i++) {
    const feature = visibleFeatures[i];
    const layerStyle = feature.style['-x-mapnik-layer'];
    const layerId = !layerStyle ? feature.properties.layer || 0 : layerStyle === 'top' ? 10000 : -10000;

    layers[layerId] = layers[layerId] || [];
    layers[layerId].push(feature);
  }

  const ids = Object.keys(layers).sort(function (a, b) {
    return parseInt(a, 10) - parseInt(b, 10);
  });

  const result = [];
  for (var i = 0; i < ids.length; i++) {
    const id = ids[i];
    const layer = layers[id];

    result.push({id: id, features: layer});
  }

  return reorderLayersToRender(result);
}

module.exports = StyleManager;

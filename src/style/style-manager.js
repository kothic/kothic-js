'use strict';

const supports = require("./supports");

const priorities = supports.reduce((acc, layer) => (acc[layer.name] = layer.priority, acc), {});

function StyleManager(mapcss) {
  this.mapcss = mapcss;
}

// // Reorder featues into the natural rendering order
// function reorderLayersToRender(layers) {
//   const queues = {
//     '_bg': {
//       'id': '_bg',
//       'polygons': [],
//       'casings': [],
//       'lines': [],
//       'icons': [],
//       'labels': [],
//       'label_icons': [],
//       'shields': []
//     }
//   };
//
//   for (var i = 0; i < layers.length; i++) {
//     const layer = layers[i];
//     const features = layer.features;
//     const layerId = layer.id;
//
//     const bgQueue = queues._bg;
//     const queue = queues[layerId] = queues[layerId] || {
//       'id': layerId,
//       'polygons': [],
//       'casings': [],
//       'lines': [],
//       'icons': [],
//       'labels': [],
//       'label_icons': [],
//       'shields': []
//     };
//
//     for (var j = 0, len = features.length; j < len; j++) {
//       const feature = features[j];
//       const style = feature.style;
//
//       if ('fill-color' in style || 'fill-image' in style) {
//         if (style['fill-position'] === 'background') {
//           bgQueue.polygons.push(feature);
//         } else {
//           queue.polygons.push(feature);
//         }
//       }
//
//       if ('casing-width' in style) {
//         queue.casings.push(feature);
//       }
//
//       if ('width' in style) {
//         queue.lines.push(feature);
//       }
//
//       if ('icon-image' in style) {
//         if ('text' in style) {
//           queue.label_icons.push(feature);
//         } else {
//           queue.icons.push(feature);
//         }
//       } else if ('text' in style) {
//         queue.labels.push(feature);
//       }
//
//       if ('shield-text' in style) {
//         queue.shields.push(feature);
//       }
//     }
//   }
//
//   const result = [queues['_bg']];
//   for (var k = 0; k < layers.length; k++) {
//     const layer = layers[k];
//     result.push(queues[layer.id]);
//   }
//
//   return result;
// }

function createRenders(featureType, actions) {
  const renders = {};

  supports.forEach((render) => {
    if (!render.featureTypes.includes(featureType)) {
      return;
    }

  });

  // Line
  if ('width' in actions) {
    renders['line'] = actions;
  }

  // Line casing
  if ('casing-width' in actions) {
    renders['casing'] = actions;
  }

  if ('fill-color' in actions || 'fill-image' in actions) {
    renders['polygon'] = actions;
  }

  if ('icon-image' in actions) {
    renders['icon'] = actions;
  }

  if ('text' in actions) {
    renders['text'] = actions;
  }

  if ('shield-text' in actions) {
    renders['shield'] = actions;
  }

  return renders;
}

StyleManager.prototype.createFeatureRenders = function(feature, kothicId, zoom) {
  const featureActions = this.mapcss.apply(feature.properties, zoom, feature.geometry.type);

  const layers = {};

  for (var k in featureActions) {
    const renders = createRenders(feature.geometry.type, featureActions[k]);
    for (var render in renders) {
      const actions = renders[render];
      const zIndex = parseInt(actions['z-index']) || 0;

      const restyledFeature = {
        kothicId: kothicId,
        geometry: feature.geometry,
        actions: actions,
      };

      const layer = "" + zIndex + "," + render; //0,casing
      layers[layer] = restyledFeature;
    }
  }
  return layers;
}
/**
 ** @param a {array} [zIndex, render]
 **/
function compareLayers(a, b) {
  const priorityA = priorities[a[1]];
  const priorityB = priorities[b[1]];

  if (priorityA != priorityB) {
    return priorityA - priorityB;
  }

  const zIndexA = parseInt(a[0]);
  const zIndexB = parseInt(b[0]);

  if (zIndexA != zIndexB) {
    return zIndexA - zIndexB;
  }

  //TODO: Compare by keys
  console.log(a, b)

  exit()
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
    .forEach(([zIndex, render]) => {
      const features = layers["" + zIndex + "," + render];
      //TODO Sort features by color to reduce context switching
      result.push({
          render: render,
          zIndex: parseInt(zIndex),
          features: features
      });
    });

  return result;
}

module.exports = StyleManager;

'use strict';

const supports = require("./supports");

/**
 ** Available options:
 ** groupFeaturesByActions {boolean} fort features by performed actions.
 **     This optimization significately improves performance in browser Canvas implementations but slows down node-canvas
 **/
function StyleManager(mapcss, options) {
  this.mapcss = mapcss;

  this.groupFeaturesByActions = (options && options.groupFeaturesByActions) || false;
}

function checkActions(actions, requiredActions) {
  for (var k in actions) {
    if (requiredActions.includes(k)) {
      return true;
    }
  }

  return false;
}

function createRenders(featureType, actions) {
  const renders = {};

  supports.forEach((render) => {
    if (!render.featureTypes.includes(featureType)) {
      return;
    }

    if (!checkActions(actions, render.requiredActions)) {
      return;
    }

    const renderActions = {
      'major-z-index': render.priority
    };

    render.actions.forEach((actionDef) => {
      if (actionDef.action in actions || 'default' in actionDef) {
        renderActions[actionDef.action] = actions[actionDef.action] || actionDef['default'];
      }
    });

    renders[render.name] = renderActions;
  });

  return renders;
}

StyleManager.prototype.createFeatureRenders = function(feature, kothicId, zoom) {
  const featureActions = this.mapcss.apply(feature.properties, zoom, feature.geometry.type);

  const layers = {};

  for (var layerName in featureActions) {
    const renders = createRenders(feature.geometry.type, featureActions[layerName]);
    for (var render in renders) {
      const actions = renders[render];
      const zIndex = parseInt(actions['z-index']) || 0;
      const majorZIndex = parseInt(actions['major-z-index']);
      delete actions['z-index'];
      delete actions['major-z-index'];

      const restyledFeature = {
        kothicId: kothicId,
        geometry: feature.geometry,
        actions: actions,
      };

      if (this.groupFeaturesByActions) {
        restyledFeature['key'] = JSON.stringify(actions);
      }

      const layer = [zIndex, majorZIndex, layerName, render].join(',');

      layers[layer] = restyledFeature;
    }
  }
  return layers;
}
/**
 ** @param a {array} [zIndex, majorZIndex, layerName, render]
 ** @return <0 — prefer a
 ** @return >0 — prefer b
 **/
function compareLayers(a, b) {
  const layerNameA = a[2];
  const layerNameB = b[2];

  const zIndexA = parseInt(a[0]);
  const zIndexB = parseInt(b[0]);

  const majorZIndexA = parseInt(a[1]);
  const majorZIndexB = parseInt(b[1]);
  if (layerNameA == layerNameB) {
    if (majorZIndexA != majorZIndexB) {
      return majorZIndexA - majorZIndexB;
    }

    if (zIndexA != zIndexB) {
      return zIndexA - zIndexB;
    }

    throw new Error("Duplicate layers: " + JSON.stringify(a) + " and " + JSON.stringify(b));
  } else if (layerNameA == 'default') {
    return -1;
  } else if (layerNameB == 'default') {
    return 1;
  } else {
    if (zIndexA != zIndexB) {
      return zIndexA - zIndexB;
    }

    return layerNameA.localeCompare(layerNameB);
  }
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
    .forEach(([zIndex, majorZIndex, layerName, render]) => {
      const features = layers[[zIndex, majorZIndex, layerName, render].join(',')];

      if (this.groupFeaturesByActions) {
        features.sort((a, b) => a.key.localeCompare(b.key));
      }

      result.push({
          render: render,
          zIndex: parseInt(zIndex),
          majorZIndex: parseInt(majorZIndex),
          objectZIndex: layerName,
          features: features
      });
    });

  return result;
}

module.exports = StyleManager;

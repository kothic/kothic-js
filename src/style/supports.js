module.exports = [
  {
    "name": "polygon",
    "featureTypes": ["Polygon", "MultiPolygon"],
    "requiredActions": ["fill-color", "fill-image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "fill-color",
        "default": "rgb(0, 0, 0)",
        "type": "color"
      }, {
        "action": "fill-image",
        "type": "uri"
      }, {
        "action": "fill-opacity",
        "type": "number",
        "default": 1
      },
    ],
    "priority": 10
  }, {
    "name": "casing",
    "featureTypes": ["LineString", "MultiLineString", "Polygon", "MultiPolygon"],
    "requiredActions": ["casing-width"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "casing-width",
        "default": 1,
        "type": "number"
      }, {
        "action": "width",
        "default": 0,
        "type": "number"
      }, {
        "action": "casing-color",
        "default": "rgb(0, 0, 0)",
        "type": "color"
      }, {
        "action": "casing-dashes",
        "type": "dashes"
      }, {
        "action": "casing-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "casing-linecap",
        "default": "butt",
        "type": "string"
      }, {
        "action": "casing-linejoin",
        "default": "round",
        "type": "string"
      }, {
        "action": "linecap",
        "default": "butt",
        "type": "string"
      }, {
        "action": "linejoin",
        "default": "round",
        "type": "string"
      },

    ],
    "priority": 20
  }, {
    "name": "line",
    "featureTypes": ["LineString", "MultiLineString", "Polygon", "MultiPolygon"],
    "requiredActions": ["width", "image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "width",
        "type": "number"
      }, {
        "action": "image",
        "type": "uri"
      }, {
        "action": "color",
        "type": "color",
        "default": "rgb(0, 0, 0)"
      }, {
        "action": "dashes",
        "type": "dashes"
      }, {
        "action": "opacity",
        "type": "number",
        "default": 1
      }, {
        "action": "linecap",
        "type": "string"
      }, {
        "action": "linejoin",
        "type": "string"
      },
    ],
    "priority": 30
  }, {
    "name": "icon",
    "featureTypes": ["Point", "MultiPoint", "Polygon", "MultiPolygon"],
    "requiredActions": ["icon-image"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "icon-image",
        "type": "uri"
      }, {
        "action": "icon-width",
        "type": "number"
      }, {
        "action": "icon-height",
        "type": "number"
      }, {
        "action": "allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 40
  }, {
    "name": "text",
    "featureTypes": ["LineString", "MultiLineString", "Point", "MultiPoint", "Polygon", "MultiPolygon"],
    "requiredActions": ["text"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "text",
        "type": "string"
      }, {
        "action": "text-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "text-opacity",
        "type": "number",
        "default": 1
      }, {
        "action": "text-halo-radius",
        "type": "number"
      }, {
        "action": "text-halo-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "font-family",
        "type": "string"
      }, {
        "action": "font-size",
        "type": "string"
      }, {
        "action": "text-transform",
        "type": "string"
      }, {
        "action": "text-offset",
        "type": "number"
      }, {
        "action": "text-allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 50
  }, {
    "name": "shield",
    "featureTypes": ["LineString", "MultiLineString"],
    "requiredActions": ["shield-image", "shield-text"],
    "actions": [
      {
        "action": "z-index",
        "default": 0,
        "type": "number"
      }, {
        "action": "shield-image",
        "type": "uri"
      }, {
        "action": "shield-text",
        "type": "string"
      }, {
        "action": "shield-text-color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "shield-text-opacity",
        "type": "number",
      }, {
        "action": "opacity",
        "type": "number",
      }, {
        "action": "shield-font-family",
        "type": "string"
      }, {
        "action": "shield-font-size",
        "type": "string"
      }, {
        "action": "font-family",
        "type": "string"
      }, {
        "action": "font-size",
        "type": "string"
      }, {
        "action": "shield-casing-width",
        "type": "number"
      }, {
        "action": "shield-casing-color",
        "default": "#000000",
        "type": "color"
      }, {
        "action": "shield-casing-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "shield-frame-width",
        "type": "number"
      }, {
        "action": "shield-frame-color",
        "default": "#000000",
        "type": "color"
      }, {
        "action": "shield-frame-opacity",
        "default": 1,
        "type": "number"
      }, {
        "action": "allow-overlap",
        "type": "boolean"
      }, {
        "action": "-x-kothic-padding",
        "type": "number",
        "default": 20
      }
    ],
    "priority": 60
  },
];

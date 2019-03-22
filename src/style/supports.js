module.exports = [
  {
    "name": "casing",
    "actions": [
      {
        "action": "casing-width",
        "required": true,
        "type": "number"
      }, {
        "action": "casing-color",
        "default": "#000000",
        "type": "color"
      }, {
        "action": "casing-dashes",
        "type": "string"
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
      },
    ],
    "priority": 20
  }, {
    "name": "polygon",
    "actions": [
      {
        "action": "fill-color",
        "default": "#000000",
        "type": "color",
        "required": true,
      }, {
        "action": "fill-image",
        "type": "uri",
        "required": true,
      }, {
        "action": "fill-opacity",
        "type": "number",
        "default": 1
      },
    ],
    "priority": 10
  },
  {
    "name": "line",
    "actions": [
      {
        "action": "width",
        "type": "number",
        "required": true
      }, {
        "action": "image",
        "type": "uri",
        "required": true
      }, {
        "action": "color",
        "type": "color",
        "default": "#000000"
      }, {
        "action": "dashes",
        "type": "string"
      }, {
        "action": "opacity",
        "type": "number",
        "default": 1
      }, {
        "action": "linecap",
        "type": "string",
        "default": "butt"
      }, {
        "action": "linejoin",
        "type": "string",
        "default": "round"
      },
    ],
    "priority": 30
  }, {
    "name": "icon",
    "actions": [
      {
        "action": "icon-image",
        "type": "uri",
        "required": true
      }, {
        "action": "icon-width",
        "type": "number"
      }, {
        "action": "icon-height",
        "type": "number"
      }, {
        "action": "allow-overlap",
        "type": "boolean"
      },
    ],
    "priority": 40
  }, {
    "name": "text",
    "actions": [
      {
        "action": "text",
        "type": "string",
        "required": true
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
    "actions": [
      {
        "action": "shield-image",
        "type": "uri",
        "required": true
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

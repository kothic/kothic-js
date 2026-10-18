# Supported MapCSS Features

Kothic JS does not parse MapCSS directly at runtime. It renders style modules
produced by the maintained converter in
[`kothic/kothic`](https://github.com/kothic/kothic), where each module calls
`MapCSS.loadStyle(...)` with generated JavaScript rules.

This document describes the MapCSS feature surface that the Kothic JS runtime
understands after conversion.

## Selectors And Geometry

Converted styles can target these runtime selectors:

- `canvas` for the tile background.
- `node` for point and multipoint features.
- `line` for linestring and multilinestring features.
- `area` for polygon and multipolygon features.

Kothic JS accepts lightweight GeoJSON-like tile features with `Point`,
`MultiPoint`, `LineString`, `MultiLineString`, `Polygon`, and `MultiPolygon`
geometry. Converted rules receive the OpenStreetMap-like type names `node` and
`way`; polygon features are exposed through the `area` selector.

Zoom and tag conditions are handled by the converter. The runtime receives a
compiled `restyle` function and caches its output by zoom, selector, and the
presence/value tags declared by the style module.

## Layering

The main paint order key is `z-index`. Features with the same `z-index` are
then grouped by fill and stroke color for batching.

The `-x-mapnik-layer` extension can move a feature to a synthetic layer:

- `bottom` paints before ordinary geometry.
- `top` paints after ordinary geometry.

Without `-x-mapnik-layer`, the source feature `properties.layer` value is used
as the layer id when present, otherwise layer `0` is used.

## Canvas Background

The `canvas` selector supports the same fill properties as polygons:

- `fill-color`
- `fill-image`
- `fill-opacity`
- `opacity`

The background is painted before feature geometry.

## Polygon And Area Styling

Area fills support:

- `fill-color`
- `fill-image`
- `fill-opacity`
- `opacity`
- `fill-position: background`

`fill-image` references a sprite or external image loaded through
`MapCSS.preloadSpriteImage` or `MapCSS.preloadExternalImages`. When both
`fill-color` and `fill-image` are present, Kothic JS paints the solid fill first
and the repeating image pattern second.

`fill-position: background` paints the polygon in the background pass for its
layer.

## Line Styling

Line strokes support:

- `width`
- `color`
- `image`
- `opacity`
- `dashes`
- `linecap`
- `linejoin`

When `image` is present, Kothic JS uses it as a repeating stroke pattern. When
both `color` and `image` are present, the solid stroke is painted first and the
pattern stroke second.

Line casings support:

- `casing-width`
- `casing-color`
- `casing-opacity`
- `casing-dashes`
- `casing-linecap`
- `casing-linejoin`

If `casing-dashes` is not set, the casing uses `dashes`. If casing cap or join
is not set, Kothic JS falls back to `linecap` or `linejoin`.

## Text Labels

Text labels are enabled by the `text` property.

Text styling supports:

- `text-color`
- `text-opacity`
- `text-offset`
- `text-position: line`
- `text-allow-overlap`
- `text-halo-radius`
- `text-halo-color`
- `text-transform`
- `font-family`
- `font-size`
- `font-style`
- `font-variant`
- `font-weight`
- `opacity`
- `-x-kot-min-distance`

For point and polygon labels, Kothic JS places text at the feature
representative point. For linestring labels, Kothic JS places text along the
line path when there is enough length and no label collision.

Supported `text-transform` values are:

- `uppercase`
- `lowercase`
- `capitalize`

`font-style` supports `italic` and `oblique`; `font-variant` supports
`small-caps`; `font-weight` supports `bold`. Font family names containing
`serif` use a Georgia/serif fallback; other names use a Helvetica/Arial/sans
serif fallback.

`text-allow-overlap: true` disables collision rejection for point and polygon
text. Line text still uses path-fit and collision checks.

## Icons

Point and polygon icons support:

- `icon-image`
- `icon-width`
- `icon-height`
- `allow-overlap`
- `-x-kot-min-distance`

`icon-image` references a sprite or external image. If only one of
`icon-width` or `icon-height` is set, Kothic JS preserves the image aspect
ratio.

When a feature has both `icon-image` and `text`, Kothic JS renders both or
neither so the combined symbol does not partly overlap another label.

## Shields

Shields are enabled by `shield-text`.

Shield styling supports:

- `shield-text`
- `shield-text-color`
- `shield-text-opacity`
- `shield-font-family`
- `shield-font-size`
- `shield-image`
- `shield-color`
- `shield-opacity`
- `shield-frame-width`
- `shield-frame-color`
- `shield-frame-opacity`
- `shield-casing-width`
- `shield-casing-color`
- `shield-casing-opacity`
- `allow-overlap`
- `opacity`
- `-x-mapnik-min-distance`

Shields are currently placed on linestring features. Kothic JS searches near the
line center for a collision-free position.

## Eval Functions Exposed By Runtime

Converted styles can call these runtime helper functions:

- `min(...)`
- `max(...)`
- `any(...)`
- `num(value)`
- `str(value)`
- `int(value)`
- `tag(tags, key)`
- `prop(tags, key)`
- `sqrt(value)`
- `boolean(value, ifTrue, ifFalse)`
- `metric(value)`
- `zmetric(value)`
- `localize(tags, key)`
- `join(separator, ...)`
- `split(separator, text)`
- `get(list, index)`
- `set(list, index, value)`
- `count(list)`
- `list(...)`
- `append(list, value)`
- `contains(list, value)`
- `sort(list)`
- `reverse(list)`

`metric` and `zmetric` share the same conversion behavior. Supported unit
suffixes are `mm`, `cm`, `dm`, `m`, `km`, `in`, and `ft`. When the renderer has
a tile `bbox`, unit values are converted from real-world lengths into screen
pixels using the tile latitude. Values without a recognized suffix are parsed as
plain pixels.

## Localization

The render option `locales` controls localized name lookup order. For example:

```javascript
Kothic.render(canvas, data, zoom, {
    styles: ['map'],
    locales: ['be', 'ru', 'en']
});
```

Converted styles commonly use `localize(tags, 'name')`. The runtime checks
`name:be`, `name:ru`, `name:en` in order for the example above, then falls back
to `name`.

## Unsupported Or Limited Features

These limits are runtime limits, not necessarily converter limits:

- Kothic JS does not parse raw MapCSS in the browser.
- It does not implement arbitrary CSS properties; only the properties listed
  here are consumed by the renderers.
- Text-on-path is optimized for Latin/Cyrillic-style per-character rendering and
  does not handle complex shaping or ligatures.
- Sprite and external images must be loaded before rendering completes; render
  calls are queued until all registered images are loaded.

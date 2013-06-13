TODO
====

### Performance

 * ~~Fix lots of false negatives on same-style rendering check because of checking against next feature that can be outside of "renderable" condition~~ (25-35% faster geometry rendering!)
 * Fix caching the same styles with different names as different cache entries
 * Render polygon fills in two passes (color, then image) for less fill operations
 * _(in progress)_ Implement lazy async rendering in batches <16ms for 60fps (or <32ms for 30fps)

### Styling

 * _(in progress)_ Move everything MapCSS-related like styles, python scripts and a `kothic-js-mapcss` adapter into a seperate repo
 * Refactor Kothic styling mechanism to accept more generic (non-MapCSS-specific) style implementations

### Other

 * ~~Remove unnecessary crap like unused or easy-to-avoid utility functions, debugging placeholders in code etc.~~
 * _(in progress)_ Clean up JS code of archaic constructions and overengineering

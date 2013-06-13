TODO
====

### Performance

 * Fix caching the same styles with different names as different cache entries
 * Fix lots of false negatives on same-style rendering check because of checking against next feature that can be outside of "renderable" condition
 * Implement lazy async rendering in batches <16ms for 60fps (or <32ms for 30fps)

### Other

 * Move everything MapCSS-related into a seperate repo that provides a `kothic-js-mapcss` adapter.

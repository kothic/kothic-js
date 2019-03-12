== Design notes

KothicJS use GeoJSON[1] as an internal data model.
bbox property is required

1. What coordinate system is used for a tiles
2. How and when we do peproject to a screen coordinates

0. All coordinates are stored in [x, y] pair
1. All tiles are stored in memory in local coordinates. E.g. top? left? corner coordinates is always [0, 0] while right? bottom? corner is [tile_width, tile_height]

=== References
[1] RFC7946 https://tools.ietf.org/html/rfc7946

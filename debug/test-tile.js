var tile_zoom = 13;
var tile_data = {
    "granularity": 10000,
    "features": [
        {
            "type": "Polygon",
            "properties": {
                "natural": "coastline"
            },
            "coordinates": [[[0, 0], [0, 10000], [10000, 10000], [10000, 0], [0, 0]]]
        },
        {
            "type": "LineString",
            "properties": {
                "highway": "residential",
                "name": "Debug Street"
            },
            "coordinates": [[1200, 5000], [8800, 5000]]
        },
        {
            "type": "Polygon",
            "properties": {
                "building": "yes"
            },
            "coordinates": [[[4500, 4300], [5600, 4300], [5600, 5400], [4500, 5400], [4500, 4300]]]
        }
    ]
};

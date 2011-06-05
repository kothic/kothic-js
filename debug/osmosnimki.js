
(function(MapCSS) {
    function restyle(tags, zoom, type, selector) {
        var style = {};
        
        style["default"] = {};
        
        var styleDefault = style['default'];
        
        if ((selector == 'canvas')) {
            styleDefault['fill-color'] = '#C4D4F5';
        }

        if (((selector == 'area' && tags['natural'] == 'coastline'))) {
            styleDefault['fill-color'] = '#fcf8e4';
            styleDefault['-x-mapnik-layer'] = 'bottom';
        }

        if (((selector == 'area' && tags['natural'] == 'glacier') && zoom >= 3)) {
            styleDefault['fill-color'] = '#fcfeff';
            styleDefault['fill-image'] = 'glacier.png';
        }

        if (((selector == 'area' && tags['place'] == 'city') && zoom >= 10)
            || ((selector == 'area' && tags['place'] == 'town') && zoom >= 10)) {
            styleDefault['fill-color'] = '#FAF7F7';
            styleDefault['fill-opacity'] = 0.6;
            styleDefault['z-index'] = 1;
        }

        if (((selector == 'area' && tags['place'] == 'hamlet') && zoom >= 10)
            || ((selector == 'area' && tags['place'] == 'village') && zoom >= 10)
            || ((selector == 'area' && tags['place'] == 'locality') && zoom >= 10)) {
            styleDefault['fill-color'] = '#f3eceb';
            styleDefault['fill-opacity'] = 0.6;
            styleDefault['z-index'] = 1;
        }

        if (((selector == 'area' && tags['landuse'] == 'residential') && zoom >= 10)
            || ((selector == 'area' && tags['residential'] == 'urban') && zoom >= 10)) {
            styleDefault['fill-color'] = '#F7EFEB';
            styleDefault['z-index'] = 2;
        }

        if (((selector == 'area' && tags['residential'] == 'rural') && zoom >= 10)) {
            styleDefault['fill-color'] = '#f4d7c7';
            styleDefault['z-index'] = 2;
        }

        if (((selector == 'area' && tags['landuse'] == 'residential') && zoom >= 16)) {
            styleDefault['width'] = 0.3;
            styleDefault['color'] = '#cb8904';
            styleDefault['z-index'] = 2;
        }

        if (((selector == 'area' && tags['landuse'] == 'allotments') && zoom >= 10)
            || ((selector == 'area' && tags['leisure'] == 'garden') && zoom >= 10 && zoom <= 15)
            || ((selector == 'area' && tags['landuse'] == 'orchard') && zoom >= 10 && zoom <= 15)) {
            styleDefault['fill-color'] = '#edf2c1';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['leisure'] == 'park') && zoom >= 10)) {
            styleDefault['fill-color'] = '#c4e9a4';
            styleDefault['z-index'] = 3;
            styleDefault['fill-image'] = 'parks2.png';
        }

        if (((selector == 'area' && tags['leisure'] == 'garden') && zoom >= 16)
            || ((selector == 'area' && tags['landuse'] == 'orchard') && zoom >= 16)) {
            styleDefault['fill-image'] = 'sady10.png';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['natural'] == 'scrub') && zoom >= 12)) {
            styleDefault['fill-color'] = '#e5f5dc';
            styleDefault['fill-image'] = 'kust1.png';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['natural'] == 'heath') && zoom >= 12)) {
            styleDefault['fill-color'] = '#ecffe5';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['landuse'] == 'industrial') && zoom >= 10)
            || ((selector == 'area' && tags['landuse'] == 'military') && zoom >= 10)) {
            styleDefault['fill-color'] = '#ddd8da';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['amenity'] == 'parking') && zoom >= 15)) {
            styleDefault['fill-color'] = '#ecedf4';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['natural'] == 'desert') && zoom >= 4)) {
            styleDefault['fill-image'] = 'desert22.png';
        }

        if (((selector == 'area' && tags['natural'] == 'forest') && zoom >= 4)
            || ((selector == 'area' && tags['natural'] == 'wood') && zoom >= 4)
            || ((selector == 'area' && tags['landuse'] == 'forest') && zoom >= 4)
            || ((selector == 'area' && tags['landuse'] == 'wood') && zoom >= 4)) {
            styleDefault['fill-color'] = '#d6f4c6';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['landuse'] == 'garages') && zoom >= 10)) {
            styleDefault['fill-color'] = '#ddd8da';
            styleDefault['z-index'] = 3;
        }

        if (((selector == 'area' && tags['natural'] == 'forest') && zoom >= 10)
            || ((selector == 'area' && tags['natural'] == 'wood') && zoom >= 10)
            || ((selector == 'area' && tags['landuse'] == 'forest') && zoom >= 10)
            || ((selector == 'area' && tags['landuse'] == 'wood') && zoom >= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Serif Italic';
            styleDefault['text-color'] = 'green';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0 ';
        }

        if (((selector == 'area' && tags['landuse'] == 'grass') && zoom >= 12)
            || ((selector == 'area' && tags['natural'] == 'grass') && zoom >= 12)
            || ((selector == 'area' && tags['natural'] == 'meadow') && zoom >= 12)
            || ((selector == 'area' && tags['landuse'] == 'meadow') && zoom >= 12)
            || ((selector == 'area' && tags['landuse'] == 'recreation_ground') && zoom >= 12)) {
            styleDefault['fill-color'] = '#f4ffe5';
            styleDefault['z-index'] = 4;
        }

        if (((selector == 'area' && tags['natural'] == 'wetland') && zoom >= 10)) {
            styleDefault['fill-image'] = 'swamp_world2.png';
            styleDefault['z-index'] = 4;
        }

        if (((selector == 'area' && tags['landuse'] == 'farmland') && zoom >= 10)
            || ((selector == 'area' && tags['landuse'] == 'farm') && zoom >= 10)
            || ((selector == 'area' && tags['landuse'] == 'field') && zoom >= 10)) {
            styleDefault['fill-color'] = '#fff5c4';
            styleDefault['z-index'] = 5;
        }

        if (((selector == 'area' && tags['place'] == 'city') && zoom >= 6 && zoom <= 9)
            || ((selector == 'area' && tags['place'] == 'town') && zoom >= 6 && zoom <= 9)) {
            styleDefault['fill-color'] = '#ffe1d0';
            styleDefault['fill-opacity'] = 0.6;
            styleDefault['z-index'] = 5;
        }

        if (((selector == 'area' && tags['landuse'] == 'cemetery') && zoom >= 10)) {
            styleDefault['fill-color'] = '#e5f5dc';
            styleDefault['z-index'] = 5;
            styleDefault['fill-image'] = 'cemetry7_2.png';
        }

        if (((selector == 'area' && tags['aeroway'] == 'aerodrome') && zoom >= 13)) {
            styleDefault['color'] = '#008ac6';
            styleDefault['width'] = 0.8;
            styleDefault['z-index'] = 5;
            styleDefault['fill-image'] = 'bull2.png';
        }

        if (((selector == 'area' && tags['leisure'] == 'stadium') && zoom >= 12)
            || ((selector == 'area' && tags['leisure'] == 'pitch') && zoom >= 12)) {
            styleDefault['fill-color'] = '#e3deb1';
            styleDefault['z-index'] = 5;
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom >= 7 && zoom <= 10)) {
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .6;
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['waterway'] == 'stream') && zoom >= 9 && zoom <= 10)) {
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .3;
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom >= 10 && zoom <= 14)) {
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .7;
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom >= 15)) {
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .9;
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['waterway'] == 'stream') && zoom >= 10)) {
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .5;
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['waterway'] == 'canal') && zoom >= 10)) {
            styleDefault['color'] = '#abc4f5';
            styleDefault['width'] = .6;
            styleDefault['z-index'] = 9;
        }

        if (((selector == 'area' && tags['waterway'] == 'riverbank') && zoom >= 5)
            || ((selector == 'area' && tags['natural'] == 'water') && zoom >= 5)
            || ((selector == 'area' && tags['landuse'] == 'reservoir') && zoom >= 10)) {
            styleDefault['fill-color'] = '#C4D4F5';
            styleDefault['color'] = '#C4D4F5';
            styleDefault['width'] = .1;
            styleDefault['z-index'] = 9;
        }

        if (((selector == 'area' && tags['natural'] == 'water') && zoom >= 9)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 1;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Serif Italic';
            styleDefault['text-color'] = '#285fd1';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
        }

        if (((type == 'way' && tags['highway'] == 'construction') && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['width'] = 2;
            styleDefault['color'] = '#ffffff';
            styleDefault['z-index'] = 10;
            styleDefault['dashes'] = [9,9];
        }

        if (((type == 'way' && tags['highway'] == 'construction') && zoom >= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['width'] = 3;
            styleDefault['color'] = '#ffffff';
            styleDefault['z-index'] = 10;
            styleDefault['dashes'] = [9,9];
        }

        if (((type == 'way' && tags['highway'] == 'footway') && zoom >= 15)
            || ((type == 'way' && tags['highway'] == 'path') && zoom >= 15)
            || ((type == 'way' && tags['highway'] == 'cycleway') && zoom >= 15)
            || ((type == 'way' && tags['highway'] == 'pedestrian') && zoom >= 15)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['casing-width'] = .3;
            styleDefault['casing-color'] = '#bf96ce';
            styleDefault['width'] = .2;
            styleDefault['color'] = '#ffffff';
            styleDefault['z-index'] = 10;
            styleDefault['dashes'] = [2,2];
        }

        if (((type == 'way' && tags['highway'] == 'steps') && zoom >= 15)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['casing-width'] = .3;
            styleDefault['casing-color'] = '#ffffff';
            styleDefault['width'] = 3;
            styleDefault['color'] = '#bf96ce';
            styleDefault['z-index'] = 10;
            styleDefault['dashes'] = [1,1];
            styleDefault['linecap'] = 'butt';
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'track') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'residential') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'secondary') && zoom >= 9 && zoom <= 10)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 9 && zoom <= 10)
            || ((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '-1' || tags['living_street'] == 'false' || tags['living_street'] == 'no') && tags['service'] !== 'parking_aisle') && zoom >= 14 && zoom <= 15)) {
            styleDefault['width'] = 0.3;
            styleDefault['opacity'] = 0.6;
            styleDefault['color'] = '#996703';
            styleDefault['z-index'] = 10;
            styleDefault['-x-mapnik-layer'] = 'bottom';
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'track') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 0.6;
            styleDefault['opacity'] = 0.5;
            styleDefault['color'] = '#996703';
            styleDefault['z-index'] = 10;
            styleDefault['-x-mapnik-layer'] = 'bottom';
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom >= 14 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'track') && zoom >= 14 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 1.5;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom >= 16)
            || ((type == 'way' && tags['highway'] == 'track') && zoom >= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 2.5;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 9;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 1.2;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.3;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '1' || tags['living_street'] == 'true' || tags['living_street'] == 'yes')) && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'parking_aisle') && zoom >= 15 && zoom <= 16)) {
            styleDefault['width'] = 0.2;
            styleDefault['opacity'] = 0.5;
            styleDefault['color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '1' || tags['living_street'] == 'true' || tags['living_street'] == 'yes')) && zoom >= 16)
            || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'parking_aisle') && zoom >= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 1.2;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.3;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '-1' || tags['living_street'] == 'false' || tags['living_street'] == 'no') && tags['service'] !== 'parking_aisle') && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 2.5;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'living_street') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '-1' || tags['living_street'] == 'false' || tags['living_street'] == 'no') && tags['service'] !== 'parking_aisle') && zoom >= 16 && zoom <= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 3.5;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom >= 17)
            || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 17)
            || ((type == 'way' && tags['highway'] == 'living_street') && zoom >= 17)
            || ((type == 'way' && tags['highway'] == 'service' && (tags['living_street'] == '-1' || tags['living_street'] == 'false' || tags['living_street'] == 'no') && tags['service'] !== 'parking_aisle') && zoom >= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 4.5;
            styleDefault['color'] = '#ffffff';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 10 && zoom <= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['width'] = 1.2;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.35;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 11 && zoom <= 12)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 11 && zoom <= 12)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 1.4;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.35;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 12 && zoom <= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 3;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.35;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 4;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.35;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 14 && zoom <= 15)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 5;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 6;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 16 && zoom <= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 7;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 17 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 8;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 18 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 9;
            styleDefault['color'] = '#fcffd1';
            styleDefault['casing-width'] = 0.5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 7 && zoom <= 8)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = '#fcea97';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 8 && zoom <= 9)) {
            styleDefault['width'] = 2;
            styleDefault['color'] = '#fcea97';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 9 && zoom <= 10)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 9 && zoom <= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 2;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 10 && zoom <= 11)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 10 && zoom <= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 3;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 11 && zoom <= 12)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 11 && zoom <= 12)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 4;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 12 && zoom <= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 5;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 6;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 14 && zoom <= 15)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 7;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 8;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 16 && zoom <= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 9;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 17 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 10;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 18 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 11;
            styleDefault['color'] = '#fcea97';
            styleDefault['casing-width'] = .5;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 6 && zoom <= 7)) {
            styleDefault['width'] = 0.9;
            styleDefault['color'] = '#fbcd40';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 6 && zoom <= 7)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = '#fc9265';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 7 && zoom <= 8)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = '#fbcd40';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 7 && zoom <= 8)) {
            styleDefault['width'] = 1.2;
            styleDefault['color'] = '#fc9265';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 8 && zoom <= 9)) {
            styleDefault['width'] = 2;
            styleDefault['color'] = '#fbcd40';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 8 && zoom <= 9)) {
            styleDefault['width'] = 2;
            styleDefault['color'] = '#fc9265';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 9 && zoom <= 10)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 9 && zoom <= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 3;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 10 && zoom <= 11)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 10 && zoom <= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 4;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 11 && zoom <= 12)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 11 && zoom <= 12)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 5;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 12 && zoom <= 13)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 12 && zoom <= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 7;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 13 && zoom <= 14)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 8;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 14 && zoom <= 15)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 14 && zoom <= 15)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 9;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 15 && zoom <= 16)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 10;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 16 && zoom <= 17)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 16 && zoom <= 17)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 11;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 17 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 17 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 12;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 18 && zoom <= 18)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 18 && zoom <= 18)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-position'] = 'line';
            styleDefault['text-color'] = '#404040';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['width'] = 13;
            styleDefault['color'] = '#ffd780';
            styleDefault['casing-width'] = 1;
            styleDefault['casing-color'] = '#996703';
            styleDefault['z-index'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 9)
            || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 9)
            || ((type == 'way' && tags['highway'] == 'motorway') && zoom >= 9)
            || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 9)
            || ((type == 'way' && tags['highway'] == 'primary') && zoom >= 13)
            || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 13)) {

        if (typeof(style['centerline']) === 'undefined') {
            style['centerline'] = {};
        }
            style['centerline']['width'] = .3;
            style['centerline']['color'] = '#fa6478';
            style['centerline']['z-index'] = 14;
            style['centerline']['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && (tags['oneway'] == '1' || tags['oneway'] == 'true' || tags['oneway'] == 'yes')) && zoom >= 17)) {
            styleDefault['line-style'] = 'arrows';
            styleDefault['z-index'] = 15;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 7 && zoom <= 8)) {
            styleDefault['width'] = .5;
            styleDefault['color'] = '#303030';
            styleDefault['z-index'] = 15;
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 7 && zoom <= 8)) {

        if (typeof(style['ticks']) === 'undefined') {
            style['ticks'] = {};
        }
            style['ticks']['width'] = .3;
            style['ticks']['color'] = '#ffffff';
            style['ticks']['dashes'] = [3,3];
            style['ticks']['z-index'] = 16;
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 8 && zoom <= 9)) {
            styleDefault['width'] = .6;
            styleDefault['color'] = '#303030';
            styleDefault['z-index'] = 15;
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 8 && zoom <= 9)) {

        if (typeof(style['ticks']) === 'undefined') {
            style['ticks'] = {};
        }
            style['ticks']['width'] = .35;
            style['ticks']['color'] = '#ffffff';
            style['ticks']['dashes'] = [3,3];
            style['ticks']['z-index'] = 16;
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 9)) {
            styleDefault['width'] = 1.4;
            styleDefault['color'] = '#606060';
            styleDefault['z-index'] = 15;
        }

        if (((selector == 'line' && tags['railway'] == 'rail') && zoom >= 9)) {

        if (typeof(style['ticks']) === 'undefined') {
            style['ticks'] = {};
        }
            style['ticks']['width'] = 1;
            style['ticks']['color'] = '#ffffff';
            style['ticks']['dashes'] = [6,6];
            style['ticks']['z-index'] = 16;
        }

        if (((type == 'way' && tags['railway'] == 'subway') && zoom >= 12)) {
            styleDefault['width'] = 3;
            styleDefault['color'] = '#072889';
            styleDefault['z-index'] = 15;
            styleDefault['dashes'] = [3,3];
            styleDefault['opacity'] = 0.3;
            styleDefault['linecap'] = 'butt';
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['barrier'] == 'fence') && zoom >= 16)) {
            styleDefault['width'] = .3;
            styleDefault['color'] = 'black';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['barrier'] == 'wall') && zoom >= 16)) {
            styleDefault['width'] = .5;
            styleDefault['color'] = 'black';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['marking'] == 'sport' && (!('colour' in tags)) && (!('color' in tags))) && zoom >= 15)) {
            styleDefault['width'] = .5;
            styleDefault['color'] = '#a0a0a0';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['marking'] == 'sport' && tags['colour'] == 'white') && zoom >= 15)
            || ((type == 'way' && tags['marking'] == 'sport' && tags['color'] == 'white') && zoom >= 15)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = 'white';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['marking'] == 'sport' && tags['colour'] == 'red') && zoom >= 15)
            || ((type == 'way' && tags['marking'] == 'sport' && tags['color'] == 'red') && zoom >= 15)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = '#c00000';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'way' && tags['marking'] == 'sport' && tags['colour'] == 'black') && zoom >= 15)
            || ((type == 'way' && tags['marking'] == 'sport' && tags['color'] == 'black') && zoom >= 15)) {
            styleDefault['width'] = 1;
            styleDefault['color'] = 'black';
            styleDefault['z-index'] = 16;
            styleDefault['-x-mapnik-layer'] = 'top';
        }

        if (((type == 'node' && tags['amenity'] == 'bus_station') && zoom >= 15)) {
            styleDefault['icon-image'] = 'aut2_16x16_park.png';
        }

        if (((type == 'node' && tags['highway'] == 'bus_stop') && zoom >= 16)) {
            styleDefault['icon-image'] = 'autobus_stop_14x10.png';
        }

        if (((type == 'node' && tags['railway'] == 'tram_stop') && zoom >= 16)) {
            styleDefault['icon-image'] = 'tramway_14x13.png';
        }

        if (((type == 'node' && tags['amenity'] == 'fuel') && zoom >= 15)) {
            styleDefault['icon-image'] = 'tankstelle1_10x11.png';
        }

        if (((type == 'node' && tags['amenity'] == 'pharmacy') && zoom >= 16)) {
            styleDefault['icon-image'] = 'med1_11x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'cinema') && zoom >= 16)) {
            styleDefault['icon-image'] = 'cinema_14x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'museum') && zoom >= 15)) {
            styleDefault['icon-image'] = 'mus_13x12.png';
        }

        if (((type == 'node' && tags['tourism'] == 'zoo') && zoom >= 16)) {
            styleDefault['icon-image'] = 'zoo4_14x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'courthouse') && zoom >= 16)) {
            styleDefault['icon-image'] = 'sud_14x13.png';
        }

        if (((type == 'node' && tags['amenity'] == 'theatre') && zoom >= 16)) {
            styleDefault['icon-image'] = 'teater_14x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'university') && zoom >= 16)) {
            styleDefault['icon-image'] = 'univer_15x11.png';
        }

        if (((type == 'node' && tags['amenity'] == 'toilets') && zoom >= 16)) {
            styleDefault['icon-image'] = 'wc-3_13x13.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'christian') && zoom >= 16)) {
            styleDefault['icon-image'] = 'pravosl_kupol_11x15.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'christian') && zoom >= 16)) {
            styleDefault['icon-image'] = 'pravosl_kupol_11x15.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship') && zoom >= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-color'] = '#623f00';
            styleDefault['font-family'] = 'DejaVu Serif Italic';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-offset'] = 3;
            styleDefault['max-width'] = 70;
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship') && zoom >= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-color'] = '#623f00';
            styleDefault['font-family'] = 'DejaVu Serif Italic';
            styleDefault['font-size'] = '9';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-offset'] = 3;
            styleDefault['max-width'] = 70;
            styleDefault['z-index'] = 16;
            styleDefault['width'] = 0.1;
            styleDefault['color'] = '#111111';
            styleDefault['text-opacity'] = '1';
            styleDefault['fill-color'] = '#777777';
            styleDefault['fill-opacity'] = 0.5;
        }

        if (((type == 'node' && tags['amenity'] == 'kindergarten') && zoom >= 17)) {
            styleDefault['icon-image'] = 'kindergarten_14x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'school') && zoom >= 17)) {
            styleDefault['icon-image'] = 'school_13x13.png';
        }

        if (((type == 'node' && tags['amenity'] == 'library') && zoom >= 17)) {
            styleDefault['icon-image'] = 'lib_13x14.png';
        }

        if (((type == 'node' && tags['tourism'] == 'hotel') && zoom >= 17)) {
            styleDefault['icon-image'] = 'hotell_14x14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'post_office') && zoom >= 17)) {
            styleDefault['icon-image'] = 'post_14x11.png';
        }

        if (((type == 'node' && tags['amenity'] == 'restaurant') && zoom >= 17)) {
            styleDefault['icon-image'] = 'rest_14x14.png';
        }

        if (((type == 'node' && ('shop' in tags)) && zoom >= 17)) {
            styleDefault['icon-image'] = 'superm_12x12.png';
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '2'))) {
            styleDefault['width'] = 0.5;
            styleDefault['color'] = '#202020';
            styleDefault['dashes'] = [6,4];
            styleDefault['opacity'] = 0.7;
            styleDefault['z-index'] = 16;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '3') && zoom >= 3 && zoom <= 4)) {
            styleDefault['width'] = 0.4;
            styleDefault['color'] = '#7e0156';
            styleDefault['dashes'] = [3,3];
            styleDefault['opacity'] = 0.5;
            styleDefault['z-index'] = 16;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '3') && zoom >= 4)) {
            styleDefault['width'] = 1.3;
            styleDefault['color'] = '#ff99cc';
            styleDefault['opacity'] = 0.5;
            styleDefault['z-index'] = 16;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '6') && zoom >= 10)) {
            styleDefault['width'] = 0.5;
            styleDefault['color'] = '#101010';
            styleDefault['dashes'] = [1,2];
            styleDefault['opacity'] = 0.6;
            styleDefault['z-index'] = 16.1;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '4') && zoom >= 4 && zoom <= 5)) {
            styleDefault['width'] = 0.3;
            styleDefault['color'] = '#000000';
            styleDefault['dashes'] = [1,2];
            styleDefault['opacity'] = 0.8;
            styleDefault['z-index'] = 16.3;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '4') && zoom >= 6)) {
            styleDefault['width'] = 0.7;
            styleDefault['color'] = '#000000';
            styleDefault['dashes'] = [1,2];
            styleDefault['opacity'] = 0.8;
            styleDefault['z-index'] = 16.3;
        }

        if (((type == 'way' && tags['railway'] == 'tram') && zoom >= 12)) {
            styleDefault['line-style'] = 'rway44.png';
            styleDefault['z-index'] = 17;
        }

        if (((type == 'node' && tags['railway'] == 'station' && tags['transport'] !== 'subway') && zoom >= 9)) {
            styleDefault['icon-image'] = 'rw_stat_stanzii_2_blue.png';
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 7;
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Mono Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#000d6c';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['railway'] == 'station' && tags['transport'] == 'subway') && zoom >= 12 && zoom <= 15)) {
            styleDefault['icon-image'] = 'metro_others6.png';
            styleDefault['z-index'] = 17;
        }

        if (((type == 'node' && tags['railway'] == 'station' && tags['transport'] == 'subway') && zoom >= 12 && zoom <= 15)) {

        if (typeof(style['label']) === 'undefined') {
            style['label'] = {};
        }
            style['label']['text'] = tags['name'];
            style['label']['text-offset'] = 11;
            style['label']['font-size'] = '9';
            style['label']['font-family'] = 'DejaVu Sans Book';
            style['label']['text-halo-radius'] = 2;
            style['label']['text-color'] = '#1300bb';
            style['label']['text-halo-color'] = '#ffffff';
            style['label']['text-allow-overlap'] = 'false';
            style['label']['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['railway'] == 'subway_entrance') && zoom >= 16)) {
            styleDefault['icon-image'] = 'metro_others6.png';
            styleDefault['z-index'] = 17;
        }

        if (((type == 'node' && tags['railway'] == 'subway_entrance' && ('name' in tags)) && zoom >= 16)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 11;
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 2;
            styleDefault['text-color'] = '#1300bb';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['aeroway'] == 'aerodrome') && zoom >= 10)) {
            styleDefault['icon-image'] = 'airport_world.png';
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 12;
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Condensed Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#1e7ca5';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['z-index'] = 17;
        }

        if (((type == 'node' && (tags['capital'] == '1' || tags['capital'] == 'true' || tags['capital'] == 'yes') && tags['population'] > '5000000') && zoom >= 3 && zoom <= 6)) {
            styleDefault['icon-image'] = 'adm_5.png';
            styleDefault['allow-overlap'] = 'true';
        }

        if (((type == 'node' && (tags['capital'] == '1' || tags['capital'] == 'true' || tags['capital'] == 'yes') && tags['population'] > '5000000') && zoom >= 3 && zoom <= 4)) {
            styleDefault['text-offset'] = 4;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#505050';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['text-align'] = 'left';
        }

        if (((type == 'node' && (tags['capital'] == '1' || tags['capital'] == 'true' || tags['capital'] == 'yes') && tags['population'] > '5000000') && zoom >= 4 && zoom <= 6)) {
            styleDefault['text-offset'] = 6;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#303030';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['text-align'] = 'left';
        }

        if (((type == 'node' && ('place' in tags) && tags['population'] < '100000' && ('capital' in tags) && tags['admin_level'] < '5') && zoom >= 4 && zoom <= 5)) {
            styleDefault['icon-image'] = 'adm_4.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '7';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#404040';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && ('place' in tags) && tags['population'] >= '100000' && tags['population'] <= '5000000' && ('capital' in tags) && tags['admin_level'] < '5') && zoom >= 4 && zoom <= 5)) {
            styleDefault['icon-image'] = 'adm_5.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#404040';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['z-index'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'town' && ('capital' in tags)) && zoom >= 5 && zoom <= 6)) {
            styleDefault['icon-image'] = 'town_4.png';
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] < '100000') && zoom >= 6 && zoom <= 7)
            || ((type == 'node' && tags['place'] == 'town' && tags['population'] < '100000' && ('admin_level' in tags)) && zoom >= 6 && zoom <= 7)) {
            styleDefault['icon-image'] = 'adm1_4_6.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] < '100000') && zoom >= 7 && zoom <= 8)
            || ((type == 'node' && tags['place'] == 'town' && tags['population'] < '100000') && zoom >= 7 && zoom <= 8)) {
            styleDefault['icon-image'] = 'town_6.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'town' && (!('population' in tags))) && zoom >= 7 && zoom <= 8)
            || ((type == 'node' && tags['place'] == 'city' && (!('population' in tags))) && zoom >= 7 && zoom <= 8)) {
            styleDefault['icon-image'] = 'town_6.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'town') && zoom >= 8 && zoom <= 9)) {
            styleDefault['icon-image'] = 'town_6.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] >= '100000' && tags['population'] <= '1000000') && zoom >= 6 && zoom <= 8)
            || ((type == 'node' && tags['place'] == 'town' && tags['population'] >= '100000' && tags['population'] <= '1000000' && ('admin_level' in tags)) && zoom >= 6 && zoom <= 7)) {
            styleDefault['icon-image'] = 'adm1_5.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#303030';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] >= '100000' && tags['population'] <= '1000000') && zoom >= 7 && zoom <= 8)
            || ((type == 'node' && tags['place'] == 'town' && tags['population'] >= '100000' && tags['population'] <= '1000000') && zoom >= 7 && zoom <= 8)) {
            styleDefault['icon-image'] = 'adm1_5.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#303030';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] > '1000000') && zoom >= 6 && zoom <= 7)) {
            styleDefault['icon-image'] = 'adm1_6_test2.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#404040';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['z-index'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] > '1000000' && tags['population'] < '5000000') && zoom >= 7 && zoom <= 8)) {
            styleDefault['icon-image'] = 'adm1_6_test2.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '11';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#404040';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['z-index'] = 2;
        }

        if (((type == 'node' && tags['place'] == 'city' && tags['population'] >= '5000000') && zoom >= 7 && zoom <= 8)) {
            styleDefault['icon-image'] = 'adm_6.png';
            styleDefault['text-offset'] = 5;
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '12';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#404040';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['z-index'] = 3;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags['capital'] == '1' || tags['capital'] == 'true' || tags['capital'] == 'yes')) && zoom >= 9 && zoom <= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -20;
            styleDefault['font-size'] = '14';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 4;
            styleDefault['text-color'] = '#101010';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '50';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags['capital'] == '-1' || tags['capital'] == 'false' || tags['capital'] == 'no')) && zoom >= 9 && zoom <= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -20;
            styleDefault['font-size'] = '14';
            styleDefault['font-family'] = 'DejaVu Sans Bold';
            styleDefault['text-halo-radius'] = 2;
            styleDefault['text-color'] = '#101010';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['z-index'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'town') && zoom >= 11 && zoom <= 12)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '12';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'town') && zoom >= 12 && zoom <= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '20';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.2';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'city') && zoom >= 12 && zoom <= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '25';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.3';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'town') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '40';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.2';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'city') && zoom >= 13 && zoom <= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '50';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.3';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'town') && zoom >= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '80';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.2';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'city') && zoom >= 14)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '100';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-color'] = '#101010';
            styleDefault['text-opacity'] = '0.3';
            styleDefault['text-allow-overlap'] = 'true';
            styleDefault['z-index'] = 20;
        }

        if (((type == 'node' && tags['place'] == 'village') && zoom >= 9)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 1;
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#606060';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
        }

        if (((type == 'node' && tags['place'] == 'hamlet') && zoom >= 9)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 1;
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#505050';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
        }

        if (((selector == 'area' && tags['landuse'] == 'nature_reserve') && zoom >= 9)
            || ((selector == 'area' && tags['leisure'] == 'park') && zoom >= 11)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 1;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Serif Italic';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#3c8000';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-allow-overlap'] = 'false';
        }

        if (((type == 'way' && tags['waterway'] == 'stream') && zoom >= 10)
            || ((type == 'way' && tags['waterway'] == 'river') && zoom >= 9)
            || ((type == 'way' && tags['waterway'] == 'canal') && zoom >= 13)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '9';
            styleDefault['font-family'] = 'DejaVu Sans Oblique';
            styleDefault['text-color'] = '#547bd1';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['text-position'] = 'line';
        }

        if (((type == 'node' && tags['place'] == 'continent') && zoom <= 3)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -10;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = -1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'continent') && zoom >= 2 && zoom <= 3)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -10;
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = -1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'ocean') && zoom <= 6)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Oblique';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = -1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'ocean') && zoom >= 7)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '11';
            styleDefault['font-family'] = 'DejaVu Sans Oblique';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#202020';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = -1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'sea') && zoom <= 6)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans Oblique';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#4976d1';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'sea') && zoom >= 7)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans Oblique';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#4976d1';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['natural'] == 'peak' && tags['ele'] > '4500') && zoom >= 3 && zoom <= 4)) {
            styleDefault['icon-image'] = 'mountain_peak6.png';
            styleDefault['text'] = tags['ele'];
            styleDefault['text-offset'] = 3;
            styleDefault['font-size'] = '7';
            styleDefault['font-family'] = 'DejaVu Sans Mono Book';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#664229';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['natural'] == 'peak' && tags['ele'] > '3500') && zoom >= 5 && zoom <= 6)) {
            styleDefault['icon-image'] = 'mountain_peak6.png';
            styleDefault['text'] = tags['ele'];
            styleDefault['text-offset'] = 3;
            styleDefault['font-size'] = '7';
            styleDefault['font-family'] = 'DejaVu Sans Mono Book';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#664229';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['natural'] == 'peak' && tags['ele'] > '2500') && zoom >= 7 && zoom <= 12)) {
            styleDefault['icon-image'] = 'mountain_peak6.png';
            styleDefault['text'] = tags['ele'];
            styleDefault['text-offset'] = 3;
            styleDefault['font-size'] = '7';
            styleDefault['font-family'] = 'DejaVu Sans Mono Book';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#664229';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['natural'] == 'peak') && zoom >= 12)) {
            styleDefault['icon-image'] = 'mountain_peak6.png';
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 3;
            styleDefault['font-size'] = '7';
            styleDefault['font-family'] = 'DejaVu Sans Mono Book';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#664229';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'country') && zoom >= 2 && zoom <= 3)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '10';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#dd5875';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = 1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'country') && zoom >= 4 && zoom <= 8)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '13';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = 'red';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = 1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((type == 'node' && tags['place'] == 'country') && zoom >= 8 && zoom <= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 0;
            styleDefault['font-size'] = '16';
            styleDefault['font-family'] = 'DejaVu Sans Book';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = 'red';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['z-index'] = 1;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '3') && zoom >= 3 && zoom <= 5)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -5;
            styleDefault['font-size'] = '8';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-halo-radius'] = 0;
            styleDefault['text-color'] = '#101010';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
            styleDefault['max-width'] = 50;
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '4') && zoom >= 6 && zoom <= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = 17;
            styleDefault['font-size'] = '14';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#606060';
            styleDefault['text-halo-color'] = '#ffffff';
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        if (((selector == 'area' && tags['boundary'] == 'administrative' && tags['admin_level'] == '6') && zoom >= 10)) {
            styleDefault['text'] = tags['name'];
            styleDefault['text-offset'] = -10;
            styleDefault['font-size'] = '12';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-color'] = '#7848a0';
            styleDefault['text-halo-color'] = '#ffffff';
        }

        if (((type == 'node' && tags['place'] == 'suburb') && zoom >= 12)) {
            styleDefault['text'] = tags['name'];
            styleDefault['font-size'] = '12';
            styleDefault['font-family'] = 'DejaVu Sans ExtraLight';
            styleDefault['text-color'] = '#7848a0';
            styleDefault['z-index'] = 20;
        }

        if (((selector == 'area' && ('building' in tags)) && zoom >= 13)) {
            styleDefault['width'] = .3;
            styleDefault['color'] = '#cca352';
            styleDefault['z-index'] = 17;
        }

        if (((selector == 'area' && (tags['building'] == '1' || tags['building'] == 'true' || tags['building'] == 'yes')) && zoom >= 15)) {
            styleDefault['fill-color'] = '#E7CCB4';
            styleDefault['z-index'] = 17;
        }

        if (((selector == 'area' && tags['building'] == 'public') && zoom >= 15)) {
            styleDefault['fill-color'] = '#edc2ba';
            styleDefault['z-index'] = 17;
        }

        if (((selector == 'area' && ('building' in tags) && (tags['building'] == '-1' || tags['building'] == 'false' || tags['building'] == 'no') && tags['building'] !== 'public') && zoom >= 15)) {
            styleDefault['fill-color'] = '#D8D1D1';
            styleDefault['z-index'] = 17;
        }

        if (((selector == 'area' && ('building' in tags)) && zoom >= 15 && zoom <= 16)) {
            styleDefault['text'] = tags['addr:housenumber'];
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-position'] = 'center';
            styleDefault['font-size'] = '7';
            styleDefault['-x-mapnik-min-distance'] = '10';
            styleDefault['opacity'] = 0.8;
        }

        if (((selector == 'area' && ('building' in tags)) && zoom >= 17)) {
            styleDefault['text'] = tags['addr:housenumber'];
            styleDefault['text-halo-radius'] = 1;
            styleDefault['text-position'] = 'center';
            styleDefault['font-size'] = '8';
            styleDefault['-x-mapnik-min-distance'] = '10';
            styleDefault['opacity'] = 0.8;
        }

        if (((type == 'node' && tags['highway'] == 'milestone' && ('pk' in tags)) && zoom >= 13)) {
            styleDefault['text'] = tags['pk'];
            styleDefault['font-size'] = '7';
            styleDefault['text-halo-radius'] = 5;
            styleDefault['-x-mapnik-min-distance'] = '0';
        }

        return style;
    }

    var sprite_images = {
        'adm1_4_6.png': {width: 4, height: 4, offset: 0},
        'adm1_5.png': {width: 5, height: 5, offset: 4},
        'adm1_6_test2.png': {width: 6, height: 6, offset: 9},
        'adm_4.png': {width: 4, height: 4, offset: 15},
        'adm_5.png': {width: 5, height: 5, offset: 19},
        'adm_6.png': {width: 6, height: 6, offset: 24},
        'airport_world.png': {width: 11, height: 14, offset: 30},
        'aut2_16x16_park.png': {width: 16, height: 16, offset: 44},
        'autobus_stop_14x10.png': {width: 14, height: 10, offset: 60},
        'bull2.png': {width: 12, height: 12, offset: 70},
        'cemetry7_2.png': {width: 14, height: 14, offset: 82},
        'cinema_14x14.png': {width: 14, height: 14, offset: 96},
        'desert22.png': {width: 16, height: 8, offset: 110},
        'glacier.png': {width: 10, height: 10, offset: 118},
        'hotell_14x14.png': {width: 14, height: 14, offset: 128},
        'kindergarten_14x14.png': {width: 14, height: 14, offset: 142},
        'kust1.png': {width: 14, height: 14, offset: 156},
        'lib_13x14.png': {width: 13, height: 12, offset: 170},
        'med1_11x14.png': {width: 11, height: 14, offset: 182},
        'metro_others6.png': {width: 16, height: 16, offset: 196},
        'mountain_peak6.png': {width: 3, height: 3, offset: 212},
        'mus_13x12.png': {width: 13, height: 12, offset: 215},
        'parks2.png': {width: 12, height: 12, offset: 227},
        'post_14x11.png': {width: 14, height: 11, offset: 239},
        'pravosl_kupol_11x15.png': {width: 11, height: 15, offset: 250},
        'rest_14x14.png': {width: 14, height: 14, offset: 265},
        'rw_stat_stanzii_2_blue.png': {width: 9, height: 5, offset: 279},
        'sady10.png': {width: 16, height: 16, offset: 284},
        'school_13x13.png': {width: 13, height: 13, offset: 300},
        'sud_14x13.png': {width: 14, height: 13, offset: 313},
        'superm_12x12.png': {width: 12, height: 12, offset: 326},
        'swamp_world2.png': {width: 23, height: 24, offset: 338},
        'tankstelle1_10x11.png': {width: 10, height: 11, offset: 362},
        'teater_14x14.png': {width: 14, height: 14, offset: 373},
        'town_4.png': {width: 4, height: 4, offset: 387},
        'town_6.png': {width: 6, height: 6, offset: 391},
        'tramway_14x13.png': {width: 14, height: 13, offset: 397},
        'univer_15x11.png': {width: 15, height: 11, offset: 410},
        'wc-3_13x13.png': {width: 13, height: 13, offset: 421},
        'zoo4_14x14.png': {width: 14, height: 14, offset: 434}};

    var external_images = [];

    MapCSS.loadStyle('osmosnimki-maps', restyle, sprite_images, external_images);
})(MapCSS);

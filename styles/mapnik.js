
(function (MapCSS) {
    'use strict';

    function restyle(style, tags, zoom, type, selector) {
        var s_tram = {}, s_over6 = {}, s_over5 = {}, s_over4 = {}, s_over3 = {}, s_over2 = {}, s_over1 = {}, s_under1 = {}, s_under2 = {}, s_* = {}, s_ele = {}, s_access = {}, s_water_lines-casing = {}, s_tram_under3 = {}, s_oneway_over2 = {}, s_oneway_over3 = {}, s_oneway_over1 = {}, s_tram_under2 = {}, s_casing1 = {}, s_casing2 = {}, s_bridge-casing1 = {}, s_bridge-casing2 = {}, s_default = {}, s_oneway = {}, s_roads-casing = {};

        if ((selector == 'meta')) {
            s_default['title'] = 'Mapnik (true)';
            s_default['version'] = '0.1';
            s_default['description'] = 'MapCSS variant of the OSM Mapnik style (as close as possible to the original). It is not very suitable for real mapping in an editor because nodes and lines without a style are hidden and opaque areas may cover each other. This file is optimized for JOSM and may need some minor changes to work properly with other MapCSS implementations.';
            s_default['acknowledgement'] = 'Derived from the OpenStreetMap Mapnik style (various authors): http://trac.openstreetmap.org/browser/applications/rendering/mapnik';
        }

        if ((selector == 'canvas')) {
            s_default['background-color'] = '#f1eee8';
            s_default['default-lines'] = 'false';
            s_default['default-points'] = 'false';
        }

        if ((type == 'way')) {
            s_*['linejoin'] = 'miter';
            s_*['linecap'] = 'none';
        }

        if (((selector == 'area' && ))) {
            s_default['fill-opacity'] = 1;
        }

        if ((selector == '*')) {
            s_*['text-halo-color'] = 'white';
            s_*['text-anchor-horizontal'] = 'center';
            s_*['text-anchor-vertical'] = 'center';
        }

        if (((selector == 'area' && tags['leisure'] == 'swimming_pool') && zoom >= 14)) {
            s_default['fill-color'] = '#b5d0d0';
            s_default['color'] = 'blue';
            s_default['width'] = 0.5;
        }

        if (((selector == 'area' && tags['leisure'] == 'playground') && zoom >= 13)) {
            s_default['fill-color'] = '#ccfff1';
            s_default['color'] = '#666666';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['tourism'] == 'camp_site') && zoom >= 13) || ((selector == 'area' && tags['tourism'] == 'caravan_site') && zoom >= 13) || ((selector == 'area' && tags['tourism'] == 'picnic_site') && zoom >= 13)) {
            s_default['fill-color'] = '#ccff99';
            s_default['fill-opacity'] = 0.5;
            s_default['color'] = '#666666';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['tourism'] == 'attraction') && zoom >= 10)) {
            s_default['fill-color'] = '#f2caea';
        }

        if (((selector == 'area' && tags['landuse'] == 'quarry') && zoom >= 11)) {
            s_default['fill-image'] = 'symbols/quarry2.png';
            s_default['color'] = 'grey';
            s_default['width'] = 0.5;
        }

        if (((selector == 'area' && tags['landuse'] == 'vineyard') && zoom >= 10 && zoom <= 12)) {
            s_default['fill-color'] = '#abdf96';
        }

        if (((selector == 'area' && tags['landuse'] == 'orchard') && zoom >= 10)) {
            s_default['fill-image'] = 'symbols/orchard.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'vineyard') && zoom >= 13)) {
            s_default['fill-image'] = 'symbols/vineyard.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'cemetery') && zoom >= 10 && zoom <= 14) || ((selector == 'area' && tags['landuse'] == 'grave_yard') && zoom >= 10 && zoom <= 14) || ((selector == 'area' && tags['amenity'] == 'grave_yard') && zoom >= 10 && zoom <= 14)) {
            s_default['fill-color'] = '#aacbaf';
        }

        if (((selector == 'area' && tags['landuse'] == 'residential') && zoom >= 10)) {
            s_default['fill-color'] = '#dddddd';
        }

        if (((selector == 'area' && tags['landuse'] == 'garages') && zoom >= 12)) {
            s_default['fill-color'] = '#999966';
            s_default['fill-opacity'] = 0.2;
        }

        if (((selector == 'area' && tags['military'] == 'barracks') && zoom >= 10)) {
            s_default['fill-color'] = '#ff8f8f';
        }

        if (((selector == 'area' && tags['landuse'] == 'field') && zoom >= 10 && zoom <= 13) || ((selector == 'area' && tags['natural'] == 'field') && zoom >= 10 && zoom <= 13)) {
            s_default['fill-color'] = '#666600';
            s_default['fill-opacity'] = 0.2;
        }

        if (((selector == 'area' && tags['landuse'] == 'field') && zoom >= 14) || ((selector == 'area' && tags['natural'] == 'field') && zoom >= 14)) {
            s_default['fill-color'] = '#666600';
            s_default['fill-opacity'] = 0.2;
            s_default['color'] = '#666600';
            s_default['opacity'] = 0.4;
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['military'] == 'danger_area') && zoom >= 9 && zoom <= 10)) {
            s_default['fill-color'] = 'pink';
            s_default['fill-opacity'] = 0.3;
        }

        if (((selector == 'area' && tags['military'] == 'danger_area') && zoom >= 11)) {
            s_default['fill-image'] = 'symbols/danger.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'cemetery' && tags['religion'] == 'jewish') && zoom >= 14) || ((selector == 'area' && tags['landuse'] == 'grave_yard' && tags['religion'] == 'jewish') && zoom >= 14) || ((selector == 'area' && tags['amenity'] == 'grave_yard' && tags['religion'] == 'jewish') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/cemetery_jewish.18.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'cemetery' && tags['religion'] == 'christian') && zoom >= 14) || ((selector == 'area' && tags['landuse'] == 'grave_yard' && tags['religion'] == 'christian') && zoom >= 14) || ((selector == 'area' && tags['amenity'] == 'grave_yard' && tags['religion'] == 'christian') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/grave_yard.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'cemetery' && tags['religion'] !== 'christian' && tags['religion'] !== 'jewish') && zoom >= 14) || ((selector == 'area' && tags['landuse'] == 'grave_yard' && tags['religion'] !== 'christian' && tags['religion'] !== 'jewish') && zoom >= 14) || ((selector == 'area' && tags['amenity'] == 'grave_yard' && tags['religion'] !== 'christian' && tags['religion'] !== 'jewish') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/grave_yard_generic.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'meadow') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'grass') && zoom >= 10)) {
            s_default['fill-color'] = '#cfeca8';
        }

        if (((selector == 'area' && tags['leisure'] == 'park') && zoom >= 10) || ((selector == 'area' && tags['leisure'] == 'recreation_ground') && zoom >= 10)) {
            s_default['fill-color'] = '#b6fdb6';
            s_default['fill-opacity'] = 0.6;
        }

        if (((selector == 'area' && tags['tourism'] == 'zoo') && zoom >= 10)) {
            s_default['fill-image'] = 'symbols/zoo.png';
        }

        if (((selector == 'area' && tags['leisure'] == 'common') && zoom >= 10)) {
            s_default['fill-color'] = '#cfeca8';
        }

        if (((selector == 'area' && tags['leisure'] == 'garden') && zoom >= 10)) {
            s_default['fill-color'] = '#cfeca8';
        }

        if (((selector == 'area' && tags['leisure'] == 'golf_course') && zoom >= 10)) {
            s_default['fill-color'] = '#b5e3b5';
        }

        if (((selector == 'area' && tags['landuse'] == 'allotments') && zoom >= 10 && zoom <= 13)) {
            s_default['fill-color'] = '#e5c7ab';
        }

        if (((selector == 'area' && tags['landuse'] == 'allotments') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/allotments.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'forest') && zoom >= 8 && zoom <= 13)) {
            s_default['fill-color'] = '#8dc56c';
        }

        if (((selector == 'area' && tags['landuse'] == 'forest') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/forest.png';
        }

        if (((selector == 'area' && tags['landuse'] == 'farmyard') && zoom >= 9)) {
            s_default['fill-color'] = '#ddbf92';
        }

        if (((selector == 'area' && tags['landuse'] == 'farm') && zoom >= 9) || ((selector == 'area' && tags['landuse'] == 'farmland') && zoom >= 9)) {
            s_default['fill-color'] = '#ead8bd';
        }

        if (((selector == 'area' && tags['landuse'] == 'recreation_ground') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'conservation') && zoom >= 10)) {
            s_default['fill-color'] = '#cfeca8';
        }

        if (((selector == 'area' && tags['landuse'] == 'village_green') && zoom >= 11)) {
            s_default['fill-color'] = '#cfeca8';
        }

        if (((selector == 'area' && tags['landuse'] == 'retail') && zoom >= 10)) {
            s_default['fill-color'] = '#f1dada';
        }

        if (((selector == 'area' && tags['landuse'] == 'retail') && zoom >= 15)) {
            s_default['color'] = 'red';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['landuse'] == 'industrial') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'railway') && zoom >= 10)) {
            s_default['fill-color'] = '#dfd1d6';
        }

        if (((selector == 'area' && tags['power'] == 'station') && zoom >= 10 && zoom <= 11) || ((selector == 'area' && tags['power'] == 'generator') && zoom >= 10 && zoom <= 11)) {
            s_default['fill-color'] = '#bbbbbb';
        }

        if (((selector == 'area' && tags['power'] == 'station') && zoom >= 12) || ((selector == 'area' && tags['power'] == 'generator') && zoom >= 12)) {
            s_default['fill-color'] = '#bbbbbb';
            s_default['color'] = '#555555';
            s_default['width'] = 0.4;
        }

        if (((selector == 'area' && tags['power'] == 'sub_station') && zoom >= 13)) {
            s_default['fill-color'] = '#bbbbbb';
            s_default['color'] = '#555555';
            s_default['width'] = 0.4;
        }

        if (((selector == 'area' && tags['landuse'] == 'commercial') && zoom >= 10)) {
            s_default['fill-color'] = '#efc8c8';
        }

        if (((selector == 'area' && tags['landuse'] == 'brownfield') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'landfill') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'greenfield') && zoom >= 10) || ((selector == 'area' && tags['landuse'] == 'construction') && zoom >= 10)) {
            s_default['fill-color'] = '#9d9d6c';
            s_default['fill-opacity'] = 0.7;
        }

        if (((selector == 'area' && tags['natural'] == 'wood') && zoom >= 8) || ((selector == 'area' && tags['landuse'] == 'wood') && zoom >= 8)) {
            s_default['fill-color'] = '#aed1a0';
        }

        if (((selector == 'area' && tags['natural'] == 'desert') && zoom >= 8)) {
            s_default['fill-color'] = '#e3b57a';
        }

        if (((selector == 'area' && tags['natural'] == 'sand') && zoom >= 10)) {
            s_default['fill-color'] = '#ffdf88';
        }

        if (((selector == 'area' && tags['natural'] == 'heath') && zoom >= 10)) {
            s_default['fill-color'] = '#d6d99f';
        }

        if (((selector == 'area' && tags['natural'] == 'scrub') && zoom >= 10 && zoom <= 13)) {
            s_default['fill-color'] = '#b5e3b5';
        }

        if (((selector == 'area' && tags['natural'] == 'scrub') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/scrub.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'university') && zoom >= 10) || ((selector == 'area' && tags['amenity'] == 'college') && zoom >= 10) || ((selector == 'area' && tags['amenity'] == 'school') && zoom >= 10) || ((selector == 'area' && tags['amenity'] == 'hospital') && zoom >= 10) || ((selector == 'area' && tags['amenity'] == 'kindergarten') && zoom >= 10)) {
            s_default['fill-color'] = '#f0f0d8';
        }

        if (((selector == 'area' && tags['amenity'] == 'university') && zoom >= 12) || ((selector == 'area' && tags['amenity'] == 'college') && zoom >= 12) || ((selector == 'area' && tags['amenity'] == 'school') && zoom >= 12) || ((selector == 'area' && tags['amenity'] == 'hospital') && zoom >= 12) || ((selector == 'area' && tags['amenity'] == 'kindergarten') && zoom >= 12)) {
            s_default['color'] = 'brown';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['amenity'] == 'parking') && zoom >= 10)) {
            s_default['fill-color'] = '#f7efb7';
        }

        if (((selector == 'area' && tags['amenity'] == 'parking') && zoom >= 15)) {
            s_default['color'] = '#eeeed1';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['aeroway'] == 'apron') && zoom >= 12)) {
            s_default['fill-color'] = '#e9d1ff';
        }

        if (((selector == 'area' && tags['aeroway'] == 'aerodrome') && zoom >= 12)) {
            s_default['fill-color'] = '#cccccc';
            s_default['fill-opacity'] = 0.2;
            s_default['color'] = '#555555';
            s_default['width'] = 0.2;
        }

        if (((selector == 'area' && tags['natural'] == 'beach') && zoom >= 13)) {
            s_default['fill-image'] = 'symbols/beach.png';
        }

        if (((selector == 'area' && tags['highway'] == 'services') && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'rest_area') && zoom >= 14)) {
            s_default['fill-color'] = '#efc8c8';
        }

        if (((type == 'way' && tags['man_made'] == 'cutline') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = '#f2efe9';
            s_default['linecap'] = 'square';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['man_made'] == 'cutline') && zoom >= 16)) {
            s_default['color'] = '#f2efe9';
            s_default['linecap'] = 'square';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
        }

        if (((selector == 'area' && tags['leisure'] == 'sports_centre') && zoom >= 10) || ((selector == 'area' && tags['leisure'] == 'stadium') && zoom >= 10)) {
            s_default['fill-color'] = '#33cc99';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['leisure'] == 'track') && zoom >= 10)) {
            s_default['fill-color'] = '#74dcba';
            s_default['color'] = '#888888';
            s_default['width'] = 0.5;
            s_default['z-index'] = -998;
        }

        if (((selector == 'area' && tags['leisure'] == 'pitch') && zoom >= 10)) {
            s_default['fill-color'] = '#8ad3af';
            s_default['color'] = '#888888';
            s_default['width'] = 0.5;
            s_default['z-index'] = -997;
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['waterway'] == 'ditch' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['waterway'] == 'drain' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_water_lines-casing['color'] = 'white';
            s_water_lines-casing['width'] = 1.5;
            s_water_lines-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_water_lines-casing['color'] = 'white';
            s_water_lines-casing['width'] = 2.5;
            s_water_lines-casing['z-index'] = -1;
        }

        if (((selector == 'area' && tags['natural'] == 'glacier') && zoom >= 6 && zoom <= 7)) {
            s_default['fill-image'] = 'symbols/glacier.png';
            s_default['color'] = '#99ccff';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 1.5;
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['natural'] == 'glacier') && zoom >= 8)) {
            s_default['fill-image'] = 'symbols/glacier2.png';
            s_default['color'] = '#99ccff';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 1.5;
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['waterway'] == 'dock') && zoom >= 9) || ((selector == 'area' && tags['waterway'] == 'mill_pond') && zoom >= 9) || ((selector == 'area' && tags['waterway'] == 'canal') && zoom >= 9)) {
            s_default['fill-color'] = '#b5d0d0';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['landuse'] == 'basin') && zoom >= 7)) {
            s_default['fill-color'] = '#b5d0d0';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['natural'] == 'lake') && zoom >= 6) || ((selector == 'area' && tags['natural'] == 'water') && zoom >= 6) || ((selector == 'area' && tags['landuse'] == 'reservoir') && zoom >= 6) || ((selector == 'area' && tags['waterway'] == 'riverbank') && zoom >= 6) || ((selector == 'area' && tags['landuse'] == 'water') && zoom >= 6) || ((selector == 'area' && tags['natural'] == 'bay') && zoom >= 6)) {
            s_default['fill-color'] = '#b5d0d0';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['natural'] == 'mud') && zoom >= 13)) {
            s_default['fill-image'] = 'symbols/mud.png';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['natural'] == 'land') && zoom >= 10)) {
            s_default['fill-color'] = '#f2efe9';
            s_default['z-index'] = -999;
        }

        if (((selector == 'area' && tags['natural'] == 'marsh') && zoom >= 13) || ((selector == 'area' && tags['natural'] == 'wetland') && zoom >= 13)) {
            s_default['fill-image'] = 'symbols/marsh.png';
            s_default['z-index'] = -998;
        }

        if (((selector == 'area' && tags['natural'] == 'glacier' && tags['way_area'] >= '10000000') && zoom >= 10)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9999ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((selector == 'area' && tags['natural'] == 'glacier' && tags['way_area'] >= '5000000' && tags['way_area'] < '10000000') && zoom >= 11)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9999ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((selector == 'area' && tags['natural'] == 'glacier' && tags['way_area'] < '5000000') && zoom >= 12)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9999ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom === 8)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 0.7;
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom === 9)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 1.2;
        }

        if (((type == 'way' && tags['waterway'] == 'river') && zoom >= 10 && zoom <= 11)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 1.6;
        }

        if (((type == 'way' && tags['waterway'] == 'weir' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_default['color'] = '#aaaaaa';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['waterway'] == 'wadi' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['waterway'] == 'wadi' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 16)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 12)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 13)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 14)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 17)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 10;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 18)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 12;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 12)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 13)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['waterway'] == 'ditch' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['waterway'] == 'drain' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 14)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 14)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 4;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '10';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15 && zoom <= 16)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 4;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '10';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 17)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 17)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 7;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '10';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 18)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['waterway'] == 'river' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 18)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 9;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '10';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 14 && zoom <= 16)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 14 && zoom <= 16)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 3;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '9';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (!tags.hasOwnProperty('tunnel?')) && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 14 && zoom <= 16)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 17)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 17)) {
            s_over1['color'] = 'white';
            s_over1['width'] = 7;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '9';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (!tags.hasOwnProperty('tunnel?')) && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no') && (tags['lock'] == '-1' || tags['lock'] == 'false' || tags['lock'] == 'no') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 17)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (!tags.hasOwnProperty('tunnel?')) && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no') && (tags['lock'] == '1' || tags['lock'] == 'true' || tags['lock'] == 'yes') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 17)) {
            s_default['color'] = '#b5d0d0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'way' && tags['waterway'] == 'derelict_canal' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 12) || ((type == 'way' && tags['waterway'] == 'canal' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 12)) {
            s_default['color'] = '#b5e4d0';
            s_default['dashes'] = [4, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['waterway'] == 'derelict_canal' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 13) || ((type == 'way' && tags['waterway'] == 'canal' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom === 13)) {
            s_default['color'] = '#b5e4d0';
            s_default['dashes'] = [4, 6];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2.5;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#80d1ae';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '600';
        }

        if (((type == 'way' && tags['waterway'] == 'derelict_canal' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 14) || ((type == 'way' && tags['waterway'] == 'canal' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes') && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 14)) {
            s_default['color'] = '#b5e4d0';
            s_default['dashes'] = [4, 8];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 4.5;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#80d1ae';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '600';
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 2.4;
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_over1['color'] = '#f3f7f7';
            s_over1['width'] = 1.2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'stream' && (!tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 2;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '600';
        }

        if (((type == 'way' && tags['waterway'] == 'drain' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15) || ((type == 'way' && tags['waterway'] == 'ditch' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_default['color'] = '#b5d0d0';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['waterway'] == 'drain' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15) || ((type == 'way' && tags['waterway'] == 'ditch' && (tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_over1['color'] = '#f3f7f7';
            s_over1['width'] = 1;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'drain' && (!tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15) || ((type == 'way' && tags['waterway'] == 'ditch' && (!tags.hasOwnProperty('tunnel?')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'aqueduct') && zoom >= 15)) {
            s_default['color'] = '#b5d0d0';
            s_default['width'] = 1;
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '600';
        }

        if (((type == 'way' && tags['waterway'] == 'dam') && zoom >= 13)) {
            s_default['color'] = '#444444';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['waterway'] == 'dam') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#222222';
            s_default['text-halo-radius'] = 1;
        }

        if (((selector == 'area' && tags['leisure'] == 'marina') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = 'blue';
            s_default['dashes'] = [6, 2];
            s_default['opacity'] = 0.5;
            s_default['width'] = 1;
        }

        if (((selector == 'area' && tags['leisure'] == 'marina') && zoom >= 16)) {
            s_default['color'] = 'blue';
            s_default['dashes'] = [6, 2];
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
        }

        if (((selector == 'area' && tags['man_made'] == 'pier') && zoom >= 12) || ((selector == 'area' && tags['man_made'] == 'breakwater') && zoom >= 12) || ((selector == 'area' && tags['man_made'] == 'groyne') && zoom >= 12)) {
            s_default['fill-color'] = '#f2efe9';
        }

        if (((type == 'way' && tags['man_made'] == 'breakwater') && zoom >= 11 && zoom <= 12) || ((type == 'way' && tags['man_made'] == 'groyne') && zoom >= 11 && zoom <= 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['man_made'] == 'pier') && zoom >= 11 && zoom <= 12)) {
            s_default['color'] = '#f2efe9';
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['man_made'] == 'breakwater') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['man_made'] == 'groyne') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['man_made'] == 'pier') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#f2efe9';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['man_made'] == 'breakwater') && zoom >= 16) || ((type == 'way' && tags['man_made'] == 'groyne') && zoom >= 16)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['man_made'] == 'pier') && zoom >= 16)) {
            s_default['color'] = '#f2efe9';
            s_default['width'] = 7;
        }

        if (((type == 'node' && tags['waterway'] == 'lock_gate') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/lock_gate.png';
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom === 12)) {
            s_default['color'] = '#506077';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#506077';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#506077';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 17)) {
            s_default['color'] = '#506077';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom === 12)) {
            s_default['color'] = '#477147';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#477147';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#477147';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 17)) {
            s_default['color'] = '#477147';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 14;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom === 12)) {
            s_default['color'] = '#8d4346';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#8d4346';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#8d4346';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 17)) {
            s_default['color'] = '#8d4346';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 14;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom === 12)) {
            s_default['color'] = '#a37b48';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#a37b48';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#a37b48';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 17)) {
            s_default['color'] = '#a37b48';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 17;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom === 13) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom === 13)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom === 14)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 7.5;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 13) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 13) || ((type == 'way' && tags['highway'] == 'road') && zoom === 13)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 14) || ((type == 'way' && tags['highway'] == 'road') && zoom === 14)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 4.5;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 15) || ((type == 'way' && tags['highway'] == 'road') && zoom === 15)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 16) || ((type == 'way' && tags['highway'] == 'road') && zoom === 16)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'residential') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road') && zoom >= 17)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 16;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom === 12)) {
            s_default['color'] = '#d6dfea';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#d6dfea';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#d6dfea';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 17)) {
            s_default['color'] = '#d6dfea';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom === 12)) {
            s_default['color'] = '#cdeacd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#cdeacd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#cdeacd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 17)) {
            s_default['color'] = '#cdeacd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom === 12)) {
            s_default['color'] = '#f4c3c4';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#f4c3c4';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#f4c3c4';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 17)) {
            s_default['color'] = '#f4c3c4';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 12;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom === 12)) {
            s_default['color'] = '#fee0b8';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#fee0b8';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#fee0b8';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 10;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 17)) {
            s_default['color'] = '#fee0b8';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom === 13) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom === 13)) {
            s_default['color'] = '#ffffcc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom === 14)) {
            s_default['color'] = '#ffffcc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 13) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 13) || ((type == 'way' && tags['highway'] == 'road') && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 14) || ((type == 'way' && tags['highway'] == 'road') && zoom === 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ffffcc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link') && zoom >= 17)) {
            s_default['color'] = '#ffffcc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 15) || ((type == 'way' && tags['highway'] == 'road') && zoom === 15)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom === 16) || ((type == 'way' && tags['highway'] == 'road') && zoom === 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'residential') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road') && zoom >= 17)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['historic'] == 'citywalls') && zoom === 14)) {
            s_default['color'] = 'grey';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['historic'] == 'citywalls') && zoom === 15)) {
            s_default['color'] = 'grey';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['historic'] == 'citywalls') && zoom >= 16)) {
            s_default['color'] = 'grey';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 9;
        }

        if (((selector == 'area' && tags['historic'] == 'castle_walls') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = '#999999';
            s_default['width'] = 1;
        }

        if (((selector == 'area' && tags['historic'] == 'castle_walls') && zoom >= 16)) {
            s_default['color'] = '#888888';
            s_default['width'] = 2;
        }

        if (((selector == 'area' && tags['landuse'] == 'military') && zoom >= 10)) {
            s_default['fill-image'] = 'symbols/military_red_hz2.png';
            s_default['color'] = '#ff5555';
            s_default['opacity'] = 0.329;
            s_default['width'] = 3;
        }

        if (((selector == 'area' && tags['leisure'] == 'nature_reserve') && zoom >= 10 && zoom <= 13)) {
            s_default['fill-image'] = 'symbols/nature_reserve5.png';
            s_default['color'] = '#66cc33';
            s_default['width'] = 0.5;
        }

        if (((selector == 'area' && tags['leisure'] == 'nature_reserve') && zoom >= 14)) {
            s_default['fill-image'] = 'symbols/nature_reserve6.png';
            s_default['color'] = '#66cc33';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-tert-casing.18.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-casing.16.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.16.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-casing.18.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-casing.14.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.18.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-tert-casing.24.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-casing.24.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-casing.16.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.24.png';
            s_default['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'green';
            s_default['dashes'] = [4, 2];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 5.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3.5;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'salmon';
            s_default['dashes'] = [1, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 5.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['opacity'] = 0.4;
            s_under1['width'] = 1;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'black';
            s_default['dashes'] = [6, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 0.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'blue';
            s_default['dashes'] = [1, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade1') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade1') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['width'] = 3.5;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade1') && zoom >= 14)) {
            s_default['color'] = '#b37700';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade2') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 4.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade2') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade2') && zoom >= 14)) {
            s_default['color'] = '#a87000';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade3') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 4.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade3') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3.5;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade3') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade4') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 4.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade4') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade4') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [4, 7, 1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade5') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 4.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade5') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] == 'grade5') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5') && zoom >= 14)) {
            s_under2['color'] = 'grey';
            s_under2['dashes'] = [4, 2];
            s_under2['width'] = 4.5;
            s_under2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5') && zoom >= 14)) {
            s_under1['color'] = 'white';
            s_under1['linecap'] = 'round';
            s_under1['linejoin'] = 'round';
            s_under1['width'] = 3;
            s_under1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (tags.hasOwnProperty('tunnel?')) && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.5;
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['natural'] == 'cliff') && zoom >= 13 && zoom <= 14)) {
            s_default['pattern-image'] = 'symbols/cliff.png';
        }

        if (((type == 'way' && tags['natural'] == 'cliff') && zoom >= 15)) {
            s_default['pattern-image'] = 'symbols/cliff2.png';
        }

        if (((type == 'way' && tags['man_made'] == 'embankment') && zoom >= 15)) {
            s_default['pattern-image'] = 'symbols/cliff.png';
        }

        if (((type == 'way' && tags['barrier'] == 'embankment') && zoom >= 14)) {
            s_default['color'] = '#444444';
            s_default['width'] = 0.4;
        }

        if (((type == 'way' && tags['natural'] == 'hedge') && zoom >= 16) || ((type == 'way' && tags['barrier'] == 'hedge') && zoom >= 16)) {
            s_default['color'] = '#aed1a0';
            s_default['width'] = 3;
        }

        if (((type == 'way' && (tags.hasOwnProperty('barrier')) && tags['barrier'] !== 'hedge' && tags['barrier'] !== 'embankment') && zoom >= 16)) {
            s_default['color'] = '#444444';
            s_default['width'] = 0.4;
        }

        if (((selector == 'area' && tags['natural'] == 'hedge') && zoom >= 16) || ((selector == 'area' && tags['barrier'] == 'hedge') && zoom >= 16)) {
            s_default['fill-color'] = '#aed1a0';
        }

        if (((selector == 'area' && (tags.hasOwnProperty('barrier')) && tags['barrier'] !== 'hedge') && zoom >= 16)) {
            s_default['color'] = '#444444';
            s_default['width'] = 0.4;
        }

        if (((selector == 'area' && tags['highway'] == 'residential' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'unclassified' && ) && zoom >= 14)) {
            s_default['color'] = '#999999';
            s_default['width'] = 1;
        }

        if (((selector == 'area' && tags['highway'] == 'pedestrian' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'service' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'footway' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'path' && ) && zoom >= 14)) {
            s_default['color'] = 'grey';
            s_default['width'] = 1;
        }

        if (((selector == 'area' && tags['highway'] == 'track' && ) && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['width'] = 2;
        }

        if (((selector == 'area' && tags['highway'] == 'platform' && ) && zoom >= 16) || ((selector == 'area' && tags['railway'] == 'platform' && ) && zoom >= 16)) {
            s_default['color'] = 'grey';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'raceway') && zoom === 12)) {
            s_roads-casing['color'] = 'pink';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 1.2;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'raceway') && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = 'pink';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 4;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'raceway') && zoom >= 15)) {
            s_roads-casing['color'] = 'pink';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 1.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 4.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 8;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 2.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 8.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 6;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 2.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 6.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 8.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 10;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#506077';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 13;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#477147';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#8d4346';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#a37b48';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 6;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'road' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'road' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 4.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'road' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 8;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'road' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 16)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 11;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_roads-casing['color'] = '#bbbbbb';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 16;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 14 && zoom <= 15)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 2.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 14 && zoom <= 15)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 2.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 16)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 7;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 16)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 7;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'parking_aisle') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'drive-through') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'driveway') && zoom >= 16)) {
            s_roads-casing['color'] = '#999999';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 4;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 2;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 2;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 3.6;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 3.6;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 6.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('tunnel?'))) && zoom === 15)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 6.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 16)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 9;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 16)) {
            s_roads-casing['color'] = 'grey';
            s_roads-casing['dashes'] = [4, 2];
            s_roads-casing['width'] = 9;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom >= 12 && zoom <= 13)) {
            s_roads-casing['color'] = 'white';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 2.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 14)) {
            s_roads-casing['color'] = 'white';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 4;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 15)) {
            s_roads-casing['color'] = 'white';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 6;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 16)) {
            s_roads-casing['color'] = 'white';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 9;
            s_roads-casing['z-index'] = -1;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom >= 17)) {
            s_roads-casing['color'] = 'white';
            s_roads-casing['linecap'] = 'round';
            s_roads-casing['linejoin'] = 'round';
            s_roads-casing['width'] = 14.5;
            s_roads-casing['z-index'] = -1;
        }

        if (((selector == 'area' && tags['highway'] == 'living_street' && ) && zoom >= 14)) {
            s_default['fill-color'] = '#cccccc';
        }

        if (((selector == 'area' && tags['highway'] == 'residential' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'unclassified' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'service' && ) && zoom >= 14)) {
            s_default['fill-color'] = 'white';
        }

        if (((selector == 'area' && tags['highway'] == 'pedestrian' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'footway' && ) && zoom >= 14) || ((selector == 'area' && tags['highway'] == 'path' && ) && zoom >= 14)) {
            s_default['fill-color'] = '#ededed';
        }

        if (((selector == 'area' && tags['highway'] == 'track' && ) && zoom >= 14)) {
            s_default['fill-color'] = '#dfcc66';
        }

        if (((selector == 'area' && tags['highway'] == 'platform' && ) && zoom >= 16) || ((selector == 'area' && tags['railway'] == 'platform' && ) && zoom >= 16)) {
            s_default['fill-color'] = '#bbbbbb';
        }

        if (((selector == 'area' && tags['aeroway'] == 'runway' && ) && zoom >= 11)) {
            s_default['fill-color'] = '#bbbbcc';
        }

        if (((selector == 'area' && tags['aeroway'] == 'taxiway' && ) && zoom >= 13)) {
            s_default['fill-color'] = '#bbbbcc';
        }

        if (((selector == 'area' && tags['aeroway'] == 'helipad' && ) && zoom >= 16)) {
            s_default['fill-color'] = '#bbbbcc';
        }

        if (((selector == 'area' && tags['railway'] == 'station') && zoom >= 10) || ((selector == 'area' && tags['building'] == 'station') && zoom >= 10)) {
            s_default['fill-color'] = '#d4aaaa';
        }

        if (((selector == 'area' && tags['building'] == 'supermarket') && zoom >= 10)) {
            s_default['fill-color'] = 'pink';
            s_default['fill-opacity'] = 0.5;
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship') && zoom >= 10 && zoom <= 14)) {
            s_default['fill-color'] = '#777777';
            s_default['fill-opacity'] = 0.5;
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship') && zoom >= 15)) {
            s_default['fill-color'] = '#aaaaaa';
            s_default['fill-opacity'] = 0.9;
            s_default['color'] = '#111111';
            s_default['width'] = 0.3;
        }

        if (((selector == 'area' && tags['building'] == 'residential' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'house' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'garage' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'garages' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'detached' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'terrace' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12) || ((selector == 'area' && tags['building'] == 'apartments' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12)) {
            s_default['fill-color'] = '#bca9a9';
            s_default['fill-opacity'] = 0.7;
            s_default['z-index'] = -900;
        }

        if (((selector == 'area' && tags['building'] !== 'residential' && tags['building'] !== 'house' && tags['building'] !== 'garage' && tags['building'] !== 'garages' && tags['building'] !== 'detached' && tags['building'] !== 'terrace' && tags['building'] !== 'apartments' && (tags.hasOwnProperty('building')) && tags['building'] !== 'no' && tags['building'] !== 'station' && tags['building'] !== 'supermarket' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 12)) {
            s_default['fill-color'] = '#bca9a9';
            s_default['fill-opacity'] = 0.9;
            s_default['z-index'] = -900;
        }

        if (((selector == 'area' && tags['building'] !== 'residential' && tags['building'] !== 'house' && tags['building'] !== 'garage' && tags['building'] !== 'garages' && tags['building'] !== 'detached' && tags['building'] !== 'terrace' && tags['building'] !== 'apartments' && (tags.hasOwnProperty('building')) && tags['building'] !== 'no' && tags['building'] !== 'station' && tags['building'] !== 'supermarket' && tags['railway'] !== 'station' && tags['amenity'] !== 'place_of_worship') && zoom >= 16)) {
            s_default['color'] = '#330066';
            s_default['width'] = 0.2;
            s_default['z-index'] = -900;
        }

        if (((selector == 'area' && tags['aeroway'] == 'terminal') && zoom >= 12)) {
            s_default['fill-color'] = '#cc99ff';
            s_default['z-index'] = -900;
        }

        if (((selector == 'area' && tags['aeroway'] == 'terminal') && zoom >= 14)) {
            s_default['color'] = '#330066';
            s_default['width'] = 0.2;
            s_default['z-index'] = -900;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-tert-fill.16.png';
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.14.png';
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-livs-fill.14.png';
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.16.png';
        }

        if (((type == 'way' && tags['highway'] == 'service'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.12.png';
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-livs-fill.16.png';
        }

        if (((type == 'way' && tags['highway'] == 'tertiary'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-tert-fill.22.png';
        }

        if (((type == 'way' && tags['highway'] == 'residential'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.22.png';
        }

        if (((type == 'way' && tags['highway'] == 'service'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-uncl-fill.14.png';
        }

        if (((type == 'way' && tags['highway'] == 'living_street'))) {
            s_default['allow_overlap'] = 'true';
            s_default['icon-image'] = 'symbols/turning_circle-livs-fill.22.png';
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3.5;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#b37700';
            s_default['opacity'] = 0.7;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['linecap'] = 'round';
            s_casing1['linejoin'] = 'round';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#a87000';
            s_default['dashes'] = [9, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['linecap'] = 'round';
            s_casing1['linejoin'] = 'round';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['linecap'] = 'round';
            s_casing1['linejoin'] = 'round';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [4, 7, 1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['linecap'] = 'round';
            s_casing1['linejoin'] = 'round';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 2;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_casing1['color'] = 'white';
            s_casing1['linecap'] = 'round';
            s_casing1['linejoin'] = 'round';
            s_casing1['opacity'] = 0.4;
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && (!tags.hasOwnProperty('bridge')) && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && (!tags.hasOwnProperty('bridge')) && tags['tunnel'] == 'no') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && tags['bridge'] == 'no' && (!tags.hasOwnProperty('tunnel'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] !== 'grade1' && tags['tracktype'] !== 'grade2' && tags['tracktype'] !== 'grade3' && tags['tracktype'] !== 'grade4' && tags['tracktype'] !== 'grade5' && tags['bridge'] == 'no' && tags['tunnel'] == 'no') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 0.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'trunk_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'primary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4.5;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary_link' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom === 12)) {
            s_default['color'] = '#99cccc';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom === 12)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom === 12)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom === 12)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom === 12)) {
            s_default['color'] = '#a9dba9';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom === 12)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom === 12)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom === 12)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom === 12)) {
            s_default['color'] = '#fed7a5';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom === 12) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom === 12)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#99cccc';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#a9dba9';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#fed7a5';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary_link') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#ffffb3';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary_link') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary_link') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'residential') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'unclassified') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'living_street') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'service') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'residential') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'unclassified') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'living_street') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'service') && zoom >= 13 && zoom <= 15)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'residential') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'unclassified') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'living_street') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'service') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'residential') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'unclassified') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'living_street') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'service') && zoom >= 13 && zoom <= 15)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [6, 4];
            s_over1['width'] = 3.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom >= 16)) {
            s_default['color'] = '#99cccc';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && (!tags.hasOwnProperty('construction'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && (!tags.hasOwnProperty('construction'))) && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom >= 16)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'motorway_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'motorway_link') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom >= 16)) {
            s_default['color'] = '#a9dba9';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'trunk_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'trunk_link') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom >= 16)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'primary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'primary_link') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom >= 16)) {
            s_default['color'] = '#fed7a5';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'secondary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'secondary_link') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary_link') && zoom >= 16)) {
            s_default['color'] = '#ffffb3';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'tertiary_link') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'tertiary_link') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'residential') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'unclassified') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'living_street') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'service') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'residential') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'unclassified') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'living_street') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'service') && zoom >= 16)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'residential') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'unclassified') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'living_street') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'service') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'residential') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'unclassified') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'living_street') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'service') && zoom >= 16)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [8, 6];
            s_over1['width'] = 7;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'cycleway') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'cycleway') && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'proposed' && tags['construction'] == 'cycleway') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'construction' && tags['construction'] == 'cycleway') && zoom >= 14)) {
            s_over1['color'] = '#6699ff';
            s_over1['dashes'] = [2, 6];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1.2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 11 && zoom <= 12)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 12)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 15.5;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [1, 9];
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = '#fdfdfd';
            s_over1['dashes'] = [0, 1, 1, 8];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over2['color'] = '#ececec';
            s_over2['dashes'] = [0, 2, 1, 7];
            s_over2['linejoin'] = 'round';
            s_over2['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over3['color'] = '#cacaca';
            s_over3['dashes'] = [0, 3, 1, 6];
            s_over3['linejoin'] = 'round';
            s_over3['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over4['color'] = '#afafaf';
            s_over4['dashes'] = [0, 4, 1, 5];
            s_over4['linejoin'] = 'round';
            s_over4['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over5['color'] = '#a1a1a1';
            s_over5['dashes'] = [0, 5, 1, 4];
            s_over5['linejoin'] = 'round';
            s_over5['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over6['color'] = '#9b9b9b';
            s_over6['dashes'] = [0, 6, 1, 3];
            s_over6['linejoin'] = 'round';
            s_over6['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway'))) && zoom >= 13)) {
            s_default['color'] = 'grey';
            s_default['dashes'] = [2, 4];
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_casing1['color'] = '#999999';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [8, 12];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 14)) {
            s_casing1['color'] = '#999999';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [0, 11, 8, 1];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['railway'] == 'spur') && zoom >= 11 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'siding') && zoom >= 11 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur') && zoom >= 11 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding') && zoom >= 11 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard') && zoom >= 11 && zoom <= 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [1, 9];
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = '#fdfdfd';
            s_over1['dashes'] = [0, 1, 1, 8];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over2['color'] = '#ececec';
            s_over2['dashes'] = [0, 2, 1, 7];
            s_over2['linejoin'] = 'round';
            s_over2['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over3['color'] = '#cacaca';
            s_over3['dashes'] = [0, 3, 1, 6];
            s_over3['linejoin'] = 'round';
            s_over3['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over4['color'] = '#afafaf';
            s_over4['dashes'] = [0, 4, 1, 5];
            s_over4['linejoin'] = 'round';
            s_over4['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over5['color'] = '#a1a1a1';
            s_over5['dashes'] = [0, 5, 1, 4];
            s_over5['linejoin'] = 'round';
            s_over5['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over6['color'] = '#9b9b9b';
            s_over6['dashes'] = [0, 6, 1, 3];
            s_over6['linejoin'] = 'round';
            s_over6['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = '#999999';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [0, 8, 11, 1];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 0.8;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['railway'] == 'narrow_gauge' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'funicular' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = '#666666';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'funicular' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_casing2['color'] = '#666666';
            s_casing2['dashes'] = [5, 3];
            s_casing2['width'] = 5;
            s_casing2['z-index'] = -0.2;
        }

        if (((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'funicular' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_casing1['color'] = 'white';
            s_casing1['width'] = 4;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'funicular' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 1.5;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['railway'] == 'miniature') && zoom >= 15)) {
            s_default['color'] = '#999999';
            s_default['width'] = 1.2;
        }

        if (((type == 'way' && tags['railway'] == 'miniature') && zoom >= 15)) {
            s_over1['color'] = '#999999';
            s_over1['dashes'] = [1, 10];
            s_over1['width'] = 3;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#444444';
            s_default['dashes'] = [5, 3];
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_default['color'] = '#444444';
            s_default['dashes'] = [5, 3];
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'light_rail' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = '#666666';
            s_default['dashes'] = [5, 3];
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'light_rail' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = '#666666';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'subway' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 12)) {
            s_default['color'] = '#999999';
            s_default['dashes'] = [5, 3];
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'subway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 12)) {
            s_default['color'] = '#999999';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['highway'] == 'residential') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['highway'] == 'road') && zoom >= 10 && zoom <= 12)) {
            s_default['color'] = '#bbbbbb';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom === 13)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom === 14)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom === 15)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom === 16)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'road') && zoom >= 17)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 15)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6.5;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom >= 12 && zoom <= 13)) {
            s_default['color'] = '#cccccc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 14)) {
            s_default['color'] = '#cccccc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 15)) {
            s_default['color'] = '#cccccc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4.7;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom === 16)) {
            s_default['color'] = '#cccccc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7.4;
        }

        if (((type == 'way' && tags['highway'] == 'living_street') && zoom >= 17)) {
            s_default['color'] = '#cccccc';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4.5;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 14)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 17)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 13;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway') && zoom === 13)) {
            s_default['color'] = '#bbbbbb';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway') && zoom >= 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'parking_aisle') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'drive-through') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['service'] == 'driveway') && zoom >= 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian') && zoom === 13)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian') && zoom === 14)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian') && zoom === 15)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5.5;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian') && zoom >= 16)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8;
        }

        if (((type == 'way' && tags['highway'] == 'platform') && zoom >= 16) || ((type == 'way' && tags['railway'] == 'platform') && zoom >= 16)) {
            s_default['color'] = 'grey';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'steps') && zoom >= 15)) {
            s_default['color'] = 'salmon';
            s_default['dashes'] = [2, 1];
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = 'green';
            s_over1['dashes'] = [4, 2];
            s_over1['width'] = 1.2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = 'salmon';
            s_over1['dashes'] = [1, 3];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = 'black';
            s_over1['dashes'] = [6, 3];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 0.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'platform') && zoom >= 16) || ((type == 'way' && tags['railway'] == 'platform') && zoom >= 16)) {
            s_default['color'] = '#bbbbbb';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'steps') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = 'white';
            s_default['opacity'] = 0.4;
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['highway'] == 'steps') && zoom >= 13 && zoom <= 14)) {
            s_over1['color'] = 'salmon';
            s_over1['dashes'] = [1, 3];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13)) {
            s_over1['color'] = 'blue';
            s_over1['dashes'] = [1, 3];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1.2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'byway') && zoom >= 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'byway') && zoom >= 13)) {
            s_over1['color'] = '#ffcc00';
            s_over1['dashes'] = [3, 4];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'track') && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'track') && zoom === 13)) {
            s_over1['color'] = '#996600';
            s_over1['dashes'] = [3, 4];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1.2;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced') && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 3.5;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced') && zoom === 13)) {
            s_over1['color'] = '#debd9c';
            s_over1['dashes'] = [2, 4];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 2.5;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced') && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced') && zoom >= 14)) {
            s_over1['color'] = '#debd9c';
            s_over1['dashes'] = [4, 6];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 4;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway') && zoom === 11)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway') && zoom === 12)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway') && zoom === 13)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 18;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway') && zoom >= 11 && zoom <= 13)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 14)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 15)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['route'] == 'ferry') && zoom >= 7 && zoom <= 10)) {
            s_default['color'] = '#6666ff';
            s_default['dashes'] = [4, 4];
            s_default['width'] = 0.4;
        }

        if (((type == 'way' && tags['route'] == 'ferry') && zoom >= 11)) {
            s_default['color'] = '#6666ff';
            s_default['dashes'] = [6, 6];
            s_default['width'] = 0.8;
        }

        if (((type == 'way' && tags['aerialway'] == 'cable_car') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'gondola') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'goods') && zoom >= 12)) {
            s_default['pattern-image'] = 'symbols/cable_car.png';
        }

        if (((type == 'way' && tags['aerialway'] == 'chair_lift') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'drag_lift') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 't-bar') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'j-bar') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'platter') && zoom >= 12) || ((type == 'way' && tags['aerialway'] == 'rope_tow') && zoom >= 12)) {
            s_default['pattern-image'] = 'symbols/chair_lift.png';
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 5 && zoom <= 6) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 5 && zoom <= 6)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 0.5;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom >= 7 && zoom <= 8) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom >= 7 && zoom <= 8)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom === 9) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom === 9)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 1.4;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom === 10) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom === 10)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway') && zoom === 11) || ((type == 'way' && tags['highway'] == 'motorway_link') && zoom === 11)) {
            s_default['color'] = '#809bc0';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 5 && zoom <= 6) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 5 && zoom <= 6)) {
            s_default['color'] = '#a9dba9';
            s_default['width'] = 0.4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 7 && zoom <= 8) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 7 && zoom <= 8)) {
            s_default['color'] = '#97d397';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 9 && zoom <= 10) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom >= 9 && zoom <= 10)) {
            s_default['color'] = '#97d397';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom === 11) || ((type == 'way' && tags['highway'] == 'trunk_link') && zoom === 11)) {
            s_default['color'] = '#97d397';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom >= 7 && zoom <= 8) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom >= 7 && zoom <= 8)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 0.5;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom === 9) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom === 9)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 1.2;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom === 10) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom === 10)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'primary') && zoom === 11) || ((type == 'way' && tags['highway'] == 'primary_link') && zoom === 11)) {
            s_default['color'] = '#ec989a';
            s_default['width'] = 2.5;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 9 && zoom <= 10) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom >= 9 && zoom <= 10)) {
            s_default['color'] = '#fecc8b';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom === 11) || ((type == 'way' && tags['highway'] == 'secondary_link') && zoom === 11)) {
            s_default['color'] = '#fecc8b';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 6 && zoom <= 8)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 0.6;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 9)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom === 9)) {
            s_default['color'] = '#aaaaaa';
            s_default['dashes'] = [5, 2];
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 8 && zoom <= 9) || ((type == 'way' && tags['railway'] == 'light_rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 8 && zoom <= 9) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 8 && zoom <= 9) || ((type == 'way' && tags['railway'] == 'funicular' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 8 && zoom <= 9)) {
            s_default['color'] = '#cccccc';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 10 && zoom <= 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard' && (tags.hasOwnProperty('tunnel?'))) && zoom >= 10 && zoom <= 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['dashes'] = [5, 2];
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'light_rail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 10 && zoom <= 12) || ((type == 'way' && tags['railway'] == 'funicular' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 10 && zoom <= 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom === 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 13)) {
            s_default['color'] = '#999999';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 13)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [0, 1, 8, 1];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 1;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'spur') && zoom === 12) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'siding') && zoom === 12) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'yard') && zoom === 12)) {
            s_default['color'] = '#aaaaaa';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'spur') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'siding') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'yard') && zoom >= 13)) {
            s_default['color'] = '#999999';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'spur') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'siding') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'preserved' && tags['service'] == 'yard') && zoom >= 13)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [0, 1, 8, 1];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 0.8;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['railway'] == 'monorail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.4;
            s_default['width'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'monorail' && tags['service'] !== 'spur' && tags['service'] !== 'siding' && tags['service'] !== 'yard') && zoom >= 14)) {
            s_over1['color'] = '#777777';
            s_over1['dashes'] = [2, 3];
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 3;
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14 && zoom <= 16) || ((type == 'way' && tags['waterway'] == 'canal' && tags['bridge'] == 'aqueduct') && zoom >= 14 && zoom <= 16)) {
            s_default['color'] = 'black';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14 && zoom <= 16) || ((type == 'way' && tags['waterway'] == 'canal' && tags['bridge'] == 'aqueduct') && zoom >= 14 && zoom <= 16)) {
            s_over1['color'] = '#b5d0d0';
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 6;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '9';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['waterway'] == 'canal' && tags['bridge'] == 'aqueduct') && zoom >= 17)) {
            s_default['color'] = 'black';
            s_default['linejoin'] = 'round';
            s_default['width'] = 11;
        }

        if (((type == 'way' && tags['waterway'] == 'canal' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['waterway'] == 'canal' && tags['bridge'] == 'aqueduct') && zoom >= 17)) {
            s_over1['color'] = '#b5d0d0';
            s_over1['linecap'] = 'round';
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 10;
            s_over1['font-family'] = 'DejaVu Sans Book';
            s_over1['font-size'] = '9';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-position'] = 'line';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && tags['highway'] !== 'service' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] !== 'service' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom === 15)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'no' && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway['color'] = '#6c70d5';
            s_oneway['dashes'] = [0, 12, 10, 152];
            s_oneway['linejoin'] = 'bevel';
            s_oneway['width'] = 1;
            s_oneway['z-index'] = 15;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over1['color'] = '#6c70d5';
            s_oneway_over1['dashes'] = [0, 12, 9, 153];
            s_oneway_over1['linejoin'] = 'bevel';
            s_oneway_over1['width'] = 2;
            s_oneway_over1['z-index'] = 15.1;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over2['color'] = '#6c70d5';
            s_oneway_over2['dashes'] = [0, 18, 2, 154];
            s_oneway_over2['linejoin'] = 'bevel';
            s_oneway_over2['width'] = 3;
            s_oneway_over2['z-index'] = 15.2;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over3['color'] = '#6c70d5';
            s_oneway_over3['dashes'] = [0, 18, 1, 155];
            s_oneway_over3['linejoin'] = 'bevel';
            s_oneway_over3['width'] = 4;
            s_oneway_over3['z-index'] = 15.3;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway['color'] = '#6c70d5';
            s_oneway['dashes'] = [0, 12, 10, 152];
            s_oneway['linejoin'] = 'bevel';
            s_oneway['width'] = 1;
            s_oneway['z-index'] = 15;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over1['color'] = '#6c70d5';
            s_oneway_over1['dashes'] = [0, 13, 9, 152];
            s_oneway_over1['linejoin'] = 'bevel';
            s_oneway_over1['width'] = 2;
            s_oneway_over1['z-index'] = 15.1;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over2['color'] = '#6c70d5';
            s_oneway_over2['dashes'] = [0, 14, 2, 158];
            s_oneway_over2['linejoin'] = 'bevel';
            s_oneway_over2['width'] = 3;
            s_oneway_over2['z-index'] = 15.2;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over3['color'] = '#6c70d5';
            s_oneway_over3['dashes'] = [0, 15, 1, 158];
            s_oneway_over3['linejoin'] = 'bevel';
            s_oneway_over3['width'] = 4;
            s_oneway_over3['z-index'] = 15.3;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_bridge-casing1['color'] = '#506077';
            s_bridge-casing1['width'] = 3;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 6.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 9;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 12;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_bridge-casing1['color'] = '#477147';
            s_bridge-casing1['width'] = 4;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 8;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 11;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 16;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_bridge-casing1['color'] = '#8d4346';
            s_bridge-casing1['width'] = 4;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 8;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 11;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 16;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 10;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 12;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 16;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 7.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 11;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 16;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 14) || ((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 9;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 16) || ((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom === 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 11;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 16;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 14 && zoom <= 15)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 3;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 8;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 2.2;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 3.8;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 7;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 9.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['aeroway'] == 'runway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 19;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['aeroway'] == 'taxiway' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15) || ((type == 'way' && tags['aeroway'] == 'taxiway' && tags['bridge'] == 'viaduct') && zoom >= 15)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 7;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'subway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'subway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'light_rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'light_rail' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = '#555555';
            s_bridge-casing1['width'] = 5.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 6.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'bridleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'footway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 6;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'cycleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'byway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'byway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['linejoin'] = 'round';
            s_bridge-casing1['width'] = 6.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['linejoin'] = 'round';
            s_bridge-casing1['width'] = 5.7;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 6;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing1['color'] = 'black';
            s_bridge-casing1['width'] = 4.5;
            s_bridge-casing1['z-index'] = 2;
        }

        if (((type == 'way' && tags['railway'] == 'subway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'subway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'light_rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'light_rail' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'bridleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'footway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4.5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 2.5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'cycleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'byway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'byway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 4.5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['width'] = 3.5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 3;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 3.5;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 3;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 3;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_bridge-casing2['color'] = 'white';
            s_bridge-casing2['linecap'] = 'round';
            s_bridge-casing2['linejoin'] = 'round';
            s_bridge-casing2['width'] = 3;
            s_bridge-casing2['z-index'] = 3;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'motorway_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#809bc0';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 10;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'trunk' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'trunk_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#a9dba9';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 12) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom === 12)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'primary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'primary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#ec989a';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13 && zoom <= 14) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 10.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'secondary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'secondary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#fed7a5';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'tertiary' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'tertiary_link' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#ffffb3';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15 && zoom <= 16) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom >= 15 && zoom <= 16)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'road' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'road' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = '#dddddd';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 7.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 16) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 9.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom >= 17) || ((type == 'way' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom >= 17)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 14;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_default['color'] = 'white';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 6;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 5.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'pedestrian' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['highway'] == 'pedestrian' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_default['color'] = '#ededed';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 8;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['aeroway'] == 'runway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['aeroway'] == 'runway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 18;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (tags.hasOwnProperty('bridge?'))) && zoom === 14) || ((type == 'way' && tags['aeroway'] == 'taxiway' && tags['bridge'] == 'viaduct') && zoom === 14)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 4;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['aeroway'] == 'taxiway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 15) || ((type == 'way' && tags['aeroway'] == 'taxiway' && tags['bridge'] == 'viaduct') && zoom >= 15)) {
            s_default['color'] = '#bbbbcc';
            s_default['width'] = 6;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'subway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'subway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#999999';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'light_rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'light_rail' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'narrow_gauge' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#666666';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_default['color'] = '#debd9c';
            s_default['dashes'] = [2, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 3;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'unsurfaced' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'unsurfaced' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#debd9c';
            s_default['dashes'] = [4, 6];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 4;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'bridleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'bridleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['horse'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = 'green';
            s_default['dashes'] = [4, 2];
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'footway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'footway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['foot'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = 'salmon';
            s_default['dashes'] = [1, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] !== 'designated' && tags['foot'] !== 'designated' && tags['horse'] !== 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = 'black';
            s_default['dashes'] = [6, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 0.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'cycleway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'cycleway' && tags['bridge'] == 'viaduct') && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'path' && tags['bicycle'] == 'designated' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = 'blue';
            s_default['dashes'] = [1, 3];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'byway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'byway' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#ffcc00';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_casing1['color'] = '#999999';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = 3.9;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom === 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [8, 12];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_casing1['color'] = '#999999';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = 3.9;
        }

        if (((type == 'way' && tags['railway'] == 'rail' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['railway'] == 'rail' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [0, 11, 8, 1];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_default['color'] = '#999999';
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['railway'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'spur' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'siding' && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'rail' && tags['service'] == 'yard' && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_over1['color'] = 'white';
            s_over1['dashes'] = [0, 8, 11, 1];
            s_over1['linejoin'] = 'round';
            s_over1['width'] = 0.8;
            s_over1['z-index'] = 4.1;
        }

        if (((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'disused' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'abandoned' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 13) || ((type == 'way' && tags['railway'] == 'construction' && (!tags.hasOwnProperty('highway')) && tags['bridge'] == 'viaduct') && zoom >= 13)) {
            s_default['color'] = 'grey';
            s_default['dashes'] = [2, 4];
            s_default['linejoin'] = 'round';
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade1' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#b37700';
            s_default['opacity'] = 0.7;
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade2' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#a87000';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade3' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.7;
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade4' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [4, 7, 1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && tags['tracktype'] == 'grade5' && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [1, 5];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['opacity'] = 0.8;
            s_default['width'] = 2;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && (tags.hasOwnProperty('bridge?'))) && zoom >= 14) || ((type == 'way' && tags['highway'] == 'track' && (!tags.hasOwnProperty('tracktype')) && tags['bridge'] == 'viaduct') && zoom >= 14)) {
            s_default['color'] = '#996600';
            s_default['dashes'] = [3, 4];
            s_default['linecap'] = 'round';
            s_default['linejoin'] = 'round';
            s_default['width'] = 1.5;
            s_default['z-index'] = 4;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'footway' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'permissive' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#ccff99';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'unclassified' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'residential' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'destination' && tags['highway'] == 'service' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#c2e0ff';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && tags['highway'] !== 'service' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'private' && tags['highway'] !== 'service' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] !== 'service' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] !== 'service' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'private' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && tags['bridge'] == 'viaduct') && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && (tags.hasOwnProperty('bridge?'))) && zoom === 15) || ((type == 'way' && tags['access'] == 'no' && tags['highway'] == 'service' && tags['service'] !== 'parking_aisle' && tags['service'] !== 'drive-through' && tags['service'] !== 'driveway' && tags['bridge'] == 'viaduct') && zoom === 15)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 3;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && tags['access'] == 'private' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'private' && tags['bridge'] == 'viaduct') && zoom >= 16) || ((type == 'way' && tags['access'] == 'no' && (tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['access'] == 'no' && tags['bridge'] == 'viaduct') && zoom >= 16)) {
            s_access['color'] = '#efa9a9';
            s_access['dashes'] = [6, 8];
            s_access['linecap'] = 'round';
            s_access['linejoin'] = 'round';
            s_access['opacity'] = 0.5;
            s_access['width'] = 6;
            s_access['z-index'] = 7;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway['color'] = '#6c70d5';
            s_oneway['dashes'] = [0, 12, 10, 152];
            s_oneway['linejoin'] = 'bevel';
            s_oneway['width'] = 1;
            s_oneway['z-index'] = 15;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over1['color'] = '#6c70d5';
            s_oneway_over1['dashes'] = [0, 12, 9, 153];
            s_oneway_over1['linejoin'] = 'bevel';
            s_oneway_over1['width'] = 2;
            s_oneway_over1['z-index'] = 15.1;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over2['color'] = '#6c70d5';
            s_oneway_over2['dashes'] = [0, 18, 2, 154];
            s_oneway_over2['linejoin'] = 'bevel';
            s_oneway_over2['width'] = 3;
            s_oneway_over2['z-index'] = 15.2;
        }

        if (((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && (tags.hasOwnProperty('oneway?')) && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over3['color'] = '#6c70d5';
            s_oneway_over3['dashes'] = [0, 18, 1, 155];
            s_oneway_over3['linejoin'] = 'bevel';
            s_oneway_over3['width'] = 4;
            s_oneway_over3['z-index'] = 15.3;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway['color'] = '#6c70d5';
            s_oneway['dashes'] = [0, 12, 10, 152];
            s_oneway['linejoin'] = 'bevel';
            s_oneway['width'] = 1;
            s_oneway['z-index'] = 15;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over1['color'] = '#6c70d5';
            s_oneway_over1['dashes'] = [0, 13, 9, 152];
            s_oneway_over1['linejoin'] = 'bevel';
            s_oneway_over1['width'] = 2;
            s_oneway_over1['z-index'] = 15.1;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over2['color'] = '#6c70d5';
            s_oneway_over2['dashes'] = [0, 14, 2, 158];
            s_oneway_over2['linejoin'] = 'bevel';
            s_oneway_over2['width'] = 3;
            s_oneway_over2['z-index'] = 15.2;
        }

        if (((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('highway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('railway')) && tags['bridge'] !== 'viaduct') && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && (!tags.hasOwnProperty('bridge?'))) && zoom >= 16) || ((type == 'way' && tags['oneway'] == '-1' && (tags.hasOwnProperty('waterway')) && tags['bridge'] !== 'viaduct') && zoom >= 16)) {
            s_oneway_over3['color'] = '#6c70d5';
            s_oneway_over3['dashes'] = [0, 15, 1, 158];
            s_oneway_over3['linejoin'] = 'bevel';
            s_oneway_over3['width'] = 4;
            s_oneway_over3['z-index'] = 15.3;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 13 && zoom <= 14)) {
            s_tram['color'] = '#444444';
            s_tram['width'] = 1;
            s_tram['z-index'] = 17;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags['bridge'] == '-1' || tags['bridge'] == 'false' || tags['bridge'] == 'no') && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_tram['color'] = '#444444';
            s_tram['width'] = 2;
            s_tram['z-index'] = 17;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags['bridge'] == '1' || tags['bridge'] == 'true' || tags['bridge'] == 'yes') && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_tram_under3['color'] = 'black';
            s_tram_under3['width'] = 5;
            s_tram_under3['z-index'] = 16.8;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags['bridge'] == '1' || tags['bridge'] == 'true' || tags['bridge'] == 'yes') && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_tram_under2['color'] = 'white';
            s_tram_under2['width'] = 4;
            s_tram_under2['z-index'] = 16.9;
        }

        if (((type == 'way' && tags['railway'] == 'tram' && (tags['bridge'] == '1' || tags['bridge'] == 'true' || tags['bridge'] == 'yes') && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 15)) {
            s_tram['color'] = '#444444';
            s_tram['width'] = 2;
            s_tram['z-index'] = 17;
        }

        if (((type == 'way' && tags['highway'] == 'bus_guideway' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_casing1['color'] = '#6666ff';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'bus_guideway' && (!tags.hasOwnProperty('tunnel?'))) && zoom === 13)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [8, 12];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['highway'] == 'bus_guideway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 14)) {
            s_casing1['color'] = '#6666ff';
            s_casing1['linejoin'] = 'round';
            s_casing1['width'] = 3;
            s_casing1['z-index'] = -0.1;
        }

        if (((type == 'way' && tags['highway'] == 'bus_guideway' && (!tags.hasOwnProperty('tunnel?'))) && zoom >= 14)) {
            s_default['color'] = 'white';
            s_default['dashes'] = [0, 11, 8, 1];
            s_default['linejoin'] = 'round';
            s_default['width'] = 1;
            s_default['z-index'] = 0;
        }

        if (((type == 'way' && tags['admin_level'] == '2') && zoom >= 4 && zoom <= 6) || ((type == 'way' && tags['admin_level'] == '3') && zoom >= 4 && zoom <= 6)) {
            s_default['color'] = 'purple';
            s_default['opacity'] = 0.2;
            s_default['width'] = 0.6;
        }

        if (((type == 'way' && tags['admin_level'] == '2') && zoom >= 7 && zoom <= 9) || ((type == 'way' && tags['admin_level'] == '3') && zoom >= 7 && zoom <= 9)) {
            s_default['color'] = 'purple';
            s_default['opacity'] = 0.2;
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['admin_level'] == '2') && zoom >= 10)) {
            s_default['color'] = 'purple';
            s_default['opacity'] = 0.1;
            s_default['width'] = 6;
        }

        if (((type == 'way' && tags['admin_level'] == '3') && zoom >= 10)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [4, 2];
            s_default['opacity'] = 0.1;
            s_default['width'] = 5;
        }

        if (((type == 'way' && tags['admin_level'] == '4') && zoom >= 4 && zoom <= 6)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [4, 3];
            s_default['opacity'] = 0.2;
            s_default['width'] = 0.6;
        }

        if (((type == 'way' && tags['admin_level'] == '4') && zoom >= 7 && zoom <= 10)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [4, 3];
            s_default['opacity'] = 0.2;
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['admin_level'] == '4') && zoom >= 11)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [4, 3];
            s_default['opacity'] = 0.2;
            s_default['width'] = 3;
        }

        if (((type == 'way' && tags['admin_level'] == '5') && zoom >= 11)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [6, 3, 2, 3, 2, 3];
            s_default['opacity'] = 0.3;
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['admin_level'] == '6') && zoom >= 11)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [6, 3, 2, 3];
            s_default['opacity'] = 0.3;
            s_default['width'] = 2;
        }

        if (((type == 'way' && tags['admin_level'] == '8') && zoom >= 12) || ((type == 'way' && tags['admin_level'] == '7') && zoom >= 12)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [5, 2];
            s_default['opacity'] = 0.3;
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['admin_level'] == '10') && zoom >= 13) || ((type == 'way' && tags['admin_level'] == '9') && zoom >= 13)) {
            s_default['color'] = 'purple';
            s_default['dashes'] = [2, 3];
            s_default['opacity'] = 0.3;
            s_default['width'] = 2;
        }

        if (((type == 'way' && (tags.hasOwnProperty('admin_level')) && tags['admin_level'] > '8') && zoom >= 9 && zoom <= 11)) {
            s_default['color'] = 'purple';
            s_default['opacity'] = 0.2;
            s_default['width'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'country') && zoom >= 2 && zoom <= 3)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9d6c9d';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['place'] == 'country') && zoom >= 4 && zoom <= 6)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9d6c9d';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['place'] == 'state') && zoom === 4)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#9d6c9d';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'state') && zoom >= 5 && zoom <= 6)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9d6c9d';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'state') && zoom >= 7 && zoom <= 8)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#9d6c9d';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags.hasOwnProperty('captial?'))) && zoom === 5) || ((type == 'node' && tags['place'] == 'metropolis' && (tags.hasOwnProperty('captial?'))) && zoom === 5) || ((type == 'node' && tags['place'] == 'town' && (tags.hasOwnProperty('captial?'))) && zoom === 5)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags.hasOwnProperty('captial?'))) && zoom >= 6 && zoom <= 8) || ((type == 'node' && tags['place'] == 'metropolis' && (tags.hasOwnProperty('captial?'))) && zoom >= 6 && zoom <= 8) || ((type == 'node' && tags['place'] == 'town' && (tags.hasOwnProperty('captial?'))) && zoom >= 6 && zoom <= 8)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10) || ((type == 'node' && tags['place'] == 'metropolis' && (tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10) || ((type == 'node' && tags['place'] == 'town' && (tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 14) || ((type == 'node' && tags['place'] == 'metropolis' && (tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 14) || ((type == 'node' && tags['place'] == 'town' && (tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '14';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (!tags.hasOwnProperty('captial?'))) && zoom >= 6 && zoom <= 8) || ((type == 'node' && tags['place'] == 'metropolis' && (!tags.hasOwnProperty('captial?'))) && zoom >= 6 && zoom <= 8)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (!tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10) || ((type == 'node' && tags['place'] == 'metropolis' && (!tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'city' && (!tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 14) || ((type == 'node' && tags['place'] == 'metropolis' && (!tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '14';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10) || ((type == 'node' && tags['place'] == 'large_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10) || ((type == 'node' && tags['place'] == 'small_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 9 && zoom <= 10)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['place'] == 'town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 13) || ((type == 'node' && tags['place'] == 'large_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 13) || ((type == 'node' && tags['place'] == 'small_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 11 && zoom <= 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['place'] == 'town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 14) || ((type == 'node' && tags['place'] == 'large_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 14) || ((type == 'node' && tags['place'] == 'small_town' && (!tags.hasOwnProperty('captial?'))) && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '14';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#777777';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['place'] == 'suburb') && zoom >= 12 && zoom <= 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'suburb') && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '13';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#777777';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'village') && zoom >= 12 && zoom <= 14) || ((type == 'node' && tags['place'] == 'large_village') && zoom >= 12 && zoom <= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'village') && zoom >= 15) || ((type == 'node' && tags['place'] == 'large_village') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '12';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#777777';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'hamlet') && zoom >= 14 && zoom <= 15) || ((type == 'node' && tags['place'] == 'locality') && zoom >= 14 && zoom <= 15) || ((type == 'node' && tags['place'] == 'isolated_dwelling') && zoom >= 14 && zoom <= 15) || ((type == 'node' && tags['place'] == 'farm') && zoom >= 14 && zoom <= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['place'] == 'hamlet') && zoom >= 16) || ((type == 'node' && tags['place'] == 'locality') && zoom >= 16) || ((type == 'node' && tags['place'] == 'isolated_dwelling') && zoom >= 16) || ((type == 'node' && tags['place'] == 'farm') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#777777';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['railway'] == 'subway_entrance') && zoom >= 18)) {
            s_default['icon-image'] = 'symbols/walking.n.12.png';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom === 12)) {
            s_default['icon-image'] = 'symbols/halt.png';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 13 && zoom <= 14)) {
            s_default['icon-image'] = 'symbols/station_small.png';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes')) && zoom >= 13)) {
            s_default['icon-image'] = 'symbols/station_disused.png';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/station.png';
        }

        if (((type == 'node' && tags['railway'] == 'halt') && zoom >= 13 && zoom <= 14) || ((type == 'node' && tags['railway'] == 'tram_stop') && zoom >= 13 && zoom <= 14) || ((type == 'node' && tags['aerialway'] == 'station') && zoom >= 13 && zoom <= 14)) {
            s_default['icon-image'] = 'symbols/halt.png';
        }

        if (((type == 'node' && tags['railway'] == 'halt') && zoom >= 15) || ((type == 'node' && tags['railway'] == 'tram_stop') && zoom >= 15) || ((type == 'node' && tags['aerialway'] == 'station') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/station_small.png';
        }

        if (((type == 'node' && tags['railway'] == 'halt') && zoom === 14) || ((type == 'node' && tags['railway'] == 'tram_stop') && zoom === 14) || ((type == 'node' && tags['aerialway'] == 'station') && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((type == 'node' && tags['railway'] == 'halt') && zoom >= 15) || ((type == 'node' && tags['railway'] == 'tram_stop') && zoom >= 15) || ((type == 'node' && tags['aerialway'] == 'station') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '5';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '3';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((type == 'node' && tags['railway'] == 'station' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes')) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = 'grey';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((selector == 'area' && tags['railway'] == 'subway_entrance') && zoom >= 18)) {
            s_default['icon-image'] = 'symbols/walking.n.12.png';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom === 12)) {
            s_default['icon-image'] = 'symbols/halt.png';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 13 && zoom <= 14)) {
            s_default['icon-image'] = 'symbols/station_small.png';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes')) && zoom >= 13)) {
            s_default['icon-image'] = 'symbols/station_disused.png';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/station.png';
        }

        if (((selector == 'area' && tags['railway'] == 'halt') && zoom >= 13 && zoom <= 14) || ((selector == 'area' && tags['railway'] == 'tram_stop') && zoom >= 13 && zoom <= 14) || ((selector == 'area' && tags['aerialway'] == 'station') && zoom >= 13 && zoom <= 14)) {
            s_default['icon-image'] = 'symbols/halt.png';
        }

        if (((selector == 'area' && tags['railway'] == 'halt') && zoom >= 15) || ((selector == 'area' && tags['railway'] == 'tram_stop') && zoom >= 15) || ((selector == 'area' && tags['aerialway'] == 'station') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/station_small.png';
        }

        if (((selector == 'area' && tags['railway'] == 'halt') && zoom === 14) || ((selector == 'area' && tags['railway'] == 'tram_stop') && zoom === 14) || ((selector == 'area' && tags['aerialway'] == 'station') && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((selector == 'area' && tags['railway'] == 'halt') && zoom >= 15) || ((selector == 'area' && tags['railway'] == 'tram_stop') && zoom >= 15) || ((selector == 'area' && tags['aerialway'] == 'station') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '5';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '3';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '-1' || tags['disused'] == 'false' || tags['disused'] == 'no')) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((selector == 'area' && tags['railway'] == 'station' && (tags['disused'] == '1' || tags['disused'] == 'true' || tags['disused'] == 'yes')) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = 'grey';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((type == 'node' && tags['aeroway'] == 'helipad') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/helipad.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['aeroway'] == 'airport') && zoom >= 9 && zoom <= 10)) {
            s_default['icon-image'] = 'symbols/airport.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '2';
        }

        if (((type == 'node' && tags['aeroway'] == 'airport') && zoom >= 11 && zoom <= 12)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['aeroway'] == 'aerodrome') && zoom === 10)) {
            s_default['icon-image'] = 'symbols/aerodrome.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '2';
        }

        if (((type == 'node' && tags['aeroway'] == 'aerodrome') && zoom >= 11 && zoom <= 12)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['railway'] == 'level_crossing') && zoom >= 14 && zoom <= 15)) {
            s_default['icon-image'] = 'symbols/level_crossing.png';
        }

        if (((type == 'node' && tags['railway'] == 'level_crossing') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/level_crossing2.png';
        }

        if (((type == 'node' && tags['man_made'] == 'lighthouse') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/lighthouse.p.20.png';
        }

        if (((type == 'node' && tags['natural'] == 'peak') && zoom >= 11)) {
            s_default['icon-image'] = 'symbols/peak.png';
        }

        if (((type == 'node' && tags['natural'] == 'volcano') && zoom >= 11)) {
            s_default['icon-image'] = 'symbols/volcano.png';
        }

        if (((type == 'node' && tags['natural'] == 'cave_entrance') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/poi_cave.p.16.png';
        }

        if (((type == 'node' && tags['natural'] == 'spring') && zoom >= 14)) {
            s_default['icon-image'] = 'symbols/spring.png';
        }

        if (((type == 'node' && tags['natural'] == 'tree') && zoom === 16)) {
            s_default['icon-image'] = 'symbols/tree.png';
        }

        if (((type == 'node' && tags['natural'] == 'tree') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tree2.png';
        }

        if (((type == 'node' && tags['man_made'] == 'power_wind') && zoom >= 15) || ((type == 'node' && tags['power'] == 'generator' && tags['power_source'] == 'wind') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/power_wind.png';
        }

        if (((type == 'node' && tags['man_made'] == 'windmill') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/windmill.png';
        }

        if (((type == 'node' && tags['man_made'] == 'mast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/communications.p.20.png';
        }

        if (((type == 'node' && tags['highway'] == 'mini_roundabout') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/mini_round.png';
        }

        if (((type == 'node' && tags['highway'] == 'gate') && zoom >= 15) || ((type == 'node' && tags['barrier'] == 'gate') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/gate2.png';
        }

        if (((type == 'node' && tags['barrier'] == 'lift_gate') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/liftgate.png';
        }

        if (((type == 'node' && tags['barrier'] == 'bollard') && zoom >= 16) || ((type == 'node' && tags['barrier'] == 'block') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/bollard.png';
        }

        if (((selector == 'area' && tags['aeroway'] == 'helipad') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/helipad.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((selector == 'area' && tags['aeroway'] == 'airport') && zoom >= 9 && zoom <= 10)) {
            s_default['icon-image'] = 'symbols/airport.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '2';
        }

        if (((selector == 'area' && tags['aeroway'] == 'airport') && zoom >= 11 && zoom <= 12)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
        }

        if (((selector == 'area' && tags['aeroway'] == 'aerodrome') && zoom === 10)) {
            s_default['icon-image'] = 'symbols/aerodrome.p.16.png';
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'above';
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '2';
        }

        if (((selector == 'area' && tags['aeroway'] == 'aerodrome') && zoom >= 11 && zoom <= 12)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6692da';
            s_default['text-halo-radius'] = 1;
        }

        if (((selector == 'area' && tags['railway'] == 'level_crossing') && zoom >= 14 && zoom <= 15)) {
            s_default['icon-image'] = 'symbols/level_crossing.png';
        }

        if (((selector == 'area' && tags['railway'] == 'level_crossing') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/level_crossing2.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'lighthouse') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/lighthouse.p.20.png';
        }

        if (((selector == 'area' && tags['natural'] == 'peak') && zoom >= 11)) {
            s_default['icon-image'] = 'symbols/peak.png';
        }

        if (((selector == 'area' && tags['natural'] == 'volcano') && zoom >= 11)) {
            s_default['icon-image'] = 'symbols/volcano.png';
        }

        if (((selector == 'area' && tags['natural'] == 'cave_entrance') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/poi_cave.p.16.png';
        }

        if (((selector == 'area' && tags['natural'] == 'spring') && zoom >= 14)) {
            s_default['icon-image'] = 'symbols/spring.png';
        }

        if (((selector == 'area' && tags['natural'] == 'tree') && zoom === 16)) {
            s_default['icon-image'] = 'symbols/tree.png';
        }

        if (((selector == 'area' && tags['natural'] == 'tree') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tree2.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'power_wind') && zoom >= 15) || ((selector == 'area' && tags['power'] == 'generator' && tags['power_source'] == 'wind') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/power_wind.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'windmill') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/windmill.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'mast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/communications.p.20.png';
        }

        if (((selector == 'area' && tags['highway'] == 'mini_roundabout') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/mini_round.png';
        }

        if (((selector == 'area' && tags['highway'] == 'gate') && zoom >= 15) || ((selector == 'area' && tags['barrier'] == 'gate') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/gate2.png';
        }

        if (((selector == 'area' && tags['barrier'] == 'lift_gate') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/liftgate.png';
        }

        if (((selector == 'area' && tags['barrier'] == 'bollard') && zoom >= 16) || ((selector == 'area' && tags['barrier'] == 'block') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/bollard.png';
        }

        if (((type == 'node' && tags['tourism'] == 'alpine_hut') && zoom >= 13)) {
            s_default['icon-image'] = 'symbols/alpinehut.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'shelter') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/shelter2.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'atm') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/atm2.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bank') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bank2.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bar') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bar.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bicycle_rental') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/rental_bicycle.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bus_stop') && zoom === 16) || ((type == 'node' && tags['highway'] == 'bus_stop') && zoom === 16)) {
            s_default['icon-image'] = 'symbols/bus_stop_small.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bus_stop') && zoom >= 17) || ((type == 'node' && tags['highway'] == 'bus_stop') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bus_stop.p.12.png';
        }

        if (((type == 'node' && tags['amenity'] == 'bus_station') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/bus_station.n.16.png';
        }

        if (((type == 'node' && tags['highway'] == 'traffic_signals') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/traffic_light.png';
        }

        if (((type == 'node' && tags['amenity'] == 'cafe') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/cafe.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'camp_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/camping.n.16.png';
        }

        if (((type == 'node' && tags['highway'] == 'ford') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/transport_ford.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'caravan_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/caravan_park.p.24.png';
        }

        if (((type == 'node' && tags['amenity'] == 'car_sharing') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/car_share.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'chalet') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/chalet.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'cinema') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/cinema.p.24.png';
        }

        if (((type == 'node' && tags['amenity'] == 'fire_station') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/firestation.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'fuel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/fuel.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'guest_house') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/guest_house.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'bed_and_breakfast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bandb.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'hospital') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/hospital.p.16.png';
        }

        if (((type == 'node' && tags['tourism'] == 'hostel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/hostel.p.20.png';
        }

        if (((type == 'node' && tags['tourism'] == 'hotel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/hotel2.p.20.png';
        }

        if (((type == 'node' && tags['tourism'] == 'motel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/motel.p.20.png';
        }

        if (((type == 'node' && tags['tourism'] == 'information') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/information.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'embassy') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/embassy.png';
        }

        if (((type == 'node' && tags['amenity'] == 'library') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/library.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'courthouse') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/amenity_court.p.20.png';
        }

        if (((type == 'node' && tags['waterway'] == 'lock') && zoom >= 15) || ((type == 'node' && (tags['lock'] == '1' || tags['lock'] == 'true' || tags['lock'] == 'yes')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/lock_gate.png';
        }

        if (((type == 'node' && tags['man_made'] == 'mast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/communications.p.20.png';
        }

        if (((type == 'node' && tags['tourism'] == 'museum') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/museum.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'parking' && tags['access'] == 'public') && zoom >= 15) || ((type == 'node' && tags['amenity'] == 'parking' && (tags['access'] == '1' || tags['access'] == 'true' || tags['access'] == 'yes')) && zoom >= 15) || ((type == 'node' && tags['amenity'] == 'parking' && (!tags.hasOwnProperty('access'))) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/parking.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'parking' && (tags.hasOwnProperty('access')) && tags['access'] !== 'public' && (tags['access'] == '-1' || tags['access'] == 'false' || tags['access'] == 'no')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/parking_private.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'pharmacy') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/pharmacy.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'christian') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/christian3.p.14.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'muslim') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/islamic3.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'sikh') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/sikh3.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'jewish') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/jewish3.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship' && tags['religion'] !== 'christian' && tags['religion'] !== 'muslim' && tags['religion'] !== 'sikh' && tags['religion'] !== 'jewish') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/place_of_worship3.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'police') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/police.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'post_box') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/post_box.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'post_office') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/post_office.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'pub') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/pub.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'biergarten') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/biergarten.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'recycling') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/recycling.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'restaurant') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/restaurant.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'fast_food') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/fast_food.png';
        }

        if (((type == 'node' && tags['amenity'] == 'telephone') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/telephone.p.16.png';
        }

        if (((type == 'node' && tags['amenity'] == 'emergency_phone') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/sosphone.png';
        }

        if (((type == 'node' && tags['amenity'] == 'theatre') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/theatre.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'toilets') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/toilets.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'drinking_water') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/food_drinkingtap.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'prison') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/amenity_prison.p.20.png';
        }

        if (((type == 'node' && tags['tourism'] == 'viewpoint') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/view_point.p.16.png';
        }

        if (((type == 'node' && tags['man_made'] == 'water_tower') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tower_water.p.20.png';
        }

        if (((type == 'node' && tags['historic'] == 'memorial') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tourist_memorial.p.20.png';
        }

        if (((type == 'node' && tags['historic'] == 'archaeological_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/tourist_archaeological2.glow.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'supermarket') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/shop_supermarket.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'bakery') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_bakery.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'butcher') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_butcher.png';
        }

        if (((type == 'node' && tags['shop'] == 'clothes') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'fashion') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_clothes.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'convenience') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_convenience.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'department_store') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/department_store.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'doityourself') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_diy.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'florist') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/florist.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'hairdresser') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_hairdresser.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'car') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_car.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'car_repair') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_car_repair.p.16.png';
        }

        if (((type == 'node' && tags['shop'] == 'bicycle') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_bicycle.p.16.png';
        }

        if (((type == 'node' && tags['leisure'] == 'playground') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/playground.p.20.png';
        }

        if (((type == 'node' && tags['amenity'] == 'picnic_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/picnic.p.16.png';
        }

        if (((type == 'node' && tags['leisure'] == 'slipway') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/transport_slipway.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'alpine_hut') && zoom >= 13)) {
            s_default['icon-image'] = 'symbols/alpinehut.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'shelter') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/shelter2.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'atm') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/atm2.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bank') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bank2.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bar') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bar.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bicycle_rental') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/rental_bicycle.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bus_stop') && zoom === 16) || ((selector == 'area' && tags['highway'] == 'bus_stop') && zoom === 16)) {
            s_default['icon-image'] = 'symbols/bus_stop_small.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bus_stop') && zoom >= 17) || ((selector == 'area' && tags['highway'] == 'bus_stop') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bus_stop.p.12.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'bus_station') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/bus_station.n.16.png';
        }

        if (((selector == 'area' && tags['highway'] == 'traffic_signals') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/traffic_light.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'cafe') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/cafe.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'camp_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/camping.n.16.png';
        }

        if (((selector == 'area' && tags['highway'] == 'ford') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/transport_ford.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'caravan_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/caravan_park.p.24.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'car_sharing') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/car_share.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'chalet') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/chalet.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'cinema') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/cinema.p.24.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'fire_station') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/firestation.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'fuel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/fuel.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'guest_house') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/guest_house.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'bed_and_breakfast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/bandb.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'hospital') && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/hospital.p.16.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'hostel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/hostel.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'hotel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/hotel2.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'motel') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/motel.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'information') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/information.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'embassy') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/embassy.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'library') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/library.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'courthouse') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/amenity_court.p.20.png';
        }

        if (((selector == 'area' && tags['waterway'] == 'lock') && zoom >= 15) || ((selector == 'area' && (tags['lock'] == '1' || tags['lock'] == 'true' || tags['lock'] == 'yes')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/lock_gate.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'mast') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/communications.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'museum') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/museum.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'parking' && tags['access'] == 'public') && zoom >= 15) || ((selector == 'area' && tags['amenity'] == 'parking' && (tags['access'] == '1' || tags['access'] == 'true' || tags['access'] == 'yes')) && zoom >= 15) || ((selector == 'area' && tags['amenity'] == 'parking' && (!tags.hasOwnProperty('access'))) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/parking.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'parking' && (tags.hasOwnProperty('access')) && tags['access'] !== 'public' && (tags['access'] == '-1' || tags['access'] == 'false' || tags['access'] == 'no')) && zoom >= 15)) {
            s_default['icon-image'] = 'symbols/parking_private.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'pharmacy') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/pharmacy.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'christian') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/christian3.p.14.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'muslim') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/islamic3.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'sikh') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/sikh3.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship' && tags['religion'] == 'jewish') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/jewish3.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'place_of_worship') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/place_of_worship3.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'police') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/police.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'post_box') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/post_box.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'post_office') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/post_office.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'pub') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/pub.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'biergarten') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/biergarten.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'recycling') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/recycling.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'restaurant') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/restaurant.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'fast_food') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/fast_food.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'telephone') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/telephone.p.16.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'emergency_phone') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/sosphone.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'theatre') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/theatre.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'toilets') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/toilets.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'drinking_water') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/food_drinkingtap.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'prison') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/amenity_prison.p.20.png';
        }

        if (((selector == 'area' && tags['tourism'] == 'viewpoint') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/view_point.p.16.png';
        }

        if (((selector == 'area' && tags['man_made'] == 'water_tower') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tower_water.p.20.png';
        }

        if (((selector == 'area' && tags['historic'] == 'memorial') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/tourist_memorial.p.20.png';
        }

        if (((selector == 'area' && tags['historic'] == 'archaeological_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/tourist_archaeological2.glow.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'supermarket') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/shop_supermarket.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'bakery') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_bakery.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'butcher') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_butcher.png';
        }

        if (((selector == 'area' && tags['shop'] == 'clothes') && zoom >= 17) || ((selector == 'area' && tags['shop'] == 'fashion') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_clothes.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'convenience') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_convenience.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'department_store') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/department_store.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'doityourself') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_diy.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'florist') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/florist.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'hairdresser') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shop_hairdresser.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'car') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_car.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'car_repair') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_car_repair.p.16.png';
        }

        if (((selector == 'area' && tags['shop'] == 'bicycle') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/shopping_bicycle.p.16.png';
        }

        if (((selector == 'area' && tags['leisure'] == 'playground') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/playground.p.20.png';
        }

        if (((selector == 'area' && tags['amenity'] == 'picnic_site') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/picnic.p.16.png';
        }

        if (((selector == 'area' && tags['leisure'] == 'slipway') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/transport_slipway.p.20.png';
        }

        if (((type == 'way' && tags['power'] == 'line') && zoom >= 14 && zoom <= 15)) {
            s_default['color'] = '#777777';
            s_default['width'] = 1;
        }

        if (((type == 'way' && tags['power'] == 'line') && zoom >= 16)) {
            s_default['color'] = '#777777';
            s_default['width'] = 1.5;
        }

        if (((type == 'way' && tags['power'] == 'minor_line') && zoom >= 16)) {
            s_default['color'] = '#777777';
            s_default['width'] = 0.5;
        }

        if (((type == 'node' && tags['power'] == 'tower') && zoom === 14)) {
            s_default['icon-image'] = 'symbols/power_tower_3x3.png';
        }

        if (((type == 'node' && tags['power'] == 'tower') && zoom >= 15 && zoom <= 16)) {
            s_default['icon-image'] = 'symbols/power_tower_5x5.png';
        }

        if (((type == 'node' && tags['power'] == 'tower') && zoom >= 17)) {
            s_default['icon-image'] = 'symbols/power_tower.png';
        }

        if (((type == 'node' && tags['power'] == 'pole') && zoom >= 16)) {
            s_default['icon-image'] = 'symbols/power_pole.png';
        }

        if (((type == 'node' && tags['highway'] == 'motorway_junction') && zoom === 11)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['highway'] == 'motorway_junction') && zoom >= 12 && zoom <= 14)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['highway'] == 'motorway_junction') && zoom >= 12 && zoom <= 14)) {
            s_over1['font-family'] = 'DejaVu Sans Oblique';
            s_over1['font-size'] = '8';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-anchor-vertical'] = 'above';
            s_over1['text-color'] = '#6666ff';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-offset-y'] = '2';
            s_over1['text-wrap-character'] = ';';
            s_over1['text-wrap-width'] = '2';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'node' && tags['highway'] == 'motorway_junction') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '12';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#6666ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['highway'] == 'motorway_junction') && zoom >= 15)) {
            s_over1['font-family'] = 'DejaVu Sans Oblique';
            s_over1['font-size'] = '11';
            s_over1['text'] = MapCSS.e_localize(tags, 'name');
            s_over1['text-anchor-vertical'] = 'above';
            s_over1['text-color'] = '#6666ff';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-offset-y'] = '4';
            s_over1['text-wrap-character'] = ';';
            s_over1['text-wrap-width'] = '2';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '1') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '2') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '3') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '4') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '5') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '6') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '7') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'motorway' && tags['length'] == '8') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '1') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '2') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '3') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '4') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '5') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '6') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '7') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'trunk' && tags['length'] == '8') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '1') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '2') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '3') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '4') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '5') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '6') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '7') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'primary' && tags['length'] == '8') && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '1' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '2' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '3' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '4' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '5' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '6' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '7' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'secondary' && tags['length'] == '8' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 12)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '1' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '2' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '3' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '4' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '5' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '6' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '7' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'tertiary' && tags['length'] == '8' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 13)) {
    
    }
        if (((type == 'way' && tags['highway'] == 'unclassified' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 15) || ((type == 'way' && tags['highway'] == 'residential' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-spacing'] = '750';
        }

        if (((type == 'way' && tags['aeroway'] == 'runway' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 15) || ((type == 'way' && tags['aeroway'] == 'taxiway' && (!tags.hasOwnProperty('bridge?'))) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#333333';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '750';
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom === 13) || ((type == 'way' && tags['highway'] == 'primary') && zoom === 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom === 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-color'] = '#fed7a5';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom === 14) || ((type == 'way' && tags['highway'] == 'primary') && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'trunk') && zoom >= 15) || ((type == 'way' && tags['highway'] == 'primary') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom === 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-color'] = '#fed7a5';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'secondary') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-color'] = '#fed7a5';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 15 && zoom <= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'tertiary') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'proposed') && zoom >= 13 && zoom <= 15) || ((type == 'way' && tags['highway'] == 'construction') && zoom >= 13 && zoom <= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'proposed') && zoom >= 16) || ((type == 'way' && tags['highway'] == 'construction') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && tags['highway'] == 'unclassified') && zoom === 15) || ((type == 'way' && tags['highway'] == 'residential') && zoom === 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '300';
        }

        if (((type == 'way' && tags['highway'] == 'unclassified') && zoom === 16) || ((type == 'way' && tags['highway'] == 'residential') && zoom === 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '300';
        }

        if (((type == 'way' && tags['highway'] == 'unclassified') && zoom >= 17) || ((type == 'way' && tags['highway'] == 'residential') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
            s_default['text-spacing'] = '400';
        }

        if (((type == 'way' && (tags.hasOwnProperty('highway')) && tags['highway'] !== 'motorway' && tags['highway'] !== 'trunk' && tags['highway'] !== 'primary' && tags['highway'] !== 'secondary' && tags['highway'] !== 'tertiary' && tags['highway'] !== 'unclassified' && tags['highway'] !== 'residential' && tags['highway'] !== 'proposed' && tags['highway'] !== 'construction') && zoom >= 15 && zoom <= 16) || ((type == 'way' && (tags.hasOwnProperty('aeroway')) && tags['aeroway'] !== 'runway' && tags['aeroway'] !== 'taxiway') && zoom >= 15 && zoom <= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'way' && (tags.hasOwnProperty('highway')) && tags['highway'] !== 'motorway' && tags['highway'] !== 'trunk' && tags['highway'] !== 'primary' && tags['highway'] !== 'secondary' && tags['highway'] !== 'tertiary' && tags['highway'] !== 'unclassified' && tags['highway'] !== 'residential' && tags['highway'] !== 'proposed' && tags['highway'] !== 'construction') && zoom >= 17) || ((type == 'way' && (tags.hasOwnProperty('aeroway')) && tags['aeroway'] !== 'runway' && tags['aeroway'] !== 'taxiway') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-position'] = 'line';
        }

        if (((type == 'node' && tags['place'] == 'island') && zoom >= 12)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
        }

        if (((type == 'node' && tags['amenity'] == 'pub') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'restaurant') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'cafe') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'fast_food') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'biergarten') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '34';
        }

        if (((type == 'node' && tags['amenity'] == 'bar') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['amenity'] == 'library') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'theatre') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'courthouse') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['amenity'] == 'cinema') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['amenity'] == 'parking' && tags['access'] == 'public') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'parking' && (!tags.hasOwnProperty('access'))) && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '34';
        }

        if (((type == 'node' && tags['amenity'] == 'parking' && (tags.hasOwnProperty('access')) && tags['access'] !== 'public') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#66ccaf';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '34';
        }

        if (((type == 'node' && tags['amenity'] == 'police') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['amenity'] == 'fire_station') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['amenity'] == 'place_of_worship') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#000033';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-1';
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['natural'] == 'wood') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 2;
            s_default['text-wrap-width'] = '10';
        }

        if (((type == 'node' && tags['natural'] == 'peak') && zoom >= 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['natural'] == 'peak' && (!tags.hasOwnProperty('name'))) && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ele');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['natural'] == 'peak' && (tags.hasOwnProperty('name'))) && zoom >= 14)) {
            s_ele['font-family'] = 'DejaVu Sans Oblique';
            s_ele['font-size'] = '9';
            s_ele['text'] = MapCSS.e_localize(tags, 'ele');
            s_ele['text-anchor-vertical'] = 'below';
            s_ele['text-color'] = 'brown';
            s_ele['text-halo-radius'] = 1;
            s_ele['text-offset-y'] = '-12';
        }

        if (((type == 'node' && tags['natural'] == 'volcano') && zoom >= 13)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '5';
        }

        if (((type == 'node' && tags['natural'] == 'volcano' && (!tags.hasOwnProperty('name'))) && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ele');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '4';
        }

        if (((type == 'node' && tags['natural'] == 'volcano' && (tags.hasOwnProperty('name'))) && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'ele');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-6';
        }

        if (((type == 'node' && tags['natural'] == 'cave_entrance') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['historic'] == 'memorial') && zoom >= 17) || ((type == 'node' && tags['historic'] == 'archaeological_site') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'brown';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['natural'] == 'water') && zoom >= 15) || ((type == 'node' && tags['natural'] == 'lake') && zoom >= 15) || ((type == 'node' && tags['landuse'] == 'reservoir') && zoom >= 15) || ((type == 'node' && tags['landuse'] == 'basin') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && (tags.hasOwnProperty('leisure')) && (tags['point'] == '1' || tags['point'] == 'true' || tags['point'] == 'yes')) && zoom >= 15) || ((type == 'node' && (tags.hasOwnProperty('landuse')) && (tags['point'] == '1' || tags['point'] == 'true' || tags['point'] == 'yes')) && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 2;
            s_default['text-wrap-width'] = '10';
        }

        if (((type == 'node' && tags['natural'] == 'bay') && zoom >= 14)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['natural'] == 'spring') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-5';
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['tourism'] == 'alpine_hut') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['tourism'] == 'alpine_hut') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Oblique';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'ele');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-12';
        }

        if (((type == 'node' && tags['amenity'] == 'shelter') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#6699cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['amenity'] == 'shelter') && zoom >= 17)) {
            s_over1['font-family'] = 'DejaVu Sans Oblique';
            s_over1['font-size'] = '8';
            s_over1['text'] = MapCSS.e_localize(tags, 'ele');
            s_over1['text-anchor-vertical'] = 'below';
            s_over1['text-color'] = '#6699cc';
            s_over1['text-halo-radius'] = 1;
            s_over1['text-offset-y'] = '-12';
            s_over1['z-index'] = 0.1;
        }

        if (((type == 'node' && tags['amenity'] == 'bank') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = 'black';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['tourism'] == 'hotel') && zoom >= 17) || ((type == 'node' && tags['tourism'] == 'hostel') && zoom >= 17) || ((type == 'node' && tags['tourism'] == 'chalet') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['amenity'] == 'embassy') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['tourism'] == 'guest_house') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['tourism'] == 'bed_and_breakfast') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '5';
        }

        if (((type == 'node' && tags['amenity'] == 'fuel') && zoom >= 17) || ((type == 'node' && tags['amenity'] == 'bus_station') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
        }

        if (((type == 'node' && tags['tourism'] == 'camp_site') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-5';
            s_default['text-wrap-width'] = '70';
        }

        if (((type == 'node' && tags['tourism'] == 'caravan_site') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-5';
            s_default['text-wrap-width'] = '70';
        }

        if (((type == 'node' && tags['waterway'] == 'lock') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#0066ff';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-4';
            s_default['text-wrap-width'] = '70';
        }

        if (((type == 'node' && tags['leisure'] == 'marina') && zoom >= 15 && zoom <= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'blue';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['leisure'] == 'marina') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'blue';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['tourism'] == 'theme_park') && zoom >= 14 && zoom <= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['tourism'] == 'theme_park') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '30';
        }

        if (((type == 'node' && tags['tourism'] == 'museum') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '0';
        }

        if (((type == 'node' && tags['amenity'] == 'prison') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-4';
        }

        if (((type == 'node' && tags['tourism'] == 'attraction') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#660033';
            s_default['text-halo-radius'] = 2;
            s_default['text-wrap-width'] = '10';
        }

        if (((type == 'node' && tags['amenity'] == 'university') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#000033';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '16';
        }

        if (((type == 'node' && tags['amenity'] == 'school') && zoom >= 15) || ((type == 'node' && tags['amenity'] == 'college') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#000033';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '14';
        }

        if (((type == 'node' && tags['amenity'] == 'kindergarten') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#000033';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '14';
        }

        if (((type == 'node' && tags['man_made'] == 'lighthouse') && zoom >= 15)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#000033';
            s_default['text-halo-radius'] = 2;
            s_default['text-offset-y'] = '-4';
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['man_made'] == 'windmill') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#734a08';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '-3';
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['amenity'] == 'hospital') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#da0092';
            s_default['text-halo-radius'] = 2;
            s_default['text-offset-y'] = '0';
            s_default['text-wrap-width'] = '24';
        }

        if (((type == 'node' && tags['amenity'] == 'pharmacy') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#da0092';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['shop'] == 'bakery') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'clothes') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'fashion') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'convenience') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'doityourself') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'hairdresser') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'butcher') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'car') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'car_repair') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'bicycle') && zoom >= 17) || ((type == 'node' && tags['shop'] == 'florist') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#993399';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '12';
        }

        if (((type == 'node' && tags['shop'] == 'supermarket') && zoom >= 16) || ((type == 'node' && tags['shop'] == 'department_store') && zoom >= 16)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-anchor-vertical'] = 'below';
            s_default['text-color'] = '#993399';
            s_default['text-halo-radius'] = 1;
            s_default['text-offset-y'] = '1';
            s_default['text-wrap-width'] = '20';
        }

        if (((type == 'node' && tags['military'] == 'danger_area') && zoom >= 12)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = 'pink';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '10';
        }

        if (((type == 'node' && tags['aeroway'] == 'gate') && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '10';
            s_default['text'] = MapCSS.e_localize(tags, 'ref');
            s_default['text-color'] = '#aa66cc';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '10';
        }

        if (((type == 'way' && (tags.hasOwnProperty('addr:interpolation'))) && zoom >= 17)) {
            s_default['color'] = '#888888';
            s_default['dashes'] = [2, 4];
            s_default['width'] = 1;
        }

        if (((type == 'node' && (tags.hasOwnProperty('addr:housenumber'))) && zoom >= 17) || ((selector == 'area' && (tags.hasOwnProperty('addr:housenumber'))) && zoom >= 17)) {
            s_default['font-family'] = 'DejaVu Sans Book';
            s_default['font-size'] = '9';
            s_default['text'] = MapCSS.e_localize(tags, 'addr:housenumber');
            s_default['text-color'] = '#444444';
            s_default['text-position'] = 'center';
        }

        if (((selector == 'area' && tags['boundary'] == 'national_park') && zoom >= 7 && zoom <= 9)) {
            s_default['fill-color'] = 'green';
            s_default['fill-opacity'] = 0.05;
            s_default['color'] = 'green';
            s_default['dashes'] = [4, 2];
            s_default['opacity'] = 0.15;
            s_default['width'] = 1.5;
        }

        if (((selector == 'area' && tags['boundary'] == 'national_park') && zoom >= 10 && zoom <= 12)) {
            s_default['fill-color'] = 'green';
            s_default['fill-opacity'] = 0.05;
            s_default['color'] = 'green';
            s_default['dashes'] = [6, 2];
            s_default['opacity'] = 0.15;
            s_default['width'] = 3;
        }

        if (((selector == 'area' && tags['boundary'] == 'national_park') && zoom >= 13)) {
            s_default['color'] = 'green';
            s_default['dashes'] = [6, 2];
            s_default['opacity'] = 0.15;
            s_default['width'] = 3;
        }

        if (((selector == 'area' && tags['way_area'] >= '200000000' && tags['boundary'] == 'national_park') && zoom >= 8 && zoom <= 9)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '8';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#99cc99';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '14';
        }

        if (((selector == 'area' && tags['boundary'] == 'national_park') && zoom >= 10 && zoom <= 11)) {
            s_default['font-family'] = 'DejaVu Sans Bold';
            s_default['font-size'] = '11';
            s_default['text'] = MapCSS.e_localize(tags, 'name');
            s_default['text-color'] = '#99cc99';
            s_default['text-halo-radius'] = 1;
            s_default['text-wrap-width'] = '14';
        }

        if (((selector == 'area' && tags['tourism'] == 'theme_park') && zoom >= 13 && zoom <= 14)) {
            s_default['color'] = '#734a08';
            s_default['dashes'] = [9, 3];
            s_default['opacity'] = 0.6;
            s_default['width'] = 1.5;
        }

        if (((selector == 'area' && tags['tourism'] == 'theme_park') && zoom >= 15)) {
            s_default['color'] = '#734a08';
            s_default['dashes'] = [9, 3];
            s_default['opacity'] = 0.6;
            s_default['width'] = 2.5;
        }

        if (!K.Utils.isEmpty(s_tram)) {
            style['tram'] = s_tram;
        }
        if (!K.Utils.isEmpty(s_over6)) {
            style['over6'] = s_over6;
        }
        if (!K.Utils.isEmpty(s_over5)) {
            style['over5'] = s_over5;
        }
        if (!K.Utils.isEmpty(s_over4)) {
            style['over4'] = s_over4;
        }
        if (!K.Utils.isEmpty(s_over3)) {
            style['over3'] = s_over3;
        }
        if (!K.Utils.isEmpty(s_over2)) {
            style['over2'] = s_over2;
        }
        if (!K.Utils.isEmpty(s_over1)) {
            style['over1'] = s_over1;
        }
        if (!K.Utils.isEmpty(s_under1)) {
            style['under1'] = s_under1;
        }
        if (!K.Utils.isEmpty(s_under2)) {
            style['under2'] = s_under2;
        }
        if (!K.Utils.isEmpty(s_*)) {
            style['*'] = s_*;
        }
        if (!K.Utils.isEmpty(s_ele)) {
            style['ele'] = s_ele;
        }
        if (!K.Utils.isEmpty(s_access)) {
            style['access'] = s_access;
        }
        if (!K.Utils.isEmpty(s_water_lines-casing)) {
            style['water_lines-casing'] = s_water_lines-casing;
        }
        if (!K.Utils.isEmpty(s_tram_under3)) {
            style['tram_under3'] = s_tram_under3;
        }
        if (!K.Utils.isEmpty(s_oneway_over2)) {
            style['oneway_over2'] = s_oneway_over2;
        }
        if (!K.Utils.isEmpty(s_oneway_over3)) {
            style['oneway_over3'] = s_oneway_over3;
        }
        if (!K.Utils.isEmpty(s_oneway_over1)) {
            style['oneway_over1'] = s_oneway_over1;
        }
        if (!K.Utils.isEmpty(s_tram_under2)) {
            style['tram_under2'] = s_tram_under2;
        }
        if (!K.Utils.isEmpty(s_casing1)) {
            style['casing1'] = s_casing1;
        }
        if (!K.Utils.isEmpty(s_casing2)) {
            style['casing2'] = s_casing2;
        }
        if (!K.Utils.isEmpty(s_bridge-casing1)) {
            style['bridge-casing1'] = s_bridge-casing1;
        }
        if (!K.Utils.isEmpty(s_bridge-casing2)) {
            style['bridge-casing2'] = s_bridge-casing2;
        }
        if (!K.Utils.isEmpty(s_default)) {
            style['default'] = s_default;
        }
        if (!K.Utils.isEmpty(s_oneway)) {
            style['oneway'] = s_oneway;
        }
        if (!K.Utils.isEmpty(s_roads-casing)) {
            style['roads-casing'] = s_roads-casing;
        }
        return style;
    }
    
    var sprite_images = {
    }, external_images = ['symbols/aerodrome.p.16.png', 'symbols/airport.p.16.png', 'symbols/allotments.png', 'symbols/alpinehut.p.16.png', 'symbols/amenity_court.p.20.png', 'symbols/amenity_prison.p.20.png', 'symbols/atm2.p.16.png', 'symbols/bandb.p.20.png', 'symbols/bank2.p.16.png', 'symbols/bar.p.20.png', 'symbols/beach.png', 'symbols/biergarten.p.16.png', 'symbols/bollard.png', 'symbols/bus_station.n.16.png', 'symbols/bus_stop.p.12.png', 'symbols/bus_stop_small.png', 'symbols/cafe.p.16.png', 'symbols/camping.n.16.png', 'symbols/car_share.p.16.png', 'symbols/caravan_park.p.24.png', 'symbols/cemetery_jewish.18.png', 'symbols/chalet.p.16.png', 'symbols/christian3.p.14.png', 'symbols/cinema.p.24.png', 'symbols/communications.p.20.png', 'symbols/danger.png', 'symbols/department_store.p.16.png', 'symbols/embassy.png', 'symbols/fast_food.png', 'symbols/firestation.p.16.png', 'symbols/florist.p.16.png', 'symbols/food_drinkingtap.p.20.png', 'symbols/forest.png', 'symbols/fuel.p.16.png', 'symbols/gate2.png', 'symbols/glacier.png', 'symbols/glacier2.png', 'symbols/grave_yard.png', 'symbols/grave_yard_generic.png', 'symbols/guest_house.p.16.png', 'symbols/halt.png', 'symbols/helipad.p.16.png', 'symbols/hospital.p.16.png', 'symbols/hostel.p.20.png', 'symbols/hotel2.p.20.png', 'symbols/information.p.16.png', 'symbols/islamic3.p.16.png', 'symbols/jewish3.p.16.png', 'symbols/level_crossing.png', 'symbols/level_crossing2.png', 'symbols/library.p.20.png', 'symbols/liftgate.png', 'symbols/lighthouse.p.20.png', 'symbols/lock_gate.png', 'symbols/marsh.png', 'symbols/military_red_hz2.png', 'symbols/mini_round.png', 'symbols/motel.p.20.png', 'symbols/mud.png', 'symbols/museum.p.16.png', 'symbols/nature_reserve5.png', 'symbols/nature_reserve6.png', 'symbols/orchard.png', 'symbols/parking.p.16.png', 'symbols/parking_private.p.16.png', 'symbols/peak.png', 'symbols/pharmacy.p.16.png', 'symbols/picnic.p.16.png', 'symbols/place_of_worship3.p.16.png', 'symbols/playground.p.20.png', 'symbols/poi_cave.p.16.png', 'symbols/police.p.16.png', 'symbols/post_box.p.16.png', 'symbols/post_office.p.16.png', 'symbols/power_pole.png', 'symbols/power_tower.png', 'symbols/power_tower_3x3.png', 'symbols/power_tower_5x5.png', 'symbols/power_wind.png', 'symbols/pub.p.16.png', 'symbols/quarry2.png', 'symbols/recycling.p.16.png', 'symbols/rental_bicycle.p.20.png', 'symbols/restaurant.p.16.png', 'symbols/scrub.png', 'symbols/shelter2.p.16.png', 'symbols/shop_bakery.p.16.png', 'symbols/shop_butcher.png', 'symbols/shop_clothes.p.16.png', 'symbols/shop_convenience.p.16.png', 'symbols/shop_diy.p.16.png', 'symbols/shop_hairdresser.p.16.png', 'symbols/shop_supermarket.p.16.png', 'symbols/shopping_bicycle.p.16.png', 'symbols/shopping_car.p.16.png', 'symbols/shopping_car_repair.p.16.png', 'symbols/sikh3.p.16.png', 'symbols/sosphone.png', 'symbols/spring.png', 'symbols/station.png', 'symbols/station_disused.png', 'symbols/station_small.png', 'symbols/telephone.p.16.png', 'symbols/theatre.p.20.png', 'symbols/toilets.p.20.png', 'symbols/tourist_archaeological2.glow.16.png', 'symbols/tourist_memorial.p.20.png', 'symbols/tower_water.p.20.png', 'symbols/traffic_light.png', 'symbols/transport_ford.p.16.png', 'symbols/transport_slipway.p.20.png', 'symbols/tree.png', 'symbols/tree2.png', 'symbols/turning_circle-livs-fill.14.png', 'symbols/turning_circle-livs-fill.16.png', 'symbols/turning_circle-livs-fill.22.png', 'symbols/turning_circle-tert-casing.18.png', 'symbols/turning_circle-tert-casing.24.png', 'symbols/turning_circle-tert-fill.16.png', 'symbols/turning_circle-tert-fill.22.png', 'symbols/turning_circle-uncl-casing.14.png', 'symbols/turning_circle-uncl-casing.16.png', 'symbols/turning_circle-uncl-casing.18.png', 'symbols/turning_circle-uncl-casing.24.png', 'symbols/turning_circle-uncl-fill.12.png', 'symbols/turning_circle-uncl-fill.14.png', 'symbols/turning_circle-uncl-fill.16.png', 'symbols/turning_circle-uncl-fill.18.png', 'symbols/turning_circle-uncl-fill.22.png', 'symbols/turning_circle-uncl-fill.24.png', 'symbols/view_point.p.16.png', 'symbols/vineyard.png', 'symbols/volcano.png', 'symbols/walking.n.12.png', 'symbols/windmill.png', 'symbols/zoo.png'], presence_tags = ['bridge?', 'oneway?', 'captial?', 'addr:interpolation', 'tunnel?'], value_tags = ['ref', 'amenity', 'building', 'tunnel', 'power', 'access', 'service', 'point', 'shop', 'addr:housenumber', 'leisure', 'waterway', 'lock', 'aeroway', 'power_source', 'foot', 'landuse', 'barrier', 'construction', 'bicycle', 'railway', 'route', 'oneway', 'religion', 'tourism', 'natural', 'admin_level', 'horse', 'name', 'tracktype', 'place', 'bridge', 'highway', 'length', 'military', 'disused', 'ele', 'way_area', 'man_made', 'historic', 'boundary', 'aerialway'];

    MapCSS.loadStyle('styles/mapnik', restyle, sprite_images, external_images, presence_tags, value_tags);
    MapCSS.preloadExternalImages('styles/mapnik');
})(MapCSS);
    
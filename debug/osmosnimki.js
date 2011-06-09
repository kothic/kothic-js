
(function(MapCSS) {
    function restyle(tags, zoom, type, selector) {
        var g_217 = 'shop';
        var g_261 = 'town_6.png';
        var g_68 = 'text-allow-overlap';
        var g_102 = 'reservoir';
        var g_143 = '#ffd780';
        var g_59 = 'text';
        var g_1 = '#C4D4F5';
        var g_10 = '#fcfeff';
        var g_19 = 'hamlet';
        var g_183 = 'mus_13x12.png';
        var g_274 = '40';
        var g_297 = '#7848a0';
        var g_92 = 'pitch';
        var g_213 = 'post_office';
        var g_76 = 'recreation_ground';
        var g_173 = 'autobus_stop_14x10.png';
        var g_212 = 'hotell_14x14.png';
        var g_305 = 'addr:housenumber';
        var g_193 = 'toilets';
        var g_277 = 'nature_reserve';
        var g_270 = '20';
        var g_187 = 'courthouse';
        var g_69 = 'text-halo-radius';
        var g_24 = 'residential';
        var g_85 = 'cemetery';
        var g_224 = '3';
        var g_178 = 'pharmacy';
        var g_205 = 'kindergarten';
        var g_66 = 'text-color';
        var g_55 = 'wood';
        var g_159 = 'black';
        var g_229 = '4';
        var g_103 = '#285fd1';
        var g_268 = '14';
        var g_176 = 'fuel';
        var g_151 = 'railway';
        var g_246 = 'population';
        var g_220 = 'administrative';
        var g_208 = 'school_13x13.png';
        var g_198 = 'pravosl_kupol_11x15.png';
        var g_54 = 'forest';
        var g_265 = '11';
        var g_285 = '#4976d1';
        var g_34 = 'garden';
        var g_153 = '#303030';
        var g_288 = '4500';
        var g_230 = '#000000';
        var g_207 = 'school';
        var g_33 = 'leisure';
        var g_307 = 'milestone';
        var g_250 = 'allow-overlap';
        var g_222 = '2';
        var g_40 = 'sady10.png';
        var g_70 = '#ffffff';
        var g_308 = 'pk';
        var g_125 = 'secondary';
        var g_195 = 'place_of_worship';
        var g_194 = 'wc-3_13x13.png';
        var g_58 = 'name';
        var g_231 = 'tram';
        var g_191 = 'university';
        var g_149 = 'arrows';
        var g_269 = '50';
        var g_181 = 'cinema_14x14.png';
        var g_53 = 'desert22.png';
        var g_172 = 'bus_stop';
        var g_174 = 'tram_stop';
        var g_43 = 'kust1.png';
        var g_155 = 'subway';
        var g_56 = '#d6f4c6';
        var g_95 = 'river';
        var g_169 = 'node';
        var g_62 = 'font-size';
        var g_11 = 'glacier.png';
        var g_75 = 'meadow';
        var g_30 = '#cb8904';
        var g_133 = 'secondary_link';
        var g_214 = 'post_14x11.png';
        var g_209 = 'library';
        var g_237 = '#000d6c';
        var g_150 = 'line-style';
        var g_179 = 'med1_11x14.png';
        var g_78 = 'wetland';
        var g_170 = 'aut2_16x16_park.png';
        var g_50 = 'parking';
        var g_244 = '#1e7ca5';
        var g_162 = 'sport';
        var g_39 = 'parks2.png';
        var g_77 = '#f4ffe5';
        var g_138 = 'primary_link';
        var g_0 = 'canvas';
        var g_223 = '#202020';
        var g_7 = 'bottom';
        var g_154 = '#606060';
        var g_300 = '#cca352';
        var g_240 = '#1300bb';
        var g_168 = 'bus_station';
        var g_145 = 'motorway_link';
        var g_99 = '#abc4f5';
        var g_124 = 'track';
        var g_72 = '0 ';
        var g_2 = 'fill-color';
        var g_218 = 'superm_12x12.png';
        var g_201 = '#111111';
        var g_245 = 'capital';
        var g_129 = 'parking_aisle';
        var g_63 = 'DejaVu Serif Italic';
        var g_219 = 'boundary';
        var g_216 = 'rest_14x14.png';
        var g_71 = 'text-halo-color';
        var g_104 = 'highway';
        var g_304 = '#D8D1D1';
        var g_203 = 'text-opacity';
        var g_197 = 'christian';
        var g_157 = 'barrier';
        var g_164 = '#a0a0a0';
        var g_239 = 'metro_others6.png';
        var g_23 = 'landuse';
        var g_247 = '5000000';
        var g_264 = 'adm1_6_test2.png';
        var g_101 = 'water';
        var g_272 = '25';
        var g_134 = 'tertiary_link';
        var g_4 = 'coastline';
        var g_139 = 'trunk';
        var g_200 = 'max-width';
        var g_116 = 'path';
        var g_276 = '100';
        var g_64 = 'font-family';
        var g_160 = 'wall';
        var g_144 = 'trunk_link';
        var g_6 = '#fcf8e4';
        var g_132 = '#fcffd1';
        var g_206 = 'kindergarten_14x14.png';
        var g_80 = 'farmland';
        var g_185 = 'zoo';
        var g_115 = 'footway';
        var g_215 = 'restaurant';
        var g_291 = '3500';
        var g_293 = 'country';
        var g_137 = '#fcea97';
        var g_258 = '7';
        var g_108 = '#404040';
        var g_109 = 'DejaVu Sans Book';
        var g_13 = 'place';
        var g_255 = '100000';
        var g_38 = '#c4e9a4';
        var g_47 = 'military';
        var g_45 = '#ecffe5';
        var g_73 = '-x-mapnik-min-distance';
        var g_182 = 'museum';
        var g_123 = 'road';
        var g_282 = 'DejaVu Sans ExtraLight';
        var g_259 = 'town_4.png';
        var g_232 = 'rway44.png';
        var g_46 = 'industrial';
        var g_90 = 'bull2.png';
        var g_17 = 'fill-opacity';
        var g_31 = 'color';
        var g_146 = '#fa6478';
        var g_42 = '#e5f5dc';
        var g_136 = 'primary';
        var g_84 = '#ffe1d0';
        var g_236 = 'DejaVu Sans Mono Book';
        var g_12 = 'fill-image';
        var g_186 = 'zoo4_14x14.png';
        var g_20 = 'village';
        var g_22 = '#f3eceb';
        var g_199 = '#623f00';
        var g_281 = 'continent';
        var g_51 = '#ecedf4';
        var g_126 = 'tertiary';
        var g_166 = 'red';
        var g_98 = 'canal';
        var g_14 = 'city';
        var g_188 = 'sud_14x13.png';
        var g_221 = 'admin_level';
        var g_158 = 'fence';
        var g_127 = 'service';
        var g_5 = 'area';
        var g_122 = 'linecap';
        var g_147 = 'top';
        var g_275 = '80';
        var g_16 = '#FAF7F7';
        var g_29 = 'width';
        var g_306 = 'center';
        var g_135 = 'DejaVu Sans Bold';
        var g_91 = 'stadium';
        var g_227 = '6';
        var g_60 = 'text-offset';
        var g_226 = '#ff99cc';
        var g_165 = 'white';
        var g_25 = 'urban';
        var g_128 = 'living_street';
        var g_271 = '0.2';
        var g_263 = 'adm1_5.png';
        var g_96 = 'way';
        var g_302 = 'public';
        var g_211 = 'hotel';
        var g_37 = 'park';
        var g_57 = 'garages';
        var g_18 = 'z-index';
        var g_105 = 'construction';
        var g_251 = '8';
        var g_121 = 'butt';
        var g_106 = 'line';
        var g_249 = 'true';
        var g_100 = 'riverbank';
        var g_36 = '#edf2c1';
        var g_15 = 'town';
        var g_61 = '10';
        var g_295 = '13';
        var g_267 = '12';
        var g_253 = 'left';
        var g_296 = '16';
        var g_301 = '#E7CCB4';
        var g_79 = 'swamp_world2.png';
        var g_257 = 'adm_4.png';
        var g_48 = '#ddd8da';
        var g_241 = 'subway_entrance';
        var g_171 = 'icon-image';
        var g_278 = '#3c8000';
        var g_87 = 'aeroway';
        var g_287 = 'ele';
        var g_196 = 'religion';
        var g_74 = 'grass';
        var g_242 = 'airport_world.png';
        var g_234 = 'transport';
        var g_113 = 'casing-color';
        var g_177 = 'tankstelle1_10x11.png';
        var g_49 = 'amenity';
        var g_175 = 'tramway_14x13.png';
        var g_67 = 'false';
        var g_284 = 'sea';
        var g_97 = 'stream';
        var g_180 = 'cinema';
        var g_273 = '0.3';
        var g_192 = 'univer_15x11.png';
        var g_32 = 'allotments';
        var g_107 = 'text-position';
        var g_118 = 'pedestrian';
        var g_289 = 'mountain_peak6.png';
        var g_28 = '#f4d7c7';
        var g_233 = 'station';
        var g_94 = 'waterway';
        var g_283 = 'ocean';
        var g_279 = 'DejaVu Sans Oblique';
        var g_111 = 'casing-width';
        var g_235 = 'rw_stat_stanzii_2_blue.png';
        var g_280 = '#547bd1';
        var g_131 = 'unclassified';
        var g_161 = 'marking';
        var g_290 = '#664229';
        var g_93 = '#e3deb1';
        var g_21 = 'locality';
        var g_9 = 'glacier';
        var g_238 = '0';
        var g_262 = '1000000';
        var g_117 = 'cycleway';
        var g_202 = '1';
        var g_82 = 'field';
        var g_298 = 'suburb';
        var g_256 = '5';
        var g_26 = '#F7EFEB';
        var g_204 = '#777777';
        var g_228 = '#101010';
        var g_110 = '9';
        var g_266 = 'adm_6.png';
        var g_114 = 'dashes';
        var g_292 = '2500';
        var g_130 = 'opacity';
        var g_294 = '#dd5875';
        var g_41 = 'scrub';
        var g_299 = 'building';
        var g_189 = 'theatre';
        var g_81 = 'farm';
        var g_167 = '#c00000';
        var g_148 = 'oneway';
        var g_152 = 'rail';
        var g_141 = 'motorway';
        var g_120 = 'steps';
        var g_112 = '#996703';
        var g_286 = 'peak';
        var g_89 = '#008ac6';
        var g_254 = 'text-align';
        var g_52 = 'desert';
        var g_248 = 'adm_5.png';
        var g_88 = 'aerodrome';
        var g_184 = 'tourism';
        var g_86 = 'cemetry7_2.png';
        var g_3 = 'natural';
        var g_210 = 'lib_13x14.png';
        var g_35 = 'orchard';
        var g_190 = 'teater_14x14.png';
        var g_303 = '#edc2ba';
        var g_163 = 'colour';
        var g_156 = '#072889';
        var g_140 = '#fbcd40';
        var g_44 = 'heath';
        var g_260 = 'adm1_4_6.png';
        var g_225 = '#7e0156';
        var g_65 = 'green';
        var g_142 = '#fc9265';
        var g_243 = 'DejaVu Sans Condensed Bold';
        var g_27 = 'rural';
        var g_83 = '#fff5c4';
        var g_252 = '#505050';
        var g_119 = '#bf96ce';
        var g_8 = '-x-mapnik-layer';
        var s_default = {};
        var s_centerline = {};
        var s_ticks = {};
        var s_label = {};

        if ((selector == g_0)) {
            s_default[g_2] = g_1;
        }

        if (((selector == g_5 && tags[g_3] == g_4))) {
            s_default[g_2] = g_6;
            s_default[g_8] = g_7;
        }

        if (((selector == g_5 && tags[g_3] == g_9) && zoom >= 3)) {
            s_default[g_2] = g_10;
            s_default[g_12] = g_11;
        }

        if (((selector == g_5 && tags[g_13] == g_14) && zoom >= 10)
            || ((selector == g_5 && tags[g_13] == g_15) && zoom >= 10)) {
            s_default[g_2] = g_16;
            s_default[g_17] = 0.6;
            s_default[g_18] = 1;
        }

        if (((selector == g_5 && tags[g_13] == g_19) && zoom >= 10)
            || ((selector == g_5 && tags[g_13] == g_20) && zoom >= 10)
            || ((selector == g_5 && tags[g_13] == g_21) && zoom >= 10)) {
            s_default[g_2] = g_22;
            s_default[g_17] = 0.6;
            s_default[g_18] = 1;
        }

        if (((selector == g_5 && tags[g_23] == g_24) && zoom >= 10)
            || ((selector == g_5 && tags[g_24] == g_25) && zoom >= 10)) {
            s_default[g_2] = g_26;
            s_default[g_18] = 2;
        }

        if (((selector == g_5 && tags[g_24] == g_27) && zoom >= 10)) {
            s_default[g_2] = g_28;
            s_default[g_18] = 2;
        }

        if (((selector == g_5 && tags[g_23] == g_24) && zoom >= 16)) {
            s_default[g_29] = 0.3;
            s_default[g_31] = g_30;
            s_default[g_18] = 2;
        }

        if (((selector == g_5 && tags[g_23] == g_32) && zoom >= 10)
            || ((selector == g_5 && tags[g_33] == g_34) && zoom >= 10 && zoom <= 15)
            || ((selector == g_5 && tags[g_23] == g_35) && zoom >= 10 && zoom <= 15)) {
            s_default[g_2] = g_36;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_33] == g_37) && zoom >= 10)) {
            s_default[g_2] = g_38;
            s_default[g_18] = 3;
            s_default[g_12] = g_39;
        }

        if (((selector == g_5 && tags[g_33] == g_34) && zoom >= 16)
            || ((selector == g_5 && tags[g_23] == g_35) && zoom >= 16)) {
            s_default[g_12] = g_40;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_3] == g_41) && zoom >= 12)) {
            s_default[g_2] = g_42;
            s_default[g_12] = g_43;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_3] == g_44) && zoom >= 12)) {
            s_default[g_2] = g_45;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_23] == g_46) && zoom >= 10)
            || ((selector == g_5 && tags[g_23] == g_47) && zoom >= 10)) {
            s_default[g_2] = g_48;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_49] == g_50) && zoom >= 15)) {
            s_default[g_2] = g_51;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_3] == g_52) && zoom >= 4)) {
            s_default[g_12] = g_53;
        }

        if (((selector == g_5 && tags[g_3] == g_54) && zoom >= 4)
            || ((selector == g_5 && tags[g_3] == g_55) && zoom >= 4)
            || ((selector == g_5 && tags[g_23] == g_54) && zoom >= 4)
            || ((selector == g_5 && tags[g_23] == g_55) && zoom >= 4)) {
            s_default[g_2] = g_56;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_23] == g_57) && zoom >= 10)) {
            s_default[g_2] = g_48;
            s_default[g_18] = 3;
        }

        if (((selector == g_5 && tags[g_3] == g_54) && zoom >= 10)
            || ((selector == g_5 && tags[g_3] == g_55) && zoom >= 10)
            || ((selector == g_5 && tags[g_23] == g_54) && zoom >= 10)
            || ((selector == g_5 && tags[g_23] == g_55) && zoom >= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_61;
            s_default[g_64] = g_63;
            s_default[g_66] = g_65;
            s_default[g_68] = g_67;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_73] = g_72;
        }

        if (((selector == g_5 && tags[g_23] == g_74) && zoom >= 12)
            || ((selector == g_5 && tags[g_3] == g_74) && zoom >= 12)
            || ((selector == g_5 && tags[g_3] == g_75) && zoom >= 12)
            || ((selector == g_5 && tags[g_23] == g_75) && zoom >= 12)
            || ((selector == g_5 && tags[g_23] == g_76) && zoom >= 12)) {
            s_default[g_2] = g_77;
            s_default[g_18] = 4;
        }

        if (((selector == g_5 && tags[g_3] == g_78) && zoom >= 10)) {
            s_default[g_12] = g_79;
            s_default[g_18] = 4;
        }

        if (((selector == g_5 && tags[g_23] == g_80) && zoom >= 10)
            || ((selector == g_5 && tags[g_23] == g_81) && zoom >= 10)
            || ((selector == g_5 && tags[g_23] == g_82) && zoom >= 10)) {
            s_default[g_2] = g_83;
            s_default[g_18] = 5;
        }

        if (((selector == g_5 && tags[g_13] == g_14) && zoom >= 6 && zoom <= 9)
            || ((selector == g_5 && tags[g_13] == g_15) && zoom >= 6 && zoom <= 9)) {
            s_default[g_2] = g_84;
            s_default[g_17] = 0.6;
            s_default[g_18] = 5;
        }

        if (((selector == g_5 && tags[g_23] == g_85) && zoom >= 10)) {
            s_default[g_2] = g_42;
            s_default[g_18] = 5;
            s_default[g_12] = g_86;
        }

        if (((selector == g_5 && tags[g_87] == g_88) && zoom >= 13)) {
            s_default[g_31] = g_89;
            s_default[g_29] = 0.8;
            s_default[g_18] = 5;
            s_default[g_12] = g_90;
        }

        if (((selector == g_5 && tags[g_33] == g_91) && zoom >= 12)
            || ((selector == g_5 && tags[g_33] == g_92) && zoom >= 12)) {
            s_default[g_2] = g_93;
            s_default[g_18] = 5;
        }

        if (((type == g_96 && tags[g_94] == g_95) && zoom >= 7 && zoom <= 10)) {
            s_default[g_31] = g_1;
            s_default[g_29] = .6;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_94] == g_97) && zoom >= 9 && zoom <= 10)) {
            s_default[g_31] = g_1;
            s_default[g_29] = .3;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_94] == g_95) && zoom >= 10 && zoom <= 14)) {
            s_default[g_31] = g_1;
            s_default[g_29] = .7;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_94] == g_95) && zoom >= 15)) {
            s_default[g_31] = g_1;
            s_default[g_29] = .9;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_94] == g_97) && zoom >= 10)) {
            s_default[g_31] = g_1;
            s_default[g_29] = .5;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_94] == g_98) && zoom >= 10)) {
            s_default[g_31] = g_99;
            s_default[g_29] = .6;
            s_default[g_18] = 9;
        }

        if (((selector == g_5 && tags[g_94] == g_100) && zoom >= 5)
            || ((selector == g_5 && tags[g_3] == g_101) && zoom >= 5)
            || ((selector == g_5 && tags[g_23] == g_102) && zoom >= 10)) {
            s_default[g_2] = g_1;
            s_default[g_31] = g_1;
            s_default[g_29] = .1;
            s_default[g_18] = 9;
        }

        if (((selector == g_5 && tags[g_3] == g_101) && zoom >= 9)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 1;
            s_default[g_62] = g_61;
            s_default[g_64] = g_63;
            s_default[g_66] = g_103;
            s_default[g_68] = g_67;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
        }

        if (((type == g_96 && tags[g_104] == g_105) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_29] = 2;
            s_default[g_31] = g_70;
            s_default[g_18] = 10;
            s_default[g_114] = [9,9];
        }

        if (((type == g_96 && tags[g_104] == g_105) && zoom >= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_29] = 3;
            s_default[g_31] = g_70;
            s_default[g_18] = 10;
            s_default[g_114] = [9,9];
        }

        if (((type == g_96 && tags[g_104] == g_115) && zoom >= 15)
            || ((type == g_96 && tags[g_104] == g_116) && zoom >= 15)
            || ((type == g_96 && tags[g_104] == g_117) && zoom >= 15)
            || ((type == g_96 && tags[g_104] == g_118) && zoom >= 15)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_111] = .3;
            s_default[g_113] = g_119;
            s_default[g_29] = .2;
            s_default[g_31] = g_70;
            s_default[g_18] = 10;
            s_default[g_114] = [2,2];
        }

        if (((type == g_96 && tags[g_104] == g_120) && zoom >= 15)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_111] = .3;
            s_default[g_113] = g_70;
            s_default[g_29] = 3;
            s_default[g_31] = g_119;
            s_default[g_18] = 10;
            s_default[g_114] = [1,1];
            s_default[g_122] = g_121;
        }

        if (((type == g_96 && tags[g_104] == g_123) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_124) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_24) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_125) && zoom >= 9 && zoom <= 10)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 9 && zoom <= 10)
            || ((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '-1' || tags[g_128] == 'false' || tags[g_128] == 'no') && tags[g_127] !== g_129) && zoom >= 14 && zoom <= 15)) {
            s_default[g_29] = 0.3;
            s_default[g_130] = 0.6;
            s_default[g_31] = g_112;
            s_default[g_18] = 10;
            s_default[g_8] = g_7;
        }

        if (((type == g_96 && tags[g_104] == g_123) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_124) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 0.6;
            s_default[g_130] = 0.5;
            s_default[g_31] = g_112;
            s_default[g_18] = 10;
            s_default[g_8] = g_7;
        }

        if (((type == g_96 && tags[g_104] == g_123) && zoom >= 14 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_124) && zoom >= 14 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 1.5;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_104] == g_123) && zoom >= 16)
            || ((type == g_96 && tags[g_104] == g_124) && zoom >= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 2.5;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 9;
        }

        if (((type == g_96 && tags[g_104] == g_24) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 1.2;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.3;
            s_default[g_113] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '1' || tags[g_128] == 'true' || tags[g_128] == 'yes')) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_127 && tags[g_127] == g_129) && zoom >= 15 && zoom <= 16)) {
            s_default[g_29] = 0.2;
            s_default[g_130] = 0.5;
            s_default[g_31] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '1' || tags[g_128] == 'true' || tags[g_128] == 'yes')) && zoom >= 16)
            || ((type == g_96 && tags[g_104] == g_127 && tags[g_127] == g_129) && zoom >= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 1.2;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.3;
            s_default[g_113] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_24) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_131) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '-1' || tags[g_128] == 'false' || tags[g_128] == 'no') && tags[g_127] !== g_129) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 2.5;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_24) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_131) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_128) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '-1' || tags[g_128] == 'false' || tags[g_128] == 'no') && tags[g_127] !== g_129) && zoom >= 16 && zoom <= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 3.5;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_24) && zoom >= 17)
            || ((type == g_96 && tags[g_104] == g_131) && zoom >= 17)
            || ((type == g_96 && tags[g_104] == g_128) && zoom >= 17)
            || ((type == g_96 && tags[g_104] == g_127 && (tags[g_128] == '-1' || tags[g_128] == 'false' || tags[g_128] == 'no') && tags[g_127] !== g_129) && zoom >= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 4.5;
            s_default[g_31] = g_70;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 10;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 10 && zoom <= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_29] = 1.2;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.35;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 11 && zoom <= 12)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 11 && zoom <= 12)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 1.4;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.35;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 12 && zoom <= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 3;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.35;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_109;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 4;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.35;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 14 && zoom <= 15)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 5;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 6;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 16 && zoom <= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 7;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 17 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 8;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_125) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_133) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_126) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_134) && zoom >= 18 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 9;
            s_default[g_31] = g_132;
            s_default[g_111] = 0.5;
            s_default[g_113] = g_112;
            s_default[g_18] = 11;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 7 && zoom <= 8)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_137;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 8 && zoom <= 9)) {
            s_default[g_29] = 2;
            s_default[g_31] = g_137;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 9 && zoom <= 10)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 9 && zoom <= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 2;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 10 && zoom <= 11)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 10 && zoom <= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 3;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 11 && zoom <= 12)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 11 && zoom <= 12)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 4;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 12 && zoom <= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 5;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 6;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 14 && zoom <= 15)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 7;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 8;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 16 && zoom <= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 9;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 17 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 10;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_136) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 18 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 11;
            s_default[g_31] = g_137;
            s_default[g_111] = .5;
            s_default[g_113] = g_112;
            s_default[g_18] = 12;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 6 && zoom <= 7)) {
            s_default[g_29] = 0.9;
            s_default[g_31] = g_140;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_141) && zoom >= 6 && zoom <= 7)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_142;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 7 && zoom <= 8)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_140;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_141) && zoom >= 7 && zoom <= 8)) {
            s_default[g_29] = 1.2;
            s_default[g_31] = g_142;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 8 && zoom <= 9)) {
            s_default[g_29] = 2;
            s_default[g_31] = g_140;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_141) && zoom >= 8 && zoom <= 9)) {
            s_default[g_29] = 2;
            s_default[g_31] = g_142;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 9 && zoom <= 10)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 9 && zoom <= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 3;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 10 && zoom <= 11)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 10 && zoom <= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 4;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 11 && zoom <= 12)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 11 && zoom <= 12)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 5;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 12 && zoom <= 13)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 12 && zoom <= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 7;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 13 && zoom <= 14)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 8;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 14 && zoom <= 15)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 14 && zoom <= 15)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 9;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 15 && zoom <= 16)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 10;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 16 && zoom <= 17)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 16 && zoom <= 17)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 11;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 17 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 17 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 12;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 18 && zoom <= 18)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 18 && zoom <= 18)) {
            s_default[g_59] = tags[g_58];
            s_default[g_107] = g_106;
            s_default[g_66] = g_108;
            s_default[g_64] = g_135;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_29] = 13;
            s_default[g_31] = g_143;
            s_default[g_111] = 1;
            s_default[g_113] = g_112;
            s_default[g_18] = 13;
        }

        if (((type == g_96 && tags[g_104] == g_139) && zoom >= 9)
            || ((type == g_96 && tags[g_104] == g_144) && zoom >= 9)
            || ((type == g_96 && tags[g_104] == g_141) && zoom >= 9)
            || ((type == g_96 && tags[g_104] == g_145) && zoom >= 9)
            || ((type == g_96 && tags[g_104] == g_136) && zoom >= 13)
            || ((type == g_96 && tags[g_104] == g_138) && zoom >= 13)) {
            s_centerline[g_29] = .3;
            s_centerline[g_31] = g_146;
            s_centerline[g_18] = 14;
            s_centerline[g_8] = g_147;
        }

        if (((type == g_96 && (tags[g_148] == '1' || tags[g_148] == 'true' || tags[g_148] == 'yes')) && zoom >= 17)) {
            s_default[g_150] = g_149;
            s_default[g_18] = 15;
            s_default[g_8] = g_147;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 7 && zoom <= 8)) {
            s_default[g_29] = .5;
            s_default[g_31] = g_153;
            s_default[g_18] = 15;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 7 && zoom <= 8)) {
            s_ticks[g_29] = .3;
            s_ticks[g_31] = g_70;
            s_ticks[g_114] = [3,3];
            s_ticks[g_18] = 16;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 8 && zoom <= 9)) {
            s_default[g_29] = .6;
            s_default[g_31] = g_153;
            s_default[g_18] = 15;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 8 && zoom <= 9)) {
            s_ticks[g_29] = .35;
            s_ticks[g_31] = g_70;
            s_ticks[g_114] = [3,3];
            s_ticks[g_18] = 16;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 9)) {
            s_default[g_29] = 1.4;
            s_default[g_31] = g_154;
            s_default[g_18] = 15;
        }

        if (((selector == g_106 && tags[g_151] == g_152) && zoom >= 9)) {
            s_ticks[g_29] = 1;
            s_ticks[g_31] = g_70;
            s_ticks[g_114] = [6,6];
            s_ticks[g_18] = 16;
        }

        if (((type == g_96 && tags[g_151] == g_155) && zoom >= 12)) {
            s_default[g_29] = 3;
            s_default[g_31] = g_156;
            s_default[g_18] = 15;
            s_default[g_114] = [3,3];
            s_default[g_130] = 0.3;
            s_default[g_122] = g_121;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_157] == g_158) && zoom >= 16)) {
            s_default[g_29] = .3;
            s_default[g_31] = g_159;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_157] == g_160) && zoom >= 16)) {
            s_default[g_29] = .5;
            s_default[g_31] = g_159;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_161] == g_162 && (!(g_163 in tags)) && (!(g_31 in tags))) && zoom >= 15)) {
            s_default[g_29] = .5;
            s_default[g_31] = g_164;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_161] == g_162 && tags[g_163] == g_165) && zoom >= 15)
            || ((type == g_96 && tags[g_161] == g_162 && tags[g_31] == g_165) && zoom >= 15)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_165;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_161] == g_162 && tags[g_163] == g_166) && zoom >= 15)
            || ((type == g_96 && tags[g_161] == g_162 && tags[g_31] == g_166) && zoom >= 15)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_167;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_96 && tags[g_161] == g_162 && tags[g_163] == g_159) && zoom >= 15)
            || ((type == g_96 && tags[g_161] == g_162 && tags[g_31] == g_159) && zoom >= 15)) {
            s_default[g_29] = 1;
            s_default[g_31] = g_159;
            s_default[g_18] = 16;
            s_default[g_8] = g_147;
        }

        if (((type == g_169 && tags[g_49] == g_168) && zoom >= 15)) {
            s_default[g_171] = g_170;
        }

        if (((type == g_169 && tags[g_104] == g_172) && zoom >= 16)) {
            s_default[g_171] = g_173;
        }

        if (((type == g_169 && tags[g_151] == g_174) && zoom >= 16)) {
            s_default[g_171] = g_175;
        }

        if (((type == g_169 && tags[g_49] == g_176) && zoom >= 15)) {
            s_default[g_171] = g_177;
        }

        if (((type == g_169 && tags[g_49] == g_178) && zoom >= 16)) {
            s_default[g_171] = g_179;
        }

        if (((type == g_169 && tags[g_49] == g_180) && zoom >= 16)) {
            s_default[g_171] = g_181;
        }

        if (((type == g_169 && tags[g_49] == g_182) && zoom >= 15)) {
            s_default[g_171] = g_183;
        }

        if (((type == g_169 && tags[g_184] == g_185) && zoom >= 16)) {
            s_default[g_171] = g_186;
        }

        if (((type == g_169 && tags[g_49] == g_187) && zoom >= 16)) {
            s_default[g_171] = g_188;
        }

        if (((type == g_169 && tags[g_49] == g_189) && zoom >= 16)) {
            s_default[g_171] = g_190;
        }

        if (((type == g_169 && tags[g_49] == g_191) && zoom >= 16)) {
            s_default[g_171] = g_192;
        }

        if (((type == g_169 && tags[g_49] == g_193) && zoom >= 16)) {
            s_default[g_171] = g_194;
        }

        if (((type == g_169 && tags[g_49] == g_195 && tags[g_196] == g_197) && zoom >= 16)) {
            s_default[g_171] = g_198;
        }

        if (((selector == g_5 && tags[g_49] == g_195 && tags[g_196] == g_197) && zoom >= 16)) {
            s_default[g_171] = g_198;
        }

        if (((type == g_169 && tags[g_49] == g_195) && zoom >= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_66] = g_199;
            s_default[g_64] = g_63;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_60] = 3;
            s_default[g_200] = 70;
        }

        if (((selector == g_5 && tags[g_49] == g_195) && zoom >= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_66] = g_199;
            s_default[g_64] = g_63;
            s_default[g_62] = g_110;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_60] = 3;
            s_default[g_200] = 70;
            s_default[g_18] = 16;
            s_default[g_29] = 0.1;
            s_default[g_31] = g_201;
            s_default[g_203] = g_202;
            s_default[g_2] = g_204;
            s_default[g_17] = 0.5;
        }

        if (((type == g_169 && tags[g_49] == g_205) && zoom >= 17)) {
            s_default[g_171] = g_206;
        }

        if (((type == g_169 && tags[g_49] == g_207) && zoom >= 17)) {
            s_default[g_171] = g_208;
        }

        if (((type == g_169 && tags[g_49] == g_209) && zoom >= 17)) {
            s_default[g_171] = g_210;
        }

        if (((type == g_169 && tags[g_184] == g_211) && zoom >= 17)) {
            s_default[g_171] = g_212;
        }

        if (((type == g_169 && tags[g_49] == g_213) && zoom >= 17)) {
            s_default[g_171] = g_214;
        }

        if (((type == g_169 && tags[g_49] == g_215) && zoom >= 17)) {
            s_default[g_171] = g_216;
        }

        if (((type == g_169 && (g_217 in tags)) && zoom >= 17)) {
            s_default[g_171] = g_218;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_222))) {
            s_default[g_29] = 0.5;
            s_default[g_31] = g_223;
            s_default[g_114] = [6,4];
            s_default[g_130] = 0.7;
            s_default[g_18] = 16;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_224) && zoom >= 3 && zoom <= 4)) {
            s_default[g_29] = 0.4;
            s_default[g_31] = g_225;
            s_default[g_114] = [3,3];
            s_default[g_130] = 0.5;
            s_default[g_18] = 16;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_224) && zoom >= 4)) {
            s_default[g_29] = 1.3;
            s_default[g_31] = g_226;
            s_default[g_130] = 0.5;
            s_default[g_18] = 16;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_227) && zoom >= 10)) {
            s_default[g_29] = 0.5;
            s_default[g_31] = g_228;
            s_default[g_114] = [1,2];
            s_default[g_130] = 0.6;
            s_default[g_18] = 16.1;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_229) && zoom >= 4 && zoom <= 5)) {
            s_default[g_29] = 0.3;
            s_default[g_31] = g_230;
            s_default[g_114] = [1,2];
            s_default[g_130] = 0.8;
            s_default[g_18] = 16.3;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_229) && zoom >= 6)) {
            s_default[g_29] = 0.7;
            s_default[g_31] = g_230;
            s_default[g_114] = [1,2];
            s_default[g_130] = 0.8;
            s_default[g_18] = 16.3;
        }

        if (((type == g_96 && tags[g_151] == g_231) && zoom >= 12)) {
            s_default[g_150] = g_232;
            s_default[g_18] = 17;
        }

        if (((type == g_169 && tags[g_151] == g_233 && tags[g_234] !== g_155) && zoom >= 9)) {
            s_default[g_171] = g_235;
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 7;
            s_default[g_62] = g_110;
            s_default[g_64] = g_236;
            s_default[g_69] = 1;
            s_default[g_66] = g_237;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_151] == g_233 && tags[g_234] == g_155) && zoom >= 12 && zoom <= 15)) {
            s_default[g_171] = g_239;
            s_default[g_18] = 17;
        }

        if (((type == g_169 && tags[g_151] == g_233 && tags[g_234] == g_155) && zoom >= 12 && zoom <= 15)) {
            s_label[g_59] = tags[g_58];
            s_label[g_60] = 11;
            s_label[g_62] = g_110;
            s_label[g_64] = g_109;
            s_label[g_69] = 2;
            s_label[g_66] = g_240;
            s_label[g_71] = g_70;
            s_label[g_68] = g_67;
            s_label[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_151] == g_241) && zoom >= 16)) {
            s_default[g_171] = g_239;
            s_default[g_18] = 17;
        }

        if (((type == g_169 && tags[g_151] == g_241 && (g_58 in tags)) && zoom >= 16)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 11;
            s_default[g_62] = g_110;
            s_default[g_64] = g_109;
            s_default[g_69] = 2;
            s_default[g_66] = g_240;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_87] == g_88) && zoom >= 10)) {
            s_default[g_171] = g_242;
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 12;
            s_default[g_62] = g_110;
            s_default[g_64] = g_243;
            s_default[g_69] = 1;
            s_default[g_66] = g_244;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_18] = 17;
        }

        if (((type == g_169 && (tags[g_245] == '1' || tags[g_245] == 'true' || tags[g_245] == 'yes') && tags[g_246] > g_247) && zoom >= 3 && zoom <= 6)) {
            s_default[g_171] = g_248;
            s_default[g_250] = g_249;
        }

        if (((type == g_169 && (tags[g_245] == '1' || tags[g_245] == 'true' || tags[g_245] == 'yes') && tags[g_246] > g_247) && zoom >= 3 && zoom <= 4)) {
            s_default[g_60] = 4;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_251;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_252;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_254] = g_253;
        }

        if (((type == g_169 && (tags[g_245] == '1' || tags[g_245] == 'true' || tags[g_245] == 'yes') && tags[g_246] > g_247) && zoom >= 4 && zoom <= 6)) {
            s_default[g_60] = 6;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_61;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_153;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_254] = g_253;
        }

        if (((type == g_169 && (g_13 in tags) && tags[g_246] < g_255 && (g_245 in tags) && tags[g_221] < g_256) && zoom >= 4 && zoom <= 5)) {
            s_default[g_171] = g_257;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_258;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_108;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && (g_13 in tags) && tags[g_246] >= g_255 && tags[g_246] <= g_247 && (g_245 in tags) && tags[g_221] < g_256) && zoom >= 4 && zoom <= 5)) {
            s_default[g_171] = g_248;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_251;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_108;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_18] = 1;
        }

        if (((type == g_169 && tags[g_13] == g_15 && (g_245 in tags)) && zoom >= 5 && zoom <= 6)) {
            s_default[g_171] = g_259;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] < g_255) && zoom >= 6 && zoom <= 7)
            || ((type == g_169 && tags[g_13] == g_15 && tags[g_246] < g_255 && (g_221 in tags)) && zoom >= 6 && zoom <= 7)) {
            s_default[g_171] = g_260;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_251;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] < g_255) && zoom >= 7 && zoom <= 8)
            || ((type == g_169 && tags[g_13] == g_15 && tags[g_246] < g_255) && zoom >= 7 && zoom <= 8)) {
            s_default[g_171] = g_261;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_110;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_15 && (!(g_246 in tags))) && zoom >= 7 && zoom <= 8)
            || ((type == g_169 && tags[g_13] == g_14 && (!(g_246 in tags))) && zoom >= 7 && zoom <= 8)) {
            s_default[g_171] = g_261;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_251;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_15) && zoom >= 8 && zoom <= 9)) {
            s_default[g_171] = g_261;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_251;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] >= g_255 && tags[g_246] <= g_262) && zoom >= 6 && zoom <= 8)
            || ((type == g_169 && tags[g_13] == g_15 && tags[g_246] >= g_255 && tags[g_246] <= g_262 && (g_221 in tags)) && zoom >= 6 && zoom <= 7)) {
            s_default[g_171] = g_263;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_110;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_153;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] >= g_255 && tags[g_246] <= g_262) && zoom >= 7 && zoom <= 8)
            || ((type == g_169 && tags[g_13] == g_15 && tags[g_246] >= g_255 && tags[g_246] <= g_262) && zoom >= 7 && zoom <= 8)) {
            s_default[g_171] = g_263;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_61;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_153;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] > g_262) && zoom >= 6 && zoom <= 7)) {
            s_default[g_171] = g_264;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_61;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_108;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_18] = 1;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] > g_262 && tags[g_246] < g_247) && zoom >= 7 && zoom <= 8)) {
            s_default[g_171] = g_264;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_265;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_108;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_18] = 2;
        }

        if (((type == g_169 && tags[g_13] == g_14 && tags[g_246] >= g_247) && zoom >= 7 && zoom <= 8)) {
            s_default[g_171] = g_266;
            s_default[g_60] = 5;
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_267;
            s_default[g_64] = g_135;
            s_default[g_69] = 1;
            s_default[g_66] = g_108;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_18] = 3;
        }

        if (((type == g_169 && tags[g_13] == g_14 && (tags[g_245] == '1' || tags[g_245] == 'true' || tags[g_245] == 'yes')) && zoom >= 9 && zoom <= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -20;
            s_default[g_62] = g_268;
            s_default[g_64] = g_135;
            s_default[g_69] = 4;
            s_default[g_66] = g_228;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_269;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_14 && (tags[g_245] == '-1' || tags[g_245] == 'false' || tags[g_245] == 'no')) && zoom >= 9 && zoom <= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -20;
            s_default[g_62] = g_268;
            s_default[g_64] = g_135;
            s_default[g_69] = 2;
            s_default[g_66] = g_228;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
            s_default[g_73] = g_238;
            s_default[g_18] = 1;
        }

        if (((type == g_169 && tags[g_13] == g_15) && zoom >= 11 && zoom <= 12)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_267;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_15) && zoom >= 12 && zoom <= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_270;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_271;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_14) && zoom >= 12 && zoom <= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_272;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_273;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_15) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_274;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_271;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_14) && zoom >= 13 && zoom <= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_269;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_273;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_15) && zoom >= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_275;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_271;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_14) && zoom >= 14)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_276;
            s_default[g_64] = g_109;
            s_default[g_66] = g_228;
            s_default[g_203] = g_273;
            s_default[g_68] = g_249;
            s_default[g_18] = 20;
        }

        if (((type == g_169 && tags[g_13] == g_20) && zoom >= 9)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 1;
            s_default[g_62] = g_110;
            s_default[g_64] = g_109;
            s_default[g_69] = 1;
            s_default[g_66] = g_154;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
        }

        if (((type == g_169 && tags[g_13] == g_19) && zoom >= 9)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 1;
            s_default[g_62] = g_251;
            s_default[g_64] = g_109;
            s_default[g_69] = 1;
            s_default[g_66] = g_252;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
        }

        if (((selector == g_5 && tags[g_23] == g_277) && zoom >= 9)
            || ((selector == g_5 && tags[g_33] == g_37) && zoom >= 11)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 1;
            s_default[g_62] = g_61;
            s_default[g_64] = g_63;
            s_default[g_69] = 0;
            s_default[g_66] = g_278;
            s_default[g_71] = g_70;
            s_default[g_68] = g_67;
        }

        if (((type == g_96 && tags[g_94] == g_97) && zoom >= 10)
            || ((type == g_96 && tags[g_94] == g_95) && zoom >= 9)
            || ((type == g_96 && tags[g_94] == g_98) && zoom >= 13)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_110;
            s_default[g_64] = g_279;
            s_default[g_66] = g_280;
            s_default[g_69] = 1;
            s_default[g_71] = g_70;
            s_default[g_107] = g_106;
        }

        if (((type == g_169 && tags[g_13] == g_281) && zoom <= 3)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -10;
            s_default[g_62] = g_61;
            s_default[g_64] = g_282;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_18] = -1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_281) && zoom >= 2 && zoom <= 3)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -10;
            s_default[g_62] = g_251;
            s_default[g_64] = g_282;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_18] = -1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_283) && zoom <= 6)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_251;
            s_default[g_64] = g_279;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_18] = -1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_283) && zoom >= 7)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_265;
            s_default[g_64] = g_279;
            s_default[g_69] = 1;
            s_default[g_66] = g_223;
            s_default[g_71] = g_70;
            s_default[g_18] = -1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_284) && zoom <= 6)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_251;
            s_default[g_64] = g_279;
            s_default[g_69] = 1;
            s_default[g_66] = g_285;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_284) && zoom >= 7)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_61;
            s_default[g_64] = g_279;
            s_default[g_69] = 1;
            s_default[g_66] = g_285;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_3] == g_286 && tags[g_287] > g_288) && zoom >= 3 && zoom <= 4)) {
            s_default[g_171] = g_289;
            s_default[g_59] = tags[g_287];
            s_default[g_60] = 3;
            s_default[g_62] = g_258;
            s_default[g_64] = g_236;
            s_default[g_69] = 0;
            s_default[g_66] = g_290;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_3] == g_286 && tags[g_287] > g_291) && zoom >= 5 && zoom <= 6)) {
            s_default[g_171] = g_289;
            s_default[g_59] = tags[g_287];
            s_default[g_60] = 3;
            s_default[g_62] = g_258;
            s_default[g_64] = g_236;
            s_default[g_69] = 0;
            s_default[g_66] = g_290;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_3] == g_286 && tags[g_287] > g_292) && zoom >= 7 && zoom <= 12)) {
            s_default[g_171] = g_289;
            s_default[g_59] = tags[g_287];
            s_default[g_60] = 3;
            s_default[g_62] = g_258;
            s_default[g_64] = g_236;
            s_default[g_69] = 0;
            s_default[g_66] = g_290;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_3] == g_286) && zoom >= 12)) {
            s_default[g_171] = g_289;
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 3;
            s_default[g_62] = g_258;
            s_default[g_64] = g_236;
            s_default[g_69] = 0;
            s_default[g_66] = g_290;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_293) && zoom >= 2 && zoom <= 3)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_61;
            s_default[g_64] = g_109;
            s_default[g_69] = 1;
            s_default[g_66] = g_294;
            s_default[g_71] = g_70;
            s_default[g_18] = 1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_293) && zoom >= 4 && zoom <= 8)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_295;
            s_default[g_64] = g_109;
            s_default[g_69] = 1;
            s_default[g_66] = g_166;
            s_default[g_71] = g_70;
            s_default[g_18] = 1;
            s_default[g_73] = g_238;
        }

        if (((type == g_169 && tags[g_13] == g_293) && zoom >= 8 && zoom <= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 0;
            s_default[g_62] = g_296;
            s_default[g_64] = g_109;
            s_default[g_69] = 1;
            s_default[g_66] = g_166;
            s_default[g_71] = g_70;
            s_default[g_18] = 1;
            s_default[g_73] = g_238;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_224) && zoom >= 3 && zoom <= 5)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -5;
            s_default[g_62] = g_251;
            s_default[g_64] = g_282;
            s_default[g_69] = 0;
            s_default[g_66] = g_228;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
            s_default[g_200] = 50;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_229) && zoom >= 6 && zoom <= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = 17;
            s_default[g_62] = g_268;
            s_default[g_64] = g_282;
            s_default[g_69] = 1;
            s_default[g_66] = g_154;
            s_default[g_71] = g_70;
            s_default[g_73] = g_238;
        }

        if (((selector == g_5 && tags[g_219] == g_220 && tags[g_221] == g_227) && zoom >= 10)) {
            s_default[g_59] = tags[g_58];
            s_default[g_60] = -10;
            s_default[g_62] = g_267;
            s_default[g_64] = g_282;
            s_default[g_69] = 1;
            s_default[g_66] = g_297;
            s_default[g_71] = g_70;
        }

        if (((type == g_169 && tags[g_13] == g_298) && zoom >= 12)) {
            s_default[g_59] = tags[g_58];
            s_default[g_62] = g_267;
            s_default[g_64] = g_282;
            s_default[g_66] = g_297;
            s_default[g_18] = 20;
        }

        if (((selector == g_5 && (g_299 in tags)) && zoom >= 13)) {
            s_default[g_29] = .3;
            s_default[g_31] = g_300;
            s_default[g_18] = 17;
        }

        if (((selector == g_5 && (tags[g_299] == '1' || tags[g_299] == 'true' || tags[g_299] == 'yes')) && zoom >= 15)) {
            s_default[g_2] = g_301;
            s_default[g_18] = 17;
        }

        if (((selector == g_5 && tags[g_299] == g_302) && zoom >= 15)) {
            s_default[g_2] = g_303;
            s_default[g_18] = 17;
        }

        if (((selector == g_5 && (g_299 in tags) && (tags[g_299] == '-1' || tags[g_299] == 'false' || tags[g_299] == 'no') && tags[g_299] !== g_302) && zoom >= 15)) {
            s_default[g_2] = g_304;
            s_default[g_18] = 17;
        }

        if (((selector == g_5 && (g_299 in tags)) && zoom >= 15 && zoom <= 16)) {
            s_default[g_59] = tags[g_305];
            s_default[g_69] = 1;
            s_default[g_107] = g_306;
            s_default[g_62] = g_258;
            s_default[g_73] = g_61;
            s_default[g_130] = 0.8;
        }

        if (((selector == g_5 && (g_299 in tags)) && zoom >= 17)) {
            s_default[g_59] = tags[g_305];
            s_default[g_69] = 1;
            s_default[g_107] = g_306;
            s_default[g_62] = g_251;
            s_default[g_73] = g_61;
            s_default[g_130] = 0.8;
        }

        if (((type == g_169 && tags[g_104] == g_307 && (g_308 in tags)) && zoom >= 13)) {
            s_default[g_59] = tags[g_308];
            s_default[g_62] = g_258;
            s_default[g_69] = 5;
            s_default[g_73] = g_238;
        }

        var style = {};
        if (s_default) {
            style['default'] = s_default;
        }
        if (s_centerline) {
            style['centerline'] = s_centerline;
        }
        if (s_ticks) {
            style['ticks'] = s_ticks;
        }
        if (s_label) {
            style['label'] = s_label;
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
    
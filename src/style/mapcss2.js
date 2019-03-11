
var MapCSS = {
    styles: {},
    availableStyles: [],
    images: {},
    locales: [],
    presence_tags: [],
    value_tags: [],
    cache: {},
    debug: {hit: 0, miss: 0},

    onError: function () {
    },

    onImagesLoad: function () {
    },

    /**
     * Incalidate styles cache
     */
    invalidateCache: function () {
        this.cache = {};
    },


    loadStyle: function (style, restyle, sprite_images, external_images, presence_tags, value_tags) {
        var i;
        sprite_images = sprite_images || [];
        external_images = external_images || [];

        if (presence_tags) {
            for (i = 0; i < presence_tags.length; i++) {
                if (this.presence_tags.indexOf(presence_tags[i]) < 0) {
                    this.presence_tags.push(presence_tags[i]);
                }
            }
        }

        if (value_tags) {
            for (i = 0; i < value_tags.length; i++) {
                if (this.value_tags.indexOf(value_tags[i]) < 0) {
                    this.value_tags.push(value_tags[i]);
                }
            }
        }

        MapCSS.styles[style] = {
            restyle: restyle,
            images: sprite_images,
            external_images: external_images,
            textures: {},
            sprite_loaded: !sprite_images,
            external_images_loaded: !external_images.length
        };

        MapCSS.availableStyles.push(style);
    },

    // getTagKeys: function (tags, zoom, type, selector) {
    //     var keys = [], i;
    //     for (i = 0; i < this.presence_tags.length; i++) {
    //         if (tags.hasOwnProperty(this.presence_tags[i])) {
    //             keys.push(this.presence_tags[i]);
    //         }
    //     }
    //
    //     for (i = 0; i < this.value_tags.length; i++) {
    //         if (tags.hasOwnProperty(this.value_tags[i])) {
    //             keys.push(this.value_tags[i] + ':' + tags[this.value_tags[i]]);
    //         }
    //     }
    //
    //     return [zoom, type, selector, keys.join(':')].join(':');
    // },

    restyle: function (styleNames, tags, zoom, type, selector) {
        var i, key = this.getTagKeys(tags, zoom, type, selector), actions = this.cache[key] || {};

        if (!this.cache.hasOwnProperty(key)) {
            this.debug.miss += 1;
            for (i = 0; i < styleNames.length; i++) {
                actions = MapCSS.styles[styleNames[i]].restyle(actions, tags, zoom, type, selector);
            }
            this.cache[key] = actions;
        } else {
            this.debug.hit += 1;
        }

        return actions;
    }
};


module.exports = MapCSS;

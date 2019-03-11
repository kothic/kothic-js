/**
 * Call MapCSS.onImagesLoad callback if all sprite and external
 * images was loaded
 */
_onImagesLoad: function (style) {
    if (MapCSS.styles[style].external_images_loaded &&
            MapCSS.styles[style].sprite_loaded) {
        MapCSS.onImagesLoad();
    }
},

preloadSpriteImage: function (style, url) {
    var images = MapCSS.styles[style].images,
        img = new Image();

    delete MapCSS.styles[style].images;

    img.onload = function () {
        var image;
        for (image in images) {
            if (images.hasOwnProperty(image)) {
                images[image].sprite = img;
                MapCSS.images[image] = images[image];
            }
        }
        MapCSS.styles[style].sprite_loaded = true;
        MapCSS._onImagesLoad(style);
    };
    img.onerror = function (e) {
        MapCSS.onError(e);
    };
    img.src = url;
},

preloadExternalImages: function (style, urlPrefix) {
    var external_images = MapCSS.styles[style].external_images;
    delete MapCSS.styles[style].external_images;

    urlPrefix = urlPrefix || '';
    var len = external_images.length, loaded = 0, i;

    function loadImage(url) {
        var img = new Image();
        img.onload = function () {
            loaded++;
            MapCSS.images[url] = {
                sprite: img,
                height: img.height,
                width: img.width,
                offset: 0
            };
            if (loaded === len) {
                MapCSS.styles[style].external_images_loaded = true;
                MapCSS._onImagesLoad(style);
            }
        };
        img.onerror = function () {
            loaded++;
            if (loaded === len) {
                MapCSS.styles[style].external_images_loaded = true;
                MapCSS._onImagesLoad(style);
            }
        };
        img.src = url;
    }

    for (i = 0; i < len; i++) {
        loadImage(urlPrefix + external_images[i]);
    }
},

getImage: function (ref) {
    var img = MapCSS.images[ref];

    if (img && img.sprite) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        canvas.getContext('2d').drawImage(img.sprite,
                0, img.offset, img.width, img.height,
                0, 0, img.width, img.height);

        img = MapCSS.images[ref] = canvas;
    }

    return img;
},

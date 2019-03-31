const fs = require('fs');
const path = require('path');
const { loadImage } = require('canvas')

function Gallery(options) {
  this.localImagesDirectory = options && options.localImagesDirectory;
  this.images = {};
}

Gallery.prototype.preloadImages = function(images) {
  const self = this;
  const uriRegexp = /https?:\/\//;

  //External images
  var promises = images.filter((image) => image.match(uriRegexp))
      .map((image) => loadImage(image).then((data) => self.images[image] = data));

  if (this.localImagesDirectory) {
    const localPromises = images.filter((image) => !image.match(uriRegexp))
      .map((image) => loadImage(path.join(self.localImagesDirectory, image)).then((data) => self.images[image] = data));
    promises = promises.concat(localPromises);
  }

  promises = promises.map((promise) => promise);

  return Promise.all(promises);
}

Gallery.prototype.getImage = function(image) {
  return this.images[image];
}

module.exports = Gallery;

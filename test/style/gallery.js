const expect = require("chai").expect;

const Gallery = require('../../src/style/gallery')

describe("Gallery", () => {
  describe("Load external image", () => {
    it("empty rules", () => {
      const gallery = new Gallery({'localImagesDirectory': 'test/resources'});
      gallery.preloadImages(['test.png'], (err) => {
        expect(gallery.getImage('test.png')).to.be.not.null
      });
    });

    it("no file found", () => {
      const gallery = new Gallery({'localImagesDirectory': 'test/resources'});
      gallery.preloadImages(['does-not-exist.png'], (err) => {
        expect(err).to.be.not.null
      });
    });

    it("no local directory", () => {
      const gallery = new Gallery({});
      gallery.preloadImages(['test.png'], (err) => {
        expect(err).to.be.null
        expect(gallery.getImage('test.png')).to.be.undefined;
      });
    });
  });
});

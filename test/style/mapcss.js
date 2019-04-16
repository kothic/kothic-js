const expect = require("chai").expect;

var rewire = require("rewire");

const MapCSS = rewire("../../src/style/mapcss");

describe("MapCSS", () => {
  const Gallery = function() {
  }

  describe("General flow", () => {
    it("required parameter", () => {
      expect(() => new MapCSS()).to.throw(TypeError);
    });

    it("Apply rules", () => {
      const m = new MapCSS("way { color: red; }");
      const layers = m.apply({}, 10, 'LineString');
      expect(layers).to.have.deep.property('default', {color: 'red'});
    });
  });

  describe("Cache", () => {
    it("value insensitive", () => {
      const m = new MapCSS("way[ford] { color: red; }", {cache: {}});
      expect(m.knownTags).to.have.property('ford', 'k');

      expect(m.createCacheKey({ford: 'yes', depth: 0.5}, 10, 'LineString')).to.be.equal('10:LineString:ford');

      expect(m.apply({ford: 'yes'}, 10, 'LineString')).to.have.deep.property('default', {color: 'red'});
      expect(m.apply({ford: 'no'}, 10, 'LineString')).to.have.deep.property('default', {color: 'red'});
    });

    it("value sensitive", () => {
      const m = new MapCSS("way[ford=yes] { color: red; }", {cache: {}});
      expect(m.knownTags).to.have.property('ford', 'kv');

      expect(m.createCacheKey({ford: 'yes', depth: 0.5}, 10, 'LineString')).to.be.equal('10:LineString:ford=yes');
    });
  });

  describe("Locales", () => {
    it("localization support", () => {
      const m = new MapCSS('node {text: eval(localize("name"));}', {locales: ['en', 'de']});

      const tags = {'name': '北京', 'name:en': 'Beijing', 'name:de': 'Peking'}
      expect(m.apply(tags, 10, 'Point')).to.have.deep.property('default', {text: 'Beijing'});
    });
  });

  describe("Images", () => {
    it("should ", () => {
      Gallery.prototype.preloadImages = function (images) {
        this.images = images
      };


      const m = new MapCSS('node {icon-image: "peak.png";}');

      expect(m.listImageReferences()).to.have.members(['peak.png']);
    });
  });

});

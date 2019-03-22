'use strict';

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const expect = chai.expect;

const StyleManager = require("../../src/style/style-manager");

describe("Style Manager", () => {
  describe("Layers", () => {
    it("Zero hypotesis", () => {
      const mapcss = { apply: () => ({'default': {}}) };
      const sm = new StyleManager(mapcss);
      const layers = sm.createLayers([], 10);
      expect(layers).to.be.empty;
    });

    it("Split feature to layers", () => {
      const mapcss = { apply: () => ({
        'default': {
          'width': '1',
          'casing-width': '1',
          'z-index': '5',
          'text': 'Hooray'
        },
        'overlay_1': {
          'width': '5',
          'casing-width': '2',
          'z-index': '1000'
        },
        'overlay_2': {
          'width': '1',
          'casing-width': '1',
          'z-index': '2000'
        }
      })};
      const sm = new StyleManager(mapcss);

      const features = [{
        geometry: {type: 'Point'},
      }];

      const layers = sm.createLayers(features, 10);
      console.log(JSON.stringify(layers, 2, 2));
      expect(layers).to.have.property('length', 7);
      expect(layers[0]).to.containSubset({render: 'casing', zIndex: 5});
      expect(layers[1]).to.containSubset({render: 'line', zIndex: 5});
      expect(layers[6]).to.containSubset({render: 'text', zIndex: 5});
      expect(layers[2]).to.containSubset({render: 'casing', zIndex: 1000});
      expect(layers[3]).to.containSubset({render: 'line', zIndex: 1000});
      expect(layers[4]).to.containSubset({render: 'casing', zIndex: 2000});
      expect(layers[5]).to.containSubset({render: 'line', zIndex: 2000});
    });
  });
});

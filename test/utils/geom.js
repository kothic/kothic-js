var expect = require("chai").expect;
var geom = require("../../src/utils/geom.js")

describe("Geometry Utils", function() {
  describe("Transform Point", function() {
    it("should scale point coordinates", function() {
      expect(geom.transformPoint([5, 5], 10, 10)).to.deep.equal([50, 50]);
    });
  });
});

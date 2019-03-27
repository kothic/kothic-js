'use strict';

const expect = require("chai").expect;
const mapcss = require("mapcss");

const CollisionBuffer = require("../../src/utils/collisions.js")

describe("CollisionBuffer", () => {
  describe("Box hit model", () => {
    const cb = new CollisionBuffer(1000, 1000);
    const id = 42;

    cb.addPointWH([100, 100], 25, 25, 10, id);

    it("no collision outside hit region", () => {
      expect(cb.checkPointWH([200, 200], 10, 10, 0)).to.be.false;
    });
    it("collision inside hit region", () => {
      expect(cb.checkPointWH([100, 100], 10, 10, 0)).to.be.true;
    });
    it("no collision because same id", () => {
      expect(cb.checkPointWH([100, 100], 10, 10, id)).to.be.false;
    });

    it("no collision because on the edge", () => {
      expect(cb.checkPointWH([0, 100], 10, 10, id)).to.be.true;
      expect(cb.checkPointWH([100, 0], 10, 10, id)).to.be.true;
      expect(cb.checkPointWH([0, 1000], 10, 10, id)).to.be.true;
      expect(cb.checkPointWH([1000, 0], 10, 10, id)).to.be.true;
    });
  });

  describe("Bulk load", () => {
    const cb = new CollisionBuffer(1000, 1000);
    const id = 42;

    cb.addPoints([[[100, 100], 25, 25, 10, id], [[150, 150], 25, 25, 10, id + 1]]);

    it("collision inside hit region", () => {
      expect(cb.checkPointWH([100, 100], 10, 10, 0)).to.be.true;
      expect(cb.checkPointWH([140, 140], 10, 10, 0)).to.be.true;
      expect(cb.checkPointWH([200, 200], 10, 10, 0)).to.be.false;
    });
  });
});

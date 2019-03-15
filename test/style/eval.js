'use strict';

const expect = require("chai").expect;
const mapcss = require("mapcss");
var rewire = require("rewire");

const evaluate = rewire("../../src/style/eval");

function evalExpr(str) {
  const ast = mapcss.parse("way { a: eval(" + str + "); }");
  return ast[0].actions[0].v.v;
}

describe("Eval", () => {
  describe("Arithmetics", () => {
    it("+", () => {
      expect(evaluate.evalExpr(evalExpr("2 + 3"))).to.be.equal(5);
    });
    it("-", () => {
      expect(evaluate.evalExpr(evalExpr("2 - 3"))).to.be.equal(-1);
    });
    it("*", () => {
      expect(evaluate.evalExpr(evalExpr("2 * 3"))).to.be.equal(6);
    });
    it("/", () => {
      expect(evaluate.evalExpr(evalExpr("2 / 3"))).to.be.equal(2.0/3);
    });
  });

  describe("Known tags", () => {
    it("tag() function", () => {
      const tags = {};
      evaluate.appendKnownTags(tags, evalExpr('tag("name")'));
      expect(tags).to.have.property('name', 'kv');
    });
  });
});

'use strict';

const expect = require("chai").expect;
const mapcss = require("mapcss");
var rewire = require("rewire");

const rules = rewire("../../src/style/rules");

const formatCssColor = rules.__get__("formatCssColor");

function expr(str) {
  return mapcss.parse(str);
}

describe("Rules", () => {
  describe("Known Tags", () => {
    it("empty rules", () => {
      expect(rules.listKnownTags([])).to.be.an('Object').that.is.empty;
    });

    it("tag presence", () => {
      const ast = mapcss.parse("way[ele]{}");
      expect(rules.listKnownTags(ast)).to.have.property('ele', 'k')
    });

    it("text tag", () => {
      const ast = mapcss.parse("way {text: ele;}");
      expect(rules.listKnownTags(ast)).to.have.property('ele', 'kv')
    });

    it("tag() in eval", () => {
      const ast = mapcss.parse('way {text: eval(tag("ele"));}');
      expect(rules.listKnownTags(ast)).to.have.property('ele', 'kv')
    });

    it("localize() in eval", () => {
      const ast = mapcss.parse('way {text: eval(localize("name"));}');
      const tags = rules.listKnownTags(ast, ['en', 'de']);
      expect(tags).to.have.property('name', 'kv');
      expect(tags).to.have.property('name:en', 'kv');
      expect(tags).to.have.property('name:de', 'kv');
    });

    it("no actions with tags access", () => {
      const ast = mapcss.parse('way {color: red;}');
      expect(rules.listKnownTags(ast)).to.be.an('Object').that.is.empty;
    });
  });

  describe("CSS color", () => {
    it("RGB", () => {
      expect(formatCssColor({r: 1, g: 2, b: 3})).to.be.equal("rgb(1, 2, 3)");
    });
    it("RGBA", () => {
      expect(formatCssColor({r: 1, g: 2, b: 3, a: 0.5})).to.be.equal("rgba(1, 2, 3, 0.5)");
    });
    it("HSL", () => {
      expect(formatCssColor({h: 1, s: 2, l: 3})).to.be.equal("hsl(1, 2, 3)");
    });
    it("HSLA", () => {
      expect(formatCssColor({h: 1, s: 2, l: 3, a: 0.5})).to.be.equal("hsla(1, 2, 3, 0.5)");
    });

    it("Unknown color space", () => {
      expect(() => formatCssColor({eXe: true})).to.throw(TypeError, /Unexpected color space.*eXe/)
    });
  });

  describe("apply()", () => {
    it("Default layer", () => {
      expect(rules.apply(expr("node {} way { color: red; }"), {}, [], 10, 'LineString', []))
        .to.have.deep.property('default', {color: 'red'})
    });

    it("Custom layer", () => {
      expect(rules.apply(expr("way::outline { color: red; }"), {}, [], 10, 'LineString', []))
        .to.have.deep.property('outline', {color: 'red'})
    });

    it("Multiple layers layer", () => {
      const res = rules.apply(expr("way, way::outline { color: red; }"), {}, [], 10, 'LineString', []);
      expect(res).to.have.deep.property('outline', {color: 'red'});
      expect(res).to.have.deep.property('default', {color: 'red'});
    });

    it("Rules overlay", () => {
      const res = rules.apply(expr("way {color: #fff; width: 1;} way { color: red; }"), {}, [], 10, 'LineString', []);
      expect(res).to.have.deep.property('default', {color: 'red', width: '1'});
    });
  });

  describe("Set statements", () => {
    it("Set class layer", () => {
      const classes = [];
      rules.apply(expr("way {set .minor_road;}"), {}, classes, 10, 'LineString', []);
      expect(classes).to.include("minor_road");
      rules.apply(expr("way {set .minor_road;}"), {}, classes, 10, 'LineString', []);
      expect(classes.length).to.be.equal(1);
    });

    it("Set class layer", () => {
      const tags = {};
      rules.apply(expr("way {set ford=yes;}"), tags, [], 10, 'LineString', []);
      expect(tags).to.have.property('ford', 'yes');
    });
  });

  describe("Exit statement", () => {
    it("Stop on exit;", () => {
      const res = rules.apply(expr("way {color: #fff; exit;} way { color: red; }"), {}, [], 10, 'LineString', []);
      expect(res).to.have.deep.property('default', {color: 'rgb(255, 255, 255)'});
    });
  });

  describe("Eval", () => {
    it("Support locales", () => {
      const tags = {'name': '北京', 'name:en': 'Beijing', 'name:de': 'Peking'}

      const res = rules.apply(expr('node {text: eval(localize("name"));}'), tags, [], 10, 'Point', ['de', 'en']);
      expect(res).to.have.deep.property('default', {text: 'Peking'});
    });
  });

  describe("Unexpected nodes in AST", () => {
    it("unexpected action type", () => {
      const ast = expr('node {text: "!";}');
      ast[0].actions[0].action = "uneXpected";
      expect(() => rules.apply(ast, {}, [], 10, 'Point', [])).to.throw(TypeError, /uneXpected/)
    });

    it("unexpected value type", () => {
      const ast = expr('node {text: "!";}');
      ast[0].actions[0].v.type = "uneXpected";
      expect(() => rules.apply(ast, {}, [], 10, 'Point', [])).to.throw(TypeError, /uneXpected/)
    });
  });
});

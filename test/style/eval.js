'use strict';

const expect = require("chai").expect;
const mapcss = require("mapcss");

const evaluate = require("../../src/style/eval");

function expr(str) {
  const ast = mapcss.parse("way { a: eval(" + str + "); }");
  return ast[0].actions[0].v.v;
}

describe("Eval", () => {
  describe("Expression", () => {
    it("Unexpected expression type", () => {
      expect(() => evaluate.evalExpr({'type': 'uneXpected'})).to.throw(TypeError, /uneXpected/);
    });

    it("Unexpected binary operator", () => {
      expect(() => evaluate.evalExpr({'type': 'binary_op', op: 'eXe', left: {type: 'number', value: 2}, right: {type: 'number', value: 2}})).to.throw(TypeError, /eXe/);
    });

    it("Unknown function", () => {
      expect(() => evaluate.evalExpr({'type': 'function', func: 'unkNown', args: []})).to.throw(Error, /Unexpected function in eval.*unkNown/);
    });
  });
  describe("Special functions", () => {
    it("More than one argument of tag() function", () => {
      expect(() => evaluate.evalExpr({'type': 'function', func: 'tag', args: [{type: 'number', value: 2}, {type: 'number', value: 2}]})).to.throw(Error, /one argument/);
    });

    it("More than one argument of prop() function", () => {
      expect(() => evaluate.evalExpr({'type': 'function', func: 'prop', args: [{type: 'number', value: 2}, {type: 'number', value: 2}]})).to.throw(Error, /one argument/);
    });

    it("tag() function", () => {
      expect(evaluate.evalExpr(expr('tag("ford")'), {ford: 'yes'})).is.equal('yes');
      expect(evaluate.evalExpr(expr('tag("ford")'), {})).is.equal('');
    });

    it("prop() function", () => {
      expect(evaluate.evalExpr(expr('prop("color")'), {}, {color: '#ff0000'})).is.equal('#ff0000');
      expect(evaluate.evalExpr(expr('prop("color")'), {}, {})).is.equal('');
    });

    it("localize() function", () => {
      expect(evaluate.evalExpr(expr('localize("name")'), {}, {}, ['ru', 'en'])).is.equal('');
      expect(evaluate.evalExpr(expr('localize("name")'), {'name': '北京'}, {}, ['de', 'en'])).is.equal('北京');
      expect(evaluate.evalExpr(expr('localize("name")'), {'name': '北京', 'name:en': 'Beijing'}, {}, ['de', 'en'])).is.equal('Beijing');
      expect(evaluate.evalExpr(expr('localize("name")'), {'name': '北京', 'name:en': 'Beijing', 'name:de': 'Peking'}, {}, ['de', 'en'])).is.equal('Peking');
    });

    it("more then one argument od localize() function", () => {
      expect(() => evaluate.evalExpr(expr('localize("name", "alt_name")'))).to.throw(Error, /one argument/);
      expect(() => evaluate.evalExpr(expr('localize()'))).to.throw(Error, /one argument/);
    });
  });
  describe("Arithmetics", () => {
    it("+", () => {
      expect(evaluate.evalExpr(expr("2 + 3"))).to.be.equal(5);
    });
    it("-", () => {
      expect(evaluate.evalExpr(expr("2 - 3"))).to.be.equal(-1);
    });
    it("*", () => {
      expect(evaluate.evalExpr(expr("2 * 3"))).to.be.equal(6);
    });
    it("/", () => {
      expect(evaluate.evalExpr(expr("2 / 3"))).to.be.equal(2.0/3);
    });
  });

  describe("Known tags", () => {
    it("tag() function", () => {
      const tags = {};
      evaluate.appendKnownTags(tags, expr('tag("name")'));
      expect(tags).to.have.property('name', 'kv');
    });

    it("tag() function argument evaluation", () => {
      const tags = {};
      evaluate.appendKnownTags(tags, expr('tag(join("", "name", ":ru"))'));
      expect(tags).to.have.property('name:ru', 'kv');
    });

    it("no tag() in expression", () => {
      const tags = {};
      evaluate.appendKnownTags(tags, expr('tag()'));
      expect(tags).to.be.empty;
    });

    it("no arguments of tag()", () => {
      const tags = {};
      evaluate.appendKnownTags(tags, expr('"2" + 2'));
      expect(tags).to.be.empty;
    });

    it("unexpected expression type", () => {
      expect(() => evaluate.appendKnownTags({}, {'type': 'uneXpected'})).to.throw(TypeError, /uneXpected/);
    });
  });

  describe("Builtin functions", () => {
    it("min()", () => {
      expect(evaluate.evalExpr(expr('min(1, 3, 5, -1)'))).to.be.equal(-1);
    });

    it("max()", () => {
      expect(evaluate.evalExpr(expr('max(1, 3, 5, -1)'))).to.be.equal(5);
    });

    it("any()", () => {
      expect(evaluate.evalExpr(expr('any(tag("name"), tag("loc_name"))'), {loc_name: "Smithsville"}, {})).to.be.equal('Smithsville');
      expect(evaluate.evalExpr(expr('any(tag("name"), tag("loc_name"))'), {}, {})).to.be.equal('');
    });

    it("num()", () => {
      expect(evaluate.evalExpr(expr('num("2.9")'))).is.equal(2.9);
      expect(evaluate.evalExpr(expr('num("x")'))).is.equal(0);
    });

    it("str()", () => {
      expect(evaluate.evalExpr(expr('str(2)'))).is.equal('2');
    });

    it("int()", () => {
      expect(evaluate.evalExpr(expr('int("2")'))).is.equal(2);
      expect(evaluate.evalExpr(expr('int("2.7")'))).is.equal(2);
      expect(evaluate.evalExpr(expr('int("x")'))).is.equal(0);
    });

    it("sqrt()", () => {
      expect(evaluate.evalExpr(expr('sqrt(4)'))).is.equal(2);
    });

    it("cond()", () => {
      expect(evaluate.evalExpr(expr('cond(2 - 2)'))).is.false;
      expect(evaluate.evalExpr(expr('cond(2 + 2)'))).is.true;
      expect(evaluate.evalExpr(expr('cond(2 + 2, 1, 2)'))).is.equal(1);
    });

    it("metric()", () => {
      expect(evaluate.evalExpr(expr('metric("1")'))).is.equal(1.0);
      expect(evaluate.evalExpr(expr('metric("5km")'))).is.equal(5000);
      expect(evaluate.evalExpr(expr('metric("4dm")'))).is.equal(0.4);
      expect(evaluate.evalExpr(expr('metric("30cm")'))).is.equal(0.3);
      expect(evaluate.evalExpr(expr('metric("200 mm")'))).is.equal(0.2);
      expect(evaluate.evalExpr(expr('metric("2 in")'))).is.equal(0.0508);
      expect(evaluate.evalExpr(expr('metric("2 \\"")'))).is.equal(0.0508);
      expect(evaluate.evalExpr(expr('metric("2 ft")'))).is.equal(0.6096);
      expect(evaluate.evalExpr(expr('metric("2 \'")'))).is.equal(0.6096);
    });

    it("join()", () => {
      expect(evaluate.evalExpr(expr('join(",", 1, 2, 3)'))).is.equal("1,2,3");
      expect(evaluate.evalExpr(expr('join(",", list(1, 2, 3))'))).is.equal("1,2,3");
    });

    it("split()", () => {
      expect(evaluate.evalExpr(expr('split(",", "1,2,3")'))).is.deep.equal(['1', '2', '3']);
    });

    it("get()", () => {
      expect(evaluate.evalExpr(expr('get(list(1, 2, 3), 1)'))).is.equal(2);
      expect(evaluate.evalExpr(expr('get(list(1, 2, 3), "a")'))).is.equal('');
      expect(evaluate.evalExpr(expr('get("", 1)'))).is.equal('');
    });

    it("set()", () => {
      expect(evaluate.evalExpr(expr('set(list(1, 2, 3), 1, "foo")'))).is.deep.equal([1, 'foo', 3]);
      expect(evaluate.evalExpr(expr('set(list(1, 2, 3), "a", "foo")'))).is.deep.equal([1, 2, 3]);
      expect(evaluate.evalExpr(expr('set(list(1, 2, 3), 1)'))).is.deep.equal([1 ,undefined, 3]);
      expect(evaluate.evalExpr(expr('set("abc", 1, "x")'))).is.deep.equal("abc");
    });

    it("count()", () => {
      expect(evaluate.evalExpr(expr('count(list(1, 2, 3))'))).is.equal(3);
      expect(evaluate.evalExpr(expr('count("Lee highway")'))).is.equal(0);
    });

    it("append()", () => {
      expect(evaluate.evalExpr(expr('append(list(1, 2, 3), 4)'))).is.deep.equal([1, 2, 3, 4]);
      expect(evaluate.evalExpr(expr('append("", 4)'))).is.deep.equal([]);
    });

    it("contains()", () => {
      expect(evaluate.evalExpr(expr('contains(list(1, 2, 3), 4)'))).is.false;
      expect(evaluate.evalExpr(expr('contains("42", 4)'))).is.false;
      expect(evaluate.evalExpr(expr('contains(list(1, 2, 3), 3)'))).is.true;
    });

    it("sort()", () => {
      expect(evaluate.evalExpr(expr('sort(list(4, 2, 3, 1))'))).is.deep.equal([1, 2, 3, 4]);
      expect(evaluate.evalExpr(expr('sort("")'))).is.deep.equal([]);
    });

    it("reverse()", () => {
      expect(evaluate.evalExpr(expr('reverse(list(4, 3, 2, 1))'))).is.deep.equal([1, 2, 3, 4]);
      expect(evaluate.evalExpr(expr('reverse("")'))).is.deep.equal([]);
    });
  });
});

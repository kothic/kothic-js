'use strict';

const expect = require("chai").expect;

const rules = require("../../src/style/rules");
const mapcss = require("mapcss");

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

  it("tag in eval", () => {
    const ast = mapcss.parse('way {text: eval(tag("ele"));}');
    expect(rules.listKnownTags(ast)).to.have.property('ele', 'kv')
  });
});

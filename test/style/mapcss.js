'use strict';

const expect = require("chai").expect;

const matchers = require("../../src/style/matchers");

describe("MapCSS matchers", function() {
  it("zoom matcher complete range", function() {
    expect(matchers.matchZoom({type: 'z', begin: 6, end: 14}, 10)).to.be.true;
    expect(matchers.matchZoom({type: 'z', begin: 6, end: 14}, 16)).to.be.false;
    expect(matchers.matchZoom({type: 'z', begin: 6, end: 14}, 1)).to.be.false;
  });

  it("zoom matcher open end range", function() {
    expect(matchers.matchZoom({type: 'z', begin: 6}, 16)).to.be.true;
    expect(matchers.matchZoom({type: 'z', begin: 6}, 1)).to.be.false;
  });

  it("zoom matcher open start range", function() {
    expect(matchers.matchZoom({type: 'z', end: 14}, 16)).to.be.false;
    expect(matchers.matchZoom({type: 'z', end: 14}, 1)).to.be.true;
  });

  it("zoom matcher range edges", function() {
    expect(matchers.matchZoom({type: 'z', begin: 6, end: 14}, 6)).to.be.true;
    expect(matchers.matchZoom({type: 'z', begin: 6, end: 14}, 14)).to.be.true;
    expect(matchers.matchZoom({type: 'z', begin: 6}, 6)).to.be.true;
    expect(matchers.matchZoom({type: 'z', end: 14}, 14)).to.be.true;
  });

  it("zoom matcher null range", function() {
    expect(matchers.matchZoom(null, 6)).to.be.true;
  });

  it("type matcher 'way'", function() {
    expect(matchers.matchFeatureType('way', 'Point')).to.be.false;
    expect(matchers.matchFeatureType('way', 'LineString')).to.be.true;
    expect(matchers.matchFeatureType('way', 'Polygon')).to.be.true;
    expect(matchers.matchFeatureType('way', 'MultiPoint')).to.be.false;
    expect(matchers.matchFeatureType('way', 'MultiLineString')).to.be.true;
    expect(matchers.matchFeatureType('way', 'MultiPolygon')).to.be.true;
  });

  it("type matcher 'node'", function() {
    expect(matchers.matchFeatureType('node', 'Point')).to.be.true;
    expect(matchers.matchFeatureType('node', 'LineString')).to.be.false;
    expect(matchers.matchFeatureType('node', 'Polygon')).to.be.false;
    expect(matchers.matchFeatureType('node', 'MultiPoint')).to.be.true;
    expect(matchers.matchFeatureType('node', 'MultiLineString')).to.be.false;
    expect(matchers.matchFeatureType('node', 'MultiPolygon')).to.be.false;
  });

  it("type matcher 'line'", function() {
    expect(matchers.matchFeatureType('line', 'Point')).to.be.false;
    expect(matchers.matchFeatureType('line', 'LineString')).to.be.true;
    expect(matchers.matchFeatureType('line', 'Polygon')).to.be.false;
    expect(matchers.matchFeatureType('line', 'MultiPoint')).to.be.false;
    expect(matchers.matchFeatureType('line', 'MultiLineString')).to.be.true;
    expect(matchers.matchFeatureType('line', 'MultiPolygon')).to.be.false;
  });

  it("type matcher 'area'", function() {
    expect(matchers.matchFeatureType('area', 'Point')).to.be.false;
    expect(matchers.matchFeatureType('area', 'LineString')).to.be.false;
    expect(matchers.matchFeatureType('area', 'Polygon')).to.be.true;
    expect(matchers.matchFeatureType('area', 'MultiPoint')).to.be.false;
    expect(matchers.matchFeatureType('area', 'MultiLineString')).to.be.false;
    expect(matchers.matchFeatureType('area', 'MultiPolygon')).to.be.true;
  });

  it("type matcher '*'", function() {
    expect(matchers.matchFeatureType('*', 'Point')).to.be.true;
    expect(matchers.matchFeatureType('*', 'LineString')).to.be.true;
    expect(matchers.matchFeatureType('*', 'Polygon')).to.be.true;
    expect(matchers.matchFeatureType('*', 'MultiPoint')).to.be.true;
    expect(matchers.matchFeatureType('*', 'MultiLineString')).to.be.true;
    expect(matchers.matchFeatureType('*', 'MultiPolygon')).to.be.true;
  });

  it("attribute matcher, prsence test", function() {
    expect(matchers.matchAttribute({type: 'presence', key: 'ford'}, {ford: 'yes', depth: '0.5'})).to.be.true;
    expect(matchers.matchAttribute({type: 'presence', key: 'ford'}, {depth: '0.5'})).to.be.false;
  });

  it("attribute matcher, absence test", function() {
    expect(matchers.matchAttribute({type: 'absence', key: 'ford'}, {ford: 'yes', depth: '0.5'})).to.be.false;
    expect(matchers.matchAttribute({type: 'absence', key: 'ford'}, {depth: '0.5'})).to.be.true;
  });

  it("attribute matcher, compare '=' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'ford', op: '=', value: 'yes'}, {ford: 'yes', depth: '0.5'})).to.be.true;
    expect(matchers.matchAttribute({type: 'cmp', key: 'ford', op: '=', value: 'no'}, {ford: 'yes', depth: '0.5'})).to.be.false;
  });

  it("attribute matcher, compare '!=' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'ford', op: '!=', value: 'yes'}, {ford: 'yes', depth: '0.5'})).to.be.false;
    expect(matchers.matchAttribute({type: 'cmp', key: 'ford', op: '!=', value: 'no'}, {ford: 'yes', depth: '0.5'})).to.be.true;
  });

  it("attribute matcher, compare '<' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '<', value: '1'}, {ford: 'yes', depth: '0.5'})).to.be.true;
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '<', value: '0.1'}, {ford: 'yes', depth: '0.5'})).to.be.false;
  });

  it("attribute matcher, compare '>' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '>', value: '0.1'}, {ford: 'yes', depth: '0.5'})).to.be.true;
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '>', value: '1'}, {ford: 'yes', depth: '0.5'})).to.be.false;
  });

  it("attribute matcher, compare '<=' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '<=', value: '0.5'}, {ford: 'yes', depth: '0.5'})).to.be.true;
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '<=', value: '0.4'}, {ford: 'yes', depth: '0.5'})).to.be.false;
  });

  it("attribute matcher, compare '>=' test", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '>=', value: '0.6'}, {ford: 'yes', depth: '0.5'})).to.be.false;
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '>=', value: '0.5'}, {ford: 'yes', depth: '0.5'})).to.be.true;
  });

  it("attribute matcher, NaN in numeric context", function() {
    expect(matchers.matchAttribute({type: 'cmp', key: 'depth', op: '>', value: '1'}, {ford: 'yes', depth: 'over_nine_thousands'})).to.be.false;
  });

  it("attribute matcher, regexp test", function() {
    expect(matchers.matchAttribute({type: 'regexp', key: 'ford', op: '=~', value: {regexp: '^\\w+$', flags: 'g'}}, {ford: 'yes'})).to.be.true;
    expect(matchers.matchAttribute({type: 'regexp', key: 'ford', op: '=~', value: {regexp: '^\\d+$', flags: ''}}, {ford: 'yes'})).to.be.false;
  });
});

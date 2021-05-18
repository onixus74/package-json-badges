"use strict";

const assert = require("assert");
const { semverVersionColor } = require("./formatters");

describe("semverVersionColor", function () {
  it("generates correct colors for versions", function () {
    const testCases = [
      ["1.0.1", "blue"],
      ["v2.1.6", "blue"],
      ["1.0.1+abcd", "blue"],
      ["1.0.1-rc1", "orange"],
      ["1.0.0-Beta", "orange"],
      ["1.1.0-alpha", "orange"],
      ["6.0.0-SNAPSHOT", "orange"],
      ["1.0.1-dev", "orange"],
      ["2.1.6-prerelease", "orange"],
      ["2.1.6-b1", "orange"],
      ["0.1.0", "orange"],
      ["v0.1.0", "orange"],
      ["v2.1.6-b1", "orange"],
      ["0.1.0+abcd", "orange"],
      ["2.1.6-b1+abcd", "orange"],
      ["0.0.0", "orange"],
      [0.1, "lightgrey"],
      ["0.9", "lightgrey"],
      ["1.0", "lightgrey"],
      ["v1", "lightgrey"],
      [9, "lightgrey"],
      [1.0, "lightgrey"],
      [true, "lightgrey"],
      [null, "lightgrey"],
      ["2.1.6b1", "lightgrey"],
      ["cheese", "lightgrey"],
    ];
    for (const testCase of testCases) {
      assert.strictEqual(
        semverVersionColor(testCase[0]),
        testCase[1],
        testCase[0] //message
      );
    }
  });
});

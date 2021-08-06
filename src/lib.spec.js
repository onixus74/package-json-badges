"use strict";

const assert = require("assert");
const {
  PackageJsonLicense,
  PackageJsonNodeVersion,
  PackageJsonVersion,
  getAction,
} = require("./lib");

describe("PackageJsonLicense", function () {
  it("throws if license is missing", async function () {
    const stub = new PackageJsonLicense();
    stub.fetch = () => ({});
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.license' property",
    });
  });

  it("renders if file is valid", async function () {
    const stub = new PackageJsonLicense();
    stub.fetch = () => ({ license: "MIT" });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, { message: "MIT", messageColor: "blue" });
  });
});

describe("PackageJsonVersion", function () {
  it("throws if version is missing", async function () {
    const stub = new PackageJsonVersion();
    stub.fetch = () => ({});
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.version' property",
    });
  });

  it("renders if file is valid (stable release)", async function () {
    const stub = new PackageJsonVersion();
    stub.fetch = () => ({ version: "1.0.1" });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, { message: "v1.0.1", messageColor: "blue" });
  });

  it("renders if file is valid (pre release)", async function () {
    const stub = new PackageJsonVersion();
    stub.fetch = () => ({ version: "0.2.3" });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, {
      message: "v0.2.3",
      messageColor: "orange",
    });
  });
});

describe("PackageJsonNodeVersion", function () {
  it("throws if engines.node is missing", async function () {
    const stub = new PackageJsonNodeVersion();
    const responses = [{}, { engines: {} }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message: "package.json does not contain '.engines.node' property",
      });
    }
  });

  it("renders if file is valid", async function () {
    const stub = new PackageJsonNodeVersion();
    stub.fetch = () => ({ engines: { node: "^12.18.3" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, {
      message: "^12.18.3",
      messageColor: "blue",
    });
  });

  it("strips whitespace from ranges", async function () {
    const stub = new PackageJsonNodeVersion();
    stub.fetch = () => ({ engines: { node: ">= 12, <14" } });
    const badge = await stub.render();
    assert.deepStrictEqual(badge, {
      message: ">=12,<14",
      messageColor: "blue",
    });
  });
});

describe("getAction", function () {
  afterEach(function () {
    delete process.env["INPUT_INTEGRATION"];
  });

  it("Returns the correct action class with expected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "license";
    assert.strictEqual(getAction(), PackageJsonLicense);

    process.env["INPUT_INTEGRATION"] = "node-version";
    assert.strictEqual(getAction(), PackageJsonNodeVersion);

    process.env["INPUT_INTEGRATION"] = "version";
    assert.strictEqual(getAction(), PackageJsonVersion);
  });

  it("Throws an exception with unexpected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "invalid";
    assert.throws(() => getAction(), {
      name: "Error",
      message: "integration must be one of (license,node-version,version)",
    });
  });
});

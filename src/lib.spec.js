"use strict";

const assert = require("assert");
const {
  PackageJsonLicense,
  PackageJsonNodeVersion,
  PackageJsonVersion,
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
    assert.deepStrictEqual({ message: "MIT", messageColor: "blue" }, badge);
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
    assert.deepStrictEqual({ message: "v1.0.1", messageColor: "blue" }, badge);
  });

  it("renders if file is valid (pre release)", async function () {
    const stub = new PackageJsonVersion();
    stub.fetch = () => ({ version: "0.2.3" });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { message: "v0.2.3", messageColor: "orange" },
      badge
    );
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
    assert.deepStrictEqual(
      { message: "^12.18.3", messageColor: "blue" },
      badge
    );
  });
});

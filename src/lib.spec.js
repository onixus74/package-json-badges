"use strict";

const assert = require("assert");
const {
  PackageJsonLicense,
  PackageJsonNodeVersion,
  PackageJsonVersion,
} = require("./lib");

describe("PackageJsonLicense", function () {
  it("throws if license is missing", async function () {
    class PackageJsonLicenseStub extends PackageJsonLicense {
      fetch() {
        return {};
      }
    }
    const stub = new PackageJsonLicenseStub();
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.license' property",
    });
  });

  it("renders if file is valid", async function () {
    class PackageJsonLicenseStub extends PackageJsonLicense {
      fetch() {
        return { license: "MIT" };
      }
    }
    const stub = new PackageJsonLicenseStub();
    const badge = await stub.render();
    assert.deepStrictEqual({ message: "MIT", messageColor: "blue" }, badge);
  });
});

describe("PackageJsonVersion", function () {
  it("throws if license is missing", async function () {
    class PackageJsonVersionStub extends PackageJsonVersion {
      fetch() {
        return {};
      }
    }
    const stub = new PackageJsonVersionStub();
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.version' property",
    });
  });

  it("renders if file is valid (stable release)", async function () {
    class PackageJsonVersionStub extends PackageJsonVersion {
      fetch() {
        return { version: "1.0.1" };
      }
    }
    const stub = new PackageJsonVersionStub();
    const badge = await stub.render();
    assert.deepStrictEqual({ message: "v1.0.1", messageColor: "blue" }, badge);
  });

  it("renders if file is valid (pre release)", async function () {
    class PackageJsonVersionStub extends PackageJsonVersion {
      fetch() {
        return { version: "0.2.3" };
      }
    }
    const stub = new PackageJsonVersionStub();
    const badge = await stub.render();
    assert.deepStrictEqual(
      { message: "v0.2.3", messageColor: "orange" },
      badge
    );
  });
});

describe("PackageJsonNodeVersion", function () {
  it("throws if engines is missing", async function () {
    class PackageJsonNodeVersionStub extends PackageJsonNodeVersion {
      fetch() {
        return {};
      }
    }
    const stub = new PackageJsonNodeVersionStub();
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.engines.node' property",
    });
  });

  it("throws if engines.node is missing", async function () {
    class PackageJsonNodeVersionStub extends PackageJsonNodeVersion {
      fetch() {
        return { engines: {} };
      }
    }
    const stub = new PackageJsonNodeVersionStub();
    await assert.rejects(stub.render(), {
      name: "Error",
      message: "package.json does not contain '.engines.node' property",
    });
  });

  it("renders if file is valid", async function () {
    class PackageJsonNodeVersionStub extends PackageJsonNodeVersion {
      fetch() {
        return { engines: { node: "^12.18.3" } };
      }
    }
    const stub = new PackageJsonNodeVersionStub();
    const badge = await stub.render();
    assert.deepStrictEqual(
      { message: "^12.18.3", messageColor: "blue" },
      badge
    );
  });
});

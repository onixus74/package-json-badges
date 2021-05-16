"use strict";

const { promises: fs } = require("fs");
const core = require("@actions/core");
const { BaseAction, invoke } = require("@action-badges/core");

const ignoredVersionPatterns = /^[^0-9]|[0-9]{4}-[0-9]{2}-[0-9]{2}/;
function addv(version) {
  version = `${version}`;
  if (version.startsWith("v") || ignoredVersionPatterns.test(version)) {
    return version;
  } else {
    return `v${version}`;
  }
}

function versionColor(version) {
  if (typeof version !== "string" && typeof version !== "number") {
    throw new Error(`Can't generate a version color for ${version}`);
  }
  version = `${version}`;
  let first = version[0];
  if (first === "v") {
    first = version[1];
  }
  if (first === "0" || /alpha|beta|snapshot|dev|pre/i.test(version)) {
    return "orange";
  } else {
    return "blue";
  }
}

class PackageJsonLicense extends BaseAction {
  get label() {
    return "license";
  }

  async fetch() {
    return JSON.parse(await fs.readFile("./package.json", "utf8"));
  }

  async validate(packageJson) {
    if (packageJson.license) {
      return packageJson;
    }
    throw new Error("package.json does not contain '.license' property");
  }

  async render() {
    const packageJson = await this.validate(await this.fetch());
    return {
      message: packageJson.license,
      messageColor: "blue",
    };
  }
}

class PackageJsonVersion extends BaseAction {
  get label() {
    return "version";
  }

  async fetch() {
    return JSON.parse(await fs.readFile("./package.json", "utf8"));
  }

  async validate(packageJson) {
    if (packageJson.version) {
      return packageJson;
    }
    throw new Error("package.json does not contain '.version' property");
  }

  async render() {
    const packageJson = await this.validate(await this.fetch());
    return {
      message: addv(packageJson.version),
      messageColor: versionColor(packageJson.version),
    };
  }
}

class PackageJsonNodeVersion extends BaseAction {
  get label() {
    return "node";
  }

  async fetch() {
    return JSON.parse(await fs.readFile("./package.json", "utf8"));
  }

  async validate(packageJson) {
    if (packageJson.engines && packageJson.engines.node) {
      return packageJson;
    }
    throw new Error("package.json does not contain '.engines.node' property");
  }

  async render() {
    const packageJson = await this.validate(await this.fetch());
    return {
      message: packageJson.engines.node,
      messageColor: "blue",
    };
  }
}

async function run() {
  const integration = core.getInput("integration", { required: true });
  const validIntegrations = {
    license: PackageJsonLicense,
    "node-version": PackageJsonNodeVersion,
    version: PackageJsonVersion,
  };
  if (integration in validIntegrations) {
    return await invoke(validIntegrations[integration]);
  }
  core.setFailed(
    `integration must be one of (${Object.keys(validIntegrations)})`
  );
}

module.exports = {
  PackageJsonLicense,
  PackageJsonNodeVersion,
  PackageJsonVersion,
  run,
};

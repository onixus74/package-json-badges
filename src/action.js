"use strict";

const core = require("@actions/core");
const { invoke } = require("@action-badges/core");
const {
  PackageJsonLicense,
  PackageJsonNodeVersion,
  PackageJsonVersion,
} = require("./lib");

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

run();

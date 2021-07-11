import semver from "semver";

const ignoredVersionPatterns = /^[^0-9]|[0-9]{4}-[0-9]{2}-[0-9]{2}/;
function addv(version) {
  version = `${version}`;
  if (version.startsWith("v") || ignoredVersionPatterns.test(version)) {
    return version;
  } else {
    return `v${version}`;
  }
}

function semverVersionColor(version) {
  if (!semver.valid(version)) {
    return "lightgrey";
  }
  const parsedVersion = semver.parse(version);
  if (
    parsedVersion.prerelease.length ||
    parsedVersion.version.startsWith("0.")
  ) {
    return "orange";
  }
  return "blue";
}

export { addv, semverVersionColor };

# package-json-badges

[![Run tests](https://github.com/action-badges/package-json-badges/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/action-badges/package-json-badges/actions/workflows/test.yml)
[![Build Dist](https://github.com/action-badges/package-json-badges/actions/workflows/build-dist.yml/badge.svg?branch=main)](https://github.com/action-badges/package-json-badges/actions/workflows/build-dist.yml)

```yaml
name: Make package.json Badges
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Make version Badge
        uses: action-badges/package-json-badges@master
        with:
          file-name: package-version.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: version

      - name: Make license badge
        uses: action-badges/package-json-badges@master
        with:
          file-name: package-license.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: license

      - name: Make node version badge
        uses: action-badges/package-json-badges@master
        with:
          file-name: package-node-version.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: node-version
```

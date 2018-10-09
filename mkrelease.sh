#!/usr/bin/env bash

bash -c 'cd dist/ngforage && npm pack';
cp dist/ngforage/*.tgz dist.tgz
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

const fs = require('fs');

const mainVersion = require('../package.json').version;
const targetPkgJsonPath = require.resolve('../dist/ngforage/package.json');
const targetPkgJson = JSON.parse(fs.readFileSync(targetPkgJsonPath, 'utf8'));

targetPkgJson.version = mainVersion;

fs.writeFileSync(targetPkgJsonPath, JSON.stringify(targetPkgJson, null, 2));

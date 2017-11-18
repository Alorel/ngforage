const fs     = require('fs');
const {join} = require('path');

const cleanTmpConfigs = () => {
  fs.readdirSync(process.cwd(), 'utf8')
    .filter(f => f.endsWith('.tmp.js') || f.endsWith('.tmp.json'))
    .map(f => join(process.cwd(), f))
    .forEach(f => fs.unlinkSync(f));
};

cleanTmpConfigs();

process.once('exit', cleanTmpConfigs);

module.exports = cleanTmpConfigs;

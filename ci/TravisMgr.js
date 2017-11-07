/** @type {TravisMgr} */
const TravisMgr = (() => {
  const fs = require('fs');
  const {resolve, join} = require('path');
  
  class TravisMgr {
    
    /** @private */
    get root() {
      return resolve(__dirname, '..');
    }
    
    /** @private */
    get pkgJsonPath() {
      return join(this.root, 'package.json');
    }
    
    /** @private */
    get pkgJsonBak() {
      return join(this.root, 'package.json.bak');
    }
    
    backUp() {
      fs.copyFileSync(this.pkgJsonPath, this.pkgJsonBak);
    }
    
    restore() {
      fs.unlinkSync(this.pkgJsonPath);
      fs.renameSync(this.pkgJsonBak, this.pkgJsonPath);
    }
    
    get CI_NG_VERSION() {
      return process.env.CI_NG_VERSION;
    }
    
    get matVersion() {
      if (this.CI_NG_VERSION === '4') {
        return '^2.0.0-beta.12';
      }
    }
    
    get ngVersion() {
      if (this.CI_NG_VERSION === '4') {
        return '^4.4';
      }
    }
    
    /** @private */
    get pkgJsonContents() {
      return JSON.parse(fs.readFileSync(this.pkgJsonPath, 'utf8'));
    }
    
    /** @private */
    writePkgJson(json) {
      return fs.writeFileSync(this.pkgJsonPath, JSON.stringify(json, null, 2));
    }
    
    /** @private */
    get keys() {
      return [
        'dependencies',
        'peerDependencies',
        'devDependencies'
      ];
    }
    
    writeMat() {
      const json = this.pkgJsonContents;
      for (const k of this.keys) {
        for (const pkgName of Object.keys(json[k])) {
          if (pkgName === '@angular/material' || pkgName === '@angular/cdk') {
            json[k][pkgName] = this.matVersion;
          }
        }
      }
      
      this.writePkgJson(json);
    }
    
    writeNg() {
      const json = this.pkgJsonContents;
      for (const k of this.keys) {
        for (const pkgName of Object.keys(json[k])) {
          if (pkgName.startsWith('@angular') && pkgName !== '@angular/material' && pkgName !== '@angular/cdk') {
            json[k][pkgName] = this.ngVersion;
          }
        }
      }
      
      this.writePkgJson(json);
    }
  }
  
  return new TravisMgr();
})();

const cmd = (process.argv[2] || '').trim().toLowerCase();

console.log(`CI_NG_VERSION: ${TravisMgr.CI_NG_VERSION}`);
console.log(`Cmd: ${cmd}`);

switch (cmd) {
  case '':
    console.error('No cmd');
    process.exit(1);
    break;
  case 'backup':
    TravisMgr.backUp();
    break;
  case 'restore':
    TravisMgr.restore();
    break;
  case 'set-version':
    if (TravisMgr.matVersion) {
      console.log(`Setting material version to ${TravisMgr.matVersion}`);
      TravisMgr.writeMat();
    } else {
      console.log(`Skipping material version replacement`);
    }
    
    if (TravisMgr.ngVersion) {
      console.log(`Setting ng version to ${TravisMgr.ngVersion}`);
      TravisMgr.writeNg();
    } else {
      console.log(`Skipping ng version replacement`);
    }
    break;
  default:
    console.error(`Unknown cmd: ${cmd}`);
    process.exit(1);
}

if (!cmd) {
  console.error('No cmd');
  process.exit(1);
}
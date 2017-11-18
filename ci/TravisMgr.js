const fs              = require('fs');
const {join, resolve} = require('path');

/** @type {TravisMgr} */
const TravisMgr = (() => {
  
  class TravisMgr {
    
    get CI_NG_VERSION() {
      return process.env.CI_NG_VERSION;
    }
    
    /** @private */
    get keys() {
      return [
        'dependencies',
        'peerDependencies',
        'devDependencies'
      ];
    }
    
    get matVersion() {
      if (this.CI_NG_VERSION === '4') {
        return '^2.0.0-beta.12';
      }
      
      return '^5.0.0-rc0';
    }
    
    get ngVersion() {
      if (this.CI_NG_VERSION === '4') {
        return '^4.4';
      }
      
      return '^5.0';
    }
    
    get pkgDesc() {
      if (this.CI_NG_VERSION === '4') {
        return 'localForage bindings for Angular 4';
      }
      
      return 'localForage bindings for Angular 5';
    }
    
    /** @private */
    get pkgJsonBak() {
      return join(this.root, 'package.json.bak');
    }
    
    get pkgJsonContents() {
      return JSON.parse(fs.readFileSync(this.pkgJsonPath, 'utf8'));
    }
    
    /** @private */
    get pkgJsonPath() {
      return join(this.root, 'package.json');
    }
    
    get pkgName() {
      if (this.CI_NG_VERSION === '4') {
        return '@ngforage/ngforage-ng4';
      }
      
      return '@ngforage/ngforage-ng5';
    }
    
    get readmeBakPath() {
      return join(this.root, 'README.md.bak');
    }
    
    /** @private */
    get readmeContents() {
      return fs.readFileSync(this.readmePath, 'utf8');
    }
    
    /** @private */
    get readmePath() {
      return join(this.root, 'README.md');
    }
    
    /** @private */
    get root() {
      return resolve(__dirname, '..');
    }
    
    /** @private */
    get version() {
      return this.pkgJsonContents.version;
    }
    
    backUpPkg() {
      fs.copyFileSync(this.pkgJsonPath, this.pkgJsonBak);
    }
    
    backUpReadme() {
      fs.copyFileSync(this.readmePath, this.readmeBakPath);
    }
    
    restorePkg() {
      fs.renameSync(this.pkgJsonBak, this.pkgJsonPath);
    }
    
    restoreReadme() {
      fs.renameSync(this.readmeBakPath, this.readmePath);
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
    
    writeNameDesc() {
      const json = this.pkgJsonContents;
      
      json.name        = this.pkgName;
      json.description = this.pkgDesc;
      
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
    
    /** @private */
    writePkgJson(json) {
      return fs.writeFileSync(this.pkgJsonPath, JSON.stringify(json, null, 2));
    }
  }
  
  return new TravisMgr();
})();

function isKnownCommand(cmd) {
  return [
    'set-version'
  ].includes(cmd);
}

console.log(`CI_NG_VERSION: ${TravisMgr.CI_NG_VERSION || '<not set>'}`);

const cmds = process.argv.slice(2).filter(cmd => !!cmd)
                    .map(cmd => {
                      if (!isKnownCommand(cmd)) {
                        console.error(`Unknown cmd: ${cmd}`);
                        process.exit(1);
                      }
                      return cmd;
                    });

if (!cmds.length) {
  console.error('No commands to run');
  process.exit(1);
}

for (const cmd of cmds) {
  console.log(`Running ${cmd}`);
  switch (cmd) {
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
      
      if (!TravisMgr.pkgName || !TravisMgr.pkgDesc) {
        console.error('pkgName/pkgDesc absent');
        process.exit(1);
      } else {
        console.log(`Setting package name to ${TravisMgr.pkgName}`);
        console.log(`Setting package description to ${TravisMgr.pkgDesc}`);
        TravisMgr.writeNameDesc();
      }
      
      console.log(require('util').inspect(TravisMgr.pkgJsonContents, {colors: true, depth: null}));
      break;
  }
}

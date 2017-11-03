const tmp = require('tmp');
const fs = require('fs');
const {relative} = require('path');

const privates = new WeakMap();
const MODE = require('./compile-mode');

class TsConfigFactory {

  constructor(mode) {
    privates.set(this, {mode});
  }

  get mode() {
    return privates.get(this).mode;
  }

  get target() {
    return this.mode === MODE.DIST_ESM2015 ? 'es2015' : 'es5';
  }

  get declaration() {
    return this.mode === MODE.DIST_ESM2015;
  }

  get files() {
    switch (this.mode) {
      case MODE.DIST_UMD:
        return ['./src/index.ts'];
      case MODE.DIST_ESM2015:
      case MODE.DIST_ESM5:
        return ['./.tmp/src-inlined-templates/index.ts'];
      case MODE.DEMO_JIT:
        return ['./src/demo./demo.ts'];
      case MODE.DEMO_PRE_AOT:
        return ['.tmp/pre-aot/demo/demo.ts'];
      case MODE.DEMO_AOT:
        return ['./src/demo./demo.aot.ts'];
    }
  }

  get include() {
    if (this.mode === MODE.TEST) {
      return 'src/**/*.ts';
    }
  }

  get rootDir() {
    switch (this.mode) {
      case MODE.DIST_ESM5:
      case MODE.DIST_ESM2015:
        return "./.tmp/src-inlined-templates";
      case MODE.DIST_UMD:
      case MODE.DEMO_JIT:
        return './src';
      case MODE.DEMO_AOT:
        return '.';
      case MODE.DEMO_PRE_AOT:
        return './.tmp/pre-aot';
    }
  }

  get noEmit() {
    return [
      MODE.DIST_UMD,
      MODE.DEMO_PRE_AOT,
      MODE.DEMO_AOT,
      MODE.DEMO_JIT,
      MODE.TEST
    ].includes(this.mode);
  }

  get awesomeTypescriptLoaderOptions() {
    if ([MODE.DIST_UMD, MODE.DEMO_JIT, MODE.DEMO_AOT].includes(this.mode)) {
      const out = {useCache: true};

      switch (this.mode) {
        case MODE.DIST_UMD:
          out.cacheDirectory = '.awcache/umd';
          break;
        case MODE.DEMO_JIT:
          out.cacheDirectory = '.awcache/demo';
          break;
        case MODE.DEMO_AOT:
          out.cacheDirectory = '.awcache/aot';
          break;
      }

      return out;
    }

    return null;
  }

  get angularCompilerOptions() {
    if ([MODE.DIST_ESM2015, MODE.DIST_ESM5, MODE.DEMO_PRE_AOT].includes(this.mode)) {
      return {
        strictMetadataEmit: true,
        skipMetadataEmit: false,
        skipTemplateCodegen: this.mode !== MODE.DEMO_PRE_AOT,
        genDir: this.outDir
      };
    }

    return null;
  }

  get outDir() {
    switch (this.mode) {
      case MODE.DIST_ESM2015:
        return 'dist/esm2015';
      case MODE.DIST_ESM5:
        return 'dist/esm5';
      case MODE.DEMO_PRE_AOT:
        return './.tmp/aot';
    }

    return null;
  }

  get exclude() {
    const base = [
      ".tmp/src-inlined-templates/**/*.spec.ts",
      "**/node_modules",
      "**/.demo",
      "dist"
    ];

    if (this.mode === MODE.TEST) {
      base.push('src/demo');
    } else {
      base.push('src/**/*.spec.ts');
    }


    return base;
  }

  get conf() {
    const out = {
      "compilerOptions": {
        "module": "es2015",
        "target": this.target,
        "moduleResolution": "node",
        "noEmit": this.noEmit,
        "noUnusedLocals": true,
        "sourceMap": true,
        "declaration": this.declaration,
        "noImplicitUseStrict": true,
        "noImplicitAny": false,
        "newLine": "lf",
        "noFallthroughCasesInSwitch": true,
        "suppressImplicitAnyIndexErrors": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "removeComments": false,
        "importHelpers": true,
        "allowUnreachableCode": false,
        "allowUnusedLabels": false,
        "stripInternal": true,
        "lib": [
          "DOM",
          "ScriptHost",
          "ES5",
          "ES6",
          "ES7",
          "ES2015",
          "ES2016",
          "ES2017"
        ]
      },
      "exclude": this.exclude
    };

    if (this.rootDir) {
      out.rootDir = this.rootDir;
    }

    if (this.files) {
      out.files = this.files;
    } else if (this.include) {
      out.include = this.include;
    }

    if (this.outDir) {
      out.compilerOptions.outDir = this.outDir;
    }

    if (this.awesomeTypescriptLoaderOptions) {
      out.awesomeTypescriptLoaderOptions = this.awesomeTypescriptLoaderOptions;
    }

    if (this.angularCompilerOptions) {
      out.angularCompilerOptions = this.angularCompilerOptions;
    }

    return out;
  }

  get file() {
    const tmpObj = tmp.fileSync({
      discardDescriptor: true,
      postfix: '.tmp.json',
      dir: process.cwd(),
      keep: false
    });

    fs.writeFileSync(tmpObj.name, JSON.stringify(this.conf));

    return relative(process.cwd(), tmpObj.name);
  }
}

TsConfigFactory.MODE = MODE;

module.exports = TsConfigFactory;
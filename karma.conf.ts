import {set} from 'lodash';

// tslint:disable-next-line:no-default-export
export default config => {
  process.env.WEBPACK_COMPILE_MODE = require('./build/util/compile-mode').TEST;

  const reports = ['text-summary'];

  const finalConfig: any = {
    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: './',
    browserNoActivityTimeout: 30000,

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['detectBrowsers', 'jasmine'],

    // List of files to load in the browser.
    files: [
      'karma-test-entry.ts'
    ],

    // Preprocess matching files before serving them to the browser.
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'karma-test-entry.ts': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.config.js'),

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: {
      noInfo: true,
      // Use stats to turn off verbose output.
      stats: {
        chunks: false
      }
    },

    mime: {
      'text/x-typescript': ['ts']
    },

    coverageIstanbulReporter: {
      fixWebpackSourcePaths: true,
      reports
    },

    detectBrowsers: {
      plugins: [
        'karma-chrome-launcher',
        'karma-firefox-launcher'
      ],
      usePhantomJS: false,
      postDetection(availableBrowsers: string[]): string[] {
        if (!availableBrowsers || !availableBrowsers.length) {
          throw new Error('Please install Chrome/Firefox');
        }
        availableBrowsers = availableBrowsers.map((b: string) => b.toLowerCase());

        const out: string[] = [];

        if (availableBrowsers.indexOf('chrome') !== -1) {
          if (process.env.CI) {
            out.push('ChromeHeadlessTravis');
            set(
              finalConfig,
              'customLaunchers.ChromeHeadlessTravis',
              {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
              }
            );
          } else {
            out.push('ChromeHeadless');
          }
        }

        if (availableBrowsers.indexOf('firefox') !== -1) {
          set(
            finalConfig,
            'customLaunchers.FirefoxHeadless',
            {
              base: 'Firefox',
              flags: ['-headless']
            }
          );
          out.push('FirefoxHeadless');
        }

        if (!out.length) {
          throw new Error('Please install Chrome/Firefox');
        }

        return out;
      }
    },

    // Test results reporter to use.
    // Possible values: 'dots', 'progress'.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    // Level of logging
    // Possible values:
    // - config.LOG_DISABLE
    // - config.LOG_ERROR
    // - config.LOG_WARN
    // - config.LOG_INFO
    // - config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher

    browserConsoleLogOptions: {
      level: 'log',
      terminal: true
    },

    colors: true,

    singleRun: true
  };

  if (process.env.CI) {
    reports.push('lcovonly');
  } else {
    reports.push('html');
  }

  config.set(finalConfig);
};

module.exports = config => {
  const reports = ['text-summary'];

  const finalConfig = {
    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: './',
    browserNoActivityTimeout: 30000,

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // List of files to load in the browser.
    files: [
      'test.ts'
    ],

    // Preprocess matching files before serving them to the browser.
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test.ts': ['webpack']
    },

    webpack: require('./webpack.test.js'),

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

    // Test results reporter to use.
    // Possible values: 'dots', 'progress'.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    // Level of logging
    // Possible values:
    // - config.LOG_DISABLE
    // - config.LOG_ERROR
    // - config.LOG_WARN
    // - config.LOG_INFO
    // - config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browserConsoleLogOptions: {
      level: 'log',
      terminal: true
    },

    colors: true,

    singleRun: true,

    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },

    browsers: ['FirefoxHeadless']
  };

  if (process.env.CI) {
    reports.push('lcovonly');
    finalConfig.browsers.push('ChromeHeadlessTravis');
    finalConfig.customLaunchers.ChromeHeadlessTravis = {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    };
  } else {
    finalConfig.browsers.push('ChromeHeadless');
    reports.push('html');
  }

  config.set(finalConfig);

  // const reports = ['text-summary'];
  // const finalConfig = {
  //   basePath: '',
  //   browserNoActivityTimeout: 30000,
  //   frameworks: ['jasmine', '@angular/cli'],
  //   plugins: [
  //     require('karma-jasmine'),
  //     require('karma-chrome-launcher'),
  //     require('karma-firefox-launcher'),
  //     require('karma-jasmine-html-reporter'),
  //     require('karma-coverage-istanbul-reporter'),
  //     require('@angular/cli/plugins/karma')
  //   ],
  //   client: {
  //     clearContext: false // leave Jasmine Spec Runner output visible in browser
  //   },
  //   coverageIstanbulReporter: {
  //     reports,
  //     fixWebpackSourcePaths: true
  //   },
  //   angularCli: {
  //     environment: 'dev'
  //   },
  //   // reporters: ['progress', 'kjhtml'],
  //   reporters: ['progress', 'coverage-istanbul'],
  //   port: 9876,
  //   colors: true,
  //   logLevel: config.LOG_DEBUG,
  //   autoWatch: true,
  //   singleRun: true,
  //   browserConsoleLogOptions: {
  //     level: 'log',
  //     terminal: true
  //   },
  //   customLaunchers: {
  //     FirefoxHeadless: {
  //       base: 'Firefox',
  //       flags: ['-headless']
  //     }
  //   },
  //   browsers: ['FirefoxHeadless']
  // };
  //
  // if (process.env.CI) {
  //   reports.push('lcovonly');
  //   finalConfig.browsers.push('ChromeHeadlessTravis');
  //   finalConfig.customLaunchers.ChromeHeadlessTravis = {
  //     base: 'ChromeHeadless',
  //     flags: ['--no-sandbox']
  //   };
  // } else {
  //   finalConfig.browsers.push('ChromeHeadless');
  //   reports.push('html');
  // }
  //
  // config.set(finalConfig);
};

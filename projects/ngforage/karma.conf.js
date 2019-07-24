// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = config => {
  const reports = ['text-summary'];
  const finalConfig = {
    basePath: '',
    browserNoActivityTimeout: 30000,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      // require('karma-safari-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: reports,
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    browsers: [],
    singleRun: true,
    customLaunchers: {
    },
  };

  if (process.env.CI) {
    reports.push('lcovonly');
    finalConfig.plugins.push(require('karma-firefox-launcher'));
    finalConfig.browsers.push('ChromeHeadlessTravis', 'FirefoxHeadless');
    finalConfig.customLaunchers.ChromeHeadlessTravis = {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    };
    finalConfig.customLaunchers.FirefoxHeadless = {
      base: 'Firefox',
        flags: ['-headless']
    };
  } else {
    finalConfig.browsers.push('ChromeHeadless');
    reports.push('html');
  }

  config.set(finalConfig);
};

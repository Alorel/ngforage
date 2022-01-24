// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const reporters = [
    { type: 'text-summary' },
  ];
  const finalConfig = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngforage'),
      subdir: '.',
      reporters
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: true,
    restartOnFileChange: true,
    customLaunchers: {},
  };

  if (process.env.CI) {
    reporters.push({type: 'lcovonly'});
    finalConfig.browsers.push('ChromeHeadlessTravis');
    finalConfig.customLaunchers.ChromeHeadlessTravis = {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    };
  } else {
    finalConfig.browsers.push('ChromeHeadless');
    reporters.push({type: 'html'});
  }

  config.set(finalConfig);
};

module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'www/lib/ionic/js/ionic.bundle.js',
      './node_modules/angular-mocks/angular-mocks.js',
      'www/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};

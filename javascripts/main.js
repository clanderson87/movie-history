requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../lib/bower_components/jquery/dist/jquery.min',
    'lodash': '../lib/bower_components/lodash/lodash.min',
    'hbs': '../lib/bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap.min',
    'q': '../lib/bower_components/q/q'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
            exports: 'Firebase'
           }
  }
});

requirejs(
  ["jquery", "hbs", "bootstrap", "lodash", "q","getLogin"],
  function($, Handlebars, bootstrap, _, q, getLogin) {



  });
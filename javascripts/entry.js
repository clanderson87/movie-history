requirejs.config({
	baseUrl: "./javascripts",
	paths: {
		"jquery": "../lib/bower_components/jquery/dist/jquery.min",
		'lodash': '../bower_components/lodash/lodash.min',
		'firebase': '../bower_components/firebase/firebase',
		"hbs": "../lib/bower_components/require-handlebars-plugin/hbs",
		"bootstrap": "../lib/bower_components/bootstrap/dist/js/bootstrap.min"
	},
	shim : {
          "bootstrap" : ["jquery"],
          'firebase': {
            exports: 'Firebase'
    	     }
    	   }
});
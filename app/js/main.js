/**
 * This file is the RequireJS entry point. It is used to configure RequireJS and launch the App
 */

require.config({

	baseUrl: '',
	paths: {
		jquery: 'lib/bower/jquery/dist/jquery.min',
		underscore: 'lib/bower/underscore/underscore-min',
		backbone: 'lib/backbone/backbone-min',
		async : 'lib/bower/requirejs-plugins/src/async',
		goog : 'lib/bower/requirejs-plugins/src/goog',
		propertyParser : 'lib/bower/requirejs-plugins/src/propertyParser',
		text : 'lib/require-js/text'
	},
	shim: {
    'lib/bower/bootstrap-switch/dist/js/bootstrap-switch': {
        deps: ['jquery']
    },
    'lib/bower/bootstrap/dist/js/bootstrap.min': {
        deps: ['jquery']
    }
}

});

require([
	'js/app',
	'lib/bower/humane-js/humane.min',
	'jquery',
	'lib/bower/bootstrap-switch/dist/js/bootstrap-switch',
	'lib/bower/bootstrap/dist/js/bootstrap.min',
	'goog!visualization,1,packages:[corechart,geochart]' // Load the Google Chart API
], function(App, humane){

	// Globals
	humane.error = humane.spawn({ addnCls: 'humane-flatty-error', clickToClose: true, timeout: 0});
	humane.info = humane.spawn({ addnCls: 'humane-flatty-info', clickToClose: true, timeout: 5000});
	humane.warning = humane.spawn({ addnCls: 'humane-flatty-error', clickToClose: true, timeout: 5000});
	window.humane = humane;

	window.throwError = function(msg) {

		// Clear
		humane.remove();

		humane.error(msg);

		throw new Error(msg);
	};

	window.showMessage = function(msg) {

		// Clear
		humane.remove();

		humane.info(msg);
	};

	window.showWarning = function(msg) {

		// Clear
		humane.remove();

		humane.warning(msg);
	};

	// Console polyfill. In case console does not exist or does not have some methods
	if (!window.console) console = {};
	console.log = console.log || function(){};
	console.warn = console.warn || function(){};
	console.error = console.error || function(){};
	console.info = console.info || function(){};
	console.debug = console.debug || function(){};

	// Init app
	App.initialize();
});
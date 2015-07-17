var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/public/js',

	paths: {
        'test': '../../test',
		'templates': '/base/public/templates',

        'dynamictable': 'app/dynamictable',
        'deny': 'app/deny',
        'autocomplete': 'app/autoComplete',
        
        'jquery': '../../bower_components/jquery/dist/jquery.min',
        'backbone': '../../bower_components/backbone/backbone',
        'moment': '../../bower_components/moment/min/moment.min',
        'store': '../../bower_components/store/dist/store2.min',
        'underscore': '../../bower_components/underscore/underscore',
        'text': '../../bower_components/requirejs-text/text'
	},

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

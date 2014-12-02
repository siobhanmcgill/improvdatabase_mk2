require.config({
	baseUrl: '../js/libs',
	paths: {
		'views': '../views',
		'models': '../models',
		'collections': '../collections',
		'app': '../app',
		'templates': '../../templates',
        'dynamictable': '../app/dynamictable',
        'deny': '../app/deny',
        'autocomplete': '../app/autoComplete'
	},
	deps: ['app/router'],
	shim: {
        'backbone': {
			deps: ['jquery','underscore'],
            exports: 'Backbone'
		},
        'underscore': {
            exports: '_'
        }
	}
});

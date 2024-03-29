require.config({
	baseUrl: '/js',
	paths: {
		'templates': '../templates',
        'deny': 'app/deny',

        'jquery': '/bower_components/jquery/dist/jquery.min',
        'backbone': '/bower_components/backbone/backbone',
        'moment': '/bower_components/moment/min/moment.min',
        'store': '/bower_components/store/dist/store2.min',
        'underscore': '/bower_components/underscore/underscore',
        'text': '/bower_components/requirejs-text/text'
	},
	deps: ['app/router'],
    shim: {
        deny: {
            deps: ['app/autoComplete', 'app/dynamictable', 'app/dropdown', 'app/tooltip']
        }
    },
    stubModules: ['text']
});

var express = require('express'),
    http    = require('http'),
    hbs     = require('hbs'),
    path    = require('path'),
    
    routes  = require('./routes'),
    api    = require('./routes/api'),
    
    //for handlebars
    blocks  = {};

var app = express();

app.configure(function() {
    app.set('port', 1919);
    app.set('views', __dirname + "/views");
    app.set('view engine', 'hbs');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.json()).use(express.urlencoded());

    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.static(path.join(__dirname, 'public')));
});

// Handlebars helpers
hbs.registerHelper( 'extend', function( name, context ) {
    var block = blocks[name];
    if( !block ) {
        block = blocks[name] = [];
    }

    block.push( context.fn( this ) );
});

hbs.registerHelper( 'block', function( name ) {
    var val = ( blocks[name] || [] ).join( '\n' );

    // clear the block
    blocks[name] = [];
    return val;
});

app.use( '/bower_components', express.static( __dirname + '/bower_components' ) );

app.all( '/*', function( req, res, next ) {
    // Process preflight if it is OPTIONS request
    if( 'OPTIONS' === req.method ) {
        res.header( 'Access-Control-Allow-Origin', '*' );
        res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
        res.header( 'Access-Control-Allow-Headers', 'origin, x-requested-with, x-file-name, content-type, cache-control' );
        res.send( 203, 'No Content' );
    }

    next();
});

// ROUTES
app.get('/', routes.renderIndex);

//CRUD
app.post('/api/:op', api.create);
app.get('/api/:op', api.getAll);
app.get('/api/:op/:id', api.get);
app.put('/api/:op', api.update);
app.put('/api/:op/:id', api.update);
app.delete('/api/:op/:id', api.delete);
app.all('/api/:op/:id/:method', api.method);
app.all('/api/:op/:id/:method/:toId', api.method);

//app.get('/contentItems/portfolio', contentItems.getPortfolioItems);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

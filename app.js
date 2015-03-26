var express = require('express'),
    http    = require('http'),
    hbs     = require('hbs'),
    path    = require('path'),
    morgan  = require('morgan'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),

    routes  = require('./routes'),
    api    = require('./routes/api'),
    contact = require('./routes/contact'),

    config = require('./config')(),
    
    //for handlebars
    blocks  = {};

var app = express();

console.log('STUFF', process.env.NODE_ENV, process.env.REDISTOGO_URL);

app.set('port', config.port);
app.set('views', __dirname + "/views");
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));

app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use( '/bower_components', express.static( __dirname + '/bower_components' ) );

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

app.all( '/*', function( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'origin, x-requested-with, x-file-name, content-type, cache-control' );
    // Process preflight if it is OPTIONS request
    if( 'OPTIONS' === req.method ) {
        res.send( 203, 'No Content' );
    } else {
        next();
    }
});

// ROUTES
app.get('/', routes.renderIndex);

// AUTH
var auth = require('./auth');
app.post('/login', auth.login);
app.post('/logout', auth.logout);
app.post('/refreshToken', auth.checkToken, auth.refresh);
app.all('/api/*', auth.checkToken);

// CONTACT
app.post('/contact', contact.send);

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

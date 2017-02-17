var express = require('express'),
	app = express(),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorHandler'),
	mongoose = require('mongoose'),
	
	index = require('./routes/index'),
	users = require('./routes/users'),
	documents = require('./routes/documents'),

	debug = require('debug')('nodepad');
	env = app.get('env').trim();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'foo',
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified 
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handling middleware should be loaded after the loading the routes
if ('development' === env) {
	app.use(errorHandler());
}

app.use('/', index);
app.use('/users', users);
app.use('/documents', documents);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

//test
mongoose.connect('mongodb://localhost/nodepad');
var db = mongoose.connection;
debug('connected to localhost');
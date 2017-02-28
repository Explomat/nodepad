var express = require('express'),
	app = express(),
	session = require('express-session'),
	flash = require('connect-flash'),
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
	sessions = require('./routes/sessions'),
	
	User = require('./models/user'),
	
	debug = require('debug')('nodepad'),
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
	cookie: { maxAge: 6000 },
    secret: 'foo',
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified 
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(flash());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handling middleware should be loaded after the loading the routes
if ('development' === env) {
	app.use(errorHandler());
}

app.use((req, res, next) => {
	//res.locals.user = req.currentUser;
	console.log('user: ', req.currentUser);
	
	if (req.session && req.session.user_id){
		User.findById(req.session.user_id, function(err, user){
			if (user){
				req.currentUser = user;
				delete req.currentUser.password; 
				req.session.user_id = user.id;
				res.locals.user = user;
			}
			next();
		});
	}
	else {
		next();
	}
});

app.use('/', index);
app.use('/users', users);
app.use('/documents', documents);
app.use('/sessions', sessions);

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

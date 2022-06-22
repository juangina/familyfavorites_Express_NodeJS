var express = require('express');
var expressLayouts = require('express-ejs-layouts')
//var flash = require('connect-flash')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//This is a public route for non-authenitcated request objects
var {indexRouter, registrationRouter, loginRouter, contactRouter} = require('./routes/_public');
//This is a private route for authenticated request objects
var {dashboardRouter, triviaRouter, productsRouter, debugRouter, logoutRouter} = require('./routes/_private');

//Create the main application server
var app = express();

//view engine setup
//app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware get called for every request/route made to the server
//middleward will have access to the data/request objects from the client
app.use(express.static(path.join(__dirname, 'public')));

//Debug logger:  Outputs data related to the app session
app.use(logger('dev'));

//Express JSON parser: 
app.use(express.json());

//Express request body parser: Extracts objects from data series
//During a get and post http requests
app.use(express.urlencoded({ extended: false }));

//Express serial data parser:  Extract object from data series
//During a local file/file cache transfer
app.use(cookieParser());

//Express Session:  Needs research
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

//Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

//These are the public route paths for non-authenitcated request objects
app.use('/', indexRouter);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/contact', contactRouter);

//These are the public route paths for authenitcated request objects
app.use('/dashboard', dashboardRouter);
app.use('/trivia', triviaRouter);
app.use('/products', productsRouter);
app.use('/logout', logoutRouter);
app.use('/debug', debugRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

//Make the app module/object key: value pair be available for other files/modules
module.exports = app;

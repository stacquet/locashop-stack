// server.js

// modules =================================================
var express       	= require('express');
var app           	= express();
var bodyParser    	= require('body-parser');
var methodOverride	= require('method-override');
var mysql 			= require('mysql');
var cookieParser 	= require('cookie-parser');
var session      	= require('express-session');
var passport 		= require('passport');
var flash    		= require('connect-flash');
var async			= require('async');

global.winston 		= require('winston');

// configuration ===========================================
global.winston.add(winston.transports.File, { filename: 'logs/locashop.log' });
//winston.remove(winston.transports.Console);
global.winston.log('info','Hello distributed log files!');
// set our port
var port = process.env.PORT || 3000; 
  
// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

app.use(cookieParser()); // read cookies (needed for auth)
 //app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ 
	secret: 'thisisI' ,
	cookie : {
		maxAge: 2*3600*1000 // see below
	  }
	})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
require('./config/passport')(passport); // pass passport for configuration
	
// routes ==================================================
require('./app/routes')(app,passport); // configure our routes
// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
// server.js

// modules =================================================
var env       		= process.env.NODE_ENV || "development";
var express       	= require('express');
var Promise 		= require("bluebird");
var favicon			= require('serve-favicon');
var app           	= express();
var bodyParser    	= require('body-parser');
var methodOverride	= require('method-override');
var mysql 			= require('mysql');
var cookieParser 	= require('cookie-parser');
var session      	= require('express-session');
var passport 		= require('passport');
var SessionStore 	= require('express-mysql-session')
var flash    		= require('connect-flash');
var acl				= require('./app/controllers/aclController');
var slowness		= require('./app/util/slowness');
var config 			= require('./secret/config');
var logger			= require('./app/util/logger.js');
var models   		= require('./app/models/'); // will run index.js
var dataset			= require('./migration/dataset');

//Promise.promisifyAll(dataset);
logger.log('info','DB STARTING !');
models.sequelize.sync({force: true})
	.then(function(){
	
		return dataset.initData()
	})
	.then(function(){
			
		var options = {
			host: config.db_host,
			port: config.db_port,
			user: config.db_user,
			password: config.db_password,
			database: config.db_database,
			createDatabaseTable: false
		}
		var sessionStore = new SessionStore(options);


		logger.log('info','SERVER STARTING !');
		/*initDatabase.init(function(err,data){
			console.log('mig terminée');
		});*/
		var port = process.env.PORT || 3000; 


		// get all data/stuff of the body (POST) parameters
		// parse application/json 
		app.use(bodyParser.json()); 

		// parse application/vnd.api+json as json
		app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

		// parse application/x-www-form-urlencoded
		app.use(bodyParser.urlencoded({ extended: true })); 

		// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
		app.use(methodOverride('X-HTTP-Method-Override')); 
		// set the static files location /public/img will be /img for users
		app.use(express.static(__dirname + '/public'));
		app.use('/storage',express.static(__dirname+'/storage'));
		app.use(favicon(__dirname + '/public/favicon.ico')); 
		app.use(cookieParser()); // read cookies (needed for auth)
		 //app.use(bodyParser()); // get information from html forms

		// required for passport
		app.use(session({

			secret: 'thisisI' ,
			cookie : {
				maxAge: 2*3600*1000 // see below
			  },
			store: sessionStore
			})); // session secret
		app.use(passport.initialize());
		app.use(passport.session()); // persistent login sessions
		app.use(flash()); // use connect-flash for flash messages stored in session

		require('./config/passport')(passport); // pass passport for configuration

		// controles des accès aux modules de l'application en fonction du profil
		app.use(acl.acl);	
		// ralentissement volontaire pour mettre en avant l'asynchrone
		app.use(slowness.slow);
		// routes ==================================================
		require('./app/routes')(app,passport); // configure our routes
		// start app ===============================================
		// startup our app at http://localhost:8080
		app.listen(port);               

		// shoutout to the user                     
		logger.log('info','SERVER STARTED !');

		// expose app           
		exports = module.exports = app;    
	})
	.catch(function(err){
		console.log(err);
	})
	.finally(function(){
		console.log('END');
	});                     
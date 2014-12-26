// config/passport.js
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {
// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		console.log('serialize' + JSON.stringify(user));
		done(null, user.id);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		connection.query("select * from users where id = "+ id, function(err, rows){
			done(err, rows[0]);
		});
	});
	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use(
		'local-signup',
		new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			connection.query("select * from users where username = " + 
				connection.escape(email), function(err, rows) {
				if (err)
					return done(err);
				if (rows.length) {
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				} else {
				// if there is no user with that username
				// create the user
					var newUserMysql = {
						username: email,
						password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
					};
					var insertQuery = "INSERT INTO users ( username, password ) values (" + 
						connection.escape(newUserMysql.username) + "," + connection.escape(newUserMysql.password) + ")";
							connection.query(insertQuery,function(err, rows) {
						newUserMysql.id = rows.insertId;
						return done(null, newUserMysql);
					});
				}
			});
		})
	);
	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use(
		'local-login',
		new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) { // callback with email and password from our form
			console.log('trying to authenticate');
			connection.query("select * from users where username = "+ 
				connection.escape(email),function(err, rows){
				if (err)
					return done(err);
				if (!rows.length) {
					return done(null, false, req.flash('loginMessage', 'Nous ne connaissons pas votre email !')); // req.flash is the way to set flashdata using connect-flash
				}
				// if the user is found but the password is wrong
				if (!bcrypt.compareSync(password, rows[0].password))
					return done(null, false, req.flash('loginMessage', 'Le mot de passe est incorrect !')); // create the loginMessage and save it to session as flashdata
					// all is well, return successful user
					return done(null, rows[0]);
				});
		})
	);
};
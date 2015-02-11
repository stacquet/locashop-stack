// config/passport.js
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');
var configAuth = require('./auth');

var User = require('../app/services/user');

module.exports = function(passport) {
// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session
// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id_user);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		global.mysqlPool.query("select * from ref_user where id_user = "+ id, function(err, rows){
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
			global.mysqlPool.query("select * from ref_user where email = " + 
				global.mysqlPool.escape(email), function(err, rows) {
				if (err)
					return done(err);
				if (rows.length) {
					console.log('mail déjà pris');
					return done(null, false, req.flash('signupMessage', 'Cet email est déjà pris !'));
				} else {
				// if there is no user with that username
				// create the user
					var newUserMysql = {
						email: email,
						password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
					};
					var insertQuery = "INSERT INTO ref_user ( email, password, id_profil ) values (" + 
						global.mysqlPool.escape(newUserMysql.email) + "," + global.mysqlPool.escape(newUserMysql.password) + ",'P_CONSOMMATEUR')";
							global.mysqlPool.query(insertQuery,function(err, rows) {
						if(err) 
							//return done(null, false, req.flash('signupMessage', 'Erreur interne à l\' inscription'));
							return done(err);
						newUserMysql.id_user = rows.insertId;
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
			global.mysqlPool.query("select * from ref_user where email = "+ 
				global.mysqlPool.escape(email),function(err, rows){
				if (err)
					return done(err);
				if (!rows.length) {
					return done(null, false, req.flash('loginMessage', 'Email ou mot de passe incorrect')); // req.flash is the way to set flashdata using connect-flash
				}
				// if the user is found but the password is wrong
				if (!bcrypt.compareSync(password, rows[0].password))
					return done(null, false, req.flash('loginMessage', 'Email ou mot de passe incorrect')); // create the loginMessage and save it to session as flashdata
					// all is well, return successful user
					return done(null, rows[0]);
				});
		})
	);
	
	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebook',new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            global.mysqlPool.query("select * from ref_user where id_facebook = "+ 
				global.mysqlPool.escape(profile.id),function(err, rows){

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (rows.length>0) {
                    return done(null, rows[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
					var newUserMysql = {
						email: profile.emails[0].value,
						id_facebook : profile.id,
						prenom : profile.name.givenName,
						nom : profile.name.familyName,
						token : token
					};
					var insertQuery = "INSERT INTO ref_user ( email, id_facebook, id_profil,prenom,nom,token ) values (" + 
						global.mysqlPool.escape(newUserMysql.email) + "," + global.mysqlPool.escape(newUserMysql.id_facebook) + ",'P_CONSOMMATEUR',"+global.mysqlPool.escape(newUserMysql.prenom)
						+","+global.mysqlPool.escape(newUserMysql.nom)+","+global.mysqlPool.escape(newUserMysql.token)+")";
						console.log(insertQuery);
							global.mysqlPool.query(insertQuery,function(err, rows) {
						if(err) 
							//return done(null, false, req.flash('signupMessage', 'Erreur interne à l\' inscription'));
							return done(err);
						newUserMysql.id_user = rows.insertId;
						return done(null, newUserMysql);
					});
                }

            });
        });

    }));
};
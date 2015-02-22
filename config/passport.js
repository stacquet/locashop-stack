// config/passport.js
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');
var configAuth = require('./auth');
var models   		= require('../app/models/');

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
		console.log('deserializing user');
		models.User.find({where : {id_user : id }}).then(function(user){
			done(null, user.values);			
		})
		/*global.mysqlPool.query("select * from ref_user where id_user = "+ id, function(err, rows){
			done(err, rows[0]);
		});*/
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
			models.User.find({where : {email : email }}).then(function(user){
				if(user !==null)
					return done(null, false, req.flash('signupMessage', 'Cet email est déjà pris !'));
				// if there is no user with that username
				// create the user
					models.User.build({
						email: email,
						password: bcrypt.hashSync(password, null, null),
						id_profil : req.id_profil 
						// use the generateHash function in our user model
					}).save().then(function(user){
						//var newUser = user.reload();
						return done(null, user.dataValues);
					}).catch(function(err){
						return done(err);
					});

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
			//console.log('trying to authenticate');
			models.User.find({where : {email : email }}).then(function(user){
				if (user==null || (!bcrypt.compareSync(password, user.password)))
					return done(null, false, req.flash('loginMessage', 'Email ou mot de passe incorrect')); // create the loginMessage and save it to session as flashdata
					// all is well, return successful user
					return done(null, user);
				}).catch(function(err){
					return done(null, false, req.flash('loginMessage', 'Erreur interne à la connexion'));
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
            models.User.find({where : {id_facebook : profile.id }}).then(function(user){

                // if the user is found, then log them in
                if (user!==null)
                    return done(null, user); // user found, return that user
                    // if there is no user found with that facebook id, create them
					models.User.build({
						email: profile.emails[0].value,
						id_facebook : profile.id,
						prenom : profile.name.givenName,
						nom : profile.name.familyName,
						token : token,
						id_profil : 'P_CONSOMMATEUR'
						// use the generateHash function in our user model
					}).save().then(function(user){
						return done(null, user.dataValues);
					}).catch(function(err){
						return done(err);
					});
            });
        });

    }));
};
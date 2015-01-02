// app/routes.js

// grab the nerd model we just created
//var Nerd = require('./models/nerd');
var Inscription = require('./services/inscription');
var User = require('./services/user');
module.exports = function(app,passport) {
	
    // sample api route
    app.get('/api/producteurs', function(req, res) {
        
    });
   // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular request	
	
	app.post('/api/login/userInfo', function(req, res) {
			console.log(req.user);
			res.send(req.user);
	});
	
	// process the login form
	app.post('/api/auth/inscription/validate', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.send({'statut' : false, 'loginMessages' : req.flash('loginMessage')}); }
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
			return res.send({'statut' : true, 'user' : user});
		});
	  })(req, res, next);
	});
		
	app.post('/api/auth/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.send({'statut' : false, 'loginMessages' : req.flash('loginMessage')}); }
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
		  //return res.redirect('/users/' + user.username);
			res.send({'statut' : true, 'user' : req.user});
		});
	  })(req, res, next);
	});

	app.post('/api/inscription/checkEmailAvailable', function(req, res, next) {
		console.log(req.body.email);
		Inscription.checkEmailAvailable(req.body.email, function(data){
			res.send({"checkEmailAvailable" : data});
		});
	});	
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/api/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.sendfile('./public/views/index.html');
	});
	// process the signup form
	app.post('/api/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log("role "+req.user.role);
		if(req.user.role === "admin"){
			res.sendfile('./public/views/index.html');
			}
		else{
			res.sendfile('./public/views/producteurs.html');
		}
	});
	
	// =====================================
	// ADMIN SECTION =========================
	// =====================================
	// 
	app.get('/api/auth/users', function(req, res) {
		if(req.user) console.log("role "+req.user.role);
		/*if(req.user.role === "admin"){
			res.sendfile('./public/views/users.html');
			}
		else{
			res.sendfile('./public/views/index.html');
		}*/
		User.getUsersList(function(data,err){
			res.send(data);
			});
	});
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/api/logout', function(req, res) {
		req.logout();
		console.log('déconnexion');
		res.send({status : "ok"});
		});
		
	app.get('/search-box', function(req, res) {
		res.sendfile('./public/views/search-box.html');
	});
	
	app.get('*', function(req, res) {
		res.sendfile('./public/views/index.html');
	});
};

function isAuthorized(req, res, next){


}

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()){
		console.log('identifie !');
		return next();
	}
	console.log('non identifie !');

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
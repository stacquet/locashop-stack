	module.exports = function(app,passport) {

	var modelServices = require('./services/modelServices')();
    // sample api route
    app.get('/api/producteurs', function(req, res) {
        modelServices.Producteur.findById(1,function(callback){
			global.winston.log('info','producteur '+modelServices.Producteur.id);
			res.send(callback);
		});
    });
   // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular request	
	
	app.post('/api/login/userInfo', function(req, res) {
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
		modelServices.Inscription.checkEmailAvailable(req.body.email, function(data){
			res.send({"checkEmailAvailable" : data});
		});
	});	
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	// process the signup form
	app.post('/api/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/producteurs', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile',  function(req, res) {
		console.log("role "+req.user.role);
		if(req.user.role === "admin"){
			res.sendfile('./public/views/index.html');
			}
		else{
			res.sendfile('./public/views/producteurs.html');
		}
	});
	
	// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', 
		passport.authenticate('facebook',{ scope : 'email' })
	);

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/users',
            failureRedirect : '/'
        }));
	
	// =====================================
	// ADMIN SECTION =========================
	// =====================================
	// 
	app.get('/api/auth/users', modelServices.User.isLoggedIn, function(req, res) {
		if(req.user) console.log("role "+req.user.role);
		modelServices.User.getUsersList(function(err,data){
			if(err) global.winston.log('error',err);
				res.send(data);
			});
	});
	
	app.post('/api/auth/users/delete',modelServices.User.isLoggedIn, function(req, res) {
		if(req.body.idUser !== undefined){
			modelServices.User.delete(req.body.idUser,function(data,err){
				if(err){
					console.log('erreur à la requete !');
					req.flash('loginMessages', 'Erreur à la suppression...');
					res.send({'statut' : false, 'loginMessages' : req.flash('loginMessages')});
				}
				else{
				res.send({'statut' : true});
				}
			});
		}
		//res.send({'statut' : false, 'loginMessages' : 'stop'});
	});
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/api/logout', function(req, res) {
		req.logout();
		res.send({status : "ok"});
		});
		
	app.get('/search-box', function(req, res) {
		res.sendfile('./public/views/search-box.html');
	});


	app.get('/', function(req, res) {
		console.log('page d\'accueil');
		res.sendfile('./public/views/index.html');
	});
	// page d'accueil
	app.get('*', function(req, res) {

		res.redirect('/');
	});
	
}



var controllers = require(process.env.PWD+'/app/controllers');
var routes		= require(process.env.PWD+'/app/routes');

module.exports = function (app,passport) {
	app.get( '/'                           							, controllers.home.home);
	app.get( '/api/admin/resetDatabase'                           	, controllers.admin.resetDatabase);
	app.get('/api/inscription/emailVerification'					, controllers.mail.emailVerification);
	app.post('/api/inscription/localSignup'                 		, routes.auth.signup);
	app.post('/api/inscription/checkEmailAvailable'                 , routes.auth.checkEmailAvailable);
	app.post('/api/home/login'                						, routes.auth.login);
	app.get('/api/home/userInfos'									, routes.auth.userInfos);
	app.get('/api/home/logout'										, routes.auth.logout);
	app.get('/auth/facebook'										, routes.auth.facebook);
	app.get('/auth/facebook/callback'								, routes.auth.facebook_callback);
	app.get('/api/auth/emailResetPassword/:email'					, routes.auth.emailResetPassword);
	app.get('/api/auth/resetPassword/:password_change_token'		, routes.auth.resetPassword);
	app.post('/api/auth/changePassword'								, routes.auth.changePassword);
	app.get('/api/user/:id'											, controllers.user.get); 
	app.post('/api/user/:id'										, controllers.user.save); 
	app.post('/api/user/:id_user/adresse'							, controllers.user.adresse.save); 
	app.get('/api/user/:id_user/adresse'							, controllers.user.adresse.get); 
	app.get('/api/user/:id_user/mobile'								, controllers.user.mobile.get); 
	app.post('/api/user/:id_user/mobile'							, controllers.user.mobile.save);
	app.post('/api/user/:id_user/mobile/verify'						, controllers.user.mobile.verify); 
	app.get('/api/user/:id'											, controllers.user.get); 
	app.get('*'														, controllers.home.home);
};

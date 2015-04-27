
var controllers = require('./controllers');

module.exports = function (app,passport) {
	app.get( '/'                           							, controllers.home.home);
	app.post('/api/inscription/localSignup'                 		, controllers.auth.signup);
	app.get('/api/inscription/emailVerification'					, controllers.mail.emailVerification);
	app.post('/api/inscription/checkEmailAvailable'                 , controllers.auth.checkEmailAvailable);
	app.post('/api/home/login'                						, controllers.auth.login);
	app.get('/api/home/userInfos'									, controllers.auth.userInfos);
	app.get('/api/home/logout'										, controllers.auth.logout);
	app.get('/auth/facebook'										, controllers.auth.facebook);
	app.get('/auth/facebook/callback'								, controllers.auth.facebook_callback); 
	app.get('/api/user/:id'											, controllers.user.get); 
	app.post('/api/user/:id'										, controllers.user.save); 
	app.post('/api/user/:id_user/adresse'							, controllers.user.adresse.save); 
	app.get('/api/user/:id_user/adresse'							, controllers.user.adresse.get); 
	app.get('/api/user/:id_user/mobile'								, controllers.user.mobile.get); 
	app.post('/api/user/:id_user/mobile'							, controllers.user.mobile.save); 
	app.get('/api/user/:id'											, controllers.user.get); 
	app.get('*'														, controllers.home.home);
};

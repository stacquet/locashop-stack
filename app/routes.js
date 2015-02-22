
var controllers = require('./controllers');

module.exports = function (app,passport) {
	app.get( '/'                           							, controllers.home.home);
	app.post('/api/local-signup'                 					, controllers.auth.signup);
	app.get('/api/emailVerification'								, controllers.mail.emailVerification);
	app.post('/api/inscription/checkEmailAvailable'                 , controllers.auth.checkEmailAvailable);
	app.post('/api/auth/login'                						, controllers.auth.login);
	app.get('/api/login/userInfos'									, controllers.auth.userInfos);
	app.get('/api/logout'											, controllers.auth.logout);
	app.get('/auth/facebook'										, controllers.auth.facebook);
	app.get('/auth/facebook/callback'								, controllers.auth.facebook_callback); 
	app.get('/api/user/profil'										, controllers.user.get); 
	app.post('/api/user/profil/save'								, controllers.user.save); 
	/*app.get('/api/:model/:id'										, controllers.model.get); */
	app.get('/api/user/:id'											, controllers.user.get); 
	app.get('*'														, controllers.home.home);
};

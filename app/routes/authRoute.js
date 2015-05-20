var Promise 		= require("bluebird");
var passport		= require('passport');
var models   		= require(process.env.PWD+'/app/models/');
var controllers		= require(process.env.PWD+'/app/controllers/');
var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var bcrypt 			= require('bcrypt-nodejs');
var conf        	= require(process.env.PWD+'/secret/config');
var mailFactory		= require(process.env.PWD+'/app/modules/mailFactory');
var S 				= require('string');

module.exports = {
	login: function (req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.status(HttpStatus.NOT_FOUND).send({'messages' : req.flash('loginMessage')}); }
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
				res.send({'statut' : true, 'user' : req.user});
			});
		})(req, res, next);

	},
	userInfos : function(req,res,next){

			if(req.isAuthenticated()){
				res.send(req.user);
			}
			else{
				res.status(HttpStatus.NOT_FOUND).send();
			}
	},
	logout: function (req, res, next) {
		console.log('logout user : '+req.user);
		req.logout();
		res.send({status : "ok"});
	},
	checkEmailAvailable : function(req, res, next) {
			if(req.body && req.body.email){
				controllers.auth.checkEmailAvailable(req.body.email).
					then(function(cb){
						res.status(HttpStatus.OK).send({"checkEmailAvailable" : cb});
					});
			}
			else{
				res.status(HttpStatus.NOT_FOUND).send();
			}
			
	},
	signup : function(req, res, next) {
		req.id_profil='P_CONSOMMATEUR';
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.send({'statut' : false, 'loginMessages' : req.flash('loginMessage')}); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
					return res.send({'statut' : true, 'user' : user});
			});
		})(req, res, next);
	},
	facebook : function(req,res,next){
		passport.authenticate('facebook',{ scope : 'email' })(req, res, next);
	},
	facebook_callback : function(req,res,next){
		passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        })(req, res, next);
	},
	emailResetPassword : function (req, res, next) {
		/* 
			Email reset password for a user :
				- Retrieve user with url_param email information from DB :
					- if not found => 404
					- if found next						
				- Retrieve mail template from DB for RESET_PASSWORD
				    - if not found => 500
					- if found next
				- Fill mail template with password_change_token
				- Send email
					- if send KO => 500
					- if send OK =>200
		*/
		logger.log('debug','routes|auth|emailResetPassword'+JSON.stringify(req.body));
		var returnBody = '';
		var returnStatus;
		if(req.params && req.params.email){
			var req_email = req.params.email;
			controllers.auth.emailResetPassword(req_email)
				.then(function(data){
					logger.log('debug','routes|auth|emailResetPassword|user found');
					returnStatus=data;
				})
				.catch(function(err){
					if(err){
						logger.log('error','routes|auth|emailResetPassword : '+err);
						returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
					} 
				})
				.finally(function(){
					logger.log('debug','routes|auth|emailResetPassword|finally');
					res.status(returnStatus).send(returnBody); 
				});
		}
		else{
			logger.log('debug','routes|auth|emailResetPassword|bad params');
			returnStatus=HttpStatus.NOT_FOUND;
			res.status(returnStatus).send(returnBody); 
		}
	},
	resetPassword : function (req, res, next) {
		/* 
			Reset password for a user :
				- Retrieve user with url_param password_change_token information from DB :
					- if not found => 404
					- if found next						
				- Retrieve mail template from DB for RESET_PASSWORD
				    - if not found => 500
					- if found next
				- Fill mail template with password_change_token
				- Send email
					- if send KO => 500
					- if send OK =>200
		*/
		var returnBody = '';
		var returnStatus;
		var myT;
		logger.log('debug','routes|auth|resetPassword');
		if(req.params && req.params.password_change_token){
			var req_password_change_token = req.params.password_change_token;

			controllers.auth.resetPassword(req_password_change_token)
				.then(function(cb){
					res.status(cb).send();
				})
				.catch(function(err){
					res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
				})
		}
		else{
			logger.log('debug','routes|auth|resetPassword|form input not correct'); 
			res.status(HttpStatus.NOT_FOUND).send();
		}
	},
	changePassword : function (req, res, next) {
		/* 
			Reset password for a user :
				- Retrieve user with url_param password_change_token information from DB :
					- if not found => 404
					- if found next						
				- crypt and fill user in DB with password
					- if save KO => 500
					- if save OK =>200
		*/
		logger.log('debug','routes|auth|changePassword'+JSON.stringify(req.body));
		if(req.body && req.body.user && req.body.user.password_change_token && req.body.user.password){
			var req_password_change_token = req.body.user.password_change_token;
			var req_password = req.body.user.password;
			var db_user;
			var returnBody = '';
			var returnStatus;
			var myT;
			controllers.auth.changePassword(req_password_change_token,req_password)
				.then(function(cd){
					res.status(cb).send();
				})
				.catch(function(err){
					res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
				})
		}
		else{
			logger.log('debug','routes|auth|changePassword|form input not correct'); 
			res.status(HttpStatus.NOT_FOUND).send();
		}

	}
};


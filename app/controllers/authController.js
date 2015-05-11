var Promise 		= require("bluebird");
var passport		= require('passport');
var models   		= require(process.env.PWD+'/app/models/');
var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var bcrypt 			= require('bcrypt-nodejs');
var conf        	= require(process.env.PWD+'/secret/config');
var mailFactory		= require(process.env.PWD+'/app/modules/mailFactory');
var S 				= require('string');

Promise.promisifyAll(mailFactory);


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
		setTimeout(function(){
			if(req.isAuthenticated()){
				res.send(req.user);
			}
			else{
				res.status(HttpStatus.NOT_FOUND).send();
			}
		},30);
	},
	logout: function (req, res, next) {
		console.log('logout user : '+req.user);
		req.logout();
		res.send({status : "ok"});
	},
	checkEmailAvailable : function(req, res, next) {
			models.User.find({where : {email : req.body.email }})
				.then(function(user){
				res.send({"checkEmailAvailable" : (user!==null?false:true)});
			})
				.catch(function(err){
				res.send({"checkEmailAvailable" : false});
			});
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
	emailResetPassword : function(req, res, next) {
		
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
		logger.log('debug','auth|emailResetPassword'+JSON.stringify(req.body));
		var req_email = req.params.email;
		var returnBody = '';
		var returnStatus;
		var mailTemplate;
		var myT;
		models.sequelize.transaction()
			.then(function(t){
				logger.log('debug','auth|emailResetPassword|query user'); 
				myT=t;
				return models.User.find({	where:	{email : req_email}})
			})
			.then(function(user){
				db_user=user;
				if(db_user){
					var var_password_change_token=bcrypt.hashSync(req_email+Math.floor(Math.random()*10), null, null).replace(/#|\//g,"-");
					db_user.password_change_token=var_password_change_token;
					logger.log('debug','auth|emailResetPassword|save new password_change_token'); 
					return db_user.save({transaction:myT})
				}
				else{
					logger.log('debug','auth|emailResetPassword|email not found');
					returnStatus = HttpStatus.NOT_FOUND;
					return Promise.reject() 
				}
			})
			.then(function(){
				logger.log('debug','auth|emailResetPassword|create email with password_change_token');
				return mailFactory.createMailTemplateAsync('RESET_PASSWORD')
			})
			.then(function(mailTemplateInstance){
				logger.log('debug','auth|emailResetPassword|set email param');
				mailTemplateInstance.setParam('[URL_RESET_PASSWORD]',conf.base_url+conf.host+':'+conf.port+'/#/auth/resetPassword/'+db_user.password_change_token);
				mailTemplateInstance.addRecipient(req_email);
				logger.log('debug','auth|emailResetPassword|send email');
				console.log(mailTemplateInstance);
				return mailTemplateInstance.send()
			})
			.then(function(){
				logger.log('debug','auth|emailResetPassword|DB commit');
				myT.commit();
				returnStatus = HttpStatus.OK;
				return Promise.resolve()
			})
			.catch(function(err){
				myT.rollback();
				if(err){
					logger.log('error','auth|emailResetPassword : '+err);
					returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
				} 
			})
			.finally(function(){
				res.status(returnStatus).send(returnBody);
			});
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
		logger.log('debug','auth|resetPassword'+JSON.stringify(req.body));
		var req_password_change_token = req.params.password_change_token;
		var returnBody = '';
		var returnStatus;
		var myT;
		models.sequelize.transaction()
			.then(function(t){
				logger.log('debug','auth|resetPassword|query user'); 
				myT=t;
				return models.User.find({	where:	{password_change_token : req_password_change_token}})
			})
			.then(function(user){
				if(user){
				returnStatus = HttpStatus.OK;
				}
				else{
					returnStatus = HttpStatus.NOT_FOUND;
				}
				myT.commit();

			})
			.catch(function(err){
				myT.rollback();
				if(err){
					logger.log('error','auth|resetPassword : '+err);
					returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
				} 
			})
			.finally(function(){
				res.status(returnStatus).send();
				myT.rollback();
			})
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
		logger.log('debug','auth|changePassword'+JSON.stringify(req.body));
		if(req.body.user && req.body.user.password_change_token && req.body.user.password){
			var req_password_change_token = req.body.user.password_change_token;
			var req_password = req.body.user.password;
			var db_user;
			var returnBody = '';
			var returnStatus;
			var myT;
			models.sequelize.transaction()
				.then(function(t){
					logger.log('debug','auth|changePassword|query user'); 
					myT=t;
					return models.User.find({	where:	{password_change_token : req_password_change_token}})
				})
				.then(function(user){
					if(user){
						db_user = user;
						db_user.password = bcrypt.hashSync(req_password, null, null);
						db_user.password_change_token =null;
						returnStatus = HttpStatus.OK;
						return db_user.save({transaction:myT});
					}
					else{
						returnStatus = HttpStatus.NOT_FOUND;
						Promise.reject();
					}
		
				})
				.then(function(){
					logger.log('debug','auth|changePassword|commit'); 					
					myT.commit();
				})
				.catch(function(err){
					myT.rollback();
					if(err){
						logger.log('error','auth|changePassword : '+err);
						returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
					} 
				})
				.finally(function(){
					res.status(returnStatus).send();
					myT.rollback();
				})
		}
		else{
			logger.log('debug','auth|changePassword|form input not correct'); 
			res.status(HttpStatus.NOT_FOUND).send();
		}

	}
};


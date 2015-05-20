var Promise 		= require("bluebird");
var passport		= require('passport');
var models   		= require(process.env.PWD+'/app/models/');
var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var bcrypt 			= require('bcrypt-nodejs');
var conf        	= require(process.env.PWD+'/secret/config');
var mailFactory		= require(process.env.PWD+'/app/modules/mailFactory');
var S 				= require('string');

module.exports = {

	checkEmailAvailable : function(email,cb) {
		return new Promise(function(resolve,reject){
			if(email){
				models.User.find({where : {email : email }})
					.then(function(user){
					resolve(user===null);
				})
					.catch(function(err){
					reject(err);
				});
			}
			else{
				resolve(false);
			}
		});
	},
	emailResetPassword : function (req_email) {
		/* 
			Email reset password for a user :
				- Retrieve user with url_param email information from DB :
					- if not found => NOT_FOUND
					- if found next						
				- Retrieve mail template from DB for RESET_PASSWORD
				    - if not found => INTERNAL_SERVER_ERROR
					- if found next
				- Fill mail template with password_change_token
				- Send email
					- if send KO => INTERNAL_SERVER_ERROR
					- if send OK =>OK
		*/
		return new Promise(function(resolve,reject){
			var returnStatus;
			var mailTemplate;
			var myT;
			if(req_email){
				models.sequelize.transaction()
					.then(function(t){
						logger.log('debug','controllers|auth|emailResetPassword|query user'); 
						myT=t;
						return models.User.find({	where:	{email : req_email}})
					})
					.then(function(user){
						db_user=user;
						if(db_user){
							var var_password_change_token=bcrypt.hashSync(req_email+Math.floor(Math.random()*10), null, null).replace(/#|\//g,"-");
							db_user.password_change_token=var_password_change_token;
							logger.log('debug','controllers|auth|emailResetPassword|save new password_change_token'); 
							return db_user.save({transaction:myT})
						}
						else{
							logger.log('debug','controllers|auth|emailResetPassword|email not found');
							returnStatus = HttpStatus.NOT_FOUND;
							return Promise.reject() 
						}
					})
					.then(function(){
						logger.log('debug','controllers|auth|emailResetPassword|create email with password_change_token');
						return mailFactory.createMailTemplate('RESET_PASSWORD')
					})
					.then(function(mailTemplateInstance){
						logger.log('debug','controllers|auth|emailResetPassword|set email param');
						mailTemplateInstance.setParam('[URL_RESET_PASSWORD]',conf.base_url+conf.host+':'+conf.port+'/#/auth/resetPassword/'+db_user.password_change_token);
						mailTemplateInstance.addRecipient(req_email);
						logger.log('debug','controllers|auth|emailResetPassword|send email');
						return mailTemplateInstance.send()
					})
					.then(function(){
						logger.log('debug','controllers|auth|emailResetPassword|DB commit');
						myT.commit();
						returnStatus = HttpStatus.OK;
						return Promise.resolve()
					})
					.catch(function(err){
						myT.rollback();
						if(err){
							logger.log('error','controllers|auth|emailResetPassword : '+err);
							returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
							reject(err,returnStatus)
						} 
					})
					.finally(function(){
						myT.rollback();
						resolve(returnStatus)
					});
			}
			else{
				return resolve(HttpStatus.NOT_FOUND);
			}
		})
	},
	resetPassword : function (req_password_change_token) {
		/* 
			Reset password for a user :
				- Retrieve user with url_param password_change_token information from DB :
					- if not found => NOT_FOUND
					- if found next						
				- Retrieve mail template from DB for RESET_PASSWORD
				    - if not found => INTERNAL_SERVER_ERROR
					- if found => OK

		*/
		return new Promise(function(resolve,reject){
			if(req_password_change_token){
				logger.log('debug','controllers|auth|resetPassword');
				var myT;
				models.sequelize.transaction()
					.then(function(t){
						logger.log('debug','controllers|auth|resetPassword|query user'); 
						myT=t;
						return models.User.find({	where:	{password_change_token : req_password_change_token}})
					})
					.then(function(user){
						if(user){
							resolve(HttpStatus.OK)
						}
						else{
							resolve(HttpStatus.NOT_FOUND)
						}
					})
					.catch(function(err){
						if(err){
							logger.log('error','controllers|auth|resetPassword : '+err);
							reject(HttpStatus.INTERNAL_SERVER_ERROR);
						} 
					})
					.finally(function(){
						logger.log('debug','controllers|auth|resetPassword|finally'); 
						myT.rollback();
					})
			}
			else{
				resolve(HttpStatus.NOT_FOUND)
			}
		});
	},
	changePassword : function (req_password_change_token,req_password) {
		/* 
			Reset password for a user :
				- Retrieve user with url_param password_change_token information from DB :
					- if not found => 404
					- if found next						
				- crypt and fill user in DB with password
					- if save KO => 500
					- if save OK =>200
		*/
		return new Promise(function(resolve,reject){
			logger.log('debug','controllers|auth|changePassword');
			if(req_password_change_token && req_password){
				var db_user;
				var returnBody = '';
				var returnStatus;
				var myT;
				models.sequelize.transaction()
					.then(function(t){
						logger.log('debug','controllers|auth|changePassword|query user'); 
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
							resolve(returnStatus);
						}
			
					})
					.then(function(){
						logger.log('debug','controllers|auth|changePassword|commit'); 					
						myT.commit();
					})
					.catch(function(err){
						myT.rollback();
						if(err){
							logger.log('error','controllers|auth|changePassword : '+err);
							reject(err);
						} 
					})
					.finally(function(){
						logger.log('debug','controllers|auth|changePassword|finally'); 
						myT.rollback();
						resolve(returnStatus);
					})
			}
			else{
				logger.log('debug','controllers|auth|changePassword|form input not correct'); 
				resolve(HttpStatus.NOT_FOUND)
			}
		});

	}
};


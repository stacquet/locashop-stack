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

	checkEmailAvailable : function(email,cb) {
			models.User.find({where : {email : email }})
				.then(function(user){
				return cb(null,user);
			})
				.catch(function(err){
				return cb(err);
			});
	},
	emailResetPassword : function (req_email,cb) {
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
					return cb(err,returnStatus)
				} 
			})
			.finally(function(){
				myT.rollback();
				return cb(null,returnStatus)
			});
	}
};


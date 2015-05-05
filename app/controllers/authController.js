var passport	= require('passport');
var models   	= require('../models/');
var HttpStatus	= require('http-status-codes');
var logger		= require('../util/logger');
var bcrypt = require('bcrypt-nodejs');


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
			Reset password for a user :
				- Retrieve user with url_param email information from DB :
					- if not found => 404
					- if found next						
				- Check that id_rand in the url match the user field email_verification_token
					- if not => 404
					- if found send request_page				
		*/
		logger.log('debug','auth|emailResetPassword'+JSON.stringify(req.body));
		var req_email = req.params.email;
		var returnBody;
		var returnStatus;
		models.sequelize.transaction()
			.then(function(t){
				logger.log('debug','auth|emailResetPassword|query user'); 
				myT=t;
				return models.User.find({	where:	{email : req_email}})
			})
			.then(function(user){
				db_user=user;
				if(db_user){
					db_user.password_change_token=bcrypt.hashSync(req_email+Math.floor(Math.random()*10), null, null);
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
				logger.log('debug','auth|emailResetPassword|send email with password_change_token');
				myT.commit();
				returnStatus = HttpStatus.OK;
				return Promise.resolve()
			})
			.catch(function(err){
				myT.rollback();
				if(err){
					logger.log('error','user|mobile|verify : '+err);
					returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;
				} 
			})
			.finally(function(){
				res.status(returnStatus).send(returnBody);
			});
	}
};

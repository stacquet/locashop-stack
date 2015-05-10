var models   	= require('../models/');
var bcrypt = require('bcrypt-nodejs');

var env       	= process.env.NODE_ENV || "development";
var conf    	= require(process.env.PWD+'/secret/config');
var sendgrid  	= require('sendgrid')(conf.mailUser,conf.mailPassword);

module.exports = {
	emailVerification: function (req, res, next) {
		console.log('je vais envoyer un mail à '+req.user.email);
		rand=bcrypt.hashSync(req.user.email, null, null);
	    host=req.get('host');
	    link="http://"+req.get('host')+"/verify?id="+rand;
		models.User.find({where:	{id_user : req.user.id_user}}).then(function(user){
			user.set("email_verification_token" , rand);
			user.save().then(function(){
				sendgrid.send({
					to:       req.user.email,
					from:     'postmaster@ossoft.fr',
					subject:  'LOCASHOP : Vérification d\'email',
					html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
					}, function(err, json) {
						if (err) { 
							console.log(err);
							res.send(500,err); 
						}
						else{
							console.log(json);
							res.send(json);
						}
					});
				}).catch(function(err){
					console.log(err);
					res.send(500,err); 
			});
			}).catch(function(err){
				console.log(err);
				res.send(500,err); 
		});	
	},
	
	emailResetPassword: function (req, res, next) {
		rand=bcrypt.hashSync(req.user.email, null, null);
	    host=req.get('host');
	    link="http://"+req.get('host')+"/user/"+"/resetPassword/"+rand;
		models.User.find({where:	{email : req.body.email}}).then(function(user){
			user.set("password_change_token" , rand);
			user.save().then(function(){
				sendgrid.send({
					to:       req.body.email,
					from:     'postmaster@ossoft.fr',
					subject:  'LOCASHOP : Réinitialisation du mot de passe',
					html : "Bonjour,<br> Changer votre mot de passe en cliquant sur ce lien.<br><a href="+link+">reset du mot de passe</a>" 
					}, function(err, json) {
						if (err) { 
							console.log(err);
							return res.send(err); 
						}
						else{
							console.log(json);
							res.send(json);
						}
					});
				}).catch(function(err){
					console.log(err);
					return res.send(err); 
			});
			}).catch(function(err){
				console.log(err);
		});	
	}
};

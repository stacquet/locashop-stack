var models   	= require('../models/');
var logger		= require('../util/logger');

/*
function mailFactory(){
	
	var mailFactory;
	mailFactory.init = init;	
	
	function init(mailTemplate){
		if(mailTemplate){
			models.MailTemplate.find({	where:	{id_mail_template : mailTemplate}})
				.then(function(mailTemplate){
					mailFactory.content = mailTemplate.content;
					mailFactory.object = mailTemplate.object;
					mailFactory.statut = mailTemplate.statut;
				});
		}
		else{
			return;
		}
	}
	return mailFactory;
}

module.exports = mailFactory;


module.exports = function() {
	var mailFactory = {};
	mailFactory.init = init;	
	
	function init(mailTemplate){
		if(mailTemplate){
			models.MailTemplate.find({	where:	{id_mail_template : mailTemplate}})
				.then(function(mailTemplate){
					mailFactory.content = mailTemplate.content;
					mailFactory.object = mailTemplate.object;
					mailFactory.statut = mailTemplate.statut;
				});
		}
		else{
			//return;
		}
	}
	return mailFactory;
}*/
var mailFactory = {};
mailFactory.createMailTemplate = function(mailTemplate, cb){
		if(mailTemplate){
			
			models.MailTemplate.find({	where:	{id_mail_template : mailTemplate}})
				.then(function(mailTemplate){
					if(mailTemplate){
						mailFactory.content = mailTemplate.content;
						mailFactory.object = mailTemplate.object;
						mailFactory.statut = mailTemplate.statut;
						return cb(null,mailFactory);
					}
					else{
						return cb('no mail template found');
					}
				});
		}
		else{
			return cb('no mail template passed as parameter');
		}
	}
module.exports = mailFactory;
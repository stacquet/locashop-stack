var models   	= require('../models/');
var Promise 	= require("bluebird");
var logger		= require('../util/logger');
var S 			= require('string');
var conf    	= require(process.env.PWD+'/secret/config');
var sendgrid  	= require('sendgrid')(conf.mailUser,conf.mailPassword);

Promise.promisifyAll(sendgrid);

/* 
	mailFactory is a module that provide mailTemplate. 
	mailTemplate are objects with function and attributes that helps build and send mails
*/
var mailFactory = {};

mailFactory.createMailTemplate = function(idMailTemplate, cb){
		if(idMailTemplate){
			
			models.MailTemplate.find({	where:	{id_mail_template : idMailTemplate}})
				.then(function(mailTemplate){
					if(mailTemplate){
						var mailTemplateInstance = new MailTemplate({
							content : mailTemplate.content,
							object 	: mailTemplate.object,
							statut	: mailTemplate.statut
						});
						return cb(null,mailTemplateInstance);
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


var MailTemplate = function(opts){
	this.recipient=[];
	if(opts){
		for(var opt in opts){
			this[opt]=opts[opt];
		}
	} 
}
MailTemplate.prototype.send = function(){
	console.log(this.recipient+'-'+conf.mailSender+'-'+this.object+'-'+this.content);
	return sendgrid.sendAsync({
		to			: this.recipient,
		from		: conf.mailSender,
		subject		: this.object,
		html 		: ""+this.content	
	});
}

MailTemplate.prototype.setParam = function(key,value){
	this.content = S(this.content).replaceAll(key,value);
}

MailTemplate.prototype.addRecipient = function(email){
	if(email)	this.recipient.push(email);		
}

MailTemplate.prototype.formatRecipient = function(){

}
Promise.promisifyAll(mailFactory);

module.exports = mailFactory;
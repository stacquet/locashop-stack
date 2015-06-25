var models   	= require('../models/');
var Promise 	= require("bluebird");
var logger		= require('../util/logger');
var S 			= require('string');
var conf    	= require(process.env.PWD+'/secret/config');
var sendgrid  	= require('sendgrid')(conf.mailUser,conf.mailPassword);

Promise.promisifyAll(sendgrid);

/* 
	mailFactory is a module that provides mailTemplate objects. 
	mailTemplate are objects with function and attributes that helps build and send mails
*/
var mailFactory = {};

mailFactory.createMailTemplate = function(idMailTemplate){
	return new Promise(function(resolve,reject){
		if(idMailTemplate){
			models.MailTemplate.find({	where:	{id_mail_template : idMailTemplate}})
				.then(function(mailTemplate){
					if(mailTemplate){
						var mailTemplateInstance = new MailTemplate({
							idMailTemplate : idMailTemplate,
							content : mailTemplate.content,
							object 	: mailTemplate.object,
							statut	: mailTemplate.statut
						});
						resolve(mailTemplateInstance);
					}
					else{
						reject(new Error('no mail template found'));
					}
				});
		}
		else{
			reject(new Error('no mail template passed as parameter'));
		}
	});
}


var MailTemplate = function(opts){
	this.recipient=[];
	this.type="MailTemplate";
	if(opts){
		for(var opt in opts){
			this[opt]=opts[opt];
		}
	} 
}
MailTemplate.prototype.send = function(){
	if(conf.shouldEmailBeSend){
		return sendgrid.sendAsync({
			to			: this.recipient,
			from		: conf.mailSender,
			subject		: this.object,
			html 		: ""+this.content	
		})
	}
	else{
		Promise.resolve()
	}
}

MailTemplate.prototype.setParam = function(key,value){
	this.content = S(this.content).replaceAll(key,value);
}

MailTemplate.prototype.addRecipient = function(email){
	if(email)	this.recipient.push(email);		
}

MailTemplate.prototype.formatRecipient = function(){

}

module.exports = mailFactory;
var Promise 		= require("bluebird");
var should 			= require('should-promised');
//require('should-eventually')(should);
//require('should-promised');
var mailFactory 	= require(process.env.PWD+'/app/modules/mailFactory');
var HttpStatus		= require('http-status-codes');

var testMailTemplate = 'RESET_PASSWORD';

describe('createMailTemplate Unit Test', function(){
    it('#createMailTemplate(testMailTemplate) should return mailTemplateInstance type because testMailTemplate exists in database', function(){
		return mailFactory.createMailTemplate(testMailTemplate).should.fulfilled;
	});
    it('#createMailTemplate(testMailTemplate) should return mailTemplateInstance type because testMailTemplate exists in database', function(){
		return mailFactory.createMailTemplate(testMailTemplate).should.finally.property('type').equal('MailTemplate');
	});
    it('#createMailTemplate(badMailTemplate) should be rejected type because badMailTemplate is not in database', function(){
		return mailFactory.createMailTemplate('tatatata').should.rejectedWith('no mail template found');
	});	
    it('#createMailTemplate("") should be rejected type because empty string provided', function(){
		return mailFactory.createMailTemplate('').should.rejectedWith('no mail template passed as parameter');
	});
    it('#createMailTemplate(null) should be rejected type because null provided', function(){
		return mailFactory.createMailTemplate(null).should.rejectedWith('no mail template passed as parameter');
	});
});

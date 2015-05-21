var Promise 		= require("bluebird");
var should 			= require('should-promised');
var controllers = require(process.env.PWD+'/app/controllers');
var models 		= require(process.env.PWD+'/app/models');
var HttpStatus		= require('http-status-codes');

var testEmail 		= 'sylvain.tacquet@gmail.com';
var testPassword 	= 'tatata';
var testpassword_change_token = 'titi';

describe('checkEmailAvailable Unit Test', function(){
    it('#checkEmailAvailable(testEmail) should return false because sylvain.tacquet@gmail.com already exists in database', function(){
		return controllers.auth.checkEmailAvailable(testEmail).should.fulfilledWith(false);			
	});
	it('#checkEmailAvailable(zzzzz@zzzzz.zzzzz) should return true because zzzzz@zzzzz.zzzzz does not exist in database', function(){
		return controllers.auth.checkEmailAvailable('zzzzz@zzzzz.zzzzz').should.fulfilledWith(true);			
	});
	it('#checkEmailAvailable("") should return false because empty string provided', function(){
		return controllers.auth.checkEmailAvailable('').should.fulfilledWith(false);			
	});
	it('#checkEmailAvailable(null) should return false because null provided', function(){
		return controllers.auth.checkEmailAvailable(null).should.fulfilledWith(false);			

	});
});

describe('emailResetPassword Unit Test', function(){
    it('#emailResetPassword(tes) should return OK because sylvain.tacquet@gmail.com exists in database', function(){
		return controllers.auth.emailResetPassword(testEmail).should.fulfilledWith(HttpStatus.OK);			
	});
	it('#emailResetPassword(zzzzz@zzzzz.zzzzz) should return NOT_FOUND because zzzzz@zzzzz.zzzzz does not exist in database', function(){
		return controllers.auth.emailResetPassword('zzzzz@zzzzz.zzzzz').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});
	it('#emailResetPassword("") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.emailResetPassword('').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});
	it('#emailResetPassword(null) should return NOT_FOUND because null provided', function(){
		return controllers.auth.emailResetPassword(null).should.fulfilledWith(HttpStatus.NOT_FOUND);			

	});
});

describe('resetPassword Unit Test', function(){
 	it('#resetPassword() should return OK because testEmail exist in database', function(){
 		models.User.find({	where:	{email : testEmail}})
 			.then(function(user){
				user.password_change_token = testpassword_change_token;
				return user.save()
			})
			.then(function(){
				return controllers.auth.resetPassword(user.password_change_token).should.fulfilledWith(HttpStatus.OK);
			});		
	});
	it('#resetPassword("") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.resetPassword('').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});	
	it('#resetPassword("zzz") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.resetPassword('zzz').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});
	it('#resetPassword(null) should return NOT_FOUND because null provided', function(){
		return controllers.auth.resetPassword(null).should.fulfilledWith(HttpStatus.NOT_FOUND);			

	});
});

describe('changePassword Unit Test', function(){
	before(function() {
		return models.User.find({	where:	{email : testEmail}})
 			.then(function(user){
				user.password_change_token = testpassword_change_token;
				return user.save()
			}); 
	});
 	it('#changePassword(goodToken,testPassword) should return OK because not empty', function(){
 		return controllers.auth.changePassword(testpassword_change_token,'tata').should.fulfilledWith(HttpStatus.OK);
	});
	it('#changePassword2ndTime(goodToken,testPassword) should return NOT_FOUND because try to change 2 times', function(){
		return controllers.auth.changePassword(testpassword_change_token,'tata').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});	
	it('#changePassword(goodToken,null) should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.changePassword(testpassword_change_token,null).should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});	
	it('#changePassword("") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.changePassword('').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});
	it('#changePassword("zzz") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.changePassword('zzz').should.fulfilledWith(HttpStatus.NOT_FOUND);			
	});
	it('#changePassword(null) should return NOT_FOUND because null provided', function(){
		return controllers.auth.changePassword(null).should.fulfilledWith(HttpStatus.NOT_FOUND);			

	});
});
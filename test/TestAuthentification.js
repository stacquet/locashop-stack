var Promise 		= require("bluebird");
var should = require('should');
require('should-eventually')(should);
var controllers = require(process.env.PWD+'/app/controllers');
var HttpStatus		= require('http-status-codes');

Promise.promisifyAll(controllers.auth);

describe('checkEmailAvailableAsync Unit Test', function(){
    it('#checkEmailAvailableAsync(sylvain.tacquet@gmail.com) should return false because sylvain.tacquet@gmail.com already exists in database', function(){
		return controllers.auth.checkEmailAvailableAsync('sylvain.tacquet@gmail.com').should.eventually.equal(false);			
	});
	it('#checkEmailAvailableAsync(zzzzz@zzzzz.zzzzz) should return true because zzzzz@zzzzz.zzzzz does not exist in database', function(){
		return controllers.auth.checkEmailAvailableAsync('zzzzz@zzzzz.zzzzz').should.eventually.equal(true);			
	});
	it('#checkEmailAvailableAsync("") should return false because empty string provided', function(){
		return controllers.auth.checkEmailAvailableAsync('').should.eventually.equal(false);			
	});
	it('#checkEmailAvailableAsync(null) should return false because null provided', function(){
		return controllers.auth.checkEmailAvailableAsync(null).should.eventually.equal(false);			

	});
});

describe('emailResetPasswordAsync Unit Test', function(){
    it('#emailResetPasswordAsync(sylvain.tacquet@gmail.com) should return OK because sylvain.tacquet@gmail.com already exists in database', function(){
		return controllers.auth.emailResetPasswordAsync('sylvain.tacquet@gmail.com').should.eventually.equal(HttpStatus.OK);			
	});
	it('#emailResetPasswordAsync(zzzzz@zzzzz.zzzzz) should return NOT_FOUND because zzzzz@zzzzz.zzzzz does not exist in database', function(){
		return controllers.auth.emailResetPasswordAsync('zzzzz@zzzzz.zzzzz').should.eventually.equal(HttpStatus.NOT_FOUND);			
	});
	it('#emailResetPasswordAsync("") should return NOT_FOUND because empty string provided', function(){
		return controllers.auth.emailResetPasswordAsync('').should.eventually.equal(HttpStatus.NOT_FOUND);			
	});
	it('#emailResetPasswordAsync(null) should return NOT_FOUND because null provided', function(){
		return controllers.auth.emailResetPasswordAsync(null).should.eventually.equal(HttpStatus.NOT_FOUND);			

	});
});
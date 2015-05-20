var Promise 		= require("bluebird");
var should = require('should');
require('should-eventually')(should);
var mailFactory 	= require(process.env.PWD+'/app/modules/mailFactory');
var HttpStatus		= require('http-status-codes');

console.log(mailFactory);


describe('checkEmailAvailableAsync Unit Test', function(){
    it('#checkEmailAvailableAsync(sylvain.tacquet@gmail.com) should return false because sylvain.tacquet@gmail.com already exists in database', function(){
	});
	
});

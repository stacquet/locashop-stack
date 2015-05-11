var assert = require("assert"); // node.js core module
process.env.PWD="C:/locashop";
var controllers = require('../app/controllers');
console.log(process.env.PWD);

describe('Authentification Unit Test', function(){
    it('#checkEmailAvailable() should return false because sylvain.tacquet@gmail.com already exists in database', function(done){
		Inscription.checkEmailAvailable('sylvain.tacquet@gmail.com',function(callback){
			done(assert.equal(false,callback));
		});
	});
	it('#checkEmailAvailable() should return true because zzzzz@zzzzz.zzzzz does not exist in database', function(done){
		Inscription.checkEmailAvailable('zzzzz@zzzzz.zzzzz',function(callback){
			done(assert.equal(true,callback));
		});
	});
	it('#checkEmailAvailable() should return false because empty string provided', function(done){
		Inscription.checkEmailAvailable('',function(callback){
			done(assert.equal(false,callback));
		});
	});
	it('#checkEmailAvailable() should return false because null provided', function(done){
		Inscription.checkEmailAvailable(undefined,function(callback){
			done(assert.equal(false,callback));
		});
	});
});
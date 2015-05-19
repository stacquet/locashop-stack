var Promise 		= require("bluebird");
var assert = require("assert"); // node.js core module
process.env.PWD="C:/locashop";
var controllers = require(process.env.PWD+'/app/controllers');
Promise.promisifyAll(controllers.auth);

describe('Authentification Unit Test', function(){
    it('#checkEmailAvailable() should return false because sylvain.tacquet@gmail.com already exists in database', function(done){
		controllers.auth.checkEmailAvailableAsync('sylvain.tacquet@gmail.com')
			.then(function(cb){
				done(assert.equal(false,cb));
			})
			.catch(function(err){
				done(false);
			});
	});
	it('#checkEmailAvailable() should return true because zzzzz@zzzzz.zzzzz does not exist in database', function(done){
		controllers.auth.checkEmailAvailableAsync('zzzzz@zzzzz.zzzzz')
			.then(function(cb){
				done(assert.equal(true,cb));
			})
			.catch(function(err){
				done(false);
			});
	});
	it('#checkEmailAvailable() should return false because empty string provided', function(done){
		controllers.auth.checkEmailAvailableAsync('')
			.then(function(cb){
				console.log(cb);
				done(assert.equal(false,cb));
			})
			.catch(function(err){
				console.log(err);
				done(false);
			});
	});
	it('#checkEmailAvailable() should return false because null provided', function(done){
		controllers.auth.checkEmailAvailableAsync(null)
			.then(function(cb){
				done(assert.equal(false,cb));
			})
			.catch(function(err){
				done(false);
			});
	});
});
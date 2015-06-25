var Promise 		= require("bluebird");
var models   		= require(process.env.PWD+'/app/models/');
var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var conf        	= require(process.env.PWD+'/secret/config');

module.exports = {
	addFermeDescription : function(description) {
			return new Promise(function(resolve,reject){
				if(email){
					models.User.find({where : {email : email }})
						.then(function(user){
						resolve(user===null);
					})
						.catch(function(err){
						reject(err);
					});
				}
				else{
					resolve(false);
				}
			});
		}
		
};


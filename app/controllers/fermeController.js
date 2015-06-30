var Promise 		= require("bluebird");
var models   		= require(process.env.PWD+'/app/models/');
var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var conf        	= require(process.env.PWD+'/secret/config');

module.exports = {
	createFerme			: function(nom){
		var myT;
		return new Promise(function(resolve,reject){
				if(nom && nom.length<=100){
					models.sequelize.transaction().then(function(t){
						myT=t;
						return models.Ferme.build({nom : nom })
					})
					.then(function(ferme){
						return ferme.save({transaction:myT})
					})
					.then(function(ferme){
						myT.commit();
						resolve();
					})
					.catch(function(err){
						logger.log('debug',err);
						reject(err);
					})
					.finally(function(){
						myT.rollback();
					});
				}
				else{
					resolve(false);
				}
			});
	},
	addFermeDescription : function(id_ferme,description) {
			return new Promise(function(resolve,reject){
				if(id_ferme && description){
					models.Ferme.find({where : {id_ferme : id_ferme }})
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


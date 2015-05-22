var Promise 		= require('bluebird');
var logger			= require(process.env.PWD+'/app/util/logger');
var models   		= require(process.env.PWD+'/app/models/');

var transactionManager={}

transactionManager.getTransaction = function(myT){
	return new Promise(function(resolve,reject){
		if(myT && myT.connection){
			logger.log('debug','modules|transactionManager|getTransaction|transaction OK, juste resolve'); 
			resolve(myT)
		}
		else{
			logger.log('debug','modules|transactionManager|getTransaction|no transaction or incorrect transaction provided so we create a new one'); 
			models.sequelize.transaction()
				.then(function(t){
					resolve(t);
				})
		}
	});
}

module.exports = transactionManager;
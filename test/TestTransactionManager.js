var Promise 		= require("bluebird");
var should 			= require('should-promised');
var transactionManager	= require(process.env.PWD+'/app/modules/transactionManager');
var models   		= require(process.env.PWD+'/app/models/');
var logger			= require(process.env.PWD+'/app/util/logger');


describe('transactionManager Unit Test', function(){
    it('#transactionManager.getTransaction() should create a new transaction', function(){
		return transactionManager.getTransaction().should.finally.have.property('connection');
	});
    it('#transactionManager.getTransaction(myT) should pass transaction', function(){
		models.sequelize.transaction()
				.then(function(t){
					return transactionManager.getTransaction(t).should.finally.have.property('connection');
				})	
	});
    it('#transactionManager.getTransaction("blabla") should create a new transaction', function(){
		return transactionManager.getTransaction('blabla').should.finally.have.property('connection');
	});
});
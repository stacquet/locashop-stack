var HttpStatus		= require('http-status-codes');
var logger			= require(process.env.PWD+'/app/util/logger');
var dataset			= require(process.env.PWD+'/migration/dataset');


module.exports = {
	resetDatabase: function (req, res, next) {
		dataset.createDB()
			.then(function(){			
				return dataset.initData()
			})
			.then(function(){
				res.status(HttpStatus.OK).send();
			})
			.catch(function(){
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();				
			})
	}
};

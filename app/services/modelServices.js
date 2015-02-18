module.exports = function(){
	/*var Inscription = require('./services/inscription')();
	var User = require('./services/user')();
	var Producteur = require('./services/producteur')();*/
	var modelServices = {};
	
	modelServices.User = require('./user');

	return modelServices;
};
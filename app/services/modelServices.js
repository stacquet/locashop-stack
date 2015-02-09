module.exports = function(){
	/*var Inscription = require('./services/inscription')();
	var User = require('./services/user')();
	var Producteur = require('./services/producteur')();*/
	var modelServices = {};
	
	modelServices.Inscription = require('./inscription');
	modelServices.User = require('./user');
	modelServices.Producteur = require('./producteur');

	return modelServices;
};
var models   	= require('../models/');
var logger			= require('../util/logger');

module.exports = {

	acl: function (req, res, next) {
		//req.user.id_profil
		
		logger.log('debug','passage par acl pour user '+(req.user?req.user.id_user:'undefined')+' profil '+(req.user?req.user.id_profil:'undefined')+' methode '+req.method+' url '+req.url);
		//console.log('profil : '+req.user.id_profil);
		return next();
	}
};

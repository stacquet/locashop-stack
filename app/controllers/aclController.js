var models   	= require('../models/');

module.exports = {

	acl: function (req, res, next) {
		//req.user.id_profil
		console.log('passage par acl pour '+req.method+' '+req.url);
		//console.log('profil : '+req.user.id_profil);
		return next();
	}
};

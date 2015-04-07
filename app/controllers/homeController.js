var logger			= require('../util/logger');

module.exports = {
	home: function (req, res, next) {
		logger.log('info','url '+req.url+' non définie dans les routes');
		res.sendfile('./public/app/index.html');
	}
}
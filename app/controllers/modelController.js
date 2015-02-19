var modelImport   	= require('../models/');

var models = {
	'user' : modelImport.User
}
module.exports = {
	get: function (req, res, next) {
		var model=req.params.model;
		if(models[model] !== undefined){
			models[model].find(req.params.id).then(function(result){
				res.send(result);
			}).catch(function(err){
				console.log(err);
			});
		}
		else{
			res.send(404);
		}
	}
}
var models   	= require('../models/');
var HttpStatus	= require('http-status-codes');

module.exports = {
	get: function (req, res, next) {
			if(req.user !== undefined){
				models.User.find(
					{
						where:	{id_user : req.user.id_user},
						include: [models.Ferme,models.Photo]
					}).then(function(user){
					res.send(user);
				}).catch(function(err){
					console.log(err);
				});
			}
			else{
				res.send();
			}
	},
	save: function (req, res, next) {
			console.log('user '+ JSON.stringify(req.user));
			console.log('userProfil '+JSON.stringify(req.body.userProfil));
			if(req.user !== undefined && req.body.userProfil !== undefined){
				models.User.find(
					{
						where:	{id_user : req.user.id_user},
						include: [models.Ferme,models.Photo]
					}).then(function(user){
						user.set(req.body.userProfil);
						user.save().then(function(){
							/*user.getFermes().then(function(fermes){
								fermes[0].save().then(function(){
								});
							});*/
							console.log(user);
							user.getMedia().then(function(media){
								media.save().then(function(){
								});
							});
							res.send(user);
						});
				}).catch(function(err){
					console.log(err);
				});
			}
			else{
				console.log('accès non authentifié');
				res.status(HttpStatus.NOT_FOUND).send();
			}
	}
}
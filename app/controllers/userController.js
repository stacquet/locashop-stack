var models   	= require('../models/');

module.exports = {
	get: function (req, res, next) {
			if(req.user !== undefined){
				models.User.find(
					{
						where:	{id_user : req.user.id_user},
						include: [models.Ferme,models.Media]
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
						include: [models.Ferme]
					}).then(function(user){
						user.set(req.body.userProfil);
						user.save().then(function(){
							user.getFermes().then(function(fermes){
								fermes[0].save().then(function(){
								});
							}).catch(function(err){
								console.log(err);
							});
							res.send(user);
						}).catch(function(err){
							console.log(err);
						});
				}).catch(function(err){
					console.log(err);
				});
			}
			else{
				console.log('accès non authentifié');
				res.send(404);
			}
	}
}
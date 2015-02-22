var models   	= require('../models/');

module.exports = {
	get: function (req, res, next) {
			if(req.user !== undefined){
				models.User.find(
					{
						where:	{id_user : req.user.id_user},
						include: [models.Ferme]
					}).then(function(user){
					res.send(user);
				}).catch(function(err){
					console.log(err);
				});
			}
			else{
				res.send(404);
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
						console.log('user avant modif : '+JSON.stringify(user.values));
						user.set(req.body.userProfil);
						console.log('user avant sauvegarde : '+JSON.stringify(user.values));
						user.save().then(function(){
							console.log('save ok  for '+JSON.stringify(user.values));
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
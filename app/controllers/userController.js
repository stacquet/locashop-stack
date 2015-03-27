var models   	= require('../models/');
var HttpStatus	= require('http-status-codes');
var winston		= require('winston');

module.exports = {
	get: function (req, res, next) {
			if(req.user !== undefined){
				models.User.find(
					{
						where:	{id_user : req.user.id_user},
						include: [models.Photo]
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
				models.sequelize.transaction().then(function (t) {
					models.User.find({	where:	{id_user : req.user.id_user},	include: [models.Photo]	},{transaction:t})
								.then(function(user){
									winston.log('info','saving user');
									user.set(req.body.userProfil);
									return user.save({transaction:t});
								})
								.then(function(user){
									winston.log('info','getting photo');
									return user.getPhoto({transaction:t});
								})
								.then(function(photo){
									winston.log('info','saving photo');
									return photo.save({transaction:t});
								})
								.then(function(){
									t.commit();
									res.status(HttpStatus.OK).send();
								})
								.catch(function(err){
									t.rollback();
									winston.log('error','error during chain : '+err);
									res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
								});
				
				});
			}
			else{
				console.log('accès non authentifié');
				res.status(HttpStatus.NOT_FOUND).send();
			}
	}
}
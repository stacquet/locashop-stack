var crypto 			= require('crypto');
var formidable 		= require('formidable');
var fs   			= require('fs-extra');
var HttpStatus		= require('http-status-codes');
var models   		= require('../models/');
var Promise 		= require("bluebird");
var logger			= require('../util/logger');
var util 			= require('util');
var config			= require('../../secret/config');

Promise.promisifyAll(crypto);
Promise.promisifyAll(fs);
Promise.promisifyAll(formidable);

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
		/* Sauvegarde du profil utilisateur : */
		logger.log('verbose','userController|save|sauvergarde des informations utilisateurs'); 
		var form = new formidable.IncomingForm();
		var photo_storage = config.photo_storage;
		var chemin_webapp = config.chemin_webapp;
		var id_photo; // futur id de la photo si upload
		var id_photo_old; //id de la photo du user avant pour pouvoir la supprimer
		var id_photo_old_storage;
		var req_user; // données du user reçues par le formulaire
		var db_user; // données du user en base
		var req_photo; // photo reçue
		var hash; // objet de hashage de la photo
		var md5; // md5 de la photo
		var myT; // Transaction MySQL
		logger.log('debug','userController|save|démarrage de transaction'); 
		models.sequelize.transaction()
		.then(function(t){
			logger.log('debug','userController|save|recherche du user en base'); 
			myT=t;
			return models.User.find({	where:	{id_user : req.user.id_user},
				include: [models.Photo]})
		})
		.then(function(user){
			if(user){
				db_user=user;
				if(user.dataValues.Photo){
				id_photo_old=user.getDataValue('id_photo');
				id_photo_old_storage=user.dataValues.Photo.dataValues.uuid;
				}
				logger.log('debug','userController|save|parse du formulaire'); 
				return form.parseAsync(req);
			}
		})
		.then(function(files) {
			req_user=JSON.parse(files[0].userProfil);
			req_photo=files[1];
			/* Si une photo est présente à l'upload on l'enregistre en base puis sur disque */
			if(files[1].file){
				logger.log('debug','userController|save|photo présente en upload');
				logger.log('debug','userController|save|calcul du md5');
				var fd = fs.createReadStream( files[1].file.path);
				hash = crypto.createHash('md5');
				hash.setEncoding('hex');
				fd.pipe(hash);
				return fd.onAsync('end')
				.then(function() {
					logger.log('debug','userController|save|insertion de la photo en base');
					hash.end();
					md5=hash.read();
					return models.Photo.build({
						titre 				: 'profil_'+req_user.id_user,
						description 		: 'photo de profil du user '+req_user.id_user,
						chemin_physique		: photo_storage,
						chemin_webapp		: chemin_webapp,
						md5					: md5
					}).save({transaction:myT})})
				.then(function(photo){
					logger.log('debug','userController|save|copie de la photo sur disque dur');
					id_photo=photo.dataValues.id_photo;
					var temp_path = files[1].file.path;
					var file_name = photo.dataValues.uuid+".jpg";
					return fs.copyAsync(temp_path, photo_storage + file_name)
				})
			}
		})			
		.then(function(){
			db_user.set(req_user);
			if(id_photo) db_user.setDataValue('id_photo',id_photo);
			logger.log('debug','userController|save|save user in database : ');
			return db_user.save({transaction:myT})
		})
		.then(function(){
			logger.log('debug','userController|save|on retrouve l\'ancienne photo en db');
			return models.Photo.find({	where:	{id_photo : id_photo_old}})
		})
		.then(function(photo){
			if(photo){
				logger.log('debug','userController|save|on supprime l\'ancienne photo en db');
				return photo.destroy({transaction:myT})
				.then(function(){
					logger.log('debug','userController|save|on supprime l\'ancienne photo du disque');
					return fs.unlinkAsync(photo_storage+'/'+id_photo_old_storage+'.jpg');
				})
			}
			else{
				logger.log('debug','userController|save|pas d\'ancienne photo à supprimer');				
			}
		})
		.then(function(){
			logger.log('debug','user : commit transaction');
			myT.commit();
			res.status(HttpStatus.OK).send()
		})
		.catch(function(err){
			myT.rollback();
			logger.log('error','error during user save : '+err);
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
		});
		}
	}
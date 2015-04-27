var crypto 			= require('crypto');
var formidable 		= require('formidable');
var fs   			= require('fs-extra');
var path			= require('path');
var HttpStatus		= require('http-status-codes');
var models   		= require('../models/');
var Promise 		= require("bluebird");
var logger			= require('../util/logger');
var config			= require('../../secret/config');

Promise.promisifyAll(crypto);
Promise.promisifyAll(fs);
Promise.promisifyAll(formidable);

module.exports = {
	//var adresse={};
	get: function (req, res, next) {
			models.User.find(
			{
				where:	{id_user : req.params.id},
				include: [models.Photo]
			}).then(function(user){
				res.status(HttpStatus.OK).send(user);
			}).catch(function(err){
				logger.log('error','userController|get| '+err);
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
			});
	},
	save: function (req, res, next) {
		/* Sauvegarde du profil utilisateur : */
		logger.log('verbose','userController|save|sauvergarde des informations utilisateurs'); 
		var form = new formidable.IncomingForm();
		var chemin_physique = config.chemin_physique;
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
			return models.User.find({	where:	{id_user : req.params.id},
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
			req_user=JSON.parse(files[0].user);
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
						chemin_physique		: chemin_physique,
						chemin_webapp		: chemin_webapp,
						md5					: md5
					}).save({transaction:myT})})
				.then(function(photo){
					logger.log('debug','userController|save|copie de la photo sur disque dur');
					id_photo=photo.dataValues.id_photo;
					var temp_path = files[1].file.path;
					var file_name = photo.dataValues.uuid+".jpg";
					return fs.copyAsync(temp_path, path.join(chemin_physique,file_name));
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
			if(id_photo){
				logger.log('debug','userController|save|on retrouve l\'ancienne photo en db');
				return models.Photo.find({	where:	{id_photo : id_photo_old}})
				.then(function(photo){
					if(photo){
						logger.log('debug','userController|save|on supprime l\'ancienne photo en db');
						return photo.destroy({transaction:myT})
						.then(function(){
							logger.log('debug','userController|save|on recherche l\'ancienne photo sur disque');
							return fs.ensureFileAsync(path.join(chemin_physique,id_photo_old_storage+'.jpg'));
						})
						.then(function(){
							logger.log('debug','userController|save|on supprime l\'ancienne photo du disque');
							return fs.unlinkAsync(path.join(chemin_physique,id_photo_old_storage+'.jpg'));
						})
					}
					else{
						logger.log('debug','userController|save|pas d\'ancienne photo à supprimer');				
					}
				})
			}
		})
		.then(function(){
			logger.log('debug','user : commit transaction');
			myT.commit();
			res.status(HttpStatus.OK).send()
		})
		.catch(function(err){
			myT.rollback();
			logger.log('error','error : '+err);
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
		});
	},
	
	adresse : {
		/* Sauvegarde ou MAJ de l'adresse de l'utilisateur. Pour cela, on recherche l'utilisateur et son adresse :
				- si on ne retrouve pas le user => 404
				- s'il n'a pas d'adresse :
					1. On créé l'adresse
					2. On assigne l'adresse au user
					3. On renvoie 200
				- s'il a une adresse :
					1. On créé la nouvelle adresse
					2. On associe la nouvelle adresse au user
					3. On supprime l'ancienne adresse
					4. On renvoie 200
		*/
		get : function (req, res, next) {
			logger.log('debug','get de l\'adresse d\'un utilisateur requête '+JSON.stringify(req.body));
			models.User.find({	where:	{id_user : req.params.id_user},	include: [models.Adresse]})
			.then(function(user){
				if(user){
					if(user.dataValues.Adresse){
						res.status(HttpStatus.OK).send(user.dataValues.Adresse.dataValues);
					}
					else{
						res.status(HttpStatus.NOT_FOUND).send();
					}
				}
				else{
					res.status(HttpStatus.NOT_FOUND).send();
				}
			})
		},
		save : function (req, res, next) {
			logger.log('debug','sauvegarde de l\'adresse d\'un utilisateur requête '+JSON.stringify(req.body));
			var req_id_user = req.params.id_user;
			var db_user;
			var old_id_adresse;
			var new_adresse={
				formatted_address 	: req.body.formatted_address,
				longitude 		: req.body.longitude,
				latitude		: req.body.latitude
			};
			var new_id_adresse;
			var myT;
			models.sequelize.transaction()
			.then(function(t){
				logger.log('debug','userController|adresse|save|recherche du user en base'); 
				myT=t;
				return models.User.find({	where:	{id_user : req.params.id_user},
					include: [models.Adresse]})
			})
			.then(function(user){
				db_user=user;
				old_id_adresse = user.getDataValue('id_adresse');
				logger.log('debug','userController|adresse|save|sauvegarde de la nouvelle adresse'); 
				return models.Adresse.build(
						new_adresse
					).save({transaction:myT})
			})
			.then(function(adresse){
				new_id_adresse = adresse.getDataValue('id_adresse');
				if(new_id_adresse) db_user.setDataValue('id_adresse',new_id_adresse);
				logger.log('debug','userController|save|save user in database : ');
				return db_user.save({transaction:myT})
			})
			.then(function(){
				if(old_id_adresse){
					logger.log('debug','userController|adresse|save|on retrouve l\'ancienne adresse en db');
					return models.Adresse.find({	where:	{id_adresse : old_id_adresse}})
					.then(function(adresse){
						if(adresse){
							logger.log('debug','userController|adresse|save|on supprime l\'ancienne adresse en db');
							return adresse.destroy({transaction:myT})
						}
						else{
							logger.log('debug','userController|adresse|save|pas d\'ancienne adresse à supprimer');				
						}
					})
				}
			})
			.then(function(){
				logger.log('debug','user|adresse : commit transaction');
				myT.commit();
				res.status(HttpStatus.OK).send();
			})
			.catch(function(err){
				myT.rollback();
				logger.log('error','error : '+err);
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
			});
		}
	},
	mobile : {
		/* Save or update of the user's mobile phone. To achieve this, we query the user :
				- if user not found => 404
				- if user has no mobile phone :
					1. We insert the mobile phone
					2. return 200
				- if user has an old mobile phone :
					1. We update the mobile phone, set mobile_valide to false and generate a new mobile_verification_token
					2. We send a message to the mobile phone
					4. return 200				
		*/
		get : function (req, res, next) {
			logger.log('debug','get du mobile d\' un utilisateur requête '+JSON.stringify(req.body));
			models.User.find({	where:	{id_user : req.params.id_user}})
			.then(function(user){
				if(user){
					res.status(HttpStatus.OK).send(user.dataValues);
				}
				else{
					res.status(HttpStatus.NOT_FOUND).send();
				}
			})
		},
		save : function (req, res, next) {
			logger.log('debug','sauvegarde du mobile d\'un utilisateur requête '+JSON.stringify(req.body));
			var req_id_user = req.params.id_user;
			var form_mobile = req.body.mobile;
			var db_user;
			var mobile_verification_token;
			var myT;
			if(/^\d{10}$/.test(form_mobile)){
				models.sequelize.transaction()
				.then(function(t){
					logger.log('debug','userController|mobile|save|query user'); 
					myT=t;
					return models.User.find({	where:	{id_user : req.params.id_user}})
				})
				.then(function(user){
					db_user=user;
					db_user.mobile=form_mobile;
					db_user.mobile_verified=false;
					var mobile_verification_token = Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)
						+''+Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10);
					db_user.mobile_verification_token=mobile_verification_token;
					logger.log('debug','userController|mobile|save|save mobile with new mobile_verification_token'); 
					return db_user.save({transaction:myT})
				})
				.then(function(){
					logger.log('debug','user|mobile : commit transaction');
					myT.commit();
					res.status(HttpStatus.OK).send();
				})
				.catch(function(err){
					myT.rollback();
					logger.log('error','error : '+err);
					res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
				});
			}
			else{
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('format mobile invalide');
			}
		},
		validate : function (req, res, next) {
			logger.log('debug','validation du mobile d\'un utilisateur requête '+JSON.stringify(req.body));
			
		}
	}
}
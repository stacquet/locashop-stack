var crypto 			= require('crypto');
var formidable 		= require('formidable');
var fs   			= require('fs-extra');
var HttpStatus		= require('http-status-codes');
var models   		= require('../models/');
var Promise 		= require("bluebird");
var winston			= require('winston');
var util 			= require('util');

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
		var form = new formidable.IncomingForm();

		var id_photo; // futur id de la photo si upload
		var req_user; // données du user reçues par le formulaire
		var req_photo; // photo reçue
		var hash; // objet de hashage de la photo
		var md5; // md5 de la photo
		var myT; // Transaction MySQL
		form.parseAsync(req)
			.then(function(files) {
				req_user=JSON.parse(files[0].userProfil);
				req_photo=files[1];
				/* Si une photo est présente à l'upload on l'enregistre en base puis sur disque */
				if(files[1].file){
					var new_location = 'c:/locashop/storage/';
					return models.sequelize.transaction()
					.then(function (t){
						myT=t;   
						var fd = fs.createReadStream( files[1].file.path);
						hash = crypto.createHash('md5');
						hash.setEncoding('hex');
						fd.pipe(hash);

						return fd.onAsync('end')
					})
					.then(function() {
						hash.end();
						md5=hash.read();
						console.log('mon md5 : '+md5); 	
						winston.log('debug','photo : insertion en base avec le md5 : '+md5);
						return models.Photo.build({
							titre 				: 'profil_'+req_user.id_user,
							description 		: 'photo de profil du user '+req_user.id_user,
							chemin_physique		: new_location,
							md5					: md5
						}).save({transaction:myT})})
					.then(function(photo){
						winston.log('debug','photo : copie sur disque dur');
						id_photo=photo.dataValues.id_photo;
						var temp_path = files[1].file.path;
						/* The file name of the uploaded file */
						var file_name = photo.dataValues.uuid+".jpg";
						/* Location where we want to copy the uploaded file */
						return fs.copyAsync(temp_path, new_location + file_name)
					})
					.then(function(){
						winston.log('debug','photo : commit transaction');
						return myT.commit();
					})
					.catch(function(err){
						t.rollback();
						winston.log('error','error during photo save : '+err);
						res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
					});
				}
			})
			.then(function(){
				winston.log('debug','user : démarrage transaction');
				return models.sequelize.transaction()
			})
			.then(function (t) {
				myT=t;
				winston.log('debug','user : get user in database');
				return models.User.find({	where:	{id_user : req_user.id_user}},{transaction:t})
			})		
			.then(function(user){
				winston.log('debug','user : save user in database id_photo : ',id_photo);
				user.set(req_user);
				user.setDataValue('id_photo',id_photo);
				return user.save({transaction:myT})
			})
			.then(function(){
				winston.log('debug','user : commit transaction');
				myT.commit();
				res.status(HttpStatus.OK).send()
			})
			.catch(function(err){
				t.rollback();
				winston.log('error','error during user save : '+err);
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
			});
		}
	}
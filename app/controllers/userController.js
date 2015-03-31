var Promise = require("bluebird");
var models   	= require('../models/');
var HttpStatus	= require('http-status-codes');
var winston		= require('winston');
var formidable 		= require('formidable');
var fs   = require('fs-extra');
var crypto = require('crypto');

Promise.promisifyAll(crypto);
Promise.promisifyAll(fs);
Promise.promisifyAll(formidable);
var util = require('util');

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
		form.parseAsync(req).bind({})
			.then(function(files) {
				this.req_user=JSON.parse(files[0].userProfil);
				this.req_photo=files[1];
				/* Si une photo est présente à l'upload on l'enregistre en base puis sur disque */
				if(files[1].file){
					var that = this;
					var new_location = 'c:/locashop/storage/';
					models.sequelize.transaction()
						.then(function (t){
							this.t=t;   
							var fd = fs.createReadStream( files[1].file.path);
							this.md5 = crypto.createHash('md5');
							hash.setEncoding('hex');

							fd.onAsync('end').then(function() {
								hash.end();
								console.log('mon md5 : '+hash.read()); // the desired sha1sum
							});
							// read all file and pipe it (write it) to the hash object
							fd.pipe(hash);
						})
						.then(function (t) {
							winston.log('info','photo : insertion en base avec le md5 : '+this.md5);
							return models.Photo.build({
								titre 				: 'profil_'+that.req_user.id_user,
								description 		: 'photo de profil du user '+that.req_user.id_user,
								chemin_physique		: new_location,
								md5					: that.md5
							}).save({transaction:this.t})})
						.then(function(photo){
							winston.log('info','photo : copie sur disque dur');
							that.id_photo=photo.dataValues.id_photo;
							var temp_path = files[1].file.path;
							/* The file name of the uploaded file */
							var file_name = photo.dataValues.uuid+".jpg";
							/* Location where we want to copy the uploaded file */
							return fs.copyAsync(temp_path, new_location + file_name)
						})
						.then(function(){
						winston.log('info','photo : commit transaction');
							return this.t.commit();
						});
				}
			})
			.then(function(){
				winston.log('info','user : démarage transaction');
				return models.sequelize.transaction()
			})
			.then(function (t) {
				this.t=t;
				winston.log('info','user : get db user');
				return models.User.find({	where:	{id_user : this.req_user.id_user}},{transaction:t})
			})		
			.then(function(user){
				winston.log('info','user : save db');
				user.set(this.req_user);
				winston.log('info',this.id_photo);
				user.setDataValue('id_photo',this.id_photo);
				return user.save({transaction:this.t})
			})
			.then(function(){
				winston.log('info','user : commit transaction');
				this.t.commit();
				res.status(HttpStatus.OK).send()
			});
			/*.catch(function(err){
						t.rollback();
						winston.log('error','error during chain : '+err);
						res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
					});*/
	}
}
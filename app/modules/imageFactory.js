var crypto 				= require('crypto');
var fs   				= require('fs-extra');
var path				= require('path');
var Promise 			= require('bluebird');
var logger				= require('../util/logger');
var models   			= require('../models/');
var transactionManager	= require(process.env.PWD+'/app/modules/transactionManager');

var ImageFactory = {}

ImageFactory.getImageById = function(id_photo){
	return new Promise(function(resolve,reject){
		if(id_photo){
			models.Photo.find({	where:	{id_photo : id_photo}})
				.then(function(photo){
					resolve(photo);
				})
		}
		else {
			reject(new Error('no id_photo passed or id_photo null'))
		}
	});
}

ImageFactory.createImage = function(image,myT){
	return new Promise(function(resolve,reject){
		var shouldCommit= (myT?false:true);
		var id_photo;
		if(image && image.temp_path && image.chemin_physique && image.chemin_webapp){
			transactionManager.getTransaction(myT)
				.then(function(){
					logger.log('debug','modules|imageFactory|createImage|read md5 from temp file');
					var fd = fs.createReadStream( image.temp_path);
					hash = crypto.createHash('md5');
					hash.setEncoding('hex');
					fd.pipe(hash);
					return fd.onAsync('end')
				.then(function() {
					logger.log('debug','modules|imageFactory|createImage|insert picture in DB');
					hash.end();
					md5=hash.read();
					return models.Photo.build({
						titre 				: image.titre,
						description 		: image.description,
						chemin_physique		: image.chemin_physique,
						chemin_webapp		: image.chemin_webapp,
						md5					: md5
					}).save({transaction:myT})})
				.then(function(photo){
					logger.log('debug','modules|imageFactory|createImage|copy image on disk');
					id_photo=photo.dataValues.id_photo;
					var file_name = photo.dataValues.uuid+".jpg";
					return fs.copyAsync(temp_path, path.join(image.chemin_physique,file_name));
				})
				.then(function(){
					logger.log('debug','user : commit transaction');
					if(shouldCommit) myT.commit();
					resolve(id_photo);
				})
				.catch(function(err){
					reject(new Error(err))
				})
			});
				
		}		
		else {
			reject(new Error('no id_photo passed or id_photo null'))
		}
	});
}


var ImageInstance = function(opts){
	this.recipient=[];
	this.type="ImageInstance";
	if(opts){
		for(var opt in opts){
			this[opt]=opts[opt];
		}
	} 
}
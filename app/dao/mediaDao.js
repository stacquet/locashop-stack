module.exports = {

	/* Retourne un media par son id */
	getMediaById : function(id,callback){
		if(typeof(id) == 'number'){
			var myQuery = "select titre,chemin_physique from ref_user where id_media="+id;
			global.mysqlPool.query(myQuery, function(err, rows) {
			if (err)	return callback(err);
			return callback(null,rows);
			});
		}
		else{
			return callback('id '+id+' n\'est pas un nombre',null);
		}
	},

	/* Insert un media ou le met à jour */
	setMedia : function(media,callback){
		/* On teste si le media a un id, alors on est en mode update, sinon en mode insert */
		var myQuery = '';
		if(media.id === undefined){
			/* MODE INSERT */
			myQuery = "insert into media(uuid,titre,description,chemin_physique)"+
			"values(uuid(),'"+media.titre+"','"+media.description+"','"+media.chemin_physique+"')";
			global.mysqlPool.query(myQuery, function(err, rows) {
				if (err)	return callback(errnull);
				callback(null,rows.insertId);
			});
		}
		else{
			/* MODE UPDATE */
			myQuery="update media m set m.uuid="
			myQuery= "select id,uuid,titre,description,chemin_physique from media where id='"+id+"'";
			global.mysqlPool.query(myQuery, function(err, rows) {
				if (err)	return callback(errnull);
				callback(null,rows[0]);
			});
		}
	}
}
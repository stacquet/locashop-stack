module.exports = {

	/* Retourne la liste de tous les utilisateurs sans filtres */
	getUsers : function(callback){
		global.mysqlPool.query("select * from ref_user ", function(err, rows) {
			if (err)	return callback(err);
			return callback(null,rows);
		});
	}
}
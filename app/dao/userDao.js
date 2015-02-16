module.exports = {

	/* Retourne la liste de tous les utilisateurs sans filtres */
	getUsers : function(callback){
		global.mysqlPool.query("select * from ref_user ", function(err, rows) {
			if (err)	return callback(err);
			return callback(null,rows);
		});
	},

	/* Retourne un user par son id */
	getUserById : function(id,callback){
		if(typeof(id) == "number"){
			var myQuery = "insert into id values("+id+")";
			//console.log(myQuery);
			global.mysqlPool.query(myQuery, function(err, rows) {
			if (err)	return callback(err);
			return callback(null,rows);
		});
		}
		
	}
}
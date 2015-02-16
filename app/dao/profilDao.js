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
			var myQuery = "select * from ref_user where id_user="+id;
			//console.log(myQuery);
			global.mysqlPool.query(myQuery, function(err, rows) {
			if (err)	return callback(err);
			return callback(null,rows);
			});
		}
		else{
			return callback('id '+id+' n\'est pas un nombre',null);
		}
		
	}
}
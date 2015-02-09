var UserDao = require('../dao/UserDao');
module.exports = {

	getUsersList : function(callback){
		UserDao.getUsers(function(err,users){
			if (err)	return callback(err);
			return callback(null,users);
		});			
	},
		
	delete : function(idUser,callback){
				global.mysqlPool.query("delete from ref_user where id_user='"+idUser+"'", function(err, rows) {
						if(err){
							return callback(null,err);
						}
						return callback(rows);
				});
	},
		
	isLoggedIn : function(req, res, next) {
		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated()){
			console.log('identifie !');
			return next();
		}
		console.log('non identifie !');

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}
		
}

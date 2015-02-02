module.exports = function(){
	var User = {};
	User.getUsersList = function(callback){
				global.mysqlPool.query("select * from users ", function(err, rows) {
							if (err){
								return callback(err);
							}
							return callback(rows);
				});
		};
		
	User.delete = function(idUser,callback){
				global.mysqlPool.query("delete from users where id='"+idUser+"'", function(err, rows) {
						if(err){
							return callback(err);
						}
						return callback(rows);
				});
		};
		
	User.isLoggedIn = function(req, res, next) {
		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated()){
			console.log('identifie !');
			return next();
		}
		console.log('non identifie !');

		// if they aren't redirect them to the home page
		res.redirect('/login');
	};
	
	return User;
		
};
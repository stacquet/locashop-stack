module.exports = function() {
		var Inscription={};
		Inscription.checkEmailAvailable = function(email,callback){
			if(email){
				global.mysqlPool.query("select * from users where username = " + global.mysqlPool.escape(email), function(err, rows) {
							if (err){
								return callback(err);
							}
							if (rows.length) {
								return callback(false);
							}
							else{
								return callback(true);
							}
				});
			}
			else{
				return callback(false);
			}
		};

		return Inscription;

};
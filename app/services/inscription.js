var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = {
		checkEmailAvailable : function(email,callback){
			if(email){
				connection.query("select * from users where username = " + connection.escape(email), function(err, rows) {
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
		}

};
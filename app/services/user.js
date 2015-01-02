var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = {
		getUsersList : function(callback){
				connection.query("select * from users ", function(err, rows) {
							if (err){
								return callback(err);
							}
							return callback(rows);
				});
		}
};
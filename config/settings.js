var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT || 3000,
  database   : {
    protocol : "mysql", // or "mysql"
    query    : { pool: true },
    host     : "localhost",
    database : "locashop",
    user     : "root",
    password : "root"
  }
};

module.exports = settings;

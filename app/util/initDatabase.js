"use strict";

var fs        = require("fs");
var async     = require('async')
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/../../secret/config');
var sequelize = new Sequelize(config.database, config.user, config.password, {
  dialectOptions: {
    multipleStatements: true
  }
  ,logging:false
}); 

module.exports = {
  init: function(done) {
    //var db = migration.migrator.sequelize;
    console.log('going to recreate database');
    async.waterfall([
      function(cb){
        fs.readFile('/locashop/config/create_db.sql', function(err, data){
          if (err) throw err;
          cb(null, data.toString());
        });
      },

      function(initialSchema, cb){
        // need to split on ';' to get the individual CREATE TABLE sql
        // as db.query can execute on query at a time
        sequelize.query(initialSchema)
          .then(function(success){
            //console.log(success);
            cb(null,'ok');
          },function(failure){
            console.log(failure);
            cb(failure,'ko');
          });
      },

      function(ok,cb){
        fs.readFile('/locashop/config/insert_db.sql', function(err, data){
          if (err) throw err;
          cb(null, data.toString());
        });
      },

      function(initialData, cb){
        // need to split on ';' to get the individual CREATE TABLE sql
        // as db.query can execute on query at a time
        sequelize.query(initialData)
          .then(function(success){
            //console.log(success);
            cb(null,'ok');
          },function(failure){
            console.log(failure);
            cb(failure,'ko');
          });
      }
    ], done);
  }
}
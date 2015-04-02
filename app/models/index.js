"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var logger    = require('../util/logger');
var config    = require('../../secret/config');
var sequelize = new Sequelize(config.db_database, config.db_user, config.db_password, {logging : logger.debug});
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".js") !== -1) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
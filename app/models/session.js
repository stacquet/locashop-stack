"use strict";

module.exports = function(sequelize, Sequelize) {
  var Session = sequelize.define("Session", {
    session_id : { 
      type : Sequelize.STRING(255),
      primaryKey:true
    },
    expires : Sequelize.INTEGER,
    data	: Sequelize.TEXT
  },
  {
    timestamps: false,
    tableName : 'sessions'
  });

  return Session;
};
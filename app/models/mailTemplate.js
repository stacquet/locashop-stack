"use strict";

module.exports = function(sequelize, Sequelize) {
  var MailTemplate = sequelize.define("MailTemplate", {
    id_mail_template : { 
      type : Sequelize.STRING(20),
      primaryKey:true
    },
	statut							: Sequelize.INTEGER,
	object							: Sequelize.STRING(300),
	content							: Sequelize.STRING(4000)
	},
  {
    timestamps: true,
    tableName : 'mail_template'
  });

  return MailTemplate;
};
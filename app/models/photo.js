"use strict";

module.exports = function(sequelize, Sequelize) {
  var Photo = sequelize.define("Photo", {
    id_photo : { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    uuid 				: {
      type    : Sequelize.UUID(),
      defaultValue: Sequelize.UUIDV1
    },
	  titre 				: Sequelize.STRING(45),
	  description 		: Sequelize.STRING(512),
	  chemin_physique		: Sequelize.STRING(512),
    chemin_webapp   : Sequelize.STRING(512),
    md5			: Sequelize.STRING(256)
	  },
  {
    timestamps: true,
    tableName : 'photo',
    classMethods: {
      associate: function(models) {
        Photo.hasOne(models.User, {
          foreignKey: 'id_photo'
        });
      }
    }
  });

  return Photo;
};
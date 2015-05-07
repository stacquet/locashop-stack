"use strict";

module.exports = function(sequelize, Sequelize) {
  var Profil = sequelize.define("Profil", {
    id_profil : { 
      type : Sequelize.STRING(20),
      primaryKey:true
    },
	  lib_profil 				: Sequelize.STRING(45),
	  description 				: Sequelize.STRING(512),
	  chemin_physique			: Sequelize.STRING(512),
      user_modif   				: Sequelize.INTEGER
	  },
  {
    timestamps: true,
    tableName : 'profil',
    classMethods: {
      associate: function(models) {
        Profil.hasOne(models.User, {
          foreignKey: 'id_profil'
        });
      }
    }
  });

  return Profil;
};
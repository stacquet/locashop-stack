"use strict";

module.exports = function(sequelize, Sequelize) {
  var Gloria = sequelize.define("Gloria", {
    id_media : { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    uuid 				: Sequelize.UUID(),
	titre 				: Sequelize.STRING(45),
	description 		: Sequelize.STRING(512),
	chemin_physique		: Sequelize.STRING(512),
    date_modif 			: Sequelize.DATE
  },
  {
    timestamps: false,
    tableName : 'media',
    /*classMethods: {
      associate: function(models) {
        Ferme.belongsToMany(models.User, {
          through: 'ferme_user',
          foreignKey: 'id_ferme'
        });
      }
    }*/
  });

  return Gloria;
};
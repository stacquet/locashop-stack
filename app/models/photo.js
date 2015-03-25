"use strict";

module.exports = function(sequelize, Sequelize) {
  var Photo = sequelize.define("Photo", {
    id_photo : { 
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
    tableName : 'photo',
    /*classMethods: {
      associate: function(models) {
        Ferme.belongsToMany(models.User, {
          through: 'ferme_user',
          foreignKey: 'id_ferme'
        });
      }
    }*/
  });

  return Photo;
};
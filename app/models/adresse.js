"use strict";

module.exports = function(sequelize, Sequelize) {
  var Adresse = sequelize.define("Adresse", {
    id_adresse : { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
	  adresse_complete 				: Sequelize.STRING(500),
	  coordonnee_x 					: Sequelize.DECIMAL,
	  coordonnee_y					: Sequelize.DECIMAL
	  },
  {
    timestamps: true,
    tableName : 'adresse',
    classMethods: {
      associate: function(models) {
        Adresse.hasOne(models.User, {
          foreignKey: 'id_adresse'
        });
      }
    }
  });

  return Adresse;
};
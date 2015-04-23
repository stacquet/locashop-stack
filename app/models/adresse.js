"use strict";

module.exports = function(sequelize, Sequelize) {
  var Adresse = sequelize.define("Adresse", {
    id_adresse : { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
	  formatted_address 			: Sequelize.STRING(500),
	  coordonnee_x 					: Sequelize.DECIMAL(20,17),
	  coordonnee_y					: Sequelize.DECIMAL(20,17)
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
"use strict";

module.exports = function(sequelize, Sequelize) {
  var Producteur = sequelize.define("Producteur", {
    id_user: { 
      type : Sequelize.INTEGER,
      primaryKey:true
    }
  },
  {
    timestamps: false,
    tableName : 'producteur',
    classMethods: {
      associate: function(models) {
        Producteur.belongsTo(models.Ferme,{
          foreignKey: 'id_ferme'
        });
      }
    }
  });

  return Producteur;
};
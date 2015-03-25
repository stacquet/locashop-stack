"use strict";

module.exports = function(sequelize, Sequelize) {
  var Ferme = sequelize.define("Ferme", {
    id_ferme : { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    id_adresse_livraison : Sequelize.INTEGER,
    presentation_ferme : Sequelize.STRING(2000),
    presentation_produits : Sequelize.STRING(2000),
    presentation_methode : Sequelize.STRING(2000),
    date_modif : Sequelize.DATE,
    user_modif : Sequelize.INTEGER
  },
  {
    timestamps: false,
    tableName : 'ferme',
    classMethods: {
      associate: function(models) {
        /*Ferme.belongsToMany(models.User, {
          through: 'ferme_user',
          foreignKey: 'id_ferme'
        });*/
          Ferme.hasMany(models.User,{
              through: 'ferme_user',
              foreignKey: 'id_user'
          })
      }
    }
  });

  return Ferme;
};
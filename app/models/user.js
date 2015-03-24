"use strict";

module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define("User", {
    id_user: { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    id_profil                 : Sequelize.STRING,
    id_adresse                : Sequelize.INTEGER,
    id_media                  : Sequelize.INTEGER,
    id_facebook               : Sequelize.STRING,
    token                     : Sequelize.STRING(500),
    email                     : Sequelize.STRING,
    email_valide              : Sequelize.INTEGER,
    email_verification_token  : Sequelize.STRING,
    mobile                    : Sequelize.STRING,
    mobile_valide             : Sequelize.INTEGER,
    nom                       : Sequelize.STRING,
    prenom                    : Sequelize.STRING,
    password                  : Sequelize.STRING,
    password_change_token     : Sequelize.STRING,
    date_modif                : Sequelize.DATE
  },
  {
    timestamps: false,
    tableName : 'user',
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Ferme, {
          through: 'ferme_user',
          foreignKey: 'id_user'
        });
        User.hasOne(models.Gloria, {
          foreignKey: 'id_media'
        });
      }
    }
  });

  return User;
};
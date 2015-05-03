"use strict";

module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define("User", {
    id_user: { 
      type : Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    id_profil                                 : Sequelize.STRING,
    id_adresse                                : Sequelize.INTEGER,
    id_photo                                  : Sequelize.INTEGER,
    id_facebook                               : Sequelize.STRING,
    token                                     : Sequelize.STRING(500),
    email                                     : Sequelize.STRING,
    email_verified                            : Sequelize.INTEGER,
    email_verification_token                  : Sequelize.STRING,
    mobile                                    : Sequelize.STRING,
    mobile_verified                           : Sequelize.BOOLEAN,
    mobile_verification_token                 : Sequelize.STRING,
    mobile_verification_fail_attempts         : Sequelize.INTEGER,
    nom                                       : Sequelize.STRING,
    prenom                                    : Sequelize.STRING,
    age                                       : Sequelize.INTEGER,
    password                                  : Sequelize.STRING,
    password_change_token                     : Sequelize.STRING
	},
  {
    timestamps: true,
    tableName : 'user',
    classMethods: {
      associate: function(models) {
        /*User.belongsTo(models.Ferme,{
          through: 'ferme_user',
          foreignKey: 'id_ferme'
        });*/
        User.belongsTo(models.Photo,{
    			foreignKey: 'id_photo'
    		});
		User.belongsTo(models.Adresse,{
    			foreignKey: 'id_adresse'
    		});
      }
    }
  });

  return User;
};
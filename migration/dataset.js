var logger			= require(process.env.PWD+'/app/util/logger.js');
var models   		= require(process.env.PWD+'/app/models/');

var dataset = {};

dataset.initData = initData;
dataset.createDB = createDB;

function initData(){
	logger.log('info','DB POPULATE !');
	logger.log('debug','dataset|initData|initialisation des données START'); 
	return models.Profil.bulkCreate([
		  { id_profil: 'P_ROOT', lib_profil: 'Administrateur technique' },
		  { id_profil: 'P_CONSOMMATEUR', lib_profil: 'Profil consommateur' },
		  { id_profil: 'P_PRODUCTEUR', lib_profil: 'Profil producteur' },
		  { id_profil: 'P_ADMIN', lib_profil: 'Administrateur fonctionnel' }
		])
		.then(function(){
			return models.User.bulkCreate([
			  { id_user: '1', id_profil: 'P_PRODUCTEUR', email:'sylvain.tacquet@gmail.com', password : '$2a$10$z/0YmnwaAjmkhnNUU1pZPeWO5NvbqnOBMPnBcVgeDJpd8RGKsEkTS' }
			])
		})
		.then(function(){
			return models.MailTemplate.bulkCreate([
			{
				id_mail_template : 'RESET_PASSWORD', 
				object : 'LOCASHOP : Réinitialisation du mot de passe', 
				content : 'Bonjour,<br><br>Suite à votre demande de réinitialisation de mot de passe, veuillez cliquer sur le lien : [URL_RESET_PASSWORD] et suivre les instructions.<br><br><br>Cordialement,<br><span style=font-weight: bold;>Equipe Locashop</span><br><br>Ceci est un mail automatique. Merci de ne pas y répondre.'
			}
			])
		})
		.then(function(){
			logger.log('debug','dataset|initData|initialisation des données END'); 
		});
	
}

function createDB(){
	logger.log('info','DB CREATION !');
	logger.log('debug','dataset|createDB|création des tables START'); 
	return models.sequelize.sync({force: true})
		.then(function(){
			logger.log('debug','dataset|createDB|création des tables END');
		})
}

module.exports = dataset;
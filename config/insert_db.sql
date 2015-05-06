START TRANSACTION;

INSERT INTO ref_profil (id_profil, lib_profil, date_modif, user_modif) 
VALUES 
	('P_ROOT', 'Administrateur technique', NULL, NULL),
	('P_CONSOMMATEUR', 'Profil consommateur', NULL, NULL),
	('P_PRODUCTEUR', 'Profil producteur', NULL, NULL),
	('P_ADMIN', 'Administrateur fonctionnel', NULL, NULL)
ON DUPLICATE KEY UPDATE
	lib_profil=VALUES(lib_profil),
	date_modif=VALUES(date_modif),
	user_modif=VALUES(user_modif);


/*INSERT INTO `photo`(`id_photo`,`uuid`,`titre`,`description`,`chemin_physique`)
VALUES(1,uuid(),'profil_1','','c:/locashop/storage/');*/

INSERT INTO user (id_user,id_profil,id_photo,id_adresse,email,mobile,nom,prenom,password)
VALUES 
	(1,'P_PRODUCTEUR',NULL,NULL,'sylvain.tacquet@gmail.com',NULL,NULL,NULL,'$2a$10$z/0YmnwaAjmkhnNUU1pZPeWO5NvbqnOBMPnBcVgeDJpd8RGKsEkTS')
;

INSERT INTO producteur (id_user) VALUES (1);

INSERT INTO ferme(id_ferme,id_adresse_livraison,presentation_ferme,presentation_produits,presentation_methode,date_modif,user_modif)
VALUES (1,null,'presentation_ferme','presentation_produits','presentation_methode',null,null);

INSERT INTO ferme_producteur (id_ferme,id_user)
VALUES(1,1);

INSERT INTO mail_template(id_mail_template,object,content) 
VALUES ('RESET_PASSWORD','LOCASHOP : Réinitialisation du mot de passe','Bonjour,<br><br>Suite à votre demande de réinitialisation de mot de passe, veuillez cliquer sur le lien : [URL_APPLICATION] et suivre les instructions.<br><br><br>Cordialement,<br><span style="font-weight: bold;">Equipe Locashop</span><br><br>Ceci est un mail automatique. Merci de ne pas y répondre.');

COMMIT;
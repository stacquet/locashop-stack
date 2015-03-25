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


INSERT INTO `photo`(`id_photo`,`uuid`,`titre`,`description`,`chemin_physique`,`date_modif`)
VALUES(1,uuid(),'profil_1','','c:/locashop/storage/',now());

INSERT INTO user (id_user,id_profil,id_photo,id_adresse,email,mobile,nom,prenom,password,date_modif)
VALUES 
	(1,'P_CONSOMMATEUR',1,NULL,'sylvain.tacquet@gmail.com',NULL,NULL,NULL,'$2a$10$z/0YmnwaAjmkhnNUU1pZPeWO5NvbqnOBMPnBcVgeDJpd8RGKsEkTS',NULL)
;

INSERT INTO ferme
(id_ferme,id_adresse_livraison,presentation_ferme,presentation_produits,presentation_methode,date_modif,user_modif)
VALUES
(1,null,'presentation_ferme','presentation_produits','presentation_methode',null,null);

INSERT INTO ferme_user
(id_ferme,id_user)
VALUES
(1,1);
COMMIT;
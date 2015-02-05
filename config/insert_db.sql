START TRANSACTION;

DELETE FROM panier_details;
DELETE FROM panier;
DELETE FROM producteur_catalogue_details;
DELETE FROM producteur_catalogue;
DELETE FROM ref_user;
DELETE FROM rel_conditionnement_produit;
DELETE FROM ref_produit;
DELETE FROM ref_produit_sous_famille;
DELETE FROM ref_profil;
DELETE FROM ref_conditionnement;
DELETE FROM ref_produit_famille;
DELETE FROM ref_adresse;

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

INSERT INTO ref_user (id_user,id_profil,id_adresse,email,mobile,nom,prenom,password,date_modification)
VALUES 
	(1,'P_CONSOMMATEUR',NULL,'sylvain.tacquet@gmail.com',NULL,NULL,NULL,'$2a$10$Uqh0QVK7GYuZ25hm5/jEceg/rrG1Gfgkr2uVTwtNlRDp1VGyjWAa6',NULL)
ON DUPLICATE KEY UPDATE
	id_profil=VALUES(id_profil),
	id_adresse=VALUES(id_adresse),
	email=VALUES(email),
	mobile=VALUES(mobile),
	nom=VALUES(nom),
	prenom=VALUES(prenom),
	password=VALUES(password),
	date_modification=VALUES(date_modification)
;
COMMIT;
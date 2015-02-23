START TRANSACTION;

INSERT INTO ref_profil (id_profil, lib_profil, date_modif, user_modif) 
VALUES 
	('P_ROOT', 'Administrateur technique', NULL, NULL),
	('P_CONSOMMATEUR', 'Profil consommateur', NULL, NULL),
	('P_PRODUCTEUR', 'Profil producteur', NULL, NULL),
	('P_ADMIN', 'Administrateur fonctionnel', NULL, NULL);

INSERT INTO user (id_user,id_profil,id_adresse,email,mobile,nom,prenom,password,date_modif)
VALUES 
	(1,'P_CONSOMMATEUR',NULL,'sylvain.tacquet@gmail.com',NULL,NULL,NULL,'$2a$10$Uqh0QVK7GYuZ25hm5/jEceg/rrG1Gfgkr2uVTwtNlRDp1VGyjWAa6',NULL)
;

INSERT INTO ferme
(id_ferme,id_adresse_livraison,presentation_ferme,presentation_produits,presentation_methode,date_modif,user_modif)
VALUES
(1,null,'presentation_ferme','presentation_produits','presentation_methode',null,null);

INSERT INTO ferme_user(id_ferme,id_user,date_modif)
VALUES 
(1,1,now());

COMMIT;
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

COMMIT;
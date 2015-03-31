DROP DATABASE IF EXISTS locashop;
CREATE DATABASE locashop  CHARACTER SET utf8;
USE locashop;
CREATE TABLE ref_adresse (
  id_adresse INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(45) NULL,
  complement_nom VARCHAR(45) NULL,
  complement_adresse VARCHAR(45) NULL,
  voie VARCHAR(45) NULL,
  bp VARCHAR(45) NULL,
  cp VARCHAR(5) NULL,
  ville VARCHAR(45) NULL,
  pays VARCHAR(45) NULL,
  coordonnee_x VARCHAR(45) NULL,
  coordonnee_y VARCHAR(45) NULL,
  PRIMARY KEY (id_adresse))
ENGINE = InnoDB;

CREATE TABLE photo (
  id_photo INT NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(100) NULL,
  titre VARCHAR(45) NULL,
  description VARCHAR(512) NULL,
  chemin_physique VARCHAR(512) NULL,
  md5	VARCHAR(256) NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY (id_photo));

CREATE TABLE ref_produit_famille (
  id_produit_famille INT NOT NULL AUTO_INCREMENT,
  lib_produit_famille VARCHAR(100) NULL,
  PRIMARY KEY (id_produit_famille))
ENGINE = InnoDB;

CREATE TABLE ref_conditionnement (
  id_conditionnement INT NOT NULL,
  lib_conditionnement VARCHAR(100) NULL,
  PRIMARY KEY (id_conditionnement))
ENGINE = InnoDB;

CREATE TABLE ref_profil (
  id_profil VARCHAR(45) NOT NULL,
  lib_profil VARCHAR(200) NULL,
  date_modif DATETIME NULL,
  user_modif VARCHAR(45) NULL,
  PRIMARY KEY (id_profil))
ENGINE = InnoDB;

CREATE TABLE ref_produit_sous_famille (
  id_produit_sous_famille INT NOT NULL AUTO_INCREMENT,
  id_produit_famille INT NOT NULL,
  lib_produit_sous_famille VARCHAR(100) NULL,
  PRIMARY KEY (id_produit_sous_famille),
  INDEX fk_produit_sous_famille_produit_famille1_idx (id_produit_famille ASC),
  CONSTRAINT fk_produit_sous_famille_produit_famille1
    FOREIGN KEY (id_produit_famille)
    REFERENCES ref_produit_famille (id_produit_famille)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE ref_produit (
  id_produit INT NOT NULL AUTO_INCREMENT,
  id_produit_sous_famille INT NOT NULL,
  lib_produit VARCHAR(100) NULL,
  PRIMARY KEY (id_produit),
  INDEX fk_ref_produit_ref_produit_sous_famille1_idx (id_produit_sous_famille ASC),
  CONSTRAINT fk_ref_produit_ref_produit_sous_famille1
    FOREIGN KEY (id_produit_sous_famille)
    REFERENCES ref_produit_sous_famille (id_produit_sous_famille)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE rel_conditionnement_produit (
  id_conditionnement_produit INT NOT NULL AUTO_INCREMENT,
  id_conditionnement INT NOT NULL,
  id_produit INT NOT NULL,
  INDEX fk_rel_conditionnement_produit_ref_conditionnement1_idx (id_conditionnement ASC),
  INDEX fk_rel_conditionnement_produit_ref_produit1_idx (id_produit ASC),
  PRIMARY KEY (id_conditionnement_produit),
  UNIQUE INDEX un_rel_cond_produit (id_conditionnement ASC, id_produit ASC),
  CONSTRAINT fk_rel_conditionnement_produit_ref_conditionnement1
    FOREIGN KEY (id_conditionnement)
    REFERENCES ref_conditionnement (id_conditionnement)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_rel_conditionnement_produit_ref_produit1
    FOREIGN KEY (id_produit)
    REFERENCES ref_produit (id_produit)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table ref_user
-- -----------------------------------------------------
CREATE TABLE user (
  id_user INT NOT NULL AUTO_INCREMENT,
  id_profil VARCHAR(45) NOT NULL,
  statut TINYINT NULL,
  id_adresse INT NULL,
  id_photo INT NULL,
  id_facebook VARCHAR(100) NULL,
  token VARCHAR(500) NULL,
  email VARCHAR(200) NOT NULL,
  email_valide TINYINT NULL,
  email_verification_token VARCHAR(200) NULL,
  mobile VARCHAR(45) NULL,
  mobile_valide TINYINT NULL,
  nom VARCHAR(45) NULL,
  prenom VARCHAR(45) NULL,
  password VARCHAR(100) NULL,
  password_change_token VARCHAR(200) NULL,
  createdAt DATETIME NULL,
  updatedAt DATETIME NULL,
  PRIMARY KEY (id_user),
  UNIQUE INDEX email_UNIQUE (email ASC),
  INDEX fk_ref_user_ref_profil1_idx (id_profil ASC),
  INDEX fk_ref_user_ref_adresse1_idx (id_adresse ASC),
  INDEX fk_ref_user_photo_idx (id_photo ASC),
  CONSTRAINT fk_ref_user_ref_profil1
    FOREIGN KEY (id_profil)
    REFERENCES ref_profil (id_profil)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_ref_user_photo
    FOREIGN KEY (id_photo)
    REFERENCES photo (id_photo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_ref_user_ref_adresse1
    FOREIGN KEY (id_adresse)
    REFERENCES ref_adresse (id_adresse)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE producteur (
  id_user INT NOT NULL,
  PRIMARY KEY (id_user),
  CONSTRAINT fk_producteur_id_user
		FOREIGN KEY (id_user)
		REFERENCES user(id_user)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
) ENGINE = InnoDB;
  

CREATE TABLE ferme (
  id_ferme INT NOT NULL AUTO_INCREMENT,
  id_adresse_livraison INT NULL,
  presentation_ferme TEXT NULL,
  presentation_produits TEXT NULL,
  presentation_methode TEXT NULL,
  date_modif DATETIME NULL,
  user_modif INT NULL,
  PRIMARY KEY (id_ferme))  
ENGINE = InnoDB;

CREATE TABLE ferme_producteur (
	id_ferme INT NOT NULL,
    id_user INT NOT NULL,
    PRIMARY KEY (id_user),
    INDEX idx_ferme_id_user (id_user ASC),
    INDEX idx_ferme_id_ferme (id_ferme ASC),
	CONSTRAINT fk_ferme_user_id_user
		FOREIGN KEY (id_user)
		REFERENCES producteur (id_user)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT fk_ferme_user_id_ferme
		FOREIGN KEY (id_ferme)
		REFERENCES ferme (id_ferme)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE ferme_photo (
  id_photo INT NOT NULL,
  id_ferme INT NOT NULL,
  PRIMARY KEY (id_photo),
  INDEX fk_ferme_photo_id_ferme_idx (id_ferme ASC),
  CONSTRAINT fk_photo_user_id_ferme
    FOREIGN KEY (id_ferme)
    REFERENCES ferme (id_ferme)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  INDEX fk_ferme_photo_id_photo_idx (id_photo ASC),
  CONSTRAINT fk_ferme_photo_id_photo
    FOREIGN KEY (id_photo)
    REFERENCES photo (id_photo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table producteur_catalogue
-- -----------------------------------------------------
CREATE TABLE producteur_catalogue (
  id_producteur_catalogue INT NOT NULL,
  id_user INT NOT NULL,
  lib_catalogue VARCHAR(100) NULL,
  date_debut DATETIME NULL,
  date_fin DATETIME NULL,
  PRIMARY KEY (id_producteur_catalogue),
  INDEX fk_producteur_catalogue_ref_user1_idx (id_user ASC),
  CONSTRAINT fk_producteur_catalogue_ref_user1
    FOREIGN KEY (id_user)
    REFERENCES user (id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table producteur_catalogue_details
-- -----------------------------------------------------
CREATE TABLE producteur_catalogue_details (
  id_producteur_catalogue_details INT NOT NULL AUTO_INCREMENT,
  id_producteur_catalogue INT NOT NULL,
  id_conditionnement_produit INT NOT NULL,
  prix DECIMAL(5,2) NULL,
  prix_unitaire DECIMAL(5,2) NULL,
  unite VARCHAR(45) NULL,
  remise DECIMAL(5,2) NULL DEFAULT 0.0,
  photo BLOB NULL,
  qte_stock_initiale DECIMAL(5,2) NULL,
  prix_bas DECIMAL(5,2) NULL,
  prix_haut DECIMAL(5,2) NULL,
  PRIMARY KEY (id_producteur_catalogue_details),
  INDEX fk_producteur_catalogue_details_producteur_catalogue1_idx (id_producteur_catalogue ASC),
  INDEX fk_producteur_catalogue_details_rel_conditionnement_produit_idx (id_conditionnement_produit ASC),
  CONSTRAINT fk_producteur_catalogue_details_producteur_catalogue1
    FOREIGN KEY (id_producteur_catalogue)
    REFERENCES producteur_catalogue (id_producteur_catalogue)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_producteur_catalogue_details_rel_conditionnement_produit1
    FOREIGN KEY (id_conditionnement_produit)
    REFERENCES rel_conditionnement_produit (id_conditionnement_produit)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE panier (
  id_panier INT NOT NULL,
  id_user INT NOT NULL,
  statut TINYINT(1) NULL,
  PRIMARY KEY (id_panier),
  INDEX fk_panier_ref_user1_idx (id_user ASC),
  CONSTRAINT fk_panier_ref_user1
    FOREIGN KEY (id_user)
    REFERENCES user (id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE panier_details (
  id_panier_details INT NOT NULL,
  id_panier INT NOT NULL,
  id_producteur_catalogue_details INT NOT NULL,
  prix DECIMAL(5,2) NULL,
  remise DECIMAL(5,2) NULL,
  qte DECIMAL(5,2) NULL,
  PRIMARY KEY (id_panier_details),
  INDEX fk_panier_details_panier1_idx (id_panier ASC),
  INDEX fk_panier_details_producteur_catalogue_details1_idx (id_producteur_catalogue_details ASC),
  CONSTRAINT fk_panier_details_panier1
    FOREIGN KEY (id_panier)
    REFERENCES panier (id_panier)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_panier_details_producteur_catalogue_details1
    FOREIGN KEY (id_producteur_catalogue_details)
    REFERENCES producteur_catalogue_details (id_producteur_catalogue_details)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE sessions (
  session_id varchar(255) COLLATE utf8_bin NOT NULL,
  expires int(11) unsigned NOT NULL,
  data text COLLATE utf8_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

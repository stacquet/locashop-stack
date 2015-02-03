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
CREATE TABLE ref_user (
  id_user INT NOT NULL AUTO_INCREMENT,
  id_profil VARCHAR(45) NOT NULL,
  id_adresse INT NULL,
  email VARCHAR(200) NOT NULL,
  mobile VARCHAR(45) NULL,
  nom VARCHAR(45) NULL,
  prenom VARCHAR(45) NULL,
  password VARCHAR(45) NULL,
  date_modification DATETIME NULL,
  PRIMARY KEY (id_user),
  UNIQUE INDEX email_UNIQUE (email ASC),
  INDEX fk_ref_user_ref_profil1_idx (id_profil ASC),
  INDEX fk_ref_user_ref_adresse1_idx (id_adresse ASC),
  CONSTRAINT fk_ref_user_ref_profil1
    FOREIGN KEY (id_profil)
    REFERENCES ref_profil (id_profil)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_ref_user_ref_adresse1
    FOREIGN KEY (id_adresse)
    REFERENCES ref_adresse (id_adresse)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
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
    REFERENCES ref_user (id_user)
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
    REFERENCES ref_user (id_user)
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

create database vino_db;
use vino_db;

-- table utilisateur

create table utilisateur (
	id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

-- table pays
create table pays (
	id_pays INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- table bouteille
create table bouteille (
	id_bouteille INT AUTO_INCREMENT PRIMARY KEY,
    id_pays INT,
    id_type INT,
    nom VARCHAR(100) NOT NULL,
    millenisme YEAR NOT NULL,
    region VARCHAR(50) NOT NULL,
    cepage VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    moment VARCHAR(255),
    description TEXT NOT NULL,
    taux_sucre DECIMAL(2,2) NOT NULL,
    effervescence VARCHAR(25) NOT NULL,
    FOREIGN KEY pays(id_pays) REFERENCES pays(id_pays),
    FOREIGN KEY type(id_type) REFERENCES type(id_type)
);

-- table cellier
create table cellier (
	id_cellier INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    nom VARCHAR(100) NOT NULL,
    quantite INT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY utilisateur(id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

-- table bouteilleCellier
create table bouteilleCellier (
	quantite INT,
    id_bouteille INT,
    id_cellier INT,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    emplacement VARCHAR(50),
    prix_achat DECIMAL(8,2),
    FOREIGN KEY (id_cellier) REFERENCES cellier(id_cellier),
    FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
	PRIMARY KEY (id_bouteille,  id_cellier) 
);

-- table degustation
create table degustation (
	id_degustation INT AUTO_INCREMENT PRIMARY KEY,
    id_bouteille INT,
    id_utilisateur INT,
    commentaire TEXT NOT NULL,
    date_degustation DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes INT NOT NULL,
    FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);

-- table listeAchat
create table listeAchat (
	id_bouteille INT,
    id_utilisateur INT,
	FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    PRIMARY KEY (id_bouteille, id_utilisateur)
);

-- table type
create table type (
	id_type INT AUTO_INCREMENT PRIMARY KEY,
    couleur VARCHAR(15)
);

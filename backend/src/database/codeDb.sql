create database vino_db;
use vino_db;
 
-- table utilisateur
 
create table utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    courriel VARCHAR(100) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);
 
-- table pays
create table pays (
    id_pays INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);
 
-- table type
create table type (
    id_type INT AUTO_INCREMENT PRIMARY KEY,
    couleur VARCHAR(20) NOT NULL
);
 
-- table bouteille
create table bouteille (
    id_bouteille INT AUTO_INCREMENT PRIMARY KEY,
    id_pays INT,
    id_type INT,
    code_saq VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    millenisme SMALLINT NOT NULL,
    region VARCHAR(255) NOT NULL,
    cepage VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    taux_alcool DECIMAL(4,2),
    prix DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (id_pays) REFERENCES pays(id_pays),
    FOREIGN KEY (id_type) REFERENCES type(id_type)
);
 
-- table cellier
create table cellier (
    id_cellier INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    nom VARCHAR(100) NOT NULL,
    quantite INT DEFAULT 0 NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);
 
-- table bouteilleCellier
create table bouteilleCellier (
    quantite INT NOT NULL,
    id_bouteille INT,
    id_cellier INT,
    FOREIGN KEY (id_cellier) REFERENCES cellier(id_cellier),
    FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
    PRIMARY KEY (id_bouteille,  id_cellier)
);
 
-- table degustation
create table degustation (
    date_degustation DATETIME DEFAULT CURRENT_TIMESTAMP PRIMARY KEY,
    id_bouteille INT,
    id_utilisateur INT,
    commentaire TEXT NOT NULL,
    notes INT NOT NULL,
    FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
);
 
-- table listeAchat
create table listeAchat (
    id_bouteille INT,
    id_utilisateur INT,
    quantite INT NOT NULL,
    FOREIGN KEY (id_bouteille) REFERENCES bouteille(id_bouteille),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    PRIMARY KEY (id_bouteille, id_utilisateur)
);
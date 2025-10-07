-- =========================
-- 1. Tables de base
-- =========================

CREATE TABLE Categorie_processus (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE Collaborateur (
    matricule VARCHAR(50) PRIMARY KEY,
    nom_complet VARCHAR(150),
    nom_affichage VARCHAR(200),
    departement VARCHAR(50),
    poste VARCHAR(MAX),
    courriel VARCHAR(100),
    telephone VARCHAR(50),
    etat INT
);

CREATE TABLE Processus (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    sigle VARCHAR(10) NOT NULL,
    pseudo_pilote VARCHAR(250),
    matricule_pilote VARCHAR(50) NOT NULL, 
    pseudo_copilote VARCHAR(250),
    matricule_copilote VARCHAR(50) NOT NULL, 
    id_categorie_processus INT NOT NULL,
    contexte VARCHAR(MAX),
    finalite VARCHAR(MAX),
    FOREIGN KEY(matricule_pilote) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(matricule_copilote) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_categorie_processus) REFERENCES Categorie_processus(id)
);


-- =========================
-- 2 ressources
-- =========================

CREATE TABLE ressources (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    humaines VARCHAR(MAX),
    materielles VARCHAR(MAX),
    connaissance_org VARCHAR(MAX),
    doc VARCHAR(MAX),
    naturelles VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES processus(id)
);

CREATE TABLE partie_interesse_attente (
    id INT IDENTITY PRIMARY KEY,
    partie_interesse VARCHAR(MAX),
    attente VARCHAR(MAX),
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES processus(id)
);

CREATE TABLE interaction (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    id_processus_interagi INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES processus(id),
    FOREIGN KEY(id_processus_interagi) REFERENCES processus(id)
);

CREATE TABLE activite (
    id INT IDENTITY PRIMARY KEY,
    element_entree VARCHAR(MAX),
    element_sortie VARCHAR(MAX),
    descr VARCHAR(MAX),
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES processus(id)
);

CREATE TABLE processus_fournisseur (
    id INT IDENTITY PRIMARY KEY,
    id_activite INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES processus(id),
    FOREIGN KEY(id_activite) REFERENCES activite(id)
);

CREATE TABLE processus_client (
    id INT IDENTITY PRIMARY KEY,
    id_activite INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES processus(id),
    FOREIGN KEY(id_activite) REFERENCES activite(id)
);

-- =========================
-- 3. Gestion des rôles et permissions
-- =========================

CREATE TABLE Categorie_permission (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE Permission (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    reference VARCHAR(20) NOT NULL,
    id_categorie_permission INT NOT NULL,
    FOREIGN KEY(id_categorie_permission) REFERENCES Categorie_permission(id)
);

CREATE TABLE Role (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE Role_permission (
    id INT IDENTITY PRIMARY KEY,
    id_role INT NOT NULL,
    id_permission INT NOT NULL,
    FOREIGN KEY(id_role) REFERENCES Role(id),
    FOREIGN KEY(id_permission) REFERENCES Permission(id)
);

CREATE TABLE Role_collaborateur (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL, 
    id_role INT NOT NULL,
    etat INT,
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_role) REFERENCES Role(id)
);

-- =========================
-- 4. Non-conformité
-- =========================
--ok
CREATE TABLE Lieu (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    abr VARCHAR(10) NOT NULL    
);
--ok
CREATE TABLE Type_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);
--ok
CREATE TABLE Non_conformite (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    datetime_fait DATETIME DEFAULT GETDATE(),
    descr VARCHAR(MAX),
    action_curative VARCHAR(MAX),
    id_lieu INT NOT NULL,
    id_type_nc INT NOT NULL,
    FOREIGN KEY(id_lieu) REFERENCES Lieu(id),
    FOREIGN KEY(id_type_nc) REFERENCES Type_nc(id)
);

CREATE TABLE piece_jointe_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    nom_file VARCHAR(50),
    chemin_file VARCHAR(MAX),
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);


CREATE TABLE emetteur_nc (
    id INT IDENTITY PRIMARY KEY,
    id_personnel INT NULL,
    nom VARCHAR(50),
    id_nc INT NOT NULL,
    FOREIGN KEY(id_personnel) REFERENCES personnel(id),
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);
--ok
CREATE TABLE Processus_concerne_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);

CREATE TABLE nc_brouillon (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);

CREATE TABLE nc_actif (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);
--ok
CREATE TABLE Status_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
);

CREATE TABLE status_nc_nc (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    id_status_nc INT NOT NULL,
    id_nc INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id),
    FOREIGN KEY(id_status_nc) REFERENCES status_nc(id)
);
--ok
CREATE TABLE Priorite_nc (
    id INT IDENTITY PRIMARY KEY,
    degre INT,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
);

CREATE TABLE priorite_nc_nc (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    id_priorite_nc INT NOT NULL,
    id_nc INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id),
    FOREIGN KEY(id_priorite_nc) REFERENCES priorite_nc(id)
);

CREATE TABLE commentaire_nc (
    id INT IDENTITY PRIMARY KEY,
    datetime DATETIME DEFAULT GETDATE(),
    descr VARCHAR(MAX),
    id_personnel INT NOT NULL,
    id_nc INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id),
    FOREIGN KEY(id_personnel) REFERENCES personnel(id)
);

CREATE TABLE analyse_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    mo VARCHAR(MAX),
    materiel VARCHAR(MAX),
    matiere VARCHAR(MAX),
    milieu VARCHAR(MAX),
    methode VARCHAR(MAX),
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);

CREATE TABLE piece_jointe_nc_cloture (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    nom_file VARCHAR(50),
    chemin_file VARCHAR(MAX),
    FOREIGN KEY(id_nc) REFERENCES non_conformite(id)
);

-- =========================
-- 5. Plan d'action
-- =========================

CREATE TABLE source_action (
    id INT IDENTITY PRIMARY KEY,
    descr VARCHAR(MAX),
    id_entite INT NOT NULL,
    id_objet INT,
    FOREIGN KEY(id_entite) REFERENCES entite(id)
);

CREATE TABLE action (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    date_constat DATE DEFAULT CAST(GETDATE() AS DATE),
    constat VARCHAR(MAX),
    descr VARCHAR(MAX),
    ressources VARCHAR(MAX),
    moyen_de_verif VARCHAR(MAX),
    efficacite VARCHAR(MAX),
    id_lieu INT NOT NULL,
    id_source_action INT NOT NULL,
    FOREIGN KEY(id_lieu) REFERENCES lieu(id),
    FOREIGN KEY(id_source_action) REFERENCES source_action(id)
);

CREATE TABLE processus_concerne_action (
    id INT IDENTITY PRIMARY KEY,
    id_action INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_action) REFERENCES action(id),
    FOREIGN KEY(id_processus) REFERENCES processus(id)
);

CREATE TABLE piece_jointe_action_cloture (
    id INT IDENTITY PRIMARY KEY,
    id_action INT NOT NULL,
    nom_file VARCHAR(MAX),
    chemin_file VARCHAR(MAX),
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    FOREIGN KEY(id_action) REFERENCES action(id)
);

CREATE TABLE commentaire_action (
    id INT IDENTITY PRIMARY KEY, 
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    descr VARCHAR(MAX),
    id_personnel INT NOT NULL,
    id_action INT NOT NULL,
    FOREIGN KEY(id_action) REFERENCES action(id),
    FOREIGN KEY(id_personnel) REFERENCES personnel(id)
);

CREATE TABLE status_action (
    id INT IDENTITY PRIMARY KEY,
    ordre INT,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
);

CREATE TABLE status_action_action (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    id_status_action INT NOT NULL,
    id_action INT NOT NULL,
    FOREIGN KEY(id_action) REFERENCES action(id),
    FOREIGN KEY(id_status_action) REFERENCES status_action(id)
);

CREATE TABLE priorite_action (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
);

CREATE TABLE priorite_action_action (
    id INT IDENTITY PRIMARY KEY,
    date DATE DEFAULT CAST(GETDATE() AS DATE),
    id_priorite_action INT NOT NULL,
    id_action INT NOT NULL,
    FOREIGN KEY(id_action) REFERENCES action(id),
    FOREIGN KEY(id_priorite_action) REFERENCES priorite_action(id)
);

CREATE TABLE resp_action (
    id INT IDENTITY PRIMARY KEY, 
    id_action INT NOT NULL,
    id_personnel_attribueur INT NOT NULL,
    id_personnel INT NOT NULL,
    status INT,
    datetime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY(id_action) REFERENCES action(id),
    FOREIGN KEY(id_personnel) REFERENCES personnel(id),
    FOREIGN KEY(id_personnel_attribueur) REFERENCES personnel(id)
);


-- =========================
-- 6. Historique
-- =========================

CREATE TABLE operation (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE entite (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE historique (
    id INT IDENTITY PRIMARY KEY,
    datetime DATETIME DEFAULT GETDATE(),
    id_personnel INT NOT NULL,
    id_operation INT NOT NULL,
    id_entite INT NOT NULL,
    id_object INT,
    details VARCHAR(MAX),
    usefull_data VARCHAR(MAX),
    FOREIGN KEY(id_entite) REFERENCES entite(id),
    FOREIGN KEY(id_operation) REFERENCES operation(id),
    FOREIGN KEY(id_personnel) REFERENCES personnel(id)
);
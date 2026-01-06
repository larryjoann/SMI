-- =========================
-- 1. Tables de base
-- =========================
CREATE TABLE Entite (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE Piece_jointe (
    id INT IDENTITY PRIMARY KEY,
    nom_fichier VARCHAR(200) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
);

CREATE TABLE Categorie_processus (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    color VARCHAR(50)
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
    id_categorie_processus INT NOT NULL,
    contexte VARCHAR(MAX),
    finalite VARCHAR(MAX),
    status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY(id_categorie_processus) REFERENCES Categorie_processus(id)
);

CREATE TABLE Validite_processus (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    annee INT NOT NULL CHECK (annee BETWEEN 1900 AND 9999),
    FOREIGN KEY (id_processus) REFERENCES Processus(id),
    CONSTRAINT UQ_annee_dispoProcessus_Processus_Annee UNIQUE (id_processus, annee)
);

CREATE TABLE Type_responsable_processus (
    id INT IDENTITY PRIMARY KEY,
    id_role INT NOT NULL,
    FOREIGN KEY(id_role) REFERENCES Role(id),
    CONSTRAINT UQ_Type_Responsable_Processus UNIQUE (id_role)
);

CREATE TABLE Responsable_processus (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL, 
    id_processus INT NOT NULL,
    id_type_responsable_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_type_responsable_processus) REFERENCES Type_responsable_processus(id),
    CONSTRAINT UQ_Responsable_Processus UNIQUE (matricule_collaborateur, id_processus, id_type_responsable_processus)
);


-- =========================
-- 2. Gestion des rôles et permissions
-- =========================


CREATE TABLE Permission (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(MAX) NOT NULL,
    reference VARCHAR(20) NOT NULL,
    id_entite INT NOT NULL,
    FOREIGN KEY(id_entite) REFERENCES Entite(id)
);

CREATE TABLE Role (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL, 
    est_automatique BIT NOT NULL DEFAULT 0
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
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_role) REFERENCES Role(id)
);

-- =========================
-- 3. Non-conformité
-- =========================

CREATE TABLE Lieu (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    abr VARCHAR(10) NOT NULL    
);

CREATE TABLE Type_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);


CREATE TABLE Phase_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    ordre INT NOT NULL
);

CREATE TABLE Status_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    color VARCHAR(50),
    id_phase_nc INT NOT NULL,
    descr VARCHAR(MAX),
    FOREIGN KEY(id_phase_nc) REFERENCES Phase_nc(id)
);

DELETE FROM Phase_nc; 
DBCC CHECKIDENT ('Phase_nc', RESEED, 0);


CREATE TABLE Non_conformite (
    id INT IDENTITY PRIMARY KEY,
    matricule_emetteur VARCHAR(50) NOT NULL,
    datetime_creation DATETIME DEFAULT GETDATE(),
    datetime_declare DATETIME NULL,
    datetime_cloture DATETIME NULL,
    datetime_fait DATETIME DEFAULT GETDATE(),
    descr VARCHAR(MAX),
    id_lieu INT NULL,
    id_type_nc INT NULL,
    id_status_nc INT NULL,      -- Foreign key vers Status_nc
    status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY(id_lieu) REFERENCES Lieu(id),
    FOREIGN KEY(id_type_nc) REFERENCES Type_nc(id),
    FOREIGN KEY(id_status_nc) REFERENCES Status_nc(id),
    FOREIGN KEY(matricule_emetteur) REFERENCES Collaborateur(matricule)
);

CREATE TABLE Piece_jointe_declaration_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    id_piece_jointe INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_piece_jointe) REFERENCES Piece_jointe(id)
);

CREATE TABLE Verif_efficacite_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    date_verif DATETIME DEFAULT GETDATE(),
    resultat BIT NOT NULL,
    commentaire VARCHAR(MAX),
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id)
);

CREATE TABLE Piece_jointe_verif_efficacite_nc (
    id INT IDENTITY PRIMARY KEY,
    id_verif_efficacite_nc INT NOT NULL,
    id_piece_jointe INT NOT NULL,
    FOREIGN KEY(id_verif_efficacite_nc) REFERENCES Verif_efficacite_nc(id),
    FOREIGN KEY(id_piece_jointe) REFERENCES Piece_jointe(id)
);

CREATE TABLE Processus_concerne_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);


CREATE TABLE Categorie_cause_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE Cause_nc (
    id INT IDENTITY PRIMARY KEY,
    id_categorie_cause_nc INT NOT NULL,
    descr VARCHAR(MAX),
    id_nc INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES Processus(id), 
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_categorie_cause_nc) REFERENCES Categorie_cause_nc(id)
);

-- =========================
-- 4. Historique activite
-- =========================

CREATE TABLE Operation (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);


CREATE TABLE Historique (
    id INT IDENTITY PRIMARY KEY,
    datetime DATETIME DEFAULT GETDATE(),
    matricule_collaborateur VARCHAR(50) NOT NULL,
    id_operation INT NOT NULL,
    id_entite INT NOT NULL,
    id_object INT,
    descr VARCHAR(MAX),
    usefull_data VARCHAR(MAX),
    FOREIGN KEY(id_entite) REFERENCES Entite(id),
    FOREIGN KEY(id_operation) REFERENCES Operation(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);

-- =========================
-- 5. Actions
-- =========================

CREATE TABLE Status_action (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    color VARCHAR(50),
);

CREATE TABLE Action (
    id INT IDENTITY PRIMARY KEY,
    titre VARCHAR(MAX) NOT NULL,
    date_debut DATE,
    descr VARCHAR(MAX),
    id_status_action INT NOT NULL,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY(id_status_action) REFERENCES Status_action(id)
);

CREATE TABLE Suivi_action (
    id INT IDENTITY PRIMARY KEY,
    id_action INT NOT NULL,
    date_suivi DATETIME DEFAULT GETDATE(),
    avancement INT,
    FOREIGN KEY(id_action) REFERENCES Action(id)
);

CREATE TABLE Source_action (
    id INT IDENTITY PRIMARY KEY,
    id_action INT NOT NULL,
    id_entite INT NOT NULL,
    id_objet INT NOT NULL,
    FOREIGN KEY(id_entite) REFERENCES Entite(id),
    FOREIGN KEY(id_action) REFERENCES Action(id)
);

CREATE TABLE Responsable_action (
    id INT IDENTITY PRIMARY KEY,
    id_action INT NOT NULL,
    date_assignation DATETIME DEFAULT GETDATE(),
    matricule_assignateur VARCHAR(50) NOT NULL,
    matricule_responsable VARCHAR(50) NOT NULL,
    FOREIGN KEY(id_action) REFERENCES Action(id),
    FOREIGN KEY(matricule_assignateur) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(matricule_responsable) REFERENCES Collaborateur(matricule)
);

-- =========================
-- 6. Plan d'action
-- =========================

CREATE TABLE Source_PA (
    id INT IDENTITY PRIMARY KEY,
    descr VARCHAR(MAX),
);


CREATE TABLE Status_PA (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    color VARCHAR(50),
);

CREATE TABLE Plan_action (
    id INT IDENTITY PRIMARY KEY,
    id_source_pa INT NOT NULL,
    date_constat DATETIME DEFAULT GETDATE(),
    constat VARCHAR(MAX),
    id_status_pa INT NOT NULL,
    status BIT NOT NULL DEFAULT 1,
    date_time_cloture DATETIME NULL,
    FOREIGN KEY(id_status_pa) REFERENCES Status_PA(id),
    FOREIGN KEY(id_source_pa) REFERENCES Source_PA(id)
);

CREATE TABLE Processus_concerne_PA (
    id INT IDENTITY PRIMARY KEY,
    id_pa INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_pa) REFERENCES Plan_action(id),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);

CREATE TABLE Verif_efficacite_pa (
    id INT IDENTITY PRIMARY KEY,
    id_pa INT NOT NULL,
    date_verif DATETIME DEFAULT GETDATE(),
    resultat BIT NOT NULL,
    commentaire VARCHAR(MAX),
    FOREIGN KEY(id_pa) REFERENCES Plan_action(id)
)

CREATE TABLE Piece_jointe_verif_efficacite_pa (
    id INT IDENTITY PRIMARY KEY,
    id_verif_efficacite_pa INT NOT NULL,
    id_piece_jointe INT NOT NULL,
    FOREIGN KEY(id_verif_efficacite_pa) REFERENCES Verif_efficacite_pa(id),
    FOREIGN KEY(id_piece_jointe) REFERENCES Piece_jointe(id)
);

-- =========================
-- 6. Ntifications
-- =========================

CREATE TABLE Notification (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL,
    datetime_notification DATETIME DEFAULT GETDATE(),
    titre VARCHAR(200) NOT NULL,
    contenu VARCHAR(MAX) NOT NULL,
    lue BIT NOT NULL DEFAULT 0,
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);

-- =========================
-- 7. Admin 
-- =========================
CREATE TABLE Admin (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL,
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
)

-- =========================
-- Comments 
-- =========================
CREATE TABLE Commentaires (
    id INT IDENTITY PRIMARY KEY,
    id_entite INT NOT NULL,
    id_object INT NOT NULL,
    matricule_collaborateur VARCHAR(50) NOT NULL,
    datetime_commentaire DATETIME DEFAULT GETDATE(),
    contenu VARCHAR(MAX) NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);
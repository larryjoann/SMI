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
    id_categorie_processus INT NOT NULL,
    contexte VARCHAR(MAX),
    finalite VARCHAR(MAX),
    FOREIGN KEY(matricule_pilote) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(matricule_copilote) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_categorie_processus) REFERENCES Categorie_processus(id)
);

CREATE TABLE Pilote (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL, 
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);

CREATE TABLE Copilote (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL, 
    id_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
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

CREATE TABLE Lieu (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    abr VARCHAR(10) NOT NULL    
);

CREATE TABLE Type_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE Non_conformite (
    id INT IDENTITY PRIMARY KEY,
    datetime_creation DATE DEFAULT CAST(GETDATE() AS DATE),
    datetime_declare DATETIME NULL;
    datetime_fait DATETIME DEFAULT GETDATE(),
    descr VARCHAR(MAX),
    action_curative VARCHAR(MAX),
    id_lieu INT NULL,
    id_type_nc INT NULL,
    id_status_nc INT NULL,      -- Foreign key vers Status_nc
    id_priorite_nc INT NULL,    -- Foreign key vers Priorite_nc
    status boolean DEFAULT true,
    FOREIGN KEY(id_lieu) REFERENCES Lieu(id),
    FOREIGN KEY(id_type_nc) REFERENCES Type_nc(id),
    FOREIGN KEY(id_status_nc) REFERENCES Status_nc(id),
    FOREIGN KEY(id_priorite_nc) REFERENCES Priorite_nc(id)
);

CREATE TABLE Priorite_nc (
    id INT IDENTITY PRIMARY KEY,
    degre INT,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
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

DBCC CHECKIDENT ('Phase_nc', RESEED, 0);

INSERT INTO Phase_nc (nom, ordre)
VALUES
('En qualification', 1),
('Qualifié comme non recevable',2),
('Qualifié en attente de traitement',3),
('Traitement', 4),
('Clôture', 5);

DBCC CHECKIDENT ('Status_nc', RESEED, 0);

INSERT INTO Status_nc (nom, descr, color , id_phase_nc)
VALUES
('En qualification', 'En attente de qualif par QUA', 'dark' ,1 ),
('A eclarcir', 'Le responsable QUA demande plus d''infrmation', 'info',1),
('Non Recevable', 'Qualifié comme non-recevable par la QUA', 'danger',2),
('Reçevable', 'Qualifié comme recevable par la QUA', 'primary',3),
('En traitement','Les actions correctives sont en cours', 'secondary',4),
('Suspendue', 'Suspendue', 'light',4),
('Clôturé', 'Cloturé ', 'success',5);


CREATE TABLE Processus_concerne_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    id_processus INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);

CREATE TABLE Piece_jointe_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    nom_fichier VARCHAR(200) NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id)
);
-- =========================
-- 1. Tables de base
-- =========================

CREATE TABLE Categorie_processus (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

INSERT INTO Categorie_processus (nom) VALUES ('Management');
INSERT INTO Categorie_processus (nom) VALUES ('Système et amélioration');
INSERT INTO Categorie_processus (nom) VALUES ('Réalisation');
INSERT  INTO Categorie_processus (nom) VALUES ('Support');

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

INSERT INTO Collaborateur (matricule, nom_complet, nom_affichage, departement, poste, courriel, telephone, etat)
VALUES
('A001', 'Dupont Jean', 'J. Dupont (DQRSE)', 'Qualité', 'Responsable Qualité', 'joannrandrianirina@gmail.com', '0123456789', 1),
('A002', 'Martin Claire', 'C. Martin (Prod)', 'Production', 'Opératrice de production', 'randrianirina@gmail.com', '0987654321', 1);   

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
-- 2. Gestion des rôles et permissions
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
-- 3. Non-conformité
-- =========================

CREATE TABLE Lieu (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    abr VARCHAR(10) NOT NULL    
);

INSERT INTO Lieu (nom, abr) VALUES ('Tananarive', 'TNR');
INSERT INTO Lieu (nom, abr) VALUES ('Nosy Be', 'NOS');

CREATE TABLE Type_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

INSERT INTO Type_nc (nom) VALUES ('Environnement');
INSERT INTO Type_nc (nom) VALUES ('Annomalie');
INSERT INTO Type_nc (nom) VALUES ('Dysfonctionnement');
INSERT INTO Type_nc (nom) VALUES ('Audit interne');
INSERT INTO Type_nc (nom) VALUES ('Audit externe');

CREATE TABLE Priorite_nc (
    id INT IDENTITY PRIMARY KEY,
    degre INT,
    nom VARCHAR(50),
    descr VARCHAR(MAX)
);

INSERT INTO Priorite_nc (degre,nom,descr) VALUES (1,'Haute','tres haute');

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

INSERT INTO Phase_nc (nom, ordre)
VALUES
('Déclaration', 1),
('Traitement',2),
('Cloture',3);


DELETE FROM Status_nc;
DBCC CHECKIDENT ('Status_nc', RESEED, 0);

INSERT INTO Status_nc (nom, descr, color , id_phase_nc)
VALUES
--('Ouverte', 'Non-conformité ouverte ', 'ouverte',1),
('En qualification', 'En attente de qualification par la QUA', 'en_qualification' ,1 ),
('A clarifier', 'Le responsable QUA demande plus d''information', 'a_clarifier',1),
('Reçevable', 'Qualifié comme recevable par la QUA', 'recevable',1),
('Non Recevable', 'Qualifié comme non-recevable par la QUA', 'non_recevable',1),
('Analysé','Causes analysés', 'analysé',2),
('Assigné','Les actions sont en cours', 'assigné',2),
('Suspendue', 'Suspendue', 'suspendue',2),
('Vérifié', 'Efficacité vérifié','vérifié', 3),
('Clôturé', 'Cloturé ', 'cloturé',3);

CREATE TABLE Non_conformite (
    id INT IDENTITY PRIMARY KEY,
    matricule_emetteur VARCHAR(50) NOT NULL,
    datetime_creation DATETIME DEFAULT GETDATE(),
    datetime_declare DATETIME NULL,
    datetime_fait DATETIME DEFAULT GETDATE(),
    descr VARCHAR(MAX),
    action_curative VARCHAR(MAX),
    id_lieu INT NULL,
    id_type_nc INT NULL,
    id_status_nc INT NULL,      -- Foreign key vers Status_nc
    id_priorite_nc INT NULL,    -- Foreign key vers Priorite_nc
    status BIT NOT NULL DEFAULT 1,
    FOREIGN KEY(id_lieu) REFERENCES Lieu(id),
    FOREIGN KEY(id_type_nc) REFERENCES Type_nc(id),
    FOREIGN KEY(id_status_nc) REFERENCES Status_nc(id),
    FOREIGN KEY(id_priorite_nc) REFERENCES Priorite_nc(id),
    FOREIGN KEY(matricule_emetteur) REFERENCES Collaborateur(matricule)
);

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

CREATE TABLE Categorie_cause_nc (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

INSERT INTO Categorie_cause_nc (nom) VALUES ('Milieu');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Méthode');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Matériel');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Matière');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Main d''oeuvre');


CREATE TABLE Cause_nc (
    id INT IDENTITY PRIMARY KEY,
    id_categorie_cause_nc INT NOT NULL,
    descr VARCHAR(MAX),
    id_nc INT NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(id_categorie_cause_nc) REFERENCES Categorie_cause_nc(id)
);

CREATE TABLE Commentaire_nc (
    id INT IDENTITY PRIMARY KEY,
    id_nc INT NOT NULL,
    matricule_collaborateur VARCHAR(50) NOT NULL,
    datetime_commentaire DATETIME DEFAULT GETDATE(),
    contenu VARCHAR(MAX) NOT NULL,
    FOREIGN KEY(id_nc) REFERENCES Non_conformite(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);

-- =========================
-- 4. Historique activite
-- =========================

CREATE TABLE Operation (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

INSERT INTO operation (nom) VALUES ('Création');
INSERT INTO operation (nom) VALUES ('Modification');
INSERT INTO operation (nom) VALUES ('Suppression');


CREATE TABLE Entite (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

INSERT INTO entite (nom) VALUES ('Processus');
INSERT INTO entite (nom) VALUES ('Non-conformité');

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

INSERT INTO Status_action (nom, color) VALUES ('Backlog', 'backlog');
INSERT INTO Status_action (nom, color) VALUES ('En cours', 'en_cours');
INSERT INTO Status_action (nom, color) VALUES ('Terminée', 'terminée');
INSERT INTO Status_action (nom, color) VALUES ('Suspendu', 'suspendu');

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

INSERT INTO Source_PA (descr) VALUES ('Audit interne');
INSERT INTO Source_PA (descr) VALUES ('Audit externe');
INSERT INTO Source_PA (descr) VALUES ('Revue de direction');


CREATE TABLE Status_PA (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    color VARCHAR(50),
);

INSERT INTO Status_PA (nom, color) VALUES ('Ouvert', 'en_qualification');
INSERT INTO Status_PA (nom, color) VALUES ('Assigné', 'assigné');
INSERT INTO Status_PA (nom, color) VALUES ('Vérifié', 'vérifiéé');
INSERT INTO Status_PA (nom, color) VALUES ('Cloturé', 'cloturé');

CREATE TABLE Plan_action (
    id INT IDENTITY PRIMARY KEY,
    id_source_pa INT NOT NULL,
    date_constat DATETIME DEFAULT GETDATE(),
    constat VARCHAR(MAX),
    id_status_pa INT NOT NULL,
    status BIT NOT NULL DEFAULT 1,
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


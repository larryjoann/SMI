
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
    status BIT DEFAULT 1,
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

INSERT INTO entite (nom) VALUES ('Processus');
INSERT INTO entite (nom) VALUES ('Non-conformité');
INSERT INTO entite (nom) VALUES ('Plan d''action');
INSERT INTO entite (nom) VALUES ('Action');

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

INSERT INTO Source_action (id_action, id_entite, id_objet) VALUES (1, 2, 1); -- Exemple d'insertion liant une action à une non-conformité

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
    id_entite INT NOT NULL,
    id_object INT NOT NULL,
    FOREIGN KEY(id_entite) REFERENCES Entite(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule)
);


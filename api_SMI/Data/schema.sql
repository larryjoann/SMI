-- =========================
-- 1. Tables de base
-- =========================
CREATE TABLE Entite (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50)
);

CREATE TABLE Role (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50) NOT NULL, 
    est_automatique BIT NOT NULL DEFAULT 0
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

-- =========================
-- 2. Processus
-- =========================

CREATE TABLE Categorie_processus (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
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

CREATE TABLE Intercation (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    id_processus_interagi INT NOT NULL,
    descr VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(id_processus_interagi) REFERENCES Processus(id)
);

CREATE TABLE Categorie_ressources (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
)

CREATE TABLE Ressource_processus (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    id_categorie_ressources INT NOT NULL,
    descr VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(id_categorie_ressources) REFERENCES Categorie_ressources(id)
);

CREATE TABLE Partie_interesse_attente (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    partie_interesse VARCHAR(MAX),
    groupe INT NOT NULL,
    attente VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);

CREATE TABLE Activite (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    processus_fournisseur VARCHAR(MAX),
    element_entrante VARCHAR(MAX),
    processus_client VARCHAR(MAX),
    element_sortante VARCHAR(MAX),
    descr VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES Processus(id)
);

-- =========================
-- 3. Gestion des rôles et permissions
-- =========================

CREATE TABLE Permission (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(MAX) NOT NULL,
    reference VARCHAR(20) NOT NULL,
    id_entite INT NOT NULL,
    FOREIGN KEY(id_entite) REFERENCES Entite(id)
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

--INSERT INTO Role_collaborateur (matricule_collaborateur, id_role) VALUES ('ST151', 1); -- Administrateur

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

--INSERT INTO Source_action (id_action, id_entite, id_objet) VALUES (1, 2, 1); -- Exemple d'insertion liant une action à une non-conformité

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
-- 6. Notifications
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

-- =========================
-- 7. Indicateurs
-- =========================

CREATE TABLE Objectif_strategique (
    id INT IDENTITY PRIMARY KEY,
    descr VARCHAR(MAX)
);

CREATE TABLE Objectif (
    id INT IDENTITY PRIMARY KEY,
    id_processus INT NOT NULL,
    id_objectif_strategique INT NOT NULL,
    descr VARCHAR(MAX),
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(id_objectif_strategique) REFERENCES Objectif_strategique(id)
);

CREATE TABLE Unite_mesure (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    abr VARCHAR(20) NOT NULL
);

CREATE TABLE Frequence_mesure (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    descr VARCHAR(MAX),
    intervalle_mois INT NOT NULL
);
                       
CREATE TABLE Indicateur (
    id INT IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    id_objectif INT NOT NULL,
    id_unite_mesure INT NOT NULL,
    id_frequence_mesure INT NOT NULL,
    source VARCHAR(MAX),
    FOREIGN KEY(id_objectif) REFERENCES Objectif(id),
    FOREIGN KEY(id_unite_mesure) REFERENCES Unite_mesure(id),
    FOREIGN KEY(id_frequence_mesure) REFERENCES Frequence_mesure(id)
);

CREATE TABLE Cible_indicateur (
    id INT IDENTITY PRIMARY KEY,
    cible_optimale FLOAT,
    cible_min FLOAT,
    cible_max FLOAT,
    cible_description VARCHAR(MAX),
    id_indicateur INT NOT NULL,
    FOREIGN KEY(id_indicateur) REFERENCES Indicateur(id)
);

CREATE TABLE Mesure_indicateur (
    id INT IDENTITY PRIMARY KEY,
    id_cible_indicateur INT NOT NULL,
    id_indicateur INT NOT NULL,
    date_mesure DATETIME DEFAULT GETDATE(),
    annee INT NOT NULL CHECK (annee BETWEEN 1900 AND 9999),
    periode INT NOT NULL,   
    valeur FLOAT NOT NULL,
    commentaire VARCHAR(MAX),
    FOREIGN KEY(id_indicateur) REFERENCES Indicateur(id),
    FOREIGN KEY(id_cible_indicateur) REFERENCES Cible_indicateur(id)
);

CREATE TABLE Validite_indicateur (
    id INT IDENTITY PRIMARY KEY,
    id_indicateur INT NOT NULL,
    annee INT NOT NULL CHECK (annee BETWEEN 1900 AND 9999),
    FOREIGN KEY (id_indicateur) REFERENCES Indicateur(id),
    CONSTRAINT UQ_annee_dispoIndicateur_Indicateur_Annee UNIQUE (id_indicateur, annee)
);





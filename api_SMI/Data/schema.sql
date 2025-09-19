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
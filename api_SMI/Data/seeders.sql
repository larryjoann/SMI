-- seeders.sql
-- Déplace les INSERTs depuis schema.sql ici.
-- Les INSERTs sont protégés par IF NOT EXISTS pour une exécution répétable.

-- Roles
INSERT INTO Role (nom, est_automatique) VALUES ('Administrateur', 0);
INSERT INTO Role (nom, est_automatique) VALUES ('Responsable Qualité', 0);
INSERT INTO Role (nom, est_automatique) VALUES ('Pilote de processus', 1);
INSERT INTO Role (nom, est_automatique) VALUES ('Co-pilote de processus', 1);
INSERT INTO Role (nom, est_automatique) VALUES ('Collaborateur', 1);
INSERT INTO Role (nom, est_automatique) VALUES ('Directrice Qualité', 0);
INSERT INTO Role (nom, est_automatique) VALUES ('COPIL', 0);

-- Entités (bloc original #1)
INSERT INTO Entite (nom) VALUES ('Processus');
INSERT INTO Entite (nom) VALUES ('Non-conformité');
INSERT INTO Entite (nom) VALUES ('Plan d''action');
INSERT INTO Entite (nom) VALUES ('Action');
INSERT INTO Entite (nom) VALUES ('Dashboard');
INSERT INTO Entite (nom) VALUES ('KPI');
INSERT INTO Entite (nom) VALUES ('Admin');

-- Catégories de processus
INSERT INTO Categorie_processus (nom) VALUES ('Management');
INSERT INTO Categorie_processus (nom) VALUES ('Système et amélioration');
INSERT INTO Categorie_processus (nom) VALUES ('Réalisation');
INSERT INTO Categorie_processus (nom) VALUES ('Support');

-- Collaborateurs
INSERT INTO Collaborateur (matricule, nom_complet, nom_affichage, departement, poste, courriel, telephone, etat)
    VALUES ('A001', 'Dupont Jean', 'J. Dupont (DQRSE)', 'Qualité', 'Responsable Qualité', 'joannrandrianirina@gmail.com', '0123456789', 1);
INSERT INTO Collaborateur (matricule, nom_complet, nom_affichage, departement, poste, courriel, telephone, etat)
    VALUES ('A002', 'Martin Claire', 'C. Martin (Prod)', 'Production', 'Opératrice de production', 'randrianirina@gmail.com', '0987654321', 1);

-- Type responsable processus
INSERT INTO Type_responsable_processus (id_role) VALUES (3); -- Pilote de processus
INSERT INTO Type_responsable_processus (id_role) VALUES (4); -- Co-p

-- Catégories ressources
INSERT INTO Categorie_ressources (nom) VALUES ('Humaines');
INSERT INTO Categorie_ressources (nom) VALUES ('Naturelles');
INSERT INTO Categorie_ressources (nom) VALUES ('Matérielles');
INSERT INTO Categorie_ressources (nom) VALUES ('documentaires');
INSERT INTO Categorie_ressources (nom) VALUES ('Connaissance organisationnelle');

-- Permissions
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Consulation tableau de bord', 'READ_TDB', 5);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Consulation du cartographie', 'READ_CARTO', 1);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('CRUD de mes processus', 'CRUD_MA_PROCESSUS', 1);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('CRUD de tous les processus', 'CRUD_TOUS_PROCESSUS', 1);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Gestion des responsable processus', 'MANAGE_RESP', 1);

INSERT INTO Permission (nom, reference, id_entite) VALUES ('Consultation TDB KPI', 'READ_KPI', 6);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Saisie KPI', 'CRUD_KPI', 6);

INSERT INTO Permission (nom, reference, id_entite) VALUES ('Déclaration de NC', 'DECL_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Suivi des NC', 'SUIVI_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Qualification des NC', 'QUALIF_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Analyse des causes des NC', 'ANALYSE_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Verification éfficacité NC', 'VERIF_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Clôture des NC', 'CLOTURE_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Assignation des actions NC', 'ASSIGN_NC', 2);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Ajout des commentaires sur NC', 'COMMENT_NC', 2);

INSERT INTO Permission (nom, reference, id_entite) VALUES ('Insertion de PA', 'INSERT_PA', 3);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Suivi des PA', 'SUIVI_PA', 3);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Assignation des actions PA', 'ASSIGN_PA', 3);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Clôture des PA', 'CLOTURE_PA', 3);

INSERT INTO Permission (nom, reference, id_entite) VALUES ('Suivi des actions', 'SUIVI_ACT', 4);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Mise à jour des actions', 'CRUD_ACT', 4);
INSERT INTO Permission (nom, reference, id_entite) VALUES ('Avancement des actions', 'AVC_ACT', 4);

INSERT INTO Permission (nom, reference, id_entite) VALUES ('Administration', 'ADMIN', 7);

-- Role_permission
INSERT INTO Role_permission (id_role, id_permission) VALUES (1, 2);
INSERT INTO Role_permission (id_role, id_permission) VALUES (1, 3);
INSERT INTO Role_permission (id_role, id_permission) VALUES (1, 23);

-- Lieux
INSERT INTO Lieu (nom, abr) VALUES ('Tananarive', 'TNR');
INSERT INTO Lieu (nom, abr) VALUES ('Nosy Be', 'NOS');

-- Type_nc
INSERT INTO Type_nc (nom) VALUES ('Environnement');
INSERT INTO Type_nc (nom) VALUES ('Annomalie');
INSERT INTO Type_nc (nom) VALUES ('Dysfonctionnement');
INSERT INTO Type_nc (nom) VALUES ('Audit interne');
INSERT INTO Type_nc (nom) VALUES ('Audit externe');
INSERT INTO Type_nc (nom) VALUES ('Reclamation');

-- Priorité NCF
INSERT INTO Priorite_nc (degre,nom,descr) VALUES (1,'Haute','tres haute');

-- Phases et status NC
INSERT INTO Phase_nc (nom, ordre) VALUES ('Déclaration', 1);
INSERT INTO Phase_nc (nom, ordre) VALUES ('Traitement', 2);
INSERT INTO Phase_nc (nom, ordre) VALUES ('Cloture', 3);

INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('En qualification', 'En attente de qualification par la QUA', 'en_qualification' ,1);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('A clarifier', 'Le responsable QUA demande plus d''information', 'a_clarifier',1);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Reçevable', 'Qualifié comme recevable par la QUA', 'recevable',1);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Non Recevable', 'Qualifié comme non-recevable par la QUA', 'non_recevable',1);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Analysé','Causes analysés', 'analysé',2);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Assigné','Les actions sont en cours', 'assigné',2);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Suspendue', 'Suspendue', 'suspendue',2);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Vérifié', 'Efficacité vérifié','vérifié', 3);
INSERT INTO Status_nc (nom, descr, color , id_phase_nc) VALUES ('Clôturé', 'Cloturé ', 'cloturé',3);

-- Categorie cause NC
INSERT INTO Categorie_cause_nc (nom) VALUES ('Milieu');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Méthode');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Matériel');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Matière');
INSERT INTO Categorie_cause_nc (nom) VALUES ('Main d''oeuvre');

-- Operations
INSERT INTO Operation (nom) VALUES ('Création');
INSERT INTO Operation (nom) VALUES ('Modification');
INSERT INTO Operation (nom) VALUES ('Suppression');

-- Entités (bloc original #2)
INSERT INTO Entite (nom) VALUES ('Processus');
INSERT INTO Entite (nom) VALUES ('Non-conformité');
INSERT INTO Entite (nom) VALUES ('Plan d''action');
INSERT INTO Entite (nom) VALUES ('Action');

-- Status_action
INSERT INTO Status_action (nom, color) VALUES ('Backlog', 'backlog');
INSERT INTO Status_action (nom, color) VALUES ('En cours', 'en_cours');
INSERT INTO Status_action (nom, color) VALUES ('Terminée', 'terminée');
INSERT INTO Status_action (nom, color) VALUES ('Suspendu', 'suspendu');

-- Source_PA
INSERT INTO Source_PA (descr) VALUES ('Audit interne');
INSERT INTO Source_PA (descr) VALUES ('Audit externe');
INSERT INTO Source_PA (descr) VALUES ('Revue de direction');
INSERT INTO Source_PA (descr) VALUES ('Objectifs du processus');
INSERT INTO Source_PA (descr) VALUES ('Analyse environnementale');
INSERT INTO Source_PA (descr) VALUES ('Enquete satisfation client');
INSERT INTO Source_PA (descr) VALUES ('Veille règlementaire');
INSERT INTO Source_PA (descr) VALUES ('Seance de travail');

-- Status_PA
INSERT INTO Status_PA (nom, color) VALUES ('Ouvert', 'en_qualification');
INSERT INTO Status_PA (nom, color) VALUES ('Assigné', 'assigné');
INSERT INTO Status_PA (nom, color) VALUES ('Vérifié', 'vérifiéé');
INSERT INTO Status_PA (nom, color) VALUES ('Cloturé', 'cloturé');

-- Objectifs stratégiques
INSERT INTO Objectif_strategique (descr) VALUES ('Le respect strict de nos obligation de conformité et le déploiement de standards d''exploitation internationaux ');
INSERT INTO Objectif_strategique (descr) VALUES ('L''écoute et l''amélioration de la satisfaction de tous nos client passagers, compagnies aériennes et partenaires ');
INSERT INTO Objectif_strategique (descr) VALUES ('La contribution active au  développement économique local et national');
INSERT INTO Objectif_strategique (descr) VALUES ('Contribution active au développement économique local et national');
INSERT INTO Objectif_strategique (descr) VALUES ('La protection de l''environnement et la mise en place de la responsabilité sociétale d''entreprise');

-- Objectifs, indicateurs et mesures
INSERT INTO Objectif (id_processus, id_objectif_strategique, descr) VALUES (1, 1, 'Assurer la conformité aux exigences légales et réglementaires applicables au secteur aéronautique.');

-- Units, frequencies, indicators, targets, and measurements
INSERT INTO Unite_mesure (nom, abr) VALUES ('Pourcentage', '%');

-- Frequencies
INSERT INTO Frequence_mesure (nom, descr, intervalle_mois) VALUES ('Mensuelle', 'Mesure effectuée chaque mois', 1);

-- Indicateurs
INSERT INTO Indicateur (nom, id_objectif, id_unite_mesure, id_frequence_mesure, source) VALUES 
('Taux de conformité réglementaire', 1, 1, 1, 'Rapports d''audit interne et externe');

-- Validité indicateur
INSERT INTO Validite_indicateur (id_indicateur, annee) VALUES 
(1, 2026);

-- Cibles et mesures indicateur
INSERT INTO Cible_indicateur (cible_optimale, cible_min, cible_max, cible_description, id_indicateur) VALUES 
(null, null, 90.0, 'Cible optimale de 100%, minimum acceptable de 95%', 1);

-- Mesures indicateur
INSERT INTO Mesure_indicateur (id_cible_indicateur, id_indicateur, annee, periode, valeur, commentaire) VALUES (1, 1, 2023, 1, 75.5, 'Mesure du premier trimestre 2023');




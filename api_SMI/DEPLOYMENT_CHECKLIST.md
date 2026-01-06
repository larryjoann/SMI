# Checklist de Déploiement - Gestion des Responsables de Processus

## 📋 Préparation (Avant le Déploiement)

- [ ] **Backup Complet de la Base de Données**
  - Sauvegarder la base de données entière
  - Localisation du backup: `___________________`
  - Date du backup: `___________________`

- [ ] **Vérifier les Rôles Existants**
  ```sql
  SELECT * FROM Role WHERE libelle IN ('Pilote', 'Copilote');
  ```
  - [ ] Rôle 'Pilote' existe
  - [ ] Rôle 'Copilote' existe
  - Si manquants, les créer dans la base

- [ ] **Vérifier les Données Existantes**
  ```sql
  SELECT COUNT(*) as TotalPilotes FROM Pilote;
  SELECT COUNT(*) as TotalCopilotes FROM Copilote;
  ```
  - Nombre total de Pilotes: `___________________`
  - Nombre total de Copilotes: `___________________`

- [ ] **Tester l'Environnement de Compilation**
  ```bash
  dotnet build
  ```
  - [ ] Compilation réussie (0 erreurs)
  - [ ] Aucun avertissement critique

---

## 🔄 Phase 1: Création des Tables

- [ ] **Exécuter le Script de Création**
  - Fichier: `Data/migrations/001_Create_ResponsableProcessus_Tables.sql`
  - [ ] Tables créées sans erreur
  - [ ] Indexes créés

- [ ] **Vérifier la Création**
  ```sql
  SELECT * FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_NAME IN ('Type_responsable_processus', 'Responsable_processus');
  ```
  - [ ] Deux tables créées

---

## 🔄 Phase 2: Configuration des Types de Responsables

- [ ] **Exécuter le Script de Migration Complet**
  - Fichier: `Data/migrations/GUIDE_MIGRATION_COMPLET.sql`
  - Phases à exécuter:
    - [ ] Phase 1: Préparation (vérifications)
    - [ ] Phase 2: Création des tables (si pas déjà fait)
    - [ ] Phase 3: Créer les types de responsables
    - [ ] Phase 4: Migrer les données
    - [ ] Phase 5: Vérification de la migration

- [ ] **Vérifier les Types Créés**
  ```sql
  SELECT * FROM Type_responsable_processus;
  ```
  - [ ] Type Pilote créé
  - [ ] Type Copilote créé

---

## 🔄 Phase 3: Migration des Données

- [ ] **Compter les Enregistrements Avant**
  - Pilotes migrés: `___________________`
  - Copilotes migrés: `___________________`

- [ ] **Exécuter la Vérification de Doublons**
  ```sql
  SELECT COUNT(*) 
  FROM Responsable_processus
  GROUP BY matricule_collaborateur, id_processus, id_type_responsable_processus
  HAVING COUNT(*) > 1;
  ```
  - [ ] Aucun doublon détecté

- [ ] **Afficher un Échantillon de Données Migrées**
  ```sql
  SELECT TOP 10 * FROM Responsable_processus;
  ```
  - [ ] Les données s'affichent correctement

---

## 🔨 Phase 4: Compilation et Build

- [ ] **Compiler le Projet**
  ```bash
  cd c:\Users\26132\Documents\SMI\api_SMI
  dotnet build
  ```
  - [ ] Build réussi sans erreurs
  - Erreurs détectées: `___________________`

- [ ] **Vérifier les Avertissements**
  - [ ] Aucun avertissement critique lié aux nouveaux services
  - Avertissements acceptés: `___________________`

---

## 🧪 Phase 5: Tests API

- [ ] **Lancer l'Application**
  ```bash
  dotnet run
  ```
  - [ ] Application démarrée sans erreur
  - URL: `https://localhost:7000`

- [ ] **Tester TypeResponsableProcessusController**
  - [ ] GET `/api/typeresponsableprocessus` - ✅ Retourne la liste
  - [ ] GET `/api/typeresponsableprocessus/1` - ✅ Retourne un type
  - [ ] GET `/api/typeresponsableprocessus/by-role/1` - ✅ Filtre par rôle

- [ ] **Tester ResponsableProcessusController**
  - [ ] GET `/api/responsableprocessus` - ✅ Retourne la liste
  - [ ] GET `/api/responsableprocessus/by-processus/1` - ✅ Filtre par processus
  - [ ] GET `/api/responsableprocessus/by-collaborateur/MAT001` - ✅ Filtre par collaborateur
  - [ ] POST `/api/responsableprocessus` - ✅ Créer un responsable
  - [ ] PUT `/api/responsableprocessus/1` - ✅ Mettre à jour
  - [ ] DELETE `/api/responsableprocessus/1` - ✅ Supprimer

- [ ] **Tester les Cas d'Utilisation Courants**
  - [ ] Assigner un pilote à un processus
  - [ ] Assigner un copilote à un processus
  - [ ] Obtenir tous les responsables d'un processus
  - [ ] Remplacer un pilote existant
  - [ ] Lister les responsabilités d'un collaborateur

---

## 📊 Phase 6: Validation des Données

- [ ] **Vérifier l'Intégrité Référentielle**
  ```sql
  -- Vérifier les orphelins
  SELECT * FROM Responsable_processus 
  WHERE id_processus NOT IN (SELECT id FROM Processus)
  OR matricule_collaborateur NOT IN (SELECT matricule FROM Collaborateur)
  OR id_type_responsable_processus NOT IN (SELECT id FROM Type_responsable_processus);
  ```
  - [ ] Aucun enregistrement orphelin

- [ ] **Comparer les Totaux**
  - Avant migration - Pilotes: `___________________`
  - Après migration - Pilotes: `___________________`
  - Avant migration - Copilotes: `___________________`
  - Après migration - Copilotes: `___________________`
  - [ ] Les nombres correspondent

- [ ] **Vérifier l'Application du Code Métier**
  - [ ] Les nouveaux endpoints sont accessibles
  - [ ] Les relations sont correctement chargées
  - [ ] Les filtres fonctionnent correctement

---

## 📚 Phase 7: Documentation & Communication

- [ ] **Documenter les Changements**
  - [ ] Fichier `MIGRATION_RESPONSABLES_PROCESSUS.md` - ✅ Créé
  - [ ] Fichier `ADAPTATION_RESPONSABLES_SUMMARY.md` - ✅ Créé
  - [ ] Exemples d'API `responsablesProcessus.http` - ✅ Créé

- [ ] **Communiquer aux Équipes**
  - [ ] Email d'information envoyé aux développeurs
  - [ ] Mise à jour de la documentation du projet
  - [ ] Formation/briefing sur les nouveaux endpoints

- [ ] **Mettre à Jour les Systèmes Dépendants**
  - [ ] Frontend: Mise à jour des appels API
  - [ ] Documentation API (Swagger)
  - [ ] Outils d'intégration tiers

---

## 🔐 Phase 8: Nettoyage (Après 2-4 semaines de validation)

⚠️ **À exécuter UNIQUEMENT après validation complète**

- [ ] **Archiver les Anciennes Tables**
  ```sql
  -- Créer des backups (si pas déjà fait)
  SELECT * INTO Pilote_Final_Backup FROM Pilote;
  SELECT * INTO Copilote_Final_Backup FROM Copilote;
  
  -- Supprimer les anciennes tables
  DROP TABLE Copilote;
  DROP TABLE Pilote;
  ```
  - [ ] Backup créé
  - [ ] Tables supprimées

- [ ] **Nettoyer les Anciens Services (Optionnel)**
  - [ ] PiloteService - À maintenir ou supprimer?
  - [ ] CopiloteService - À maintenir ou supprimer?
  - [ ] PiloteRepository - À maintenir ou supprimer?
  - [ ] CopiloteRepository - À maintenir ou supprimer?

---

## ✅ Checklist Finale

- [ ] Toutes les phases complétées
- [ ] Tous les tests réussis
- [ ] Base de données validée
- [ ] Équipes informées
- [ ] Documentation à jour
- [ ] Application stable en production

**Date de Completion: ___________________**
**Responsable: ___________________**
**Signature: ___________________**

---

## 🆘 Problèmes Rencontrés

Documenter tout problème rencontré et sa résolution:

| Problème | Cause | Solution | Statut |
|----------|-------|----------|--------|
| | | | |
| | | | |
| | | | |

---

## 📞 Contacts d'Urgence

- **DBA**: `___________________`
- **Tech Lead Backend**: `___________________`
- **Product Manager**: `___________________`

---

## 📌 Notes Importantes

1. **Sauvegarde**: Toujours conserver un backup complet avant toute modification de la base
2. **Test**: Tester dans un environnement de staging avant la production
3. **Rollback**: Garder les scripts de rollback à proximité en cas de problème
4. **Communication**: Informer tous les stakeholders des changements
5. **Monitoring**: Surveiller les logs après le déploiement

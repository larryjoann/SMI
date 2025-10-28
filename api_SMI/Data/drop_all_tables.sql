-- Script pour supprimer toutes les tables du schéma avant de (re)créer / (re)seed
-- Exécuter ce script avant `schema.sql` si vous voulez tout recréer proprement.

SET XACT_ABORT ON;
BEGIN TRANSACTION;

PRINT 'Dropping tables in order to avoid foreign key conflicts...';

-- Tables dependantes (children) d'abord
IF OBJECT_ID('Role_permission','U') IS NOT NULL DROP TABLE Role_permission;
IF OBJECT_ID('Role_collaborateur','U') IS NOT NULL DROP TABLE Role_collaborateur;
IF OBJECT_ID('Pilote','U') IS NOT NULL DROP TABLE Pilote;
IF OBJECT_ID('Copilote','U') IS NOT NULL DROP TABLE Copilote;
IF OBJECT_ID('Processus_concerne_nc','U') IS NOT NULL DROP TABLE Processus_concerne_nc;
IF OBJECT_ID('Piece_jointe_nc','U') IS NOT NULL DROP TABLE Piece_jointe_nc;
IF OBJECT_ID('Cause_nc','U') IS NOT NULL DROP TABLE Cause_nc;
IF OBJECT_ID('Commentaire_nc','U') IS NOT NULL DROP TABLE Commentaire_nc;

-- Non-conformité (drop before Phase/Status/Priorite/Type/Lieu)
IF OBJECT_ID('Non_conformite','U') IS NOT NULL DROP TABLE Non_conformite;

-- Tables liées aux status / phases / priorités / types / lieux
IF OBJECT_ID('Status_nc','U') IS NOT NULL DROP TABLE Status_nc;
IF OBJECT_ID('Phase_nc','U') IS NOT NULL DROP TABLE Phase_nc;
IF OBJECT_ID('Priorite_nc','U') IS NOT NULL DROP TABLE Priorite_nc;
IF OBJECT_ID('Type_nc','U') IS NOT NULL DROP TABLE Type_nc;
IF OBJECT_ID('Lieu','U') IS NOT NULL DROP TABLE Lieu;

-- Catégories de cause
IF OBJECT_ID('Categorie_cause_nc','U') IS NOT NULL DROP TABLE Categorie_cause_nc;

-- Roles / permissions / collaborateurs / processus
IF OBJECT_ID('Role','U') IS NOT NULL DROP TABLE Role;
IF OBJECT_ID('Permission','U') IS NOT NULL DROP TABLE Permission;
IF OBJECT_ID('Categorie_permission','U') IS NOT NULL DROP TABLE Categorie_permission;
IF OBJECT_ID('Collaborateur','U') IS NOT NULL DROP TABLE Collaborateur;

-- Processus et catégories de processus
IF OBJECT_ID('Pilote','U') IS NOT NULL DROP TABLE Pilote; -- defensive: may already be dropped above
IF OBJECT_ID('Copilote','U') IS NOT NULL DROP TABLE Copilote;
IF OBJECT_ID('Processus','U') IS NOT NULL DROP TABLE Processus;
IF OBJECT_ID('Categorie_processus','U') IS NOT NULL DROP TABLE Categorie_processus;

-- Sécurité supplémentaire : tenter de supprimer tout ce qui pourrait rester
-- (utile si vous avez modifié le schéma et ajouté d'autres tables)
DECLARE @tbl NVARCHAR(256);
DECLARE cur CURSOR FOR
    SELECT QUOTENAME(OBJECT_SCHEMA_NAME(object_id)) + '.' + QUOTENAME(name)
    FROM sys.tables
    WHERE name NOT IN (
        'sysdiagrams'
    );

OPEN cur;
FETCH NEXT FROM cur INTO @tbl;
WHILE @@FETCH_STATUS = 0
BEGIN
    BEGIN TRY
        EXEC('DROP TABLE ' + @tbl);
        PRINT('Dropped: ' + @tbl);
    END TRY
    BEGIN CATCH
        PRINT('Could not drop: ' + @tbl + ' - ' + ERROR_MESSAGE());
    END CATCH;

    FETCH NEXT FROM cur INTO @tbl;
END

CLOSE cur;
DEALLOCATE cur;

COMMIT TRANSACTION;

PRINT 'Drop script finished.';

GO

-- drop_all_tables.sql
-- Script pour supprimer toutes les tables utilisateur dans la base de données courante.
-- ATTENTION : exécuter uniquement en environnement de développement ou de test.
-- Faites une sauvegarde avant d'exécuter ce script.

SET NOCOUNT ON;

-- 1) Supprimer toutes les contraintes de clés étrangères
DECLARE @dropFKs NVARCHAR(MAX) = N'';
SELECT @dropFKs += 'ALTER TABLE ' + QUOTENAME(SCHEMA_NAME(t.schema_id)) + '.' + QUOTENAME(OBJECT_NAME(f.parent_object_id))
    + ' DROP CONSTRAINT ' + QUOTENAME(f.name) + ';' + CHAR(13)
FROM sys.foreign_keys AS f
INNER JOIN sys.tables AS t ON f.parent_object_id = t.object_id
WHERE t.is_ms_shipped = 0;

IF LEN(@dropFKs) > 0
BEGIN
    PRINT 'Dropping foreign keys...';
    PRINT @dropFKs;
    EXEC sp_executesql @dropFKs;
END
ELSE
BEGIN
    PRINT 'No foreign keys to drop.';
END

-- 2) Supprimer toutes les tables utilisateur
DECLARE @dropTables NVARCHAR(MAX) = N'';
SELECT @dropTables += 'DROP TABLE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.tables AS t
WHERE t.is_ms_shipped = 0;

IF LEN(@dropTables) > 0
BEGIN
    PRINT 'Dropping tables...';
    PRINT @dropTables;
    EXEC sp_executesql @dropTables;
END
ELSE
BEGIN
    PRINT 'No user tables to drop.';
END

PRINT 'Done.';

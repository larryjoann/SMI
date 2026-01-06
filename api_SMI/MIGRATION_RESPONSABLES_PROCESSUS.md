# Migration: Gestion des Responsables de Processus

## Résumé des Changements

La gestion des pilotes et copilotes de processus a été refactorisée pour utiliser un système plus flexible basé sur les rôles.

### Ancien Système
- Tables: `Pilote` et `Copilote`
- Structure: Deux types fixes, une table par type
- Limitations: Difficile d'ajouter de nouveaux types de responsables

### Nouveau Système
- Tables: `Type_responsable_processus` et `Responsable_processus`
- Structure: Un système flexible basé sur les rôles
- Avantages: 
  - Extensible pour ajouter de nouveaux types de responsables
  - Lié au système de rôles existant
  - Meilleure traçabilité et gestion des responsabilités

## Structure des Données

### Table: Type_responsable_processus
```sql
CREATE TABLE Type_responsable_processus (
    id INT IDENTITY PRIMARY KEY,
    id_role INT NOT NULL UNIQUE,
    FOREIGN KEY(id_role) REFERENCES Role(id)
);
```

**Champs:**
- `id`: Identifiant unique
- `id_role`: Référence au rôle (lien vers table Role)

### Table: Responsable_processus
```sql
CREATE TABLE Responsable_processus (
    id INT IDENTITY PRIMARY KEY,
    matricule_collaborateur VARCHAR(50) NOT NULL,
    id_processus INT NOT NULL,
    id_type_responsable_processus INT NOT NULL,
    FOREIGN KEY(id_processus) REFERENCES Processus(id),
    FOREIGN KEY(matricule_collaborateur) REFERENCES Collaborateur(matricule),
    FOREIGN KEY(id_type_responsable_processus) REFERENCES Type_responsable_processus(id),
    UNIQUE (matricule_collaborateur, id_processus, id_type_responsable_processus)
);
```

**Champs:**
- `id`: Identifiant unique
- `matricule_collaborateur`: Identifiant du collaborateur
- `id_processus`: Référence au processus
- `id_type_responsable_processus`: Type de responsabilité

**Contrainte Unique:** Un collaborateur ne peut avoir qu'un seul rôle pour un processus donné

## Changements du Modèle

### Modèle Processus
**Avant:**
```csharp
public ICollection<Pilote> Pilotes { get; set; }
public ICollection<Copilote> Copilotes { get; set; }
```

**Après:**
```csharp
public ICollection<ResponsableProcessus> ResponsablesProcessus { get; set; }
```

### Nouveaux Modèles
- `TypeResponsableProcessus.cs`: Définition des types de responsables
- `ResponsableProcessus.cs`: Assignation des responsables aux processus

## Endpoints API

### TypeResponsableProcessus
- `GET /api/typeresponsableprocessus` - Lister tous les types
- `GET /api/typeresponsableprocessus/{id}` - Obtenir un type
- `GET /api/typeresponsableprocessus/by-role/{idRole}` - Obtenir les types par rôle
- `POST /api/typeresponsableprocessus` - Créer un type
- `PUT /api/typeresponsableprocessus/{id}` - Mettre à jour un type
- `DELETE /api/typeresponsableprocessus/{id}` - Supprimer un type

### ResponsableProcessus
- `GET /api/responsableprocessus` - Lister tous les responsables
- `GET /api/responsableprocessus/{id}` - Obtenir un responsable
- `GET /api/responsableprocessus/by-processus/{idProcessus}` - Lister les responsables d'un processus
- `GET /api/responsableprocessus/by-collaborateur/{matricule}` - Lister les processus d'un collaborateur
- `GET /api/responsableprocessus/by-type/{idType}` - Lister les responsables par type
- `GET /api/responsableprocessus/by-processus-and-type/{idProcessus}/{idType}` - Lister les responsables filtrés
- `POST /api/responsableprocessus` - Créer un responsable
- `PUT /api/responsableprocessus/{id}` - Mettre à jour un responsable
- `DELETE /api/responsableprocessus/{id}` - Supprimer un responsable

## Fichiers Modifiés/Créés

### Modèles
- ✅ `Models/Processus.cs` - Mis à jour pour utiliser ResponsableProcessus
- ✅ `Models/TypeResponsableProcessus.cs` - **NOUVEAU**
- ✅ `Models/ResponsableProcessus.cs` - **NOUVEAU**

### Services
- ✅ `Services/TypeResponsableProcessus/ITypeResponsableProcessusService.cs` - **NOUVEAU**
- ✅ `Services/TypeResponsableProcessus/TypeResponsableProcessusService.cs` - **NOUVEAU**
- ✅ `Services/ResponsableProcessus/IResponsableProcessusService.cs` - **NOUVEAU**
- ✅ `Services/ResponsableProcessus/ResponsableProcessusService.cs` - **NOUVEAU**

### Contrôleurs
- ✅ `Controllers/TypeResponsableProcessusController.cs` - **NOUVEAU**
- ✅ `Controllers/ResponsableProcessusController.cs` - **NOUVEAU**

### Repositories
- ✅ `Repositories/TypeResponsableProcessusRepository.cs` - **NOUVEAU**
- ✅ `Repositories/ResponsableProcessusRepository.cs` - **NOUVEAU**

### DTOs
- ✅ `Models/Dto/TypeResponsableProcessusDto.cs` - **NOUVEAU**
- ✅ `Models/Dto/ResponsableProcessusDto.cs` - **NOUVEAU**

### Configuration
- ✅ `Data/ApplicationDbContext.cs` - DbSets déjà présents
- ✅ `Program.cs` - Ajout des enregistrements des services et repositories

### Migrations SQL
- ✅ `Data/migrations/001_Create_ResponsableProcessus_Tables.sql` - DDL des nouvelles tables
- ✅ `Data/migrations/002_Migrate_Pilote_Copilote_Data.sql` - Migration des données existantes

## Étapes de Déploiement

1. **Préparation Rôles:**
   ```sql
   INSERT INTO Role (libelle) VALUES ('Pilote');
   INSERT INTO Role (libelle) VALUES ('Copilote');
   ```

2. **Création des Tables:**
   ```
   Exécuter: Data/migrations/001_Create_ResponsableProcessus_Tables.sql
   ```

3. **Migration des Données:**
   ```
   Exécuter: Data/migrations/002_Migrate_Pilote_Copilote_Data.sql
   ```

4. **Compiler et Déployer:**
   ```bash
   dotnet build
   dotnet run
   ```

5. **Archivage (Optionnel):**
   ```sql
   -- Une fois la migration vérifiée, supprimer les anciennes tables
   DROP TABLE Copilote;
   DROP TABLE Pilote;
   ```

## Compatibilité Rétroactive

Les anciens endpoints pour Pilote et Copilote peuvent être:
- **Maintenus** pour une transition progressive
- **Remappés** pour utiliser les nouveaux endpoints
- **Dépréciés** avec migration automatique

## Notes Importantes

- ⚠️ Vérifiez la migration des données avant de supprimer les anciennes tables
- ⚠️ Assurez-vous que les rôles 'Pilote' et 'Copilote' existent dans la table Role
- ⚠️ Testez les endpoints API après le déploiement
- ℹ️ Le système est maintenant extensible pour ajouter d'autres types de responsables (Auditeur, Validateur, etc.)

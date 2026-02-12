# Architecture du Projet SMI (Système de Management Intégré)

## 📋 Vue d'ensemble

Le projet SMI est une application web complète pour la gestion intégrée d'un système de management. Il est composé de deux parties principales :
- **Backend API** : ASP.NET Core (C#) - REST API
- **Frontend** : React avec CoreUI - Interface utilisateur

---

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                         │
│                   React + CoreUI + Vite                      │
│                  Port: 3000 (développement)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP(S) REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API (Backend)                              │
│              ASP.NET Core 8.0 (C#)                           │
│                  REST API + JWT Auth                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Server
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database                                  │
│              SQL Server / SQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du Backend (api_SMI)

### Architecture en Couches

```
api_SMI/
├── Controllers/          # Points d'entrée HTTP (45+ contrôleurs)
├── Services/             # Logique métier
├── Repositories/         # Accès aux données (Repository Pattern)
├── Models/               # Modèles de données (Entités)
├── Data/                 # Contexte Entity Framework
├── Attributes/           # Attributs personnalisés (Auth, Permissions)
├── Authorization/        # Logique d'autorisation
├── Middleware/           # Middlewares ASP.NET Core
├── Extensions/           # Méthodes d'extension
├── Ldap/                 # Intégration LDAP
├── Properties/           # Configuration des propriétés de projet
├── bin/                  # Fichiers compilés
├── obj/                  # Objets temporaires de compilation
├── scripts/              # Scripts SQL/Powershell
├── uploads/              # Fichiers téléchargés
├── appsettings.json      # Configuration (production)
├── appsettings.Development.json  # Configuration (développement)
├── Program.cs            # Point d'entrée de l'application
├── api_SMI.csproj        # Fichier projet .NET
└── api_SMI.sln           # Solution Visual Studio
```

### 🎯 Contrôleurs Principaux (45+)

Le backend expose des contrôleurs REST pour gérer :

#### Gestion des Conformités
- `NonConformiteController` - Gestion des non-conformités (NC)
- `NCDetailsController` - Détails des NC
- `TypeNcController` - Types de NC
- `PrioriteNcController` - Priorités des NC
- `StatusNcController` - Statuts des NC
- `CommentaireNcController` - Commentaires sur les NC
- `PieceJointeNcController` - Pièces jointes aux NC

#### Gestion des Plans d'Action
- `PlanActionController` - Plans d'action
- `ActionController` - Actions
- `ActionDetailsController` - Détails des actions
- `ResponsableActionController` - Responsables des actions
- `StatusActionController` - Statuts des actions
- `SourceActionController` - Sources des actions
- `SuiviActionController` - Suivi des actions

#### Gestion des Processus
- `ProcessusController` - Processus
- `CategorieProcessusController` - Catégories de processus
- `ProcessusConcerneNcController` - Processus concernés par NC
- `ProcessusConcernePAController` - Processus concernés par PA
- `ResponsableProcessusController` - Responsables de processus
- `TypeResponsableProcessusController` - Types de responsables
- `ValiditeProcessusController` - Validité des processus
- `RessourceProcessusController` - Ressources des processus

#### Gestion des Indicateurs
- `IndicateurController` - Indicateurs
- `ObjectifController` - Objectifs
- `ObjectifStrategiqueController` - Objectifs stratégiques
- `CibleIndicateurController` - Cibles des indicateurs
- `MesureIndicateurController` - Mesures des indicateurs
- `ValiditeIndicateurController` - Validité des indicateurs
- `UniteMesureController` - Unités de mesure
- `FrequenceMesureController` - Fréquences de mesure

#### Gestion Organisationnelle
- `EntiteController` - Entités organisationnelles
- `LieuController` - Lieux
- `CollaborateurController` - Collaborateurs
- `RoleCollaborateurController` - Rôles des collaborateurs

#### Gestion des Causes et Ressources
- `CauseNcController` - Causes des NC
- `CategorieCauseNcController` - Catégories des causes
- `CategorieRessourcesController` - Catégories de ressources
- `PartieInteresseAttenteController` - Parties intéressées

#### Gestion d'Autres Éléments
- `ActiviteController` - Activités
- `OperationController` - Opérations
- `IntercationController` - Interactions (typo possible : Interactions)
- `HistoriqueController` - Historique
- `NotificationController` - Notifications

#### Sécurité et Authentification
- `AuthController` - Authentification (JWT)
- `PermissionController` - Permissions
- `CategoriePermissionController` - Catégories de permissions
- `RoleController` - Rôles
- `RolePermissionController` - Permissions par rôle

### 🔐 Architecture de Sécurité

#### Authentification
- **Type** : JWT Bearer Token
- **Configuration** : 
  - `JwtSettings:Issuer` - Émetteur du token
  - `JwtSettings:Audience` - Audience du token
  - `JwtSettings:SecretKey` - Clé secrète (SymmetricSecurityKey)
- **Validation** : Durée de vie, signature, émetteur, audience

#### Autorisation
- **Attribut personnalisé** : `RequirePermissionAttribute`
- **Middleware** : Logique d'autorisation personnalisée
- **Contrôle d'accès** : Basé sur les permissions et rôles

#### CORS (Cross-Origin Resource Sharing)
- Politique par défaut : Accepte toutes les origines, headers et méthodes
- Politique `AllowAll` : Alternative pour plus de flexibilité

### 🗄️ Accès aux Données

#### Entity Framework Core 9.0.8
- **Provider** : SQL Server
- **Contexte** : `ApplicationDbContext`
- **Pattern** : Repository Pattern
- **Fichiers** :
  - `Data/ApplicationDbContext.cs` - Configuration EF Core
  - `Data/schema.sql` - Schéma de base de données
  - `Data/drop_all_tables.sql` - Script de nettoyage
  - `Repositories/` - Classes Repository

### 📦 Dépendances Principales

```xml
Microsoft.AspNetCore.Authentication.JwtBearer (8.0.2)
Microsoft.EntityFrameworkCore.SqlServer (9.0.8)
Microsoft.Data.SqlClient (6.1.1)
System.DirectoryServices (9.0.8)  # LDAP
Scrutor (7.0.0)                   # DI automatique
Swashbuckle.AspNetCore (6.4.0)   # Swagger/OpenAPI
```

---

## 🎨 Structure du Frontend (fornt-SMI)

### Stack Technologique
- **Framework** : React 18+
- **Template** : CoreUI Free React Admin Template v5.4.0
- **Build Tool** : Vite
- **Style** : CoreUI CSS Framework
- **Port** : 3000 (développement)

### Structure du Dossier

```
fornt-SMI/
├── src/                  # Code source
│   ├── components/       # Composants React réutilisables
│   ├── pages/           # Pages principales
│   ├── services/        # Services API (appels HTTP)
│   ├── contexts/        # Contextes React
│   ├── hooks/           # Hooks personnalisés
│   ├── utils/           # Utilitaires
│   ├── App.jsx          # Composant racine
│   └── main.jsx         # Point d'entrée
├── public/              # Fichiers statiques
├── server/              # Configuration serveur Vite
├── build/               # Fichiers compilés (production)
├── vite.config.mjs      # Configuration Vite
├── eslint.config.mjs    # Configuration ESLint
├── package.json         # Dépendances et scripts
├── index.html           # Template HTML
├── GUIDE_INSTALLATION.md # Guide d'installation
├── README.md            # Documentation
└── LICENSE              # Licence MIT
```

### 📦 Dépendances Principales

```json
React (18+)
React-DOM (18+)
@coreui/react (5.5.0)
@coreui/coreui (5.3.1)
@coreui/icons-react (2.3.0)
@coreui/chartjs (4.1.0)
@blocknote/react (0.39.0)      # Éditeur de texte
@ckeditor/ckeditor5-react       # Éditeur riche
Axios/Fetch                      # Requêtes HTTP
React Router                      # Navigation
```

### 🔄 Flux de Communication Frontend-Backend

```
┌─────────────────────────┐
│    Composant React      │
│   (Page/Component)      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Services API          │
│  (API Calls via Axios)  │
└────────────┬────────────┘
             │ HTTP REST
             │ Headers: Authorization: Bearer <token>
             ▼
┌─────────────────────────┐
│   API Endpoints         │
│   (Controllers)         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Services (Métier)     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Repositories          │
│   (EF Core/LINQ)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   SQL Server            │
│   (Base de données)     │
└─────────────────────────┘
```

---

## 🔗 Intégrations Externes

### LDAP (Lightweight Directory Access Protocol)
- **Localisation** : `api_SMI/Ldap/`
- **Utilité** : Authentification contre Active Directory
- **Dépendance** : `System.DirectoryServices`

### SQL Server
- **Type** : Base de données relationnelle
- **Version** : Compatible avec EF Core 9.0.8
- **ORM** : Entity Framework Core
- **Configuration** : Connection string dans `appsettings.json`

---

## ⚙️ Configuration

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;..."
  },
  "JwtSettings": {
    "Issuer": "...",
    "Audience": "...",
    "SecretKey": "..."
  },
  "Logging": { ... }
}
```

### Frontend
- Variables d'environnement dans `.env` (optionnel)
- Configuration API : Base URL dans les services

---

## 🚀 Déploiement

### Backend
- **Framework** : ASP.NET Core 8.0
- **Port** : Configurable (par défaut 5000/5001)
- **Build** : `dotnet publish` pour la production

### Frontend
- **Build** : `npm run build` crée le dossier `build/`
- **Serveur** : Peut être servi par nginx, IIS, ou Node.js
- **Port** : 80/443 en production

---

## 📊 Flux de Données Principal

### Exemple : Créer une Non-Conformité

```
Frontend (React)
   │
   ├─► Formulaire NC
   │
   └─► Service API: POST /api/nonconformite
          │
          └─► Backend
              ├─► NonConformiteController.Post()
              │
              ├─► NonConformiteService.Create()
              │
              ├─► NonConformiteRepository.Add()
              │
              ├─► Entity Framework Core
              │
              └─► SQL Server
                  ├─► INSERT NonConformites
                  ├─► INSERT Historique
                  └─► COMMIT Transaction
                  
          └─► Response HTTP 201 Created
              
   ├─► Frontend: Afficher le succès
   │
   └─► Rediriger vers la liste des NC
```

---

## 🔒 Principes de Sécurité

1. **Authentification JWT** : Tokens signés cryptographiquement
2. **Autorisation basée sur les rôles** : RBAC
3. **Permissions granulaires** : Contrôle d'accès au niveau des opérations
4. **CORS** : Contrôle des requêtes cross-origin
5. **HTTPS recommandé** : En production
6. **Validation des entrées** : Au niveau des contrôleurs et services

---

## 📈 Scalabilité

### Points d'amélioration potentiels

1. **Caching** : Redis pour les données fréquemment accédées
2. **Pagination** : Implémenter sur les endpoints qui retournent beaucoup de données
3. **Microservices** : Séparer en services par domaine (NC, PA, Processus, etc.)
4. **Queue/Events** : Système de notifications/événements asynchrones
5. **Logging centralisé** : Serilog, Application Insights
6. **Load Balancing** : Pour les déploiements multi-instances

---

## 📝 Guides Complémentaires

- [GUIDE_INSTALLATION.md](api_SMI/GUIDE_INSTALLATION.md) - Installation du backend
- [GUIDE_INSTALLATION.md](fornt-SMI/GUIDE_INSTALLATION.md) - Installation du frontend
- [README.md](fornt-SMI/README.md) - Documentation frontend

---

## 👥 Équipe de Développement

- Backend : Développeurs C#/.NET
- Frontend : Développeurs React/JavaScript
- DevOps : Gestion du déploiement et infrastructure

---

**Dernière mise à jour** : Février 2026

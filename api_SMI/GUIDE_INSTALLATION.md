# Guide d'Installation et de Démarrage - API SMI

## ✅ Prérequis

- **.NET 8.0 SDK** ou supérieur : https://dotnet.microsoft.com/download
- **SQL Server** 2017+ 
- **Visual Studio** ou **VS Code**

## 📦 Installation

```bash
# 1. Ouvrir le terminal et aller dans le dossier du projet
cd c:\Users\26132\Documents\SMI\api_SMI

# 2. Restaurer les dépendances
dotnet restore
```

## ⚙️ Configuration

Éditer le fichier `appsettings.json` et adapter :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YOUR_DATABASE;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  }
}
```

**À remplacer :**
- `YOUR_SERVER` : Serveur SQL (ex: `localhost`)
- `YOUR_DATABASE` : Nom de la BDD (ex: `KPI_DQRSE_SMI`)
- `YOUR_PASSWORD` : Mot de passe

## 🚀 Démarrer l'API

```bash
# Mode développement
dotnet run
```

L'API sera disponible sur : **https://localhost:5001**

## 📡 Accéder à l'API

- **Documentation Swagger** : https://localhost:5001/swagger
- **Authentification** : `POST /api/auth/login`
- **Token JWT** : Requis pour les autres requêtes (header `Authorization: Bearer <token>`)

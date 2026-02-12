# Guide d'Installation et de Démarrage - SMI Front

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (version 16 ou supérieure) : https://nodejs.org/
- **npm** (livré avec Node.js)

## Installation

### 1. Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cela va télécharger et installer toutes les dépendances nécessaires.

## Démarrage

### Mode développement

Pour lancer l'application en mode développement :

```bash
npm start
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse : `http://localhost:5173/`

### Mode production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers compilés seront générés dans le dossier `build/`.

### Prévisualiser la build de production

Pour tester localement la version de production :

```bash
npm run serve
```

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarrer le serveur de développement |
| `npm run build` | Compiler pour la production |
| `npm run serve` | Prévisualiser la build de production |
| `npm run lint` | Vérifier le code avec ESLint |

## Structure du projet

```
src/
├── components/      # Composants réutilisables
├── features/        # Fonctionnalités principales
├── views/           # Pages
├── services/        # Services API
├── hooks/           # Hooks personnalisés
├── utils/           # Utilitaires
├── scss/            # Styles
└── App.js           # Composant principal
```

## Dépannage

**Le serveur ne démarre pas ?**
- Vérifiez que Node.js est correctement installé : `node --version`
- Supprimez le dossier `node_modules` et le fichier `package-lock.json`, puis réinstallez :
  ```bash
  rm -r node_modules package-lock.json
  npm install
  ```

**Le port 5173 est occupé ?**
- Le serveur essaiera automatiquement un autre port, ou vous pouvez changer le port manuellement.

## Support

Pour plus d'informations, consultez la documentation officielle de Vite : https://vitejs.dev/

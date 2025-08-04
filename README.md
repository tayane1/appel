# CI-Tender - Plateforme d'Appels d'Offres en Côte d'Ivoire

## 🎯 Vue d'ensemble

CI-Tender est une plateforme moderne de consultation et de publication d'appels d'offres en Côte d'Ivoire. L'application a été simplifiée pour offrir une expérience utilisateur optimale avec une séparation claire entre l'interface publique et l'administration.

## ✨ Fonctionnalités

### Interface Publique (Sans Authentification)

- **Consultation des appels d'offres** : Parcourir tous les appels d'offres disponibles
- **Recherche avancée** : Filtrer par secteur, localisation, budget
- **Annuaire des fournisseurs** : Découvrir des entreprises qualifiées
- **Mode sombre/clair** : Interface adaptative selon les préférences
- **Design responsive** : Optimisé pour tous les appareils

### Administration (Authentification Requise)

- **Gestion des appels d'offres** : Créer, modifier, supprimer
- **Gestion des fournisseurs** : Valider et gérer l'annuaire
- **Gestion des utilisateurs** : Contrôle des accès admin
- **Gestion des publicités** : Bannières promotionnelles
- **Tableau de bord** : Statistiques et métriques

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd appel

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible à l'adresse : `http://localhost:4200`

## 🏗️ Architecture

### Structure des Composants

```
src/
├── app/
│   ├── core/                 # Services et modèles partagés
│   │   ├── services/        # Services API, Auth, Theme
│   │   ├── models/          # Interfaces TypeScript
│   │   └── guards/          # Guards de routage
│   ├── features/            # Modules fonctionnels
│   │   ├── home/           # Page d'accueil
│   │   ├── tenders/        # Gestion des appels d'offres
│   │   ├── suppliers/      # Annuaire des fournisseurs
│   │   ├── auth/           # Authentification
│   │   └── admin/          # Interface d'administration
│   └── shared/             # Composants partagés
│       ├── header/         # En-tête de navigation
│       ├── footer/         # Pied de page
│       └── components/     # Composants réutilisables
```

### Technologies Utilisées

- **Angular 17** : Framework principal
- **TypeScript** : Langage de programmation
- **SCSS** : Préprocesseur CSS
- **RxJS** : Programmation réactive
- **Angular Signals** : Gestion d'état moderne

## 🎨 Design et Thème

### Thème Ukraine (Côte d'Ivoire)

L'application utilise un thème inspiré des couleurs de la Côte d'Ivoire :

- **Orange** (#ff7900) : Dynamisme et énergie
- **Vert** (#00a651) : Nature et croissance
- **Bleu** (#0057b8) : Confiance et professionnalisme

### Mode Sombre

- Interface adaptative avec support du mode sombre
- Variables CSS pour une cohérence visuelle
- Transitions fluides entre les thèmes

## 📊 Données Mockées

L'application utilise actuellement des données mockées pour éviter les erreurs de connexion API :

### Appels d'Offres

- 6 exemples d'appels d'offres dans différents secteurs
- Données réalistes avec budgets, échéances, exigences
- Statuts et métadonnées complètes

### Fournisseurs

- 6 entreprises fictives avec profils détaillés
- Certifications, expérience, évaluations
- Informations de contact complètes

## 🔐 Authentification

### Accès Admin

- **URL** : `/login`
- **Identifiants par défaut** :
  - Email : `admin@ci-tender.com`
  - Mot de passe : `admin123`

### Sécurité

- Guards de routage pour protéger les routes admin
- Intercepteurs HTTP pour la gestion des tokens
- Validation des rôles utilisateur

## 🛠️ Développement

### Scripts Disponibles

```bash
# Démarrage en développement
npm start

# Build de production
npm run build

# Tests unitaires
npm test

# Tests e2e
npm run e2e

# Linting
npm run lint
```

### Variables d'Environnement

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints :

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🧪 Tests

### Tests Unitaires

- Tests des composants avec Jasmine/Karma
- Tests des services avec mocks
- Couverture de code configurée

### Tests E2E

- Tests d'intégration avec Playwright
- Scénarios utilisateur complets
- Tests de navigation et formulaires

## 🚀 Déploiement

### Build de Production

```bash
npm run build
```

### Docker

```bash
# Build de l'image
docker build -t ci-tender .

# Lancement du conteneur
docker run -p 80:80 ci-tender
```

## 📈 Optimisations

### Performance

- Lazy loading des modules
- Optimisation des images
- Compression des assets
- Cache des données

### SEO

- Meta tags dynamiques
- Structure sémantique
- URLs optimisées
- Sitemap généré

## 🤝 Contribution

### Guidelines

1. Fork du repository
2. Création d'une branche feature
3. Développement avec tests
4. Pull request avec description

### Standards de Code

- ESLint configuré
- Prettier pour le formatage
- Husky pour les hooks Git
- Conventional Commits

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :

- **Email** : support@ci-tender.com
- **Documentation** : `/docs`
- **Issues** : GitHub Issues

---

**CI-Tender** - Simplifiant les appels d'offres en Côte d'Ivoire 🇨🇮

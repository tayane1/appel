# CI-Tender - Plateforme d'appels d'offres de Côte d'Ivoire

CI-Tender est une plateforme moderne et complète pour la gestion et la consultation des appels d'offres en Côte d'Ivoire. Développée avec Angular 17 et les dernières technologies web, elle offre une expérience utilisateur optimale pour les acheteurs publics, les fournisseurs et les administrateurs.

## 🚀 Fonctionnalités principales

### 👥 Utilisateurs
- **Inscription et connexion sécurisées**
- **Profil utilisateur personnalisé**
- **Alertes personnalisées par email**
- **Sauvegarde des appels d'offres favoris**

### 📋 Appels d'offres
- **Consultation complète des appels d'offres**
- **Recherche avancée avec filtres multiples**
- **Téléchargement des documents**
- **Notifications en temps réel**
- **Statistiques et analyses**

### 🏢 Fournisseurs
- **Annuaire complet des fournisseurs**
- **Profils détaillés avec certifications**
- **Système de notation et avis**
- **Contact direct**

### 🔧 Administration
- **Tableau de bord complet**
- **Gestion des appels d'offres**
- **Modération des fournisseurs**
- **Gestion des utilisateurs**
- **Gestion des publicités**

## 🛠️ Technologies utilisées

### Frontend
- **Angular 17** - Framework principal
- **TypeScript** - Langage de programmation
- **SCSS** - Préprocesseur CSS
- **RxJS** - Programmation réactive
- **Angular Signals** - Gestion d'état moderne

### Outils de développement
- **Angular CLI** - Outils de développement
- **Karma & Jasmine** - Tests unitaires
- **Protractor** - Tests E2E
- **ESLint** - Linting
- **Prettier** - Formatage de code

### Performance et optimisation
- **Lazy Loading** - Chargement à la demande
- **Service Workers** - Cache et offline
- **Web Vitals** - Métriques de performance
- **Image optimization** - Optimisation des images

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/                    # Services et modèles principaux
│   │   ├── guards/             # Guards d'authentification
│   │   ├── interceptors/       # Intercepteurs HTTP
│   │   ├── models/             # Modèles TypeScript
│   │   └── services/           # Services partagés
│   ├── features/               # Modules fonctionnels
│   │   ├── auth/              # Authentification
│   │   ├── home/              # Page d'accueil
│   │   ├── suppliers/         # Gestion des fournisseurs
│   │   ├── tenders/           # Gestion des appels d'offres
│   │   └── admin/             # Administration
│   └── shared/                # Composants partagés
│       └── components/        # Composants réutilisables
├── assets/                    # Ressources statiques
├── environments/              # Configuration par environnement
└── styles/                    # Styles globaux
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Git

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/ci-tender.git
cd ci-tender
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des environnements**
```bash
# Copier le fichier d'environnement
cp src/environments/environment.example.ts src/environments/environment.ts

# Éditer les variables d'environnement
nano src/environments/environment.ts
```

4. **Démarrer le serveur de développement**
```bash
ng serve
```

L'application sera accessible à l'adresse `http://localhost:4200`

### Scripts disponibles

```bash
# Développement
npm start              # Démarrer le serveur de développement
npm run build          # Construire pour la production
npm run build:prod     # Construire avec optimisations

# Tests
npm test               # Lancer les tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec couverture
npm run e2e            # Lancer les tests E2E

# Linting et formatage
npm run lint           # Vérifier le code avec ESLint
npm run lint:fix       # Corriger automatiquement les erreurs
npm run format         # Formater le code avec Prettier

# Analyse
npm run analyze        # Analyser le bundle
npm run lighthouse     # Audit de performance
```

## 🧪 Tests

### Tests unitaires
```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests d'un fichier spécifique
npm test -- --include="**/login.component.spec.ts"
```

### Tests E2E
```bash
# Démarrer l'application
npm start

# Dans un autre terminal, lancer les tests E2E
npm run e2e
```

### Tests E2E disponibles
- **Authentication** (`auth.e2e-spec.ts`) - Tests d'inscription et connexion
- **Tender Management** (`tender.e2e-spec.ts`) - Tests des fonctionnalités d'appels d'offres
- **Admin Panel** (`admin.e2e-spec.ts`) - Tests du panneau d'administration
- **Supplier Features** (`supplier.e2e-spec.ts`) - Tests des fonctionnalités fournisseurs

### Structure des tests
```
src/
├── app/
│   └── features/
│       └── auth/
│           └── login/
│               ├── login.component.ts
│               └── login.component.spec.ts
e2e/
├── src/
│   ├── specs/
│   │   ├── auth.e2e-spec.ts
│   │   ├── tender.e2e-spec.ts
│   │   ├── admin.e2e-spec.ts
│   │   └── supplier.e2e-spec.ts
│   └── page-objects/
│       ├── login.po.ts
│       └── register.po.ts
```

## 📊 Performance et optimisation

### Métriques surveillées
- **First Contentful Paint (FCP)** < 2s
- **Largest Contentful Paint (LCP)** < 2.5s
- **Cumulative Layout Shift (CLS)** < 0.1
- **First Input Delay (FID)** < 100ms
- **Time to Interactive (TTI)** < 3.8s

### Optimisations implémentées
- **Lazy Loading** des modules
- **Code Splitting** automatique
- **Tree Shaking** pour réduire la taille
- **Service Workers** pour le cache
- **Image optimization** avec lazy loading
- **Preloading** des ressources critiques

### Monitoring des performances
```typescript
import { PerformanceService } from './core/optimization/performance.service';
import { MonitoringService } from './core/services/monitoring.service';

// Démarrer le monitoring
this.performanceService.startMonitoring();
this.monitoringService.startMonitoring();

// Obtenir les métriques de performance
this.performanceService.getPerformanceMetrics().subscribe(metrics => {
  console.log('Performance metrics:', metrics);
});

// Obtenir les données d'analytics
this.monitoringService.getAnalyticsData().subscribe(analytics => {
  console.log('Analytics data:', analytics);
});

// Obtenir les logs d'erreurs
this.monitoringService.getErrorLogs().subscribe(errors => {
  console.log('Error logs:', errors);
});
```

## 🔒 Sécurité

### Authentification
- **JWT Tokens** pour l'authentification
- **Refresh Tokens** pour la persistance
- **Guards Angular** pour la protection des routes
- **Intercepteurs HTTP** pour l'injection automatique des tokens

### Validation
- **Validation côté client** avec Reactive Forms
- **Validation côté serveur** pour la sécurité
- **Sanitisation** des données utilisateur
- **Protection CSRF** intégrée

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Mobile** (320px - 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (1024px+)

### Breakpoints utilisés
```scss
// Mobile
@media (max-width: 768px) { ... }

// Tablet
@media (min-width: 769px) and (max-width: 1024px) { ... }

// Desktop
@media (min-width: 1025px) { ... }
```

## 🌐 Internationalisation

L'application supporte le français et l'anglais avec :
- **Angular i18n** pour la traduction
- **Fichiers de traduction** organisés par module
- **Détection automatique** de la langue du navigateur
- **Sélecteur de langue** dans l'interface

## 🚀 Déploiement

### Production
```bash
# Construire l'application
npm run build:prod

# Les fichiers de production sont dans dist/
```

### Docker
```bash
# Construire l'image
docker build -t ci-tender .

# Lancer le conteneur
docker run -p 80:80 ci-tender

# Ou utiliser docker-compose
docker-compose up -d
```

### CI/CD avec GitHub Actions
Le projet inclut un pipeline CI/CD complet avec :

#### Workflows disponibles
- **Tests automatiques** à chaque commit et pull request
- **Tests E2E** avec Selenium et Chrome
- **Audit de sécurité** avec npm audit et Snyk
- **Analyse de performance** avec Lighthouse CI
- **Déploiement automatique** sur staging (develop) et production (main)

#### Étapes du pipeline
1. **Installation des dépendances**
2. **Linting et formatage du code**
3. **Tests unitaires avec couverture**
4. **Tests E2E automatisés**
5. **Audit de sécurité des dépendances**
6. **Analyse de performance**
7. **Build de l'application**
8. **Déploiement automatique**

#### Configuration requise
```bash
# Secrets GitHub nécessaires
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
SNYK_TOKEN=your_snyk_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token
SLACK_WEBHOOK_URL=your_slack_webhook
PRODUCTION_URL=https://your-app.com
MONITORING_WEBHOOK=your_monitoring_webhook
```

### Monitoring et Observabilité

#### Métriques de performance en temps réel
- **Web Vitals** (FCP, LCP, CLS, FID, TTI)
- **Temps de chargement des pages**
- **Temps de réponse des API**
- **Utilisation des ressources**

#### Analytics utilisateur
- **Sessions utilisateur** avec durée et pages visitées
- **Actions utilisateur** (clics, soumissions, recherches)
- **Taux de rebond** et engagement
- **Pages les plus populaires**

#### Gestion des erreurs
- **Capture automatique** des erreurs JavaScript
- **Logs d'erreurs** avec contexte utilisateur
- **Notifications** en temps réel
- **Intégration** avec services externes (Sentry, LogRocket)

#### Health Checks
- **Vérification** de la disponibilité de l'application
- **Monitoring** des ressources système
- **Alertes** automatiques en cas de problème
- **Rapports** de santé détaillés

### Infrastructure as Code

#### Docker Compose
```bash
# Développement local
docker-compose up

# Production avec monitoring
docker-compose --profile monitoring up -d

# Services disponibles
- Frontend (Angular + Nginx)
- Backend (Node.js API)
- Database (PostgreSQL)
- Cache (Redis)
- Monitoring (Prometheus + Grafana)
- Logging (Elasticsearch + Kibana)
```

#### Configuration Nginx
- **Compression Gzip** pour optimiser les performances
- **Cache statique** pour les ressources
- **Rate limiting** pour la sécurité
- **Headers de sécurité** (CSP, XSS Protection)
- **Load balancing** pour la haute disponibilité

### Métriques et KPIs

#### Performance
- **First Contentful Paint** < 2s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms
- **Time to Interactive** < 3.8s

#### Qualité
- **Couverture de tests** > 80%
- **Score Lighthouse** > 90
- **Vulnérabilités de sécurité** = 0
- **Temps de build** < 5 minutes

#### Utilisation
- **Temps de session moyen** > 5 minutes
- **Taux de rebond** < 40%
- **Pages par session** > 3
- **Taux de conversion** > 2%

## 📚 Documentation API

### Endpoints principaux
```
POST   /api/auth/login          # Connexion
POST   /api/auth/register       # Inscription
GET    /api/tenders             # Liste des appels d'offres
GET    /api/tenders/:id         # Détail d'un appel d'offres
GET    /api/suppliers           # Liste des fournisseurs
GET    /api/suppliers/:id       # Détail d'un fournisseur
```

### Authentification
```typescript
// Headers requis pour les requêtes authentifiées
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

## 🤝 Contribution

### Guide de contribution
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Conventional Commits** pour les messages de commit
- **Tests unitaires** obligatoires pour les nouvelles fonctionnalités

### Structure des commits
```
feat: ajouter la fonctionnalité de recherche avancée
fix: corriger le bug de pagination
docs: mettre à jour la documentation API
style: formater le code selon les standards
refactor: refactoriser le service d'authentification
test: ajouter des tests pour le composant login
chore: mettre à jour les dépendances
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/ci-tender/issues)
- **Email** : support@ci-tender.com
- **Documentation** : [docs.ci-tender.com](https://docs.ci-tender.com)

## 🙏 Remerciements

- **Angular Team** pour le framework exceptionnel
- **Communauté Angular** pour les ressources et le support
- **Contributors** pour leurs contributions au projet

---

**CI-Tender** - Simplifions les appels d'offres en Côte d'Ivoire 🇨🇮

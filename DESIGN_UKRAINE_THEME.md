# Thème Ukrainien - Inspiration ProZorro

## Vue d'ensemble

Ce document décrit les modifications apportées au design de l'application CI-Tender pour s'inspirer du style de [ProZorro](https://prozorro.gov.ua/en), la plateforme ukrainienne de passation de marchés publics, tout en conservant l'identité ivoirienne.

## Changements de couleurs

### Couleurs principales

- **Bleu ukrainien** (`#0057b8`) : Couleur principale, remplace l'orange ivoirien
- **Jaune ukrainien** (`#ffdd00`) : Couleur secondaire, remplace le vert ivoirien
- **Bleu clair** (`#0077cc`) : Variante plus claire du bleu principal
- **Bleu foncé** (`#003d82`) : Variante plus foncée du bleu principal
- **Jaune clair** (`#ffed4e`) : Variante plus claire du jaune principal
- **Jaune foncé** (`#e6c700`) : Variante plus foncée du jaune principal

### Couleurs ivoiriennes conservées

- **Orange ivoirien** (`#ff7900`) : Utilisé pour les badges et accents
- **Vert ivoirien** (`#00a651`) : Utilisé pour les badges et accents
- **Blanc** (`#ffffff`) : Couleur neutre

### Utilisation des couleurs

- **Bleu** : Boutons principaux, liens, accents, headers
- **Jaune** : Boutons secondaires, highlights, badges, statistiques
- **Orange/Vert** : Badges de statut, drapeau ivoirien
- **Dégradés** : Combinaison bleu-jaune pour les éléments visuels importants

## Éléments de design ajoutés

### 1. Drapeau ivoirien

- Remplacement du drapeau ukrainien par le drapeau ivoirien (orange, blanc, vert)
- Utilisé comme logo dans le header, footer, et pages d'authentification
- Respect de l'identité nationale ivoirienne

### 2. Accents ivoiriens

- Bordure supérieure avec dégradé orange-blanc-vert sur les sections principales
- Animation de vague sur les statistiques
- Design moderne inspiré de ProZorro

### 3. Cartes ProZorro

- Design de cartes avec header coloré
- Effets de survol avec élévation
- Badges ukrainiens et ivoiriens pour les statuts
- Disposition en grille responsive comme sur ProZorro

### 4. Navigation

- Style ProZorro avec bordure bleue
- Indicateurs actifs en jaune
- Dropdowns améliorés avec icônes

### 5. Footer ukrainien

- Dégradé sombre avec accents jaunes
- Grille responsive pour les sections
- Statistiques animées

## Disposition ProZorro

### Grille responsive

- Utilisation de `.prozorro-grid` pour une disposition optimale
- Adaptation automatique selon la taille d'écran
- Espacement cohérent entre les éléments

### Sections centrées

- Headers de section centrés avec titres et sous-titres
- Boutons d'action intégrés dans les headers
- Espacement généreux pour une meilleure lisibilité

## Corrections de lisibilité

### Mode clair amélioré

- **Texte principal** : `#1a1a1a` (plus foncé pour meilleur contraste)
- **Texte secondaire** : `#4a4a4a` (plus foncé pour meilleur contraste)
- **Texte atténué** : `#6b7280` (plus foncé pour meilleur contraste)

### Icônes visibles

- Remplacement des icônes Lucide par des emojis simples
- Meilleure visibilité sur tous les écrans
- Pas de dépendances externes pour les icônes

### Formulaires corrigés

- Classes `.form-container`, `.form-title`, `.form-subtitle` pour la visibilité
- Classes `.form-input`, `.form-label`, `.form-text` pour les champs
- Classes `.form-link` pour les liens dans les formulaires
- Classes `.content-card` pour les cartes de contenu

## Fichiers modifiés

### Variables de couleurs

- `src/assets/styles/variables.scss` : Nouvelles couleurs ukrainiennes et corrections de lisibilité

### Styles globaux

- `src/styles.scss` : Import du thème ukrainien et mise à jour des boutons

### Thème ukrainien

- `src/assets/styles/ukraine-theme.scss` : Nouveau fichier avec les styles ukrainiens et ivoiriens

### Composants

- `src/app/shared/components/header/header.component.ts` : Template mis à jour avec drapeau ivoirien
- `src/app/shared/components/footer/footer.component.ts` : Template mis à jour avec drapeau ivoirien
- `src/app/features/home/home.component.ts` : Template mis à jour avec disposition ProZorro
- `src/app/features/home/home.component.scss` : Styles mis à jour pour la lisibilité
- `src/app/features/auth/login/login.component.ts` : Template mis à jour avec drapeau ivoirien et corrections de visibilité
- `src/app/features/auth/register/register.component.ts` : Template mis à jour avec drapeau ivoirien et corrections de visibilité

## Classes CSS ajoutées

### Accents

- `.ivory-coast-accent` : Bordure supérieure avec dégradé ivoirien (remplace ukraine-accent)
- `.ukraine-wave` : Animation de vague

### Drapeau ivoirien

- `.ivory-coast-flag` : Conteneur du drapeau ivoirien
- `.flag-stripe.orange` : Bande orange du drapeau
- `.flag-stripe.white` : Bande blanche du drapeau
- `.flag-stripe.green` : Bande verte du drapeau

### Cartes

- `.card-prozorro` : Style de carte inspiré de ProZorro
- `.btn-ukraine` : Boutons avec style ukrainien
- `.btn-yellow` : Variante jaune des boutons

### Badges

- `.badge-ukraine` : Badges avec style ukrainien
- `.badge-blue` : Badge bleu
- `.badge-yellow` : Badge jaune
- `.badge-orange` : Badge orange ivoirien
- `.badge-green` : Badge vert ivoirien

### Navigation

- `.nav-prozorro` : Navigation avec style ProZorro

### Footer

- `.footer-ukraine` : Footer avec style ukrainien

### Disposition

- `.prozorro-grid` : Grille responsive comme ProZorro
- `.prozorro-section` : Section avec style ProZorro

### Icônes

- `.icon` : Classe pour les icônes emoji
- `.icon-sm` : Icône petite taille
- `.icon-lg` : Icône grande taille

### Formulaires et contenu

- `.form-container` : Conteneur de formulaire avec visibilité corrigée
- `.form-title` : Titre de formulaire visible
- `.form-subtitle` : Sous-titre de formulaire visible
- `.form-label` : Label de champ visible
- `.form-input` : Champ de saisie avec visibilité corrigée
- `.form-text` : Texte de formulaire visible
- `.form-link` : Lien de formulaire visible
- `.content-card` : Carte de contenu avec visibilité corrigée

## Responsive Design

Tous les éléments sont responsifs et s'adaptent aux écrans mobiles :

- Grilles qui passent en colonne unique
- Navigation mobile avec menu hamburger
- Statistiques empilées verticalement
- Cartes redimensionnées
- Drapeau ivoirien adaptatif
- Formulaires optimisés pour mobile

## Animations

- **ukraineWave** : Animation de vague horizontale pour les statistiques
- **fadeIn** : Animation d'apparition en fondu
- **slideDown** : Animation de glissement vers le bas
- **Hover effects** : Élévation et transformation au survol

## Accessibilité

- Contraste suffisant entre les couleurs (corrigé)
- Indicateurs visuels clairs pour les états actifs
- Navigation au clavier supportée
- Icônes emoji pour une meilleure visibilité
- Textes alternatifs pour les icônes
- Formulaires accessibles avec labels visibles

## Compatibilité

- Support du mode sombre maintenu
- Compatible avec tous les navigateurs modernes
- Performance optimisée avec CSS variables
- Pas de dépendances externes pour les icônes
- Emojis natifs pour une compatibilité maximale

## Prochaines étapes

1. Appliquer le thème aux autres pages (tenders, suppliers, admin)
2. Optimiser les animations pour les appareils moins puissants
3. Ajouter des tests visuels pour s'assurer de la cohérence
4. Améliorer l'accessibilité avec des contrastes encore meilleurs

## Inspiration

Le design s'inspire directement de [ProZorro](https://prozorro.gov.ua/en), une plateforme ukrainienne de passation de marchés publics reconnue pour :

- Son design moderne et professionnel
- L'utilisation des couleurs du drapeau ukrainien
- Sa clarté et sa facilité d'utilisation
- Son approche transparente et accessible
- Sa disposition en grille responsive

Tout en conservant l'identité ivoirienne avec le drapeau national et les couleurs traditionnelles.

## Corrections apportées

### Problèmes résolus

- ✅ Remplacement complet du drapeau ukrainien par le drapeau ivoirien
- ✅ Correction de la visibilité des textes en mode clair
- ✅ Correction de la visibilité des icônes
- ✅ Amélioration du contraste pour tous les éléments
- ✅ Correction des formulaires de connexion et d'inscription
- ✅ Correction des cartes et éléments de contenu
- ✅ Remplacement des accents ukrainiens par des accents ivoiriens

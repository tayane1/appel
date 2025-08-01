# Guide de Test - Plateforme CI-Tender

## 🚀 Démarrage de l'application

1. **Démarrer le serveur :**
   ```bash
   ng serve --port 4201
   ```

2. **Accéder à l'application :**
   ```
   http://localhost:4201
   ```

## 🔐 Connexion

### Identifiants Admin :
- **Email :** `admin@ci-tender.com`
- **Mot de passe :** `admin123`

### Identifiants Utilisateur :
- **Email :** `user@ci-tender.com`
- **Mot de passe :** `user123`

## 🧪 Tests à effectuer

### 1. Test de l'avatar et du menu utilisateur
1. Se connecter avec les identifiants admin
2. Vérifier que l'avatar est visible (cercle bleu avec initiales "AC")
3. Cliquer sur l'avatar
4. Vérifier que le menu dropdown s'ouvre
5. Vérifier que le menu contient les options d'administration

### 2. Test des boutons de création
1. Aller dans **Administration > Appels d'offres**
2. Cliquer sur "Créer un appel d'offres"
3. Vérifier que le formulaire de création s'ouvre
4. Aller dans **Administration > Publicités**
5. Cliquer sur "Créer une publicité"
6. Vérifier que le formulaire de création s'ouvre

### 3. Test des formulaires
1. Remplir les formulaires de création
2. Vérifier la validation des champs
3. Soumettre les formulaires
4. Vérifier la redirection vers la liste

## 🔍 Débogage

### Console du navigateur
Ouvrir les outils de développement (F12) et vérifier :
- Les logs de connexion
- Les logs de navigation
- Les erreurs JavaScript

### Logs attendus
```
Header - Utilisateur actuel: {id: "1", email: "admin@ci-tender.com", ...}
Header - Est authentifié: true
Header - Est admin: true
Toggle user menu appelé
Bouton "Créer une publicité" cliqué
```

## ❌ Problèmes connus et solutions

### Avatar invisible
- **Cause :** Problème de CSS ou d'image
- **Solution :** L'avatar affiche maintenant les initiales en fallback

### Boutons qui ne marchent pas
- **Cause :** Utilisateur non connecté ou non admin
- **Solution :** Se connecter avec les identifiants admin

### Menu dropdown qui ne s'ouvre pas
- **Cause :** Problème de gestion d'état
- **Solution :** Vérifier les logs dans la console

## 📞 Support

Si les problèmes persistent, vérifier :
1. La console du navigateur pour les erreurs
2. Les logs de débogage ajoutés
3. L'état de l'authentification
4. Les droits d'administration 
# 🚀 Guide de Déploiement Rapide - GitHub

## 📋 Étapes pour déployer sur GitHub

### 1. **Créer un repository GitHub**
```bash
# Si vous n'avez pas de repo GitHub
# Allez sur https://github.com/new
# Nom: budget-app
# Description: Application de gestion de budget sécurisée
# Public ou Private (selon vos préférences)
```

### 2. **Initialiser Git et pousser le code**
```bash
# Dans votre dossier de projet
git init
git add .
git commit -m "Initial commit: Budget App avec sécurité"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/budget-app.git
git push -u origin main
```

### 3. **Activer GitHub Actions**
- Allez dans votre repo GitHub
- Onglet "Actions"
- Le workflow se lance automatiquement

### 4. **Télécharger l'APK**
- Dans l'onglet "Actions"
- Cliquez sur le workflow "Build Android APK"
- Téléchargez l'artifact "app-release-apk"

## 🔄 Mises à jour automatiques

### Pour chaque modification :
```bash
git add .
git commit -m "Description de la modification"
git push origin main
```

### L'APK sera automatiquement :
- ✅ Compilé
- ✅ Testé
- ✅ Disponible en téléchargement

## 📱 Partage avec votre ami

1. **Téléchargez** l'APK depuis GitHub Actions
2. **Envoyez** le fichier `app-release.apk` à votre ami
3. **Suivez** les instructions dans `INSTALLATION-RAPIDE.md`

## 🛠️ Configuration avancée

### Variables d'environnement (optionnel)
Dans Settings > Secrets and variables > Actions :
- `ANDROID_KEYSTORE_PASSWORD` : Mot de passe du keystore
- `ANDROID_KEY_PASSWORD` : Mot de passe de la clé

### Branches protégées
Dans Settings > Branches :
- Protéger `main`
- Requérir les tests avant merge

## 📊 Monitoring

- **Actions** : Statut des builds
- **Releases** : Versions publiées
- **Issues** : Bugs et améliorations

## 🆘 En cas de problème

### Build échoue ?
1. Vérifiez les logs dans Actions
2. Testez localement : `npm run build:web`
3. Vérifiez les dépendances : `npm ci`

### APK ne s'installe pas ?
1. Vérifiez la compatibilité Android (10+)
2. Activez "Sources inconnues"
3. Vérifiez l'espace disque

---

**✅ Votre app est maintenant prête pour le déploiement automatique !**

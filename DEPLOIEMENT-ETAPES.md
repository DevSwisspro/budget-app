# Instructions de déploiement

## 1. Créer le repository GitHub
- Allez sur https://github.com/new
- Nom du repository: budget-app
- Description: Application de gestion de budget Android sécurisée
- Visibilité: Public ou Privé (selon votre choix)
- NE PAS cocher "Add a README file"
- NE PAS cocher "Add .gitignore"
- NE PAS cocher "Choose a license"

## 2. Pousser le code
```bash
git remote set-url origin https://github.com/devswiss/budget-app.git
git push -u origin main
```

## 3. Vérifier GitHub Actions
- Allez dans l'onglet "Actions" de votre repository
- Le workflow "Initial Setup" devrait se déclencher automatiquement
- Attendez la fin du build (environ 5-10 minutes)

## 4. Télécharger l'APK
- Dans l'onglet "Actions", cliquez sur le workflow terminé
- Téléchargez l'artifact "budget-app-release"
- L'APK sera dans le fichier zip téléchargé

## 5. Installer sur le téléphone
- Transférez l'APK sur le téléphone Android
- Activez "Sources inconnues" dans les paramètres
- Installez l'application
- Configurez votre PIN et biométrie

## Fonctionnalités incluses
✅ Application Android native
✅ Authentification par PIN et biométrie
✅ Chiffrement local des données
✅ Export/Import sécurisé
✅ Aucune télémetrie
✅ Protection contre les captures d'écran
✅ Mode hors-ligne complet

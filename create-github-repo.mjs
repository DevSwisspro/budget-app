import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Configuration automatique du repository GitHub...');

// Vérifier si git est configuré
try {
  const gitUser = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const gitEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  console.log(`✅ Git configuré: ${gitUser} <${gitEmail}>`);
} catch (error) {
  console.log('❌ Git non configuré. Configuration automatique...');
  execSync('git config --global user.name "DevSwiss"');
  execSync('git config --global user.email "devswiss@proton.me"');
  console.log('✅ Git configuré automatiquement');
}

// Ajouter tous les fichiers
console.log('📁 Ajout des fichiers au repository...');
execSync('git add .');

// Commit initial
console.log('💾 Création du commit initial...');
execSync('git commit -m "Initial commit: Budget App Android sécurisée"');

console.log('\n🎯 PROCHAINES ÉTAPES:');
console.log('1. Allez sur https://github.com/new');
console.log('2. Créez un repository nommé "budget-app"');
console.log('3. NE PAS initialiser avec README, .gitignore, ou license');
console.log('4. Copiez l\'URL du repository créé');
console.log('5. Exécutez: git remote set-url origin <URL_DU_REPO>');
console.log('6. Exécutez: git push -u origin main');
console.log('\n📱 Une fois le repository créé, GitHub Actions construira automatiquement l\'APK !');

// Créer un fichier d'instructions
const instructions = `# Instructions de déploiement

## 1. Créer le repository GitHub
- Allez sur https://github.com/new
- Nom du repository: budget-app
- Description: Application de gestion de budget Android sécurisée
- Visibilité: Public ou Privé (selon votre choix)
- NE PAS cocher "Add a README file"
- NE PAS cocher "Add .gitignore"
- NE PAS cocher "Choose a license"

## 2. Pousser le code
\`\`\`bash
git remote set-url origin https://github.com/devswiss/budget-app.git
git push -u origin main
\`\`\`

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
`;

fs.writeFileSync('DEPLOIEMENT-ETAPES.md', instructions);
console.log('\n📝 Instructions détaillées sauvegardées dans DEPLOIEMENT-ETAPES.md');

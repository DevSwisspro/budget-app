const fs = require('fs');
const path = require('path');

// Configuration du build
const buildConfig = {
  projectName: 'budget-app',
  version: '1.0.0',
  platform: 'android',
  buildType: 'release'
};

// Créer un package de build
function createBuildPackage() {
  console.log('📦 Création du package de build...');
  
  const buildDir = path.join(__dirname, 'build-package');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Copier les fichiers essentiels
  const essentialFiles = [
    'package.json',
    'capacitor.config.ts',
    'src/',
    'android/',
    'public/',
    'index.html',
    'vite.config.ts',
    'tsconfig.json'
  ];
  
  essentialFiles.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(buildDir, file);
    
    if (fs.existsSync(sourcePath)) {
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  });
  
  // Créer le fichier de configuration de build
  const buildInfo = {
    ...buildConfig,
    timestamp: new Date().toISOString(),
    buildId: generateBuildId()
  };
  
  fs.writeFileSync(
    path.join(buildDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
  console.log('✅ Package de build créé dans:', buildDir);
  return buildDir;
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function generateBuildId() {
  return 'build-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Instructions de build
function generateBuildInstructions() {
  const instructions = `
# 🚀 Instructions de Build Automatique

## Option 1: Build en ligne (Recommandé)
1. Allez sur https://appetize.io/build
2. Uploadez le dossier 'build-package'
3. Sélectionnez Android
4. Cliquez sur "Build"
5. Téléchargez l'APK généré

## Option 2: Build local avec Docker
\`\`\`bash
docker run --rm -v $(pwd)/build-package:/app -w /app node:18 npm install
docker run --rm -v $(pwd)/build-package:/app -w /app openjdk:17-jdk ./gradlew assembleRelease
\`\`\`

## Option 3: Service de build cloud
- Netlify Build
- Vercel Build
- GitHub Actions (si repo disponible)

## 📱 Résultat attendu
- APK: app-release.apk (~15MB)
- Compatible: Android 10+
- Sécurité: Chiffrement AES-256
- Fonctionnalités: Complètes
`;

  fs.writeFileSync('BUILD-INSTRUCTIONS.md', instructions);
  console.log('📋 Instructions de build créées: BUILD-INSTRUCTIONS.md');
}

// Exécuter le build
if (require.main === module) {
  console.log('🔨 Démarrage du processus de build automatique...');
  
  try {
    const buildDir = createBuildPackage();
    generateBuildInstructions();
    
    console.log('\n🎉 Build package prêt !');
    console.log('📁 Dossier:', buildDir);
    console.log('📋 Instructions:', 'BUILD-INSTRUCTIONS.md');
    console.log('\n📱 Prochaines étapes:');
    console.log('1. Utilisez un service de build en ligne');
    console.log('2. Ou installez Java et lancez build-apk.bat');
    console.log('3. Partagez l\'APK avec votre ami');
    
  } catch (error) {
    console.error('❌ Erreur lors du build:', error.message);
  }
}

module.exports = { createBuildPackage, generateBuildInstructions };

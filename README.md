# 📱 Budget App - Application de Gestion de Budget Sécurisée

Application mobile Android pour la gestion de budget avec chiffrement local et authentification sécurisée.

## 🔒 Fonctionnalités de Sécurité

- **🔐 Authentification PIN** : Protection par code personnel
- **🛡️ Chiffrement AES-256** : Toutes les données sont chiffrées
- **📱 Biométrie** : Déverrouillage par empreinte/visage
- **🚫 Hors ligne** : Aucune connexion internet requise
- **💾 Stockage local** : Données uniquement sur l'appareil

## 📋 Fonctionnalités

- 💰 **Gestion des transactions** (dépenses et revenus)
- 📊 **Graphiques et analyses** détaillées
- 📅 **Budgets mensuels** par catégorie
- 🔄 **Export/Import sécurisés** (.budget.enc)
- 📈 **Suivi des tendances** et statistiques
- ⚙️ **Règles automatiques** pour les transactions
- 🔁 **Transactions récurrentes**

## 🚀 Build Automatique

### GitHub Actions

L'APK est automatiquement généré à chaque push sur `main` :

1. **Forkez** ce repository
2. **Poussez** votre code sur `main`
3. **Téléchargez** l'APK depuis les Actions

### Build Local

```bash
# Prérequis : Java 17 + Android SDK
npm install
npm run build:web
npx cap sync android
cd android && ./gradlew assembleRelease
```

## 📱 Installation

1. **Téléchargez** l'APK depuis les [Releases](../../releases)
2. **Activez** "Sources inconnues" dans Android
3. **Installez** l'application
4. **Définissez** votre PIN au premier lancement

## 🛠️ Développement

```bash
# Installation
npm install

# Développement
npm run dev

# Build web
npm run build:web

# Sync Android
npx cap sync android
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
├── services/           # Services (SecurityService)
├── hooks/              # Hooks personnalisés
├── types.ts           # Types TypeScript
├── storage.ts         # Gestion du stockage
└── utils.ts           # Utilitaires
```

## 🔧 Technologies

- **Frontend** : React + TypeScript + Vite
- **Mobile** : Capacitor
- **Chiffrement** : CryptoJS (AES-256)
- **Stockage** : Capacitor Preferences + Filesystem
- **Build** : GitHub Actions + Gradle

## 📄 Licence

Projet privé - Usage personnel uniquement

---

**Version** : 1.0.0  
**Compatibilité** : Android 10+  
**Taille** : ~15MB

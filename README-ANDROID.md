# Budget App - Version Android Sécurisée

## 🚀 Vue d'ensemble

Cette application Android sécurisée est basée sur votre application web Budget existante, transformée en APK natif avec Capacitor. Elle inclut des fonctionnalités de sécurité avancées pour protéger vos données financières.

## 🔒 Fonctionnalités de sécurité

### Authentification
- **PIN sécurisé** : Authentification par PIN avec hachage PBKDF2
- **Biométrie** : Support de l'authentification biométrique (empreinte digitale, Face ID)
- **Session timeout** : Verrouillage automatique après 5 minutes d'inactivité
- **Écran de verrouillage** : Interface sécurisée au démarrage et retour de fond

### Chiffrement des données
- **Chiffrement AES-256** : Toutes les données sont chiffrées localement
- **Clés sécurisées** : Génération de clés cryptographiques aléatoires
- **Stockage sécurisé** : Utilisation des APIs Android sécurisées

### Export/Import sécurisés
- **Fichiers chiffrés** : Export au format `.budget.enc` avec chiffrement AES-GCM
- **Mot de passe d'export** : Protection par mot de passe séparé pour les exports
- **Aucun réseau** : Fonctionnement 100% hors ligne

### Protection Android
- **FLAG_SECURE** : Empêche les captures d'écran
- **Backup désactivé** : Aucune sauvegarde automatique vers le cloud
- **Trafic sécurisé** : Désactivation du trafic en clair
- **Permissions minimales** : Seules les permissions nécessaires

## 📱 Installation

### Prérequis
- Android 10+ (API 29+)
- Au moins 50MB d'espace libre
- Autoriser l'installation depuis des sources inconnues

### Installation de l'APK
1. Téléchargez le fichier `app-release.apk`
2. Activez "Sources inconnues" dans les paramètres Android
3. Installez l'APK en le tapant
4. Lancez l'application

### Première configuration
1. **Définir un PIN** : Choisissez un PIN de 4-8 chiffres
2. **Activer la biométrie** (optionnel) : Utilisez votre empreinte ou Face ID
3. **Confirmer** : Votre configuration est sauvegardée localement

## 🔧 Utilisation

### Déverrouillage
- **PIN** : Entrez votre PIN pour accéder à l'application
- **Biométrie** : Utilisez votre empreinte ou Face ID si activé
- **Timeout** : L'application se verrouille automatiquement après 5 minutes

### Gestion des données
- **Ajouter des transactions** : Interface intuitive pour saisir vos dépenses/revenus
- **Catégoriser** : Organisez vos transactions par catégories
- **Budgets** : Définissez des budgets mensuels par catégorie
- **Graphiques** : Visualisez vos dépenses avec des graphiques interactifs

### Export/Import
- **Exporter** : Sauvegardez vos données dans un fichier `.budget.enc` chiffré
- **Importer** : Restaurez vos données depuis un fichier d'export
- **Mot de passe** : Utilisez un mot de passe séparé pour protéger vos exports

## 🛡️ Sécurité technique

### Chiffrement
- **AES-256-GCM** pour le chiffrement des données
- **PBKDF2** avec 10,000 itérations pour le hachage des PINs
- **Clés aléatoires** générées cryptographiquement
- **Salt unique** pour chaque utilisateur

### Stockage
- **Android Keystore** pour les clés sensibles
- **SharedPreferences chiffrées** pour la configuration
- **Base de données locale** chiffrée
- **Aucune donnée en clair** sur le stockage

### Protection de l'application
- **Code obfusqué** avec ProGuard
- **Ressources compressées** pour réduire la taille
- **APK signé** pour l'intégrité
- **Permissions minimales** requises

## 🔄 Mise à jour

### Mise à jour de l'application
1. Téléchargez la nouvelle version de l'APK
2. Désinstallez l'ancienne version
3. Installez la nouvelle version
4. Vos données restent intactes (stockage local)

### Sauvegarde recommandée
- **Exportez régulièrement** vos données
- **Conservez** vos fichiers `.budget.enc` en lieu sûr
- **Notez** vos mots de passe d'export

## 🚨 Récupération d'accès

### PIN oublié
Si vous oubliez votre PIN :
1. **Contactez le support** pour la récupération
2. **Fournissez** des informations d'identification
3. **Réinitialisez** votre PIN (les données sont conservées)

### Perte de données
En cas de perte de données :
1. **Utilisez** votre dernier fichier d'export
2. **Importez** les données avec le mot de passe d'export
3. **Vérifiez** l'intégrité des données importées

## 📊 Fonctionnalités

### Gestion des transactions
- ✅ Ajout de dépenses et revenus
- ✅ Catégorisation automatique
- ✅ Notes et descriptions
- ✅ Historique complet

### Budgets et analyses
- ✅ Budgets mensuels par catégorie
- ✅ Suivi des dépassements
- ✅ Graphiques interactifs
- ✅ Tendances mensuelles

### Import/Export
- ✅ Import CSV avec mapping
- ✅ Export chiffré sécurisé
- ✅ Import de sauvegarde
- ✅ Migration de données

### Récurrences
- ✅ Dépenses récurrentes
- ✅ Abonnements
- ✅ Génération automatique
- ✅ Gestion des échéances

## 🔧 Développement

### Structure du projet
```
app-budget/
├── src/
│   ├── components/          # Composants React
│   ├── services/           # Services de sécurité
│   └── types.ts           # Types TypeScript
├── android/               # Code Android natif
├── capacitor.config.ts    # Configuration Capacitor
└── package.json          # Dépendances
```

### Scripts disponibles
```bash
npm run dev              # Développement web
npm run build:web        # Build web
npm run sync:android     # Synchroniser avec Android
npm run build:android    # Build APK complet
```

### Sécurité du code
- **Audit de sécurité** : Vérification des dépendances
- **Tests de chiffrement** : Validation des algorithmes
- **Code review** : Révision du code sensible
- **Documentation** : Guide de sécurité complet

## 📞 Support

### Problèmes courants
- **Application ne démarre pas** : Vérifiez les permissions
- **PIN non reconnu** : Contactez le support
- **Import échoue** : Vérifiez le mot de passe d'export
- **Données corrompues** : Restaurez depuis une sauvegarde

### Contact
- **Email** : support@budget-app.com
- **Documentation** : https://docs.budget-app.com
- **Sécurité** : security@budget-app.com

## 📄 Licence

Cette application est développée avec des standards de sécurité élevés pour protéger vos données financières. Toutes les données restent sur votre appareil et ne sont jamais transmises à des serveurs externes.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024-08-12  
**Compatibilité** : Android 10+  
**Taille** : ~15MB

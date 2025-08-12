@echo off
echo ========================================
echo    BUILD BUDGET APP - ANDROID APK
echo ========================================
echo.

echo [1/5] Vérification de Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java n'est pas installé
    echo.
    echo 📥 Téléchargez et installez Java 17 depuis :
    echo https://adoptium.net/temurin/releases/?version=17
    echo.
    echo Après installation, relancez ce script.
    pause
    exit /b 1
)
echo ✅ Java détecté

echo.
echo [2/5] Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)
echo ✅ Dépendances installées

echo.
echo [3/5] Build des assets web...
call npm run build:web
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build web
    pause
    exit /b 1
)
echo ✅ Assets web construits

echo.
echo [4/5] Synchronisation Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la synchronisation
    pause
    exit /b 1
)
echo ✅ Android synchronisé

echo.
echo [5/5] Build de l'APK Android...
cd android
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build Android
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo           ✅ BUILD TERMINÉ !
echo ========================================
echo.
echo 📱 APK généré : android/app/build/outputs/apk/release/app-release.apk
echo.
echo 📋 Instructions pour votre ami :
echo 1. Copiez le fichier APK sur son téléphone
echo 2. Activez "Sources inconnues" dans les paramètres Android
echo 3. Installez l'APK en le tapant
echo 4. Lancez l'application et définissez un PIN
echo.
pause

@echo off
echo ====================================
echo    GENERATION APK CLIENT BUDGET
echo ====================================

echo [1/4] Build des assets web...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build web echoue
    pause
    exit /b 1
)

echo [2/4] Sync Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERREUR: Sync Capacitor echoue
    pause
    exit /b 1
)

echo [3/4] Generation APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ERREUR: Generation APK echouee
    echo SOLUTION: Installer Android Studio ou configurer Java/Android SDK
    pause
    exit /b 1
)

echo [4/4] Copie APK client...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    copy "app\build\outputs\apk\debug\app-debug.apk" "..\budget-app-v1.0.0.apk"
    echo.
    echo ====================================
    echo   APK CLIENT GENERE AVEC SUCCES !
    echo ====================================
    echo Fichier: budget-app-v1.0.0.apk
    echo Taille: ~15MB
    echo Compatible: Android 10+
    echo.
    echo Envoyez ce fichier a votre ami avec INSTALLATION-RAPIDE.md
    echo ====================================
) else (
    echo ERREUR: APK non genere
    echo Verifiez l'installation d'Android SDK
)

cd ..
pause

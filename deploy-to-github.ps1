# Script de déploiement automatique vers GitHub
Write-Host "Deploiement automatique de Budget App vers GitHub..." -ForegroundColor Green

# Vérifier si git est installé
try {
    git --version | Out-Null
    Write-Host "Git detecte" -ForegroundColor Green
} catch {
    Write-Host "Git non installe. Veuillez installer Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Configuration Git
Write-Host "Configuration Git..." -ForegroundColor Yellow
git config --global user.name "DevSwiss"
git config --global user.email "devswiss@proton.me"

# Ajouter tous les fichiers
Write-Host "Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Creation du commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Budget App Android securisee"

# Instructions pour l'utilisateur
Write-Host ""
Write-Host "ETAPES SUIVANTES:" -ForegroundColor Cyan
Write-Host "1. Ouvrez votre navigateur et allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Creez un nouveau repository avec ces parametres:" -ForegroundColor White
Write-Host "   - Nom: budget-app" -ForegroundColor White
Write-Host "   - Description: Application de gestion de budget Android securisee" -ForegroundColor White
Write-Host "   - Visibilite: Public ou Prive (selon votre choix)" -ForegroundColor White
Write-Host "   - NE PAS cocher 'Add a README file'" -ForegroundColor Red
Write-Host "   - NE PAS cocher 'Add .gitignore'" -ForegroundColor Red
Write-Host "   - NE PAS cocher 'Choose a license'" -ForegroundColor Red
Write-Host ""
Write-Host "3. Une fois le repository cree, copiez son URL" -ForegroundColor White
Write-Host "4. Executez la commande suivante (remplacez <URL> par l'URL de votre repo):" -ForegroundColor White
Write-Host "   git remote set-url origin <URL>" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "GitHub Actions construira automatiquement l'APK Android !" -ForegroundColor Green
Write-Host "Le build prendra environ 5-10 minutes." -ForegroundColor White
Write-Host ""
Write-Host "Instructions detaillees dans: DEPLOIEMENT-ETAPES.md" -ForegroundColor Cyan

# Créer un fichier de suivi
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logEntry = "[$timestamp] Deploiement prepare - Repository a creer sur GitHub"
Add-Content -Path "deployment.log" -Value $logEntry

Write-Host ""
Write-Host "Preparation terminee !" -ForegroundColor Green

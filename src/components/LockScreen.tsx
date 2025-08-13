import { useState, useEffect } from 'react'
import SecurityService from '../services/SecurityService'

interface LockScreenProps {
  onUnlock: () => void
  isFirstTime?: boolean
}

export default function LockScreen({ onUnlock, isFirstTime = false }: LockScreenProps) {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSettingPin] = useState(isFirstTime)
  const [error, setError] = useState('')
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [useBiometric, setUseBiometric] = useState(false)

  useEffect(() => {
    checkBiometric()
  }, [])

  async function checkBiometric() {
    try {
      const available = await SecurityService.isBiometricAvailable()
      setBiometricAvailable(available)
    } catch (error) {
      console.error('Erreur lors de la vérification biométrique:', error)
    }
  }

  async function handlePinSubmit() {
    setError('')
    
    try {
      if (isSettingPin) {
        if (pin.length < 4) {
          setError('Le PIN doit contenir au moins 4 chiffres')
          return
        }
        
        if (pin !== confirmPin) {
          setError('Les PINs ne correspondent pas')
          return
        }
        
        await SecurityService.setPin(pin)
        if (useBiometric && biometricAvailable) {
          // En production, activer la biométrie ici
          console.log('Biométrie activée')
        }
        onUnlock()
      } else {
        const isValid = await SecurityService.verifyPin(pin)
        if (isValid) {
          onUnlock()
        } else {
          setError('PIN incorrect')
          setPin('')
        }
      }
    } catch (error) {
      setError('Erreur lors de l\'authentification')
      console.error('Erreur d\'authentification:', error)
    }
  }

  async function handleBiometricAuth() {
    try {
      // En production, implémenter l'authentification biométrique réelle
      // Pour l'instant, simuler une authentification réussie
      console.log('Authentification biométrique simulée')
      onUnlock()
    } catch (error) {
      setError('Erreur d\'authentification biométrique')
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handlePinSubmit()
    }
  }

  return (
    <div className="lock-screen">
      <div className="lock-container">
        <div className="lock-header">
          <h1>Budget</h1>
          <p>{isSettingPin ? 'Définissez votre PIN' : 'Entrez votre PIN'}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!isSettingPin && biometricAvailable && (
          <button 
            className="biometric-btn"
            onClick={handleBiometricAuth}
          >
            🔐 Authentification biométrique
          </button>
        )}

        <div className="pin-input-container">
          {isSettingPin ? (
            <>
              <input
                type="password"
                placeholder="Nouveau PIN (min 4 chiffres)"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                maxLength={8}
                className="pin-input"
              />
              <input
                type="password"
                placeholder="Confirmez le PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                maxLength={8}
                className="pin-input"
              />
            </>
          ) : (
            <input
              type="password"
              placeholder="Entrez votre PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              maxLength={8}
              className="pin-input"
            />
          )}
        </div>

        {isSettingPin && biometricAvailable && (
          <div className="biometric-option">
            <label>
              <input
                type="checkbox"
                checked={useBiometric}
                onChange={(e) => setUseBiometric(e.target.checked)}
              />
              Activer l'authentification biométrique
            </label>
          </div>
        )}

        <button 
          className="unlock-btn"
          onClick={handlePinSubmit}
          disabled={pin.length < 4 || (isSettingPin && pin !== confirmPin)}
        >
          {isSettingPin ? 'Définir PIN' : 'Déverrouiller'}
        </button>

        {!isSettingPin && (
          <>
            <button 
              className="forgot-pin-btn"
              onClick={() => {
                // En production, implémenter la récupération de PIN
                setError('Contactez le support pour récupérer votre accès')
              }}
            >
              Mot de passe oublié ?
            </button>
            
            <button 
              className="reset-app-btn"
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: 'var(--danger, #dc3545)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={() => {
                if (confirm('⚠️ ATTENTION : Ceci effacera TOUTES les données de l\'application et permettra de créer un nouveau PIN.\n\nÊtes-vous sûr de vouloir continuer ?')) {
                  // Effacer toutes les données
                  localStorage.clear()
                  // Recharger la page pour redémarrer à zéro
                  window.location.reload()
                }
              }}
            >
              🔄 Nouveau compte / Réinitialiser
            </button>
          </>
        )}
      </div>
    </div>
  )
}

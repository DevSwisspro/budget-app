import React, { useState } from 'react';
import { setPin } from '../core/pin';

export default function CreatePin({ onDone }: { onDone: () => void }) {
  const [pin, setP] = useState(''); 
  const [pin2, setP2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const valid = pin.length >= 4 && pin === pin2;
  
  const handleSubmit = async () => {
    if (!valid) return;
    
    setIsLoading(true);
    try {
      await setPin(pin);
      onDone();
    } catch (error) {
      console.error('Erreur lors de la création du PIN:', error);
      alert('Erreur lors de la création du PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-elev)',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 24px 0', textAlign: 'center', fontSize: '24px' }}>
          Créer votre code PIN
        </h2>
        <p style={{ 
          color: 'var(--muted)', 
          textAlign: 'center', 
          margin: '0 0 32px 0',
          fontSize: '14px'
        }}>
          Votre PIN sécurise l'accès à votre application budget
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Code PIN (minimum 4 chiffres)
          </label>
          <input 
            type="password" 
            value={pin} 
            onChange={e => setP(e.target.value)} 
            placeholder="Entrez votre PIN"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            maxLength={8}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Confirmer le PIN
          </label>
          <input 
            type="password" 
            value={pin2} 
            onChange={e => setP2(e.target.value)} 
            placeholder="Confirmez votre PIN"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            maxLength={8}
          />
        </div>
        
        {pin.length > 0 && pin.length < 4 && (
          <p style={{ color: 'var(--error)', fontSize: '12px', margin: '0 0 16px 0' }}>
            ⚠️ Le PIN doit contenir au moins 4 caractères
          </p>
        )}
        
        {pin.length >= 4 && pin2.length > 0 && pin !== pin2 && (
          <p style={{ color: 'var(--error)', fontSize: '12px', margin: '0 0 16px 0' }}>
            ⚠️ Les codes PIN ne correspondent pas
          </p>
        )}
        
        <button 
          disabled={!valid || isLoading} 
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: valid ? 'var(--accent)' : 'var(--muted)',
            color: valid ? 'white' : 'var(--text-muted)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: valid ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? '⏳ Création...' : '🔒 Enregistrer le PIN'}
        </button>
      </div>
    </div>
  );
}

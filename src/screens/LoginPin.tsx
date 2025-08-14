import React, { useState } from 'react';
import { verifyPin, resetAll } from '../core/pin';

export default function LoginPin({ onOK }: { onOK: () => void }) {
  const [pin, setP] = useState(''); 
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (pin.length < 4) return;
    
    setErr('');
    setIsLoading(true);
    
    try {
      const ok = await verifyPin(pin);
      if (ok) {
        onOK();
      } else {
        setErr('PIN incorrect');
        setP(''); // Vider le champ
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du PIN:', error);
      setErr('Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser l\'application ?\n\nCela supprimera définitivement :\n• Votre code PIN\n• Toutes vos données budget\n• Toutes vos transactions\n\nCette action est irréversible !')) {
      resetAll();
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
          🔒 Entrer votre PIN
        </h2>
        <p style={{ 
          color: 'var(--muted)', 
          textAlign: 'center', 
          margin: '0 0 32px 0',
          fontSize: '14px'
        }}>
          Saisissez votre code PIN pour accéder à votre budget
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <input 
            type="password" 
            value={pin} 
            onChange={e => setP(e.target.value)} 
            placeholder="Code PIN"
            autoFocus
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              border: err ? '2px solid var(--error)' : '1px solid var(--border)',
              background: 'var(--bg)',
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '8px',
              fontWeight: '600'
            }}
            maxLength={8}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </div>
        
        {err && (
          <p style={{ 
            color: 'var(--error)', 
            fontSize: '14px', 
            margin: '0 0 16px 0',
            textAlign: 'center',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '8px',
            borderRadius: '6px'
          }}>
            ❌ {err}
          </p>
        )}
        
        <button 
          onClick={handleSubmit}
          disabled={pin.length < 4 || isLoading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: pin.length >= 4 ? 'var(--accent)' : 'var(--muted)',
            color: pin.length >= 4 ? 'white' : 'var(--text-muted)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: pin.length >= 4 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
        >
          {isLoading ? '⏳ Vérification...' : '✓ Continuer'}
        </button>
        
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <button 
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
          >
            🔄 Nouveau compte (efface les données)
          </button>
        </div>
      </div>
    </div>
  );
}

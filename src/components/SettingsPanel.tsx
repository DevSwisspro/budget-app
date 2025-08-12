import { useEffect, useState } from 'react'

type Settings = {
  locale: 'fr-FR' | 'fr-CH'
  currency: 'EUR' | 'CHF'
}

const KEY = 'budget/settings'

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { locale: 'fr-FR', currency: 'EUR' }
    const s = JSON.parse(raw) as Settings
    return s
  } catch {
    return { locale: 'fr-FR', currency: 'EUR' }
  }
}

export default function SettingsPanel({ onChange }: { onChange: (s: Settings) => void }) {
  const [settings, setSettings] = useState<Settings>(() => load())

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings))
    onChange(settings)
  }, [settings])

  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
      <div>
        <label>Langue/Format</label>
        <select value={settings.locale} onChange={(e) => setSettings({ ...settings, locale: e.target.value as Settings['locale'] })}>
          <option value="fr-FR">fr-FR (France)</option>
          <option value="fr-CH">fr-CH (Suisse)</option>
        </select>
      </div>
      <div>
        <label>Devise</label>
        <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value as Settings['currency'] })}>
          <option value="EUR">EUR (€)</option>
          <option value="CHF">CHF (Fr)</option>
        </select>
      </div>
    </div>
  )
}



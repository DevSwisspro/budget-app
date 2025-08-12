import { useState } from 'react'
import type { Rule } from '../rules'

type Props = {
  rules: Rule[]
  onChange: (next: Rule[]) => void
  categories: string[]
}

export default function RulesEditor({ rules, onChange, categories }: Props) {
  const [drafts, setDrafts] = useState<Rule[]>(() => rules)

  function addRule() {
    setDrafts((d) => [
      ...d,
      { id: crypto.randomUUID(), enabled: true, match: { textContains: '' }, action: { setCategory: '' } },
    ])
  }
  function updateRule(id: string, next: Partial<Rule>) {
    setDrafts((d) => d.map((r) => (r.id === id ? { ...r, ...next, match: { ...r.match, ...next.match }, action: { ...r.action, ...next.action } } : r)))
  }
  function removeRule(id: string) {
    setDrafts((d) => d.filter((r) => r.id !== id))
  }
  function save() { onChange(drafts) }

  return (
    <div className="stack">
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-accent" onClick={addRule}>Nouvelle règle</button>
        <button onClick={save}>Enregistrer</button>
      </div>
      <div className="stack">
        {drafts.map((r) => (
          <div key={r.id} className="panel" style={{ display: 'grid', gap: 8, gridTemplateColumns: 'auto 1fr 1fr auto' }}>
            <label>
              <input type="checkbox" checked={r.enabled} onChange={(e) => updateRule(r.id, { enabled: e.target.checked })} />
              <span style={{ marginLeft: 8 }}>Actif</span>
            </label>
            <input
              placeholder="Si le libellé contient..."
              value={r.match.textContains ?? ''}
              onChange={(e) => updateRule(r.id, { match: { textContains: e.target.value } })}
            />
            <select
              value={r.action.setCategory ?? ''}
              onChange={(e) => updateRule(r.id, { action: { setCategory: e.target.value } })}
            >
              <option value="">Catégorie...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button onClick={() => removeRule(r.id)}>Supprimer</button>
          </div>
        ))}
        {drafts.length === 0 && <div style={{ color: 'var(--muted)' }}>Aucune règle</div>}
      </div>
    </div>
  )
}



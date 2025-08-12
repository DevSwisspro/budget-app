import { useEffect, useMemo, useState } from 'react'
import type { CategoryTypesMap, CategoryType } from '../types'

type Props = {
  categories: string[]
  value: CategoryTypesMap
  onChange: (next: CategoryTypesMap) => void
  onDeleteCategory: (category: string) => void
}

export default function CategoryManager({ categories, value, onChange, onDeleteCategory }: Props) {
  const [draft, setDraft] = useState<CategoryTypesMap>({ ...value })

  useEffect(() => setDraft((d) => ({ ...d, ...value })), [value])

  function setType(cat: string, type: CategoryType) {
    const next = { ...draft, [cat]: type }
    setDraft(next)
    onChange(next)
  }

  const groups = useMemo(() => {
    const get = (t: CategoryType) => categories.filter((c) => (draft[c] ?? 'variable') === t)
    return { income: get('income'), fixed: get('fixed'), variable: get('variable') }
  }, [draft, categories])

  return (
    <div className="stack">
      <div style={{ color: 'var(--muted)' }}>Classe les catégories pour un résumé lisible (revenus / dépenses fixes / variables).</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {(['income','fixed','variable'] as CategoryType[]).map((t) => (
          <div key={t} className="panel">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {t === 'income' ? 'Revenus' : t === 'fixed' ? 'Dépenses fixes' : 'Dépenses variables'}
            </div>
            <div className="stack">
              {groups[t].map((c) => (
                <div key={c} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 8 }}>
                  <span>{c}</span>
                  <select value={draft[c] ?? t} onChange={(e) => setType(c, e.target.value as CategoryType)}>
                    <option value="income">Revenu</option>
                    <option value="fixed">Fixe</option>
                    <option value="variable">Variable</option>
                  </select>
                  <button onClick={() => onDeleteCategory(c)}>Supprimer</button>
                </div>
              ))}
              {groups[t].length === 0 && <div style={{ color: 'var(--muted)' }}>Aucune</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



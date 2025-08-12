import { useMemo, useState } from 'react'
import type { BudgetsByCategory } from '../types'
import { parseAmountToCents, toCurrencyString } from '../utils'

type Props = {
  categories: string[]
  budgets: BudgetsByCategory
  onChange: (next: BudgetsByCategory) => void
}

export default function BudgetsEditor({ categories, budgets, onChange }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const c of categories) initial[c] = budgets[c] ? String(budgets[c] / 100) : ''
    return initial
  })

  function setDraft(category: string, value: string) {
    setDrafts((d) => ({ ...d, [category]: value }))
  }

  function applyChanges() {
    const next: BudgetsByCategory = {}
    for (const c of categories) {
      const cents = parseAmountToCents(drafts[c] ?? '')
      if (cents > 0) next[c] = cents
    }
    onChange(next)
  }

  const total = useMemo(() => Object.values(drafts).reduce((s, v) => s + parseAmountToCents(v || '0'), 0), [drafts])

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>Budgets par catégorie</div>
        <div style={{ fontWeight: 600 }}>{toCurrencyString(total)}</div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {categories.map((c) => (
          <div key={c} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
            <label>{c}</label>
            <input
              placeholder="Montant"
              inputMode="decimal"
              value={drafts[c] ?? ''}
              onChange={(e) => setDraft(c, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <button onClick={applyChanges}>Enregistrer budgets</button>
      </div>
    </div>
  )
}



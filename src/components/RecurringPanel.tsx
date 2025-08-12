import { useMemo, useState } from 'react'
import type { RecurringItem, TransactionInput } from '../types'
import { parseAmountToCents, todayIso } from '../utils'

type Props = {
  items: RecurringItem[]
  categories: string[]
  onChange: (next: RecurringItem[]) => void
  onAddTransaction: (tx: TransactionInput) => void
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d)
  dt.setDate(dt.getDate() + days)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

function nextDate(current: string, period: RecurringItem['period'], intervalDays?: number): string {
  if (period === 'weekly') return addDays(current, 7)
  if (period === 'monthly') {
    const [y, m, d] = current.split('-').map(Number)
    const dt = new Date(y, (m ?? 1) - 1, d)
    dt.setMonth(dt.getMonth() + 1)
    const yy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    return `${yy}-${mm}-${dd}`
  }
  if (period === 'yearly') {
    const [y, m, d] = current.split('-').map(Number)
    const dt = new Date(y + 1, (m ?? 1) - 1, d)
    const yy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    return `${yy}-${mm}-${dd}`
  }
  return addDays(current, Math.max(1, intervalDays ?? 30))
}

export default function RecurringPanel({ items, categories, onChange, onAddTransaction }: Props) {
  const [draft, setDraft] = useState<Partial<RecurringItem>>({ nextDate: todayIso(), period: 'monthly' })

  function addItem() {
    if (!draft.nextDate || !draft.amountCents || !draft.category || !draft.period) return
    const item: RecurringItem = {
      id: crypto.randomUUID(),
      name: draft.name ?? 'Récurrence',
      amountCents: draft.amountCents,
      category: draft.category,
      note: draft.note,
      period: draft.period,
      intervalDays: draft.intervalDays,
      nextDate: draft.nextDate,
      autoAdd: draft.autoAdd ?? true,
    }
    onChange([...items, item])
    setDraft({ nextDate: todayIso(), period: 'monthly' })
  }

  function remove(id: string) { onChange(items.filter((i) => i.id !== id)) }

  function runDue() {
    const today = todayIso()
    const next: RecurringItem[] = []
    for (const r of items) {
      let current = r.nextDate
      while (current <= today) {
        if (r.autoAdd) onAddTransaction({ date: current, amountCents: r.amountCents, category: r.category, note: r.note })
        current = nextDate(current, r.period, r.intervalDays)
      }
      next.push({ ...r, nextDate: current })
    }
    onChange(next)
  }

  const sorted = useMemo(() => [...items].sort((a, b) => (a.nextDate < b.nextDate ? -1 : 1)), [items])

  return (
    <div className="stack">
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr 2fr auto' }}>
        <input placeholder="Nom" value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <input placeholder="Montant" inputMode="decimal" onChange={(e) => setDraft({ ...draft, amountCents: parseAmountToCents(e.target.value) })} />
        <select value={draft.category ?? ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
          <option value="">Catégorie</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Note" value={draft.note ?? ''} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
        <button onClick={addItem}>Ajouter</button>
        <div style={{ gridColumn: '1 / -1', display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto' }}>
          <select value={draft.period ?? 'monthly'} onChange={(e) => setDraft({ ...draft, period: e.target.value as RecurringItem['period'] })}>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
            <option value="yearly">Annuel</option>
            <option value="custom">Personnalisé (jours)</option>
          </select>
          <input type="number" placeholder="Intervalle (jours)" value={draft.intervalDays ?? ''} onChange={(e) => setDraft({ ...draft, intervalDays: Number(e.target.value || 0) })} />
          <input type="date" value={draft.nextDate ?? todayIso()} onChange={(e) => setDraft({ ...draft, nextDate: e.target.value })} />
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={draft.autoAdd ?? true} onChange={(e) => setDraft({ ...draft, autoAdd: e.target.checked })} />
            Ajouter automatiquement
          </label>
          <div></div>
          <button className="btn-accent" onClick={runDue}>Générer les opérations dues</button>
        </div>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prochaine date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.category}</td>
                <td>{r.nextDate}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => remove(r.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Aucune récurrence</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}




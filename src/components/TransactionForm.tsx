import { useEffect, useMemo, useState } from 'react'
import type { TransactionInput } from '../types'
import { parseAmountToCents, todayIso } from '../utils'

type Props = {
  categories: string[]
  onAdd: (tx: TransactionInput) => void
  onAddCategory: (category: string) => void
}

export default function TransactionForm({ categories, onAdd, onAddCategory }: Props) {
  const [date, setDate] = useState<string>(todayIso())
  const [amount, setAmount] = useState<string>('')
  const [category, setCategory] = useState<string>(categories[0] ?? '')
  const [note, setNote] = useState<string>('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [newCategory, setNewCategory] = useState<string>('')

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0] ?? '')
    }
  }, [categories])

  const isValid = useMemo(() => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && parseAmountToCents(amount) > 0 && Boolean(category)
  }, [date, amount, category])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onAdd({ date, amountCents: parseAmountToCents(amount), category, note: note.trim() || undefined, type })
    setAmount('')
    setNote('')
  }

  function handleAddCategory() {
    const trimmed = newCategory.trim()
    if (!trimmed) return
    onAddCategory(trimmed)
    setCategory(trimmed)
    setNewCategory('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr 2fr auto' }}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value as 'expense' | 'income')}>
        <option value="expense">Dépense</option>
        <option value="income">Revenu</option>
      </select>
      <input
        placeholder="Montant (ex: 12,50)"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input placeholder="Note (optionnel)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="submit" disabled={!isValid}>
        Ajouter
      </button>

      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
        <input
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          Ajouter catégorie
        </button>
      </div>
    </form>
  )
}



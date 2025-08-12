import { useMemo, useRef, useState } from 'react'
import type { Transaction } from '../types'
import { toCurrencyString } from '../utils'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useVirtualizer } from '@tanstack/react-virtual'

type Props = {
  items: Transaction[]
  onDelete: (id: string) => void
  currencyLocale: 'fr-FR' | 'fr-CH'
  currencyCode: 'EUR' | 'CHF'
}

export default function TransactionList({ items, onDelete, currencyLocale, currencyCode }: Props) {
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebouncedValue(query, 200)

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter((t) =>
      [t.category, t.note ?? '', t.date, String(t.amountCents / 100)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [items, debouncedQuery])

  const total = useMemo(
    () => items.reduce((sum, t) => sum + (t.type === 'income' ? -t.amountCents : t.amountCents), 0),
    [items],
  )

  // Virtualization
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 44,
    overscan: 8,
  })

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 240 }}
        />
        <div style={{ fontWeight: 600 }}>{toCurrencyString(total, currencyLocale, currencyCode)}</div>
      </div>
      <div ref={tableContainerRef} style={{ overflow: 'auto', maxHeight: 320, position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Date</th>
              <th style={{ textAlign: 'left' }}>Catégorie</th>
              <th style={{ textAlign: 'left' }}>Note</th>
              <th style={{ textAlign: 'right' }}>Montant</th>
              <th></th>
            </tr>
          </thead>
        </table>
        <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', position: 'absolute', inset: 0 }}>
            <tbody>
              {rowVirtualizer.getVirtualItems().map((vr) => {
                const t = filtered[vr.index]
                return (
                  <tr key={t.id} style={{ transform: `translateY(${vr.start}px)` }}>
                    <td>{t.date}</td>
                    <td>{t.category}</td>
                    <td>{t.note}</td>
                    <td style={{ textAlign: 'right', color: t.type === 'income' ? '#22c55e' : undefined }}>
                      {t.type === 'income' ? '+' : ''}
                      {toCurrencyString(t.amountCents, currencyLocale, currencyCode)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => onDelete(t.id)}>Supprimer</button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                    Aucune transaction
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



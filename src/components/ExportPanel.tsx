import type { BudgetsByCategory, Transaction } from '../types'

type Props = {
  transactions: Transaction[]
  budgets: BudgetsByCategory
  onRestore: (data: { transactions: Transaction[]; budgets: BudgetsByCategory }) => void
}

export default function ExportPanel({ transactions, budgets, onRestore }: Props) {
  function download(filename: string, content: string, type = 'text/plain') {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportJSON() {
    const payload = { transactions, budgets, exportedAt: new Date().toISOString() }
    download('akuma-budget.json', JSON.stringify(payload, null, 2), 'application/json')
  }

  function exportCSV() {
    const header = ['date', 'amount', 'category', 'note']
    const lines = [header.join(',')]
    for (const t of transactions) {
      const row = [t.date, (t.amountCents / 100).toFixed(2), t.category, (t.note ?? '').replace(/,/g, ' ')]
      lines.push(row.join(','))
    }
    download('akuma-transactions.csv', lines.join('\n'), 'text/csv')
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={exportJSON}>Exporter JSON</button>
      <button onClick={exportCSV}>Exporter CSV</button>
      <label style={{ marginLeft: 8, color: 'var(--muted)' }}>Restaurer JSON</label>
      <input
        type="file"
        accept="application/json,.json"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          try {
            const text = await file.text()
            const data = JSON.parse(text)
            if (!data || typeof data !== 'object') return
            const txs = Array.isArray(data.transactions) ? (data.transactions as Transaction[]) : []
            const buds = (data.budgets ?? {}) as BudgetsByCategory
            onRestore({ transactions: txs, budgets: buds })
          } catch {
            // ignore parse errors silently
          }
          // reset input to allow re-uploading same file
          ;(e.target as HTMLInputElement).value = ''
        }}
      />
    </div>
  )
}



import { useMemo, useRef, useState } from 'react'
import Papa from 'papaparse'
import type { Transaction, TransactionInput } from '../types'
import type { Rule } from '../rules'
import { applyRulesToTransaction } from '../rules'
import { parseAmountToCents } from '../utils'

type Props = {
  rules: Rule[]
  onImport: (items: TransactionInput[]) => void
  onAddCategories: (names: string[]) => void
}

type Mapping = {
  date?: string
  amount?: string
  note?: string
  category?: string
}

export default function CsvImport({ rules, onImport, onAddCategories }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [mapping, setMapping] = useState<Mapping>({})
  const [decimal, setDecimal] = useState<string>('.')

  function inferMapping(hs: string[]): Mapping {
    const lower = (s: string) => s.toLowerCase()
    const find = (alts: string[]) => hs.find((h) => alts.some((a) => lower(h).includes(a)))
    return {
      date: find(['date', 'jour', 'transaction date']),
      amount: find(['amount', 'montant', 'value', 'debit', 'crédit', 'credit']),
      note: find(['label', 'libellé', 'description', 'note', 'motif']),
      category: find(['category', 'categorie', 'catégorie']),
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: Papa.ParseResult<Record<string, string>>) => {
        const hs = (res.meta.fields ?? []).filter(Boolean) as string[]
        setHeaders(hs)
        setRows(res.data.filter(Boolean))
        setMapping((m) => ({ ...inferMapping(hs), ...m }))
      },
    })
  }

  function parseDate(input: string): string | null {
    const s = input.trim()
    // Try ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
    // Try DD/MM/YYYY or DD-MM-YYYY
    const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
    if (m) {
      const dd = m[1].padStart(2, '0')
      const mm = m[2].padStart(2, '0')
      const yyyy = m[3]
      return `${yyyy}-${mm}-${dd}`
    }
    const d = new Date(s)
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear()
      const mon = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${mon}-${day}`
    }
    return null
  }

  const preview = useMemo(() => {
    if (!mapping.date || !mapping.amount) return [] as TransactionInput[]
    const usedCategories = new Set<string>()
    const items: TransactionInput[] = []
    for (const r of rows.slice(0, 100)) {
      const dateIso = parseDate(String(r[mapping.date] ?? ''))
      if (!dateIso) continue
      const rawAmount = String(r[mapping.amount] ?? '').replace(',', decimal)
      const amountCents = parseAmountToCents(rawAmount)
      const note = mapping.note ? String(r[mapping.note] ?? '') : undefined
      const category = mapping.category ? String(r[mapping.category] ?? '') : 'Divers'
      usedCategories.add(category)

      items.push({ date: dateIso, amountCents, category, note })
    }
    return items
  }, [rows, mapping, decimal])

  function runImport() {
    if (!mapping.date || !mapping.amount) return
    const usedCategories = new Set<string>()
    const imported: TransactionInput[] = []
    for (const r of rows) {
      const dateIso = parseDate(String(r[mapping.date] ?? ''))
      if (!dateIso) continue
      const rawAmount = String(r[mapping.amount] ?? '').replace(',', decimal)
      const amountCents = parseAmountToCents(rawAmount)
      if (!amountCents) continue
      let input: TransactionInput = {
        date: dateIso,
        amountCents,
        category: mapping.category ? String(r[mapping.category] ?? '') || 'Divers' : 'Divers',
        note: mapping.note ? String(r[mapping.note] ?? '') : undefined,
      }
      // Apply rules
      const tx: Transaction = { id: 'temp', ...input }
      const applied = applyRulesToTransaction(tx, rules)
      input = { date: applied.date, amountCents: applied.amountCents, category: applied.category, note: applied.note }
      usedCategories.add(input.category)
      imported.push(input)
    }
    onAddCategories(Array.from(usedCategories))
    onImport(imported)
    // reset input
    if (inputRef.current) inputRef.current.value = ''
    setHeaders([])
    setRows([])
  }

  return (
    <div className="stack">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} />
        <select value={decimal} onChange={(e) => setDecimal(e.target.value)}>
          <option value="," >Décimale ,</option>
          <option value=".">Décimale .</option>
        </select>
        <button className="btn-accent" onClick={runImport} disabled={headers.length === 0}>
          Importer
        </button>
      </div>

      {headers.length > 0 && (
        <div className="panel" style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <div>
              <label>Date</label>
              <select value={mapping.date ?? ''} onChange={(e) => setMapping({ ...mapping, date: e.target.value })}>
                <option value="">-</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Montant</label>
              <select
                value={mapping.amount ?? ''}
                onChange={(e) => setMapping({ ...mapping, amount: e.target.value })}
              >
                <option value="">-</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Catégorie</label>
              <select
                value={mapping.category ?? ''}
                onChange={(e) => setMapping({ ...mapping, category: e.target.value })}
              >
                <option value="">-</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Note</label>
              <select value={mapping.note ?? ''} onChange={(e) => setMapping({ ...mapping, note: e.target.value })}>
                <option value="">-</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--muted)', marginBottom: 8 }}>Aperçu (100 premières lignes):</div>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Note</th>
                    <th style={{ textAlign: 'right' }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((p, i) => (
                    <tr key={i}>
                      <td>{p.date}</td>
                      <td>{p.category}</td>
                      <td>{p.note}</td>
                      <td style={{ textAlign: 'right' }}>{(p.amountCents / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                  {preview.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>
                        Aucun aperçu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



import { useMemo } from 'react'
import type { SpendingByCategory, Transaction } from '../types'
import { getMonthKey, toCurrencyString } from '../utils'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
} from 'recharts'

const COLORS = ['#E50914', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6']

type CategoryChartProps = {
  spending: SpendingByCategory
}

export function CategoryPie({ spending }: CategoryChartProps) {
  const data = useMemo(
    () =>
      Object.entries(spending)
        .map(([name, cents]) => ({ name, value: Math.max(0, Math.round(cents / 100)) }))
        .sort((a, b) => b.value - a.value),
    [spending],
  )
  if (data.length === 0) return <div style={{ color: 'var(--muted)' }}>Aucune dépense ce mois</div>
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(val: number) => toCurrencyString(Math.round(Number(val) * 100))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

type CategorySplitProps = {
  transactions: Transaction[]
}

export function CategorySplit({ transactions }: CategorySplitProps) {
  const { expenses, incomes } = useMemo(() => {
    const e: Record<string, number> = {}
    const i: Record<string, number> = {}
    for (const t of transactions) {
      if (t.type === 'income') i[t.category] = (i[t.category] ?? 0) + t.amountCents
      else e[t.category] = (e[t.category] ?? 0) + t.amountCents
    }
    const mapToData = (m: Record<string, number>) =>
      Object.entries(m)
        .map(([name, cents]) => ({ name, value: Math.max(0, Math.round(cents / 100)) }))
        .sort((a, b) => b.value - a.value)
    return { expenses: mapToData(e), incomes: mapToData(i) }
  }, [transactions])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <div style={{ marginBottom: 8, color: 'var(--muted)' }}>Dépenses par catégorie</div>
        {expenses.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>Aucune dépense</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expenses} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {expenses.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => toCurrencyString(Math.round(Number(val) * 100))} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div>
        <div style={{ marginBottom: 8, color: 'var(--muted)' }}>Revenus par catégorie</div>
        {incomes.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>Aucun revenu</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={incomes} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {incomes.map((_, i) => (
                  <Cell key={i} fill={[ '#22c55e', '#16a34a', '#10b981', '#84cc16', '#06b6d4' ][i % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => toCurrencyString(Math.round(Number(val) * 100))} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

type TrendProps = {
  transactions: Transaction[]
  months?: number
}

export function MonthlyTrend({ transactions, months = 6 }: TrendProps) {
  const data = useMemo(() => {
    const now = new Date()
    const keys: string[] = []
    for (let i = months - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      keys.push(`${y}-${m}`)
    }
    const expensesByMonth: Record<string, number> = {}
    const incomesByMonth: Record<string, number> = {}
    for (const t of transactions) {
      const k = getMonthKey(t.date)
      if (t.type === 'income') incomesByMonth[k] = (incomesByMonth[k] ?? 0) + t.amountCents
      else expensesByMonth[k] = (expensesByMonth[k] ?? 0) + t.amountCents
    }
    return keys.map((k) => {
      const e = Math.round((expensesByMonth[k] ?? 0) / 100)
      const i = Math.round((incomesByMonth[k] ?? 0) / 100)
      return { month: k, depenses: e, revenus: i, net: i - e }
    })
  }, [transactions, months])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="month" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip formatter={(val: number) => toCurrencyString(Math.round(Number(val) * 100))} />
        <Legend />
        <Bar dataKey="depenses" name="Dépenses" fill="#E50914" radius={[4, 4, 0, 0]} />
        <Bar dataKey="revenus" name="Revenus" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="net" name="Net" stroke="#ffffff" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}



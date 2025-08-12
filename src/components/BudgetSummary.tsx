import { useMemo } from 'react'
import type { BudgetsByCategory, CategoryTypesMap, SpendingByCategory } from '../types'
import { toCurrencyString } from '../utils'

type Props = {
  monthKey: string
  budgets: BudgetsByCategory
  spending: SpendingByCategory
  incomes?: SpendingByCategory
  categoryTypes?: CategoryTypesMap
  currencyLocale?: 'fr-FR' | 'fr-CH'
  currencyCode?: 'EUR' | 'CHF'
}

export default function BudgetSummary({ monthKey, budgets, spending, incomes = {}, categoryTypes = {}, currencyLocale = 'fr-FR', currencyCode = 'EUR' }: Props) {
  const rows = useMemo(() => {
    const categories = Array.from(new Set([...Object.keys(budgets), ...Object.keys(spending)])).sort()
    return categories.map((cat) => {
      const budget = budgets[cat] ?? 0
      const spent = spending[cat] ?? 0
      const remaining = budget - spent
      const type = categoryTypes[cat]
      return { cat, budget, spent, remaining, type }
    })
  }, [budgets, spending, categoryTypes])

  const totals = useMemo(() => {
    const totalBudget = rows.reduce((s, r) => s + r.budget, 0)
    const totalSpent = rows.reduce((s, r) => s + r.spent, 0)
    const totalIncome = Object.values(incomes).reduce((s, v) => s + v, 0)
    return { totalBudget, totalSpent, totalIncome, remaining: totalBudget - totalSpent }
  }, [rows])

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Résumé du mois {monthKey}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Catégorie</th>
            <th style={{ textAlign: 'right' }}>Budget</th>
            <th style={{ textAlign: 'right' }}>Dépensé</th>
            <th style={{ textAlign: 'right' }}>Reste</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.cat}>
              <td>
                {r.cat}
                {r.remaining < 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      padding: '2px 6px',
                      fontSize: 11,
                      borderRadius: 999,
                      background: 'rgba(229,9,20,0.15)',
                      border: '1px solid #3a1a1c',
                      color: '#ff6b6b',
                    }}
                  >
                    Dépassement
                  </span>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>{toCurrencyString(r.budget, currencyLocale, currencyCode)}</td>
              <td style={{ textAlign: 'right' }}>{toCurrencyString(r.spent, currencyLocale, currencyCode)}</td>
              <td style={{ textAlign: 'right', color: r.remaining < 0 ? '#e5484d' : undefined }}>
                {toCurrencyString(r.remaining, currencyLocale, currencyCode)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>
                Aucun budget configuré
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ fontWeight: 600 }}>Revenus du mois</td>
            <td></td>
            <td style={{ textAlign: 'right', fontWeight: 600, color: '#22c55e' }}>
              {toCurrencyString(totals.totalIncome, currencyLocale, currencyCode)}
            </td>
            <td></td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Total</td>
            <td style={{ textAlign: 'right', fontWeight: 600 }}>{toCurrencyString(totals.totalBudget, currencyLocale, currencyCode)}</td>
            <td style={{ textAlign: 'right', fontWeight: 600 }}>{toCurrencyString(totals.totalSpent, currencyLocale, currencyCode)}</td>
            <td
              style={{ textAlign: 'right', fontWeight: 600, color: totals.remaining < 0 ? '#e5484d' : undefined }}
            >
              {toCurrencyString(totals.remaining, currencyLocale, currencyCode)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}



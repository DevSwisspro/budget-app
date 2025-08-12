import { useState, useMemo } from 'react'
import type { SpendingByCategory, Transaction } from '../types'
import { CategoryPie, MonthlyTrend, CategorySplit } from './Charts'

type Props = {
  spending: SpendingByCategory
  transactions: Transaction[]
}

type DateFilter = 'all' | 'year' | 'month' | 'custom'

export default function ChartsPanel({ spending, transactions }: Props) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  // Fonction pour définir rapidement une période
  function setQuickPeriod(period: DateFilter) {
    setDateFilter(period)
    if (period !== 'custom') {
      setCustomStartDate('')
      setCustomEndDate('')
    }
  }

  // Fonction pour obtenir le texte de la période actuelle
  function getPeriodText() {
    switch (dateFilter) {
      case 'all': return 'Toutes les données'
      case 'year': return 'Cette année'
      case 'month': return 'Ce mois'
      case 'custom': return 'Période personnalisée'
      default: return 'Toutes les données'
    }
  }

  const filteredTransactions = useMemo(() => {
    if (dateFilter === 'all') return transactions

    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (dateFilter) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        break
      case 'custom':
        if (!customStartDate || !customEndDate) return transactions
        startDate = new Date(customStartDate)
        endDate = new Date(customEndDate + 'T23:59:59')
        break
      default:
        return transactions
    }

    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  }, [transactions, dateFilter, customStartDate, customEndDate])

  const filteredSpending = useMemo(() => {
    if (dateFilter === 'all') return spending
    
    const filtered: SpendingByCategory = {}
    for (const transaction of filteredTransactions) {
      if (transaction.type === 'expense') {
        filtered[transaction.category] = (filtered[transaction.category] || 0) + transaction.amountCents
      }
    }
    return filtered
  }, [spending, filteredTransactions, dateFilter])

  return (
    <div className="stack">
      <div className="period-selector">
        <div className="period-header">
          <span className="period-label">PÉRIODE</span>
          <div className="period-controls">
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="period-dropdown"
            >
              <option value="all">Toutes les données</option>
              <option value="year">Cette année</option>
              <option value="month">Ce mois</option>
              <option value="custom">Période personnalisée</option>
            </select>
            
            {dateFilter === 'custom' && (
              <div className="custom-date-inputs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="date-input"
                  placeholder="Date début"
                />
                <span className="date-separator">à</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="date-input"
                  placeholder="Date fin"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="period-info">
          <div className="quick-periods">
            <button 
              className={`quick-period-btn ${dateFilter === 'all' ? 'active' : ''}`}
              onClick={() => setQuickPeriod('all')}
            >
              Toutes
            </button>
            <button 
              className={`quick-period-btn ${dateFilter === 'year' ? 'active' : ''}`}
              onClick={() => setQuickPeriod('year')}
            >
              Année
            </button>
            <button 
              className={`quick-period-btn ${dateFilter === 'month' ? 'active' : ''}`}
              onClick={() => setQuickPeriod('month')}
            >
              Mois
            </button>
            <button 
              className={`quick-period-btn ${dateFilter === 'custom' ? 'active' : ''}`}
              onClick={() => setQuickPeriod('custom')}
            >
              Personnalisé
            </button>
          </div>
          <div className="period-stats">
            <span className="info-label">Dépense</span>
            <span className="info-label">Revenu</span>
          </div>
        </div>
      </div>

      <CategorySplit transactions={filteredTransactions} />
      <MonthlyTrend transactions={filteredTransactions} />
      <CategoryPie spending={filteredSpending} />
    </div>
  )
}



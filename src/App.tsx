import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { BudgetsByCategory, Transaction, TransactionInput } from './types'
import { getMonthKey } from './utils'
import {
  computeSpendingByCategory,
  loadBudgets,
  loadCategories,
  loadTransactions,
  saveBudgets,
  saveCategories,
  saveTransactions,
} from './storage'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetSummary from './components/BudgetSummary'
import CsvImport from './components/CsvImport'
import { loadRules, saveRules, type Rule } from './rules'
import { Suspense, lazy } from 'react'
const ChartsPanel = lazy(() => import('./components/ChartsPanel'))
import { useToast } from './components/Toasts'
import { loadRecurring, saveRecurring, computeIncomesByCategory, loadCategoryTypes, saveCategoryTypes } from './storage'
import type { RecurringItem } from './types'
import SettingsManager from './components/SettingsManager'
import LockScreen from './components/LockScreen'
import SecurityService from './services/SecurityService'

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions())
  const [categories, setCategories] = useState<string[]>(() => loadCategories())
  const [budgets, setBudgets] = useState<BudgetsByCategory>(() => loadBudgets())
  const [monthKey, setMonthKey] = useState<string>(() => getMonthKey(new Date().toISOString().slice(0, 10)))
  const [rules, setRules] = useState<Rule[]>(() => loadRules())
  const [recurring, setRecurring] = useState<RecurringItem[]>(() => loadRecurring())
  const [categoryTypes, setCategoryTypes] = useState(() => loadCategoryTypes())
  const [showSettings, setShowSettings] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const { push } = useToast()

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    saveBudgets(budgets)
  }, [budgets])

  useEffect(() => { saveRules(rules) }, [rules])
  useEffect(() => { saveRecurring(recurring) }, [recurring])
  useEffect(() => { saveCategoryTypes(categoryTypes) }, [categoryTypes])

  // Initialiser la sécurité au démarrage
  useEffect(() => {
    async function initializeSecurity() {
      try {
        await SecurityService.initialize()
        // Vérifier si un PIN existe déjà (première utilisation = pas de PIN)
        const hasExistingPin = await SecurityService.hasPin()
        setIsFirstTime(!hasExistingPin)
        setIsLocked(true) // Toujours verrouillé au démarrage
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la sécurité:', error)
        setIsFirstTime(true)
      }
    }
    
    initializeSecurity()
  }, [])

  // Vérifier l'authentification périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      if (!SecurityService.isUserAuthenticated()) {
        setIsLocked(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(monthKey)).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [transactions, monthKey],
  )

  const spending = useMemo(() => computeSpendingByCategory(transactions, monthKey), [transactions, monthKey])
  const incomes = useMemo(() => computeIncomesByCategory(transactions, monthKey), [transactions, monthKey])
  useEffect(() => {
    // Alert if any negative remaining
    const overs = Object.entries(budgets).filter(([cat, budget]) => (spending[cat] ?? 0) > budget)
    if (overs.length > 0) {
      const first = overs[0][0]
      push(`Budget dépassé: ${first}`)
    }
  }, [budgets, spending])

  function addTransaction(input: TransactionInput) {
    const tx: Transaction = { id: crypto.randomUUID(), ...input }
    setTransactions((prev) => [tx, ...prev])
  }

  function removeTransaction(id: string) {
    const prev = transactions
    const removed = prev.find((t) => t.id === id)
    setTransactions((p) => p.filter((t) => t.id !== id))
    if (removed) {
      push({
        message: 'Transaction supprimée',
        actionLabel: 'Annuler',
        onAction: () => setTransactions((p) => [removed, ...p]),
      })
    }
  }

  function addCategory(name: string) {
    setCategories((prev) => Array.from(new Set([...prev, name])).sort((a, b) => a.localeCompare(b)))
  }

  function addCategories(names: string[]) {
    setCategories((prev) => Array.from(new Set([...prev, ...names])).sort((a, b) => a.localeCompare(b)))
  }

  function changeBudgets(next: BudgetsByCategory) {
    setBudgets(next)
  }

  function handleUnlock() {
    setIsLocked(false)
    setIsFirstTime(false)
  }

  return (
    <div className="stack">
      {isLocked && (
        <LockScreen 
          onUnlock={handleUnlock}
          isFirstTime={isFirstTime}
        />
      )}
      <header className="appbar">
        <div className="brand">
          <span className="mark" />
          <h1 className="brand">Budget</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}>Mois</span>
          <input type="month" value={monthKey} onChange={(e) => setMonthKey(e.target.value)} />
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              background: showSettings ? 'var(--accent)' : 'var(--bg-elev)', 
              color: showSettings ? 'white' : 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚙️</span>
            <span>Réglages</span>
          </button>
        </div>
      </header>

      <div className="panel">
        <TransactionForm categories={categories} onAdd={addTransaction} onAddCategory={addCategory} />
      </div>

      {showSettings ? (
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Réglages</h2>
            <button 
              onClick={() => setShowSettings(false)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '8px', 
                border: '1px solid var(--border)', 
                background: 'var(--bg-elev)', 
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              ✕ Fermer
            </button>
          </div>
          <SettingsManager
            onSettingsChange={() => { /* re-render implicit by localStorage read */ }}
            categories={categories}
            categoryTypes={categoryTypes}
            onCategoryTypesChange={setCategoryTypes}
            onDeleteCategory={(cat) => setCategories((prev) => prev.filter((c) => c !== cat))}
            onAddCategory={addCategory}
            budgets={budgets}
            onBudgetsChange={changeBudgets}
            rules={rules}
            onRulesChange={setRules}
            recurring={recurring}
            onRecurringChange={setRecurring}
            onAddTransaction={addTransaction}
            transactions={transactions}
            onRestore={({ transactions: t, budgets: b }) => {
              setTransactions(t)
              setBudgets(b)
              push('Données restaurées')
            }}
          />
        </div>
      ) : (
        <div className="grid-2">
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Transactions</h3>
            <TransactionList
              items={monthTransactions}
              onDelete={removeTransaction}
              currencyLocale={(localStorage.getItem('budget/settings') && JSON.parse(localStorage.getItem('budget/settings') as string).locale) || 'fr-FR'}
              currencyCode={(localStorage.getItem('budget/settings') && JSON.parse(localStorage.getItem('budget/settings') as string).currency) || 'EUR'}
            />
            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>Import CSV</h3>
              <CsvImport rules={rules} onImport={(items) => items.forEach(addTransaction)} onAddCategories={addCategories} />
            </div>
          </div>
          <div className="stack">
            <div className="panel">
              <h3 style={{ marginTop: 0 }}>Résumé</h3>
              <BudgetSummary
                monthKey={monthKey}
                budgets={budgets}
                spending={spending}
                incomes={incomes}
                categoryTypes={categoryTypes}
                currencyLocale={(localStorage.getItem('budget/settings') && JSON.parse(localStorage.getItem('budget/settings') as string).locale) || 'fr-FR'}
                currencyCode={(localStorage.getItem('budget/settings') && JSON.parse(localStorage.getItem('budget/settings') as string).currency) || 'EUR'}
              />
            </div>
            <div className="panel">
              <h3 style={{ marginTop: 0 }}>Graphiques</h3>
              <Suspense fallback={<div style={{ color: 'var(--muted)' }}>Chargement des graphiques…</div>}>
                <ChartsPanel spending={spending} transactions={transactions} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

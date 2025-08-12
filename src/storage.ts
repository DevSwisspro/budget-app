import type { BudgetsByCategory, CategoryTypesMap, RecurringItem, SpendingByCategory, Transaction } from './types'

const TRANSACTIONS_KEY = 'budget/transactions'
const BUDGETS_KEY = 'budget/budgetsByCategory'
const CATEGORIES_KEY = 'budget/categories'
const CATEGORY_TYPES_KEY = 'budget/categoryTypes'
const RECURRING_KEY = 'budget/recurring'

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Transaction[]
    if (!Array.isArray(parsed)) return []
    // Backward compatibility: default type to 'expense'
    return parsed.map((t) => (t && typeof t === 'object' ? { type: 'expense', ...t } : t)).filter(Boolean) as Transaction[]
  } catch {
    return []
  }
}

export function saveTransactions(list: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list))
}

export function loadBudgets(): BudgetsByCategory {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as BudgetsByCategory
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveBudgets(map: BudgetsByCategory): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(map))
}

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) return [
      'Alimentation',
      'Logement',
      'Transport',
      'Loisirs',
      'Santé',
      'Communications',
      'Abonnements',
      'Assurance',
      'Habillement',
      'Éducation',
      'Impôts',
      'Épargne',
      'Investissement',
      'Divers',
      'Salaire',
      'Autres revenus',
    ]
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCategories(list: string[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list))
}

export function computeSpendingByCategory(transactions: Transaction[], monthKey: string): SpendingByCategory {
  const agg: SpendingByCategory = {}
  for (const t of transactions) {
    if (t.date.startsWith(monthKey) && (t.type ?? 'expense') !== 'income') {
      agg[t.category] = (agg[t.category] ?? 0) + t.amountCents
    }
  }
  return agg
}

export function computeIncomesByCategory(transactions: Transaction[], monthKey: string): SpendingByCategory {
  const agg: SpendingByCategory = {}
  for (const t of transactions) {
    if (t.date.startsWith(monthKey) && (t.type ?? 'expense') === 'income') {
      agg[t.category] = (agg[t.category] ?? 0) + t.amountCents
    }
  }
  return agg
}

export function loadCategoryTypes(): CategoryTypesMap {
  try {
    const raw = localStorage.getItem(CATEGORY_TYPES_KEY)
    if (!raw) return defaultCategoryTypes()
    const parsed = JSON.parse(raw) as CategoryTypesMap
    return parsed && typeof parsed === 'object' ? parsed : defaultCategoryTypes()
  } catch {
    return defaultCategoryTypes()
  }
}

export function saveCategoryTypes(map: CategoryTypesMap): void {
  localStorage.setItem(CATEGORY_TYPES_KEY, JSON.stringify(map))
}

export function defaultCategoryTypes(): CategoryTypesMap {
  return {
    Salaire: 'income',
    'Autres revenus': 'income',
    Logement: 'fixed',
    Santé: 'fixed',
    Communications: 'fixed',
    Abonnements: 'fixed',
    Assurance: 'fixed',
    Transport: 'variable',
    Alimentation: 'variable',
    Loisirs: 'variable',
    Habillement: 'variable',
    Éducation: 'fixed',
    Impôts: 'fixed',
    Épargne: 'fixed',
    Investissement: 'variable',
    Divers: 'variable',
  }
}

export function loadRecurring(): RecurringItem[] {
  try {
    const raw = localStorage.getItem(RECURRING_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecurringItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveRecurring(items: RecurringItem[]): void {
  localStorage.setItem(RECURRING_KEY, JSON.stringify(items))
}



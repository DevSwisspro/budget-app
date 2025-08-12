export type Transaction = {
  id: string
  /** ISO date string: YYYY-MM-DD */
  date: string
  /** Stored in cents to avoid floating point issues */
  amountCents: number
  /** Category name */
  category: string
  /** Optional note/description */
  note?: string
  /** 'expense' or 'income' */
  type?: 'expense' | 'income'
}

export type TransactionInput = Omit<Transaction, 'id'>

export type BudgetsByCategory = Record<string, number>

export type SpendingByCategory = Record<string, number>

export type RecurringPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom'

export type RecurringItem = {
  id: string
  name: string
  amountCents: number
  category: string
  note?: string
  period: RecurringPeriod
  /** When period==='custom', number of days between occurrences */
  intervalDays?: number
  /** Next due date ISO YYYY-MM-DD */
  nextDate: string
  /** If true, add transaction automatically when due */
  autoAdd?: boolean
}

export type CategoryType = 'income' | 'fixed' | 'variable'
export type CategoryTypesMap = Record<string, CategoryType>



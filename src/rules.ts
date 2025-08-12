import type { Transaction } from './types'

export type RuleMatch = {
  textContains?: string
  categoryEquals?: string
}

export type RuleAction = {
  setCategory?: string
  addNotePrefix?: string
}

export type Rule = {
  id: string
  enabled: boolean
  match: RuleMatch
  action: RuleAction
}

const RULES_KEY = 'budget/rules'

export function loadRules(): Rule[] {
  try {
    const raw = localStorage.getItem(RULES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Rule[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveRules(rules: Rule[]): void {
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
}

export function applyRulesToTransaction(tx: Transaction, rules: Rule[]): Transaction {
  let next: Transaction = { ...tx }
  for (const r of rules) {
    if (!r.enabled) continue
    const m = r.match
    let matches = true
    if (m.textContains) {
      const hay = [tx.category, tx.note ?? ''].join(' ').toLowerCase()
      matches &&= hay.includes(m.textContains.toLowerCase())
    }
    if (m.categoryEquals) {
      matches &&= tx.category === m.categoryEquals
    }
    if (!matches) continue
    const a = r.action
    if (a.setCategory) next.category = a.setCategory
    if (a.addNotePrefix) next.note = `${a.addNotePrefix} ${next.note ?? ''}`.trim()
  }
  return next
}



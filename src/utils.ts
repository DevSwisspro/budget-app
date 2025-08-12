export function toCurrencyString(
  amountCents: number,
  locale: string = 'fr-FR',
  currency: string = 'EUR',
): string {
  const amount = amountCents / 100
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function parseAmountToCents(input: string): number {
  const normalized = input
    .replace(/\s/g, '')
    .replace(',', '.')
  const num = Number(normalized)
  if (Number.isNaN(num) || !Number.isFinite(num)) return 0
  return Math.round(num * 100)
}

export function getMonthKey(dateIso: string): string {
  // Expect YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    const d = new Date(dateIso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }
  return dateIso.slice(0, 7)
}

export function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatMonthHuman(monthKey: string, locale = 'fr-FR'): string {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, (m ?? 1) - 1, 1)
  return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}



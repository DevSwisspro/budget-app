import { createContext, useContext, useMemo, useState } from 'react'

export type Toast = { id: string; message: string; actionLabel?: string; onAction?: () => void }
export type ToastInput = string | { message: string; actionLabel?: string; onAction?: () => void }

type ToastContextValue = {
  toasts: Toast[]
  push: (input: ToastInput) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(input: ToastInput) {
    const id = crypto.randomUUID()
    const toast: Toast = typeof input === 'string' ? { id, message: input } : { id, ...input }
    setToasts((t) => [...t, toast])
    setTimeout(() => remove(id), 3500)
  }
  function remove(id: string) {
    setToasts((t) => t.filter((x) => x.id !== id))
  }
  const value = useMemo(() => ({ toasts, push, remove }), [toasts])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, zIndex: 50 }}>
        {toasts.map((t) => (
          <div key={t.id} className="panel" style={{ borderColor: '#3a1a1c', background: 'rgba(229,9,20,0.1)', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{t.message}</span>
            {t.onAction && (
              <button className="btn-accent" onClick={() => { t.onAction?.(); remove(t.id) }}>{t.actionLabel ?? 'OK'}</button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('ToastProvider missing')
  return ctx
}



import { useState } from 'react'
import type { BudgetsByCategory, CategoryTypesMap, Transaction, RecurringItem } from '../types'
import type { Rule } from '../rules'
import SettingsPanel from './SettingsPanel'
import CategoryManager from './CategoryManager'
import BudgetsEditor from './BudgetsEditor'
import RulesEditor from './RulesEditor'
import RecurringPanel from './RecurringPanel'
import ExportPanel from './ExportPanel'

// Composant pour ajouter une nouvelle catégorie
function AddCategoryForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: 'var(--muted)' }}>
          Nom de la catégorie
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Transport, Alimentation..."
          style={{ width: '100%' }}
        />
      </div>
      <button type="submit" disabled={!name.trim()}>
        Ajouter
      </button>
    </form>
  )
}

type TabType = 'general' | 'categories' | 'budgets' | 'rules' | 'recurring' | 'export'

type Props = {
  // Settings
  onSettingsChange: (settings: any) => void
  
  // Categories
  categories: string[]
  categoryTypes: CategoryTypesMap
  onCategoryTypesChange: (next: CategoryTypesMap) => void
  onDeleteCategory: (category: string) => void
  onAddCategory: (name: string) => void
  
  // Budgets
  budgets: BudgetsByCategory
  onBudgetsChange: (next: BudgetsByCategory) => void
  
  // Rules
  rules: Rule[]
  onRulesChange: (rules: Rule[]) => void
  
  // Recurring
  recurring: RecurringItem[]
  onRecurringChange: (recurring: RecurringItem[]) => void
  onAddTransaction: (transaction: any) => void
  
  // Export
  transactions: Transaction[]
  onRestore: (data: { transactions: Transaction[], budgets: BudgetsByCategory }) => void
}

export default function SettingsManager(props: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('general')

  const tabs: { id: TabType; label: string; icon: string; description: string }[] = [
    { id: 'general', label: 'Général', icon: '⚙️', description: 'Paramètres de langue et devise' },
    { id: 'categories', label: 'Catégories', icon: '📂', description: 'Gérer les catégories et leurs types' },
    { id: 'budgets', label: 'Budgets', icon: '💰', description: 'Définir les budgets mensuels par catégorie' },
    { id: 'rules', label: 'Règles', icon: '🔧', description: 'Règles automatiques de catégorisation' },
    { id: 'recurring', label: 'Récurrences', icon: '🔄', description: 'Gérer les dépenses récurrentes' },
    { id: 'export', label: 'Import/Export', icon: '📤', description: 'Sauvegarder et restaurer les données' },
  ]

  function renderTabContent() {
    switch (activeTab) {
      case 'general':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Paramètres généraux</h3>
            <SettingsPanel onChange={props.onSettingsChange} />
          </div>
        )
      
      case 'categories':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Gestion des catégories</h3>
            <CategoryManager
              categories={props.categories}
              value={props.categoryTypes}
              onChange={props.onCategoryTypesChange}
              onDeleteCategory={props.onDeleteCategory}
            />
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ marginTop: 0 }}>Ajouter une nouvelle catégorie</h4>
              <AddCategoryForm onAdd={props.onAddCategory} />
            </div>
          </div>
        )
      
      case 'budgets':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Configuration des budgets</h3>
            <BudgetsEditor
              categories={props.categories}
              budgets={props.budgets}
              onChange={props.onBudgetsChange}
            />
          </div>
        )
      
      case 'rules':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Règles de catégorisation</h3>
            <RulesEditor
              rules={props.rules}
              onChange={props.onRulesChange}
              categories={props.categories}
            />
          </div>
        )
      
      case 'recurring':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Récurrences / Abonnements</h3>
            <RecurringPanel
              items={props.recurring}
              categories={props.categories}
              onChange={props.onRecurringChange}
              onAddTransaction={props.onAddTransaction}
            />
          </div>
        )
      
      case 'export':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Import et Export</h3>
            <ExportPanel
              transactions={props.transactions}
              budgets={props.budgets}
              onRestore={props.onRestore}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="settings-manager">
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.description}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="settings-content">
        <div style={{ marginBottom: 16, color: 'var(--muted)', fontSize: 14 }}>
          {tabs.find(t => t.id === activeTab)?.description}
        </div>
        {renderTabContent()}
      </div>
    </div>
  )
}

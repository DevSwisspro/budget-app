import { useState } from 'react'
import type { BudgetsByCategory, CategoryTypesMap, Transaction, RecurringItem } from '../types'
import type { Rule } from '../rules'
import SettingsPanel from './SettingsPanel'
import CategoryManager from './CategoryManager'
import BudgetsEditor from './BudgetsEditor'
import RulesEditor from './RulesEditor'
import RecurringPanel from './RecurringPanel'
import ExportPanel from './ExportPanel'
import { resetAll } from '../core/pin'

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

type TabType = 'general' | 'categories' | 'budgets' | 'rules' | 'recurring' | 'export' | 'security'

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
    { id: 'security', label: 'Sécurité', icon: '🔒', description: 'Paramètres de sécurité et réinitialisation' },
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
      
      case 'security':
        return (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Paramètres de sécurité</h3>
            
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--error)' }}>
                ⚠️ Zone de danger
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--muted)' }}>
                La réinitialisation supprimera définitivement votre code PIN et toutes vos données (transactions, budgets, paramètres). Cette action est irréversible.
              </p>
              
              <button
                onClick={() => {
                  if (confirm('⚠️ ATTENTION - Cette action est irréversible !\n\nVoulez-vous vraiment réinitialiser l\'application ?\n\nCela supprimera :\n• Votre code PIN\n• Toutes vos transactions\n• Tous vos budgets\n• Tous vos paramètres\n\nTapez "RESET" pour confirmer')) {
                    const userInput = prompt('Pour confirmer la réinitialisation, tapez exactement "RESET" (en majuscules) :');
                    if (userInput === 'RESET') {
                      resetAll();
                    } else if (userInput !== null) {
                      alert('❌ Confirmation incorrecte. Réinitialisation annulée pour votre sécurité.');
                    }
                  }
                }}
                style={{
                  background: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--error)';
                }}
              >
                🗑️ Réinitialiser l'application
              </button>
            </div>
            
            <div style={{ 
              background: 'var(--bg-elev)', 
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0' }}>
                ℹ️ Informations de sécurité
              </h4>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px', color: 'var(--muted)' }}>
                <li>Votre code PIN est stocké de manière sécurisée (chiffrement SHA-256)</li>
                <li>Vos données sont protégées localement sur votre appareil</li>
                <li>Aucune donnée n'est transmise vers des serveurs externes</li>
                <li>La réinitialisation est la seule façon de récupérer l'accès en cas d'oubli du PIN</li>
              </ul>
            </div>
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

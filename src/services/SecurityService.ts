import { Preferences } from '@capacitor/preferences'
import { Device } from '@capacitor/device'
import { Filesystem, Directory } from '@capacitor/filesystem'
import CryptoJS from 'crypto-js'

export interface SecurityConfig {
  useBiometric: boolean
  pinHash: string
  salt: string
  dbKey: string
}

export class SecurityService {
  private static instance: SecurityService
  private config: SecurityConfig | null = null
  private isAuthenticated = false
  private sessionTimeout: number = 5 * 60 * 1000 // 5 minutes
  private lastActivity: number = 0

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  // Générer une clé de chiffrement aléatoire
  private generateRandomKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }

  // Générer un salt aléatoire
  private generateSalt(): string {
    return CryptoJS.lib.WordArray.random(16).toString()
  }

  // Hasher un PIN avec PBKDF2
  private hashPin(pin: string, salt: string): string {
    return CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString()
  }

  // Vérifier si la biométrie est disponible
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const info = await Device.getInfo()
      // Vérification basique - en production, utiliser BiometricPrompt
      return info.platform === 'android' && parseInt(info.osVersion) >= 23
    } catch {
      return false
    }
  }

  // Initialiser la configuration de sécurité
  async initialize(): Promise<void> {
    try {
      const stored = await Preferences.get({ key: 'security_config' })
      if (stored.value) {
        this.config = JSON.parse(stored.value)
      } else {
        // Première initialisation
        this.config = {
          useBiometric: false,
          pinHash: '',
          salt: this.generateSalt(),
          dbKey: this.generateRandomKey()
        }
        await this.saveConfig()
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la sécurité:', error)
      throw error
    }
  }

  // Sauvegarder la configuration
  private async saveConfig(): Promise<void> {
    if (this.config) {
      await Preferences.set({
        key: 'security_config',
        value: JSON.stringify(this.config)
      })
    }
  }

  // Définir un PIN
  async setPin(pin: string): Promise<void> {
    if (!this.config) throw new Error('Configuration non initialisée')
    
    this.config.pinHash = this.hashPin(pin, this.config.salt)
    await this.saveConfig()
  }

  // Vérifier un PIN
  async verifyPin(pin: string): Promise<boolean> {
    if (!this.config) throw new Error('Configuration non initialisée')
    
    const hash = this.hashPin(pin, this.config.salt)
    const isValid = hash === this.config.pinHash
    
    if (isValid) {
      this.authenticate()
    }
    
    return isValid
  }

  // Authentifier l'utilisateur
  private authenticate(): void {
    this.isAuthenticated = true
    this.lastActivity = Date.now()
  }

  // Vérifier si l'utilisateur est authentifié
  isUserAuthenticated(): boolean {
    if (!this.isAuthenticated) return false
    
    const now = Date.now()
    if (now - this.lastActivity > this.sessionTimeout) {
      this.isAuthenticated = false
      return false
    }
    
    this.lastActivity = now
    return true
  }

  // Déconnecter l'utilisateur
  logout(): void {
    this.isAuthenticated = false
    this.lastActivity = 0
  }

  // Obtenir la clé de chiffrement de la base de données
  getDatabaseKey(): string {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Utilisateur non authentifié')
    }
    return this.config.dbKey
  }

  // Chiffrer des données
  encryptData(data: string, key?: string): string {
    const encryptionKey = key || this.getDatabaseKey()
    return CryptoJS.AES.encrypt(data, encryptionKey).toString()
  }

  // Déchiffrer des données
  decryptData(encryptedData: string, key?: string): string {
    const encryptionKey = key || this.getDatabaseKey()
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  // Exporter des données chiffrées
  async exportData(data: any, exportPassword: string): Promise<string> {
    const jsonData = JSON.stringify(data)
    const exportKey = CryptoJS.PBKDF2(exportPassword, this.generateSalt(), {
      keySize: 256 / 32,
      iterations: 10000
    }).toString()
    
    const encrypted = this.encryptData(jsonData, exportKey)
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: encrypted
    }
    
    return JSON.stringify(exportData)
  }

  // Importer des données chiffrées
  async importData(encryptedData: string, exportPassword: string): Promise<any> {
    try {
      const exportObj = JSON.parse(encryptedData)
      const exportKey = CryptoJS.PBKDF2(exportPassword, this.generateSalt(), {
        keySize: 256 / 32,
        iterations: 10000
      }).toString()
      
      const decrypted = this.decryptData(exportObj.data, exportKey)
      return JSON.parse(decrypted)
    } catch (error) {
      throw new Error('Mot de passe d\'export incorrect ou données corrompues')
    }
  }

  // Sauvegarder un fichier d'export
  async saveExportFile(data: string, filename: string): Promise<void> {
    await Filesystem.writeFile({
      path: filename,
      data: data,
      directory: Directory.Documents,
      recursive: true
    })
  }

  // Charger un fichier d'import
  async loadImportFile(filename: string): Promise<string> {
    const result = await Filesystem.readFile({
      path: filename,
      directory: Directory.Documents
    })
    return result.data
  }
}

export default SecurityService.getInstance()

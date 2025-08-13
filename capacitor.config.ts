import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.budget.app',
  appName: 'BudgetApp',
  webDir: process.env.WEB_DIR ?? 'dist', // par défaut 'dist' (Vite)
  bundledWebRuntime: false,
};

export default config;

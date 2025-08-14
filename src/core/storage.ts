export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

const isCapacitor = () => !!(window as any).Capacitor;

export const Storage: StorageAdapter = isCapacitor()
  ? (() => {
      const { Preferences } = require('@capacitor/preferences');
      return {
        async get(key) { return (await Preferences.get({ key })).value ?? null; },
        async set(key, value) { await Preferences.set({ key, value }); },
        async remove(key) { await Preferences.remove({ key }); },
        async clear() { await Preferences.clear(); },
      };
    })()
  : {
      async get(k) { return localStorage.getItem(k); },
      async set(k, v) { localStorage.setItem(k, v); },
      async remove(k) { localStorage.removeItem(k); },
      async clear() { localStorage.clear(); },
    };

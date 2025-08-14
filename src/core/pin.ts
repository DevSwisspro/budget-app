import { Storage } from './storage';

const KEY_HASH = 'pinHash';
const KEY_SALT = 'pinSalt';

async function sha256(data: Uint8Array) {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function textToBytes(t: string) { return new TextEncoder().encode(t); }
function randomSalt(len = 16) {
  const a = new Uint8Array(len); crypto.getRandomValues(a);
  return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hasPin(): Promise<boolean> {
  const h = await Storage.get(KEY_HASH);
  return !!(h && h !== 'null' && h !== 'undefined');
}

export async function setPin(pin: string) {
  const salt = randomSalt();
  const hash = await sha256(textToBytes(pin + ':' + salt));
  await Storage.set(KEY_SALT, salt);
  await Storage.set(KEY_HASH, hash);
}

export async function verifyPin(pin: string) {
  const salt = (await Storage.get(KEY_SALT)) || '';
  const stored = await Storage.get(KEY_HASH);
  if (!stored || !salt) return false;
  const hash = await sha256(textToBytes(pin + ':' + salt));
  return hash === stored;
}

export async function resetAll() { 
  await Storage.clear(); 
  location.reload(); 
}

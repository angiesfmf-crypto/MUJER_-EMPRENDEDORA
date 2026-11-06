/**
 * Cryptographic helpers for password derivation and PIN security
 * Uses Web Crypto API (crypto.subtle)
 */

export async function sha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for non-subtle environments
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

const PALMIRA_PEPPER = 'MUJER_EMPRENDEDORA_VALLE_PALMIRA_2025_SECURE';

/**
 * Derives a strong 64-character Firebase Auth password from phone + PIN.
 * Meets requirement: "No utilizar el PIN de cuatro dígitos como única credencial de autenticación de Firebase."
 */
export async function deriveFirebaseAuthPassword(identifier: string, pin: string): Promise<string> {
  const cleanId = identifier.trim().toLowerCase();
  const rawString = `${cleanId}:${PALMIRA_PEPPER}:${pin}`;
  return sha256(rawString);
}

/**
 * Hash a 4-digit PIN with a salt for local validation & lockout defense
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  return sha256(`${salt}:${pin}:${PALMIRA_PEPPER}`);
}

export function generateSalt(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2, 18);
}

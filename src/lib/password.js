import * as argon2 from '@node-rs/argon2';
import { logger, authLogger } from './logger.js';

// Argon2 configuration (OWASP recommended)
const argon2Config = {
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536'), // 64 MB
  timeCost: parseInt(process.env.ARGON2_TIME_COST || '3'),
  parallelism: parseInt(process.env.ARGON2_PARALLELISM || '4'),
  algorithm: argon2.Algorithm.Argon2id,
  version: argon2.Version.V0x13,
};

/**
 * Hash password using Argon2id
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password, argon2Config);
    authLogger.debug({ userId: 'unknown' }, 'Password hashed successfully');
    return hash;
  } catch (error) {
    authLogger.error({ error: error.message }, 'Failed to hash password');
    throw new Error('Password hashing failed');
  }
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash) {
    authLogger.warn('Password or hash is missing');
    return false;
  }

  try {
    const isValid = await argon2.verify(hash, password);
    if (isValid) {
      authLogger.debug('Password verification successful');
    } else {
      authLogger.warn('Password verification failed');
    }
    return isValid;
  } catch (error) {
    authLogger.error({ error: error.message }, 'Password verification error');
    return false;
  }
}

/**
 * Check if password needs rehash (for algorithm upgrades)
 * @param {string} hash - Current hash
 * @returns {Promise<boolean>} - True if rehash needed
 */
export async function needsRehash(hash) {
  try {
    const result = await argon2.verify(hash, 'test-password-for-check');
    return !result;
  } catch {
    return true;
  }
}

/**
 * Validate password strength (OWASP guidelines)
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with strength score
 */
export function validatePasswordStrength(password) {
  const errors = [];
  let strength = 0;

  // Length check (min 12 characters recommended)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  } else {
    strength += 25;
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Character variety
  if (/[A-Z]/.test(password)) {
    strength += 15;
  } else {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    strength += 15;
  } else {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    strength += 15;
  } else {
    errors.push('Password must contain at least one number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 15;
  } else {
    errors.push('Password must contain at least one special character');
  }

  // No repeated characters (3+ times)
  if (!/(.)\1{2,}/.test(password)) {
    strength += 15;
  }

  // Common password check (basic list)
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'login',
  ];

  if (!commonPasswords.some(common => password.toLowerCase().includes(common))) {
    strength += 10;
  } else {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: Math.min(strength, 100),
    strengthLabel: getStrengthLabel(strength),
  };
}

function getStrengthLabel(score) {
  if (score >= 90) return 'very_strong';
  if (score >= 70) return 'strong';
  if (score >= 50) return 'moderate';
  if (score >= 30) return 'weak';
  return 'very_weak';
}

/**
 * Check password against HaveIBeenPwned API (optional)
 * @param {string} password - Password to check
 * @returns {Promise<{isPwned: boolean, count: number}>}
 */
export async function checkPasswordBreach(password) {
  try {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(password));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    const lines = data.split('\n');
    for (const line of lines) {
      const [hashSuffix, count] = line.trim().split(':');
      if (hashSuffix === suffix) {
        authLogger.warn({ count }, 'Password found in breach database');
        return { isPwned: true, count: parseInt(count) };
      }
    }

    authLogger.debug('Password not found in breach database');
    return { isPwned: false, count: 0 };
  } catch (error) {
    authLogger.error({ error: error.message }, 'Failed to check password breach');
    return { isPwned: false, count: 0, error: error.message };
  }
}

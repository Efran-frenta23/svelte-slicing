import { query } from '$lib/db.js';
import { hashPassword, verifyPassword, validatePasswordStrength, checkPasswordBreach } from '$lib/password.js';
import { sessionStore, rateLimitStore } from '$lib/redis.js';
import { authLogger, auditLogger } from '$lib/logger.js';
import { randomUUID } from 'crypto';

// Session configuration
const SESSION_TTL = parseInt(process.env.SESSION_MAX_AGE || '604800000'); // 7 days in ms
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'autopulse-session';

/**
 * Create new session in Redis
 */
export function createSession(userId, userData, ipAddress, userAgent) {
  const sessionId = randomUUID();
  const session = {
    id: sessionId,
    user_id: userId,
    user: {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      workshop: userData.workshop,
      status: userData.status,
    },
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + SESSION_TTL).toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  };

  sessionStore.set(sessionId, session, SESSION_TTL / 1000);
  
  auditLogger.info({
    event: 'SESSION_CREATED',
    userId,
    sessionId,
    ipAddress,
  }, 'New session created');

  return session;
}

/**
 * Get session from Redis
 */
export function getSession(sessionId) {
  if (!sessionId) return null;
  
  return sessionStore.get(sessionId);
}

/**
 * Remove session from Redis
 */
export function removeSession(sessionId) {
  const removed = sessionStore.delete(sessionId);
  
  if (removed) {
    auditLogger.info({ sessionId }, 'Session removed');
  }
  
  return removed;
}

/**
 * Extend session TTL
 */
export async function touchSession(sessionId) {
  return sessionStore.touch(sessionId, SESSION_TTL / 1000);
}

/**
 * Check if user can have admin role (database-driven)
 */
export async function canHaveAdminRole(email) {
  try {
    const result = await query(
      'SELECT role FROM profiles WHERE email = $1 AND role IN ($2, $3)',
      [email, 'Admin', 'Super Admin']
    );
    return result.rows.length > 0;
  } catch (error) {
    authLogger.error({ error: error.message, email }, 'Error checking admin role');
    return false;
  }
}

/**
 * Get effective role based on database
 * Super Admin is restricted to efran@dalang.io only
 */
export async function getEffectiveRole(email, requestedRole) {
  // Super Admin is ONLY for efran@dalang.io
  if (requestedRole === 'Super Admin' && email !== 'efran@dalang.io') {
    authLogger.warn({ email, requestedRole }, 'Non-authorized user attempted Super Admin role');
    // If they're an existing admin, keep Admin; otherwise Member
    const isAdminAllowed = await canHaveAdminRole(email);
    return isAdminAllowed ? 'Admin' : 'Member';
  }

  const isAdminAllowed = await canHaveAdminRole(email);
  
  if (!isAdminAllowed && (requestedRole === 'Admin' || requestedRole === 'Super Admin')) {
    authLogger.warn({ email, requestedRole }, 'User attempted to escalate to admin role');
    return 'Member';
  }
  
  return requestedRole;
}


/**
 * Create user with profile and audit logging
 */
export async function createUser({ email, password, name, role, workshop = null, status = 'Active', ipAddress }) {
  const client = await (await import('$lib/db.js')).pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    // Check for password breach (optional, non-blocking)
    const breachCheck = await checkPasswordBreach(password);
    if (breachCheck.isPwned) {
      authLogger.warn({ email, breachCount: breachCheck.count }, 'User registered with breached password');
      // Don't block registration, but log it
    }
    
    // Hash password with Argon2id
    const passwordHash = await hashPassword(password);
    
    // Get effective role from database
    const effectiveRole = await getEffectiveRole(email, role);
    
    // Insert into users table
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash) 
       VALUES ($1, $2) 
       RETURNING id`,
      [email, passwordHash]
    );
    
    const userId = userResult.rows[0].id;
    
    // Insert into profiles table
    const profileResult = await client.query(
      `INSERT INTO profiles (user_id, name, role, email, workshop, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, name, effectiveRole, email, effectiveRole === 'Member' ? null : workshop, effectiveRole === 'Member' ? 'Active' : status]
    );
    
    // If admin role, also insert into admins table
    if (effectiveRole === 'Admin' || effectiveRole === 'Super Admin') {
      await client.query(
        `INSERT INTO admins (name, email, role, workshop, status) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET role = $3, workshop = $4, status = $5`,
        [name, email, effectiveRole, workshop, status]
      );
    }
    
    // Audit log
    await client.query(
      `INSERT INTO audit_log (user_id, action, details, ip_address) 
       VALUES ($1, $2, $3, $4)`,
      [userId, 'USER_CREATED', `User ${email} created with role ${effectiveRole}`, ipAddress || 'unknown']
    );
    
    await client.query('COMMIT');
    
    auditLogger.info({
      event: 'USER_REGISTERED',
      userId,
      email,
      role: effectiveRole,
      ipAddress,
    }, 'New user registered');
    
    return {
      user: {
        id: userId,
        email,
        ...profileResult.rows[0]
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');
    authLogger.error({ error: error.message, email }, 'User creation failed');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Authenticate user with rate limiting
 */
export async function authenticateUser(email, password, ipAddress) {
  // Rate limiting check
  const rateLimitKey = `login:${ipAddress || 'unknown'}`;
  const rateLimit = await rateLimitStore.increment(rateLimitKey, 900000); // 15 minutes
  
  if (rateLimit && rateLimit.count > 5) {
    authLogger.warn({ email, ipAddress, attemptCount: rateLimit.count }, 'Login rate limit exceeded');
    auditLogger.warn({
      event: 'LOGIN_RATE_LIMIT_EXCEEDED',
      email,
      ipAddress,
      attemptCount: rateLimit.count,
    }, 'Login rate limit exceeded');
    
    throw new Error('Too many login attempts. Please try again later.');
  }
  
  try {
    const result = await query(
      `SELECT u.id, u.email, u.password_hash, p.name, p.role, p.workshop, p.status
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      authLogger.warn({ email, ipAddress }, 'Login failed - user not found');
      return { error: 'Invalid email or password' };
    }
    
    const user = result.rows[0];
    
    // Check if password_hash exists
    if (!user.password_hash) {
      authLogger.warn({ email, ipAddress }, 'Login failed - no password hash');
      return { error: 'Invalid email or password' };
    }
    
    // Verify password with Argon2id
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      authLogger.warn({ email, ipAddress }, 'Login failed - invalid password');
      return { error: 'Invalid email or password' };
    }
    
    // Remove password hash from returned user object
    const { password_hash, ...userWithoutPassword } = user;
    
    auditLogger.info({
      event: 'USER_LOGGED_IN',
      userId: user.id,
      email,
      ipAddress,
    }, 'User logged in successfully');
    
    return { user: userWithoutPassword };
  } catch (error) {
    authLogger.error({ error: error.message, email }, 'Authentication error');
    return { error: 'Authentication failed' };
  }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if user is admin
 */
export function isAdmin(role) {
  return role === 'Admin' || role === 'Super Admin';
}

/**
 * Get all users with roles
 */
export async function getAllUsersWithRoles() {
  try {
    const result = await query(
      `SELECT u.id, u.email, p.name, p.role, p.workshop, p.status, p.created_at
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY p.name ASC`
    );
    return result.rows;
  } catch (error) {
    authLogger.error({ error: error.message }, 'Error fetching users');
    return [];
  }
}

/**
 * Change user role (only for super admin)
 */
export async function changeUserRole(targetUserId, newRole, changedByUserId, ipAddress) {
  const client = await (await import('$lib/db.js')).pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Verify changedBy is super admin
    const superAdminCheck = await client.query(
      `SELECT p.role FROM profiles p WHERE p.user_id = $1`,
      [changedByUserId]
    );
    
    if (superAdminCheck.rows.length === 0 || superAdminCheck.rows[0].role !== 'Super Admin') {
      auditLogger.warn({
        event: 'UNAUTHORIZED_ROLE_CHANGE_ATTEMPT',
        changedByUserId,
        targetUserId,
        newRole,
        ipAddress,
      }, 'Unauthorized role change attempt');
      
      throw new Error('Only Super Admin can change user roles');
    }
    
    // Cannot change Super Admin role
    if (newRole === 'Super Admin') {
      throw new Error('Cannot assign Super Admin role via API');
    }
    
    // Update role
    const result = await client.query(
      `UPDATE profiles SET role = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *`,
      [newRole, targetUserId]
    );
    
    // Audit log
    await client.query(
      `INSERT INTO audit_log (user_id, action, details, ip_address) 
       VALUES ($1, $2, $3, $4)`,
      [changedByUserId, 'ROLE_CHANGED', `Changed role to ${newRole} for user ${targetUserId}`, ipAddress || 'unknown']
    );
    
    await client.query('COMMIT');
    
    auditLogger.info({
      event: 'ROLE_CHANGED',
      changedByUserId,
      targetUserId,
      newRole,
      ipAddress,
    }, 'User role changed');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    authLogger.error({ error: error.message, targetUserId, newRole }, 'Error changing user role');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get session statistics
 */
export async function getSessionStats() {
  try {
    const { checkRedisHealth } = await import('$lib/redis.js');
    const redisHealth = await checkRedisHealth();
    
    return {
      activeSessions: 'Redis-based',
      redis: redisHealth,
      sessionTTL: SESSION_TTL,
    };
  } catch (error) {
    return {
      activeSessions: 'unknown',
      error: error.message,
    };
  }
}

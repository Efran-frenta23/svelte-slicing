import bcrypt from 'bcryptjs';
import { query } from '$lib/db';

// Admin emails that can have admin roles
const ADMIN_EMAILS = ['efran@dalang.io', 'efransigma@gmail.com'];

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Check if email can have admin role
export function canHaveAdminRole(email) {
  return ADMIN_EMAILS.includes(email);
}

// Get effective role based on email
export function getEffectiveRole(email, requestedRole) {
  if (!canHaveAdminRole(email)) {
    return 'Member';
  }
  return requestedRole;
}

// Create user with profile
export async function createUser({ email, password, name, role, workshop = null, status = 'Active' }) {
  const client = await (await import('$lib/db')).pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Get effective role (only admin emails can have admin roles)
    const effectiveRole = getEffectiveRole(email, role);
    
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
         VALUES ($1, $2, $3, $4, $5)`,
        [name, email, effectiveRole, workshop, status]
      );
    }
    
    await client.query('COMMIT');
    
    return {
      user: {
        id: userId,
        email,
        ...profileResult.rows[0]
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Authenticate user
export async function authenticateUser(email, password) {
  try {
    const result = await query(
      `SELECT u.id, u.email, p.name, p.role, p.workshop, p.status
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return { error: 'Invalid email or password' };
    }
    
    const user = result.rows[0];
    
    // Check if password_hash exists
    if (!user.password_hash) {
      return { error: 'Invalid email or password' };
    }
    
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      return { error: 'Invalid email or password' };
    }
    
    // Remove password hash from returned user object
    const { password_hash, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed: ' + error.message };
  }
}

// Get user by ID
export async function getUserById(userId) {
  const result = await query(
    `SELECT u.id, u.email, p.name, p.role, p.workshop, p.status
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );
  
  return result.rows[0] || null;
}

// Get user by email
export async function getUserByEmail(email) {
  const result = await query(
    `SELECT u.id, u.email, p.name, p.role, p.workshop, p.status
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.email = $1`,
    [email]
  );
  
  return result.rows[0] || null;
}

// Session management (simple in-memory for now, consider Redis for production)
const sessions = new Map();

export function createSession(userId, userData) {
  const sessionId = crypto.randomUUID();
  const session = {
    id: sessionId,
    user_id: userId,
    user: userData,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  // Check if expired
  if (new Date(session.expires_at) < new Date()) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

export function removeSession(sessionId) {
  sessions.delete(sessionId);
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if user is admin
export function isAdmin(role) {
  return role === 'Admin' || role === 'Super Admin';
}

// Check if user can manage roles (only specific admin emails)
export function canManageRoles(email) {
  return ADMIN_EMAILS.includes(email);
}

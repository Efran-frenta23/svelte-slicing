import { Pool } from 'pg';
import { validateTable, validateColumn, allowedTables } from '$lib/validators';

// Database configuration from environment variables
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433'),
  user: process.env.DATABASE_USER || 'efran123',
  password: process.env.DATABASE_PASSWORD || 'abilahab',
  database: process.env.DATABASE_NAME || 'autopulse',
  max: parseInt(process.env.DATABASE_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '2000'),
});

// Test database connection
pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

// Helper function to execute queries with logging
export async function query(text, params) {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Query executed', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('[DB] Query error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to get many rows - SQL Injection Protected
export async function fetchAll(table, columns = '*', options = {}) {
  // Validate table name
  if (!validateTable(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const { orderBy = 'id', order = 'ASC', limit, offset, where } = options;

  // Validate order by column
  if (!validateColumn(table, orderBy)) {
    throw new Error(`Invalid order by column: ${orderBy}`);
  }

  // Validate columns
  if (columns !== '*') {
    const columnList = columns.split(',').map(c => c.trim());
    for (const col of columnList) {
      if (!validateColumn(table, col)) {
        throw new Error(`Invalid column: ${col}`);
      }
    }
  }

  let sql = `SELECT ${columns} FROM "${table}"`;
  const params = [];

  if (where) {
    const conditions = [];
    let paramIndex = 1;
    for (const [key, value] of Object.entries(where)) {
      // Validate where column
      if (!validateColumn(table, key)) {
        throw new Error(`Invalid where column: ${key}`);
      }
      conditions.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Order is safe because we validated it above
  sql += ` ORDER BY "${orderBy}" ${order.toUpperCase()}`;

  if (limit !== undefined) {
    sql += ` LIMIT ${parseInt(limit)}`;
  }

  if (offset !== undefined) {
    sql += ` OFFSET ${parseInt(offset)}`;
  }

  const result = await query(sql, params);
  return result.rows;
}

// Helper function to get one row by ID
export async function fetchOne(table, id, columns = '*') {
  if (!validateTable(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const result = await query(`SELECT ${columns} FROM "${table}" WHERE id = $1`, [parseInt(id)]);
  return result.rows[0] || null;
}

// Helper function to insert - SQL Injection Protected
export async function insert(table, data) {
  if (!validateTable(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const keys = [];
  const values = [];
  const placeholders = [];

  for (const [key, value] of Object.entries(data)) {
    if (!validateColumn(table, key)) {
      throw new Error(`Invalid column for insert: ${key}`);
    }
    keys.push(`"${key}"`);
    values.push(value);
    placeholders.push(`$${placeholders.length + 1}`);
  }

  const sql = `INSERT INTO "${table}" (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
  const result = await query(sql, values);
  return result.rows[0];
}

// Helper function to update - SQL Injection Protected
export async function update(table, id, data) {
  if (!validateTable(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const keys = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (!validateColumn(table, key)) {
      throw new Error(`Invalid column for update: ${key}`);
    }
    keys.push(`"${key}" = $${values.length + 1}`);
    values.push(value);
  }

  const sql = `UPDATE "${table}" SET ${keys.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  const result = await query(sql, [...values, parseInt(id)]);
  return result.rows[0];
}

// Helper function to delete
export async function remove(table, id) {
  if (!validateTable(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const result = await query(`DELETE FROM "${table}" WHERE id = $1 RETURNING *`, [parseInt(id)]);
  return result.rows[0];
}

// Health check function
export async function checkHealth() {
  try {
    const result = await query('SELECT NOW() as now, version() as version');
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now,
      version: result.rows[0].version
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    };
  }
}

// Get pool stats
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
}

// Export the pool for direct access if needed
export { pool };

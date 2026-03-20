import { Pool } from 'pg';

// Database configuration from environment variables
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433'),
  user: process.env.DATABASE_USER || 'efran123',
  password: process.env.DATABASE_PASSWORD || 'abilahab',
  database: process.env.DATABASE_NAME || 'autopulse',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to execute queries
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Helper function to get many rows
export async function fetchAll(table, columns = '*', options = {}) {
  const { orderBy = 'id', order = 'ASC', limit, offset, where } = options;
  
  let sql = `SELECT ${columns} FROM ${table}`;
  const params = [];
  
  if (where) {
    const conditions = [];
    let paramIndex = 1;
    for (const [key, value] of Object.entries(where)) {
      conditions.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  sql += ` ORDER BY ${orderBy} ${order}`;
  
  if (limit !== undefined) {
    sql += ` LIMIT ${limit}`;
  }
  
  if (offset !== undefined) {
    sql += ` OFFSET ${offset}`;
  }
  
  const result = await query(sql, params);
  return result.rows;
}

// Helper function to get one row by ID
export async function fetchOne(table, id, columns = '*') {
  const result = await query(`SELECT ${columns} FROM ${table} WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

// Helper function to insert
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const result = await query(sql, values);
  return result.rows[0];
}

// Helper function to update
export async function update(table, id, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
  const result = await query(sql, [...values, id]);
  return result.rows[0];
}

// Helper function to delete
export async function remove(table, id) {
  const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

// Export the pool for direct access if needed
export { pool };

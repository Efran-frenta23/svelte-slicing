import { query } from '$lib/db';
import { json } from '@sveltejs/kit';

const SUPER_ADMIN_EMAIL = 'efran@dalang.io';

export async function GET() {
  try {
    const result = await query(
      `SELECT u.id, u.email, p.name, p.role, p.workshop, p.status 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       ORDER BY p.name ASC`
    );
    return json(result.rows);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  try {
    const { userId, newRole } = await request.json();
    
    // Check if current user is super admin (efran@dalang.io)
    const currentUserEmail = locals.user?.email;
    if (currentUserEmail !== SUPER_ADMIN_EMAIL) {
      return json({ error: 'Only efran@dalang.io can change roles' }, { status: 403 });
    }
    
    // Cannot change role of super admin
    if (newRole === 'Super Admin') {
      return json({ error: 'Cannot assign Super Admin role' }, { status: 403 });
    }
    
    // Update role in profiles table
    const updateResult = await query(
      `UPDATE profiles SET role = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *`,
      [newRole, userId]
    );
    
    // If changing to Admin, also add to admins table
    if (newRole === 'Admin') {
      const userResult = await query(
        `SELECT u.email, p.name FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = $1`,
        [userId]
      );
      const userData = userResult.rows[0];
      
      await query(
        `INSERT INTO admins (name, email, role, workshop, status) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET role = $3, workshop = $4, status = $5`,
        [userData.name, userData.email, 'Admin', 'Jakarta Branch', 'Active']
      );
    }
    
    return json({ success: true, user: updateResult.rows[0] });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

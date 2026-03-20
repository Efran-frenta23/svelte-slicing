import { fetchAll } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  // Check if user has admin role
  if (!['Admin', 'Super Admin'].includes(locals.user?.role || '')) {
    throw error(403, 'Access denied: You must be an Admin or Super Admin to view this page.');
  }

  const admins = await fetchAll('admins', '*', { orderBy: 'id', order: 'ASC' });

  return {
    admins: admins || [],
    userRole: locals.user?.role
  };
}

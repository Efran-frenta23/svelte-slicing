import { fetchAll } from '$lib/db';

export async function load({ locals }) {
  const workshops = await fetchAll('workshops', '*', { orderBy: 'id', order: 'ASC' });
  
  return {
    workshops,
    userRole: locals.user?.role || 'Member'
  };
}

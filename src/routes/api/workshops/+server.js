import { fetchAll, insert } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const workshops = await fetchAll('workshops', '*', { orderBy: 'id', order: 'ASC' });
    return json(workshops);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  try {
    // Only Admin and Super Admin can create workshops
    const user = locals.user;
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) {
      return json({ error: 'Only Admin or Super Admin can add workshops' }, { status: 403 });
    }

    const data = await request.json();
    const workshop = await insert('workshops', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return json(workshop, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

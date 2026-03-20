import { fetchAll, insert, update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const captains = await fetchAll('captains', 'id, name, employee_id, phone, workshop', { orderBy: 'id', order: 'ASC' });
    return json(captains);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const captain = await insert('captains', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return json(captain, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

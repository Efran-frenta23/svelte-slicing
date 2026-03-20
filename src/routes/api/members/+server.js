import { fetchAll } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const members = await fetchAll('members', 'id, name, email, phone, workshop, status', { orderBy: 'name', order: 'ASC' });
    return json(members);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

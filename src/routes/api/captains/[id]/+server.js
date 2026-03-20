import { update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();
    const captain = await update('captains', id, {
      ...data,
      updated_at: new Date().toISOString()
    });
    return json(captain);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    await remove('captains', id);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

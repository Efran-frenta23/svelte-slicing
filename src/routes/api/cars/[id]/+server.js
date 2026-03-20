import { update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();
    const car = await update('cars', id, {
      ...data,
      updated_at: new Date().toISOString()
    });
    return json(car);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    await remove('cars', id);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

import { update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const data = await request.json();
    const finance = await update('finance', id, {
      ...data,
      amount: parseFloat(data.amount) || 0,
      updated_at: new Date().toISOString()
    });
    return json(finance);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    await remove('finance', id);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

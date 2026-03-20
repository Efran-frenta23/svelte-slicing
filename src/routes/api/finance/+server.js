import { fetchAll, insert, update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const finances = await fetchAll('finance', '*', { orderBy: 'transaction_date', order: 'DESC' });
    return json(finances);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const finance = await insert('finance', {
      ...data,
      amount: parseFloat(data.amount) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return json(finance, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

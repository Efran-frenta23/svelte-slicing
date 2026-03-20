import { fetchAll, insert, update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const brands = await fetchAll('brands', 'id, brand_name, country, models', { orderBy: 'id', order: 'ASC' });
    return json(brands);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const brand = await insert('brands', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return json(brand, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

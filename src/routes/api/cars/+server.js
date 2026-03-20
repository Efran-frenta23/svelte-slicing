import { fetchAll, insert, update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const cars = await fetchAll('cars', 'id, brand, model, license_plate, vin, owner', { orderBy: 'id', order: 'ASC' });
    return json(cars);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const car = await insert('cars', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return json(car, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

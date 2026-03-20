import { insert, fetchAll } from '$lib/db';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { service_type, sparepart_name, sparepart_brand } = await request.json();

    try {
        await insert('spareparts', { 
            service_type, 
            sparepart_name, 
            sparepart_brand,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        return json({ success: true }, { status: 201 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const spareparts = await fetchAll('spareparts', '*', { orderBy: 'id', order: 'ASC' });
        return json(spareparts);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

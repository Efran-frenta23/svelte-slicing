import { update, remove } from '$lib/db';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
    const { id } = params;
    const { service_type, sparepart_name, sparepart_brand } = await request.json();

    try {
        await update('spareparts', id, { 
            service_type, 
            sparepart_name, 
            sparepart_brand,
            updated_at: new Date().toISOString()
        });

        return json({ success: true }, { status: 200 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    const { id } = params;

    try {
        await remove('spareparts', id);
        return json({ success: true }, { status: 200 });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

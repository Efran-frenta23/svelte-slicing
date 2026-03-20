import { fetchAll } from '$lib/db';

export async function load() {
    const itemsPerPage = 10;

    try {
        const captains = await fetchAll(
            'captains',
            'id, name, employee_id, phone, workshop',
            { orderBy: 'id', order: 'ASC', limit: itemsPerPage, offset: 0 }
        );

        return {
            captains: captains || [],
            itemsPerPage
        };
    } catch (err) {
        console.error('Load function error:', err);
        return {
            status: 500,
            error: 'Failed to load captains: ' + err.message
        };
    }
}

import { fetchAll } from '$lib/db';

export async function load() {
    const itemsPerPage = 10;

    try {
        const cars = await fetchAll(
            'cars',
            'id, brand, model, license_plate, vin, owner',
            { orderBy: 'id', order: 'ASC', limit: itemsPerPage, offset: 0 }
        );

        return {
            cars: cars || [],
            itemsPerPage
        };
    } catch (err) {
        console.error('Load function error:', err);
        return {
            status: 500,
            error: 'Failed to load cars: ' + err.message
        };
    }
}

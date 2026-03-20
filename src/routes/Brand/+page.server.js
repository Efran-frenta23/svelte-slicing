import { fetchAll } from '$lib/db';

export async function load() {
    const itemsPerPage = 10;

    try {
        const brands = await fetchAll(
            'brands',
            'id, brand_name, country, models',
            { orderBy: 'id', order: 'ASC', limit: itemsPerPage, offset: 0 }
        );

        return {
            brands: brands || [],
            itemsPerPage
        };
    } catch (err) {
        console.error('Load function error:', err);
        return {
            status: 500,
            error: 'Failed to load brands: ' + err.message
        };
    }
}

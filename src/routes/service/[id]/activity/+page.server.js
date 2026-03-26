import { query } from '$lib/db';

export async function load({ params }) {
  try {
    const serviceId = params.id;

    // Fetch service activities for this specific service
    let serviceActivities = [];
    try {
      const result = await query(
        'SELECT * FROM service_activities WHERE service_id = $1 ORDER BY created_at DESC',
        [serviceId]
      );
      serviceActivities = result.rows || [];
    } catch (err) {
      console.warn('service_activities table not found or empty:', err.message);
    }

    // Fetch branches/workshops
    let branches = [];
    try {
      const result = await query('SELECT * FROM workshop ORDER BY workshop_name ASC');
      branches = result.rows || [];
    } catch (err) {
      console.warn('workshop table not found or empty:', err.message);
    }

    // Fetch captains
    let captains = [];
    try {
      const result = await query('SELECT * FROM captains ORDER BY name ASC');
      captains = result.rows || [];
    } catch (err) {
      console.warn('captains table not found or empty:', err.message);
    }

    // Fetch service details
    let serviceInfo = null;
    try {
      const result = await query('SELECT * FROM services WHERE id = $1', [serviceId]);
      if (result.rows.length > 0) {
        serviceInfo = result.rows[0];
      }
    } catch (err) {
      console.warn('services table not found or service not found:', err.message);
    }

    return {
      serviceId,
      serviceActivities,
      branches,
      captains,
      serviceInfo
    };
  } catch (error) {
    console.error('Error loading service activity data:', error);
    return {
      serviceId: params.id,
      serviceActivities: [],
      branches: [],
      captains: [],
      serviceInfo: null
    };
  }
}

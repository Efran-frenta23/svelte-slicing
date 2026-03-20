import { query } from '$lib/db';

export async function load() {
  try {
    // Fetch service activities
    let serviceActivities = [];
    try {
      const result = await query('SELECT * FROM service_activities ORDER BY created_at DESC');
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

    return {
      serviceActivities,
      branches,
      captains
    };
  } catch (error) {
    console.error('Error loading Service-activity data:', error);
    return {
      serviceActivities: [],
      branches: [],
      captains: []
    };
  }
}

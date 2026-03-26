import { json } from '@sveltejs/kit';
import { checkHealth, getPoolStats } from '$lib/db';
import { getSessionStats } from '$lib/auth';

export async function GET() {
  const dbHealth = await checkHealth();
  const poolStats = getPoolStats();
  const sessionStats = getSessionStats();
  
  const health = {
    status: dbHealth.status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: dbHealth,
    connection_pool: poolStats,
    sessions: {
      active: sessionStats.activeSessions
    },
    version: {
      node: process.version,
      platform: process.platform
    }
  };
  
  return json(health, {
    status: dbHealth.status === 'healthy' ? 200 : 503
  });
}

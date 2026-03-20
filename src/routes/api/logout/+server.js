import { removeSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
  const sessionId = cookies.get('session');
  
  if (sessionId) {
    removeSession(sessionId);
    cookies.delete('session', { path: '/' });
  }
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

import { getSession } from '$lib/auth';

export async function handle({ event, resolve }) {
  // Get session cookie
  const sessionId = event.cookies.get('session');
  
  if (sessionId) {
    const session = getSession(sessionId);
    if (session) {
      event.locals.session = session;
      event.locals.user = session.user;
    } else {
      // Session expired or invalid, clear cookie
      event.cookies.delete('session', { path: '/' });
    }
  }
  
  const response = await resolve(event);
  return response;
}

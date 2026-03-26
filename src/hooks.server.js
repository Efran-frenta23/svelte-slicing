import { getSession, removeSession } from '$lib/auth';
import { auditLogger } from '$lib/logger';
import { checkRedisHealth } from '$lib/redis';
import { logger } from '$lib/logger';

// CSRF token management
async function generateCsrfToken() {
  const { randomBytes } = await import('crypto');
  return randomBytes(32).toString('hex');
}

export async function handle({ event, resolve }) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  // Clear old Supabase cookies
  const supabaseCookies = [
    'sb-qxdylfidszktvbbyxiey-auth-token.0',
    'sb-qxdylfidszktvbbyxiey-auth-token.1',
    'sb-sfcbffrpowginbtvtjqd-auth-token.0',
    'sb-sfcbffrpowginbtvtjqd-auth-token.1'
  ];
  
  for (const cookieName of supabaseCookies) {
    if (event.cookies.get(cookieName)) {
      event.cookies.delete(cookieName, { path: '/' });
    }
  }
  
  // Get client info
  const ipAddress = event.request.headers.get('x-forwarded-for') || 
                    event.request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = event.request.headers.get('user-agent') || 'unknown';
  
  // Audit logging for all requests
  auditLogger.info({
    event: 'HTTP_REQUEST',
    requestId,
    method: event.request.method,
    path: event.url.pathname,
    ipAddress,
    userAgent,
  });
  
  // Get session from Redis
  const sessionId = event.cookies.get('autopulse-session');
  
  if (sessionId) {
    const session = getSession(sessionId);
    if (session) {
      event.locals.session = session;
      event.locals.user = session.user;
      
      // Touch session to extend TTL
      const { touchSession } = await import('$lib/auth');
      await touchSession(sessionId);
    } else {
      event.cookies.delete('autopulse-session', { path: '/' });
    }
  }
  
  // Generate CSRF token for forms
  const csrfToken = await generateCsrfToken();
  event.locals.csrfToken = csrfToken;
  
  // Add security headers to response
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject CSRF token into HTML for forms
      return html.replace(
        '</head>',
        `<meta name="csrf-token" content="${csrfToken}"></head>`
      );
    }
  });
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Response time header
  const responseTime = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  
  // Log response
  logger.info({
    event: 'HTTP_RESPONSE',
    requestId,
    method: event.request.method,
    path: event.url.pathname,
    status: response.status,
    responseTime,
  });
  
  return response;
}

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.socket.remoteAddress || 
           'unknown';
  }
});

// Rate limiter for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: {
    error: 'Too many requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: {
    error: 'Too many registration attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security headers configuration
export const securityHeaders = [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }),
  helmet.crossOriginEmbedderPolicy(),
  helmet.crossOriginOpenerPolicy(),
  helmet.crossOriginResourcePolicy({ policy: "same-site" }),
  helmet.dnsPrefetchControl({ allow: false }),
  helmet.frameguard({ action: 'deny' }),
  helmet.hidePoweredBy(),
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.originAgentCluster(),
  helmet.permittedCrossDomainPolicies(),
  helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }),
  helmet.xssFilter()
];

// Audit logging middleware
export function auditLogger(event) {
  const timestamp = new Date().toISOString();
  const method = event.request.method;
  const path = event.url.pathname;
  const ip = event.request.headers.get('x-forwarded-for') || 
             event.request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = event.request.headers.get('user-agent') || 'unknown';
  
  console.log(`[AUDIT] ${timestamp} ${method} ${path} IP: ${ip} UA: ${userAgent}`);
}

// Request validation helper
export function validateRequest(schema, data) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    };
  }
}

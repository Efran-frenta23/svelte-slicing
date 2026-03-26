import pino from 'pino';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

// Ensure logs directory exists
const logDir = join(process.cwd(), 'logs');
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Pino logger configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'production' 
    ? undefined 
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      host: bindings.host,
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    pid: process.pid,
    host: process.env.HOSTNAME || 'unknown',
  },
  hooks: {
    logMethod(args, method, level) {
      // Add application name to all logs
      return method.apply(this, [
        {
          app: 'autopulse',
          environment: process.env.NODE_ENV || 'development',
        },
        ...args,
      ]);
    },
  },
});

// Stream to file in production
if (process.env.NODE_ENV === 'production') {
  const stream = pino.destination({
    dest: join(logDir, 'app.log'),
    minLength: 4096,
    sync: false,
  });
  
  const errorStream = pino.destination({
    dest: join(logDir, 'error.log'),
    minLength: 4096,
    sync: false,
  });

  const multi = pino.multistream([
    { stream },
    { level: 'error', stream: errorStream },
  ]);

  // Reassign logger to use multi-stream
  Object.assign(logger, pino(logger, multi));
}

// Audit logger for security events
export const auditLogger = logger.child({
  module: 'audit',
  type: 'security',
});

// Database logger
export const dbLogger = logger.child({
  module: 'database',
});

// Auth logger
export const authLogger = logger.child({
  module: 'auth',
});

// API logger
export const apiLogger = logger.child({
  module: 'api',
});

// Helper functions
export const logLevels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

export function createChildLogger(name, options = {}) {
  return logger.child({
    module: name,
    ...options,
  });
}

// Log application startup
logger.info({
  event: 'APPLICATION_START',
  node_version: process.version,
  platform: process.platform,
  pid: process.pid,
  uptime: process.uptime(),
});

// Log unhandled errors
process.on('uncaughtException', (error) => {
  logger.fatal({
    event: 'UNCAUGHT_EXCEPTION',
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({
    event: 'UNHANDLED_REJECTION',
    reason: reason?.message || reason,
    promise: promise.toString(),
  });
});

// Graceful shutdown logging
process.on('SIGTERM', () => {
  logger.warn({ event: 'SIGTERM_RECEIVED' }, 'Received SIGTERM, shutting down gracefully');
});

process.on('SIGINT', () => {
  logger.warn({ event: 'SIGINT_RECEIVED' }, 'Received SIGINT, shutting down gracefully');
});

import pino from 'pino';

/**
 * Production-grade logger using Pino.
 * Outputs structured JSON to stdout, suitable for enterprise log aggregators.
 */
const transport = process.env.NODE_ENV === 'development' 
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  : undefined;

export const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    service: 'affilify-ai-chatbot'
  },
  transport
});

export const logger = {
  info: (msg: string, obj?: any) => pinoLogger.info(obj, msg),
  warn: (msg: string, obj?: any) => pinoLogger.warn(obj, msg),
  error: (msg: string, obj?: any) => pinoLogger.error(obj, msg),
  debug: (msg: string, obj?: any) => pinoLogger.debug(obj, msg),
};

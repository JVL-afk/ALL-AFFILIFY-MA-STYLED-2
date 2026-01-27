/**
 * Mongoose Connection Manager for AFFILIFY
 * Ensures Mongoose is properly connected to MongoDB before any model operations
 */

import mongoose from 'mongoose';
import { logger } from './debug-logger';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Global variable to store the connection promise
let mongooseConnectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect Mongoose to MongoDB
 * This ensures all models are ready to use
 */
export async function connectMongoose(): Promise<typeof mongoose> {
  // If already connecting, return the existing promise
  if (mongooseConnectionPromise) {
    return mongooseConnectionPromise;
  }

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    logger.debug('MONGOOSE', 'ALREADY_CONNECTED', { readyState: mongoose.connection.readyState });
    return mongoose;
  }

  // Create a new connection promise
  mongooseConnectionPromise = (async () => {
    try {
      logger.info('MONGOOSE', 'CONNECTING_START', { uri: MONGODB_URI?.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@') });

      const connection = await mongoose.connect(MONGODB_URI!, {
        connectTimeoutMS: 100000,
        socketTimeoutMS: 120000,
        serverSelectionTimeoutMS: 300000,
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
        // Disable automatic index creation in production
        autoIndex: process.env.NODE_ENV !== 'production',
      });

      logger.info('MONGOOSE', 'CONNECTED_SUCCESS', {
        readyState: connection.connection.readyState,
        host: connection.connection.host,
        name: connection.connection.name,
      });

      return connection;
    } catch (error: any) {
      logger.error('MONGOOSE', 'CONNECTION_FAILED', { error: error.message }, error);
      mongooseConnectionPromise = null; // Reset for retry
      throw error;
    }
  })();

  return mongooseConnectionPromise;
}

/**
 * Disconnect Mongoose from MongoDB
 */
export async function disconnectMongoose(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      logger.info('MONGOOSE', 'DISCONNECTING', {});
      await mongoose.disconnect();
      logger.info('MONGOOSE', 'DISCONNECTED_SUCCESS', {});
    }
  } catch (error: any) {
    logger.error('MONGOOSE', 'DISCONNECT_ERROR', { error: error.message }, error);
    throw error;
  }
}

/**
 * Get the current Mongoose connection state
 */
export function getMongooseConnectionState(): number {
  return mongoose.connection.readyState;
}

/**
 * Check if Mongoose is connected
 */
export function isMongooseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectMongoose;

import { MongoClient, Db, MongoClientOptions } from 'mongodb'
import { logger } from './debug-logger'

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
console.log('MongoDB URI format:', uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@'));

// Connection options with increased timeouts and retry settings
const options: MongoClientOptions = {
  connectTimeoutMS: 100000,
  socketTimeoutMS: 120000,
  serverSelectionTimeoutMS: 300000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
}

// Global variable for storing the MongoDB client promise
let client: MongoClient
let clientPromise: Promise<MongoClient>

// Create a new MongoClient with detailed logging
const createClient = () => {
  console.log('Creating new MongoDB client...');
  const newClient = new MongoClient(uri, options);
  
  return newClient.connect()
    .then(client => {
      console.log('MongoDB client connected successfully');
      logger.info('MONGODB', 'CLIENT_CONNECTED', { timestamp: new Date().toISOString() });
      return client;
    })
    .catch(err => {
      console.error('Failed to connect MongoDB client:', err);
      logger.error('MONGODB', 'CLIENT_CONNECTION_FAILED', { error: err.message }, err);
      throw err;
    });
};

// Handle client based on environment
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve connection across hot reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Initializing MongoDB client in development mode');
    globalWithMongo._mongoClientPromise = createClient();
  } else {
    console.log('Reusing existing MongoDB client in development mode');
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client for each instance
  console.log('Initializing MongoDB client in production mode');
  clientPromise = createClient();
}

/**
 * Automatically initialize required CRM collections if they don't exist
 */
async function initializeCRMCollections(db: Db): Promise<void> {
  const requiredCollections = ['leads', 'tasks', 'proposals', 'clients'];
  
  try {
    logger.debug('MONGODB', 'CHECKING_CRM_COLLECTIONS', { collections: requiredCollections });
    
    const existingCollections = await db.listCollections().toArray();
    const existingNames = new Set(existingCollections.map(c => c.name));
    
    logger.debug('MONGODB', 'EXISTING_COLLECTIONS', { collections: Array.from(existingNames) });
    
    for (const collectionName of requiredCollections) {
      if (!existingNames.has(collectionName)) {
        logger.info('MONGODB', 'CREATING_COLLECTION', { collectionName });
        
        // Create collection with schema validation
        await db.createCollection(collectionName, {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['userId', 'createdAt'],
              properties: {
                _id: { bsonType: 'objectId' },
                userId: { bsonType: 'objectId', description: 'User ID' },
                createdAt: { bsonType: 'date', description: 'Creation timestamp' },
                updatedAt: { bsonType: 'date', description: 'Last update timestamp' },
              }
            }
          }
        });
        
        // Create indexes for better query performance
        await db.collection(collectionName).createIndex({ userId: 1 });
        await db.collection(collectionName).createIndex({ createdAt: -1 });
        
        logger.info('MONGODB', 'COLLECTION_CREATED_SUCCESS', { collectionName });
      } else {
        logger.debug('MONGODB', 'COLLECTION_EXISTS', { collectionName });
      }
    }
  } catch (error: any) {
    logger.warn('MONGODB', 'CRM_COLLECTION_INITIALIZATION_WARNING', { error: error.message });
    // Don't throw - this is not critical
  }
}

// Function to connect to the database with detailed error handling
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    logger.debug('MONGODB', 'CONNECTING_TO_DATABASE', { timestamp: new Date().toISOString() });
    const client = await clientPromise;
    
    // Get database name from URI or use default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'affilify';
    logger.debug('MONGODB', 'DATABASE_NAME_RESOLVED', { dbName });
    
    const db = client.db(dbName);
    
    // Test the connection with a simple command
    logger.debug('MONGODB', 'TESTING_CONNECTION', {});
    await db.command({ ping: 1 });
    logger.debug('MONGODB', 'CONNECTION_TEST_PASSED', {});
    
    // Initialize CRM collections if needed
    await initializeCRMCollections(db);
    
    logger.debug('MONGODB', 'DATABASE_CONNECTION_SUCCESSFUL', { dbName });
    return { client, db };
  } catch (error: any) {
    logger.error('MONGODB', 'CONNECTION_ERROR', { error: error.message }, error);
    console.error('Error connecting to database:', error);
    
    // Attempt to reconnect once
    try {
      logger.info('MONGODB', 'ATTEMPTING_RECONNECTION', {});
      console.log('Attempting to reconnect...');
      client = new MongoClient(uri, options);
      const reconnectPromise = client.connect();
      
      // Update the global promise
      if (process.env.NODE_ENV === 'development') {
        (global as any)._mongoClientPromise = reconnectPromise;
      }
      clientPromise = reconnectPromise;
      
      const reconnectedClient = await clientPromise;
      const dbName = uri.split('/').pop()?.split('?')[0] || 'affilify';
      const db = reconnectedClient.db(dbName);
      
      // Verify reconnection
      await db.command({ ping: 1 });
      logger.info('MONGODB', 'RECONNECTION_SUCCESSFUL', { dbName });
      console.log('Reconnection successful');
      
      // Initialize CRM collections on reconnection
      await initializeCRMCollections(db);
      
      return { client: reconnectedClient, db };
    } catch (reconnectError: any) {
      logger.error('MONGODB', 'RECONNECTION_FAILED', { error: reconnectError.message }, reconnectError);
      console.error('Reconnection failed:', reconnectError);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Function to check database connectivity
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    logger.debug('MONGODB', 'CHECKING_CONNECTION', {});
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    logger.info('MONGODB', 'CONNECTION_CHECK_PASSED', {});
    return true;
  } catch (error: any) {
    logger.error('MONGODB', 'CONNECTION_CHECK_FAILED', { error: error.message }, error);
    console.error('Database connection check failed:', error);
    return false;
  }
}

// Export the clientPromise for use in other modules
export default clientPromise;

import { MongoClient, Db, MongoClientOptions } from 'mongodb'

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
      return client;
    })
    .catch(err => {
      console.error('Failed to connect MongoDB client:', err);
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

// Function to connect to the database with detailed error handling
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    
    // Get database name from URI or use default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'affilify';
    console.log(`Using database: ${dbName}`);
    
    const db = client.db(dbName);
    
    // Test the connection with a simple command
    console.log('Testing database connection...');
    await db.command({ ping: 1 });
    console.log('Database connection successful');
    
    return { client, db };
  } catch (error) {
    console.error('Error connecting to database:', error);
    
    // Attempt to reconnect once
    try {
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
      console.log('Reconnection successful');
      
      return { client: reconnectedClient, db };
    } catch (reconnectError) {
      console.error('Reconnection failed:', reconnectError);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Function to check database connectivity
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    console.log('Checking database connection...');
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log('Database connection check passed');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

// Export the clientPromise for use in other modules
export default clientPromise;

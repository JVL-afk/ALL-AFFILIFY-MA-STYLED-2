import { MongoClient, Db, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  serverSelectionTimeoutMS: 30000, // Increase server selection timeout to 30 seconds
  maxPoolSize: 10, // Limit the number of connections in the pool
  retryWrites: true, // Enable retry for write operations
  retryReads: true, // Enable retry for read operations
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .catch(err => {
      console.error('Failed to connect to MongoDB in production:', err);
      throw err;
    });
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db('affilify')
    
    // Test the connection with a simple command
    await db.command({ ping: 1 })
    console.log('Successfully connected to MongoDB')
    
    return { client, db }
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Export a function to check database connectivity
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    await db.command({ ping: 1 })
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

export default clientPromise

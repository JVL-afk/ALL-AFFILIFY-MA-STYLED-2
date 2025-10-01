import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MONGODB_URI environment variable is not set' 
      }, { status: 500 });
    }

    console.log('Attempting to connect to MongoDB with URI:', 
      uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@'));

    // Create a new MongoClient
    const client = new MongoClient(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
    });

    // Connect to the MongoDB server
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    // Get the database name from the URI or use a default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'affilify';
    console.log('Using database:', dbName);

    // Get a reference to the database
    const db = client.db(dbName);

    // Perform a simple operation to verify the connection
    console.log('Executing ping command...');
    const pingResult = await db.command({ ping: 1 });
    console.log('Ping result:', pingResult);

    // List all collections in the database
    console.log('Listing collections...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections:', collectionNames);

    // Close the connection
    await client.close();
    console.log('Connection closed');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      database: dbName,
      collections: collectionNames,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    // Detailed error information
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : String(error);

    return NextResponse.json({
      success: false,
      error: 'Failed to connect to MongoDB',
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

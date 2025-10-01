import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client: MongoClient | null = null;
  
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MONGODB_URI environment variable is not set' 
      }, { status: 500 });
    }

    // Log the URI format (hiding credentials)
    console.log('Raw DB Test - URI format:', 
      uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@'));

    // Try different connection options
    const options = {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      directConnection: false, // Try with and without this
      authSource: 'admin',
      retryWrites: true,
      retryReads: true,
    };

    // Create a new MongoClient
    client = new MongoClient(uri, options);
    console.log('Raw DB Test - Connecting to MongoDB...');
    
    // Connect with timeout
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('Raw DB Test - Connected successfully');

    // Get database name from URI or use default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'affilify';
    console.log('Raw DB Test - Using database:', dbName);
    
    // Get database reference
    const db = client.db(dbName);
    
    // Test with ping command
    console.log('Raw DB Test - Executing ping command...');
    const pingResult = await db.command({ ping: 1 });
    console.log('Raw DB Test - Ping result:', pingResult);
    
    // Try to list collections
    console.log('Raw DB Test - Listing collections...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Raw DB Test - Collections:', collectionNames);
    
    // Try to count documents in users collection
    let userCount = 0;
    try {
      if (collectionNames.includes('users')) {
        userCount = await db.collection('users').countDocuments();
        console.log('Raw DB Test - User count:', userCount);
      }
    } catch (err) {
      console.error('Raw DB Test - Error counting users:', err);
    }
    
    // Return success response with detailed information
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      database: dbName,
      collections: collectionNames,
      userCount: userCount,
      connectionDetails: {
        uri: uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@'),
        options: { ...options, authSource: options.authSource }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Raw DB Test - Connection failed:', error);
    
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
  } finally {
    // Close the connection if it was opened
    if (client) {
      try {
        await client.close();
        console.log('Raw DB Test - Connection closed');
      } catch (err) {
        console.error('Raw DB Test - Error closing connection:', err);
      }
    }
  }
}

const { MongoClient, ObjectId } = require('mongodb');

async function checkDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('affilify');
    
    // Get the latest website
    const websites = await db.collection('websites').find({}).sort({ createdAt: -1 }).limit(2).toArray();
    
    console.log('Websites in database:');
    console.log(JSON.stringify(websites, null, 2));
  } finally {
    await client.close();
  }
}

checkDatabase().catch(console.error);

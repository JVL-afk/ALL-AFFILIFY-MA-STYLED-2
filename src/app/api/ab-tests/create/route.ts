import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    await client.connect();
    const database = client.db('affilify'); // Your database name
    const abTestsCollection = database.collection('ab_tests');

    const { name, description, websiteId, websiteName, type, variants, metrics, schedule } = await req.json();

    if (!name || !websiteId || !type || !variants || variants.length < 2) {
      return NextResponse.json({ message: 'Missing required fields or insufficient variants' }, { status: 400 });
    }

    const newABTest = {
      name,
      description,
      websiteId,
      websiteName,
      status: 'draft', // Default status
      type,
      variants: variants.map((variant: any) => ({
        ...variant,
        id: new ObjectId().toHexString(), // Assign unique ID to each variant
        conversions: 0,
        visitors: 0,
        conversionRate: 0,
      })),
      metrics: {
        ...metrics,
        confidenceLevel: 0,
        statisticalSignificance: false,
      },
      schedule: {
        ...schedule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await abTestsCollection.insertOne(newABTest);

    return NextResponse.json({ message: 'A/B test created successfully', testId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

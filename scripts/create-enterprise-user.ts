import { connectToDatabase } from '../src/lib/mongodb';
import { hashPassword } from '../src/lib/auth';
import { ObjectId } from 'mongodb';

async function createEnterpriseUser() {
  try {
    const { db } = await connectToDatabase();
    
    const email = 'enterprise-test@affilify.com';
    const password = 'enterprise-test-password-2026';
    const name = 'Enterprise Tester';
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log('User already exists. Updating to enterprise plan...');
      await db.collection('users').updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            plan: 'enterprise',
            websiteLimit: -1,
            analysisLimit: -1,
            updatedAt: new Date()
          } 
        }
      );
      console.log('User updated successfully.');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      plan: 'enterprise',
      websitesCreated: 0,
      websiteLimit: -1, // Unlimited
      analysesUsed: 0,
      analysisLimit: -1, // Unlimited
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    console.log('Enterprise user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', result.insertedId.toString());
    
  } catch (error) {
    console.error('Error creating enterprise user:', error);
  } finally {
    process.exit();
  }
}

createEnterpriseUser();

import { NextRequest, NextResponse } from 'next/server';
import Client, { IClient } from '@/lib/models/Client';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// GET /api/crm/clients - Get all clients for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const clients = await Client.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/crm/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const body = await request.json();
    const newClient: IClient = new Client({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
      portalId: uuidv4(), // Generate unique portal ID
    });

    await newClient.save();
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/crm/clients - Update an existing client
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Client ID is required for update' }, { status: 400 });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ message: 'Client not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/crm/clients - Delete a client
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Client ID is required for deletion' }, { status: 400 });
    }

    const deletedClient = await Client.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!deletedClient) {
      return NextResponse.json({ message: 'Client not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

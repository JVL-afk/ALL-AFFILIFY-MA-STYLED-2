import { NextRequest, NextResponse } from 'next/server';
import Client, { IClient } from '@/lib/models/Client';
import { verifyAuth } from '@/lib/auth';
import { logger } from '@/lib/debug-logger';
import { connectMongoose, isMongooseConnected } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// GET /api/crm/clients - Get all clients for the authenticated user
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'GET_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_CLIENTS_API', 'AUTHENTICATION_FAILED', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const clients = await Client.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    logger.info('CRM_CLIENTS_API', 'CLIENTS_FETCHED_SUCCESS', { requestId, clientCount: clients.length });
    return NextResponse.json(clients);
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// POST /api/crm/clients - Create a new client
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'POST_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_CLIENTS_API', 'AUTHENTICATION_FAILED_POST', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const body = await request.json();
    const newClient: IClient = new Client({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
      portalId: uuidv4(), // Generate unique portal ID
    });

    await newClient.save();
    logger.info('CRM_CLIENTS_API', 'CLIENT_CREATED_SUCCESS', { requestId, clientId: newClient._id, portalId: newClient.portalId });
    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// PUT /api/crm/clients - Update an existing client
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'PUT_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_CLIENTS_API', 'AUTHENTICATION_FAILED_PUT', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

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
      logger.warn('CRM_CLIENTS_API', 'CLIENT_NOT_FOUND', { requestId, clientId: _id });
      return NextResponse.json({ message: 'Client not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_CLIENTS_API', 'CLIENT_UPDATED_SUCCESS', { requestId, clientId: _id });
    return NextResponse.json(updatedClient);
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// DELETE /api/crm/clients - Delete a client
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'DELETE_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_CLIENTS_API', 'AUTHENTICATION_FAILED_DELETE', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

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
      logger.warn('CRM_CLIENTS_API', 'CLIENT_NOT_FOUND_FOR_DELETE', { requestId, clientId: id });
      return NextResponse.json({ message: 'Client not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_CLIENTS_API', 'CLIENT_DELETED_SUCCESS', { requestId, clientId: id });
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

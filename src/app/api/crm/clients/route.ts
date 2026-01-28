import { NextRequest, NextResponse } from 'next/server';
import Client, { IClient } from '@/lib/models/Client';
import { requirePremiumCRM, PremiumUser } from '@/lib/premium-gating';
import { logger } from '@/lib/debug-logger';
import { connectMongoose } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/crm/clients - Get all clients for the authenticated premium user
 * Supports filtering, sorting, and pagination
 */
async function handleGET(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'GET_REQUEST_START', { requestId, userId: user.id, tier: user.tier });
    await connectMongoose();
    
    // Check if user has access to client portal feature
    if (!user.crmFeatures.clientPortal) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_PORTAL_FEATURE_NOT_AVAILABLE', { requestId, userId: user.id, tier: user.tier });
      return NextResponse.json(
        { message: 'Client portal is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    // Extract query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    logger.debug('CRM_CLIENTS_API', 'QUERY_PARAMS', { requestId, page, limit, status, sortBy, sortOrder });

    // Build filter query
    const filter: any = { userId: new mongoose.Types.ObjectId(user.id) };
    
    if (status) {
      filter.status = status;
    }

    logger.debug('CRM_CLIENTS_API', 'FETCHING_CLIENTS', { requestId, filter });

    // Fetch total count for pagination
    const total = await Client.countDocuments(filter);

    // Fetch clients with sorting and pagination
    const clients = await Client.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    logger.info('CRM_CLIENTS_API', 'CLIENTS_FETCHED_SUCCESS', { 
      requestId, 
      clientCount: clients.length, 
      total,
      page,
      pages: Math.ceil(total / limit)
    });

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/clients - Create a new client with portal access
 */
async function handlePOST(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'POST_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to client portal feature
    if (!user.crmFeatures.clientPortal) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_PORTAL_FEATURE_NOT_AVAILABLE_POST', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Client portal is not available in your plan', requestId },
        { status: 403 }
      );
    }

    // Check if user has reached max clients limit
    if (user.crmFeatures.maxClients > 0) {
      const clientCount = await Client.countDocuments({ userId: new mongoose.Types.ObjectId(user.id) });
      if (clientCount >= user.crmFeatures.maxClients) {
        logger.warn('CRM_CLIENTS_API', 'MAX_CLIENTS_REACHED', { requestId, userId: user.id, limit: user.crmFeatures.maxClients });
        return NextResponse.json(
          { message: `You have reached the maximum number of clients (${user.crmFeatures.maxClients}) for your plan`, requestId },
          { status: 429 }
        );
      }
    }
    
    const body = await request.json();
    logger.debug('CRM_CLIENTS_API', 'REQUEST_BODY_PARSED', { requestId, bodyKeys: Object.keys(body) });

    // Validate required fields
    if (!body.name || !body.email) {
      logger.warn('CRM_CLIENTS_API', 'MISSING_REQUIRED_FIELDS', { requestId });
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_CLIENTS_API', 'CREATING_CLIENT_DOCUMENT', { requestId, name: body.name, email: body.email });

    // Generate unique portal ID for client access
    const portalId = uuidv4();

    const newClient = new Client({
      ...body,
      userId: new mongoose.Types.ObjectId(user.id),
      portalId,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.debug('CRM_CLIENTS_API', 'SAVING_CLIENT_TO_DATABASE', { requestId, clientId: newClient._id, portalId });
    await newClient.save();

    logger.info('CRM_CLIENTS_API', 'CLIENT_CREATED_SUCCESS', { 
      requestId, 
      clientId: newClient._id, 
      userId: user.id,
      name: newClient.name,
      portalId
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/clients - Update an existing client
 */
async function handlePUT(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'PUT_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to client portal feature
    if (!user.crmFeatures.clientPortal) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_PORTAL_FEATURE_NOT_AVAILABLE_PUT', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Client portal is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      logger.warn('CRM_CLIENTS_API', 'MISSING_CLIENT_ID', { requestId });
      return NextResponse.json(
        { message: 'Client ID is required for update' },
        { status: 400 }
      );
    }

    logger.debug('CRM_CLIENTS_API', 'UPDATING_CLIENT', { requestId, clientId: _id, updateKeys: Object.keys(updateData) });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const updatedClient = await Client.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(user.id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_NOT_FOUND_OR_UNAUTHORIZED', { requestId, clientId: _id, userId: user.id });
      return NextResponse.json(
        { message: 'Client not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_CLIENTS_API', 'CLIENT_UPDATED_SUCCESS', { requestId, clientId: _id, userId: user.id });
    return NextResponse.json(updatedClient);
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/clients - Delete a client and revoke portal access
 */
async function handleDELETE(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_CLIENTS_API', 'DELETE_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to client portal feature
    if (!user.crmFeatures.clientPortal) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_PORTAL_FEATURE_NOT_AVAILABLE_DELETE', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Client portal is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      logger.warn('CRM_CLIENTS_API', 'MISSING_DELETE_ID', { requestId });
      return NextResponse.json(
        { message: 'Client ID is required for deletion' },
        { status: 400 }
      );
    }

    logger.debug('CRM_CLIENTS_API', 'DELETING_CLIENT', { requestId, clientId: id, userId: user.id });

    const deletedClient = await Client.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!deletedClient) {
      logger.warn('CRM_CLIENTS_API', 'CLIENT_NOT_FOUND_FOR_DELETE', { requestId, clientId: id, userId: user.id });
      return NextResponse.json(
        { message: 'Client not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_CLIENTS_API', 'CLIENT_DELETED_SUCCESS', { 
      requestId, 
      clientId: id, 
      userId: user.id,
      portalId: deletedClient.portalId 
    });
    
    return NextResponse.json({ message: 'Client deleted successfully and portal access revoked' });
  } catch (error: any) {
    logger.error('CRM_CLIENTS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

// Export wrapped handlers with premium gating
export const GET = requirePremiumCRM(handleGET);
export const POST = requirePremiumCRM(handlePOST);
export const PUT = requirePremiumCRM(handlePUT);
export const DELETE = requirePremiumCRM(handleDELETE);

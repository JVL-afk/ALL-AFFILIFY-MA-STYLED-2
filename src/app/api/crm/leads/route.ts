import { NextRequest, NextResponse } from 'next/server';
import Lead, { ILead } from '@/lib/models/Lead';
import { verifyAuth } from '@/lib/auth';
import { logger } from '@/lib/debug-logger';
import mongoose from 'mongoose';

// GET /api/crm/leads - Get all leads for the authenticated user
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'GET_REQUEST_START', { requestId, url: request.url });
    
    const authResult = await verifyAuth(request);
    logger.debug('CRM_LEADS_API', 'AUTH_RESULT', { requestId, success: authResult.success, error: authResult.error, details: authResult.details });
    
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_LEADS_API', 'AUTHENTICATION_FAILED', { requestId, error: authResult.error });
      return NextResponse.json({ 
        message: 'Unauthorized',
        error: authResult.error,
        requestId,
        debug: authResult.details
      }, { status: 401 });
    }
    
    const userId = authResult.user.id || authResult.user._id?.toString();
    logger.debug('CRM_LEADS_API', 'USER_AUTHENTICATED', { requestId, userId, userEmail: authResult.user.email });

    logger.debug('CRM_LEADS_API', 'FETCHING_LEADS', { requestId, userId });
    const leads = await Lead.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    
    logger.info('CRM_LEADS_API', 'LEADS_FETCHED_SUCCESS', { requestId, leadCount: leads.length, userId });
    return NextResponse.json(leads);
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error.message,
      requestId
    }, { status: 500 });
  }
}

// POST /api/crm/leads - Create a new lead
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'POST_REQUEST_START', { requestId });
    
    const authResult = await verifyAuth(request);
    logger.debug('CRM_LEADS_API', 'AUTH_RESULT', { requestId, success: authResult.success });
    
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_LEADS_API', 'AUTHENTICATION_FAILED_POST', { requestId, error: authResult.error });
      return NextResponse.json({ 
        message: 'Unauthorized',
        error: authResult.error,
        requestId
      }, { status: 401 });
    }
    
    const userId = authResult.user.id || authResult.user._id?.toString();
    logger.debug('CRM_LEADS_API', 'USER_AUTHENTICATED_POST', { requestId, userId });

    const body = await request.json();
    logger.debug('CRM_LEADS_API', 'REQUEST_BODY_PARSED', { requestId, bodyKeys: Object.keys(body) });
    
    const newLead: ILead = new Lead({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newLead.save();
    logger.info('CRM_LEADS_API', 'LEAD_CREATED_SUCCESS', { requestId, leadId: newLead._id, userId });
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error.message,
      requestId
    }, { status: 500 });
  }
}

// PUT /api/crm/leads - Update an existing lead
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'PUT_REQUEST_START', { requestId });
    
    const authResult = await verifyAuth(request);
    logger.debug('CRM_LEADS_API', 'AUTH_RESULT', { requestId, success: authResult.success });
    
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_LEADS_API', 'AUTHENTICATION_FAILED_PUT', { requestId, error: authResult.error });
      return NextResponse.json({ 
        message: 'Unauthorized',
        error: authResult.error,
        requestId
      }, { status: 401 });
    }
    
    const userId = authResult.user.id || authResult.user._id?.toString();
    logger.debug('CRM_LEADS_API', 'USER_AUTHENTICATED_PUT', { requestId, userId });

    const body = await request.json();
    const { _id, ...updateData } = body;
    logger.debug('CRM_LEADS_API', 'UPDATE_DATA_PARSED', { requestId, leadId: _id, updateKeys: Object.keys(updateData) });

    if (!_id) {
      logger.warn('CRM_LEADS_API', 'MISSING_LEAD_ID', { requestId });
      return NextResponse.json({ message: 'Lead ID is required for update' }, { status: 400 });
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true }
    );

    if (!updatedLead) {
      logger.warn('CRM_LEADS_API', 'LEAD_NOT_FOUND_OR_UNAUTHORIZED', { requestId, leadId: _id, userId });
      return NextResponse.json({ message: 'Lead not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_LEADS_API', 'LEAD_UPDATED_SUCCESS', { requestId, leadId: _id, userId });
    return NextResponse.json(updatedLead);
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error.message,
      requestId
    }, { status: 500 });
  }
}

// DELETE /api/crm/leads - Delete a lead
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'DELETE_REQUEST_START', { requestId });
    
    const authResult = await verifyAuth(request);
    logger.debug('CRM_LEADS_API', 'AUTH_RESULT', { requestId, success: authResult.success });
    
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_LEADS_API', 'AUTHENTICATION_FAILED_DELETE', { requestId, error: authResult.error });
      return NextResponse.json({ 
        message: 'Unauthorized',
        error: authResult.error,
        requestId
      }, { status: 401 });
    }
    
    const userId = authResult.user.id || authResult.user._id?.toString();
    logger.debug('CRM_LEADS_API', 'USER_AUTHENTICATED_DELETE', { requestId, userId });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    logger.debug('CRM_LEADS_API', 'DELETE_ID_EXTRACTED', { requestId, leadId: id });

    if (!id) {
      logger.warn('CRM_LEADS_API', 'MISSING_DELETE_ID', { requestId });
      return NextResponse.json({ message: 'Lead ID is required for deletion' }, { status: 400 });
    }

    const deletedLead = await Lead.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!deletedLead) {
      logger.warn('CRM_LEADS_API', 'LEAD_NOT_FOUND_FOR_DELETE', { requestId, leadId: id, userId });
      return NextResponse.json({ message: 'Lead not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_LEADS_API', 'LEAD_DELETED_SUCCESS', { requestId, leadId: id, userId });
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error.message,
      requestId
    }, { status: 500 });
  }
}

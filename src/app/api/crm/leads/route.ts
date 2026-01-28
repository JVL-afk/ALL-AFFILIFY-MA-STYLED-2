import { NextRequest, NextResponse } from 'next/server';
import Lead, { ILead } from '@/lib/models/Lead';
import { requirePremiumCRM, PremiumUser, canAccessCRMFeature } from '@/lib/premium-gating';
import { logger } from '@/lib/debug-logger';
import { connectMongoose } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';

/**
 * GET /api/crm/leads - Get all leads for the authenticated premium user
 * Supports filtering, sorting, and pagination
 */
async function handleGET(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'GET_REQUEST_START', { requestId, userId: user.id, tier: user.tier });
    await connectMongoose();
    
    // Check if user has access to leads feature
    if (!user.crmFeatures.leads) {
      logger.warn('CRM_LEADS_API', 'LEADS_FEATURE_NOT_AVAILABLE', { requestId, userId: user.id, tier: user.tier });
      return NextResponse.json(
        { message: 'Lead management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    // Extract query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    logger.debug('CRM_LEADS_API', 'QUERY_PARAMS', { requestId, page, limit, status, source, sortBy, sortOrder });

    // Build filter query
    const filter: any = { userId: new mongoose.Types.ObjectId(user.id) };
    
    if (status) {
      filter.status = status;
    }
    
    if (source) {
      filter.source = source;
    }

    logger.debug('CRM_LEADS_API', 'FETCHING_LEADS', { requestId, filter });

    // Fetch total count for pagination
    const total = await Lead.countDocuments(filter);

    // Fetch leads with sorting and pagination
    const leads = await Lead.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    logger.info('CRM_LEADS_API', 'LEADS_FETCHED_SUCCESS', { 
      requestId, 
      leadCount: leads.length, 
      total,
      page,
      pages: Math.ceil(total / limit)
    });

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/leads - Create a new lead for the authenticated premium user
 */
async function handlePOST(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'POST_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to leads feature
    if (!user.crmFeatures.leads) {
      logger.warn('CRM_LEADS_API', 'LEADS_FEATURE_NOT_AVAILABLE_POST', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Lead management is not available in your plan', requestId },
        { status: 403 }
      );
    }

    // Check if user has reached max leads limit
    if (user.crmFeatures.maxClients > 0) {
      const leadCount = await Lead.countDocuments({ userId: new mongoose.Types.ObjectId(user.id) });
      if (leadCount >= user.crmFeatures.maxClients) {
        logger.warn('CRM_LEADS_API', 'MAX_LEADS_REACHED', { requestId, userId: user.id, limit: user.crmFeatures.maxClients });
        return NextResponse.json(
          { message: `You have reached the maximum number of leads (${user.crmFeatures.maxClients}) for your plan`, requestId },
          { status: 429 }
        );
      }
    }
    
    const body = await request.json();
    logger.debug('CRM_LEADS_API', 'REQUEST_BODY_PARSED', { requestId, bodyKeys: Object.keys(body) });

    // Validate required fields
    if (!body.name || !body.email) {
      logger.warn('CRM_LEADS_API', 'MISSING_REQUIRED_FIELDS', { requestId });
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_LEADS_API', 'CREATING_LEAD_DOCUMENT', { requestId, name: body.name, email: body.email });

    const newLead = new Lead({
      ...body,
      userId: new mongoose.Types.ObjectId(user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.debug('CRM_LEADS_API', 'SAVING_LEAD_TO_DATABASE', { requestId, leadId: newLead._id });
    await newLead.save();

    logger.info('CRM_LEADS_API', 'LEAD_CREATED_SUCCESS', { 
      requestId, 
      leadId: newLead._id, 
      userId: user.id,
      name: newLead.name 
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/leads - Update an existing lead
 */
async function handlePUT(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'PUT_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to leads feature
    if (!user.crmFeatures.leads) {
      logger.warn('CRM_LEADS_API', 'LEADS_FEATURE_NOT_AVAILABLE_PUT', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Lead management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      logger.warn('CRM_LEADS_API', 'MISSING_LEAD_ID', { requestId });
      return NextResponse.json(
        { message: 'Lead ID is required for update' },
        { status: 400 }
      );
    }

    logger.debug('CRM_LEADS_API', 'UPDATING_LEAD', { requestId, leadId: _id, updateKeys: Object.keys(updateData) });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(user.id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      logger.warn('CRM_LEADS_API', 'LEAD_NOT_FOUND_OR_UNAUTHORIZED', { requestId, leadId: _id, userId: user.id });
      return NextResponse.json(
        { message: 'Lead not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_LEADS_API', 'LEAD_UPDATED_SUCCESS', { requestId, leadId: _id, userId: user.id });
    return NextResponse.json(updatedLead);
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/leads - Delete a lead
 */
async function handleDELETE(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'DELETE_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to leads feature
    if (!user.crmFeatures.leads) {
      logger.warn('CRM_LEADS_API', 'LEADS_FEATURE_NOT_AVAILABLE_DELETE', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Lead management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      logger.warn('CRM_LEADS_API', 'MISSING_DELETE_ID', { requestId });
      return NextResponse.json(
        { message: 'Lead ID is required for deletion' },
        { status: 400 }
      );
    }

    logger.debug('CRM_LEADS_API', 'DELETING_LEAD', { requestId, leadId: id, userId: user.id });

    const deletedLead = await Lead.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!deletedLead) {
      logger.warn('CRM_LEADS_API', 'LEAD_NOT_FOUND_FOR_DELETE', { requestId, leadId: id, userId: user.id });
      return NextResponse.json(
        { message: 'Lead not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_LEADS_API', 'LEAD_DELETED_SUCCESS', { requestId, leadId: id, userId: user.id });
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crm/leads - Bulk update leads (e.g., change status for multiple leads)
 */
async function handlePATCH(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_LEADS_API', 'PATCH_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to leads feature
    if (!user.crmFeatures.leads) {
      logger.warn('CRM_LEADS_API', 'LEADS_FEATURE_NOT_AVAILABLE_PATCH', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Lead management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { leadIds, updateData } = body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      logger.warn('CRM_LEADS_API', 'INVALID_LEAD_IDS', { requestId });
      return NextResponse.json(
        { message: 'leadIds array is required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_LEADS_API', 'BULK_UPDATING_LEADS', { 
      requestId, 
      leadCount: leadIds.length, 
      updateKeys: Object.keys(updateData) 
    });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds.map(id => new mongoose.Types.ObjectId(id)) },
        userId: new mongoose.Types.ObjectId(user.id),
      },
      updateData,
      { runValidators: true }
    );

    logger.info('CRM_LEADS_API', 'BULK_UPDATE_SUCCESS', { 
      requestId, 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount 
    });

    return NextResponse.json({
      message: 'Leads updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error: any) {
    logger.error('CRM_LEADS_API', 'PATCH_REQUEST_ERROR', { requestId, error: error.message }, error);
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
export const PATCH = requirePremiumCRM(handlePATCH);

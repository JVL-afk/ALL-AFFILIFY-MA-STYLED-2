import { NextRequest, NextResponse } from 'next/server';
import Proposal, { IProposal } from '@/lib/models/Proposal';
import { requirePremiumCRM, PremiumUser } from '@/lib/premium-gating';
import { logger } from '@/lib/debug-logger';
import { connectMongoose } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';

/**
 * GET /api/crm/proposals - Get all proposals for the authenticated premium user
 * Supports filtering, sorting, and pagination
 */
async function handleGET(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'GET_REQUEST_START', { requestId, userId: user.id, tier: user.tier });
    await connectMongoose();
    
    // Check if user has access to proposals feature
    if (!user.crmFeatures.proposals) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSALS_FEATURE_NOT_AVAILABLE', { requestId, userId: user.id, tier: user.tier });
      return NextResponse.json(
        { message: 'Proposal management is not available in your plan', requestId },
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

    logger.debug('CRM_PROPOSALS_API', 'QUERY_PARAMS', { requestId, page, limit, status, sortBy, sortOrder });

    // Build filter query
    const filter: any = { userId: new mongoose.Types.ObjectId(user.id) };
    
    if (status) {
      filter.status = status;
    }

    logger.debug('CRM_PROPOSALS_API', 'FETCHING_PROPOSALS', { requestId, filter });

    // Fetch total count for pagination
    const total = await Proposal.countDocuments(filter);

    // Fetch proposals with sorting and pagination
    const proposals = await Proposal.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    logger.info('CRM_PROPOSALS_API', 'PROPOSALS_FETCHED_SUCCESS', { 
      requestId, 
      proposalCount: proposals.length, 
      total,
      page,
      pages: Math.ceil(total / limit)
    });

    return NextResponse.json({
      proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/proposals - Create a new proposal for the authenticated premium user
 */
async function handlePOST(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'POST_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to proposals feature
    if (!user.crmFeatures.proposals) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSALS_FEATURE_NOT_AVAILABLE_POST', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Proposal management is not available in your plan', requestId },
        { status: 403 }
      );
    }

    // Check if user has reached max proposals limit
    if (user.crmFeatures.maxProposals > 0) {
      const proposalCount = await Proposal.countDocuments({ userId: new mongoose.Types.ObjectId(user.id) });
      if (proposalCount >= user.crmFeatures.maxProposals) {
        logger.warn('CRM_PROPOSALS_API', 'MAX_PROPOSALS_REACHED', { requestId, userId: user.id, limit: user.crmFeatures.maxProposals });
        return NextResponse.json(
          { message: `You have reached the maximum number of proposals (${user.crmFeatures.maxProposals}) for your plan`, requestId },
          { status: 429 }
        );
      }
    }
    
    const body = await request.json();
    logger.debug('CRM_PROPOSALS_API', 'REQUEST_BODY_PARSED', { requestId, bodyKeys: Object.keys(body) });

    // Validate required fields
    if (!body.title || !body.content) {
      logger.warn('CRM_PROPOSALS_API', 'MISSING_REQUIRED_FIELDS', { requestId });
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    logger.debug('CRM_PROPOSALS_API', 'CREATING_PROPOSAL_DOCUMENT', { requestId, title: body.title });

    const newProposal = new Proposal({
      ...body,
      userId: new mongoose.Types.ObjectId(user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.debug('CRM_PROPOSALS_API', 'SAVING_PROPOSAL_TO_DATABASE', { requestId, proposalId: newProposal._id });
    await newProposal.save();

    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_CREATED_SUCCESS', { 
      requestId, 
      proposalId: newProposal._id, 
      userId: user.id,
      title: newProposal.title 
    });

    return NextResponse.json(newProposal, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/proposals - Update an existing proposal
 */
async function handlePUT(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'PUT_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to proposals feature
    if (!user.crmFeatures.proposals) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSALS_FEATURE_NOT_AVAILABLE_PUT', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Proposal management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      logger.warn('CRM_PROPOSALS_API', 'MISSING_PROPOSAL_ID', { requestId });
      return NextResponse.json(
        { message: 'Proposal ID is required for update' },
        { status: 400 }
      );
    }

    logger.debug('CRM_PROPOSALS_API', 'UPDATING_PROPOSAL', { requestId, proposalId: _id, updateKeys: Object.keys(updateData) });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const updatedProposal = await Proposal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(user.id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProposal) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSAL_NOT_FOUND_OR_UNAUTHORIZED', { requestId, proposalId: _id, userId: user.id });
      return NextResponse.json(
        { message: 'Proposal not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_UPDATED_SUCCESS', { requestId, proposalId: _id, userId: user.id });
    return NextResponse.json(updatedProposal);
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json(
      { message: 'Internal Server Error', requestId },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/proposals - Delete a proposal
 */
async function handleDELETE(request: NextRequest, user: PremiumUser): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'DELETE_REQUEST_START', { requestId, userId: user.id });
    await connectMongoose();
    
    // Check if user has access to proposals feature
    if (!user.crmFeatures.proposals) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSALS_FEATURE_NOT_AVAILABLE_DELETE', { requestId, userId: user.id });
      return NextResponse.json(
        { message: 'Proposal management is not available in your plan', requestId },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      logger.warn('CRM_PROPOSALS_API', 'MISSING_DELETE_ID', { requestId });
      return NextResponse.json(
        { message: 'Proposal ID is required for deletion' },
        { status: 400 }
      );
    }

    logger.debug('CRM_PROPOSALS_API', 'DELETING_PROPOSAL', { requestId, proposalId: id, userId: user.id });

    const deletedProposal = await Proposal.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!deletedProposal) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSAL_NOT_FOUND_FOR_DELETE', { requestId, proposalId: id, userId: user.id });
      return NextResponse.json(
        { message: 'Proposal not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_DELETED_SUCCESS', { requestId, proposalId: id, userId: user.id });
    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
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

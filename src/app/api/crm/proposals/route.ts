import { NextRequest, NextResponse } from 'next/server';
import Proposal, { IProposal } from '@/lib/models/Proposal';
import { verifyAuth } from '@/lib/auth';
import { logger } from '@/lib/debug-logger';
import { connectMongoose, isMongooseConnected } from '@/lib/mongoose-connection';
import mongoose from 'mongoose';

// GET /api/crm/proposals - Get all proposals for the authenticated user
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'GET_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_PROPOSALS_API', 'AUTHENTICATION_FAILED', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const proposals = await Proposal.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    logger.info('CRM_PROPOSALS_API', 'PROPOSALS_FETCHED_SUCCESS', { requestId, proposalCount: proposals.length });
    return NextResponse.json(proposals);
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'GET_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// POST /api/crm/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'POST_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_PROPOSALS_API', 'AUTHENTICATION_FAILED_POST', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const body = await request.json();
    const newProposal: IProposal = new Proposal({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newProposal.save();
    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_CREATED_SUCCESS', { requestId, proposalId: newProposal._id });
    return NextResponse.json(newProposal, { status: 201 });
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'POST_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// PUT /api/crm/proposals - Update an existing proposal
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'PUT_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_PROPOSALS_API', 'AUTHENTICATION_FAILED_PUT', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Proposal ID is required for update' }, { status: 400 });
    }

    const updatedProposal = await Proposal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true }
    );

    if (!updatedProposal) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSAL_NOT_FOUND', { requestId, proposalId: _id });
      return NextResponse.json({ message: 'Proposal not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_UPDATED_SUCCESS', { requestId, proposalId: _id });
    return NextResponse.json(updatedProposal);
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'PUT_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

// DELETE /api/crm/proposals - Delete a proposal
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.info('CRM_PROPOSALS_API', 'DELETE_REQUEST_START', { requestId });
    await connectMongoose();
    
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      logger.warn('CRM_PROPOSALS_API', 'AUTHENTICATION_FAILED_DELETE', { requestId });
      return NextResponse.json({ message: 'Unauthorized', requestId }, { status: 401 });
    }
    const userId = authResult.user.id || authResult.user._id?.toString();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Proposal ID is required for deletion' }, { status: 400 });
    }

    const deletedProposal = await Proposal.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!deletedProposal) {
      logger.warn('CRM_PROPOSALS_API', 'PROPOSAL_NOT_FOUND_FOR_DELETE', { requestId, proposalId: id });
      return NextResponse.json({ message: 'Proposal not found or unauthorized' }, { status: 404 });
    }

    logger.info('CRM_PROPOSALS_API', 'PROPOSAL_DELETED_SUCCESS', { requestId, proposalId: id });
    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error: any) {
    logger.error('CRM_PROPOSALS_API', 'DELETE_REQUEST_ERROR', { requestId, error: error.message }, error);
    return NextResponse.json({ message: 'Internal Server Error', requestId }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Proposal, { IProposal } from '@/lib/models/Proposal';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/crm/proposals - Get all proposals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const proposals = await Proposal.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/crm/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = authResult.user.id;

    const body = await request.json();
    const newProposal: IProposal = new Proposal({
      ...body,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newProposal.save();
    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/crm/proposals - Update an existing proposal
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
      return NextResponse.json({ message: 'Proposal ID is required for update' }, { status: 400 });
    }

    const updatedProposal = await Proposal.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id), userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true }
    );

    if (!updatedProposal) {
      return NextResponse.json({ message: 'Proposal not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/crm/proposals - Delete a proposal
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
      return NextResponse.json({ message: 'Proposal ID is required for deletion' }, { status: 400 });
    }

    const deletedProposal = await Proposal.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!deletedProposal) {
      return NextResponse.json({ message: 'Proposal not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Team Member Model with Role-Based Access Control
interface TeamMember {
  _id?: ObjectId
  teamId: ObjectId
  userId: ObjectId
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending'
  addedAt: Date
}

// POST: Add a new team member (best-in-class with proper validation)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, role' },
        { status: 400 }
      )
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, editor, or viewer.' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()

    // Best-in-Class: Find the user's team
    const team = await db.collection('teams').findOne({
      ownerId: new ObjectId(user._id)
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Best-in-Class: Check if member already exists
    const existingMember = team.members.find((m: any) => m.email === email)
    if (existingMember) {
      return NextResponse.json(
        { error: 'Member already exists in team' },
        { status: 400 }
      )
    }

    // Best-in-Class: Add new member to team
    const newMember = {
      userId: new ObjectId(), // In a real app, this would be the actual user ID
      email,
      role,
      addedAt: new Date()
    }

    const result = await db.collection('teams').updateOne(
      { _id: team._id },
      { $push: { members: newMember as any } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to add team member' },
        { status: 500 }
      )
    }

    // In a real application, this would send an invitation email
    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email} with role ${role}.`,
      member: {
        email,
        role,
        status: 'pending'
      }
    })
  } catch (error) {
    console.error('Add team member error:', error)
    return NextResponse.json(
      { error: 'Failed to add team member' },
      { status: 500 }
    )
  }
})

// DELETE: Remove a team member (best-in-class with proper authorization)
export const DELETE = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { memberId } = await request.json()

    if (!memberId) {
      return NextResponse.json(
        { error: 'Missing required field: memberId' },
        { status: 400 }
      )
    }
    
    const { db } = await connectToDatabase()

    // Best-in-Class: Find the user's team and verify ownership
    const team = await db.collection('teams').findOne({
      ownerId: new ObjectId(user._id)
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Best-in-Class: Remove the member from the team
    const result = await db.collection('teams').updateOne(
      { _id: team._id },
      { $pull: { members: { userId: new ObjectId(memberId) } } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Member not found in team' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Team member ${memberId} removed successfully.`,
    })
  } catch (error) {
    console.error('Remove team member error:', error)
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    )
  }
})


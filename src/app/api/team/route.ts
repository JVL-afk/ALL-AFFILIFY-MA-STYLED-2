import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Team Model with Role-Based Access Control
interface Team {
  _id: ObjectId
  ownerId: ObjectId
  name: string
  members: Array<{
    userId: ObjectId
    email: string
    role: 'admin' | 'editor' | 'viewer'
    addedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

// GET: Fetch the user's team details (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Query the 'teams' collection for real-time data
    const team = await db.collection('teams').findOne({
      ownerId: new ObjectId(user._id)
    })

    if (!team) {
      // Return a default team structure if none exists
      return NextResponse.json({
        success: true,
        team: {
          id: null,
          ownerId: user.id,
          name: `${user.name}'s Enterprise Team`,
          memberCount: 1,
          members: [
            { id: user.id, email: user.email, name: user.name, role: 'Owner' }
          ]
        }
      })
    }

    return NextResponse.json({
      success: true,
      team: {
        id: team._id.toString(),
        ownerId: team.ownerId.toString(),
        name: team.name,
        memberCount: team.members.length,
        members: team.members.map(member => ({
          id: member.userId.toString(),
          email: member.email,
          role: member.role,
          addedAt: member.addedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get team error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve team' },
      { status: 500 }
    )
  }
})

// POST: Create a new team (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Best-in-Class: Check if the user already owns a team
    const existingTeam = await db.collection('teams').findOne({
      ownerId: new ObjectId(user._id)
    })

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You already own a team. Delete it first to create a new one.' },
        { status: 400 }
      )
    }

    const newTeam = {
      ownerId: new ObjectId(user._id),
      name,
      members: [
        {
          userId: new ObjectId(user._id),
          email: user.email,
          role: 'admin',
          addedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('teams').insertOne(newTeam)
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team created successfully',
      team: {
        id: result.insertedId.toString(),
        ...newTeam
      }
    })
  } catch (error) {
    console.error('Create team error:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
})


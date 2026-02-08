import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = authResult.user as any

    // Only allow enterprise users
    if (user.plan !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise plan required' },
        { status: 403 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(user.id)

    // Get team from teams collection
    let teamMembers: any[] = []
    let projects: any[] = []
    let activities: any[] = []

    try {
      const team = await db.collection('teams').findOne({
        ownerId: userId
      })

      if (team && team.members) {
        teamMembers = team.members.map((member: any, index: number) => ({
          id: member.userId?.toString() || `member-${index}`,
          name: member.name || member.email?.split('@')[0] || 'Unknown',
          email: member.email || '',
          role: member.role || 'viewer',
          status: member.status || 'active',
          avatar: member.avatar || '',
          lastActive: member.lastActive || member.addedAt || new Date(),
          websitesManaged: member.websitesManaged || 0,
          joinedAt: member.addedAt || new Date()
        }))
      }
    } catch (error) {
      console.log('Error fetching team:', error)
    }

    // Get team projects
    try {
      const projectsList = await db.collection('team_projects')
        .find({ userId })
        .toArray()
      
      projects = projectsList.map(project => ({
        id: project._id.toString(),
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        progress: project.progress || 0,
        members: project.members || [],
        dueDate: project.dueDate || null,
        createdAt: project.createdAt || new Date()
      }))
    } catch (error) {
      console.log('Team projects collection not found')
    }

    // Get team activities
    try {
      const activityList = await db.collection('team_activities')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray()
      
      activities = activityList.map(activity => ({
        id: activity._id.toString(),
        user: activity.user || 'Unknown',
        action: activity.action || '',
        target: activity.target || '',
        timestamp: activity.timestamp || new Date(),
        type: activity.type || 'info'
      }))
    } catch (error) {
      console.log('Team activities collection not found')
    }

    return NextResponse.json({
      success: true,
      data: {
        members: teamMembers,
        projects,
        activities,
        stats: {
          totalMembers: teamMembers.length,
          activeMembers: teamMembers.filter(m => m.status === 'active').length,
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching team data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

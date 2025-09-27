import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const plan = searchParams.get('plan') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (plan) {
      query.plan = plan
    }

    if (status) {
      query.subscriptionStatus = status
    }

    // Get total count
    const totalUsers = await db.collection('users').countDocuments(query)

    // Get users with pagination
    const users = await db.collection('users')
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        password: 0, // Exclude password from response
        resetToken: 0,
        resetTokenExpiry: 0
      })
      .toArray()

    // Get user statistics
    const stats = await getUserStats(db)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      },
      stats
    })

  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, userIds, data } = body

    const { db } = await connectToDatabase()

    switch (action) {
      case 'bulk_update_plan':
        return await bulkUpdatePlan(userIds, data.plan, db)
      
      case 'bulk_suspend':
        return await bulkSuspendUsers(userIds, db)
      
      case 'bulk_activate':
        return await bulkActivateUsers(userIds, db)
      
      case 'bulk_delete':
        return await bulkDeleteUsers(userIds, db)
      
      case 'export_users':
        return await exportUsers(data, db)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Admin users POST error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}

async function getUserStats(db: any) {
  const [
    totalUsers,
    activeUsers,
    basicUsers,
    proUsers,
    enterpriseUsers,
    recentSignups,
    activeSubscriptions,
    canceledSubscriptions
  ] = await Promise.all([
    db.collection('users').countDocuments(),
    db.collection('users').countDocuments({ 
      lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    }),
    db.collection('users').countDocuments({ plan: 'Basic' }),
    db.collection('users').countDocuments({ plan: 'Pro' }),
    db.collection('users').countDocuments({ plan: 'Enterprise' }),
    db.collection('users').countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    }),
    db.collection('users').countDocuments({ subscriptionStatus: 'active' }),
    db.collection('users').countDocuments({ subscriptionStatus: 'canceled' })
  ])

  return {
    totalUsers,
    activeUsers,
    planDistribution: {
      basic: basicUsers,
      pro: proUsers,
      enterprise: enterpriseUsers
    },
    recentSignups,
    subscriptions: {
      active: activeSubscriptions,
      canceled: canceledSubscriptions
    }
  }
}

async function bulkUpdatePlan(userIds: string[], plan: string, db: any) {
  try {
    const objectIds = userIds.map(id => new ObjectId(id))
    
    const result = await db.collection('users').updateMany(
      { _id: { $in: objectIds } },
      { 
        $set: { 
          plan,
          updatedAt: new Date()
        }
      }
    )

    // Log admin action
    await db.collection('admin_actions').insertOne({
      action: 'bulk_update_plan',
      targetType: 'users',
      targetIds: userIds,
      data: { plan },
      performedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} users to ${plan} plan`
    })

  } catch (error) {
    console.error('Bulk update plan error:', error)
    return NextResponse.json(
      { error: 'Failed to update user plans' },
      { status: 500 }
    )
  }
}

async function bulkSuspendUsers(userIds: string[], db: any) {
  try {
    const objectIds = userIds.map(id => new ObjectId(id))
    
    const result = await db.collection('users').updateMany(
      { _id: { $in: objectIds } },
      { 
        $set: { 
          status: 'suspended',
          suspendedAt: new Date(),
          updatedAt: new Date()
        }
      }
    )

    // Log admin action
    await db.collection('admin_actions').insertOne({
      action: 'bulk_suspend',
      targetType: 'users',
      targetIds: userIds,
      performedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `Suspended ${result.modifiedCount} users`
    })

  } catch (error) {
    console.error('Bulk suspend error:', error)
    return NextResponse.json(
      { error: 'Failed to suspend users' },
      { status: 500 }
    )
  }
}

async function bulkActivateUsers(userIds: string[], db: any) {
  try {
    const objectIds = userIds.map(id => new ObjectId(id))
    
    const result = await db.collection('users').updateMany(
      { _id: { $in: objectIds } },
      { 
        $set: { 
          status: 'active',
          updatedAt: new Date()
        },
        $unset: {
          suspendedAt: 1
        }
      }
    )

    // Log admin action
    await db.collection('admin_actions').insertOne({
      action: 'bulk_activate',
      targetType: 'users',
      targetIds: userIds,
      performedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `Activated ${result.modifiedCount} users`
    })

  } catch (error) {
    console.error('Bulk activate error:', error)
    return NextResponse.json(
      { error: 'Failed to activate users' },
      { status: 500 }
    )
  }
}

async function bulkDeleteUsers(userIds: string[], db: any) {
  try {
    const objectIds = userIds.map(id => new ObjectId(id))
    
    // Get users before deletion for logging
    const users = await db.collection('users')
      .find({ _id: { $in: objectIds } })
      .project({ email: 1, name: 1 })
      .toArray()

    // Delete users
    const result = await db.collection('users').deleteMany({
      _id: { $in: objectIds }
    })

    // Delete related data
    await Promise.all([
      db.collection('websites').deleteMany({ userId: { $in: objectIds } }),
      db.collection('analyses').deleteMany({ userId: { $in: objectIds } }),
      db.collection('api_keys').deleteMany({ userId: { $in: objectIds } })
    ])

    // Log admin action
    await db.collection('admin_actions').insertOne({
      action: 'bulk_delete',
      targetType: 'users',
      targetIds: userIds,
      data: { deletedUsers: users },
      performedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} users and their data`
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete users' },
      { status: 500 }
    )
  }
}

async function exportUsers(filters: any, db: any) {
  try {
    // Build query from filters
    const query: any = {}
    
    if (filters.plan) query.plan = filters.plan
    if (filters.status) query.subscriptionStatus = filters.status
    if (filters.dateFrom) {
      query.createdAt = { $gte: new Date(filters.dateFrom) }
    }
    if (filters.dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.dateTo) }
    }

    // Get users for export
    const users = await db.collection('users')
      .find(query)
      .project({
        name: 1,
        email: 1,
        plan: 1,
        subscriptionStatus: 1,
        createdAt: 1,
        lastLoginAt: 1,
        websiteCount: 1,
        analysisCount: 1
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Convert to CSV format
    const csvData = convertToCSV(users)

    return NextResponse.json({
      success: true,
      data: csvData,
      filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`
    })

  } catch (error) {
    console.error('Export users error:', error)
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    )
  }
}

function convertToCSV(users: any[]) {
  if (users.length === 0) return ''

  const headers = [
    'Name',
    'Email',
    'Plan',
    'Subscription Status',
    'Created At',
    'Last Login',
    'Website Count',
    'Analysis Count'
  ]

  const csvRows = [headers.join(',')]

  users.forEach(user => {
    const row = [
      user.name || '',
      user.email || '',
      user.plan || '',
      user.subscriptionStatus || '',
      user.createdAt ? new Date(user.createdAt).toISOString() : '',
      user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : '',
      user.websiteCount || 0,
      user.analysisCount || 0
    ]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}


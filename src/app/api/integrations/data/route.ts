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

    // Get integrations from database
    let integrations: any[] = []
    try {
      const integrationsList = await db.collection('integrations')
        .find({ userId })
        .toArray()
      
      integrations = integrationsList.map(integration => ({
        id: integration._id.toString(),
        name: integration.name || '',
        type: integration.type || 'custom',
        status: integration.status || 'disconnected',
        provider: integration.provider || '',
        config: integration.config || {},
        connectedAt: integration.connectedAt || null,
        lastSync: integration.lastSync || null,
        syncFrequency: integration.syncFrequency || 'manual'
      }))
    } catch (error) {
      console.log('Integrations collection not found')
    }

    // Get webhooks
    let webhooks: any[] = []
    try {
      const webhooksList = await db.collection('webhooks')
        .find({ userId })
        .toArray()
      
      webhooks = webhooksList.map(webhook => ({
        id: webhook._id.toString(),
        url: webhook.url || '',
        events: webhook.events || [],
        status: webhook.status || 'active',
        secret: webhook.secret || '',
        deliveries: webhook.deliveries || 0,
        lastDelivery: webhook.lastDelivery || null,
        createdAt: webhook.createdAt || new Date()
      }))
    } catch (error) {
      console.log('Webhooks collection not found')
    }

    const connectedIntegrations = integrations.filter(i => i.status === 'connected').length
    const totalDeliveries = webhooks.reduce((sum, w) => sum + (w.deliveries || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        integrations,
        webhooks,
        stats: {
          connected: connectedIntegrations,
          totalIntegrations: integrations.length,
          activeWebhooks: webhooks.filter(w => w.status === 'active').length,
          totalDeliveries,
          dataSynced: connectedIntegrations > 0 ? 100 : 0,
          lastSync: integrations.find(i => i.lastSync)?.lastSync || null
        }
      }
    })
  } catch (error) {
    console.error('Error fetching integrations data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

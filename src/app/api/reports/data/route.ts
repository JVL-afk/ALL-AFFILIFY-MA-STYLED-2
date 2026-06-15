import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { ReportSchema } from '@/lib/schemas/report'
import { ReportQueueService } from '@/services/report-queue'
import { ObservabilityService, SpanStatusCode } from '@/services/observability'
import { getTraceId } from '@/lib/trace-context'
import { hasPlanOrHigher } from '@/lib/rbac'

const observability = ObservabilityService.getInstance()
const reportQueue = ReportQueueService.getInstance()

export async function GET(request: NextRequest) {
  return observability.withSpan('api.reports.get', async (span) => {
    try {
      const authResult = await verifyAuth(request)
      if (!authResult.success) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      const user = authResult.user as any
      if (!hasPlanOrHigher(user.plan, 'enterprise')) {
        return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 })
      }

      const { db } = await connectToDatabase()
      const userId = new ObjectId(user.id)

      const websites = await db.collection('websites').find({ userId }).toArray()
      const totalRevenue = websites.reduce((sum, site) => sum + (site.revenue || 0), 0)
      const totalVisitors = websites.reduce((sum, site) => sum + (site.views || 0), 0)
      const totalClicks = websites.reduce((sum, site) => sum + (site.clicks || 0), 0)
      const totalConversions = websites.reduce((sum, site) => sum + (site.conversions || 0), 0)
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

      const reportsList = await db.collection('reports')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()

      const reports = reportsList.map(report => ({
        ...report,
        id: report._id.toString(),
        _id: undefined
      }))

      return NextResponse.json({
        success: true,
        data: {
          reports,
          metrics: {
            totalRevenue,
            websiteVisitors: totalVisitors,
            pageViews: totalVisitors,
            conversionRate: Number(conversionRate.toFixed(2))
          }
        }
      })
    } catch (error: any) {
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return observability.withSpan('api.reports.create', async (span) => {
    try {
      const authResult = await verifyAuth(request)
      if (!authResult.success) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      const user = authResult.user as any
      if (!hasPlanOrHigher(user.plan, 'enterprise')) {
        return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 })
      }

      const body = await request.json()
      const traceId = getTraceId()
      
      const validatedData = ReportSchema.parse({
        ...body,
        userId: user.id,
        status: 'pending',
        createdAt: new Date(),
        traceContext: { traceId }
      })

      const { db } = await connectToDatabase()
      const result = await db.collection('reports').insertOne({
        ...validatedData,
        userId: new ObjectId(user.id),
        createdAt: new Date()
      })

      const reportId = result.insertedId.toString()
      await reportQueue.addReportJob(reportId, user.id)

      span.setAttributes({ reportId, userId: user.id })
      
      return NextResponse.json({
        success: true,
        data: { id: reportId }
      })
    } catch (error: any) {
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      if (error.name === 'ZodError') {
        return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  })
}

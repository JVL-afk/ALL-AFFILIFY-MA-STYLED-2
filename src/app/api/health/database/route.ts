import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/mongodb'

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()
    
    if (isConnected) {
      return NextResponse.json({
        status: 'ok',
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

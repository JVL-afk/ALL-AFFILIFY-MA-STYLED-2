import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'
import { checkDatabaseConnection } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // First check database connectivity
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.error('Database connection failed during signup')
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      )
    }

    const { name, email, password, confirmPassword } = await request.json()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      plan: 'basic'
    }).catch(err => {
      console.error('Error in createUser:', err)
      return null
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user. Email may already exist.' },
        { status: 400 }
      )
    }

    // Generate token
    const token = await generateToken(user.id)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        websitesCreated: user.websitesCreated,
        websiteLimit: user.websiteLimit,
        analysesUsed: user.analysesUsed,
        analysisLimit: user.analysisLimit
      }
    })

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

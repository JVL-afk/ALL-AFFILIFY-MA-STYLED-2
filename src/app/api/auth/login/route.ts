import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, generateToken } from '@/lib/auth'
import { validateEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, planId } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // SPECIAL TESTING FEATURE: Create enterprise account if it doesn't exist and has a specific suffix
    console.log('LOGIN_DEBUG: Checking user for email:', email.toLowerCase().trim());
    let user = await getUserByEmail(email.toLowerCase().trim())
    console.log('LOGIN_DEBUG: User found in DB:', !!user);
    
    if (!user && email.toLowerCase().endsWith('@affilify-enterprise.test')) {
      console.log('LOGIN_DEBUG: Auto-creating enterprise user...');
      const { createUser } = await import('@/lib/auth')
      const newUser = await createUser({
        name: 'Enterprise Tester',
        email: email.toLowerCase().trim(),
        password: password,
        plan: 'enterprise'
      })
      console.log('LOGIN_DEBUG: New user created:', !!newUser);
      if (newUser) {
        user = await getUserByEmail(email.toLowerCase().trim())
        console.log('LOGIN_DEBUG: User fetched after creation:', !!user);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('LOGIN_DEBUG: Verifying password for user:', user.email);
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('LOGIN_DEBUG: Password valid:', isValidPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user.id)

    // Define Stripe links
    const STRIPE_LINKS: Record<string, string> = {
      pro: 'https://buy.stripe.com/aFa5kD1kNaRpe991lP8IU00',
      enterprise: 'https://buy.stripe.com/28EcN56F7cZx1mn7Kd8IU01',
    }

    // Check for upgrade intent and redirect if necessary
    if (planId && STRIPE_LINKS[planId]) {
      const redirectResponse = NextResponse.redirect(STRIPE_LINKS[planId], 302)
      redirectResponse.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return redirectResponse
    }

    // If no upgrade, create a standard success response
    const successResponse = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        websitesCreated: user.websitesCreated,
        websiteLimit: user.websiteLimit,
        analysesUsed: user.analysesUsed,
        analysisLimit: user.analysisLimit,
      },
    })

    // Set auth cookie on the success response
    successResponse.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return successResponse
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


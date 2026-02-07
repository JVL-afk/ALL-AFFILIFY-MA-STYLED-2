# Implementation Fix - Step by Step

## Quick Summary

The JWT token doesn't include the user's plan, causing middleware (likely on Vercel) to default all users to 'basic' plan and redirect them from premium features to the pricing page.

## Fix: Include Plan in JWT Token

### Step 1: Update `generateToken` function

**File:** `src/lib/auth.ts`

**Find this code (lines 43-46):**
```typescript
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1'
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}
```

**Replace with:**
```typescript
export async function generateToken(userId: string): Promise<string> {
  const secret = process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1'
  
  // Fetch user from database to get their plan
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Include both userId and plan in the token
  return jwt.sign({ 
    userId,
    plan: user.plan 
  }, secret, { expiresIn: '7d' })
}
```

### Step 2: Update login route to use async generateToken

**File:** `src/app/api/auth/login/route.ts`

**Find this code (line 81):**
```typescript
// Generate token
const token = generateToken(user.id)
```

**Replace with:**
```typescript
// Generate token
const token = await generateToken(user.id)
```

### Step 3: Test the fix

1. Commit and push changes to GitHub
2. Deploy to Vercel (should auto-deploy)
3. Test with enterprise credentials:
   - Email: `test@affilify-enterprise.test`
   - Password: any password (bypassed for test accounts)
4. Verify you can access `/dashboard/enterprise` without being redirected

## Why This Works

1. **Before:** JWT token = `{ userId: "123..." }`
2. **After:** JWT token = `{ userId: "123...", plan: "enterprise" }`

When middleware checks the token, it will now find the plan and allow access to enterprise features.

## Alternative: Check if Middleware Exists on Vercel

If you want to verify if there's middleware on Vercel:

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Functions
4. Check if there's a middleware function listed

If there's no middleware, the issue might be elsewhere, but this fix is still beneficial for future-proofing.

## Rollback Plan

If this fix causes issues, you can rollback by:

1. Reverting the changes to `generateToken`
2. Redeploying the previous version

The changes are minimal and isolated to the authentication logic.

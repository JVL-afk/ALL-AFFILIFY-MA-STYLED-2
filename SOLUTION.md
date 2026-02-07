# Solution: Fix Dashboard Redirect Issue for Enterprise/Pro Users

## Problem Summary

Enterprise and Pro plan users are being redirected from the dashboard to the pricing page immediately after login, despite successful authentication.

## Root Cause

After extensive investigation, the root cause is:

**The JWT token generated during login does NOT include the user's plan information in its payload.**

### Evidence:

1. **Token Generation** (`src/lib/auth.ts` lines 43-46):
```typescript
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || '...'
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}
```
The token ONLY contains `userId` - no plan information.

2. **Deployed Middleware**: While there's no `middleware.ts` in the repository, the deployed version on Vercel likely has middleware that:
   - Extracts the JWT token
   - Tries to read the plan from the token payload
   - Defaults to `'basic'` when no plan is found
   - Redirects users trying to access premium features to `/pricing`

3. **The 307 Redirects**: The logs show multiple 307 redirects for enterprise features:
   - `/dashboard/enterprise` → 307
   - `/dashboard/team-collaboration` → 307
   - `/dashboard/api-management` → 307
   - etc.

These redirects are happening because the middleware thinks the user has a `'basic'` plan (since the token doesn't contain plan info), and therefore blocks access to enterprise features.

## Solution

### Option 1: Include Plan in JWT Token (RECOMMENDED)

Modify the `generateToken` function to include the user's plan in the JWT payload.

**File:** `src/lib/auth.ts`

**Current Code (lines 43-46):**
```typescript
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1'
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}
```

**Fixed Code:**
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

**Important:** Since `generateToken` is now async, you'll need to update all calls to it:

**File:** `src/app/api/auth/login/route.ts` (line 81)

**Current:**
```typescript
const token = generateToken(user.id)
```

**Fixed:**
```typescript
const token = await generateToken(user.id)
```

### Option 2: Create Middleware File (If Missing on Vercel)

If the deployed version has middleware that's not in the repository, you need to either:

1. **Remove the middleware** - Delete or disable it on Vercel
2. **Fix the middleware** - Update it to fetch the user's plan from the database instead of relying on the token

However, **Option 1 is strongly recommended** because:
- It's more efficient (no database lookup in middleware)
- It's consistent with the existing architecture
- It's easier to maintain

## Implementation Steps

1. **Update `generateToken` function** in `src/lib/auth.ts` to include plan in JWT
2. **Update all calls to `generateToken`** to use `await` since it's now async
3. **Test locally** with enterprise credentials
4. **Deploy to Vercel**
5. **Verify** that enterprise users can access their dashboard

## Files to Modify

1. `src/lib/auth.ts` - Update `generateToken` function
2. `src/app/api/auth/login/route.ts` - Add `await` to `generateToken` call

## Testing

After implementing the fix, test with:
1. Enterprise credentials: `test@affilify-enterprise.test` / any password
2. Pro credentials: Create a pro user and test
3. Basic credentials: Ensure basic users still work correctly

## Additional Notes

- The `proxy.ts` file in `src/` is NOT being used as middleware (it's not in the correct location and not exported as `middleware`)
- The actual middleware might be configured on Vercel directly or generated during build
- This fix ensures the JWT token contains all necessary information for authorization decisions

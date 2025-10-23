import { Suspense } from 'react'
import LoginContent from '@/components/LoginContent'
import { Loader2 } from 'lucide-react'

// The main page is now a Server Component (default in App Router)
// The logic that uses useSearchParams is moved to LoginContent.tsx (a Client Component)
// We wrap the Client Component in <Suspense> to resolve the build error.

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-8 text-white">
    <Loader2 className="w-8 h-8 mr-2 animate-spin text-orange-500" />
    <p className="mt-4">Loading login form...</p>
  </div>
)

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-black flex items-center justify-center">
      {/* The Suspense boundary is required because LoginContent uses useSearchParams */}
      <Suspense fallback={<LoadingFallback />}>
        <LoginContent />
      </Suspense>
    </div>
  )
}

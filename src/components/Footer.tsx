import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl mb-4">
              <span className="text-orange-500">⚡</span>
              <span>AFFILIFY</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate AI-powered affiliate marketing platform. Create stunning websites, analyze performance, 
              and maximize your revenue with cutting-edge technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/proof" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Proof
                </Link> 
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-me" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 AFFILIFY. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Made with <span className="text-red-500">❤️</span> for affiliate marketers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}


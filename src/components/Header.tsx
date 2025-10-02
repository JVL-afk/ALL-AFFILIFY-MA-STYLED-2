'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:text-orange-400 transition-colors">
            <span className="text-orange-500">⚡</span>
            <span>AFFILIFY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="nav-badge text-white hover:text-blue-400 transition-colors font-medium"
              data-badge="2"
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className="nav-badge text-white hover:text-green-400 transition-colors font-medium"
              data-badge="3"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="nav-badge text-white hover:text-yellow-400 transition-colors font-medium"
              data-badge="4"
            >
              Pricing
            </Link>
            <Link 
              href="/docs" 
              className="nav-badge text-white hover:text-purple-400 transition-colors font-medium"
              data-badge="5"
            >
              Documentation
            </Link>
  
            <Link 
              href="/login" 
              className="nav-badge text-white hover:text-pink-400 transition-colors font-medium"
              data-badge="7"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="nav-badge btn-primary text-white px-6 py-2 rounded-lg font-medium"
              data-badge="8"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/" 
                className="text-white hover:text-blue-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="text-white hover:text-green-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-white hover:text-yellow-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/docs" 
                className="text-white hover:text-purple-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link 
                href="/about-me" 
                className="text-white hover:text-green-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Me
              </Link>
              <Link 
                href="/login" 
                className="text-white hover:text-pink-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn-primary text-white px-6 py-2 rounded-lg font-medium inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}


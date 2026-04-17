'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Link as LinkIcon, 
  Layout as AdIcon, 
  Package as ProductIcon, 
  Handshake as SponsorIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export type MonetizationMethod = 'affiliateLinks' | 'displayAds' | 'digitalProducts' | 'sponsorships'

interface MonetizationCarouselProps {
  selectedMethod: MonetizationMethod
  onMethodChange: (method: MonetizationMethod) => void
  userPlan: 'basic' | 'pro' | 'enterprise'
}

const methods: { id: MonetizationMethod; label: string; icon: any; minPlan: string }[] = [
  { id: 'affiliateLinks', label: 'Affiliate Links', icon: LinkIcon, minPlan: 'basic' },
  { id: 'displayAds', label: 'Display Ads', icon: AdIcon, minPlan: 'pro' },
  { id: 'digitalProducts', label: 'Digital Products', icon: ProductIcon, minPlan: 'pro' },
  { id: 'sponsorships', label: 'Sponsorships', icon: SponsorIcon, minPlan: 'enterprise' }
]

export function MonetizationCarousel({ selectedMethod, onMethodChange, userPlan }: MonetizationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const isLocked = (minPlan: string) => {
    if (userPlan === 'enterprise') return false
    if (userPlan === 'pro' && minPlan === 'enterprise') return true
    if (userPlan === 'basic' && minPlan !== 'basic') return true
    return false
  }

  return (
    <div className="relative w-full group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Monetization Strategy</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {methods.map((method) => {
          const locked = isLocked(method.minPlan)
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <motion.button
              key={method.id}
              whileHover={!locked ? { scale: 1.02 } : {}}
              whileTap={!locked ? { scale: 0.98 } : {}}
              onClick={() => !locked && onMethodChange(method.id)}
              className={`
                flex-shrink-0 w-48 p-4 rounded-xl border transition-all duration-300 text-left
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'}
                ${locked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
              `}
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${isSelected ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}
              `}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-white mb-1">{method.label}</div>
              <div className="text-xs text-gray-400">
                {locked ? `Requires ${method.minPlan.charAt(0).toUpperCase() + method.minPlan.slice(1)}` : 'Available on your plan'}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

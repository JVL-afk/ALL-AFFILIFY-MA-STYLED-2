'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X } from 'lucide-react'
import { MonetizationCarousel, MonetizationMethod } from './MonetizationCarousel'
import { MonetizationFormFields } from './MonetizationFormFields'

interface MonetizationEditModalProps {
  isOpen: boolean
  onClose: () => void
  website: any
  userPlan: 'basic' | 'pro' | 'enterprise'
  onSave: (updatedMonetization: any) => Promise<void>
}

export function MonetizationEditModal({ isOpen, onClose, website, userPlan, onSave }: MonetizationEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<MonetizationMethod>(
    website?.monetization?.primaryMethod || 'affiliateLinks'
  )
  const [monetizationData, setMonetizationData] = useState<any>(
    website?.monetization || {
      primaryMethod: 'affiliateLinks',
      affiliateLinks: { productUrl: '', affiliateId: '', affiliateType: 'link', subId: '' },
      displayAds: { enabled: false, adsensePublisherId: '', premiumAdNetworkId: '' },
      digitalProducts: { name: '', description: '', salesPageUrl: '' },
      sponsorships: { enabled: false, pitch: '' },
      secondaryMethods: {
        emailSignup: { enabled: false, espFormActionUrl: '', leadMagnetDownloadUrl: '' },
        customTrackingScript: { enabled: false, headerScript: '', bodyScript: '' }
      }
    }
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave({
        ...monetizationData,
        primaryMethod: selectedMethod
      })
      onClose()
    } catch (error) {
      console.error('Error saving monetization:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Edit Monetization: {website?.name || website?.title}
            </h2>
            <p className="text-gray-400 text-sm">
              Update your tracking IDs, ad placements, and monetization strategy.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <MonetizationCarousel 
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            userPlan={userPlan}
          />

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <MonetizationFormFields 
              method={selectedMethod}
              userPlan={userPlan}
              data={monetizationData}
              onChange={setMonetizationData}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Monetization
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

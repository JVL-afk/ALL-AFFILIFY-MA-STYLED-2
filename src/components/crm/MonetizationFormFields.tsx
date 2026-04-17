'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MonetizationMethod } from './MonetizationCarousel'

interface MonetizationFormFieldsProps {
  method: MonetizationMethod
  userPlan: 'basic' | 'pro' | 'enterprise'
  data: any
  onChange: (data: any) => void
}

export function MonetizationFormFields({ method, userPlan, data, onChange }: MonetizationFormFieldsProps) {
  const updateNestedData = (category: string, field: string, value: any) => {
    onChange({
      ...data,
      [category]: {
        ...data[category],
        [field]: value
      }
    })
  }

  const renderAffiliateLinks = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productUrl">Product/Affiliate URL</Label>
          <Input 
            id="productUrl" 
            placeholder="https://amazon.com/dp/..." 
            value={data.affiliateLinks?.productUrl || ''}
            onChange={(e) => updateNestedData('affiliateLinks', 'productUrl', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="affiliateId">Affiliate ID (Optional)</Label>
          <Input 
            id="affiliateId" 
            placeholder="e.g. yourtag-20" 
            value={data.affiliateLinks?.affiliateId || ''}
            onChange={(e) => updateNestedData('affiliateLinks', 'affiliateId', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subId">Campaign SubID (Tracking)</Label>
        <Input 
          id="subId" 
          placeholder="e.g. summer_sale_2024" 
          value={data.affiliateLinks?.subId || ''}
          onChange={(e) => updateNestedData('affiliateLinks', 'subId', e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
        <p className="text-xs text-gray-400">This will be appended to your links for granular tracking.</p>
      </div>
    </div>
  )

  const renderDisplayAds = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="adsenseId">Google AdSense Publisher ID</Label>
        <Input 
          id="adsenseId" 
          placeholder="pub-xxxxxxxxxxxxxxxx" 
          value={data.displayAds?.adsensePublisherId || ''}
          onChange={(e) => updateNestedData('displayAds', 'adsensePublisherId', e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      {userPlan === 'enterprise' && (
        <div className="space-y-2">
          <Label htmlFor="premiumNetwork">Premium Ad Network ID (Mediavine/Raptive)</Label>
          <Input 
            id="premiumNetwork" 
            placeholder="Network ID or Script URL" 
            value={data.displayAds?.premiumAdNetworkId || ''}
            onChange={(e) => updateNestedData('displayAds', 'premiumAdNetworkId', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      )}
    </div>
  )

  const renderDigitalProducts = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name</Label>
        <Input 
          id="productName" 
          placeholder="e.g. The Ultimate Affiliate Guide" 
          value={data.digitalProducts?.name || ''}
          onChange={(e) => updateNestedData('digitalProducts', 'name', e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="salesPage">Sales Page / Checkout URL</Label>
        <Input 
          id="salesPage" 
          placeholder="https://yourstore.com/product" 
          value={data.digitalProducts?.salesPageUrl || ''}
          onChange={(e) => updateNestedData('digitalProducts', 'salesPageUrl', e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
    </div>
  )

  const renderSponsorships = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sponsorPitch">Sponsorship Pitch / Media Kit Link</Label>
        <Textarea 
          id="sponsorPitch" 
          placeholder="Describe what kind of sponsors you are looking for..." 
          value={data.sponsorships?.pitch || ''}
          onChange={(e) => updateNestedData('sponsorships', 'pitch', e.target.value)}
          className="bg-white/5 border-white/10 text-white min-h-[100px]"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <h4 className="text-sm font-bold text-blue-400 mb-1 uppercase tracking-wider">
          Configuring: {method.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <p className="text-xs text-gray-400">
          Provide the details below to integrate this monetization method into your AI-generated website.
        </p>
      </div>

      {method === 'affiliateLinks' && renderAffiliateLinks()}
      {method === 'displayAds' && renderDisplayAds()}
      {method === 'digitalProducts' && renderDigitalProducts()}
      {method === 'sponsorships' && renderSponsorships()}

      <div className="pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Additional Integrations</h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input 
              type="checkbox"
              id="emailSignup" 
              checked={data.secondaryMethods?.emailSignup?.enabled || false}
              onChange={(e) => updateNestedData('secondaryMethods', 'emailSignup', { ...data.secondaryMethods?.emailSignup, enabled: e.target.checked })}
              className="w-4 h-4 mt-1 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
            />
            <div className="space-y-1">
              <Label htmlFor="emailSignup" className="text-white">Email Newsletter Integration</Label>
              <p className="text-xs text-gray-400">Add a lead capture form to your website.</p>
              {data.secondaryMethods?.emailSignup?.enabled && (
                <div className="pt-2 space-y-2">
                  <Input 
                    placeholder="ESP Form Action URL (Mailchimp, etc.)" 
                    value={data.secondaryMethods?.emailSignup?.espFormActionUrl || ''}
                    onChange={(e) => updateNestedData('secondaryMethods', 'emailSignup', { ...data.secondaryMethods?.emailSignup, espFormActionUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {userPlan === 'enterprise' && (
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox"
                id="customTracking" 
                checked={data.secondaryMethods?.customTrackingScript?.enabled || false}
                onChange={(e) => updateNestedData('secondaryMethods', 'customTrackingScript', { ...data.secondaryMethods?.customTrackingScript, enabled: e.target.checked })}
                className="w-4 h-4 mt-1 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-1">
                <Label htmlFor="customTracking" className="text-white">Custom Tracking Scripts</Label>
                <p className="text-xs text-gray-400">Inject custom pixels or analytics scripts.</p>
                {data.secondaryMethods?.customTrackingScript?.enabled && (
                  <div className="pt-2 space-y-2">
                    <Textarea 
                      placeholder="Paste your script here (will be added to <head>)" 
                      value={data.secondaryMethods?.customTrackingScript?.headerScript || ''}
                      onChange={(e) => updateNestedData('secondaryMethods', 'customTrackingScript', { ...data.secondaryMethods?.customTrackingScript, headerScript: e.target.value })}
                      className="bg-white/5 border-white/10 text-white text-sm min-h-[80px]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

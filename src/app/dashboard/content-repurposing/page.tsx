'use client';

import React, { useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface RepurposingAsset {
  id: string;
  type: 'social-clips' | 'podcast-snippet' | 'quote-graphics' | 'ad-variants';
  count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  preview?: string;
}

interface Website {
  _id: string;
  title: string;
  description: string;
  url?: string;
  views: number;
  clicks: number;
  conversions: number;
}

export default function ContentRepurposingPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [repurposingAssets, setRepurposingAssets] = useState<RepurposingAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState({
    socialClips: true,
    podcastSnippet: true,
    quoteGraphics: true,
    adVariants: true,
  });

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/websites');
      if (response.ok) {
        const data = await response.json();
        setWebsites(data.websites || []);
        if (data.websites && data.websites.length > 0) {
          setSelectedWebsite(data.websites[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepurpose = async () => {
    if (!selectedWebsite) return;

    setIsRepurposing(true);
    try {
      const includeTypes = [];
      if (selectedAssetTypes.socialClips) includeTypes.push('social-clips');
      if (selectedAssetTypes.podcastSnippet) includeTypes.push('podcast-snippet');
      if (selectedAssetTypes.quoteGraphics) includeTypes.push('quote-graphics');
      if (selectedAssetTypes.adVariants) includeTypes.push('ad-variants');

      const response = await fetch('/api/ai/repurpose-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: selectedWebsite,
          sourceType: 'website',
          includeTypes,
          targetPlatforms: ['tiktok', 'instagram', 'youtube-shorts'],
          demographics: ['young-professionals', 'parents', 'enthusiasts'],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new assets to the list
        const newAssets: RepurposingAsset[] = [];
        if (data.assets.socialClips > 0) {
          newAssets.push({
            id: `social-${Date.now()}`,
            type: 'social-clips',
            count: data.assets.socialClips,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
        if (data.assets.podcastSnippet) {
          newAssets.push({
            id: `podcast-${Date.now()}`,
            type: 'podcast-snippet',
            count: 1,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
        if (data.assets.quoteGraphics > 0) {
          newAssets.push({
            id: `quotes-${Date.now()}`,
            type: 'quote-graphics',
            count: data.assets.quoteGraphics,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
        if (data.assets.adVariants > 0) {
          newAssets.push({
            id: `ads-${Date.now()}`,
            type: 'ad-variants',
            count: data.assets.adVariants,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
        setRepurposingAssets([...newAssets, ...repurposingAssets]);
      }
    } catch (error) {
      console.error('Error repurposing content:', error);
    } finally {
      setIsRepurposing(false);
    }
  };

  const toggleAssetType = (type: keyof typeof selectedAssetTypes) => {
    setSelectedAssetTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getAssetTypeLabel = (type: string): string => {
    switch (type) {
      case 'social-clips':
        return '📱 Social Media Clips';
      case 'podcast-snippet':
        return '🎙️ Podcast Snippet';
      case 'quote-graphics':
        return '🎨 Quote Graphics';
      case 'ad-variants':
        return '📊 Ad Variants';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Repurposing</h1>
          <p className="text-slate-400">
            Transform your affiliate websites into multi-channel marketing campaigns
          </p>
        </div>

        {/* Website Selection */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white font-semibold mb-3 block">
                Select Website to Repurpose
              </Label>
              {isLoading ? (
                <div className="text-slate-400">Loading websites...</div>
              ) : websites.length === 0 ? (
                <div className="text-slate-400">
                  No websites found.{' '}
                  <Link href="/dashboard/create-website" className="text-green-400 hover:text-green-300">
                    Create one now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {websites.map((website) => (
                    <button
                      key={website._id}
                      onClick={() => setSelectedWebsite(website._id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedWebsite === website._id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <h3 className="font-semibold text-white mb-1">{website.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">{website.description}</p>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>👁️ {website.views} views</span>
                        <span>🔗 {website.clicks} clicks</span>
                        <span>✅ {website.conversions} conversions</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Asset Type Selection */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Select Asset Types to Generate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'socialClips', label: '📱 Social Media Clips (TikTok, Instagram, YouTube)' },
                { key: 'podcastSnippet', label: '🎙️ Podcast Snippet with Voiceover' },
                { key: 'quoteGraphics', label: '🎨 Shareable Quote Graphics' },
                { key: 'adVariants', label: '📊 Personalized Ad Variants' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 bg-slate-700/50 hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssetTypes[key as keyof typeof selectedAssetTypes]}
                    onChange={() => toggleAssetType(key as keyof typeof selectedAssetTypes)}
                    className="w-4 h-4 rounded border-slate-500 bg-slate-600 accent-green-500"
                  />
                  <span className="text-white font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleRepurpose}
            disabled={!selectedWebsite || isRepurposing}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:opacity-50 text-lg py-6"
          >
            {isRepurposing ? '⏳ Repurposing Content...' : '🚀 Repurpose Content'}
          </Button>
        </div>

        {/* Generated Assets */}
        {repurposingAssets.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Generated Assets</h2>
              <div className="space-y-3">
                {repurposingAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-600 bg-slate-700/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {getAssetTypeLabel(asset.type)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {asset.count} {asset.type === 'podcast-snippet' ? 'snippet' : 'items'} •{' '}
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          asset.status
                        )}`}
                      >
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                      <Button
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50 p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-green-400">✨ Multi-Channel Mastery</h3>
            <p className="text-sm text-slate-300">
              With one click, transform your high-converting website into a complete marketing
              ecosystem. Generate social media clips for viral reach, podcast snippets for audio
              audiences, quote graphics for engagement, and personalized ad variants for maximum
              ROI.
            </p>
            <p className="text-xs text-slate-400">
              All assets are automatically optimized for their respective platforms and audiences.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

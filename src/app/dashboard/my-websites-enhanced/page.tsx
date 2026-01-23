'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Website {
  _id: string;
  title: string;
  description: string;
  url?: string;
  views: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  multimedia?: {
    videoAssets?: any[];
  };
}

export default function MyWebsitesEnhancedPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);

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
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConversionRate = (clicks: number, conversions: number): string => {
    if (clicks === 0) return '0%';
    return ((conversions / clicks) * 100).toFixed(1) + '%';
  };

  const getVideoAssetCount = (website: Website): number => {
    return website.multimedia?.videoAssets?.length || 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Websites</h1>
          <p className="text-slate-400">
            Manage your affiliate websites and generate multimedia content
          </p>
        </div>

        {/* Create New Website Button */}
        <Link href="/dashboard/create-website">
          <Button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 text-lg">
            + Create New Website
          </Button>
        </Link>

        {/* Websites Grid */}
        {isLoading ? (
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 text-center">
            <div className="animate-pulse text-slate-400">Loading your websites...</div>
          </Card>
        ) : websites.length === 0 ? (
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🌐</div>
              <h2 className="text-xl font-bold text-white">No Websites Yet</h2>
              <p className="text-slate-400">Create your first affiliate website to get started</p>
              <Link href="/dashboard/create-website">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Create Website
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {websites.map((website) => (
              <Card
                key={website._id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
              >
                <div className="p-6 space-y-4">
                  {/* Website Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{website.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{website.description}</p>
                      </div>
                      {website.url && (
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm font-medium ml-2"
                        >
                          🔗
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{website.views}</div>
                      <div className="text-xs text-slate-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{website.clicks}</div>
                      <div className="text-xs text-slate-400">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{website.conversions}</div>
                      <div className="text-xs text-slate-400">Conversions</div>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Conversion Rate</span>
                      <span className="text-lg font-bold text-yellow-400">
                        {calculateConversionRate(website.clicks, website.conversions)}
                      </span>
                    </div>
                  </div>

                  {/* Multimedia Status */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Video Assets</span>
                      <span className="text-lg font-bold text-cyan-400">
                        {getVideoAssetCount(website)} 🎬
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700">
                    <Link href={`/dashboard/media-studio?websiteId=${website._id}`}>
                      <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm">
                        🎬 Media Studio
                      </Button>
                    </Link>
                    <Link href="/dashboard/content-repurposing">
                      <Button
                        onClick={() => setSelectedWebsite(website._id)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
                      >
                        🔄 Repurpose
                      </Button>
                    </Link>
                  </div>

                  {/* Additional Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/code-editor?websiteId=${website._id}`}>
                      <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700 text-sm">
                        ✏️ Edit Code
                      </Button>
                    </Link>
                    <Link href={`/dashboard/analyze-website?websiteId=${website._id}`}>
                      <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700 text-sm">
                        📊 Analyze
                      </Button>
                    </Link>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-slate-500 pt-2">
                    Created {new Date(website.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50 p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-green-400">🚀 Multimedia Superpowers</h3>
            <p className="text-sm text-slate-300">
              Each website can now be transformed into a complete multimedia campaign. Use the
              <span className="font-semibold text-green-400"> Media Studio</span> to create
              professional video scripts, then click <span className="font-semibold text-green-400">Repurpose</span> to
              generate social clips, podcast snippets, quote graphics, and personalized ad variants—all
              optimized for maximum engagement and conversions.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

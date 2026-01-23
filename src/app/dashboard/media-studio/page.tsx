'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MediaStudio } from '@/components/MediaStudio';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Website {
  _id: string;
  title: string;
  description: string;
  multimedia?: {
    videoScript?: {
      hook: string;
      story: string;
      offer: string;
      fullScript: string;
    };
  };
}

export default function MediaStudioPage() {
  const searchParams = useSearchParams();
  const websiteId = searchParams.get('websiteId');
  const [website, setWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (websiteId) {
      fetchWebsite();
    }
  }, [websiteId]);

  const fetchWebsite = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/websites/${websiteId}`);
      if (response.ok) {
        const data = await response.json();
        setWebsite(data.website);
      }
    } catch (error) {
      console.error('Error fetching website:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScript = async (script: any) => {
    if (!websiteId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/websites/${websiteId}/multimedia`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoScript: {
            hook: script.hook,
            story: script.story,
            offer: script.offer,
            fullScript: script.fullScript,
          },
          avatarId: script.avatarId,
          voiceId: script.voiceId,
        }),
      });

      if (response.ok) {
        // Refresh website data
        await fetchWebsite();
      }
    } catch (error) {
      console.error('Error saving script:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!websiteId) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Media Studio</h1>
            <p className="text-slate-400">
              Create and refine video scripts for your affiliate websites
            </p>
          </div>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎬</div>
              <h2 className="text-xl font-bold text-white">No Website Selected</h2>
              <p className="text-slate-400">
                Please select a website to start creating video scripts
              </p>
              <Link href="/dashboard/my-websites">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Go to My Websites
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Media Studio</h1>
            <p className="text-slate-400">Loading...</p>
          </div>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 text-center">
            <div className="animate-pulse text-slate-400">Loading website data...</div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!website) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Media Studio</h1>
            <p className="text-slate-400">Website not found</p>
          </div>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 text-center">
            <div className="space-y-4">
              <p className="text-slate-400">The website you're looking for doesn't exist.</p>
              <Link href="/dashboard/my-websites">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Go to My Websites
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Media Studio</h1>
              <p className="text-slate-400">
                Creating videos for: <span className="text-green-400 font-semibold">{website.title}</span>
              </p>
            </div>
            <Link href="/dashboard/my-websites">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                ← Back to Websites
              </Button>
            </Link>
          </div>
        </div>

        {/* Media Studio Component */}
        <MediaStudio
          websiteId={websiteId}
          initialScript={website.multimedia?.videoScript}
          onSave={handleSaveScript}
        />

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/dashboard/media-studio?websiteId=${websiteId}`}>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white justify-start">
                  <span className="mr-2">🎬</span> Generate Video
                </Button>
              </Link>
              <Link href="/dashboard/content-repurposing">
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white justify-start">
                  <span className="mr-2">🔄</span> Repurpose Content
                </Button>
              </Link>
              <Link href={`/dashboard/my-websites`}>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white justify-start">
                  <span className="mr-2">📊</span> View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Tips Box */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700/50 p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-400">💡 Script Writing Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-blue-400">Hook:</span> Start with a bold statement
                or question that immediately captures attention (3-5 seconds)
              </li>
              <li>
                <span className="font-semibold text-blue-400">Story:</span> Build a narrative that
                articulates the problem, showcases your solution, and highlights benefits (main body)
              </li>
              <li>
                <span className="font-semibold text-blue-400">Offer:</span> End with a clear,
                compelling call-to-action that drives viewers to click your affiliate link
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MediaStudioProps {
  websiteId: string;
  initialScript?: {
    hook: string;
    story: string;
    offer: string;
    fullScript: string;
  };
  onSave?: (script: any) => void;
}

const MediaStudio: React.FC<MediaStudioProps> = ({
  websiteId,
  initialScript,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'composition' | 'full'>('script');
  const [hook, setHook] = useState(initialScript?.hook || '');
  const [story, setStory] = useState(initialScript?.story || '');
  const [offer, setOffer] = useState(initialScript?.offer || '');
  const [fullScript, setFullScript] = useState(initialScript?.fullScript || '');
  const [selectedAvatar, setSelectedAvatar] = useState('default-avatar');
  const [selectedVoice, setSelectedVoice] = useState('default-voice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Calculate estimated duration based on word count
  const estimateDuration = (text: string): number => {
    const wordCount = text.split(/\s+/).length;
    return Math.ceil((wordCount / 150) * 60); // 150 words per minute
  };

  const estimatedDuration = estimateDuration(fullScript);

  const handleScriptChange = (field: string, value: string) => {
    switch (field) {
      case 'hook':
        setHook(value);
        break;
      case 'story':
        setStory(value);
        break;
      case 'offer':
        setOffer(value);
        break;
      case 'full':
        setFullScript(value);
        break;
    }
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (onSave) {
      onSave({
        hook,
        story,
        offer,
        fullScript,
        avatarId: selectedAvatar,
        voiceId: selectedVoice,
      });
    }
    setUnsavedChanges(false);
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId,
          videoType: 'explainer',
          script: fullScript,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewUrl(data.videoUrl);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Media Studio</h2>
          <p className="text-sm text-slate-400">
            Create and refine your video scripts with real-time preview
          </p>
        </div>
        {unsavedChanges && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-amber-400">Unsaved changes</span>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Save Script
            </Button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        {(['script', 'composition', 'full'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'script' && 'Script Editor'}
            {tab === 'composition' && 'Composition'}
            {tab === 'full' && 'Full Script'}
          </button>
        ))}
      </div>

      {/* Script Editor Tab */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Hook Section */}
            <div className="space-y-2">
              <Label htmlFor="hook" className="text-white font-semibold">
                Hook (First 3-5 seconds)
              </Label>
              <Textarea
                id="hook"
                value={hook}
                onChange={(e) => handleScriptChange('hook', e.target.value)}
                placeholder="Enter your attention-grabbing opening line..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500"
                rows={3}
              />
              <div className="text-xs text-slate-400">
                {hook.split(/\s+/).length} words • ~{estimateDuration(hook)}s
              </div>
            </div>

            {/* Story Section */}
            <div className="space-y-2">
              <Label htmlFor="story" className="text-white font-semibold">
                Story (Main Narrative)
              </Label>
              <Textarea
                id="story"
                value={story}
                onChange={(e) => handleScriptChange('story', e.target.value)}
                placeholder="Tell the product's story - problem, solution, benefits..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500"
                rows={5}
              />
              <div className="text-xs text-slate-400">
                {story.split(/\s+/).length} words • ~{estimateDuration(story)}s
              </div>
            </div>

            {/* Offer Section */}
            <div className="space-y-2">
              <Label htmlFor="offer" className="text-white font-semibold">
                Offer (Call-to-Action)
              </Label>
              <Textarea
                id="offer"
                value={offer}
                onChange={(e) => handleScriptChange('offer', e.target.value)}
                placeholder="End with a compelling call-to-action..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500"
                rows={3}
              />
              <div className="text-xs text-slate-400">
                {offer.split(/\s+/).length} words • ~{estimateDuration(offer)}s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composition Tab */}
      {activeTab === 'composition' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar Selector */}
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-white font-semibold">
                Select Avatar
              </Label>
              <select
                id="avatar"
                value={selectedAvatar}
                onChange={(e) => setSelectedAvatar(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
              >
                <option value="default-avatar">Professional (Default)</option>
                <option value="casual-avatar">Casual & Friendly</option>
                <option value="expert-avatar">Expert & Authoritative</option>
                <option value="energetic-avatar">Energetic & Enthusiastic</option>
              </select>
              <div className="mt-4 h-32 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-slate-300">Avatar Preview</p>
                </div>
              </div>
            </div>

            {/* Voice Selector */}
            <div className="space-y-2">
              <Label htmlFor="voice" className="text-white font-semibold">
                Select Voice
              </Label>
              <select
                id="voice"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-green-500 focus:ring-green-500"
              >
                <option value="default-voice">Professional Voice (Default)</option>
                <option value="warm-voice">Warm & Friendly</option>
                <option value="energetic-voice">Energetic & Dynamic</option>
                <option value="calm-voice">Calm & Soothing</option>
              </select>
              <div className="mt-4 h-32 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎙️</div>
                  <p className="text-sm text-slate-300">Voice Preview</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scene Composition Preview */}
          <div className="space-y-2">
            <Label className="text-white font-semibold">Scene Composition</Label>
            <div className="bg-slate-700 rounded-lg border border-slate-600 p-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg border border-slate-500 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">📹</div>
                      <p className="text-xs text-slate-400">Scene {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Script Tab */}
      {activeTab === 'full' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullScript" className="text-white font-semibold">
              Complete Video Script
            </Label>
            <Textarea
              id="fullScript"
              value={fullScript}
              onChange={(e) => handleScriptChange('full', e.target.value)}
              placeholder="Your complete video narration will appear here..."
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500 font-mono text-sm"
              rows={12}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{fullScript.split(/\s+/).length} words</span>
              <span>Estimated duration: ~{estimatedDuration}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {previewUrl && (
        <div className="space-y-2">
          <Label className="text-white font-semibold">Video Preview</Label>
          <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
            <video
              src={previewUrl}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button
          onClick={handleGenerateVideo}
          disabled={isGenerating || !fullScript}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:opacity-50"
        >
          {isGenerating ? 'Generating Video...' : 'Generate Video'}
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          className="flex-1 border-slate-600 text-white hover:bg-slate-700"
        >
          Save & Continue
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-green-400">💡 Pro Tip:</span> Your video script
          should follow the "Hook, Story, Offer" framework for maximum conversion. The hook
          captures attention, the story builds desire, and the offer drives action.
        </p>
      </div>
    </div>
  );
};

export default MediaStudio;

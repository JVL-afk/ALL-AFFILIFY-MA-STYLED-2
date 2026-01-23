import { ObjectId } from 'mongodb';

/**
 * Extended multimedia types for Synthesise AI integration
 * These types extend the core AFFILIFY platform with video, voice, and content repurposing capabilities
 */

// Video Asset Types
export interface VideoAsset {
  _id?: ObjectId;
  type: 'explainer' | 'review' | 'social' | 'ad-variant';
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  script: string;
  avatarId?: string;
  voiceId?: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    resolution?: string;
    format?: string;
    fileSize?: number;
    processingTime?: number;
  };
}

// Voice Asset Types
export interface VoiceAsset {
  _id?: ObjectId;
  voiceId: string;
  name: string;
  type: 'synthesized' | 'cloned';
  language: string;
  accent?: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // -20 to 20
  audioUrl?: string;
  sampleUrl?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Avatar Configuration Types
export interface AvatarConfig {
  _id?: ObjectId;
  avatarId: string;
  name: string;
  description: string;
  imageUrl: string;
  niche: string; // e.g., 'tech', 'fitness', 'lifestyle'
  tone: 'professional' | 'casual' | 'enthusiastic' | 'authoritative';
  isDefault: boolean;
  metadata?: {
    gender?: string;
    ethnicity?: string;
    age?: string;
  };
  createdAt: Date;
}

// Video Script Types
export interface VideoScript {
  _id?: ObjectId;
  websiteId: ObjectId | string;
  userId: ObjectId | string;
  title: string;
  hook: string; // Opening line (Hook)
  story: string; // Main narrative (Story)
  offer: string; // Call-to-action (Offer)
  fullScript: string; // Complete narration
  duration: number; // Estimated duration in seconds
  keyframes?: Array<{
    timestamp: number;
    description: string;
    imageUrl?: string;
  }>;
  status: 'draft' | 'approved' | 'in-production' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Content Repurposing Types
export interface ContentRepurposing {
  _id?: ObjectId;
  userId: ObjectId | string;
  websiteId: ObjectId | string;
  sourceType: 'website' | 'video' | 'article';
  repurposedAssets: {
    socialClips?: {
      _id?: ObjectId;
      videoUrl: string;
      platform: 'tiktok' | 'instagram' | 'youtube-shorts';
      duration: number;
      captions: string;
      createdAt: Date;
    }[];
    podcastSnippet?: {
      _id?: ObjectId;
      audioUrl: string;
      transcript: string;
      duration: number;
      createdAt: Date;
    };
    quoteGraphics?: {
      _id?: ObjectId;
      imageUrl: string;
      quote: string;
      attribution: string;
      createdAt: Date;
    }[];
    adVariants?: {
      _id?: ObjectId;
      videoUrl: string;
      targetDemographic: string;
      avatarId: string;
      voiceId: string;
      valueProposition: string;
      ctr?: number;
      conversions?: number;
      createdAt: Date;
    }[];
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Media Suggestions (for Analysis Enhancement)
export interface MediaSuggestions {
  _id?: ObjectId;
  websiteId: ObjectId | string;
  userId: ObjectId | string;
  brollSuggestions: Array<{
    description: string;
    keywords: string[];
    unsplashQuery: string;
    suggestedUrl?: string;
  }>;
  thumbnailOptions: Array<{
    imageUrl: string;
    score: number; // 0-100
    reason: string;
  }>;
  videoStyleRecommendations: {
    tone: string;
    pacing: string;
    colorScheme: string;
    musicGenre: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Extended Website Type with Multimedia
export interface WebsiteExtended {
  _id?: ObjectId;
  id?: string;
  userId: ObjectId | string;
  title: string;
  description: string;
  template: string;
  status: 'draft' | 'published' | 'deployed';
  url?: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  
  // New multimedia fields
  multimedia?: {
    videoScript?: VideoScript;
    videoAssets?: VideoAsset[];
    voiceAssets?: VoiceAsset[];
    thumbnailUrl?: string;
    mediaVariants?: ContentRepurposing[];
  };
  
  // Structured data for repurposing
  structuredData?: {
    productTitle: string;
    productDescription: string;
    keyFeatures: string[];
    benefits: string[];
    targetAudience: string;
    niche: string;
    scrapedImages: string[];
  };
  
  // Content repurposing reference
  contentRepurposingId?: ObjectId;
  
  // Media suggestions
  mediaSuggestionsId?: ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

// Extended User Type with Voice Cloning
export interface AuthenticatedUserExtended {
  _id: string | ObjectId;
  id: string;
  name: string;
  email: string;
  plan: 'basic' | 'pro' | 'enterprise';
  websitesCreated: number;
  websiteLimit: number;
  analysesUsed: number;
  analysisLimit: number;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  
  // New multimedia fields
  multimedia?: {
    voiceCloneEnabled: boolean; // Enterprise feature
    voiceClones?: VoiceAsset[];
    preferredAvatarId?: string;
    preferredVoiceId?: string;
    videoGenerationQuota?: number;
    videoGenerationUsed?: number;
  };
}

// Media Studio State (Frontend)
export interface MediaStudioState {
  websiteId: string;
  scriptEditor: {
    hook: string;
    story: string;
    offer: string;
    fullScript: string;
  };
  avatarConfig: {
    selectedAvatarId: string;
    selectedVoiceId: string;
  };
  previewMode: 'script' | 'composition' | 'full';
  isGenerating: boolean;
  lastSaved?: Date;
  unsavedChanges: boolean;
}

// API Request/Response Types
export interface GenerateVideoRequest {
  websiteId: string;
  videoType: 'explainer' | 'review' | 'social';
  script?: VideoScript;
  avatarId?: string;
  voiceId?: string;
  includeSubtitles?: boolean;
  resolution?: '720p' | '1080p' | '4k';
}

export interface GenerateVideoResponse {
  success: boolean;
  videoAssetId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  status: string;
  error?: string;
}

export interface RepurposeContentRequest {
  websiteId: string;
  sourceType: 'website' | 'video';
  includeTypes: Array<'social-clips' | 'podcast-snippet' | 'quote-graphics' | 'ad-variants'>;
  targetPlatforms?: string[];
  demographics?: string[];
}

export interface RepurposeContentResponse {
  success: boolean;
  repurposingId?: string;
  assets?: {
    socialClips?: string[];
    podcastUrl?: string;
    quoteGraphics?: string[];
    adVariants?: string[];
  };
  status: string;
  error?: string;
}

// Plan Limits for Multimedia Features
export interface MultimediaPlanLimits {
  basic: {
    videoGenerationPerMonth: number;
    voiceSynthesis: boolean;
    voiceCloning: boolean;
    contentRepurposing: boolean;
    adVariants: number;
  };
  pro: {
    videoGenerationPerMonth: number;
    voiceSynthesis: boolean;
    voiceCloning: boolean;
    contentRepurposing: boolean;
    adVariants: number;
  };
  enterprise: {
    videoGenerationPerMonth: number;
    voiceSynthesis: boolean;
    voiceCloning: boolean;
    contentRepurposing: boolean;
    adVariants: number;
  };
}

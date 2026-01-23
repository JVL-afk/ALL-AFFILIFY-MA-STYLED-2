// This file is server-only and should only be imported in API routes
// Do not import this in client components

import { Schema, model, models } from 'mongoose';

/**
 * VideoAsset Schema - Stores all generated video assets
 * Linked to Website documents for easy retrieval
 */
const VideoAssetSchema = new Schema({
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['explainer', 'review', 'social', 'ad-variant'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  script: {
    type: String,
    required: true,
  },
  avatarId: {
    type: String,
  },
  voiceId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready', 'failed'],
    default: 'pending',
  },
  metadata: {
    resolution: String,
    format: String,
    fileSize: Number,
    processingTime: Number, // in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * VoiceAsset Schema - Stores voice configurations and clones
 * Supports both synthesized and cloned voices for brand consistency
 */
const VoiceAssetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  voiceId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['synthesized', 'cloned'],
    required: true,
  },
  language: {
    type: String,
    default: 'en-US',
  },
  accent: String,
  speed: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 2.0,
  },
  pitch: {
    type: Number,
    default: 0,
    min: -20,
    max: 20,
  },
  audioUrl: String,
  sampleUrl: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * AvatarConfig Schema - Stores avatar configurations for video generation
 * Allows users to select avatars that match their niche and tone
 */
const AvatarConfigSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  avatarId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  imageUrl: {
    type: String,
    required: true,
  },
  niche: {
    type: String,
    enum: ['tech', 'fitness', 'lifestyle', 'finance', 'education', 'other'],
    required: true,
  },
  tone: {
    type: String,
    enum: ['professional', 'casual', 'enthusiastic', 'authoritative'],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  metadata: {
    gender: String,
    ethnicity: String,
    age: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * VideoScript Schema - Stores AI-generated video scripts
 * Follows the "Hook, Story, Offer" framework for maximum conversion
 */
const VideoScriptSchema = new Schema({
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  hook: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  fullScript: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  keyframes: [
    {
      timestamp: Number,
      description: String,
      imageUrl: String,
    },
  ],
  status: {
    type: String,
    enum: ['draft', 'approved', 'in-production', 'completed'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * ContentRepurposing Schema - Stores all repurposed content assets
 * Enables users to create multiple marketing formats from a single source
 */
const ContentRepurposingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true,
  },
  sourceType: {
    type: String,
    enum: ['website', 'video', 'article'],
    required: true,
  },
  repurposedAssets: {
    socialClips: [
      {
        videoUrl: String,
        platform: {
          type: String,
          enum: ['tiktok', 'instagram', 'youtube-shorts'],
        },
        duration: Number,
        captions: String,
        views: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    podcastSnippet: {
      audioUrl: String,
      transcript: String,
      duration: Number,
      downloads: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    },
    quoteGraphics: [
      {
        imageUrl: String,
        quote: String,
        attribution: String,
        shares: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    adVariants: [
      {
        videoUrl: String,
        targetDemographic: String,
        avatarId: String,
        voiceId: String,
        valueProposition: String,
        ctr: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * MediaSuggestions Schema - Stores AI-generated media recommendations
 * Enhances the Analysis feature with multimedia suggestions
 */
const MediaSuggestionsSchema = new Schema({
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  brollSuggestions: [
    {
      description: String,
      keywords: [String],
      unsplashQuery: String,
      suggestedUrl: String,
    },
  ],
  thumbnailOptions: [
    {
      imageUrl: String,
      score: { type: Number, min: 0, max: 100 },
      reason: String,
    },
  ],
  videoStyleRecommendations: {
    tone: String,
    pacing: String,
    colorScheme: String,
    musicGenre: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Export models with proper error handling
 * Uses existing models if available to prevent re-registration
 */
export const VideoAsset = models.VideoAsset || model('VideoAsset', VideoAssetSchema);
export const VoiceAsset = models.VoiceAsset || model('VoiceAsset', VoiceAssetSchema);
export const AvatarConfig = models.AvatarConfig || model('AvatarConfig', AvatarConfigSchema);
export const VideoScript = models.VideoScript || model('VideoScript', VideoScriptSchema);
export const ContentRepurposing = models.ContentRepurposing || model('ContentRepurposing', ContentRepurposingSchema);
export const MediaSuggestions = models.MediaSuggestions || model('MediaSuggestions', MediaSuggestionsSchema);

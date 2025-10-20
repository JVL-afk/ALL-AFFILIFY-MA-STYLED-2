import { ObjectId } from 'mongodb';

export interface AuthenticatedUser {
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
}

export interface Website {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisResult {
  url: string;
  score: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  recommendations: string[];
  createdAt: Date;
}

export interface ChatSession {
  _id?: ObjectId;
  userId: ObjectId | string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ABTest {
  _id?: ObjectId;
  userId: ObjectId | string;
  websiteId: ObjectId | string;
  name: string;
  variantA: {
    name: string;
    traffic: number;
    conversions: number;
  };
  variantB: {
    name: string;
    traffic: number;
    conversions: number;
  };
  status: 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  _id?: ObjectId;
  userId: ObjectId | string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface EmailList {
  _id?: ObjectId;
  userId: ObjectId | string;
  name: string;
  subscribers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  _id?: ObjectId;
  userId: ObjectId | string;
  listId: ObjectId | string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: Date;
  opens: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKey {
  _id?: ObjectId;
  userId: ObjectId | string;
  key: string;
  name: string;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  _id?: ObjectId;
  userId: ObjectId | string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomReport {
  _id?: ObjectId;
  userId: ObjectId | string;
  name: string;
  metrics: string[];
  filters?: Record<string, any>;
  schedule?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}


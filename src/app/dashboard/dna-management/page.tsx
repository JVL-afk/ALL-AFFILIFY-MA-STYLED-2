// src/app/dashboard/dna-management/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Target,
  Users,
  Lightbulb,
  Database,
  ChevronRight
} from 'lucide-react'
import { AffiliateContentDNA } from '@/lib/content-brain/types'
import { getAffiliateDNA } from '@/lib/content-brain/api'

export default function DNAManagementPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<AffiliateContentDNA>>({});

  // Fetch DNA on component mount
  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const fetchedDNA = await getAffiliateDNA('mock-project-id');
        setDna(fetchedDNA);
        setFormData(fetchedDNA);
      } catch (err) {
        setError('Failed to load Campaign DNA.');
      }
    };
    fetchDNA();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock save - in a real app, this would POST to an API
      console.log('Saving DNA:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDna(formData as AffiliateContentDNA);
      setSuccess('Campaign DNA saved successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save Campaign DNA.');
    } finally {
      setIsSaving(false);
    }
  };

  const dnaBackground = "min-h-screen bg-gray-900";
  const contentAreaBackground = "bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400";

  return (
    <div className={`${dnaBackground} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold ${gradientText}`}>
            Campaign DNA Management <Database className="inline-block w-8 h-8 ml-2" />
          </h1>
          <p className="text-gray-500 mt-1">
            Configure the core intelligence that powers all your AI-generated content. This is your "Campaign DNA" - the foundation of the Affiliate Content Brain.
          </p>
        </motion.div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-green-900/50 border border-green-700 text-green-300 rounded-lg flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-3" />
            {success}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Affiliate Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={contentAreaBackground}
          >
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Affiliate Profile
              </CardTitle>
              <CardDescription className="text-gray-500">
                Define your unique brand voice and target audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-white font-medium block mb-2">Brand Voice</label>
                <select
                  value={formData.brandVoice || 'expert'}
                  onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="expert">Expert</option>
                  <option value="witty">Witty</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Target Audience</label>
                <Textarea
                  value={formData.targetAudience || ''}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Describe your ideal customer..."
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Unique Selling Proposition</label>
                <Textarea
                  value={formData.uniqueSellingProposition || ''}
                  onChange={(e) => handleInputChange('uniqueSellingProposition', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What makes your angle unique?"
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
            </CardContent>
          </motion.div>

          {/* Product Intelligence Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={contentAreaBackground}
          >
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Product Intelligence
              </CardTitle>
              <CardDescription className="text-gray-500">
                Core information about the product you're promoting.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-white font-medium block mb-2">Product Name</label>
                <Input
                  value={formData.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., 2026 KTM 450 SX-F"
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Product UVP</label>
                <Textarea
                  value={formData.productUVP || ''}
                  onChange={(e) => handleInputChange('productUVP', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What makes this product special?"
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Pain Points (comma-separated)</label>
                <Textarea
                  value={formData.productPainPoints?.join(', ') || ''}
                  onChange={(e) => handleInputChange('productPainPoints', e.target.value.split(',').map(s => s.trim()))}
                  disabled={!isEditing}
                  placeholder="Problems this product solves..."
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
            </CardContent>
          </motion.div>

          {/* Market Context Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={contentAreaBackground}
          >
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-400" />
                Market Context & SEO
              </CardTitle>
              <CardDescription className="text-gray-500">
                Keywords and competitive positioning.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-white font-medium block mb-2">Primary Keywords (comma-separated)</label>
                <Textarea
                  value={formData.primaryKeywords?.join(', ') || ''}
                  onChange={(e) => handleInputChange('primaryKeywords', e.target.value.split(',').map(s => s.trim()))}
                  disabled={!isEditing}
                  placeholder="High-converting keywords..."
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Secondary Keywords / LSI Terms (comma-separated)</label>
                <Textarea
                  value={formData.secondaryKeywords?.join(', ') || ''}
                  onChange={(e) => handleInputChange('secondaryKeywords', e.target.value.split(',').map(s => s.trim()))}
                  disabled={!isEditing}
                  placeholder="LSI terms for SEO..."
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Competitor Analysis Summary</label>
                <Textarea
                  value={formData.competitorAnalysisSummary || ''}
                  onChange={(e) => handleInputChange('competitorAnalysisSummary', e.target.value)}
                  disabled={!isEditing}
                  placeholder="How do you differentiate from competitors?"
                  rows={3}
                  className="bg-gray-900 border-gray-700 text-white disabled:opacity-50"
                />
              </div>
            </CardContent>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Campaign DNA
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(dna || {});
                  }}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

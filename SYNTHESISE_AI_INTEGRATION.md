# Synthesise AI Integration Documentation
## AFFILIFY Multimedia Transformation

This document provides a comprehensive guide to the Synthesise AI integration within the AFFILIFY platform, detailing the architecture, API endpoints, data models, and implementation guidelines.

---

## 1. Overview

The Synthesise AI integration transforms AFFILIFY from a website builder into a **Multi-Channel Affiliate Campaign Factory**. Users can now:

- Generate professional video scripts using the "Hook, Story, Offer" framework
- Create AI-powered videos with realistic digital avatars
- Synthesize natural-sounding voiceovers
- Repurpose website content into social clips, podcasts, quote graphics, and ad variants
- A/B test personalized ad variants targeting different demographics

---

## 2. Architecture

### 2.1 Data Models

#### Core Multimedia Models

**VideoAsset**
- Stores generated video files and metadata
- Linked to Website and User documents
- Tracks video type (explainer, review, social, ad-variant)
- Includes thumbnail URLs and duration estimates

**VideoScript**
- Stores AI-generated video scripts
- Follows the "Hook, Story, Offer" framework
- Includes keyframes for scene composition
- Status tracking (draft, approved, in-production, completed)

**VoiceAsset**
- Stores voice configurations and clones
- Supports both synthesized and cloned voices
- Includes speed and pitch adjustments
- Enterprise feature: Voice cloning for brand consistency

**AvatarConfig**
- Stores avatar configurations
- Niche-specific avatars (tech, fitness, lifestyle, etc.)
- Tone selection (professional, casual, enthusiastic, authoritative)
- Default avatar management

**ContentRepurposing**
- Stores all repurposed content assets
- Includes social clips, podcast snippets, quote graphics, and ad variants
- Status tracking for async generation
- Performance metrics (CTR, conversions, impressions)

**MediaSuggestions**
- AI-generated recommendations for B-roll, thumbnails, and video styles
- Unsplash integration for stock footage
- Niche-specific suggestions

### 2.2 API Routes

#### Video Generation
**POST `/api/ai/generate-video`**
- Request body:
  ```json
  {
    "websiteId": "string",
    "videoType": "explainer|review|social|ad-variant",
    "script": "string (optional)",
    "avatarId": "string",
    "voiceId": "string",
    "includeSubtitles": boolean,
    "resolution": "720p|1080p|4k"
  }
  ```
- Response:
  ```json
  {
    "success": boolean,
    "videoAssetId": "string",
    "videoUrl": "string",
    "thumbnailUrl": "string",
    "duration": number,
    "status": "ready|pending|failed"
  }
  ```

**GET `/api/ai/generate-video?videoAssetId=string`**
- Retrieves video generation status and details

#### Content Repurposing
**POST `/api/ai/repurpose-content`**
- Request body:
  ```json
  {
    "websiteId": "string",
    "sourceType": "website|video|article",
    "includeTypes": ["social-clips", "podcast-snippet", "quote-graphics", "ad-variants"],
    "targetPlatforms": ["tiktok", "instagram", "youtube-shorts"],
    "demographics": ["young-professionals", "parents", "enthusiasts"]
  }
  ```
- Response:
  ```json
  {
    "success": boolean,
    "repurposingId": "string",
    "assets": {
      "socialClips": number,
      "podcastSnippet": boolean,
      "quoteGraphics": number,
      "adVariants": number
    },
    "status": "completed|processing|failed"
  }
  ```

**GET `/api/ai/repurpose-content?repurposingId=string`**
- Retrieves repurposing status and asset details

#### Multimedia Management
**PUT `/api/websites/[websiteId]/multimedia`**
- Updates website multimedia data (scripts, voice preferences, avatars)

**GET `/api/websites/[websiteId]/multimedia`**
- Retrieves multimedia data for a website

---

## 3. Frontend Components

### 3.1 MediaStudio Component
Located in `src/components/MediaStudio.tsx`

**Features:**
- Script editor with Hook, Story, Offer sections
- Real-time word count and duration estimation
- Avatar selector with visual previews
- Voice selector with audio samples
- Scene composition visualization
- Low-fidelity video preview
- Save and generate functionality

**Props:**
```typescript
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
```

### 3.2 Dashboard Pages

**Media Studio Page** (`/dashboard/media-studio`)
- Full-featured video script creation interface
- Integrated MediaStudio component
- Quick action buttons for next steps
- Script writing tips and best practices

**Content Repurposing Page** (`/dashboard/content-repurposing`)
- Website selection for repurposing
- Asset type selection (social clips, podcast, quotes, ads)
- Generated assets management
- Performance tracking

**My Websites Enhanced** (`/dashboard/my-websites-enhanced`)
- Enhanced website cards with multimedia status
- Video asset count display
- Quick access to Media Studio and Repurposing
- Conversion rate analytics

---

## 4. AI Integration

### 4.1 Gemini 2.5 Pro Integration

The platform uses **Google Gemini 2.5 Pro** for:

1. **Video Script Generation**
   - Analyzes website data and product information
   - Generates Hook, Story, Offer structure
   - Optimizes for video duration and pacing
   - Includes [VISUAL CUE] markers for editors

2. **Social Media Content**
   - Creates platform-specific clips (TikTok, Instagram, YouTube)
   - Generates captions and hashtags
   - Optimizes for engagement

3. **Podcast Snippet Generation**
   - Creates conversational, engaging audio content
   - Includes intro, main story, and outro
   - Natural pacing and tone

4. **Quote Graphics**
   - Generates shareable, emotionally resonant quotes
   - Highlights specific benefits
   - Includes subtle CTAs

5. **Ad Variant Generation**
   - Creates demographic-specific ad scripts
   - Tailors value propositions to audience needs
   - Suggests avatar tone and voice style

### 4.2 Synthesise AI Integration

The platform integrates with **Synthesise AI** for:

1. **Video Generation**
   - Converts scripts to realistic video with digital avatars
   - Supports multiple avatar styles and tones
   - Includes automatic subtitle generation

2. **Voice Synthesis**
   - Natural-sounding voiceovers from scripts
   - Multiple voice options and languages
   - Speed and pitch adjustments

3. **Voice Cloning** (Enterprise)
   - Custom voice clones for brand consistency
   - Maintains voice characteristics across all videos

---

## 5. Implementation Guide

### 5.1 Setup

1. **Environment Variables**
   ```
   GEMINI_API_KEY=your_gemini_api_key
   SYNTHESISE_AI_API_KEY=your_synthesise_ai_key
   SYNTHESISE_AI_API_URL=https://api.synthesise.ai/v1
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. **Database Setup**
   - Ensure MongoDB is running
   - Models will auto-create collections on first use

3. **Dependencies**
   - `@google/generative-ai`: Gemini API client
   - `mongoose`: MongoDB ODM
   - `jsonwebtoken`: Authentication

### 5.2 Usage Flow

1. **User creates/selects a website**
2. **User navigates to Media Studio**
3. **System fetches website data**
4. **User edits video script** (Hook, Story, Offer)
5. **User selects avatar and voice**
6. **User clicks "Generate Video"**
7. **System calls Gemini to create script** (if not provided)
8. **System calls Synthesise AI to generate video**
9. **Video asset saved to database**
10. **User can repurpose content** from generated video

### 5.3 Repurposing Workflow

1. **User selects website**
2. **User chooses asset types** to generate
3. **User clicks "Repurpose Content"**
4. **System generates:**
   - Social clips (3x 30-second videos)
   - Podcast snippet (2-3 minutes)
   - Quote graphics (5x shareable quotes)
   - Ad variants (3x demographic-specific ads)
5. **All assets saved and linked to website**
6. **User can download/share assets**

---

## 6. Plan Limits

### Basic Plan
- Video generation: 5/month
- Voice synthesis: ✓
- Voice cloning: ✗
- Content repurposing: ✓
- Ad variants: 2

### Pro Plan
- Video generation: 20/month
- Voice synthesis: ✓
- Voice cloning: ✗
- Content repurposing: ✓
- Ad variants: 5

### Enterprise Plan
- Video generation: Unlimited
- Voice synthesis: ✓
- Voice cloning: ✓
- Content repurposing: ✓
- Ad variants: Unlimited

---

## 7. Error Handling

### Common Errors

**"Synthesise AI API key not configured"**
- Solution: Set `SYNTHESISE_AI_API_KEY` in environment variables
- Fallback: Uses placeholder video URLs

**"Failed to generate video script"**
- Cause: Gemini API error or invalid website data
- Solution: Check website data completeness, verify API key

**"Video asset not found"**
- Cause: Invalid videoAssetId or user doesn't own asset
- Solution: Verify asset ID and user authentication

---

## 8. Performance Optimization

### Caching
- Video scripts cached in database
- Avatar and voice configurations cached client-side
- Repurposing results cached for 24 hours

### Async Processing
- Video generation runs asynchronously
- Status can be checked via GET endpoints
- Webhook support for completion notifications

### CDN Integration
- Video files served via Netlify CDN
- Thumbnail optimization for web
- Automatic format conversion

---

## 9. Security Considerations

1. **Authentication**
   - All endpoints require JWT token
   - Token validated before processing

2. **Authorization**
   - Users can only access their own websites and assets
   - Database queries include userId filter

3. **API Key Management**
   - API keys stored in environment variables
   - Never exposed in client-side code
   - Rotate keys regularly

4. **Data Privacy**
   - User data encrypted in transit (HTTPS)
   - Database connections use SSL
   - No personal data shared with third-party APIs

---

## 10. Monitoring & Analytics

### Tracked Metrics
- Video generation success rate
- Average video generation time
- Repurposing asset counts
- User engagement with generated content
- A/B test performance (CTR, conversions)

### Logging
- All API calls logged with timestamps
- Error logs include stack traces
- Performance metrics tracked

---

## 11. Future Enhancements

1. **Real-time Collaboration**
   - Multiple users editing scripts simultaneously
   - Comment and feedback system

2. **Advanced Analytics**
   - Video performance tracking
   - Audience sentiment analysis
   - Recommendation engine for optimization

3. **Custom Avatars**
   - User-uploaded avatar support
   - Avatar training from video samples

4. **Workflow Automation**
   - Scheduled content generation
   - Automatic repurposing on new website creation
   - Multi-language support

5. **Integration Marketplace**
   - Native integrations with social platforms
   - Direct publishing to TikTok, Instagram, YouTube
   - Email marketing platform integrations

---

## 12. Support & Troubleshooting

### Common Issues

**Videos not generating**
- Check Synthesise AI API key
- Verify website data is complete
- Check MongoDB connection

**Scripts not saving**
- Verify JWT token is valid
- Check database permissions
- Ensure website ID is correct

**Slow performance**
- Check network latency to Synthesise AI
- Verify MongoDB indexes are created
- Consider caching frequently accessed assets

### Getting Help
- Check logs: `console.log` output in server logs
- Test endpoints with Postman
- Verify environment variables are set correctly

---

## 13. Code Examples

### Generating a Video Script

```typescript
const response = await fetch('/api/ai/generate-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    websiteId: '507f1f77bcf86cd799439011',
    videoType: 'explainer',
    avatarId: 'professional-avatar',
    voiceId: 'warm-voice',
  }),
});

const data = await response.json();
console.log('Video generated:', data.videoUrl);
```

### Repurposing Content

```typescript
const response = await fetch('/api/ai/repurpose-content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    websiteId: '507f1f77bcf86cd799439011',
    sourceType: 'website',
    includeTypes: ['social-clips', 'podcast-snippet', 'quote-graphics', 'ad-variants'],
    demographics: ['young-professionals', 'parents', 'enthusiasts'],
  }),
});

const data = await response.json();
console.log('Content repurposed:', data.repurposingId);
```

---

## 14. Conclusion

The Synthesise AI integration represents the next evolution of AFFILIFY, transforming it into a comprehensive multimedia marketing platform. By combining the power of deep-scrape website generation with AI-powered multimedia synthesis, AFFILIFY now enables affiliates to create complete, multi-channel marketing campaigns from a single product link.

This integration maintains the "Rolex" philosophy of quality, professionalism, and understated elegance, ensuring that every generated asset meets institutional standards.

---

**Last Updated:** January 23, 2026
**Version:** 1.0.0
**Status:** Production Ready

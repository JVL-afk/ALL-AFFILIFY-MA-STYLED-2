// Unsplash image integration for AI-powered image selection
export interface UnsplashImage {
  id: string
  url: string
  downloadUrl: string
  description: string
  altDescription: string
  width: number
  height: number
  photographer: string
  photographerUrl: string
}

export interface ImageSearchOptions {
  query: string
  count?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
  category?: string
  color?: string
}

export class UnsplashService {
  private accessKey: string
  private baseUrl = 'https://api.unsplash.com'

  constructor(accessKey: string) {
    this.accessKey = accessKey
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // Add default params
    params.client_id = this.accessKey
    
    // Add params to URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`)
    }

    return response.json()
  }

  async searchImages(options: ImageSearchOptions): Promise<UnsplashImage[]> {
    const params: Record<string, string> = {
      query: options.query,
      per_page: (options.count || 10).toString(),
      orientation: options.orientation || 'landscape'
    }

    if (options.category) {
      params.category = options.category
    }

    if (options.color) {
      params.color = options.color
    }

    const data = await this.makeRequest('/search/photos', params)
    
    return data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      downloadUrl: photo.urls.full,
      description: photo.description || photo.alt_description || '',
      altDescription: photo.alt_description || '',
      width: photo.width,
      height: photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    }))
  }

  async getRandomImages(options: Partial<ImageSearchOptions> = {}): Promise<UnsplashImage[]> {
    const params: Record<string, string> = {
      count: (options.count || 10).toString()
    }

    if (options.query) {
      params.query = options.query
    }

    if (options.orientation) {
      params.orientation = options.orientation
    }

    const data = await this.makeRequest('/photos/random', params)
    const photos = Array.isArray(data) ? data : [data]
    
    return photos.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      downloadUrl: photo.urls.full,
      description: photo.description || photo.alt_description || '',
      altDescription: photo.alt_description || '',
      width: photo.width,
      height: photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    }))
  }

  async downloadImage(imageId: string): Promise<string> {
    // Trigger download tracking
    await this.makeRequest(`/photos/${imageId}/download`)
    
    // Return the download URL
    const photo = await this.makeRequest(`/photos/${imageId}`)
    return photo.urls.full
  }
}

// Export singleton instance
export const unsplashService = new UnsplashService(process.env.UNSPLASH_ACCESS_KEY || '')

// AI-powered image selection based on content
export async function selectImagesForWebsite(websiteContent: any): Promise<Record<string, UnsplashImage[]>> {
  try {
    const { content, seo } = websiteContent
    
    // Generate search queries based on content
    const queries = generateImageQueries(content, seo)
    
    // Search for images for each section
    const imageResults: Record<string, UnsplashImage[]> = {}
    
    for (const [section, query] of Object.entries(queries)) {
      try {
        const images = await unsplashService.searchImages({
          query,
          count: section === 'hero' ? 3 : 6,
          orientation: section === 'hero' ? 'landscape' : 'squarish'
        })
        imageResults[section] = images
      } catch (error) {
        console.error(`Error fetching images for ${section}:`, error)
        // Fallback to random images
        imageResults[section] = await unsplashService.getRandomImages({
          count: 3,
          orientation: 'landscape'
        })
      }
    }
    
    return imageResults
  } catch (error) {
    console.error('Error selecting images:', error)
    throw new Error('Failed to select images')
  }
}

function generateImageQueries(content: any, seo: any): Record<string, string> {
  const keywords = seo.keywords || []
  const niche = keywords[0] || 'business'
  
  return {
    hero: `${niche} professional modern`,
    features: `${niche} technology innovation`,
    benefits: `success achievement ${niche}`,
    testimonials: `happy customers people smiling`,
    background: `abstract ${niche} pattern`,
    cta: `call to action ${niche} button`
  }
}

// Image optimization and processing
export async function optimizeImage(imageUrl: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'jpg' | 'png' | 'webp'
} = {}): Promise<string> {
  const params = new URLSearchParams()
  
  if (options.width) params.append('w', options.width.toString())
  if (options.height) params.append('h', options.height.toString())
  if (options.quality) params.append('q', options.quality.toString())
  if (options.format) params.append('fm', options.format)
  
  // Add optimization parameters to Unsplash URL
  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}${params.toString()}`
}

// Generate image alt text using AI
export function generateImageAltText(image: UnsplashImage, context: string): string {
  const description = image.description || image.altDescription || ''
  
  if (description) {
    return `${description} - ${context}`
  }
  
  // Fallback alt text
  return `Professional image for ${context}`
}

// Image gallery component data
export interface ImageGallery {
  hero: UnsplashImage[]
  features: UnsplashImage[]
  benefits: UnsplashImage[]
  testimonials: UnsplashImage[]
  backgrounds: UnsplashImage[]
}

export async function createImageGallery(websiteContent: any): Promise<ImageGallery> {
  const imageSelections = await selectImagesForWebsite(websiteContent)
  
  return {
    hero: imageSelections.hero || [],
    features: imageSelections.features || [],
    benefits: imageSelections.benefits || [],
    testimonials: imageSelections.testimonials || [],
    backgrounds: imageSelections.background || []
  }
}

// Popular image categories for different niches
export const imageCategories = {
  technology: ['technology', 'computer', 'innovation', 'digital', 'software'],
  health: ['health', 'fitness', 'wellness', 'medical', 'nutrition'],
  fashion: ['fashion', 'style', 'clothing', 'accessories', 'beauty'],
  business: ['business', 'office', 'professional', 'meeting', 'success'],
  travel: ['travel', 'vacation', 'adventure', 'destination', 'journey'],
  food: ['food', 'cooking', 'restaurant', 'cuisine', 'ingredients'],
  education: ['education', 'learning', 'books', 'study', 'knowledge'],
  finance: ['finance', 'money', 'investment', 'banking', 'economy'],
  sports: ['sports', 'fitness', 'athlete', 'competition', 'training'],
  home: ['home', 'interior', 'furniture', 'decoration', 'lifestyle']
}

// Get category suggestions based on niche
export function getCategoryForNiche(niche: string): string[] {
  const lowerNiche = niche.toLowerCase()
  
  for (const [category, keywords] of Object.entries(imageCategories)) {
    if (keywords.some(keyword => lowerNiche.includes(keyword))) {
      return keywords
    }
  }
  
  return imageCategories.business // Default fallback
}


import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { connectToDatabase } from '@/lib/mongodb'

interface WebsiteContent {
  hero?: {
    headline?: string
    subheadline?: string
    ctaText?: string
    ctaUrl?: string
    backgroundImage?: string
  }
  sections?: Array<{
    type: string
    title?: string
    content?: string
    items?: any[]
    [key: string]: any
  }>
  features?: Array<{
    title: string
    description: string
    icon?: string
  }>
  testimonials?: Array<{
    quote: string
    author: string
    role?: string
    avatar?: string
  }>
  pricing?: {
    title?: string
    plans?: Array<{
      name: string
      price: string
      features: string[]
      ctaText?: string
      ctaUrl?: string
      highlighted?: boolean
    }>
  }
  faq?: Array<{
    question: string
    answer: string
  }>
  cta?: {
    headline?: string
    subheadline?: string
    buttonText?: string
    buttonUrl?: string
  }
  footer?: {
    text?: string
    links?: Array<{
      label: string
      url: string
    }>
  }
  html?: string
  css?: string
}

interface Website {
  _id: any
  title: string
  description: string
  content: WebsiteContent
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  affiliateLinks?: Array<{
    url: string
    label?: string
  }>
  template: string
  status: string
  url?: string
  createdAt: Date
  updatedAt: Date
}

async function getWebsiteBySlug(slug: string): Promise<Website | null> {
  try {
    const { db } = await connectToDatabase()
    
    console.log('[getWebsiteBySlug] Looking for slug:', slug)
    
    // The slug format is: title-slug-last8charsOfId
    // Extract the last 8 characters which should be the website ID suffix
    const parts = slug.split('-')
    const websiteIdSuffix = parts[parts.length - 1]
    
    console.log('[getWebsiteBySlug] Extracted ID suffix:', websiteIdSuffix)
    
    // Strategy 1: Try to find by URL field (exact match)
    let website = await db.collection('websites').findOne({
      url: new RegExp(slug + '$', 'i'),
      status: 'published'
    })
    
    if (website) {
      console.log('[getWebsiteBySlug] Found by URL match')
      return website as unknown as Website
    }
    
    // Strategy 2: Find all published websites and match by ID suffix
    console.log('[getWebsiteBySlug] URL match failed, trying ID suffix match...')
    const allWebsites = await db.collection('websites').find({ 
      status: 'published' 
    }).toArray()
    
    console.log('[getWebsiteBySlug] Found', allWebsites.length, 'published websites')
    
    const matchedWebsite = allWebsites.find(w => {
      const id = w._id.toString()
      const idLast8 = id.slice(-8)
      const urlMatch = w.url && w.url.includes(slug)
      const idMatch = idLast8.toLowerCase() === websiteIdSuffix.toLowerCase()
      
      console.log('[getWebsiteBySlug] Checking website:', {
        id,
        idLast8,
        websiteIdSuffix,
        idMatch,
        url: w.url,
        urlMatch
      })
      
      return idMatch || urlMatch
    })
    
    if (matchedWebsite) {
      console.log('[getWebsiteBySlug] Found by ID/URL match')
      return matchedWebsite as unknown as Website
    }
    
    console.log('[getWebsiteBySlug] No website found for slug:', slug)
    return null
  } catch (error) {
    console.error('[getWebsiteBySlug] Error fetching website by slug:', error)
    return null
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const website = await getWebsiteBySlug(slug)
  
  if (!website) {
    return {
      title: 'Website Not Found - AFFILIFY',
      description: 'The requested website could not be found.'
    }
  }
  
  return {
    title: website.seo?.title || website.title,
    description: website.seo?.description || website.description,
    keywords: website.seo?.keywords?.join(', '),
    openGraph: {
      title: website.seo?.title || website.title,
      description: website.seo?.description || website.description,
      type: 'website',
    }
  }
}

export default async function PublishedWebsitePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const website = await getWebsiteBySlug(slug)
  
  if (!website) {
    notFound()
  }
  
  const content = website.content
  
  // If the website has custom HTML, render it directly
  if (content.html) {
    return (
      <>
        {content.css && (
          <style dangerouslySetInnerHTML={{ __html: content.css }} />
        )}
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </>
    )
  }
  
  // Otherwise, render using the structured content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Hero Section */}
      {content.hero && (
        <section 
          className="relative py-20 px-4"
          style={content.hero.backgroundImage ? {
            backgroundImage: `url(${content.hero.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : undefined}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {content.hero.headline || website.title}
            </h1>
            {content.hero.subheadline && (
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                {content.hero.subheadline}
              </p>
            )}
            {content.hero.ctaUrl && (
              <a 
                href={content.hero.ctaUrl}
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-orange-500 hover:to-red-500 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.hero.ctaText || 'Get Started'}
              </a>
            )}
          </div>
        </section>
      )}
      
      {/* Dynamic Sections */}
      {content.sections?.map((section, index) => (
        <section key={index} className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                {section.title}
              </h2>
            )}
            {section.content && (
              <div 
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
            {section.items && (
              <div className="grid md:grid-cols-3 gap-8">
                {section.items.map((item: any, itemIndex: number) => (
                  <div 
                    key={itemIndex}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    {item.title && (
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-white/70">{item.description}</p>
                    )}
                    {item.price && (
                      <p className="text-2xl font-bold text-orange-400 mt-4">{item.price}</p>
                    )}
                    {item.url && (
                      <a 
                        href={item.url}
                        className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.ctaText || 'Learn More'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
      
      {/* Features Section */}
      {content.features && content.features.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials Section */}
      {content.testimonials && content.testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              What People Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10"
                >
                  <p className="text-white/80 text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    {testimonial.avatar && (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-bold">{testimonial.author}</p>
                      {testimonial.role && (
                        <p className="text-orange-400 text-sm">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Pricing Section */}
      {content.pricing?.plans && content.pricing.plans.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              {content.pricing.title || 'Pricing'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.pricing.plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`rounded-xl p-8 border ${
                    plan.highlighted 
                      ? 'bg-gradient-to-br from-orange-600 to-red-700 border-orange-400' 
                      : 'bg-slate-800/50 border-white/10'
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-4xl font-bold text-white mb-6">{plan.price}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-white/80">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.ctaUrl && (
                    <a 
                      href={plan.ctaUrl}
                      className={`block text-center py-3 rounded-lg font-bold transition-all ${
                        plan.highlighted 
                          ? 'bg-white text-red-600 hover:bg-gray-100' 
                          : 'bg-orange-600 text-white hover:bg-orange-500'
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.ctaText || 'Get Started'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* FAQ Section */}
      {content.faq && content.faq.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {content.faq.map((item, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{item.question}</h3>
                  <p className="text-white/70">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      {content.cta && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-lg rounded-3xl p-12 border border-orange-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {content.cta.headline || 'Ready to Get Started?'}
            </h2>
            {content.cta.subheadline && (
              <p className="text-xl text-white/80 mb-8">{content.cta.subheadline}</p>
            )}
            {content.cta.buttonUrl && (
              <a 
                href={content.cta.buttonUrl}
                className="inline-block px-10 py-4 bg-white text-red-600 font-bold text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.cta.buttonText || 'Get Started Now'}
              </a>
            )}
          </div>
        </section>
      )}
      
      {/* Affiliate Links Section */}
      {website.affiliateLinks && website.affiliateLinks.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Quick Links</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {website.affiliateLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label || `Buy Now`}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          {content.footer?.text && (
            <p className="text-white/60 mb-4">{content.footer.text}</p>
          )}
          {content.footer?.links && (
            <div className="flex justify-center gap-6">
              {content.footer.links.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-white/60 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <p className="text-white/40 text-sm mt-6">
            Powered by <a href="https://affilify.eu" className="text-orange-400 hover:text-orange-300">AFFILIFY</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

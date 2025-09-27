// Netlify deployment integration
export interface NetlifyDeployment {
  id: string
  url: string
  deployUrl: string
  state: 'building' | 'ready' | 'error'
  createdAt: Date
  updatedAt: Date
}

export interface NetlifySite {
  id: string
  name: string
  url: string
  adminUrl: string
  customDomain?: string
  sslUrl?: string
}

export class NetlifyService {
  private apiToken: string
  private baseUrl = 'https://api.netlify.com/api/v1'

  constructor(apiToken: string) {
    this.apiToken = apiToken
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.statusText}`)
    }

    return response.json()
  }

  async createSite(name: string, customDomain?: string): Promise<NetlifySite> {
    const siteData = {
      name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      custom_domain: customDomain,
      build_settings: {
        cmd: 'npm run build',
        dir: 'dist',
        env: {}
      }
    }

    const site = await this.makeRequest('/sites', {
      method: 'POST',
      body: JSON.stringify(siteData),
    })

    return {
      id: site.id,
      name: site.name,
      url: site.url,
      adminUrl: site.admin_url,
      customDomain: site.custom_domain,
      sslUrl: site.ssl_url
    }
  }

  async deployWebsite(siteId: string, websiteContent: any): Promise<NetlifyDeployment> {
    // Generate static HTML files from website content
    const files = await this.generateStaticFiles(websiteContent)
    
    // Create deployment
    const deployment = await this.makeRequest(`/sites/${siteId}/deploys`, {
      method: 'POST',
      body: JSON.stringify({
        files,
        draft: false,
        branch: 'main'
      }),
    })

    return {
      id: deployment.id,
      url: deployment.url,
      deployUrl: deployment.deploy_url,
      state: deployment.state,
      createdAt: new Date(deployment.created_at),
      updatedAt: new Date(deployment.updated_at)
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<NetlifyDeployment> {
    const deployment = await this.makeRequest(`/deploys/${deploymentId}`)
    
    return {
      id: deployment.id,
      url: deployment.url,
      deployUrl: deployment.deploy_url,
      state: deployment.state,
      createdAt: new Date(deployment.created_at),
      updatedAt: new Date(deployment.updated_at)
    }
  }

  async updateCustomDomain(siteId: string, domain: string): Promise<void> {
    await this.makeRequest(`/sites/${siteId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        custom_domain: domain
      }),
    })
  }

  async enableSSL(siteId: string): Promise<void> {
    await this.makeRequest(`/sites/${siteId}/ssl`, {
      method: 'POST',
    })
  }

  private async generateStaticFiles(websiteContent: any): Promise<Record<string, string>> {
    const { content, seo, template, affiliateLinks } = websiteContent

    // Generate HTML structure
    const html = this.generateHTML(content, seo, template, affiliateLinks)
    const css = this.generateCSS(template)
    const js = this.generateJS(affiliateLinks)

    return {
      'index.html': html,
      'styles.css': css,
      'script.js': js,
      '_redirects': '/* /index.html 200'
    }
  }

  private generateHTML(content: any, seo: any, template: string, affiliateLinks: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title}">
    <meta name="twitter:description" content="${seo.description}">
    
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="${template}">
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1 class="hero-title">${content.hero.headline}</h1>
            <p class="hero-subtitle">${content.hero.subheadline}</p>
            <a href="${affiliateLinks.primary}" class="cta-button" onclick="trackClick('hero')">${content.hero.ctaText}</a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="features-grid">
                ${content.features.map((feature: any) => `
                    <div class="feature-card">
                        <div class="feature-icon">${this.getIconSVG(feature.icon)}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits">
        <div class="container">
            <h2>Why Choose This Product?</h2>
            <div class="benefits-list">
                ${content.benefits.map((benefit: any) => `
                    <div class="benefit-item">
                        <h3>${benefit.title}</h3>
                        <p>${benefit.description}</p>
                    </div>
                `).join('')}
            </div>
            <div class="cta-section">
                <a href="${affiliateLinks.primary}" class="cta-button" onclick="trackClick('benefits')">Get Started Now</a>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
        <div class="container">
            <h2>What Our Customers Say</h2>
            <div class="testimonials-grid">
                ${content.testimonials.map((testimonial: any) => `
                    <div class="testimonial-card">
                        <div class="stars">${'★'.repeat(testimonial.rating)}</div>
                        <p>"${testimonial.content}"</p>
                        <div class="testimonial-author">
                            <strong>${testimonial.name}</strong>
                            <span>${testimonial.role}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-list">
                ${content.faq.map((item: any, index: number) => `
                    <div class="faq-item">
                        <button class="faq-question" onclick="toggleFAQ(${index})">
                            ${item.question}
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer" id="faq-${index}">
                            <p>${item.answer}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today!</p>
            <a href="${affiliateLinks.primary}" class="cta-button large" onclick="trackClick('final')">Get It Now</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>${content.footer.disclaimer}</p>
            <p>${content.footer.contact}</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`
  }

  private generateCSS(template: string): string {
    const baseStyles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 20px;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.cta-button {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cta-button:hover {
    background: #ff5252;
    transform: translateY(-2px);
}

.cta-button.large {
    padding: 20px 40px;
    font-size: 1.1rem;
}

/* Features Section */
.features {
    padding: 80px 0;
    background: #f8f9fa;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.feature-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    background: #667eea;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

/* Benefits Section */
.benefits {
    padding: 80px 0;
}

.benefits h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
}

.benefits-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.benefit-item {
    padding: 20px;
}

.benefit-item h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: #667eea;
}

.cta-section {
    text-align: center;
}

/* Testimonials Section */
.testimonials {
    padding: 80px 0;
    background: #f8f9fa;
}

.testimonials h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
}

.testimonial-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.stars {
    color: #ffd700;
    font-size: 1.2rem;
    margin-bottom: 15px;
}

.testimonial-author {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.testimonial-author strong {
    display: block;
}

.testimonial-author span {
    color: #666;
    font-size: 0.9rem;
}

/* FAQ Section */
.faq {
    padding: 80px 0;
}

.faq h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
}

.faq-question {
    width: 100%;
    padding: 20px;
    background: white;
    border: none;
    text-align: left;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-question:hover {
    background: #f8f9fa;
}

.faq-answer {
    padding: 0 20px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-answer.active {
    padding: 20px;
    max-height: 200px;
}

/* Final CTA Section */
.final-cta {
    padding: 80px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.final-cta h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.final-cta p {
    font-size: 1.2rem;
    margin-bottom: 30px;
}

/* Footer */
.footer {
    background: #333;
    color: white;
    padding: 40px 0;
    text-align: center;
}

.footer p {
    margin-bottom: 10px;
    font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .features h2,
    .benefits h2,
    .testimonials h2,
    .faq h2,
    .final-cta h2 {
        font-size: 2rem;
    }
    
    .features-grid,
    .benefits-list,
    .testimonials-grid {
        grid-template-columns: 1fr;
    }
}
`

    // Template-specific styles
    const templateStyles = {
      modern: `
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .cta-button {
            background: #667eea;
        }
        .cta-button:hover {
            background: #5a6fd8;
        }
      `,
      classic: `
        .hero {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        }
        .cta-button {
            background: #e74c3c;
        }
        .cta-button:hover {
            background: #c0392b;
        }
      `,
      bold: `
        .hero {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }
        .cta-button {
            background: #2ecc71;
        }
        .cta-button:hover {
            background: #27ae60;
        }
      `,
      premium: `
        .hero {
            background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
        }
        .cta-button {
            background: #f39c12;
        }
        .cta-button:hover {
            background: #e67e22;
        }
      `,
      conversion: `
        .hero {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        }
        .cta-button {
            background: #27ae60;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
      `,
      enterprise: `
        .hero {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }
        .cta-button {
            background: #3498db;
        }
        .cta-button:hover {
            background: #2980b9;
        }
      `
    }

    return baseStyles + (templateStyles[template as keyof typeof templateStyles] || templateStyles.modern)
  }

  private generateJS(affiliateLinks: any): string {
    return `
// Analytics and tracking
function trackClick(section) {
    // Track affiliate link clicks
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'affiliate',
            'event_label': section
        });
    }
    
    // Send to analytics endpoint
    fetch('/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event: 'affiliate_click',
            section: section,
            url: window.location.href,
            timestamp: new Date().toISOString()
        })
    }).catch(err => console.log('Tracking error:', err));
}

// FAQ functionality
function toggleFAQ(index) {
    const answer = document.getElementById('faq-' + index);
    const question = answer.previousElementSibling;
    const icon = question.querySelector('.faq-icon');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.textContent = '+';
    } else {
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.faq-icon').forEach(el => {
            el.textContent = '+';
        });
        
        // Open this FAQ
        answer.classList.add('active');
        icon.textContent = '-';
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
`
  }

  private getIconSVG(iconName: string): string {
    const icons: Record<string, string> = {
      star: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      zap: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      'trending-up': '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18l1.5 1.5 6-6 5 5L23 8V6z"/></svg>',
      headphones: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>'
    }
    
    return icons[iconName] || icons.star
  }
}

// Export singleton instance
export const netlifyService = new NetlifyService(process.env.NETLIFY_API_TOKEN || '')

// Helper functions
export async function deployWebsiteToNetlify(websiteId: string, websiteContent: any): Promise<string> {
  try {
    // Create site name from website title
    const siteName = `affilify-${websiteId.slice(-8)}`
    
    // Create Netlify site
    const site = await netlifyService.createSite(siteName)
    
    // Deploy website content
    const deployment = await netlifyService.deployWebsite(site.id, websiteContent)
    
    // Return the live URL
    return site.url
  } catch (error) {
    console.error('Netlify deployment error:', error)
    throw new Error('Failed to deploy website')
  }
}

export async function updateWebsiteDeployment(siteId: string, websiteContent: any): Promise<string> {
  try {
    const deployment = await netlifyService.deployWebsite(siteId, websiteContent)
    return deployment.url
  } catch (error) {
    console.error('Netlify update error:', error)
    throw new Error('Failed to update website')
  }
}


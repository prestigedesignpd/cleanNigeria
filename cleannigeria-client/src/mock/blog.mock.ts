import type { BlogPost } from '@/types/blog.types'

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog_001',
    slug: 'how-waste-management-transforms-nigerian-estates',
    title: 'How Proper Waste Management Transforms Nigerian Estates',
    excerpt: 'Discover how estates across Lagos, Abuja and Port Harcourt have improved property values and resident satisfaction through structured waste collection.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Waste Management',
    author: { name: 'Dr. Funmi Adesanya', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=funmi' },
    publishedAt: '2026-05-01T00:00:00Z',
    readTime: '5 min read',
    content: `
      <p>Waste management is often seen as a logistical challenge, but for many Nigerian estates, it has become a catalyst for transformation. Property values in estates with structured waste collection systems have shown a significant increase compared to those without.</p>
      
      <h2>1. Improved Aesthetics and Health</h2>
      <p>Nothing devalues a premium estate faster than overflowing bins and littered streets. A structured collection system ensures that waste is moved swiftly from point of generation to final disposal, eliminating odors and breeding grounds for pests.</p>
      
      <blockquote>
        "Cleanliness is not just a habit; in property management, it's a financial asset."
      </blockquote>

      <h2>2. Resident Satisfaction</h2>
      <p>Residents are increasingly demanding better services for their service charges. Estates like Green Court in Lekki have reported a 40% reduction in resident complaints after switching to a tech-driven waste management platform like CleanNigeria.</p>
      
      <h2>3. Environmental Responsibility</h2>
      <p>Nigerian estates generate thousands of tons of waste daily. By implementing sorting at source and regular pickups, we are reducing the strain on our landfills and building a more sustainable future for the next generation.</p>
    `
  },
  {
    id: 'blog_002',
    slug: 'recycling-in-nigeria-what-you-need-to-know',
    title: 'Recycling in Nigeria: What Every Estate Manager Needs to Know',
    excerpt: 'A practical guide to setting up recycling programs within your estate and reducing landfill contributions.',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    category: 'Sustainability',
    author: { name: 'Emeka Nwachukwu', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=nwachukwu' },
    publishedAt: '2026-04-20T00:00:00Z',
    readTime: '7 min read',
    content: `
      <p>Recycling is no longer just a "good to have" feature; it's a necessity. As Nigerian cities grow, our waste output is skyrocketing. Here's how you can make a difference in your estate.</p>

      <h2>The Three-Bin System</h2>
      <p>The most effective way to start is by introducing a simple three-bin system: Organic, Recyclable, and General Waste. This simple separation at the point of disposal makes the entire downstream process much more efficient.</p>

      <ul>
        <li><strong>Organic:</strong> Food scraps and garden waste.</li>
        <li><strong>Recyclable:</strong> Plastics, paper, metal, and glass.</li>
        <li><strong>General:</strong> Non-recyclable household items.</li>
      </ul>

      <p>Partnering with a specialized collector ensures that these sorted materials actually reach recycling plants instead of being mixed back together at the landfill.</p>
    `
  },
  {
    id: 'blog_003',
    slug: 'cleannigeria-now-serving-abuja',
    title: 'CleanNigeria Now Serving Abuja — Maitama, Wuse & Asokoro',
    excerpt: 'We are excited to announce our expansion into the Federal Capital Territory, bringing reliable waste management to three new zones.',
    coverImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    category: 'Company News',
    author: { name: 'CleanNigeria Team', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=team' },
    publishedAt: '2026-04-10T00:00:00Z',
    readTime: '3 min read',
    content: `
      <p>The Federal Capital Territory just got a little cleaner! We are proud to announce that CleanNigeria is officially operational in Abuja, starting with Maitama, Wuse, and Asokoro.</p>

      <p>Our mission has always been to standardize waste management across Nigeria, and Abuja represents a key milestone in our journey. Residents in these areas can now sign up for our premium plans and enjoy the same level of service that has made us a favorite in Lagos.</p>

      <p>We've already partnered with several estate associations in Garki and Maitama II, and our trucks are already on the ground. Sign up today and experience the future of waste management!</p>
    `
  },
]

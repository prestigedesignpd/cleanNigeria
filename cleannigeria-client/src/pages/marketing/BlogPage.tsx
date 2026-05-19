import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Search, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { buildSeoMeta } from '@/lib/seo'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { blogService } from '@/services/blog.service'
import { Skeleton } from '@/components/ui/skeleton'

const CATEGORIES = ['All', 'Waste Management', 'Sustainability', 'Company News', 'Guides']

export default function BlogPage() {
  const seo = buildSeoMeta({ title: 'Blog & Insights' })
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await blogService.getPosts()
        const data = Array.isArray(res) ? res : (res?.data || res || [])
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter((post: any) => {
    const categoryName = post.categoryId?.name || ''
    const matchesCategory = activeCategory === 'All' || categoryName === activeCategory
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet><title>{seo.title}</title></Helmet>
      
      <div className="min-h-screen bg-slate-50/50 py-12 md:py-16">
        <div className="max-w-[850px] mx-auto px-4 space-y-8 animate-in fade-in duration-500">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block">Articles & News</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">CleanNigeria Blog</h1>
            </div>
            
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search articles..." 
                className="h-10 pl-9 rounded-xl border-slate-200 bg-white focus-visible:ring-brand-600 text-slate-900 text-sm font-medium w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border shrink-0",
                  activeCategory === cat 
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-355 hover:text-slate-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Minimalist list layout */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl">
                  <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post: any) => (
                <Link key={post._id} to={`${ROUTES.BLOG}/${post.slug}`} className="group block">
                  <div className="flex gap-4 p-4 bg-white border border-slate-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-300 rounded-2xl items-start">
                    
                    {/* Thumbnail */}
                    <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100/60 relative">
                      {post.featuredImage?.url ? (
                        <img
                          src={post.featuredImage.url}
                          alt={post.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-50 flex items-center justify-center text-2xl">
                          📰
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <span className="text-brand-600 font-bold">{post.categoryId?.name || 'General'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {post.readTime || '5m read'}</span>
                      </div>
                      
                      <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          By {post.authorId ? `${post.authorId.firstName} ${post.authorId.lastName}` : 'Admin'}
                        </span>
                        <span className="text-brand-600 text-[10px] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 bg-white border border-slate-200/85 rounded-2xl">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950">No articles found</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Try modifying your filters or search criteria.</p>
              <Button size="sm" variant="outline" onClick={() => { setActiveCategory('All'); setSearchQuery('') }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Sleek, Minimalist Newsletter Card */}
          <div className="border border-slate-200 bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                Subscribe to our Newsletter
                <Sparkles className="h-4 w-4 text-brand-600" />
              </h4>
              <p className="text-xs text-slate-500 font-medium">Get monthly waste management insights and announcements.</p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto shrink-0" onSubmit={(e) => e.preventDefault()}>
              <Input 
                placeholder="Enter email..."
                className="h-9 px-3 rounded-xl border-slate-200 text-xs w-full sm:w-48 bg-slate-50/50"
              />
              <Button size="sm" className="h-9 px-4 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 text-xs shrink-0">
                Subscribe
              </Button>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

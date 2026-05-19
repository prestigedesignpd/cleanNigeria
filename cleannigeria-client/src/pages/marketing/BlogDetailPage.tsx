import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ArrowRight
} from 'lucide-react'

import { formatDate } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/routes'
import { useState, useEffect } from 'react'
import { blogService } from '@/services/blog.service'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    async function fetchPost() {
      try {
        if (!slug) return
        const data = await blogService.getPostBySlug(slug)
        setPost(data)
        // Fetch related posts from same category
        const res = await blogService.getPosts()
        const allPosts = Array.isArray(res) ? res : (res?.data || res || [])
        setRelatedPosts(allPosts.filter((p: any) => p.slug !== slug).slice(0, 2))
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-6 bg-white min-h-screen">
        <div className="max-w-[700px] mx-auto space-y-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-[250px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20 space-y-4 bg-white min-h-screen flex flex-col items-center justify-center">
        <h3 className="text-base font-bold text-slate-900">Article not found</h3>
        <Button size="sm" variant="outline" asChild className="rounded-xl">
          <Link to={ROUTES.BLOG}>Back to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>{post.title} | CleanNigeria Blog</title></Helmet>
      
      <div className="min-h-screen bg-slate-50/50 py-12 md:py-16">
        <div className="max-w-[700px] mx-auto px-4 space-y-8 animate-in fade-in duration-500">
          
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent text-slate-500 hover:text-brand-600 group">
            <Link to={ROUTES.BLOG} className="text-xs font-bold">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" /> 
              Back to Blog
            </Link>
          </Button>

          {/* Post Header */}
          <div className="space-y-4">
            <Badge className="bg-brand-50 text-brand-700 border-brand-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              {post.categoryId?.name || 'General'}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>
            
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt || post.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime || '5 min read'}</span>
            </div>
          </div>

          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative">
            {post.featuredImage?.url ? (
              <img src={post.featuredImage.url} alt={post.title} className="w-full h-auto aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-brand-50 to-slate-100 flex items-center justify-center text-4xl">
                📰
              </div>
            )}
          </div>

          {/* Main Content Body */}
          <article 
            className="prose prose-slate max-w-none 
              prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
              prose-blockquote:border-brand-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
              prose-strong:text-slate-900 prose-li:text-sm md:prose-li:text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tag Badges */}
          <div className="pt-8 border-t border-slate-200/60 flex flex-wrap gap-1.5">
            {['Environment', 'Nigeria', 'Sustainability'].map(tag => (
              <Badge key={tag} variant="outline" className="rounded-full px-3 py-0.5 text-[10px] text-slate-400 border-slate-200 bg-white">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Compact Author Section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-black text-base shrink-0">
              {post.authorId ? post.authorId.firstName?.[0] : 'A'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Published By</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {post.authorId ? `${post.authorId.firstName} ${post.authorId.lastName}` : 'Admin'}
              </p>
            </div>
          </div>

          {/* Simple Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-10 border-t border-slate-200/60 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">You might also like</h3>
                <Button variant="ghost" size="sm" asChild className="text-brand-600 hover:text-brand-700 font-bold p-0 text-xs">
                  <Link to={ROUTES.BLOG} className="flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((rp: any) => (
                  <Link key={rp._id} to={`${ROUTES.BLOG}/${rp.slug}`} className="group">
                    <Card className="overflow-hidden border-slate-200/80 bg-white hover:border-brand-200 hover:shadow-xl transition-all duration-300 rounded-xl h-full flex flex-col">
                      <div className="h-32 overflow-hidden bg-slate-50 relative shrink-0">
                        {rp.featuredImage?.url ? (
                          <img src={rp.featuredImage.url} alt={rp.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="h-full w-full bg-slate-100 flex items-center justify-center text-2xl">
                            📰
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-600 block">{rp.categoryId?.name || 'General'}</span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">{rp.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-50 mt-1">
                          By {rp.authorId ? `${rp.authorId.firstName} ${rp.authorId.lastName}` : 'Admin'}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

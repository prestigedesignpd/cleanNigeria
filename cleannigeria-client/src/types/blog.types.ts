export interface BlogAuthor {
  name: string
  avatar: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: 'Waste Management' | 'Sustainability' | 'Company News' | 'Guides'
  author: BlogAuthor
  publishedAt: string
  readTime: string
  tags?: string[]
}

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Share2, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Edit,
  Trash2,
  ExternalLink,
  MessageSquare,
  Globe,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { PostEditorModal } from '@/components/blog/PostEditorModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminBlogPosts, useDeletePost } from '@/hooks/useAdminBlog';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts = [], isLoading } = useAdminBlogPosts();
  const deleteMutation = useDeletePost();

  const filteredPosts = posts.filter((post: any) => {
    const authorName = post.authorId
      ? `${post.authorId.firstName || ''} ${post.authorId.lastName || ''}`.toLowerCase()
      : '';
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || post.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Article deleted successfully');
    } catch {
      toast.error('Failed to delete article');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Blog & Content</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Publish educational articles and platform updates to the client app.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800">
            <Globe className="h-4 w-4 mr-2" /> View Site
          </Button>
          <Button onClick={handleNew} className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-11 px-8">
            <Plus className="h-4 w-4 mr-2" /> New Article
          </Button>
        </div>
      </div>

      {/* Blog Stats — derived from live data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Total Articles', value: posts.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Published', value: posts.filter((p: any) => p.status === 'PUBLISHED').length, icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
           { label: 'Drafts', value: posts.filter((p: any) => p.status === 'DRAFT').length, icon: Share2, color: 'text-purple-600', bg: 'bg-purple-50' },
           { label: 'Total Views', value: posts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                 <stat.icon className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
                 <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{isLoading ? '—' : stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl shadow-neutral-200/20">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/30">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by title, author, or keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-neutral-900" 
            />
          </div>
          <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
             {['All', 'Published', 'Draft'].map((status) => (
               <Button 
                key={status}
                variant="ghost" 
                size="sm" 
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "h-9 px-6 text-xs font-bold rounded-lg transition-all",
                  statusFilter === status 
                    ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                    : "text-neutral-500 hover:text-neutral-700"
                )}
               >
                 {status}
               </Button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
               <tr>
                  <th className="px-6 py-4">Article Identity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Performance</th>
                  <th className="px-6 py-4 text-right pr-10">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
               {isLoading ? (
                 [1, 2, 3].map((i) => (
                   <tr key={i}>
                     <td className="px-6 py-6"><Skeleton className="h-12 w-full" /></td>
                     <td className="px-6 py-6"><Skeleton className="h-6 w-20" /></td>
                     <td className="px-6 py-6"><Skeleton className="h-6 w-16" /></td>
                     <td className="px-6 py-6"><Skeleton className="h-6 w-24" /></td>
                     <td className="px-6 py-6"><Skeleton className="h-10 w-10 ml-auto" /></td>
                   </tr>
                 ))
               ) : filteredPosts.length > 0 ? (
                 filteredPosts.map((post: any) => (
                   <tr key={post._id} className="hover:bg-neutral-50/30 transition-colors group">
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-16 w-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                             {post.featuredImage?.url
                               ? <img src={post.featuredImage.url} alt={post.title} className="w-full h-full object-cover" />
                               : <ImageIcon className="h-6 w-6 text-neutral-300" />}
                          </div>
                          <div>
                             <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 transition-colors cursor-pointer" onClick={() => handleEdit(post)}>
                                {post.title}
                             </h3>
                             <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                <span>{post.authorId ? `${post.authorId.firstName} ${post.authorId.lastName}` : 'Admin'}</span>
                                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <Badge variant="outline" className="font-bold border-neutral-200 text-neutral-600 bg-white">
                          {post.categoryId?.name || 'Uncategorized'}
                       </Badge>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            post.status === 'PUBLISHED' ? "bg-green-500" : "bg-amber-500"
                          )} />
                          <span className={cn(
                            "text-xs font-bold capitalize",
                            post.status === 'PUBLISHED' ? "text-green-600" : "text-amber-600"
                          )}>
                             {post.status?.toLowerCase()}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                                <Eye className="h-3 w-3" /> Views
                             </span>
                             <span className="text-sm font-bold text-neutral-700 mt-0.5">{post.viewCount ?? 0}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Published
                             </span>
                             <span className="text-sm font-bold text-neutral-700 mt-0.5">{post.status === 'PUBLISHED' ? 'Yes' : 'No'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-right pr-10">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-100" onClick={() => handleEdit(post)}>
                             <Edit className="h-5 w-5" />
                          </Button>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                   <MoreHorizontal className="h-5 w-5" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-xl w-52 shadow-xl border-neutral-200">
                                <DropdownMenuLabel>Article Operations</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                   <ExternalLink className="h-4 w-4 mr-2" /> View on Live Site
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                   <Zap className="h-4 w-4 mr-2" /> Boost Engagement
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                   <BarChart3 className="h-4 w-4 mr-2" /> Full Analytics
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDelete(post._id)}>
                                   <Trash2 className="h-4 w-4 mr-2" /> Move to Trash
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </td>
                 </tr>
                ))
               ) : (
                 <tr>
                   <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                     No articles found.
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50/30">
           <div>{filteredPosts.length} Articles listed</div>
           <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-500 animate-pulse" />
              Content engine active
           </div>
        </div>
      </div>

      <PostEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
}

const ImageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FileText, 
  Image as ImageIcon, 
  User, 
  Layout, 
  CheckCircle2, 
  Send,
  Eye,
  Type,
  List,
  Bold,
  Italic,
  Link,
  Upload,
  Globe,
  X,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCreatePost, useUpdatePost, useAdminCategories } from '@/hooks/useAdminBlog';
import api from '@/lib/api';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
}

export function PostEditorModal({ isOpen, onClose, post }: PostEditorModalProps) {
  const { data: categories = [] } = useAdminCategories();
  const defaultCategoryId = categories.length > 0 ? categories[0]._id : '';

  const [formData, setFormData] = useState<any>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT',
    featuredImage: { url: '', publicId: '' }
  });

  // Cover Image Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'url'>('device');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        categoryId: post.categoryId?._id || post.categoryId || '',
        status: post.status || 'DRAFT',
        featuredImage: post.featuredImage || { url: '', publicId: '' }
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        categoryId: defaultCategoryId,
        status: 'DRAFT',
        featuredImage: { url: '', publicId: '' }
      });
    }
  }, [post, isOpen, defaultCategoryId]);

  const createMutation = useCreatePost()
  const updateMutation = useUpdatePost()

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataPayload = new FormData();
    formDataPayload.append('image', file);

    try {
      const res = await api.post('/cms/upload', formDataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.data.url;
      setFormData((prev: any) => ({
        ...prev,
        featuredImage: { url: uploadedUrl, publicId: '' }
      }));
      setUploadModalOpen(false);
      toast.success('Cover image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image from device');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlUpload = async () => {
    if (!imageUrlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setUploading(true);
    try {
      const res = await api.post('/cms/upload', { url: imageUrlInput.trim() });
      const uploadedUrl = res.data.data.url;
      setFormData((prev: any) => ({
        ...prev,
        featuredImage: { url: uploadedUrl, publicId: '' }
      }));
      setImageUrlInput('');
      setUploadModalOpen(false);
      toast.success('Cover image imported from URL successfully!');
    } catch (err) {
      toast.error('Failed to import image from URL');
    } finally {
      setUploading(false);
    }
  };

  const removeCoverImage = () => {
    setFormData((prev: any) => ({
      ...prev,
      featuredImage: { url: '', publicId: '' }
    }));
    toast.success('Cover image removed');
  };

  const handleSave = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!formData.title || !formData.content) {
      toast.error('Please provide a title and content');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    const payload = {
      ...formData,
      status: status,
    }

    try {
      if (post) {
        await updateMutation.mutateAsync({ id: post.id || post._id, data: payload })
        toast.success('Article updated')
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Article created successfully')
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save article')
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 text-neutral-400 mb-2">
               <FileText className="h-5 w-5" />
               <span className="text-xs font-black uppercase tracking-widest">{post ? 'Edit Article' : 'New Draft'}</span>
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight">
              {post ? 'Revise Article' : 'Compose New Article'}
            </DialogTitle>
            <DialogDescription>
               Craft educational content and platform updates for the CleanNigeria audience.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
             {/* Editor Side */}
             <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Article Title</label>
                   <Input 
                     placeholder="Enter a compelling headline..." 
                     className="h-14 text-xl font-bold rounded-2xl border-neutral-200 focus-visible:ring-neutral-900"
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Content Body</label>
                   <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-50/30">
                      <div className="flex items-center gap-1 p-2 border-b border-neutral-100 bg-white">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Bold className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Italic className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><List className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Link className="h-4 w-4" /></Button>
                         <div className="w-px h-4 bg-neutral-200 mx-1" />
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ImageIcon className="h-4 w-4" /></Button>
                      </div>
                      <Textarea 
                        placeholder="Start writing your story..." 
                        className="min-h-[400px] border-none focus-visible:ring-0 bg-transparent resize-none p-6 leading-relaxed text-lg"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      />
                   </div>
                </div>
             </div>

             {/* Metadata Side */}
             <div className="space-y-6">
                <Card className="border-neutral-200 shadow-none rounded-2xl overflow-hidden bg-neutral-50/50">
                   <CardHeader className="py-4 px-6 border-b border-neutral-100 bg-white">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400">Settings</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Category</label>
                         <Select value={formData.categoryId} onValueChange={(v: any) => setFormData({...formData, categoryId: v})}>
                            <SelectTrigger className="rounded-xl h-11">
                               <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                               {categories.map((cat: any) => (
                                 <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Article Summary</label>
                         <Textarea 
                           placeholder="Short excerpt for SEO and feed cards..." 
                           className="min-h-[100px] rounded-xl border-neutral-200 text-xs"
                           value={formData.excerpt}
                           onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                         />
                      </div>

                      {/* Cover Image Upload / Preview */}
                      <div className="p-4 bg-white border border-neutral-100 rounded-xl space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">Cover Image</label>
                         {formData.featuredImage?.url ? (
                           <div className="relative group rounded-lg overflow-hidden border border-neutral-200 aspect-video bg-neutral-100">
                              <img 
                                src={formData.featuredImage.url} 
                                alt="Cover preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Button 
                                   variant="destructive" 
                                   size="icon" 
                                   className="h-9 w-9 rounded-full shadow-lg"
                                   onClick={removeCoverImage}
                                 >
                                    <Trash2 className="h-4.5 w-4.5" />
                                 </Button>
                              </div>
                           </div>
                         ) : (
                           <div 
                             onClick={() => setUploadModalOpen(true)}
                             className="h-32 w-full border-2 border-dashed border-neutral-150 rounded-lg flex flex-col items-center justify-center text-neutral-450 gap-2 hover:border-neutral-350 transition-colors cursor-pointer bg-neutral-50/50"
                           >
                              <Upload className="h-7 w-7 text-neutral-400" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Upload Cover Image</span>
                           </div>
                         )}
                      </div>
                   </CardContent>
                </Card>

                <div className="flex gap-2">
                   <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold" onClick={() => handleSave('DRAFT')}>
                      <Layout className="h-4 w-4 mr-2" /> Save Draft
                   </Button>
                   <Button className="flex-1 h-11 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold text-white" onClick={() => handleSave('PUBLISHED')}>
                      <Send className="h-4 w-4 mr-2" /> Publish Now
                   </Button>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Image Upload Dialog */}
      {uploadModalOpen && (
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tight">Add Cover Image</DialogTitle>
              <DialogDescription>
                Choose to upload from your local device or import from a direct web URL link.
              </DialogDescription>
            </DialogHeader>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 mt-2">
              <button 
                className={cn(
                  "flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5", 
                  activeTab === 'device' ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
                onClick={() => setActiveTab('device')}
              >
                <Upload className="h-3.5 w-3.5" /> Device File
              </button>
              <button 
                className={cn(
                  "flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5", 
                  activeTab === 'url' ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
                onClick={() => setActiveTab('url')}
              >
                <Globe className="h-3.5 w-3.5" /> Image Link
              </button>
            </div>

            <div className="py-4 min-h-[120px] flex flex-col justify-center">
              {activeTab === 'device' ? (
                <div 
                  className="border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleDeviceUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 text-neutral-900 animate-spin" />
                      <span className="text-xs font-bold text-neutral-500">Uploading to cloud...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-750">Browse local computer files</span>
                      <span className="text-[10px] text-neutral-400">JPEG, PNG, WebP up to 5MB</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Direct Image Link URL</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      disabled={uploading}
                      className="pl-9 h-11 rounded-xl text-neutral-800"
                    />
                  </div>
                  <Button 
                    onClick={handleUrlUpload} 
                    disabled={uploading || !imageUrlInput.trim()}
                    className="w-full h-11 bg-neutral-900 text-white font-bold rounded-xl text-xs hover:bg-neutral-850"
                  >
                    {uploading ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Globe className="h-3.5 w-3.5 mr-1.5" />}
                    {uploading ? 'Importing Image...' : 'Import from URL'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("border rounded-xl", className)}>{children}</div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("border-b", className)}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("", className)}>{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={cn("font-bold", className)}>{children}</h3>
);

import React, { useState, useRef } from 'react';
import { 
  LayoutTemplate, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  GripVertical,
  CheckCircle2,
  RefreshCw,
  Upload,
  Globe,
  X,
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockLandingConfig, type LandingPageConfig, type HeroImage } from '@/mock/marketing_cms.mock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAdminCms, useUpdateAdminCms } from '@/hooks/useAdminEntities';
import api from '@/lib/api';

export default function LandingPageCMS() {
  const { data: dbConfig, isLoading } = useAdminCms('landing-page');
  const updateMutation = useUpdateAdminCms();

  // Initialize with DB data if available, else mock
  const [config, setConfig] = useState<LandingPageConfig>(mockLandingConfig);
  
  // Sync state when DB data loads
  React.useEffect(() => {
    if (dbConfig) {
      setConfig(dbConfig as LandingPageConfig);
    }
  }, [dbConfig]);

  // Image Upload Dialog State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'url'>('device');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ key: 'landing-page', content: config });
      toast.success('Landing page configuration published to live site');
    } catch (err) {
      toast.error('Failed to publish changes');
    }
  };

  const handlePreview = () => {
    window.open('http://localhost:5173', '_blank');
  };

  const handleDeleteImage = (id: string) => {
    setConfig(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter(img => img.id !== id)
    }));
    toast.success('Image removed from gallery. Remember to publish changes!');
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/cms/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.data.url;

      const newImage: HeroImage = {
        id: `IMG-${Math.floor(Math.random() * 10000)}`,
        url: uploadedUrl,
        altText: 'CleanNigeria hero initiative',
        order: config.heroImages.length + 1
      };

      setConfig(prev => ({
        ...prev,
        heroImages: [...prev.heroImages, newImage]
      }));
      setUploadModalOpen(false);
      toast.success('Device image uploaded and added successfully!');
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

      const newImage: HeroImage = {
        id: `IMG-${Math.floor(Math.random() * 10000)}`,
        url: uploadedUrl,
        altText: 'CleanNigeria hero initiative',
        order: config.heroImages.length + 1
      };

      setConfig(prev => ({
        ...prev,
        heroImages: [...prev.heroImages, newImage]
      }));
      setImageUrlInput('');
      setUploadModalOpen(false);
      toast.success('URL image imported and added successfully!');
    } catch (err) {
      toast.error('Failed to import image from URL. Make sure it is a direct image link.');
    } finally {
      setUploading(false);
    }
  };

  const handleResetCms = () => {
    setConfig(prev => ({
      ...prev,
      heroImages: []
    }));
    toast.success('All hero images cleared! Remember to publish changes to start fresh.');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-4">
            Landing Page CMS
            <LayoutTemplate className="h-8 w-8 text-indigo-600" />
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Manage the copy and hero images displayed on the client home page.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={handleResetCms} className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800 text-red-600 hover:text-red-700 font-bold">
            <Trash className="h-4 w-4 mr-2" /> Clear All Images
          </Button>
          <Button variant="outline" onClick={handlePreview} className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800 font-bold">
            <Eye className="h-4 w-4 mr-2" /> Live Preview
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateMutation.isPending}
            className="flex-1 md:flex-none h-11 px-8 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold shadow-lg shadow-neutral-200"
          >
            {updateMutation.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {updateMutation.isPending ? 'Publishing...' : 'Publish Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Copywriting Editor */}
         <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 rounded-2xl overflow-hidden">
               <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-5">
                  <div className="flex items-center gap-2">
                     <Type className="h-5 w-5 text-indigo-600" />
                     <CardTitle className="text-lg font-bold">Hero Copywriting</CardTitle>
                  </div>
                  <CardDescription>Update the primary text seen by visitors.</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Main Headline (H1)</label>
                        <span className={cn("text-[10px] font-bold", config.mainHeadline.length > 50 ? "text-amber-500" : "text-neutral-400")}>
                           {config.mainHeadline.length}/60
                        </span>
                      </div>
                     <Input 
                        value={config.mainHeadline}
                        onChange={(e) => setConfig({...config, mainHeadline: e.target.value})}
                        className="h-14 text-lg font-bold rounded-xl border-neutral-200"
                        placeholder="Enter the main headline..."
                     />
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Subheadline Description</label>
                     </div>
                     <Textarea 
                        value={config.subHeadline}
                        onChange={(e) => setConfig({...config, subHeadline: e.target.value})}
                        className="min-h-[120px] text-base leading-relaxed rounded-xl border-neutral-200 resize-none"
                        placeholder="Enter the supporting description..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                     <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block">Primary Action (CTA)</label>
                        <Input 
                           value={config.primaryCtaText}
                           onChange={(e) => setConfig({...config, primaryCtaText: e.target.value})}
                           className="h-11 rounded-xl border-neutral-200 font-bold bg-green-50/50"
                           placeholder="Button Text"
                        />
                        <div className="relative">
                           <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                           <Input 
                              value={config.primaryCtaLink}
                              onChange={(e) => setConfig({...config, primaryCtaLink: e.target.value})}
                              className="h-11 pl-9 rounded-xl border-neutral-200 text-xs"
                              placeholder="/path"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-400 block">Secondary Action</label>
                        <Input 
                           value={config.secondaryCtaText}
                           onChange={(e) => setConfig({...config, secondaryCtaText: e.target.value})}
                           className="h-11 rounded-xl border-neutral-200 font-bold"
                           placeholder="Button Text"
                        />
                        <div className="relative">
                           <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                           <Input 
                              value={config.secondaryCtaLink}
                              onChange={(e) => setConfig({...config, secondaryCtaLink: e.target.value})}
                              className="h-11 pl-9 rounded-xl border-neutral-200 text-xs"
                              placeholder="/path"
                           />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Hero Image Gallery */}
         <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 rounded-2xl overflow-hidden h-full flex flex-col">
               <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-5 flex flex-row items-center justify-between">
                  <div>
                     <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-lg font-bold">Hero Images</CardTitle>
                     </div>
                     <CardDescription>Manage the background images or carousel slides.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setUploadModalOpen(true)} className="rounded-lg bg-neutral-900 text-white font-bold h-9">
                     <Plus className="h-4 w-4 mr-2" /> Add Image
                  </Button>
               </CardHeader>
               <CardContent className="p-6 flex-1 bg-neutral-50/30">
                  <div className="space-y-4">
                     {config.heroImages.map((img, idx) => (
                        <div key={img.id} className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl hover:border-neutral-300 transition-colors">
                           <div className="cursor-grab text-neutral-400 hover:text-neutral-900 shrink-0 px-1">
                              <GripVertical className="h-5 w-5" />
                           </div>
                           <div className="h-16 w-24 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                              <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <Input 
                                 value={img.altText}
                                 onChange={(e) => {
                                    const newImages = [...config.heroImages];
                                    newImages[idx].altText = e.target.value;
                                    setConfig({...config, heroImages: newImages});
                                 }}
                                 className="h-8 text-xs border-transparent hover:border-neutral-200 focus:border-neutral-200 bg-transparent px-2"
                                 placeholder="Image alt text for SEO..."
                              />
                              <p className="text-[10px] text-neutral-400 font-bold ml-2 mt-1">Slide {idx + 1} • {img.id}</p>
                           </div>
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteImage(img.id)}
                              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     ))}
                     
                     {config.heroImages.length === 0 && (
                        <div className="py-12 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center text-neutral-400 space-y-3">
                           <ImageIcon className="h-8 w-8" />
                           <p className="text-sm font-bold">No images added</p>
                           <p className="text-xs">Upload an image to serve as the hero background.</p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* Upload Image Modal Dialog */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Add Hero Image</h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setUploadModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 dark:border-neutral-800 mt-4">
              <button 
                className={cn(
                  "flex-1 py-2 text-sm font-bold border-b-2 transition-colors", 
                  activeTab === 'device' ? "border-indigo-600 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-850"
                )}
                onClick={() => setActiveTab('device')}
              >
                <Upload className="h-4 w-4 inline-block mr-1.5" /> Device Upload
              </button>
              <button 
                className={cn(
                  "flex-1 py-2 text-sm font-bold border-b-2 transition-colors", 
                  activeTab === 'url' ? "border-indigo-600 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-850"
                )}
                onClick={() => setActiveTab('url')}
              >
                <Globe className="h-4 w-4 inline-block mr-1.5" /> Image URL Link
              </button>
            </div>

            <div className="py-6 min-h-[140px] flex flex-col justify-center">
              {activeTab === 'device' ? (
                <div 
                  className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl p-8 text-center cursor-pointer transition-colors"
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
                      <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                      <span className="text-xs font-bold text-neutral-500">Uploading to cloud storage...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Browse device files</span>
                      <span className="text-xs text-neutral-400">Supports JPEG, PNG, or WebP up to 5MB</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Image URL Endpoint</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                      placeholder="https://example.com/clean-city.jpg" 
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      disabled={uploading}
                      className="pl-9 h-11 rounded-xl"
                    />
                  </div>
                  <Button 
                    onClick={handleUrlUpload} 
                    disabled={uploading || !imageUrlInput.trim()}
                    className="w-full h-11 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-bold rounded-xl"
                  >
                    {uploading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                    {uploading ? 'Importing Image...' : 'Import from URL'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

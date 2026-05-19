import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockFAQs, type FAQ } from '@/mock/faq.mock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminCms, useUpdateAdminCms } from '@/hooks/useAdminEntities';

export default function FaqManagerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);

  const { data: faqCms, isLoading } = useAdminCms('faq');
  const updateCmsMutation = useUpdateAdminCms();

  const categories = ['All', 'Billing', 'Scheduling', 'Account', 'Technical', 'General'];

  // Fallback to mock FAQs if not yet initialized in database
  const faqList: FAQ[] = faqCms?.faqs || mockFAQs;

  const filteredFaqs = faqList.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (formData: Partial<FAQ>) => {
    try {
      let updatedFaqs: FAQ[] = [];
      if (selectedFaq) {
        // Edit mode
        updatedFaqs = faqList.map(item => item.id === selectedFaq.id ? { ...item, ...formData } as FAQ : item);
      } else {
        // Create mode
        const newFaq: FAQ = {
          id: `FAQ-${Date.now()}`,
          question: formData.question || '',
          answer: formData.answer || '',
          category: (formData.category || 'General') as any,
          status: (formData.status || 'Active') as any,
          order: faqList.length + 1
        };
        updatedFaqs = [...faqList, newFaq];
      }

      await updateCmsMutation.mutateAsync({ key: 'faq', content: { faqs: updatedFaqs } });
      toast.success(selectedFaq ? 'Question updated successfully' : 'Question published successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save support question');
    }
  };

  const handleToggleStatus = async (faq: FAQ) => {
    try {
      const updatedStatus = faq.status === 'Active' ? 'Hidden' : 'Active';
      const updatedFaqs = faqList.map(item => item.id === faq.id ? { ...item, status: updatedStatus } as FAQ : item);
      await updateCmsMutation.mutateAsync({ key: 'faq', content: { faqs: updatedFaqs } });
      toast.success(updatedStatus === 'Active' ? 'Question is now live on support page' : 'Question hidden from client view');
    } catch (error) {
      toast.error('Failed to update visibility status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedFaqs = faqList.filter(item => item.id !== id);
      await updateCmsMutation.mutateAsync({ key: 'faq', content: { faqs: updatedFaqs } });
      toast.success('Question removed from support documentation');
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-4">
            Help Desk CMS
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Manage frequently asked questions and support documentation.</p>
        </div>
        <Button onClick={handleNew} className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold h-11 px-8 rounded-xl shadow-lg shadow-neutral-200">
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-600 mb-4" />
          <h2 className="text-lg font-bold">Loading support documentation...</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Categories Sidebar */}
           <div className="lg:col-span-1 space-y-4">
              <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                 <CardHeader className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400">Content Segments</CardTitle>
                 </CardHeader>
                 <CardContent className="p-2 space-y-1">
                    {categories.map((cat) => (
                      <Button 
                        key={cat}
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start h-11 px-4 font-bold rounded-xl transition-all",
                          categoryFilter === cat 
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md" 
                            : "text-neutral-500 hover:bg-neutral-100"
                        )}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                 </CardContent>
              </Card>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
                 <div className="h-10 w-10 bg-white dark:bg-neutral-900 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                    <AlertCircle className="h-5 w-5" />
                 </div>
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Live Support Sync</p>
                 <p className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                    Changes made here are instantly synced to the Client App and the internal Support Portal.
                 </p>
              </div>
           </div>

           {/* FAQ List */}
           <div className="lg:col-span-3 space-y-6">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                 <Input 
                   placeholder="Search support documentation..." 
                   className="h-14 pl-12 rounded-2xl border-neutral-200 focus:ring-neutral-900 shadow-sm text-lg"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="space-y-4">
                 {filteredFaqs.map((faq) => (
                   <Card key={faq.id} className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden hover:border-neutral-300 transition-colors group">
                      <div className="p-6 flex gap-4">
                         <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors cursor-grab">
                            <GripVertical className="h-5 w-5" />
                         </div>
                         <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-neutral-100">{faq.category}</Badge>
                                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{faq.question}</h3>
                               </div>
                               <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-neutral-100" onClick={() => handleEdit(faq)}>
                                     <Edit className="h-4 w-4" />
                                  </Button>
                                  <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                           <MoreVertical className="h-4 w-4" />
                                        </Button>
                                     </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end" className="rounded-xl w-48 shadow-xl">
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleStatus(faq)}>
                                           {faq.status === 'Active' ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                           {faq.status === 'Active' ? 'Hide from Client' : 'Publish to Client'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDelete(faq.id)}>
                                           <Trash2 className="h-4 w-4 mr-2" /> Delete Question
                                        </DropdownMenuItem>
                                     </DropdownMenuContent>
                                  </DropdownMenu>
                               </div>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-l-2 border-neutral-100 dark:border-neutral-800 pl-4">
                               {faq.answer}
                            </p>
                         </div>
                      </div>
                   </Card>
                 ))}
                 
                 {filteredFaqs.length === 0 && (
                   <div className="py-20 text-center space-y-4 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                      <div className="h-16 w-16 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-300 mx-auto shadow-sm">
                         <Search className="h-8 w-8" />
                      </div>
                      <div>
                         <p className="text-lg font-bold">No documentation found</p>
                         <p className="text-sm text-neutral-500">Try adjusting your filters or search terms.</p>
                      </div>
                      <Button variant="outline" onClick={() => {setSearchTerm(''); setCategoryFilter('All')}}>Clear All Filters</Button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <FaqModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faq={selectedFaq}
        onSave={handleSave}
        isSaving={updateCmsMutation.isPending}
      />
    </div>
  );
}

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
  onSave: (data: Partial<FAQ>) => void;
  isSaving: boolean;
}

function FaqModal({ isOpen, onClose, faq, onSave, isSaving }: FaqModalProps) {
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General',
    status: 'Active'
  });

  React.useEffect(() => {
    if (faq) {
      setFormData(faq);
    } else {
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        status: 'Active'
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = () => {
    if (!formData.question || !formData.answer) {
      toast.error('Question and Answer are required');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">{faq ? 'Edit Documentation' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
             Define clear answers to help users navigate the platform effectively.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-400">The Question</label>
              <Input 
                placeholder="How do I...?" 
                className="h-12 rounded-xl border-neutral-200 focus:ring-neutral-900"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-400">The Answer</label>
              <Textarea 
                placeholder="Provide a concise and helpful answer..." 
                className="min-h-[150px] rounded-xl border-neutral-200 leading-relaxed focus:ring-neutral-900"
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Category</label>
                 <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="h-11 rounded-xl">
                       <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Billing">Billing</SelectItem>
                       <SelectItem value="Scheduling">Scheduling</SelectItem>
                       <SelectItem value="Account">Account</SelectItem>
                       <SelectItem value="Technical">Technical</SelectItem>
                       <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Visibility</label>
                 <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="h-11 rounded-xl">
                       <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Active">Published</SelectItem>
                       <SelectItem value="Hidden">Hidden (Draft)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button variant="ghost" className="rounded-xl font-bold" onClick={onClose} disabled={isSaving}>Discard</Button>
          <Button className="rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold px-8 h-11" onClick={handleSubmit} disabled={isSaving}>
             {isSaving ? 'Syncing...' : (faq ? 'Update Document' : 'Publish Question')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

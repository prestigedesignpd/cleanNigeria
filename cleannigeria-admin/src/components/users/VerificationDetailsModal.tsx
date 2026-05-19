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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Download,
  Building2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Send
} from 'lucide-react';
import type { VerificationRequest } from '@/mock/verifications.mock';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUpdateVerificationStatus } from '@/hooks/useAdminUsers';
import { cn } from '@/lib/utils';

interface VerificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: VerificationRequest | null;
}

export function VerificationDetailsModal({ isOpen, onClose, request }: VerificationDetailsModalProps) {
  const [docStatuses, setDocStatuses] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (request) {
      const initialStatuses: Record<string, string> = {};
      request.documents.forEach(doc => {
        initialStatuses[doc.id] = doc.status;
      });
      setDocStatuses(initialStatuses);
      setFeedback(request.notes || '');
    }
  }, [request, isOpen]);

  const handleDocStatusChange = (docId: string, status: string) => {
    setDocStatuses(prev => ({ ...prev, [docId]: status }));
  };

  const updateStatusMutation = useUpdateVerificationStatus();

  const handleFinalDecision = async (decision: 'Approved' | 'Rejected' | 'Needs Info') => {
    // Basic validation
    const allDocsVerified = Object.values(docStatuses).every(status => status === 'Verified');
    
    if (decision === 'Approved' && !allDocsVerified) {
      toast.error('Cannot approve: Not all documents are verified');
      return;
    }

    if ((decision === 'Rejected' || decision === 'Needs Info') && !feedback) {
      toast.error('Please provide a reason in the feedback section');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: request.id,
        status: decision,
        notes: feedback
      });
      toast.success(`Application successfully marked as ${decision}`);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update status: ${error.message}`);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-neutral-900 p-8 pb-12 relative text-white">
           <div className="absolute top-4 right-4">
              <Badge className={cn(
                 "font-bold uppercase tracking-widest text-[10px]",
                 request.status === 'Pending' ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/20" :
                 request.status === 'In Review' ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/20" :
                 "bg-neutral-500/20 text-neutral-300 hover:bg-neutral-500/20"
              )}>
                 {request.status}
              </Badge>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                 <ShieldCheck className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                 <h2 className="text-3xl font-black tracking-tight">{request.applicantName}</h2>
                 <p className="text-neutral-400 font-medium">Application ID: {request.id}</p>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="p-8 -mt-8 relative z-10 bg-white dark:bg-neutral-950 rounded-t-3xl space-y-8">
           
           {/* Profile Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"><Building2 className="h-3 w-3" /> Entity Type</p>
                 <p className="font-bold text-sm">{request.entityType}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                 <p className="font-bold text-sm">{request.contactEmail}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                 <p className="font-bold text-sm">{request.contactPhone}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="h-3 w-3" /> Submitted</p>
                 <p className="font-bold text-sm">{format(new Date(request.submissionDate), 'MMM dd, yyyy')}</p>
              </div>
           </div>

           {/* Document Checklist */}
           <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 pb-2">Document Verification Checklist</h3>
              
              <div className="space-y-3">
                 {request.documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl gap-4 bg-neutral-50/50">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                             "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                             docStatuses[doc.id] === 'Verified' ? "bg-green-100 text-green-600" :
                             docStatuses[doc.id] === 'Rejected' ? "bg-red-100 text-red-600" :
                             "bg-white border border-neutral-200 text-neutral-400"
                          )}>
                             {docStatuses[doc.id] === 'Verified' ? <CheckCircle2 className="h-6 w-6" /> :
                              docStatuses[doc.id] === 'Rejected' ? <XCircle className="h-6 w-6" /> :
                              <FileText className="h-6 w-6" />}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">{doc.name}</p>
                             <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] font-bold border-neutral-200">{doc.type}</Badge>
                                <span className="text-[10px] text-neutral-500 font-bold">{doc.size}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 w-full sm:w-auto border-t border-neutral-100 sm:border-0 pt-3 sm:pt-0">
                          <div className="flex gap-1 bg-white p-1 rounded-lg border border-neutral-200 mr-2 flex-1 sm:flex-none justify-center">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-8 rounded-md text-xs font-bold", docStatuses[doc.id] === 'Verified' && "bg-green-50 text-green-700 hover:bg-green-100")}
                                onClick={() => handleDocStatusChange(doc.id, 'Verified')}
                             >
                                Valid
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-8 rounded-md text-xs font-bold", docStatuses[doc.id] === 'Rejected' && "bg-red-50 text-red-700 hover:bg-red-100")}
                                onClick={() => handleDocStatusChange(doc.id, 'Rejected')}
                             >
                                Invalid
                             </Button>
                          </div>
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" title="Preview Document">
                             <Eye className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Feedback Section */}
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                 <AlertCircle className="h-3 w-3" /> Reviewer Notes / Feedback to Applicant
              </label>
              <Textarea 
                 placeholder="If rejecting or requesting more info, explain what is needed here..." 
                 className="min-h-[100px] rounded-xl border-neutral-200 focus-visible:ring-neutral-900 resize-none"
                 value={feedback}
                 onChange={(e) => setFeedback(e.target.value)}
              />
           </div>

           {/* Final Actions */}
           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button 
                 variant="outline" 
                 className="flex-1 h-12 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                 onClick={() => handleFinalDecision('Rejected')}
                 disabled={updateStatusMutation.isPending}
              >
                 <XCircle className="h-4 w-4 mr-2" /> Reject Application
              </Button>
              <Button 
                 variant="outline" 
                 className="flex-1 h-12 rounded-xl font-bold border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                 onClick={() => handleFinalDecision('Needs Info')}
                 disabled={updateStatusMutation.isPending}
              >
                 <Send className="h-4 w-4 mr-2" /> Request Resubmission
              </Button>
              <Button 
                 className="flex-1 h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
                 onClick={() => handleFinalDecision('Approved')}
                 disabled={updateStatusMutation.isPending}
              >
                 <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Activate
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

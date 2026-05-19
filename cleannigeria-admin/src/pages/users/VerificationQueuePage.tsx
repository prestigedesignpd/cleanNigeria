import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FolderOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { VerificationDetailsModal } from '@/components/users/VerificationDetailsModal';

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string;
}

export interface VerificationRequest {
  id: string;
  realId?: string;
  applicantName: string;
  entityType: 'Estate' | 'Business' | 'Collector';
  contactEmail: string;
  contactPhone: string;
  submissionDate: string | Date;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  notes?: string;
  documents: VerificationDocument[];
}
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useVerificationRequests } from '@/hooks/useAdminUsers';

export default function VerificationQueuePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: queue = [], isLoading } = useVerificationRequests();

  const filteredQueue = queue.filter((req: VerificationRequest) => {
    const matchesSearch = 
      req.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReview = (req: VerificationRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleQuickAction = (action: string) => {
    toast.info(`Action: ${action}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <p className="text-neutral-500 font-medium">Loading approval desk queue...</p>
      </div>
    );
  }

  const pendingCount = queue.filter((v: any) => v.status === 'Pending').length;
  const inReviewCount = queue.filter((v: any) => v.status === 'In Review').length;
  const rejectedCount = queue.filter((v: any) => v.status === 'Rejected').length;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-4">
            Approval Desk
            <ShieldAlert className="h-8 w-8 text-amber-500" />
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Verify documents and approve new Estate and Business registrations.</p>
        </div>
      </div>

      {/* Queue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Pending Reviews', value: pendingCount, icon: FolderOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'In Progress', value: inReviewCount, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Avg Resolution Time', value: '4.2 hrs', icon: AlertTriangle, color: 'text-neutral-600', bg: 'bg-neutral-100' },
           { label: 'Recently Rejected', value: rejectedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                 <stat.icon className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
                 <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Queue Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl shadow-neutral-200/20">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/30">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by applicant name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-neutral-900" 
            />
          </div>
          <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl overflow-x-auto w-full lg:w-auto no-scrollbar">
             {['All', 'Pending', 'In Review', 'Approved', 'Rejected'].map((status) => (
               <Button 
                key={status}
                variant="ghost" 
                size="sm" 
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "h-9 px-6 text-xs font-bold rounded-lg transition-all shrink-0",
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
                  <th className="px-6 py-2.5">Applicant Identity</th>
                  <th className="px-6 py-2.5">Submission Details</th>
                  <th className="px-6 py-2.5">Documents</th>
                  <th className="px-6 py-2.5">Status</th>
                  <th className="px-6 py-2.5 text-right pr-10">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
               {filteredQueue.map((req: VerificationRequest) => (
                 <tr key={req.id} className="hover:bg-neutral-50/30 transition-colors group">
                    <td className="px-6 py-3">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                             "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-[13px] shrink-0",
                             req.entityType === 'Estate' ? "bg-indigo-100 text-indigo-700" :
                             req.entityType === 'Business' ? "bg-cyan-100 text-cyan-700" :
                             "bg-emerald-100 text-emerald-700"
                          )}>
                             {req.applicantName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                             <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleReview(req)}>
                                {req.applicantName}
                             </h3>
                             <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] h-5 font-bold border-neutral-200">
                                   {req.entityType}
                                </Badge>
                                <span className="text-[10px] text-neutral-400 font-bold">{req.id}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-3">
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white">{req.contactEmail}</p>
                          <p className="text-xs text-neutral-500 font-medium">Submitted {format(new Date(req.submissionDate), 'MMM dd, yyyy')}</p>
                       </div>
                    </td>
                    <td className="px-6 py-3">
                       <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                          {req.documents.length} Attachment{req.documents.length !== 1 && 's'}
                       </span>
                    </td>
                    <td className="px-6 py-3">
                       <Badge className={cn(
                          "font-bold uppercase tracking-wider text-[9px] px-3 py-1 rounded-full",
                          req.status === 'Pending' ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                          req.status === 'In Review' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                          req.status === 'Approved' ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          "bg-red-100 text-red-800 hover:bg-red-100"
                       )}>
                          {req.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-3 text-right pr-10">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                             variant="outline" 
                             size="sm" 
                             onClick={() => handleReview(req)}
                             className="h-9 px-4 rounded-xl font-bold border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
                          >
                             Review
                          </Button>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                   <MoreHorizontal className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-xl w-48 shadow-xl border-neutral-200">
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickAction('Assign to me')}>
                                   Assign to me
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleQuickAction('Mark as High Priority')}>
                                   Mark High Priority
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </td>
                 </tr>
               ))}
               {filteredQueue.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-16 text-center">
                       <div className="h-16 w-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 mx-auto mb-4">
                          <CheckCircle2 className="h-8 w-8 text-green-400" />
                       </div>
                       <p className="text-lg font-bold text-neutral-900">Queue is empty</p>
                       <p className="text-sm text-neutral-500">All applications have been processed.</p>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      <VerificationDetailsModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         request={selectedRequest}
      />
    </div>
  );
}

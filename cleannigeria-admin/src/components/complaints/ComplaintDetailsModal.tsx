import React, { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { useUpdateComplaintStatus } from '@/hooks/useAdminEntities';

interface Message {
  id: string;
  sender: string;
  role: 'user' | 'admin';
  message: string;
  timestamp: string;
}

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: any | null;
}

export function ComplaintDetailsModal({ isOpen, onClose, complaint }: ComplaintDetailsModalProps) {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateStatusMutation = useUpdateComplaintStatus();

  if (!complaint) return null;

  const handleSendReply = () => {
    if (!reply.trim()) return;
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Reply functionality mocked for now');
      setReply('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleResolve = async () => {
    try {
      await updateStatusMutation.mutateAsync({ id: complaint.realId || complaint.id, status: 'RESOLVED', resolutionNotes: 'Resolved via quick actions' });
      toast.success('Ticket marked as Resolved');
      onClose();
    } catch (err: any) {
      toast.error('Failed to resolve ticket');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-neutral-950 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-neutral-50">
                {complaint.id}
              </Badge>
              <Badge className={
                complaint.priority === 'Critical' ? 'bg-red-500 hover:bg-red-600' :
                complaint.priority === 'High' ? 'bg-orange-500 hover:bg-orange-600' :
                'bg-blue-500 hover:bg-blue-600'
              }>
                {complaint.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={
                complaint.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                complaint.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }>
                {complaint.status}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold">{complaint.subject}</DialogTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {complaint.customerName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Filed {formatDistanceToNow(new Date(complaint.dateFiled), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50 dark:bg-neutral-900/20">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-neutral-500" />
              </div>
              <div className="flex-1">
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="text-sm leading-relaxed">{complaint.description}</p>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 font-medium px-1">
                  Original Issue • {format(new Date(complaint.dateFiled), 'hh:mm a')}
                </p>
              </div>
            </div>

            {complaint.thread.map((msg, idx) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'admin' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'admin' ? 'bg-green-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {msg.role === 'admin' ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                <div className={`flex-1 ${msg.role === 'admin' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl shadow-sm border ${
                    msg.role === 'admin' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50 rounded-tr-none' 
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium px-1">
                    {msg.sender} • {format(new Date(msg.timestamp), 'hh:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          {complaint.status !== 'Resolved' ? (
            <div className="space-y-4">
              <Textarea 
                placeholder="Type your response here..." 
                className="min-h-[100px] resize-none border-neutral-200 focus:ring-green-500"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-neutral-500 h-8">
                    <UserCheck className="h-4 w-4 mr-2" /> Assign to me
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResolve}>Mark Resolved</Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold min-w-[100px]"
                    onClick={handleSendReply}
                    disabled={isSubmitting || !reply.trim()}
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-neutral-500 gap-2 italic text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              This ticket was resolved on {format(new Date(), 'MMM dd, yyyy')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Megaphone, Send, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateBroadcast } from '@/hooks/useAdminEntities';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All');
  const broadcastMutation = useCreateBroadcast();

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await broadcastMutation.mutateAsync({
        title: subject,
        message,
        type: 'System',
        targetAudience: target
      });
      
      toast.success(`Broadcast sent successfully to ${target} users`);
      setSubject('');
      setMessage('');
      setTarget('All');
      onClose();
    } catch (err) {
      toast.error('Failed to send broadcast');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <Megaphone className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-bold">New Broadcast Message</DialogTitle>
          <DialogDescription>
            Send a global notification to platform users. This message will be delivered via in-app alerts and push notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Target Audience</label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="h-11 rounded-xl border-neutral-200 focus:ring-green-500">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Users</SelectItem>
                <SelectItem value="Estates">Estates Only</SelectItem>
                <SelectItem value="Businesses">Businesses Only</SelectItem>
                <SelectItem value="Collectors">Collectors Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Subject Line</label>
            <Input 
              placeholder="e.g. Service Update: Public Holiday Schedule" 
              className="h-11 rounded-xl border-neutral-200 focus:ring-green-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Message Content</label>
            <Textarea 
              placeholder="Type your message here..." 
              className="min-h-[150px] rounded-xl border-neutral-200 focus:ring-green-500 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 flex gap-3">
             <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
             <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed font-medium">
                This message will be sent to approximately <span className="font-bold underline">1,240 users</span>. Once sent, it cannot be recalled.
             </p>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button variant="ghost" className="rounded-xl font-bold h-11 px-6" onClick={onClose} disabled={broadcastMutation.isPending}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-11 px-8 min-w-[140px]"
            onClick={handleSend}
            disabled={broadcastMutation.isPending}
          >
            {broadcastMutation.isPending ? 'Sending...' : (
              <>
                <Send className="h-4 w-4 mr-2" /> Send Broadcast
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

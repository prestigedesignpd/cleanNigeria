import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Search, 
  Filter, 
  Megaphone, 
  Inbox, 
  History,
  Send,
  MoreHorizontal,
  ArrowRight,
  ShieldAlert,
  Users,
  Zap,
  Plus,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow, format } from 'date-fns';
import { BroadcastModal } from '@/components/notifications/BroadcastModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminNotifications, useMarkNotificationRead, useDeleteNotification } from '@/hooks/useAdminEntities';

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const { data: notifications = [], isLoading } = useAdminNotifications();
  const markReadMutation = useMarkNotificationRead();
  const deleteMutation = useDeleteNotification();

  const filteredNotifications = notifications.filter((notif: any) => 
    (notif.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notif.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n: any) => !n.isRead);
      await Promise.all(unreadNotifs.map((n: any) => markReadMutation.mutateAsync(n._id || n.id)));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-4">
            Communication Center
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white font-bold px-3 py-1 text-sm rounded-full">
                {unreadCount} NEW
              </Badge>
            )}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Manage system alerts and broadcast global messages.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800" onClick={markAllAsRead} disabled={unreadCount === 0 || markReadMutation.isPending}>
            <Check className="h-4 w-4 mr-2" /> Mark all read
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold flex-1 md:flex-none h-11" onClick={() => setIsBroadcastModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Broadcast
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="w-full space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl w-full md:w-auto flex overflow-x-auto h-auto no-scrollbar">
          <TabsTrigger value="inbox" className="rounded-xl px-8 py-3 font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm">
            <Inbox className="h-4 w-4 mr-2" /> Inbox
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="rounded-xl px-8 py-3 font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm">
            <History className="h-4 w-4 mr-2" /> Sent Broadcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/30 dark:bg-neutral-900/30">
              <div className="relative w-full sm:w-[450px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Filter notifications by keyword..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
                />
              </div>
              <Button variant="outline" className="h-11 border-neutral-200 dark:border-neutral-800">
                <Filter className="h-4 w-4 mr-2" /> Filter By Type
              </Button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                  <p className="text-sm font-medium text-neutral-500">Syncing notifications...</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif: any) => {
                  const id = notif._id || notif.id;
                  const isRead = notif.isRead || notif.read;
                  const type = notif.type || 'System';
                  return (
                    <div 
                      key={id} 
                      className={cn(
                        "p-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all flex gap-6 group",
                        !isRead ? "bg-green-50/20 dark:bg-green-900/5" : ""
                      )}
                    >
                      <div className="shrink-0">
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                          type === 'Alert' ? "bg-red-50 text-red-600 dark:bg-red-900/30" :
                          type === 'Payment' ? "bg-green-50 text-green-600 dark:bg-green-900/30" :
                          type === 'System' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" :
                          "bg-amber-50 text-amber-600 dark:bg-amber-900/30"
                        )}>
                          <Bell className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                               <h3 className={cn(
                                 "text-lg font-bold tracking-tight",
                                 !isRead ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400"
                               )}>
                                 {notif.title}
                               </h3>
                               {!isRead && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                             </div>
                             <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
                               {notif.message}
                             </p>
                             <div className="flex items-center gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                               <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(notif.createdAt || notif.date || Date.now()), { addSuffix: true })}</span>
                               <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> {type}</span>
                             </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            {!isRead && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl hover:bg-green-50 hover:text-green-600" 
                                onClick={() => markAsRead(id)}
                              >
                                <Check className="h-5 w-5" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600" 
                              onClick={() => deleteNotification(id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-20 text-center space-y-4">
                   <div className="h-20 w-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                      <Inbox className="h-10 w-10" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-lg font-bold text-neutral-900 dark:text-white">Your inbox is clear</p>
                      <p className="text-sm text-neutral-500">Check back later for system alerts or updates.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-4">
           <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-20 text-center">
              <div className="h-20 w-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-300 mb-4">
                 <Megaphone className="h-10 w-10" />
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">No Broadcasts Sent</p>
              <p className="text-sm text-neutral-500 mt-1">You haven't sent any global broadcasts yet.</p>
           </div>
        </TabsContent>
      </Tabs>

      <BroadcastModal 
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
}

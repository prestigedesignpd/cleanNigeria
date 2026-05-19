import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  User, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Plus,
  History,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useComplaintById, useUpdateComplaintStatus, useAddComplaintMessage } from '@/hooks/useAdminEntities';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const { data: rawComplaint, isLoading, error } = useComplaintById(id!);
  const updateStatusMutation = useUpdateComplaintStatus();
  const addMessageMutation = useAddComplaintMessage();

  const [reply, setReply] = useState('');
  const [internalNote, setInternalNote] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !rawComplaint) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-16 w-16 text-neutral-200" />
        <h2 className="text-2xl font-bold text-neutral-400">Ticket Not Found</h2>
        <Button asChild>
          <Link to="/complaints">Return to Support Queue</Link>
        </Button>
      </div>
    );
  }

  // Map Backend Data cleanly
  const c = rawComplaint.complaint || rawComplaint;
  const customerName = c.userId 
    ? `${c.userId.firstName || ''} ${c.userId.lastName || ''}`.trim() 
    : 'CleanNigeria Client';
  
  const mapPriority = (p: string) => {
    if (p === 'CRITICAL') return 'Critical';
    if (p === 'HIGH') return 'High';
    if (p === 'MEDIUM') return 'Medium';
    if (p === 'LOW') return 'Low';
    return 'Medium';
  };

  const mapStatus = (s: string) => {
    if (s === 'OPEN') return 'Open';
    if (s === 'IN_PROGRESS') return 'In Progress';
    if (s === 'RESOLVED') return 'Resolved';
    if (s === 'CLOSED') return 'Closed';
    return 'Open';
  };

  const dateFiled = c.createdAt || new Date().toISOString();
  const deadline = new Date(new Date(dateFiled).getTime() + 24 * 60 * 60 * 1000).toISOString();

  const slaStatus = c.status === 'RESOLVED' || c.status === 'CLOSED'
    ? 'healthy'
    : (new Date().getTime() - new Date(dateFiled).getTime() > 24 * 60 * 60 * 1000 ? 'breached' : 'healthy');

  const complaint = {
    id: c.ticketId || `TICKET-${c._id?.toString().substring(18)}`,
    realId: c._id,
    customerName,
    userId: c.userId?._id || 'Unknown',
    dateFiled,
    category: c.category || 'OTHER',
    subject: c.subject || 'No Subject Provided',
    priority: mapPriority(c.priority),
    status: mapStatus(c.status),
    slaStatus,
    slaDeadline: deadline,
    description: c.description || '',
    photos: (c.photos || []) as { url: string; publicId: string }[],
    thread: rawComplaint.messages?.map((msg: any) => ({
      id: msg._id,
      sender: msg.senderId ? `${msg.senderId.firstName || ''} ${msg.senderId.lastName || ''}`.trim() : 'Customer',
      role: msg.senderModel === 'AdminUser' ? 'admin' : 'customer',
      message: msg.message,
      timestamp: msg.createdAt
    })) || [],
    internalNotes: c.internalNotes || []
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      await addMessageMutation.mutateAsync({ id: complaint.realId, message: reply });
      toast.success('Reply sent successfully');
      setReply('');
    } catch (err: any) {
      toast.error('Failed to send reply');
    }
  };

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    toast.success('Internal note functionality not fully implemented on backend yet. Note mocked.');
    setInternalNote('');
  };

  const handleResolve = async () => {
    try {
      await updateStatusMutation.mutateAsync({ id: complaint.realId, status: 'RESOLVED', resolutionNotes: 'Resolved by Admin' });
      toast.success('Ticket marked as resolved');
    } catch (err: any) {
      toast.error('Failed to resolve ticket');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Link to="/complaints"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">{complaint.id}</h1>
               <Badge className={cn(
                 "font-bold text-[10px] uppercase px-3 py-1",
                 complaint.priority === 'Critical' ? 'bg-red-600' : 
                 complaint.priority === 'High' ? 'bg-orange-600' : 'bg-blue-600'
               )}>
                 {complaint.priority} PRIORITY
               </Badge>
               <Badge className={cn(
                 "font-bold text-[10px] uppercase px-3 py-1 ml-2",
                 complaint.status === 'Resolved' ? 'bg-green-600' : 'bg-neutral-600'
               )}>
                 {complaint.status}
               </Badge>
            </div>
            <div className="flex items-center gap-4 text-neutral-500 font-medium mt-1">
               <span className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">{complaint.customerName}</span>
               <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
               <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> {complaint.category}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800">
            <UserCheck className="h-4 w-4 mr-2" /> Take Ownership
          </Button>
          {complaint.status !== 'Resolved' && (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white font-bold flex-1 md:flex-none h-11"
              onClick={handleResolve}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Mark Resolved
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-8">
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <History className="h-5 w-5 text-neutral-400" />
                     <h3 className="font-bold">Interaction Timeline</h3>
                  </div>
                  <Badge variant="outline" className="bg-white dark:bg-neutral-950 font-bold border-neutral-200 dark:border-neutral-800 uppercase tracking-widest">
                     SLA: {complaint.slaStatus}
                  </Badge>
               </div>
               <div className="p-8 space-y-8 max-h-[600px] overflow-y-auto">
                  {/* Original Complaint */}
                  <div className="flex gap-4">
                     <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-neutral-500" />
                     </div>
                     <div className="space-y-2 max-w-[80%]">
                        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-800">
                           <p className="text-sm font-bold mb-2">Original Ticket Submission</p>
                           <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{complaint.description}</p>
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
                           {format(new Date(complaint.dateFiled), 'hh:mm a • MMM dd, yyyy')}
                        </p>
                     </div>
                  </div>

                  {/* Thread */}
                  {complaint.thread.map((msg: any, idx: number) => (
                    <div key={msg.id || idx} className={cn("flex gap-4", msg.role === 'admin' && "flex-row-reverse")}>
                       <div className={cn(
                         "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                         msg.role === 'admin' ? "bg-green-600 text-white" : "bg-neutral-100 text-neutral-500"
                       )}>
                          {msg.role === 'admin' ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                       </div>
                       <div className={cn("space-y-2 max-w-[80%]", msg.role === 'admin' && "items-end")}>
                          <div className={cn(
                            "p-4 rounded-2xl border shadow-sm",
                            msg.role === 'admin' 
                              ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/50 rounded-tr-none" 
                              : "bg-white dark:bg-neutral-950 border-neutral-100 dark:border-neutral-800 rounded-tl-none"
                          )}>
                             <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                          <p className={cn("text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2", msg.role === 'admin' && "text-right")}>
                             {msg.sender} • {format(new Date(msg.timestamp || Date.now()), 'hh:mm a')}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <Tabs defaultValue="reply" className="w-full">
                     <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mb-4">
                        <TabsTrigger value="reply" className="rounded-lg font-bold">Reply to Customer</TabsTrigger>
                        <TabsTrigger value="internal" className="rounded-lg font-bold">Internal Notes</TabsTrigger>
                     </TabsList>
                     <TabsContent value="reply" className="space-y-4">
                        <Textarea 
                          placeholder="Type your response here..." 
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="min-h-[120px] rounded-2xl border-neutral-200 focus-visible:ring-green-500 font-medium"
                        />
                        <div className="flex justify-end gap-3">
                           <Button variant="ghost" className="font-bold">Discard</Button>
                           <Button onClick={handleSendReply} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 h-11">
                              <Send className="h-4 w-4 mr-2" /> Send Response
                           </Button>
                        </div>
                     </TabsContent>
                     <TabsContent value="internal" className="space-y-4">
                        <Textarea 
                          placeholder="Team-only notes (invisible to customer)..." 
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          className="min-h-[120px] rounded-2xl border-amber-200 bg-amber-50/20 focus-visible:ring-amber-500 font-medium"
                        />
                        <div className="flex justify-end gap-3">
                           <Button onClick={handleAddNote} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 h-11">
                              <Plus className="h-4 w-4 mr-2" /> Save Note
                           </Button>
                        </div>
                     </TabsContent>
                  </Tabs>
               </div>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
               <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">SLA Health</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col items-center gap-4 text-center py-4">
                     <div className={cn(
                       "h-20 w-20 rounded-full border-4 flex items-center justify-center",
                       complaint.slaStatus === 'breached' ? "border-red-100 text-red-600" : "border-green-100 text-green-600"
                     )}>
                        <Clock className="h-10 w-10" />
                     </div>
                     <div>
                        <p className="text-xl font-black uppercase tracking-tighter">{complaint.slaStatus}</p>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Resolution Deadline:</p>
                        <p className="text-sm font-bold mt-0.5">{format(new Date(complaint.slaDeadline), 'MMM dd, HH:mm')}</p>
                     </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Response Time</span>
                        <span className="font-bold text-green-600">--</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500 font-medium">Total Duration</span>
                        <span className="font-bold">--</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
               <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Customer Profile</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-neutral-500">
                        {complaint.customerName[0]}
                     </div>
                     <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{complaint.customerName}</p>
                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest truncate max-w-[150px]">{complaint.userId}</p>
                     </div>
                  </div>
                  <div className="space-y-3 pt-2">
                     <Button variant="outline" className="w-full justify-between h-10 border-neutral-200 font-bold text-xs" asChild>
                        <Link to={`/users/${complaint.userId}`}>
                           View Profile
                           <ChevronRight className="h-4 w-4" />
                        </Link>
                     </Button>
                     <Button variant="outline" className="w-full justify-between h-10 border-neutral-200 font-bold text-xs">
                        Service History
                        <ChevronRight className="h-4 w-4" />
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/30 rounded-2xl overflow-hidden">
               <CardHeader className="py-4 px-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-600">Internal Notes</CardTitle>
               </CardHeader>
               <CardContent className="px-6 pb-6 space-y-4">
                  {complaint.internalNotes?.map((note: any, idx: number) => (
                     <div key={idx} className="p-3 bg-white border border-amber-100 rounded-xl space-y-2 shadow-sm shadow-amber-200/20">
                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">{note.note}</p>
                        <div className="flex justify-between items-center text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                           <span>{note.author}</span>
                           <span>{format(new Date(note.timestamp), 'MMM dd')}</span>
                        </div>
                     </div>
                  ))}
                  {!complaint.internalNotes?.length && (
                    <p className="text-xs text-neutral-400 text-center py-4 italic">No internal notes yet.</p>
                  )}
               </CardContent>
            </Card>

            {/* Photo Attachments */}
            {complaint.photos && complaint.photos.length > 0 && (
              <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Attachments ({complaint.photos.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {complaint.photos.map((photo: any, idx: number) => (
                      <a
                        key={idx}
                        href={photo.url || photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-xl overflow-hidden border border-neutral-100 hover:border-green-300 transition-colors shadow-sm group"
                      >
                        <img
                          src={photo.url || photo}
                          alt={`Attachment ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
         </div>
      </div>
    </div>
  );
}

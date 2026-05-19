import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  ChevronLeft, 
  Send, 
  Clock, 
  MessageCircle, 
  FileText, 
  AlertCircle, 
  User, 
  ShieldCheck,
  MoreVertical,
  Paperclip,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { mockComplaints } from '@/mock'
import { formatDate, formatDateTime, capitalize } from '@/lib/formatters'
import { StatusBadge } from '@/components/common/StatusBadge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintService } from '@/services/complaint.service'
import { Loader2 } from 'lucide-react'

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const { data: rawComplaint, isLoading, error } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getComplaintById(id!),
    enabled: !!id
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (msgText: string) => {
      return complaintService.replyToComplaint(id!, msgText)
    },
    onSuccess: () => {
      toast.success('Message sent!', {
        description: 'The support team will review your response.',
      })
      queryClient.invalidateQueries({ queryKey: ['complaint', id] })
      setMessage('')
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.')
    }
  })

  const closeComplaintMutation = useMutation({
    mutationFn: async () => {
      return complaintService.closeComplaint(id!)
    },
    onSuccess: () => {
      toast.success('Complaint resolved!', {
        description: 'Thank you for your feedback.',
      })
      queryClient.invalidateQueries({ queryKey: ['complaint', id] })
    },
    onError: () => {
      toast.error('Failed to resolve complaint.')
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
        <h1 className="text-xl font-bold">Loading Complaint details...</h1>
      </div>
    )
  }

  if (error || !rawComplaint) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold">Complaint Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the complaint details you're looking for.</p>
        <Button asChild className="mt-4 bg-brand-600 hover:bg-brand-700 text-white">
          <Link to={ROUTES.SUPPORT}>Back to Support</Link>
        </Button>
      </div>
    )
  }

  const c = rawComplaint.complaint || rawComplaint
  const complaint = {
    id: c._id || c.id,
    subject: c.subject || 'No Subject',
    status: (c.status?.toLowerCase() || 'open') as any,
    category: c.category || 'other',
    createdAt: c.createdAt || new Date().toISOString(),
    description: c.description || '',
    photos: c.photos || [],
    messages: rawComplaint.messages?.map((msg: any) => ({
      id: msg._id,
      complaintId: msg.complaintId,
      senderId: msg.senderId?._id,
      senderName: msg.senderId ? `${msg.senderId.firstName || ''} ${msg.senderId.lastName || ''}`.trim() : 'System',
      senderRole: msg.senderModel === 'AdminUser' ? 'support' : 'user',
      message: msg.message,
      createdAt: msg.createdAt
    })) || []
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    sendMessageMutation.mutate(message)
  }

  const handleCloseComplaint = () => {
    closeComplaintMutation.mutate()
  }

  return (
    <>
      <Helmet><title>Complaint {complaint.id} | CleanNigeria</title></Helmet>
      
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to={ROUTES.SUPPORT} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
              <ChevronLeft className="h-3 w-3" />
              Back to Support & Complaints
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{complaint.subject}</h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-muted-foreground text-sm">Complaint ID: <span className="font-mono">{complaint.id}</span> · {capitalize(complaint.category)}</p>
          </div>
          <div className="flex items-center gap-2">
            {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
              <Button variant="outline" size="sm" onClick={handleCloseComplaint} className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-100 bg-emerald-50/30">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
            )}
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-3 space-y-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
            <Card className="border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-brand-600" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Conversation History</CardTitle>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Live Updates Enabled</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                <AnimatePresence initial={false}>
                  {complaint.messages.map((msg, i) => {
                    const isSupport = msg.senderRole === 'support'
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          isSupport ? "mr-auto" : "ml-auto flex-row-reverse"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                          isSupport ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                        )}>
                          {isSupport ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className="space-y-1">
                          <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed",
                            isSupport 
                              ? "bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200" 
                              : "bg-brand-600 text-white rounded-tr-none"
                          )}>
                            {msg.message}
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 px-1",
                            !isSupport && "justify-end"
                          )}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400">{formatDateTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {(complaint.status === 'resolved' || complaint.status === 'closed') && (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">This complaint has been closed</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">You can no longer send messages to this conversation. If you still have issues, please open a new complaint.</p>
                  </div>
                )}
              </CardContent>

              {/* Message Input */}
              {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="relative group">
                    <Textarea 
                      placeholder="Type your message here..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px] resize-none pr-12 focus-visible:ring-brand-600 border-slate-200 bg-slate-50/50 group-hover:bg-white transition-all"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        disabled={!message.trim()}
                        onClick={handleSendMessage}
                        className="h-8 w-8 bg-brand-600 hover:bg-brand-700 text-white shadow-brand-sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 px-1">Press Shift + Enter for a new line</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Information</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Created On</p>
                      <p className="text-sm font-semibold text-slate-900">{formatDate(complaint.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</p>
                      <p className="text-sm font-semibold text-slate-900">High</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</p>
                      <p className="text-sm font-semibold text-slate-900">{capitalize(complaint.category)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Original Description</p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{complaint.description}"
                  </p>
                </div>

                {complaint.photos && complaint.photos.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Attachments</p>
                    <div className="grid grid-cols-2 gap-2">
                      {complaint.photos.map((p: any, i: number) => (
                        <img 
                          key={i} 
                          src={p.url || p} 
                          alt="attachment" 
                          className="aspect-square rounded-lg object-cover bg-slate-100 border border-slate-200 w-full h-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-emerald-600 text-white border-none shadow-emerald-sm">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg leading-snug">Was your issue resolved?</h3>
                <p className="text-xs text-white/80 leading-relaxed">Letting us know helps us improve our service and reward our support team.</p>
                <Button variant="secondary" className="w-full h-9 text-xs text-emerald-600 font-bold bg-white hover:bg-emerald-50 border-none shadow-sm">
                  Mark Resolved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}


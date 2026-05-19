import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  ShieldAlert, 
  Plus,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow, format } from 'date-fns';
import { ComplaintDetailsModal } from '@/components/complaints/ComplaintDetailsModal';
import { ComplaintStatsGrid } from '@/components/complaints/ComplaintStatsGrid';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminComplaints } from '@/hooks/useAdminEntities';

export default function ComplaintsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'dateFiled', 
    direction: 'desc' 
  });

  const { data, isLoading } = useAdminComplaints({ page: 1, limit: 1000 });
  const rawComplaints = data?.data || [];

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    toast.success('Complaints log exported successfully');
  };

  const mappedComplaints = rawComplaints.map((c: any) => {
    const customerName = c.userId 
      ? `${c.userId.firstName || ''} ${c.userId.lastName || ''}`.trim() 
      : 'CleanNigeria Client';
    
    const mapStatus = (s: string) => {
      if (s === 'OPEN') return 'Open';
      if (s === 'IN_PROGRESS') return 'In Progress';
      if (s === 'RESOLVED') return 'Resolved';
      if (s === 'CLOSED') return 'Closed';
      return 'Open';
    };

    const mapPriority = (p: string) => {
      if (p === 'CRITICAL') return 'Critical';
      if (p === 'HIGH') return 'High';
      if (p === 'MEDIUM') return 'Medium';
      if (p === 'LOW') return 'Low';
      return 'Medium';
    };

    const dateFiled = c.createdAt || new Date().toISOString();
    const deadline = new Date(new Date(dateFiled).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const slaStatus = c.status === 'RESOLVED' || c.status === 'CLOSED'
      ? 'healthy'
      : (new Date().getTime() - new Date(dateFiled).getTime() > 24 * 60 * 60 * 1000 ? 'breached' : 'healthy');

    const assignedToName = c.assignedTo
      ? `${c.assignedTo.firstName || ''} ${c.assignedTo.lastName || ''}`.trim()
      : null;

    return {
      id: c.ticketId || `TICKET-${c._id.toString().substring(18)}`,
      realId: c._id,
      customerName,
      dateFiled,
      category: c.category || 'OTHER',
      subject: c.subject || 'No Subject Provided',
      priority: mapPriority(c.priority),
      status: mapStatus(c.status),
      slaStatus,
      slaDeadline: deadline,
      assignedTo: assignedToName,
      description: c.description || '',
    };
  });

  const filteredComplaints = mappedComplaints
    .filter((ticket: any) => {
      const matchesSearch = 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a: any, b: any) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return (valA ?? '') > (valB ?? '') ? 1 : -1;
      } else {
        return (valA ?? '') < (valB ?? '') ? 1 : -1;
      }
    });

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Support Tickets</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Global operational oversight of service requests and complaints.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export Log
          </Button>
          <Button className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-11">
            <Plus className="h-4 w-4 mr-2" /> New Ticket
          </Button>
        </div>
      </div>

      <ComplaintStatsGrid complaints={rawComplaints} />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl shadow-neutral-200/20 dark:shadow-none">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/30 dark:bg-neutral-900/30">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by Ticket ID, Customer, or Subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
             <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
                  <Button 
                    key={status}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "h-9 px-4 text-xs font-bold transition-all rounded-lg",
                      statusFilter === status 
                        ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    {status}
                  </Button>
                ))}
             </div>
             <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                {['All', 'Critical', 'High', 'Medium'].map((priority) => (
                  <Button 
                    key={priority}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPriorityFilter(priority)}
                    className={cn(
                      "h-9 px-4 text-xs font-bold transition-all rounded-lg",
                      priorityFilter === priority 
                        ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    {priority}
                  </Button>
                ))}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-neutral-500 text-sm font-medium">Loading complaints...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-50/50">
                  <TableHead className="font-bold py-5 cursor-pointer group" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-2">
                      Ticket Identity
                      <TrendingUp className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'id' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">Category & Subject</TableHead>
                  <TableHead className="font-bold cursor-pointer group" onClick={() => handleSort('priority')}>
                     <div className="flex items-center gap-2">
                      Urgency
                      <TrendingUp className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'priority' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">SLA Health</TableHead>
                  <TableHead className="font-bold">Assigned To</TableHead>
                  <TableHead className="text-right font-bold pr-8">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((ticket: any) => (
                    <TableRow key={ticket.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/30 transition-colors group">
                      <TableCell className="py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-xs text-neutral-400 uppercase tracking-widest">{ticket.id}</span>
                          <Link to={`/complaints/${ticket.id}`} className="font-bold text-neutral-900 dark:text-white hover:text-green-600 transition-colors mt-1">
                            {ticket.customerName}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-medium">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(ticket.dateFiled), { addSuffix: true })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1 max-w-[250px]">
                            <Badge variant="secondary" className="w-fit text-[10px] font-black uppercase tracking-tighter bg-neutral-100 dark:bg-neutral-800">
                               {ticket.category}
                            </Badge>
                            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 truncate">{ticket.subject}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-bold text-[10px] uppercase px-3 py-1 rounded-full",
                          ticket.priority === 'Critical' ? 'bg-red-600' :
                          ticket.priority === 'High' ? 'bg-orange-600' :
                          ticket.priority === 'Medium' ? 'bg-blue-600' :
                          'bg-neutral-600'
                        )}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "h-2 w-2 rounded-full",
                                 ticket.slaStatus === 'breached' ? "bg-red-500 animate-pulse" :
                                 ticket.slaStatus === 'warning' ? "bg-amber-500" :
                                 "bg-green-500"
                               )} />
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest",
                                 ticket.slaStatus === 'breached' ? "text-red-600" :
                                 ticket.slaStatus === 'warning' ? "text-amber-600" :
                                 "text-green-600"
                               )}>
                                  {ticket.slaStatus}
                               </span>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-bold">
                               DL: {format(new Date(ticket.slaDeadline), 'HH:mm • MMM dd')}
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                         {ticket.assignedTo ? (
                           <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-500 text-xs">
                                 {ticket.assignedTo[0]}
                              </div>
                              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{ticket.assignedTo}</span>
                           </div>
                         ) : (
                           <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-green-600 hover:text-green-600">
                              Unassigned
                           </Button>
                         )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsModalOpen(true);
                            }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                              <DropdownMenuLabel>Ticket Operations</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="cursor-pointer">
                                 <Link to={`/complaints/${ticket.id}`}>
                                    <ExternalLink className="h-4 w-4 mr-2" /> Open Management Page
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-blue-600">
                                <MessageSquare className="h-4 w-4 mr-2" /> Take Ownership
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <ShieldAlert className="h-4 w-4 mr-2" /> Escalate to HQ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <MessageSquare className="h-12 w-12 text-neutral-200" />
                         <div className="text-lg font-bold text-neutral-400">No tickets match your filters</div>
                         <Button variant="outline" onClick={() => {setSearchTerm(''); setStatusFilter('All'); setPriorityFilter('All');}}>Reset View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-sm font-medium text-neutral-500 bg-neutral-50/30">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
             Queue active • Auto-refresh in 30s
          </div>
          <div>Queue Size: {filteredComplaints.length} Tickets</div>
        </div>
      </div>

      <ComplaintDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        complaint={selectedTicket}
      />
    </div>
  );
}

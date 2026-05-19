import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreHorizontal, 
  Truck, 
  User, 
  MapPin, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  ChevronRight,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminSchedules } from '@/hooks/useAdminSchedules';
import { format } from 'date-fns';
import { ScheduleStatsGrid } from '@/components/schedules/ScheduleStatsGrid';
import { ScheduleCalendarView } from '@/components/schedules/ScheduleCalendarView';
import { ScheduleDetailsModal } from '@/components/schedules/ScheduleDetailsModal';
import { RescheduleModal } from '@/components/schedules/RescheduleModal';
import { AssignCollectorModal } from '@/components/schedules/AssignCollectorModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SchedulesOverviewPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'date', 
    direction: 'asc' 
  });

  const { data: schedules = [], isLoading } = useAdminSchedules();

  const filteredSchedules = schedules
    .filter((sch: any) => {
      const matchesSearch = 
        sch.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.zone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || sch.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Preparing daily manifest...',
        success: 'Operational schedule exported',
        error: 'Export failed',
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Collection Manifest</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Real-time oversight of all waste collection routes and assignments.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg h-10">
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setView('list')}
               className={cn(
                 "h-8 px-4 text-xs font-bold transition-all",
                 view === 'list' ? "bg-white dark:bg-neutral-900 shadow-sm" : "text-neutral-500"
               )}
             >
                List
             </Button>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setView('calendar')}
               className={cn(
                 "h-8 px-4 text-xs font-bold transition-all",
                 view === 'calendar' ? "bg-white dark:bg-neutral-900 shadow-sm" : "text-neutral-500"
               )}
             >
                Calendar
             </Button>
          </div>
          <Button variant="outline" className="flex-1 md:flex-none h-10 border-neutral-200 dark:border-neutral-800" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <ScheduleStatsGrid schedules={schedules} />

      {view === 'list' ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input 
                placeholder="Search entity, zone, or manifest ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
              />
            </div>
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                 {['All', 'Scheduled', 'In Progress', 'Completed', 'Delayed', 'Unassigned'].map((status) => (
                   <Button 
                     key={status}
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setStatusFilter(status)}
                     className={cn(
                       "h-8 px-3 text-xs font-bold transition-all whitespace-nowrap",
                       statusFilter === status 
                         ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                         : "text-neutral-500 hover:text-neutral-700"
                     )}
                   >
                     {status}
                   </Button>
                 ))}
              </div>
              <Button variant="outline" className="h-10 border-neutral-200 dark:border-neutral-800">
                <CalendarDays className="h-4 w-4 mr-2" /> Select Date
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <TableHead className="font-semibold py-4">Target Entity</TableHead>
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('zone')}>
                    <div className="flex items-center gap-1">
                      Zone & Route
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'zone' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Operations Team</TableHead>
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Scheduled Time
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'date' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                        <p className="text-sm text-neutral-500 font-medium">Synchronizing live manifests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSchedules.length > 0 ? (
                  filteredSchedules.map((sch) => (
                    <TableRow 
                    key={sch.id} 
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedSchedule(sch);
                      setIsDetailsOpen(true);
                    }}
                  >
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{sch.entityName}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <Badge variant="outline" className="text-[10px] h-4 px-1 font-bold uppercase tracking-tighter">
                                {sch.entityType}
                             </Badge>
                             <span className="text-[10px] font-medium text-neutral-400">ID: {sch.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                             <MapPin className="h-3 w-3 text-neutral-400" />
                             <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{sch.zone}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-medium truncate max-w-[180px] mt-0.5">{sch.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sch.collector ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border border-neutral-200">
                              <AvatarImage src={sch.collector.avatar} />
                              <AvatarFallback className="bg-neutral-100 text-neutral-600 text-[10px] font-bold">{sch.collector.name?.[0] || 'C'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                               <span className="text-xs font-bold">{sch.collector.name}</span>
                               <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-neutral-400" />
                                  <span className="text-[10px] font-medium text-neutral-500">{sch.vehicleId || 'Assigning...'}</span>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-fit cursor-pointer hover:bg-amber-100 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchedule(sch);
                              setIsAssignOpen(true);
                            }}
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase">Awaiting Assign</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                             <Clock className="h-3.5 w-3.5 text-neutral-400" />
                             <span className="text-xs font-bold">{format(new Date(sch.date), 'hh:mm a')}</span>
                          </div>
                          <span className="text-[10px] font-medium text-neutral-500 mt-0.5">{format(new Date(sch.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            sch.priority === 'Urgent' ? 'text-red-600' : 
                            sch.priority === 'High' ? 'text-orange-600' : 
                            'text-neutral-400'
                         )}>
                            {sch.priority}
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px] uppercase px-2 py-0.5 border-2",
                          sch.status === 'Completed' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
                            : sch.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
                            : sch.status === 'In Progress'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800'
                            : sch.status === 'Delayed'
                            ? 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                        )}>
                          {sch.status === 'Completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {sch.status === 'Delayed' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {sch.status}
                        </Badge>
                        {sch.delayReason && (
                           <div className="text-[9px] font-medium text-red-500 mt-1 italic">{sch.delayReason}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-950">
                            <DropdownMenuLabel>Manifest Controls</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchedule(sch);
                              setIsDetailsOpen(true);
                            }}>
                              <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Route details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchedule(sch);
                              setIsRescheduleOpen(true);
                            }}>
                              <CalendarDays className="h-3.5 w-3.5 mr-2" /> Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchedule(sch);
                              setIsAssignOpen(true);
                            }}>
                              <User className="h-3.5 w-3.5 mr-2" /> Reassign collector
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer font-semibold">
                              <AlertCircle className="h-3.5 w-3.5 mr-2" /> Cancel Manifest
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <CalendarIcon className="h-12 w-12 text-neutral-200" />
                         <div>
                            <p className="text-lg font-bold text-neutral-900 dark:text-white">No manifests found</p>
                            <p className="text-sm text-neutral-500">Try adjusting your operational filters</p>
                         </div>
                         <Button variant="outline" onClick={() => setSearchTerm('')}>Clear manifest filters</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 bg-neutral-50/30">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
               Live manifest sync active
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 border-neutral-200 dark:border-neutral-800 shadow-none px-4 font-bold" disabled>Manifest Page 1</Button>
              <Button variant="outline" size="sm" className="h-9 border-neutral-200 dark:border-neutral-800 shadow-none px-4 font-bold" disabled>Next</Button>
            </div>
          </div>
        </div>
      ) : (
        <ScheduleCalendarView schedules={schedules} onSelectSchedule={(sch) => {
          setSelectedSchedule(sch);
          setIsDetailsOpen(true);
        }} />
      )}

      <ScheduleDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        schedule={selectedSchedule}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        schedule={selectedSchedule}
      />

      <AssignCollectorModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        schedule={selectedSchedule}
      />
    </div>
  );
}

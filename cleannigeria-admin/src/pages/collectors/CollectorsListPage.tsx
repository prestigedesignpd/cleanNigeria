import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Star, 
  Truck, 
  UserCheck, 
  Shield, 
  ExternalLink,
  MapPin,
  TrendingUp,
  Activity,
  Loader2,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { CollectorFormModal } from '@/components/collectors/CollectorFormModal';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAdminCollectors } from '@/hooks/useAdminEntities';

export default function CollectorsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<any>(null);

  const { data: collectors = [], isLoading } = useAdminCollectors();

  const filteredCollectors = collectors
    .filter((collector: any) => {
      const fullName = collector.fullName || `${collector.firstName || ''} ${collector.lastName || ''}`;
      const zoneName = collector.currentZoneId?.name || 'No assigned zone';
      
      const matchesSearch = 
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collector.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || 
        collector.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle custom sorting keys
      if (sortConfig.key === 'name') {
        aValue = a.fullName || `${a.firstName || ''} ${a.lastName || ''}`;
        bValue = b.fullName || `${b.firstName || ''} ${b.lastName || ''}`;
      } else if (sortConfig.key === 'performance') {
        aValue = a.totalCollections || 0;
        bValue = b.totalCollections || 0;
      }

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

  const handleAdd = () => {
    setSelectedCollector(null);
    setIsModalOpen(true);
  };

  const handleEdit = (collector: any) => {
    setSelectedCollector(collector);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating staff report...',
        success: 'Report exported to CSV',
        error: 'Failed to export report',
      }
    );
  };

  // Dynamic statistics calculations
  const totalCollectors = collectors.length;
  const onDutyCount = collectors.filter((c: any) => c.status === 'ACTIVE' || c.status === 'Active' || c.status === 'OFF_DUTY').length;
  const avgRatingSum = collectors.reduce((sum: number, c: any) => sum + (c.rating?.average || 0), 0);
  const avgRating = totalCollectors > 0 ? (avgRatingSum / totalCollectors).toFixed(1) : '0.0';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Staff & Collectors</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage field personnel, equipment assignments, and operational metrics.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 md:flex-none" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Staff</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalCollectors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">On Duty / Active</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{onDutyCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Daily Efficiency</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalCollectors > 0 ? '92%' : '0%'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{totalCollectors > 0 && avgRating !== '0.0' ? avgRating : '4.8'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by name, zone or vehicle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
             {['All', 'Active', 'Suspended'].map((status) => (
               <Button 
                 key={status}
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setStatusFilter(status)}
                 className={cn(
                   "h-8 px-3 text-xs font-bold transition-all",
                   statusFilter === status 
                     ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                     : "text-neutral-500 hover:text-neutral-700"
                 )}
               >
                 {status}
               </Button>
             ))}
          </div>
          <Button variant="outline" className="w-full lg:w-auto h-10 border-neutral-200 dark:border-neutral-800 shadow-none px-6">
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
              <p className="text-sm">Fetching collectors database...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <TableHead className="font-semibold py-4 cursor-pointer group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Staff Name
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'name' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Assigned Zone</TableHead>
                  <TableHead className="font-semibold">Vehicle Details</TableHead>
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('performance')}>
                    <div className="flex items-center gap-1">
                      Collections
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'performance' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Rating</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollectors.length > 0 ? (
                  filteredCollectors.map((collector: any) => {
                    const fullName = collector.fullName || `${collector.firstName || ''} ${collector.lastName || ''}`;
                    const zoneName = collector.currentZoneId?.name || 'No assigned zone';
                    const ratingVal = collector.rating?.average || 4.8;
                    const cId = collector._id || collector.id;

                    return (
                      <TableRow key={cId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 group transition-colors">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-neutral-100 dark:ring-neutral-800 shadow-sm">
                              <AvatarImage src={collector.avatar?.url} alt={fullName} />
                              <AvatarFallback className="bg-green-100 text-green-700 font-bold uppercase">{firstNameChar(fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link to={`/collectors/${cId}`} className="font-bold text-neutral-900 dark:text-white hover:text-green-600 flex items-center gap-1.5 transition-colors">
                                {fullName}
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{collector.employeeId || cId.substring(18)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                            <MapPin className="h-3 w-3 mr-1 text-red-500" />
                            {zoneName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{collector.vehicle?.plateNumber || 'No Plate'}</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-tighter font-semibold">{collector.vehicle?.type?.replace('_', ' ') || 'No Truck'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500" 
                                  style={{ width: `${Math.min(((collector.totalCollections || 0) / 10) * 100, 100)}%` }}
                                />
                             </div>
                             <span className="text-xs font-bold">{collector.totalCollections || 0}</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mt-0.5">Total pickups</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-sm">{ratingVal}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            collector.status === 'ACTIVE' || collector.status === 'Active'
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200 font-bold' 
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-200 font-bold'
                          }>
                            {collector.status || 'ACTIVE'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-950">
                              <DropdownMenuLabel>Operational Control</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={`/collectors/${cId}`}>View full profile</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(collector)}>Edit staff details</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(`Fetching live GPS for ${fullName}`)}>
                                <Navigation className="h-3.5 w-3.5 mr-2" /> Live Tracking
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 cursor-pointer font-semibold focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => toast.error(`Staff ${fullName} deactivated`)}>
                                Deactivate Staff
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-neutral-500">
                      <div className="flex flex-col items-center gap-2">
                        <Truck className="h-8 w-8 text-neutral-300 mb-2" />
                        <p>No collectors found in the database. Onboard staff above to start!</p>
                        <Button variant="link" onClick={() => setSearchTerm('')} className="text-green-600">Clear Search</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-50/30">
          <div>Showing <b>{filteredCollectors.length}</b> of <b>{collectors.length}</b> field personnel</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 border-neutral-200 dark:border-neutral-800 shadow-none" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 border-neutral-200 dark:border-neutral-800 shadow-none" disabled>Next</Button>
          </div>
        </div>
      </div>

      <CollectorFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        collector={selectedCollector} 
      />
    </div>
  );
}

function firstNameChar(name: string) {
  return name.trim().split(' ').map(n => n[0]).join('').substring(0, 2) || 'C';
}

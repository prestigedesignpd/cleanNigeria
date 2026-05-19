import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  MoreHorizontal, 
  MapPin, 
  TrendingUp, 
  ExternalLink,
  Users,
  Building2,
  Activity,
  ArrowRight
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
import { useAdminZones } from '@/hooks/useAdminEntities';
import { Loader2 } from 'lucide-react';
import { ZoneStatsGrid } from '@/components/zones/ZoneStatsGrid';
import { ZoneFormModal } from '@/components/zones/ZoneFormModal';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ZonesListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    toast.success('Zones data exported successfully');
  };

  const { data: zones = [], isLoading } = useAdminZones();

  const filteredZones = zones
    .filter((zone: any) => {
      const lgaDisplay = zone.lgas?.[0] || zone.lga || '';
      const matchesSearch = 
        zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zone._id || zone.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        lgaDisplay.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || zone.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Geographic Zones</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Strategic command of waste collection regions and resource deployment.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button 
            className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-11"
            onClick={() => {
              setSelectedZone(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Zone
          </Button>
        </div>
      </div>

      <ZoneStatsGrid zones={zones} />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl shadow-neutral-200/20 dark:shadow-none">
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/30 dark:bg-neutral-900/30">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search zones, LGAs, or Region IDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
             <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                {['All', 'Active', 'Maintenance', 'Inactive'].map((status) => (
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-50/50">
                <TableHead className="font-bold py-5 cursor-pointer group" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    Zone Identity
                    <TrendingUp className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'name' && "opacity-100")} />
                  </div>
                </TableHead>
                <TableHead className="font-bold cursor-pointer group" onClick={() => handleSort('lga')}>
                   <div className="flex items-center gap-2">
                    Region/LGA
                    <TrendingUp className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'lga' && "opacity-100")} />
                  </div>
                </TableHead>
                <TableHead className="font-bold">Operational Stats</TableHead>
                <TableHead className="font-bold">Performance</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold pr-8">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                      <p className="text-sm text-neutral-500 font-medium">Synchronizing geographic data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredZones.length > 0 ? (
                filteredZones.map((zone: any) => {
                  const zoneId = zone._id || zone.id;
                  const lgaDisplay = zone.lgas?.[0] || zone.lga || 'Unknown';
                  const collectorsCount = zone.assignedCollectors?.length || 0;
                  const estatesCount = zone.assignedEstates?.length || 0;
                  const coveragePercent = zone.metrics?.coveragePercent || (collectorsCount > 0 ? 90 : 0);

                  return (
                    <TableRow key={zoneId} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/30 transition-colors group">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center border-2",
                            zone.status === 'Active' || zone.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' :
                            zone.status === 'Maintenance' || zone.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          )}>
                            <MapPin className="h-6 w-6" />
                          </div>
                          <div>
                            <Link to={`/zones/${zoneId}`} className="font-bold text-neutral-900 dark:text-white hover:text-green-600 transition-colors flex items-center gap-1.5">
                              {zone.name}
                              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-0.5">ID: {zoneId.substring(zoneId.length - 8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{lgaDisplay}</span>
                            <span className="text-xs text-neutral-500 font-medium">{zone.state || 'Lagos State'}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Resources</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs font-bold">{collectorsCount}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col border-l border-neutral-100 dark:border-neutral-800 pl-4">
                              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Coverage</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3 text-amber-500" />
                                    <span className="text-xs font-bold">{estatesCount}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-4 w-28">
                               <span className="text-[10px] font-bold text-neutral-500">Coverage</span>
                               <span className="text-[10px] font-black text-green-600">{coveragePercent}%</span>
                            </div>
                            <div className="h-1.5 w-28 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-green-500 rounded-full" 
                                 style={{ width: `${coveragePercent}%` }}
                               />
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-bold text-[10px] uppercase px-3 py-1 rounded-full",
                          zone.status === 'Active' || zone.status === 'ACTIVE'
                            ? 'bg-green-600 hover:bg-green-700' 
                            : zone.status === 'Maintenance' || zone.status === 'MAINTENANCE'
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-red-600 hover:bg-red-700'
                        )}>
                          {zone.status || 'ACTIVE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl">
                            <DropdownMenuLabel>Zone Operations</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                               <Link to={`/zones/${zoneId}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" /> View Full Analytics
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-green-600">
                              <Activity className="h-4 w-4 mr-2" /> Optimization Report
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                              setSelectedZone(zone);
                              setIsModalOpen(true);
                            }}>
                              <Plus className="h-4 w-4 mr-2" /> Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600">
                              <Activity className="h-4 w-4 mr-2" /> Emergency Alert
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <MapPin className="h-12 w-12 text-neutral-200" />
                       <div className="text-lg font-bold text-neutral-400">No zones match your filters</div>
                       <Button variant="outline" onClick={() => {setSearchTerm(''); setStatusFilter('All');}}>Reset View</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-sm font-medium text-neutral-500 bg-neutral-50/30">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
             Live operational feed active
          </div>
          <div>Total: {filteredZones.length} Zones</div>
        </div>
      </div>
      <ZoneFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        zone={selectedZone}
      />
    </div>
  );
}

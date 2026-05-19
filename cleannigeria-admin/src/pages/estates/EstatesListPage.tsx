import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreHorizontal, Download, Building2, MapPin, Users, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { EstateFormModal } from '@/components/estates/EstateFormModal';
import { cn } from '@/lib/utils';
import { useAdminEstates } from '@/hooks/useAdminEntities';

export default function EstatesListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<any>(null);

  const { data: rawEstates = [], isLoading } = useAdminEstates();

  const mappedEstates = rawEstates.map((estate: any) => {
    const managerName = estate.managerName || 'System Managed';
    const type = estate.collectionType === 'ESTATE_FULL' ? 'Centralized' : 'Individual Units';
    const lga = estate.address?.lga || 'Eti-Osa';
    const state = estate.address?.state || 'Lagos';
    const units = estate.totalUnits || 0;
    
    const statusMap = (s: string) => {
      if (s === 'ACTIVE') return 'Active';
      if (s === 'PENDING') return 'Pending';
      return 'Suspended';
    };
    
    const plan = estate.collectionType === 'ESTATE_FULL' ? 'Premium Plan' : 'Standard Plan';
    const status = statusMap(estate.status);

    return {
      id: estate._id,
      name: estate.name || 'Unnamed Estate',
      manager: { name: managerName },
      type,
      location: { lga, state },
      stats: { units },
      subscription: { status, plan }
    };
  });

  const filteredEstates = mappedEstates
    .filter((estate: any) => {
      const matchesSearch = 
        estate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estate.manager.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || estate.subscription.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'households') {
        aValue = a.stats.units;
        bValue = b.stats.units;
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
    setSelectedEstate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (estate: any) => {
    setSelectedEstate(estate);
    setIsModalOpen(true);
  };

  // Dynamic statistics
  const totalEstatesCount = mappedEstates.length;
  const totalHouseholdsCount = mappedEstates.reduce((acc: number, curr: any) => acc + curr.stats.units, 0);
  const activeLgasCount = new Set(mappedEstates.map((e: any) => e.location.lga)).size;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Estates</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage all registered residential estates.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Estate
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Estates</p>
            <p className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mt-1" /> : totalEstatesCount}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Households</p>
            <p className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mt-1" /> : totalHouseholdsCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Active LGAs</p>
            <p className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mt-1" /> : activeLgasCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search estates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex gap-2">
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
            <Button variant="outline" className="w-full sm:w-auto h-10 border-neutral-200 dark:border-neutral-800">
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-neutral-500 text-sm font-medium">Loading estates...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Estate Name
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'name' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('households')}>
                    <div className="flex items-center gap-1">
                      Units
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'households' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Subscription</TableHead>
                  <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstates.length > 0 ? (
                  filteredEstates.map((estate: any) => (
                    <TableRow key={estate.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                      <TableCell className="font-medium py-3">
                        <Link to={`/estates/${estate.id}`} className="hover:text-green-600 transition-colors">
                          <div className="text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                            {estate.name}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                        <div className="text-xs text-neutral-500 font-normal mt-0.5">{estate.manager.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{estate.type}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{estate.location.lga}</div>
                        <div className="text-xs text-neutral-500 font-normal">{estate.location.state} State</div>
                      </TableCell>
                      <TableCell className="font-black text-neutral-950 dark:text-white pl-6">{estate.stats.units}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px] uppercase px-2 py-0.5 border-2",
                          estate.subscription.status === 'Active' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
                            : estate.subscription.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                        )}>
                          {estate.subscription.status}
                        </Badge>
                        <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mt-1">{estate.subscription.plan}</div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-950">
                            <DropdownMenuLabel>Estate Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link to={`/estates/${estate.id}`} className="w-full">View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(estate)}>Edit Estate</DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link to={`/estates/${estate.id}?tab=households`} className="w-full">View Units</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 font-semibold cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20">Suspend Estate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                      No estates found matching "{searchTerm}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500">
          <div>Showing 1 to {filteredEstates.length} of {totalEstatesCount} results</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-800 shadow-none font-bold" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-800 shadow-none font-bold" disabled>Next</Button>
          </div>
        </div>
      </div>

      <EstateFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        estate={selectedEstate} 
      />
    </div>
  );
}

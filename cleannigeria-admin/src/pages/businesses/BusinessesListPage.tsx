import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreHorizontal, Download, Store, Briefcase, MapPin, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { BusinessFormModal } from '@/components/businesses/BusinessFormModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAdminBusinesses } from '@/hooks/useAdminEntities';

export default function BusinessesListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  const { data: rawBusinesses = [], isLoading } = useAdminBusinesses();

  const mappedBusinesses = rawBusinesses.map((biz: any) => {
    const lga = biz.address?.lga || 'Eti-Osa';
    const state = biz.address?.state || 'Lagos';
    const contactName = biz.contactPerson?.name || 'Authorized Person';
    const contactPhone = biz.contactPerson?.phone || 'N/A';
    const email = biz.contactPerson?.email || 'business@clean.ng';
    
    const statusMap = (s: string) => {
      if (s === 'ACTIVE') return 'Active';
      if (s === 'PENDING') return 'Pending';
      return 'Suspended';
    };
    
    const status = statusMap(biz.status);
    const plan = biz.wasteVolumeTier === 'LARGE' ? 'Enterprise Plan' : biz.wasteVolumeTier === 'MEDIUM' ? 'Premium Plan' : 'Standard Plan';

    return {
      id: biz._id,
      name: biz.name || 'Unnamed Business',
      type: biz.businessType || 'Commercial',
      location: { lga, state },
      contact: { name: contactName, phone: contactPhone },
      subscription: { status, plan },
      businessEmail: email
    };
  });

  const filteredBusinesses = mappedBusinesses
    .filter((biz: any) => {
      const matchesSearch = 
        biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        biz.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || biz.subscription.status === statusFilter;
      
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

  const handleAdd = () => {
    setSelectedBusiness(null);
    setIsModalOpen(true);
  };

  const handleEdit = (business: any) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating business report...',
        success: 'Report exported to CSV',
        error: 'Failed to export report',
      }
    );
  };

  // Dynamic statistics
  const totalBusinessesCount = mappedBusinesses.length;
  const corporateCount = mappedBusinesses.filter((b: any) => b.type === 'OFFICE' || b.type === 'COMPLEX').length;
  const activeLgasCount = new Set(mappedBusinesses.map((b: any) => b.location.lga)).size;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Businesses</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage commercial and corporate accounts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Business
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Businesses</p>
            <p className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mt-1" /> : totalBusinessesCount}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Corporate Accounts</p>
            <p className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400 mt-1" /> : corporateCount}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Coverage LGAs</p>
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
              placeholder="Search businesses..." 
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
              <p className="text-neutral-500 text-sm font-medium">Loading businesses...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Business Name
                      <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'name' && "opacity-100")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Contact Person</TableHead>
                  <TableHead className="font-semibold">Subscription</TableHead>
                  <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((biz: any) => (
                    <TableRow key={biz.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                      <TableCell className="font-medium py-3">
                        <Link to={`/businesses/${biz.id}`} className="hover:text-green-600 transition-colors block">
                          <div className="text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                            {biz.name}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-neutral-500 font-normal mt-0.5">ID: {biz.id} • {biz.businessEmail}</div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                          {biz.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{biz.location.lga}</div>
                        <div className="text-xs text-neutral-500 font-normal">{biz.location.state}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">{biz.contact.name}</div>
                        <div className="text-xs text-neutral-500 font-normal">{biz.contact.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px] uppercase px-2 py-0.5 border-2",
                          biz.subscription.status === 'Active' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
                            : biz.subscription.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                        )}>
                          {biz.subscription.status}
                        </Badge>
                        <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mt-1">{biz.subscription.plan}</div>
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
                            <DropdownMenuLabel>Business Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link to={`/businesses/${biz.id}`} className="w-full">View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(biz)}>Edit Business</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 font-semibold cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20"
                              onClick={() => toast.error(`Suspension request sent for ${biz.name}`)}
                            >
                              Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                      No businesses registered in the database.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500">
          <div>Showing 1 to {filteredBusinesses.length} of {totalBusinessesCount} results</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-800 font-bold" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-800 font-bold" disabled>Next</Button>
          </div>
        </div>
      </div>

      <BusinessFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        business={selectedBusiness} 
      />
    </div>
  );
}

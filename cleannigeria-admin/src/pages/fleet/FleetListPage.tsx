import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Wrench, 
  Fuel, 
  Activity, 
  AlertTriangle,
  History,
  TrendingUp,
  Download,
  CreditCard,
  Gauge,
  CalendarDays,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockFleet, fleetStats } from '@/mock/fleet.mock';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { VehicleFormModal } from '@/components/fleet/VehicleFormModal';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

import { useAdminCollectors } from '@/hooks/useAdminEntities';
import { Loader2 } from 'lucide-react';

export default function FleetListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'model', 
    direction: 'asc' 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const { data: collectors = [], isLoading } = useAdminCollectors();

  const fleetData = (collectors || []).map((c: any, index: number) => {
    const vehicleType = c.vehicle?.type || 'Compactor';
    const vehicleModel = c.vehicle?.model || `${vehicleType} Waste Truck`;
    const plateNumber = c.vehicle?.plateNumber || 'N/A';
    const assignedCollector = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unassigned';
    const status = c.status === 'ACTIVE' ? 'Active' : 'Maintenance';
    const mileage = (c.totalCollections || 0) * 8 + 12000 + (index * 1500);
    const lifeToDateCost = (c.totalCollections || 0) * 600 + 45000;
    
    return {
      id: c.employeeId || `TRK-${c._id?.substring(18) || index}`,
      realId: c._id,
      plateNumber,
      model: vehicleModel,
      type: vehicleType,
      capacity: '10 Tons',
      status,
      assignedCollector,
      mileage,
      lastService: '2026-02-15',
      nextService: '2026-05-15',
      fuelEfficiency: '2.8 km/L',
      totalCosts: lifeToDateCost,
      gpsStatus: c.isLocationSharing ? 'Online' : 'Offline'
    };
  });

  const fleetListToUse = fleetData.length > 0 ? fleetData : mockFleet.map((v, i) => ({ ...v, realId: `mock-${i}` }));

  const filteredFleet = fleetListToUse
    .filter(v => {
      const matchesSearch = 
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      
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
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Fleet Management</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage vehicles, maintenance costs, and operational efficiency.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none"><Download className="h-4 w-4 mr-2" /> Export Fleet Data</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 md:flex-none" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Fleet</p>
                <p className="text-2xl font-bold">{fleetStats.totalVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Active Trucks</p>
                <p className="text-2xl font-bold">{fleetStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Monthly Maint. Cost</p>
                <p className="text-2xl font-bold text-amber-600">₦{(fleetStats.totalMonthlyCosts / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Avg. Efficiency</p>
                <p className="text-2xl font-bold">{fleetStats.avgFuelEfficiency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by plate number or model..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
             {['All', 'Active', 'Maintenance', 'Retired'].map((status) => (
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
          <Button variant="outline" className="h-10 border-neutral-200 dark:border-neutral-800">
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </Button>
            <Button variant="outline" className="flex-1 sm:flex-none h-10 border-neutral-200 dark:border-neutral-800 text-amber-600 hover:text-amber-700">
              <AlertTriangle className="h-4 w-4 mr-2" /> Service Due
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <TableHead className="font-semibold py-4 cursor-pointer group" onClick={() => handleSort('model')}>
                  <div className="flex items-center gap-1">
                    Vehicle Details
                    <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'model' && "opacity-100")} />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Type & Capacity</TableHead>
                <TableHead className="font-semibold">Assigned Collector</TableHead>
                <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('mileage')}>
                  <div className="flex items-center gap-1">
                    Mileage
                    <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'mileage' && "opacity-100")} />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Next Service</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      <p className="text-sm font-medium">Loading fleet data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredFleet.length > 0 ? (
                filteredFleet.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 group transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
                          <Truck className="h-6 w-6" />
                        </div>
                        <div>
                          <Link to={`/fleet/${vehicle.id}`} className="font-bold text-neutral-900 dark:text-white hover:text-green-600 flex items-center gap-1.5 transition-colors group/link">
                            {vehicle.model}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </Link>
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{vehicle.plateNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{vehicle.assignedCollector}</span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{vehicle.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5 w-24">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400">
                          <span>Health</span>
                          <span>{vehicle.status === 'Maintenance' ? '65%' : '92%'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", vehicle.status === 'Maintenance' ? 'bg-amber-500' : 'bg-green-500')}
                            style={{ width: vehicle.status === 'Maintenance' ? '65%' : '92%' }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">₦{vehicle.totalCosts.toLocaleString()}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">Life-to-date cost</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="text-sm font-medium">{vehicle.nextService}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-bold",
                        vehicle.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-950">
                          <DropdownMenuLabel>Vehicle Control</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/fleet/${vehicle.id}?tab=overview`}>
                              <TrendingUp className="h-3.5 w-3.5 mr-2" /> View Performance
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/fleet/${vehicle.id}?tab=logs`}>
                              <Wrench className="h-3.5 w-3.5 mr-2" /> Maintenance Log
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(vehicle)}>
                            <Settings className="h-3.5 w-3.5 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer font-semibold focus:bg-red-50" onClick={() => toast.info(`Vehicle ${vehicle.id} status updated`)}>
                             Retire Vehicle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <Truck className="h-8 w-8 text-neutral-300 mb-2" />
                      <p>No vehicles found matching your search</p>
                      <Button variant="link" onClick={() => setSearchTerm('')} className="text-green-600">Reset fleet list</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-50/30">
          <div>Showing <b>{filteredFleet.length}</b> of <b>{mockFleet.length}</b> trucks</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 border-neutral-200 dark:border-neutral-800 shadow-none" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 border-neutral-200 dark:border-neutral-800 shadow-none" disabled>Next</Button>
          </div>
        </div>
      </div>

      <VehicleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedVehicle} 
      />
    </div>
  );
}

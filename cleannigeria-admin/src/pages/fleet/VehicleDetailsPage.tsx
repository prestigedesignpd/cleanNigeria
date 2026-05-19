import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  Wrench, 
  Fuel, 
  Activity, 
  CalendarDays, 
  CreditCard, 
  History, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Settings,
  MoreHorizontal,
  Navigation,
  Clock,
  User,
  ShieldAlert,
  FileText,
  Gauge,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockFleet } from '@/mock/fleet.mock';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { VehicleFormModal } from '@/components/fleet/VehicleFormModal';
import { MaintenanceLogModal } from '@/components/fleet/MaintenanceLogModal';
import { DocumentModal } from '@/components/fleet/DocumentModal';
import { cn } from '@/lib/utils';

import { useCollectorById } from '@/hooks/useAdminEntities';
import { Loader2 } from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  
  const { data: collector, isLoading } = useCollectorById(id || '');

  const mockVehicle = mockFleet.find(v => v.id === id) || mockFleet[0];

  const vehicle = collector ? {
    id: collector.employeeId || `TRK-${collector._id?.substring(18)}`,
    plateNumber: collector.vehicle?.plateNumber || 'N/A',
    model: collector.vehicle?.model || `${collector.vehicle?.type || 'Standard'} Waste Truck`,
    type: collector.vehicle?.type || 'Compactor',
    capacity: '10 Tons',
    status: collector.status === 'ACTIVE' ? 'Active' : 'Maintenance',
    assignedCollector: `${collector.firstName || ''} ${collector.lastName || ''}`.trim() || 'Unassigned',
    mileage: (collector.totalCollections || 0) * 8 + 12000,
    fuelEfficiency: '2.8 km/L',
    nextService: '2026-05-15',
    lastMaintenance: '2026-02-15',
    totalCosts: (collector.totalCollections || 0) * 600 + 45000,
    maintenanceLogs: mockVehicle.maintenanceLogs
  } : mockVehicle;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
        <h1 className="text-xl font-bold">Loading vehicle details...</h1>
      </div>
    );
  }

  const handleAddLog = () => {
    setSelectedLog(null);
    setIsLogModalOpen(true);
  };

  const handleEditLog = (log: any) => {
    setSelectedLog(log);
    setIsLogModalOpen(true);
  };

  const handleAddDoc = () => {
    setSelectedDoc(null);
    setIsDocModalOpen(true);
  };

  const handleEditDoc = (doc: any) => {
    setSelectedDoc(doc);
    setIsDocModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/fleet">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-500 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{vehicle.model}</h1>
              <Badge variant="outline" className={cn(
                "font-bold",
                vehicle.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              )}>
                {vehicle.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{vehicle.plateNumber}</span>
              <Separator orientation="vertical" className="h-3 bg-neutral-300" />
              <p className="text-sm text-neutral-500 font-medium">{vehicle.type} • {vehicle.capacity}</p>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Vehicle tracking initiated")}>
            <Navigation className="h-4 w-4 mr-2" /> Track Live
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 font-semibold" onClick={() => setIsEditModalOpen(true)}>Edit Details</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operational Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Assigned To</span>
                  </div>
                  <span className="text-sm font-bold">{vehicle.assignedCollector}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Gauge className="h-4 w-4" />
                    <span className="text-sm font-medium">Mileage</span>
                  </div>
                  <span className="text-sm font-bold">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Fuel className="h-4 w-4" />
                    <span className="text-sm font-medium">Efficiency</span>
                  </div>
                  <span className="text-sm font-bold">{vehicle.fuelEfficiency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm font-medium">Next Service</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{vehicle.nextService}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-neutral-400">
                  <span>Engine Health</span>
                  <span>92%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[92%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-neutral-400">
                  <span>Hydraulics</span>
                  <span>88%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[88%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Standard maintenance check due in 15 days. Inspect hydraulic seals for potential leaks.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
              <TabsTrigger value="overview">Maintenance Overview</TabsTrigger>
              <TabsTrigger value="logs">Service Logs</TabsTrigger>
              <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
              <TabsTrigger value="documents">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Total Spent</p>
                        <p className="text-xl font-bold">₦{vehicle.totalCosts.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Last Service</p>
                        <p className="text-xl font-bold">{format(new Date(vehicle.lastMaintenance), 'MMM dd')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Uptime Rate</p>
                        <p className="text-xl font-bold">94.2%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Performance</CardTitle>
                  <CardDescription>Efficiency and cost tracking for the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-neutral-100 bg-neutral-50/30">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-10 w-10 text-neutral-300 mx-auto" />
                    <p className="text-sm text-neutral-500 font-medium">Performance analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="outline-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Maintenance Logs</CardTitle>
                    <CardDescription>Detailed history of repairs and routine checks.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddLog}><Plus className="h-4 w-4 mr-2" /> Add Entry</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead className="text-right">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicle.maintenanceLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs font-bold">{log.id}</TableCell>
                          <TableCell className="font-medium">{format(new Date(log.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell className="font-bold text-neutral-900">{log.type}</TableCell>
                          <TableCell>{log.provider}</TableCell>
                          <TableCell className="font-bold">₦{log.cost.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-blue-600 h-8 w-8 p-0" onClick={() => handleEditLog(log)}>
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-green-600 h-8 w-8 p-0">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="outline-none">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Categorized spending for this vehicle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-6">
                      {[
                        { label: 'Fuel & Consumables', amount: 150000, percentage: 33 },
                        { label: 'Engine Maintenance', amount: 120000, percentage: 27 },
                        { label: 'Tires & Suspension', amount: 95000, percentage: 21 },
                        { label: 'Other Repairs', amount: 85000, percentage: 19 }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold">{item.label}</span>
                            <span className="text-sm font-bold text-neutral-900">₦{item.amount.toLocaleString()} ({item.percentage}%)</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="outline-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Fleet Documents</CardTitle>
                    <CardDescription>Registration, insurance, and permits.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddDoc}><Plus className="h-4 w-4 mr-2" /> Add Document</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Vehicle Registration', status: 'Valid', expiry: '2027-01-15' },
                      { name: 'Insurance Policy', status: 'Valid', expiry: '2026-11-20' },
                      { name: 'Emissions Permit', status: 'Expired', expiry: '2026-04-30' }
                    ].map((doc, i) => (
                      <div key={i} className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-400">
                              <FileText className="h-5 w-5" />
                           </div>
                           <div>
                            <p className="font-bold text-sm">{doc.name}</p>
                            <p className="text-xs text-neutral-500 font-medium">Expires: {doc.expiry}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn(
                            "font-bold",
                            doc.status === 'Valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          )}>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEditDoc(doc)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <VehicleFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} vehicle={vehicle} />
      <MaintenanceLogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        log={selectedLog} 
      />
      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
}

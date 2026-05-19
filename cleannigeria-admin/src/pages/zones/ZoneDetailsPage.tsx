import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Truck, 
  Building2, 
  TrendingUp, 
  Activity, 
  Settings, 
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  TrendingDown,
  ExternalLink,
  Target,
  Zap,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useZoneById } from '@/hooks/useAdminEntities';

export default function ZoneDetailsPage() {
  const { id } = useParams();
  const { data: zone, isLoading, error } = useZoneById(id!);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading zone details...</p>
      </div>
    );
  }

  if (error || !zone) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-16 w-16 text-neutral-200" />
        <h2 className="text-2xl font-bold text-neutral-400">Zone Not Found</h2>
        <Button asChild>
          <Link to="/zones">Return to Zones</Link>
        </Button>
      </div>
    );
  }

  const zoneId = zone._id || zone.id;
  const lgaDisplay = zone.lgas?.[0] || zone.lga || 'Unknown';
  const collectionDays = zone.collectionDays || [];
  const assignedCollectors = zone.assignedCollectors || [];
  
  const coveragePercent = zone.metrics?.coveragePercent || 0;
  const collectionRate = zone.metrics?.collectionRate || 0;
  const revenueGrowth = zone.metrics?.revenueGrowth || 0;
  
  const estatesCount = zone.assignedEstates?.length || 0;
  const businessesCount = zone.assignedBusinesses?.length || 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Link to="/zones"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">{zone.name}</h1>
               <Badge className={cn(
                 "font-bold px-3 py-1",
                 zone.status === 'Active' || zone.status === 'ACTIVE' ? "bg-green-600" : 
                 zone.status === 'Maintenance' || zone.status === 'MAINTENANCE' ? "bg-amber-600" : "bg-red-600"
               )}>
                 {zone.status || 'ACTIVE'}
               </Badge>
            </div>
            <div className="flex items-center gap-4 text-neutral-500 font-medium mt-1">
               <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {lgaDisplay}, {zone.state || 'Lagos State'}</span>
               <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
               <span className="text-[10px] font-black uppercase tracking-widest">Zone ID: {zoneId.substring(zoneId.length - 8)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800">
            <Activity className="h-4 w-4 mr-2" /> Live Analytics
          </Button>
          <Button className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-11">
            <Plus className="h-4 w-4 mr-2" /> Assign Resource
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <MetricCard 
           label="Collection Rate" 
           value={`${collectionRate}%`} 
           trend="+0.0%" 
           icon={Zap} 
           color="text-green-600"
           bg="bg-green-50"
         />
         <MetricCard 
           label="Coverage Density" 
           value={`${coveragePercent}%`} 
           trend="+0.0%" 
           icon={Target} 
           color="text-blue-600"
           bg="bg-blue-50"
         />
         <MetricCard 
           label="Revenue Growth" 
           value={`${revenueGrowth}%`} 
           trend={`${revenueGrowth}%`}
           isNegative={revenueGrowth < 0}
           icon={TrendingUp} 
           color="text-purple-600"
           bg="bg-purple-50"
         />
         <MetricCard 
           label="Assigned Staff" 
           value={assignedCollectors.length} 
           trend="Active" 
           icon={Users} 
           color="text-amber-600"
           bg="bg-amber-50"
         />
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-neutral-100/50 dark:bg-neutral-800/50 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <TabsTrigger value="overview" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-xl">Overview</TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-xl">Operational Team</TabsTrigger>
          <TabsTrigger value="coverage" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-xl">Zone Coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                 <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                    <CardTitle className="text-xl">Operational Window</CardTitle>
                    <CardDescription>Scheduled collection cycles for the current period.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8">
                    <div className="grid grid-cols-7 gap-4">
                       {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                          <div 
                            key={day} 
                            className={cn(
                              "flex flex-col items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                              collectionDays.includes(day) 
                                ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800 shadow-lg shadow-green-500/10" 
                                : "bg-neutral-50/50 border-neutral-100 dark:bg-neutral-900/30 dark:border-neutral-800 opacity-50"
                            )}
                          >
                             <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">{day.substring(0, 3)}</span>
                             <div className={cn(
                               "h-10 w-10 rounded-full flex items-center justify-center",
                               collectionDays.includes(day) ? "bg-green-600 text-white" : "bg-neutral-200 text-neutral-400"
                             )}>
                                {collectionDays.includes(day) ? <Truck className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                             </div>
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-tighter",
                               collectionDays.includes(day) ? "text-green-700" : "text-neutral-400"
                             )}>
                                {collectionDays.includes(day) ? 'Active' : 'Off'}
                             </span>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                 <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                    <CardTitle className="text-xl">Regional Leads</CardTitle>
                    <CardDescription>Field operations commanders.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    {/* Assuming empty leads initially when no assigned leaders exist */}
                    {(!zone.leads || zone.leads.length === 0) ? (
                      <div className="text-center text-neutral-500 text-sm py-4">No regional leads assigned.</div>
                    ) : (
                      zone.leads.map((lead: any, i: number) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-xl bg-neutral-200 overflow-hidden flex items-center justify-center font-bold text-neutral-500">
                                  {lead.name?.[0] || 'L'}
                               </div>
                               <div>
                                  <p className="text-sm font-bold">{lead.name}</p>
                                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Zone Commander</p>
                               </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                               <ExternalLink className="h-4 w-4" />
                            </Button>
                         </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full h-11 border-dashed border-neutral-300 dark:border-neutral-700 font-bold rounded-xl text-neutral-500">
                       <Plus className="h-4 w-4 mr-2" /> Add Zone Lead
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/30">
                 <div>
                    <h3 className="text-lg font-bold">Assigned Field Staff</h3>
                    <p className="text-xs text-neutral-500 font-medium">{assignedCollectors.length} Personnel active in this zone</p>
                 </div>
                 <Button className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold h-10">Deploy Personnel</Button>
              </div>
              <div className="overflow-x-auto">
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead className="font-bold pl-8">Name & ID</TableHead>
                          <TableHead className="font-bold">Role</TableHead>
                          <TableHead className="font-bold">Shift Status</TableHead>
                          <TableHead className="font-bold">Collection Avg</TableHead>
                          <TableHead className="text-right pr-8">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {assignedCollectors.length === 0 ? (
                         <TableRow>
                           <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                             No field staff currently assigned to this zone.
                           </TableCell>
                         </TableRow>
                       ) : (
                         assignedCollectors.map((col: any) => (
                            <TableRow key={col.id || col._id}>
                               <TableCell className="pl-8 py-3">
                                  <div className="flex items-center gap-3">
                                     <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-500">{col.firstName?.[0] || col.name?.[0] || 'S'}</div>
                                     <div>
                                        <p className="text-sm font-bold">{col.fullName || col.name}</p>
                                        <p className="text-[10px] text-neutral-400 font-black">ID: {(col.id || col._id).substring(col.id?.length - 6 || 0)}</p>
                                     </div>
                                  </div>
                               </TableCell>
                               <TableCell>
                                  <Badge variant="secondary" className="text-[10px] font-bold uppercase">Collector</Badge>
                               </TableCell>
                               <TableCell>
                                  <div className="flex items-center gap-2">
                                     <div className="h-2 w-2 bg-green-500 rounded-full" />
                                     <span className="text-xs font-bold">On Duty</span>
                                  </div>
                               </TableCell>
                               <TableCell>
                                  <span className="text-sm font-bold">{col.rating?.average || col.rating || 5.0}/5.0</span>
                               </TableCell>
                               <TableCell className="text-right pr-8">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                     <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                               </TableCell>
                            </TableRow>
                         ))
                       )}
                    </TableBody>
                 </Table>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="coverage" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col items-center justify-center h-64 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
              <Building2 className="h-12 w-12 text-neutral-300" />
              <p className="text-neutral-500 font-bold mt-4">Interactive Zone Map in development</p>
              <p className="text-xs text-neutral-400 mt-1">{estatesCount} Estates and {businessesCount} Businesses tracked.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color, bg, isNegative }: any) {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bg, color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
            isNegative ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          )}>
            {isNegative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-neutral-900 dark:text-white mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

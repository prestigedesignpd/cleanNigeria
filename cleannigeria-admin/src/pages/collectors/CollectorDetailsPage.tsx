import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star,
  Activity,
  History,
  MoreHorizontal,
  Ban,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Navigation,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { CollectorFormModal } from '@/components/collectors/CollectorFormModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollectorById, useUpdateCollector } from '@/hooks/useAdminEntities';

export default function CollectorDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  
  const { data: collector, isLoading, error } = useCollectorById(id!);
  const updateMutation = useUpdateCollector();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  const handleDeactivate = async () => {
    try {
      await updateMutation.mutateAsync({ 
        id: id!, 
        data: { status: 'SUSPENDED' } 
      });
      toast.error(`Collector status updated to suspended`);
      setIsDeactivateDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Deactivation failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
        <p className="text-sm">Loading staff profile...</p>
      </div>
    );
  }

  if (error || !collector) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-500 space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-semibold">Collector not found or API error</p>
        <Link to="/collectors">
          <Button variant="outline">Back to Staff List</Button>
        </Link>
      </div>
    );
  }

  const fullName = collector.fullName || `${collector.firstName || ''} ${collector.lastName || ''}`;
  const zoneName = collector.currentZoneId?.name || 'No assigned zone';
  const ratingVal = collector.rating?.average || 4.8;
  const ratingCount = collector.rating?.count || 12;
  const statusStr = collector.status || 'ACTIVE';

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/collectors">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage src={collector.avatar?.url} />
            <AvatarFallback className="bg-green-100 text-green-700 font-bold text-lg uppercase">{fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-normal">{zoneName}</Badge>
              <Separator orientation="vertical" className="h-3 bg-neutral-300" />
              <p className="text-sm text-neutral-500 font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {ratingVal} Rating ({ratingCount} reviews)
              </p>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className={
            statusStr === 'ACTIVE' || statusStr === 'Active' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }>
            {statusStr}
          </Badge>
          <Button className="bg-green-600 hover:bg-green-700 font-semibold text-white" onClick={() => setIsEditModalOpen(true)}>Edit Details</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Staff Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-400">Email</p>
                  <p className="text-sm font-medium">{collector.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-400">Phone</p>
                  <p className="text-sm font-medium">{collector.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-400">Joined Date</p>
                  <p className="text-sm font-medium">{collector.employmentDate ? format(new Date(collector.employmentDate), 'MMM dd, yyyy') : format(new Date(collector.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-neutral-400">Vehicle Assigned</h4>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <p className="font-bold text-sm">{collector.vehicle?.plateNumber || 'No Plate Assigned'}</p>
                </div>
                <p className="text-xs text-neutral-500">{collector.vehicle?.type?.replace('_', ' ') || 'None'} • {collector.vehicle?.capacity || '5 Tons'}</p>
                <div className="mt-2 text-[10px] flex items-center gap-1 text-neutral-400">
                  <Clock className="h-3 w-3" /> Last Maintenance: 3 days ago
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setIsDeactivateDialogOpen(true)} disabled={statusStr === 'SUSPENDED'}>
              <Ban className="h-4 w-4 mr-2" /> Deactivate Staff
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Efficiency</p>
                    <p className="text-xl font-bold">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Attendance</p>
                    <p className="text-xl font-bold">98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Complaints</p>
                    <p className="text-xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
              <TabsTrigger value="overview">Today's Route</TabsTrigger>
              <TabsTrigger value="history">Collection History</TabsTrigger>
              <TabsTrigger value="performance">Monthly Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="outline-none">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Route: {zoneName}</CardTitle>
                      <CardDescription>Live GPS coordinates mapping.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Navigation className="h-4 w-4" /> Track GPS
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] bg-neutral-100 dark:bg-neutral-800 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(3.3619,6.5059)/3.3619,6.5059,13/800x600?access_token=pk.eyJ1IjoiY2xlYW5uaWdlcmlhIiwiYSI6ImNsMWYyYmZjdzAybmIzYm8wYnB2bWp0d3MifQ==')] bg-cover bg-center opacity-60" />
                    <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors" />
                    
                    {/* Simulated Path */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="h-12 w-12 bg-green-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white relative">
                        <Truck className="h-6 w-6" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                      </div>
                      <div className="mt-2 bg-white dark:bg-neutral-900 px-3 py-1 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 text-xs font-bold">
                        Live: {collector.vehicle?.plateNumber || 'GPS OFFLINE'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="outline-none">
               <Card>
                <CardHeader>
                  <CardTitle>Recent Collection Logs</CardTitle>
                  <CardDescription>Verified collections handled by this staff.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No verified collections recorded for this collector yet.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="outline-none">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance Analysis</CardTitle>
                  <CardDescription>Efficiency and reliability metrics for current month.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-neutral-100 bg-neutral-50/30">
                  <div className="text-center space-y-2">
                    <Activity className="h-10 w-10 text-neutral-300 mx-auto" />
                    <p className="text-sm text-neutral-500 font-medium">Performance charts coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CollectorFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} collector={collector} />

      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Collector Staff</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate <strong>{fullName}</strong>? This will suspend their operational access and vehicle assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} className="bg-red-600 hover:bg-red-700 text-white font-semibold">Deactivate Staff</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

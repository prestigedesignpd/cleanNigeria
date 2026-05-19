import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Activity,
  Search,
  MoreHorizontal,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Building,
  User,
  ExternalLink,
  Ban,
  Trash2,
  Globe,
  Navigation,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { BusinessFormModal } from '@/components/businesses/BusinessFormModal';
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
import { useBusinessById } from '@/hooks/useAdminEntities';

export default function BusinessDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  const { data: rawBusiness, isLoading } = useBusinessById(id);
  
  // State for Modals
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  
  // State for Alert Dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-neutral-500 text-sm font-medium">Loading business profile...</p>
      </div>
    );
  }

  // Mappings
  const typeLabel = rawBusiness?.businessType || 'Commercial';
  const sizeLabel = rawBusiness?.wasteVolumeTier === 'LARGE' ? 'Enterprise' : rawBusiness?.wasteVolumeTier === 'MEDIUM' ? 'Medium-Scale' : 'Small-Scale';
  const email = rawBusiness?.contactPerson?.email || 'business@clean.ng';
  const monthlyRevenue = rawBusiness?.wasteVolumeTier === 'LARGE' ? 45000 : rawBusiness?.wasteVolumeTier === 'MEDIUM' ? 25000 : 15000;
  
  const statusMap = (s: string) => {
    if (s === 'ACTIVE') return 'Active';
    if (s === 'PENDING') return 'Pending';
    return 'Suspended';
  };
  
  const status = statusMap(rawBusiness?.status);
  const plan = rawBusiness?.wasteVolumeTier === 'LARGE' ? 'Enterprise Plan' : rawBusiness?.wasteVolumeTier === 'MEDIUM' ? 'Premium Plan' : 'Standard Plan';
  
  const business = {
    id: rawBusiness?._id,
    name: rawBusiness?.name || 'Unnamed Business',
    type: typeLabel,
    size: sizeLabel,
    businessEmail: email,
    monthlyRevenue,
    location: {
      address: rawBusiness?.address?.street || 'Commercial Gate Rd',
      lga: rawBusiness?.address?.lga || 'Eti-Osa',
      state: rawBusiness?.address?.state || 'Lagos',
      coordinates: rawBusiness?.address?.coordinates || { lat: 6.4589, lng: 3.6015 }
    },
    contact: {
      name: rawBusiness?.contactPerson?.name || 'Representative Person',
      phone: rawBusiness?.contactPerson?.phone || 'N/A',
      email
    },
    subscription: {
      status,
      plan,
      billingCycle: 'Monthly'
    },
    createdAt: rawBusiness?.createdAt || new Date()
  };

  const confirmDelete = () => {
    toast.error(`Business account ${business.name} deletion requested`);
    setIsDeleteDialogOpen(false);
  };

  const confirmSuspend = () => {
    toast.warning(`Business account ${business.name} suspended`);
    setIsSuspendDialogOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/businesses">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{business.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-neutral-500 dark:text-neutral-400">ID: {business.id} • {business.type}</p>
            <Separator orientation="vertical" className="h-3 bg-neutral-300" />
            <p className="text-neutral-500 dark:text-neutral-400">Registered on {format(new Date(business.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200 h-8 px-4 text-sm font-medium">
            {business.subscription.status}
          </Badge>
          <Button className="bg-green-600 hover:bg-green-700 font-semibold" onClick={() => setIsBusinessModalOpen(true)}>Edit Business</Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="collections">Collection Logs</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Avg. Monthly Waste</p>
                        <p className="text-xl font-bold">
                          {business.size === 'Enterprise' ? '5.8 Tons' : business.size === 'Medium-Scale' ? '2.4 Tons' : '0.8 Tons'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Monthly Revenue</p>
                        <p className="text-xl font-bold">₦{business.monthlyRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Compliance Rate</p>
                        <p className="text-xl font-bold">98%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Company profile and service specifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Business Identity</p>
                        <p className="font-medium text-sm">{business.type}</p>
                        <p className="text-sm text-neutral-500">Size: {business.size}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Official Email</p>
                        <p className="font-medium text-sm">{business.businessEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Subscription Plan</p>
                        <p className="font-medium text-sm">{business.subscription.plan}</p>
                        <Badge variant="outline" className="mt-1 text-[10px] h-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                          {business.subscription.billingCycle}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Collection Schedule</p>
                        <p className="font-medium text-sm">
                          {business.subscription.plan.includes('Enterprise') ? 'Daily (Mon - Sun)' : 'Thrice Weekly'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Precise Location</CardTitle>
                      <CardDescription>{business.location.address}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${business.location.coordinates?.lat},${business.location.coordinates?.lng}`, '_blank')}>
                      <Navigation className="h-4 w-4" />
                      Open in Maps
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] bg-neutral-100 dark:bg-neutral-800 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(3.3619,6.5059)/3.3619,6.5059,14/800x600?access_token=pk.eyJ1IjoiY2xlYW5uaWdlcmlhIiwiYSI6ImNsMWYyYmZjdzAybmIzYm8wYnB2bWp0d3MifQ==')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="h-10 w-10 bg-red-600 rounded-full border-4 border-white shadow-xl animate-bounce flex items-center justify-center text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="mt-2 bg-white dark:bg-neutral-900 px-3 py-1 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 text-xs font-bold whitespace-nowrap">
                        {business.name}
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-neutral-900/90 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 font-mono">
                      LAT: {business.location.coordinates?.lat} • LNG: {business.location.coordinates?.lng}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Representative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center font-bold text-lg">
                      <User className="h-6 w-6 text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">{business.contact.name}</p>
                      <p className="text-sm text-neutral-500">Account Manager</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <span>{business.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{business.contact.phone}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full font-semibold" onClick={() => toast.info(`Call placed to ${business.contact.phone}`)}>Call</Button>
                    <Button variant="outline" size="sm" className="w-full font-semibold" onClick={() => toast.info(`Email sent to ${business.contact.email}`)}>Email</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Actions that affect business service.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start font-medium"
                    onClick={() => setIsSuspendDialogOpen(true)}
                  >
                    Suspend Account
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab Content */}
        <TabsContent value="billing" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Invoices & Payments</CardTitle>
                <CardDescription>Manage corporate billing and view historical invoices.</CardDescription>
              </div>
              <Button variant="outline" className="h-9 font-medium" onClick={() => toast.success("Corporate ledger exported")}>
                <Download className="h-4 w-4 mr-2" /> Export Ledger
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                      No invoices issued.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collections Tab Content */}
        <TabsContent value="collections" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Service Logs</CardTitle>
                <CardDescription>Detailed logs of waste collection visits.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input placeholder="Filter logs..." className="pl-9 h-9 w-48 bg-neutral-50 dark:bg-neutral-950" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-neutral-500">
                No waste collection services logged.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complaints Tab Content */}
        <TabsContent value="complaints" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Customer Complaints</CardTitle>
              <CardDescription>Support requests and issue tracking for this business.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-neutral-500">No active complaints filed by this account.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BusinessFormModal 
        isOpen={isBusinessModalOpen} 
        onClose={() => setIsBusinessModalOpen(false)} 
        business={rawBusiness} 
      />

      {/* Confirmation Dialogs */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-neutral-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              corporate account for <strong>{business.name}</strong> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
              Continue Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-neutral-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Account Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend service for <strong>{business.name}</strong>? 
              Waste collection services will be halted immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspend} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              Suspend Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  CreditCard, 
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Activity,
  Home,
  Search,
  MoreHorizontal,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Eye,
  Pencil,
  Trash2,
  Ban,
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
import { EstateFormModal } from '@/components/estates/EstateFormModal';
import { HouseFormModal } from '@/components/estates/HouseFormModal';
import { HouseDetailsModal } from '@/components/estates/HouseDetailsModal';
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
import { useEstateById, useEstateUnits } from '@/hooks/useAdminEntities';

export default function EstateDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  const { data: rawEstate, isLoading: isEstateLoading } = useEstateById(id);
  const { data: rawUnits = [], isLoading: isUnitsLoading } = useEstateUnits(id);

  // State for Modals
  const [isEstateModalOpen, setIsEstateModalOpen] = useState(false);
  const [isHouseFormModalOpen, setIsHouseFormModalOpen] = useState(false);
  const [isHouseDetailsModalOpen, setIsHouseDetailsModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  
  // State for Alert Dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [dangerActionType, setDangerActionType] = useState<'estate' | 'house'>('estate');

  if (isEstateLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-neutral-500 text-sm font-medium">Loading estate details...</p>
      </div>
    );
  }

  // Mappings
  const managerName = rawEstate?.managerName || 'System Managed';
  const type = rawEstate?.collectionType === 'ESTATE_FULL' ? 'Centralized' : 'Individual Units';
  const lga = rawEstate?.address?.lga || 'Eti-Osa';
  const state = rawEstate?.address?.state || 'Lagos';
  const streetAddress = rawEstate?.address?.street || 'Estate Gate Rd';
  const unitsCount = rawEstate?.totalUnits || 0;
  
  const statusMap = (s: string) => {
    if (s === 'ACTIVE') return 'Active';
    if (s === 'PENDING') return 'Pending';
    return 'Suspended';
  };
  
  const plan = rawEstate?.collectionType === 'ESTATE_FULL' ? 'Premium Plan' : 'Standard Plan';
  const status = statusMap(rawEstate?.status);

  const estate = {
    id: rawEstate?._id,
    name: rawEstate?.name || 'Unnamed Estate',
    manager: {
      name: managerName,
      email: rawEstate?.managerEmail || 'manager@estate.com',
      phone: rawEstate?.managerPhone || '+234 800 000 0000'
    },
    type,
    location: {
      address: streetAddress,
      lga,
      state,
      coordinates: rawEstate?.address?.coordinates || { lat: 6.4589, lng: 3.6015 }
    },
    stats: { units: unitsCount },
    subscription: { status, plan }
  };

  const estateHouses = rawUnits.map((house: any) => {
    return {
      id: house._id,
      houseNumber: house.unitNumber || 'N/A',
      street: streetAddress,
      block: house.block || '',
      occupantName: house.occupantName || 'Vacant Unit',
      occupantPhone: house.occupantPhone || 'N/A',
      status: house.status === 'ACTIVE' ? 'Active' : 'Inactive',
      lastCollection: house.lastCollection || 'N/A',
      complianceScore: house.complianceScore || 95
    };
  });

  const handleEditHouse = (house: any) => {
    setSelectedHouse(house);
    setIsHouseFormModalOpen(true);
  };

  const handleViewHouse = (house: any) => {
    setSelectedHouse(house);
    setIsHouseDetailsModalOpen(true);
  };

  const handleDeleteClick = (type: 'estate' | 'house', item?: any) => {
    setDangerActionType(type);
    if (item) setSelectedHouse(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSuspendClick = (type: 'estate' | 'house', item?: any) => {
    setDangerActionType(type);
    if (item) setSelectedHouse(item);
    setIsSuspendDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.error(dangerActionType === 'estate' ? "Estate deletion requested" : `House ${selectedHouse?.houseNumber} deleted`);
    setIsDeleteDialogOpen(false);
  };

  const confirmSuspend = () => {
    toast.warning(dangerActionType === 'estate' ? "Estate service suspended" : `House ${selectedHouse?.houseNumber} suspended`);
    setIsSuspendDialogOpen(false);
  };

  const handleDownloadStatement = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing billing statement...',
        success: 'Statement downloaded successfully',
        error: 'Failed to download statement',
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/estates">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{estate.name}</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">ID: {estate.id} • Registered via Dashboard</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200 h-8 px-4 text-sm font-medium">
            {estate.subscription.status}
          </Badge>
          <Button className="bg-green-600 hover:bg-green-700 font-semibold" onClick={() => setIsEstateModalOpen(true)}>Edit Estate</Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="households" className="flex items-center gap-2">
            Households
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-[20px] justify-center">
              {isUnitsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : estateHouses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="collections">Collection History</TabsTrigger>
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
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Total Units</p>
                        <p className="text-xl font-bold">{estate.stats.units}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">Active Users</p>
                        <p className="text-xl font-bold">{Math.floor(estate.stats.units * 0.9)}</p>
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
                        <p className="text-sm text-neutral-500 font-medium">Compliance</p>
                        <p className="text-xl font-bold">96%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Estate Information</CardTitle>
                  <CardDescription>General details and location settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Estate Type</p>
                        <p className="font-medium">{estate.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Location</p>
                        <p className="font-medium">{estate.location.address}</p>
                        <p className="text-sm text-neutral-500">{estate.location.lga}, {estate.location.state} State</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Subscription Plan</p>
                        <p className="font-medium">{estate.subscription.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Collection Days</p>
                        <p className="font-medium">Monday, Wednesday, Friday</p>
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
                      <CardDescription>{estate.location.address}</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2" 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${estate.location.coordinates?.lat || 6.4589},${estate.location.coordinates?.lng || 3.6015}`, '_blank')}
                    >
                      <Navigation className="h-4 w-4" />
                      Open in Maps
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] bg-neutral-100 dark:bg-neutral-800 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(3.6015,6.4589)/3.6015,6.4589,14/800x600?access_token=pk.eyJ1IjoiY2xlYW5uaWdlcmlhIiwiYSI6ImNsMWYyYmZjdzAybmIzYm8wYnB2bWp0d3MifQ==')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="h-10 w-10 bg-red-600 rounded-full border-4 border-white shadow-xl animate-bounce flex items-center justify-center text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="mt-2 bg-white dark:bg-neutral-900 px-3 py-1 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 text-xs font-bold whitespace-nowrap">
                        {estate.name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Estate Manager</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center font-bold text-lg">
                      {estate.manager.name?.[0] || 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">{estate.manager.name}</p>
                      <p className="text-sm text-neutral-500">Authorized Manager</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-neutral-400" />
                      <span>{estate.manager.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{estate.manager.phone}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => toast.info(`Contacting ${estate.manager.name}...`)}>Contact Manager</Button>
                </CardContent>
              </Card>

              <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Actions that affect estate access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start font-medium"
                    onClick={() => handleSuspendClick('estate')}
                  >
                    Suspend Service
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteClick('estate')}
                  >
                    Delete Estate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Households Tab Content */}
        <TabsContent value="households" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Estate Households</CardTitle>
                <CardDescription>Directory of all registered units in this estate.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input placeholder="Search houses..." className="pl-9 h-9 w-64 bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none" />
                </div>
                <Button className="bg-green-600 h-9 font-semibold text-white hover:bg-green-700" onClick={() => {
                  setSelectedHouse(null);
                  setIsHouseFormModalOpen(true);
                }}>Register House</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isUnitsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <p className="text-neutral-500 text-sm font-medium">Loading units...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Address/House ID</TableHead>
                      <TableHead>Occupant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Collection</TableHead>
                      <TableHead className="text-center">Compliance</TableHead>
                      <TableHead className="text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estateHouses.length > 0 ? (
                      estateHouses.map((house: any) => (
                        <TableRow key={house.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                                <Home className="h-4 w-4 text-neutral-500" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">
                                  {house.block ? `${house.block}, ` : ''}House {house.houseNumber}
                                </p>
                                <p className="text-xs text-neutral-500">{house.street}</p>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter mt-0.5">ID: {house.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-sm text-neutral-900 dark:text-white">{house.occupantName}</p>
                            <p className="text-xs text-neutral-500 font-normal">{house.occupantPhone}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "font-bold text-[10px] uppercase px-2 py-0.5 border-2",
                              house.status === 'Active' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                            )}>
                              {house.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {house.lastCollection !== 'N/A' 
                                ? formatDistanceToNow(new Date(house.lastCollection), { addSuffix: true })
                                : 'Never'
                              }
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-xs font-black ${
                                house.complianceScore >= 90 ? "text-green-600" : house.complianceScore >= 70 ? "text-amber-600" : "text-red-600"
                              }`}>
                                {house.complianceScore}%
                              </span>
                              <div className="w-16 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    house.complianceScore >= 90 ? "bg-green-600" : house.complianceScore >= 70 ? "bg-amber-600" : "bg-red-600"
                                  )} 
                                  style={{ width: `${house.complianceScore}%` }} 
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-neutral-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-950">
                                <DropdownMenuLabel>House Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewHouse(house)}>
                                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditHouse(house)}>
                                  <Pencil className="h-4 w-4 mr-2 text-amber-500" />
                                  Edit House
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleSuspendClick('house', house)}>
                                  <Ban className="h-4 w-4 mr-2 text-neutral-500" />
                                  Suspend Unit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600 font-semibold focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                  onClick={() => handleDeleteClick('house', house)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Unit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                          No households registered for this estate.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing History Tab Content */}
        <TabsContent value="billing" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Billing & Invoices</CardTitle>
                <CardDescription>Historical record of estate-wide service payments.</CardDescription>
              </div>
              <Button variant="outline" className="h-9 font-medium" onClick={handleDownloadStatement}>
                <Download className="h-4 w-4 mr-2" /> Download Statement
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

        {/* Collection History Tab Content */}
        <TabsContent value="collections" className="outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Waste Collection Logs</CardTitle>
                <CardDescription>Recent collection activities and operational feedback.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Logs exported to CSV")}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center text-neutral-500">
                No recent collection activities logged.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EstateFormModal 
        isOpen={isEstateModalOpen} 
        onClose={() => setIsEstateModalOpen(false)} 
        estate={rawEstate} 
      />

      <HouseFormModal
        isOpen={isHouseFormModalOpen}
        onClose={() => setIsHouseFormModalOpen(false)}
        house={selectedHouse}
        estateId={estate.id}
      />

      <HouseDetailsModal
        isOpen={isHouseDetailsModalOpen}
        onClose={() => setIsHouseDetailsModalOpen(false)}
        house={selectedHouse}
      />

      {/* Confirmation Dialogs */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-neutral-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {dangerActionType === 'estate' ? ' estate and all associated data' : ` house ${selectedHouse?.houseNumber}`} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-neutral-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend service for this {dangerActionType === 'estate' ? 'estate' : 'house'}? 
              {dangerActionType === 'estate' 
                ? ' This will halt waste collection for all units.' 
                : ' This unit will no longer be included in collection rounds.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspend} className="bg-amber-600 hover:bg-amber-700">
              Suspend Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

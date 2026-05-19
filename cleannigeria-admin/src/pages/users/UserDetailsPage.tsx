import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  History, 
  Settings,
  MoreHorizontal,
  Ban,
  Trash2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserDetails, useToggleUserStatus } from '@/hooks/useAdminUsers';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { UserFormModal } from '@/components/users/UserFormModal';
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

export default function UserDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  
  const { data, isLoading } = useUserDetails(id as string);
  const toggleStatus = useToggleUserStatus();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSuspend = async () => {
    if (!id) return;
    await toggleStatus.mutateAsync({ id, status: { isSuspended: true, isActive: false } });
    toast.warning(`User ${user.firstName} has been suspended`);
    setIsSuspendDialogOpen(false);
  };

  const handleDelete = () => {
    toast.error(`Delete functionality is restricted`);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading || !data) {
    return <div className="p-8 text-center text-neutral-500">Loading user details...</div>;
  }

  const { user, subscription, payments } = data;
  const fullName = `${user.firstName} ${user.lastName}`;
  const statusLabel = user.isActive ? 'Active' : user.isSuspended ? 'Suspended' : 'Inactive';

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/users">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage src={user.avatar?.url} />
            <AvatarFallback>{fullName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-normal">{user.accountType}</Badge>
              <Separator orientation="vertical" className="h-3 bg-neutral-300" />
              <p className="text-sm text-neutral-500 font-medium">Joined {format(new Date(user.createdAt || Date.now()), 'MMM yyyy')}</p>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className={
            user.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }>
            {statusLabel}
          </Badge>
          <Button className="bg-green-600 hover:bg-green-700 font-semibold" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral-400">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral-400">Phone Number</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral-400">Subscription Status</p>
                        <p className="font-medium">{subscription?.planId?.name || 'No Active Plan'} • {subscription?.billingCycle || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral-400">Last Login</p>
                        <p className="font-medium">{formatDistanceToNow(new Date(user.lastLogin || user.updatedAt || Date.now()), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Billing cycle and payment information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-6 border-b border-neutral-100 pb-6 mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Current Plan</p>
                      <p className="font-bold text-lg text-green-600">{user.subscription?.plan || 'Standard Plan'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Billing Cycle</p>
                      <p className="font-medium">{user.subscription?.billingCycle || 'Monthly'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Price</p>
                      <p className="font-medium">₦{(user.subscription?.price || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Next Billing Date</p>
                      <p className="font-medium">{user.subscription?.nextBillingDate ? format(new Date(user.subscription.nextBillingDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Payment Method</p>
                      <p className="font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-neutral-400" />
                        {user.subscription?.paymentMethod || 'Card'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Auto-Renewal</p>
                      <Badge variant="outline" className={user.subscription?.autoRenew ? 'bg-green-50 text-green-700 border-green-200' : 'bg-neutral-50 text-neutral-700'}>
                        {user.subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Linked Entity</CardTitle>
                  <CardDescription>Property or business associated with this user.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-neutral-100">
                        {user.accountType === 'Business Owner' ? <Building className="h-6 w-6 text-blue-600" /> : <MapPin className="h-6 w-6 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{user.linkedEntity}</p>
                        <p className="text-sm text-neutral-500">Associated {user.accountType === 'Business Owner' ? 'Commercial Client' : 'Residential Estate'}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={user.accountType === 'Business Owner' ? `/businesses/${user.linkedEntity}` : `/estates/${user.linkedEntity}`}>
                        View Entity <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center pb-8">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="h-32 w-32">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-neutral-100" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.42} strokeDashoffset={364.42 * 0.1} className="text-green-500" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-2xl font-bold">90%</span>
                  </div>
                  <p className="text-sm text-neutral-500">Service compliance for the last 6 months.</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50/50 border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-700">Account Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="destructive" className="w-full justify-start font-medium" onClick={() => setIsSuspendDialogOpen(true)}>
                    <Ban className="h-4 w-4 mr-2" /> Suspend User
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="outline-none">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Record of all payments and pending invoices.</CardDescription>
              </div>
              <Button variant="outline" size="sm"><CreditCard className="mr-2 h-4 w-4" /> Download Statement</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p._id || p.id}>
                      <TableCell className="font-mono text-xs">{p._id || p.id}</TableCell>
                      <TableCell>{format(new Date(p.createdAt || p.dueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-bold">₦{((p.amount || 0) / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={p.status === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Receipt</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="outline-none">
           <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User's platform interactions and service events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {[
                { event: 'Payment Successful', time: '2 hours ago', icon: <CheckCircle2 className="text-green-500" />, detail: 'Paid ₦5,000 for May Subscription' },
                { event: 'Profile Updated', time: '1 day ago', icon: <UserIcon className="text-blue-500" />, detail: 'Changed phone number' },
                { event: 'Service Request', time: '3 days ago', icon: <Settings className="text-amber-500" />, detail: 'Requested extra bin pickup' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                    {log.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{log.event}</p>
                      <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{log.time}</span>
                    </div>
                    <p className="text-sm text-neutral-500">{log.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="outline-none">
           <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Management and security controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                <div>
                  <p className="font-bold">Password Reset</p>
                  <p className="text-sm text-neutral-500">Send a password reset link to user's email.</p>
                </div>
                <Button variant="outline" onClick={() => toast.success('Reset link sent')}>Send Link</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                <div>
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-500">Enable or disable 2FA for this user.</p>
                </div>
                <Badge>Disabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} />

      <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Suspension</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{user.name}</strong>? They will lose access to their account and services will be paused.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">Suspend Account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. All data associated with <strong>{user.name}</strong> will be erased from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold">Delete Permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

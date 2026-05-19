import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  Lock, 
  UserPlus, 
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  Save,
  Zap,
  DollarSign,
  Clock,
  ShieldCheck,
  Ban,
  Slash,
  UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AdminUserModal } from '@/components/settings/AdminUserModal';
import { useAdminTeam, useUpdateAdmin, useDeleteAdmin } from '@/hooks/useAdminTeam';
import { useAdminPlans } from '@/hooks/useAdminPlans';
import { PlanFormModal } from '@/components/settings/PlanFormModal';
import { Plus } from 'lucide-react';

const roleLabelMap: Record<string, string> = {
  'SUPER_ADMIN': 'Super Admin',
  'ADMIN': 'Super Admin',
  'OPERATIONS_MANAGER': 'Operations Lead',
  'FINANCE_OFFICER': 'Finance Manager',
  'SUPPORT_AGENT': 'Support Lead',
  'ANALYST': 'Regional Supervisor',
};

const getStatusLabel = (isActive?: boolean, isSuspended?: boolean) => {
  if (isSuspended) return isActive ? 'Suspended' : 'Blocked';
  return isActive ? 'Active' : 'Inactive';
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('system');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Live query & mutations
  const { data: plans = [], isLoading: isLoadingPlans } = useAdminPlans();
  const { data: admins = [], isLoading } = useAdminTeam();
  const { mutateAsync: updateAdmin } = useUpdateAdmin();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System settings updated successfully');
    }, 1500);
  };

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setIsAdminModalOpen(true);
  };

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsAdminModalOpen(true);
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await deleteAdmin(id);
      toast.success('Administrative profile deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete administrative profile');
    }
  };

  const handleSuspendAdmin = async (id: string) => {
    try {
      await updateAdmin({ id, data: { isSuspended: true } });
      toast.warning('Administrative access suspended');
    } catch (err: any) {
      toast.error('Failed to suspend access');
    }
  };

  const handleBlockAdmin = async (id: string) => {
    try {
      await updateAdmin({ id, data: { isActive: false, isSuspended: true } });
      toast.error('Account has been blocked from all system access');
    } catch (err: any) {
      toast.error('Failed to block account');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-4">
            System Control
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Configure platform-wide parameters and manage administrative access.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-11 px-8 rounded-xl"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl w-full md:w-auto flex overflow-x-auto h-auto no-scrollbar">
          <TabsTrigger value="system" className="rounded-xl px-8 py-3 font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4 mr-2" /> System Config
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl px-8 py-3 font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" /> Admin Team
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 py-3 font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="animate-in slide-in-from-left-2 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                 <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                       <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Operational Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Base Collection Rate</label>
                             <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input defaultValue="2500" className="pl-9 h-11 rounded-xl border-neutral-200 font-bold" />
                             </div>
                             <p className="text-[10px] text-neutral-400 font-medium">Default monthly fee for estates.</p>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Grace Period (Days)</label>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input defaultValue="5" type="number" className="pl-9 h-11 rounded-xl border-neutral-200 font-bold" />
                             </div>
                             <p className="text-[10px] text-neutral-400 font-medium">Before service suspension.</p>
                          </div>
                       </div>
                       
                       <Separator className="bg-neutral-100" />
                       
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <p className="text-sm font-bold">Auto-Dispatch Workforce</p>
                             <p className="text-xs text-neutral-500">Enable algorithmic routing for morning shifts.</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
                       </div>

                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <p className="text-sm font-bold">Maintenance Mode</p>
                             <p className="text-xs text-neutral-500">Temporarily restrict client-side updates.</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-red-600" />
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                       <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Communication Nodes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                              <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm">
                                 <Mail className="h-5 w-5 text-neutral-400" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">SMTP Relay</p>
                                 <p className="text-sm font-bold">mail.cleannigeria.io</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Connected</Badge>
                           </div>
                           <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                              <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm">
                                 <Zap className="h-5 w-5 text-neutral-400" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Push Services</p>
                                 <p className="text-sm font-bold">Firebase Messaging</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Active</Badge>
                           </div>
                        </div>
                    </CardContent>
                 </Card>
              </div>

              <div className="space-y-8">
                 <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6 flex flex-row items-center justify-between">
                       <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Regional Subscriptions</CardTitle>
                       <Button variant="ghost" size="sm" className="h-8 font-bold text-xs" onClick={() => { setSelectedPlan(null); setIsPlanModalOpen(true); }}>
                         <Plus className="h-3 w-3 mr-1" /> Add Plan
                       </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                       <div className="space-y-4">
                          {isLoadingPlans ? (
                            <div className="text-center py-8 text-neutral-500 text-sm font-medium">Loading plans...</div>
                          ) : plans.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 text-sm font-medium">No active plans found.</div>
                          ) : plans.map((plan: any, i: number) => (
                            <div key={plan._id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors rounded-xl border border-transparent hover:border-neutral-100">
                               <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold">{plan.name}</p>
                                    {plan.isFeatured && <Badge className="bg-brand-50 text-brand-700 text-[9px] h-4">Featured</Badge>}
                                    {!plan.isActive && <Badge variant="outline" className="text-neutral-400 text-[9px] h-4">Hidden</Badge>}
                                  </div>
                                  <p className="text-xs text-neutral-500 mt-1">{plan.targetType.replace('_', ' ')}</p>
                               </div>
                               <div className="flex items-center gap-4">
                                 <div className="text-right">
                                    <p className="text-sm font-black text-neutral-900">₦{(plan.pricing?.monthly / 100).toLocaleString()}/mo</p>
                                    <p className="text-[10px] font-bold text-green-600 uppercase">Order {plan.displayOrder}</p>
                                 </div>
                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 shrink-0" onClick={() => { setSelectedPlan(plan); setIsPlanModalOpen(true); }}>
                                   <Edit className="h-4 w-4" />
                                 </Button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in slide-in-from-left-2 duration-500">
           <Card className="border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/30">
                 <div>
                    <h3 className="text-xl font-bold tracking-tight">Administrative Team</h3>
                    <p className="text-sm text-neutral-500 mt-1">Manage users with access to the command center.</p>
                 </div>
                 <Button className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold rounded-xl" onClick={handleAddAdmin}>
                    <UserPlus className="h-4 w-4 mr-2" /> Add Administrator
                 </Button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                       <tr>
                          <th className="px-6 py-4">Identity</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {isLoading ? (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-sm text-neutral-400 font-medium">
                              Loading administrative team...
                            </td>
                          </tr>
                        ) : admins.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-sm text-neutral-400 font-medium">
                              No administrator accounts found.
                            </td>
                          </tr>
                        ) : (
                          admins.map((admin: any) => {
                            const fullName = admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'System Admin';
                            const initials = fullName.split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'SA';
                            const statusLabel = getStatusLabel(admin.isActive, admin.isSuspended);

                            return (
                              <tr key={admin._id || admin.id} className="hover:bg-neutral-50/30 transition-colors">
                                 <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-black text-sm shadow-md">
                                          {initials}
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold text-neutral-900 dark:text-white">{fullName}</p>
                                          <p className="text-xs text-neutral-500">{admin.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5">
                                    <Badge variant="outline" className="font-bold border-neutral-200 text-neutral-600 dark:text-neutral-300">{roleLabelMap[admin.role] || admin.role}</Badge>
                                 </td>
                                 <td className="px-6 py-5">
                                    <Badge className={cn(
                                      "font-bold",
                                      statusLabel === 'Active' ? "bg-green-100 text-green-700" : 
                                      statusLabel === 'Blocked' ? "bg-red-100 text-red-700" :
                                      "bg-neutral-100 text-neutral-500"
                                    )}>
                                       {statusLabel}
                                    </Badge>
                                 </td>
                                 <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-neutral-100" onClick={() => handleEditAdmin(admin)}><Edit className="h-4 w-4" /></Button>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="rounded-xl w-48">
                                             <DropdownMenuLabel>Security Controls</DropdownMenuLabel>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditAdmin(admin)}>
                                               <Key className="h-4 w-4 mr-2" /> Reset Password
                                             </DropdownMenuItem>
                                             <DropdownMenuItem className="cursor-pointer" onClick={() => handleSuspendAdmin(admin._id || admin.id)}>
                                               <Slash className="h-4 w-4 mr-2" /> Suspend Access
                                             </DropdownMenuItem>
                                             <DropdownMenuItem className="cursor-pointer text-amber-600" onClick={() => handleBlockAdmin(admin._id || admin.id)}>
                                               <Ban className="h-4 w-4 mr-2" /> Block Account
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDeleteAdmin(admin._id || admin.id)}>
                                               <UserX className="h-4 w-4 mr-2" /> Delete Profile
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>
                                 </td>
                              </tr>
                            );
                          })
                        )
                        }
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in slide-in-from-left-2 duration-500">
           <div className="max-w-2xl space-y-8">
              <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                 <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Platform Security</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                          <div className="flex items-center gap-4">
                             <Lock className="h-5 w-5 text-neutral-400" />
                             <div>
                                <p className="text-sm font-bold">Two-Factor Authentication (MFA)</p>
                                <p className="text-xs text-neutral-500">Require OTP for all administrative logins.</p>
                             </div>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                          <div className="flex items-center gap-4">
                             <Database className="h-5 w-5 text-neutral-400" />
                             <div>
                                <p className="text-sm font-bold">IP Whitelisting</p>
                                <p className="text-xs text-neutral-500">Restrict access to specific office network ranges.</p>
                             </div>
                          </div>
                          <Switch className="data-[state=checked]:bg-green-600" />
                       </div>
                    </div>

                    <Separator className="bg-neutral-100" />

                    <div className="space-y-4">
                       <h4 className="text-sm font-black uppercase tracking-widest text-neutral-400">Active Sessions</h4>
                       <div className="space-y-3">
                          {[
                            { device: 'Admin Terminal (MacBook Pro)', loc: 'Lagos, Nigeria', ip: '192.168.1.45', current: true },
                            { device: 'Operations iPad', loc: 'Ikeja, Nigeria', ip: '102.89.2.14', current: false }
                          ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                               <div className="flex gap-4">
                                  <div className="h-10 w-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400">
                                     <Globe className="h-5 w-5" />
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold">{session.device}</p>
                                        {session.current && <Badge className="bg-green-100 text-green-700 font-bold text-[10px]">CURRENT</Badge>}
                                     </div>
                                     <p className="text-xs text-neutral-500">{session.loc} • {session.ip}</p>
                                  </div>
                               </div>
                               {!session.current && <Button variant="ghost" size="sm" className="text-red-500 font-bold text-xs">Terminate</Button>}
                            </div>
                          ))}
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      <AdminUserModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        admin={selectedAdmin}
      />

      <PlanFormModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={selectedPlan}
      />
    </div>
  );
}

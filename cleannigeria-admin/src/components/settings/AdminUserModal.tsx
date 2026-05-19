import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserPlus, Mail, User, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateAdmin, useUpdateAdmin } from '@/hooks/useAdminTeam';

interface AdminUser {
  id?: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status?: string;
  isActive?: boolean;
  isSuspended?: boolean;
}

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: AdminUser | null;
}

const roles = [
  'Super Admin',
  'Operations Lead',
  'Finance Manager',
  'Support Lead',
  'Regional Supervisor'
];

const roleMapToEnum: Record<string, string> = {
  'Super Admin': 'SUPER_ADMIN',
  'Operations Lead': 'OPERATIONS_MANAGER',
  'Finance Manager': 'FINANCE_OFFICER',
  'Support Lead': 'SUPPORT_AGENT',
  'Regional Supervisor': 'ANALYST',
};

const roleMapFromEnum: Record<string, string> = {
  'SUPER_ADMIN': 'Super Admin',
  'ADMIN': 'Super Admin',
  'OPERATIONS_MANAGER': 'Operations Lead',
  'FINANCE_OFFICER': 'Finance Manager',
  'SUPPORT_AGENT': 'Support Lead',
  'ANALYST': 'Regional Supervisor',
};

export function AdminUserModal({ isOpen, onClose, admin }: AdminUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Support Lead');
  const [status, setStatus] = useState('Active');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutateAsync: updateAdmin, isPending: isUpdating } = useUpdateAdmin();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (admin) {
      setName(admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim());
      setEmail(admin.email);
      setRole(roleMapFromEnum[admin.role] || 'Support Lead');
      
      if (admin.isSuspended) {
        setStatus(admin.isActive ? 'Suspended' : 'Blocked');
      } else {
        setStatus(admin.isActive ? 'Active' : 'Inactive');
      }
    } else {
      setName('');
      setEmail('');
      setRole('Support Lead');
      setStatus('Active');
    }
    setPassword('');
    setShowPassword(false);
  }, [admin, isOpen]);

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!admin && !password) {
      toast.error('Password is required for new accounts');
      return;
    }

    // Split name
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || 'Admin';

    // Map role
    const backendRole = roleMapToEnum[role] || 'SUPPORT_AGENT';

    // Map status
    let isActive = true;
    let isSuspended = false;
    if (status === 'Inactive') {
      isActive = false;
    } else if (status === 'Suspended') {
      isSuspended = true;
    } else if (status === 'Blocked') {
      isActive = false;
      isSuspended = true;
    }

    const payload: any = {
      firstName,
      lastName,
      email,
      role: backendRole,
      isActive,
      isSuspended
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (admin) {
        const id = admin._id || admin.id || '';
        await updateAdmin({ id, data: payload });
        toast.success('Administrator profile updated successfully');
      } else {
        await createAdmin(payload);
        toast.success('New administrator account created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit administration changes');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-neutral-200/50">
            {admin ? <ShieldCheck className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
          </div>
          <DialogTitle className="text-2xl font-bold">{admin ? 'Edit Account' : 'New Administrator'}</DialogTitle>
          <DialogDescription>
            {admin 
              ? `Update access levels and security settings for ${name}.`
              : 'Create a new administrative account with direct access to the platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Full Name</label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
               <Input 
                 placeholder="e.g. John Doe" 
                 className="h-11 pl-10 rounded-xl border-neutral-200 focus:ring-neutral-900"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Email Address</label>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
               <Input 
                 type="email"
                 placeholder="admin@cleannigeria.com" 
                 className="h-11 pl-10 rounded-xl border-neutral-200 focus:ring-neutral-900"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">
              {admin ? 'Change Password (Leave blank to keep current)' : 'Account Password'}
            </label>
            <div className="relative">
               <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
               <Input 
                 type={showPassword ? 'text' : 'password'}
                 placeholder="••••••••" 
                 className="h-11 pl-10 pr-10 rounded-xl border-neutral-200 focus:ring-neutral-900"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
               <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
                onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-400">System Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11 rounded-xl border-neutral-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Access Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 rounded-xl border-neutral-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0 mt-4">
          <Button variant="ghost" className="rounded-xl font-bold h-11 px-6" onClick={onClose} disabled={isSubmitting}>
            Discard
          </Button>
          <Button 
            className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold rounded-xl h-11 px-8 min-w-[140px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (
              admin ? 'Update Account' : 'Create Account'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Invalid phone number'),
  accountType: z.string().min(1, 'Please select an account type'),
  plan: z.string().min(1, 'Please select a plan'),
  status: z.enum(['Active', 'Suspended', 'Pending']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      plan: user.plan,
      status: user.status
    } : {
      status: 'Active'
    }
  });

  const onSubmit = (data: UserFormValues) => {
    toast.success(isEditing ? 'User updated successfully' : 'User created successfully');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User Profile' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update account details and permissions.' : 'Register a new user on the platform.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="E.g. John Doe" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} placeholder="+234..." />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select onValueChange={(val) => setValue('accountType', val)} defaultValue={user?.accountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estate Resident">Estate Resident</SelectItem>
                    <SelectItem value="Business Owner">Business Owner</SelectItem>
                    <SelectItem value="Estate Manager">Estate Manager</SelectItem>
                  </SelectContent>
                </Select>
                {errors.accountType && <p className="text-xs text-red-500">{errors.accountType.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Service Plan</Label>
                <Select onValueChange={(val) => setValue('plan', val)} defaultValue={user?.plan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                {errors.plan && <p className="text-xs text-red-500">{errors.plan.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(val: any) => setValue('status', val)} defaultValue={user?.status || 'Active'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

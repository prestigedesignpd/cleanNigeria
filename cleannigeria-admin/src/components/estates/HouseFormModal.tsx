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
import type { House } from '@/mock/houses.mock';

const houseSchema = z.object({
  houseNumber: z.string().min(1, 'House number is required'),
  street: z.string().min(2, 'Street name is required'),
  block: z.string().optional(),
  occupantName: z.string().min(2, 'Occupant name is required'),
  occupantPhone: z.string().min(10, 'Invalid phone number'),
  status: z.enum(['Active', 'Inactive', 'Pending']),
});

type HouseFormValues = z.infer<typeof houseSchema>;

interface HouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  house?: House | null;
  estateId: string;
}

export function HouseFormModal({ isOpen, onClose, house, estateId }: HouseFormModalProps) {
  const isEditing = !!house;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<HouseFormValues>({
    resolver: zodResolver(houseSchema),
    defaultValues: house ? {
      houseNumber: house.houseNumber,
      street: house.street,
      block: house.block || '',
      occupantName: house.occupantName,
      occupantPhone: house.occupantPhone,
      status: house.status
    } : {
      status: 'Pending',
      street: '',
      houseNumber: '',
      occupantName: '',
      occupantPhone: ''
    }
  });

  const onSubmit = (data: HouseFormValues) => {
    console.log('House data:', { ...data, estateId });
    toast.success(isEditing ? 'House details updated successfully' : 'House registered successfully');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit House Details' : 'Register New House'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update information for this residential unit.' : 'Add a new household to this estate directory.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House/Villa Number</Label>
              <Input id="houseNumber" {...register('houseNumber')} placeholder="E.g. 4 or Villa 7" />
              {errors.houseNumber && <p className="text-xs text-red-500">{errors.houseNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="block">Block/Section (Optional)</Label>
              <Input id="block" {...register('block')} placeholder="E.g. Block A" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Name</Label>
            <Input id="street" {...register('street')} placeholder="E.g. Emerald Way" />
            {errors.street && <p className="text-xs text-red-500">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupantName">Occupant Name</Label>
              <Input id="occupantName" {...register('occupantName')} placeholder="Full Name" />
              {errors.occupantName && <p className="text-xs text-red-500">{errors.occupantName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupantPhone">Occupant Phone</Label>
              <Input id="occupantPhone" {...register('occupantPhone')} placeholder="+234..." />
              {errors.occupantPhone && <p className="text-xs text-red-500">{errors.occupantPhone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              onValueChange={(val: any) => setValue('status', val)} 
              defaultValue={house?.status || 'Pending'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Save Changes' : 'Register House'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

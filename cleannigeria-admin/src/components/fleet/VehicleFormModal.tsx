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
import { Truck, Wrench } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const vehicleSchema = z.object({
  model: z.string().min(2, 'Model is required'),
  plateNumber: z.string().min(4, 'Plate number is required'),
  type: z.string().min(1, 'Please select a type'),
  capacity: z.string().min(1, 'Capacity is required'),
  status: z.string().min(1, 'Please select a status'),
  assignedCollector: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
}

export function VehicleFormModal({ isOpen, onClose, vehicle }: VehicleFormModalProps) {
  const isEditing = !!vehicle;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle ? {
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      type: vehicle.type,
      capacity: vehicle.capacity,
      status: vehicle.status,
      assignedCollector: vehicle.assignedCollector
    } : {
      status: 'Active'
    }
  });

  const onSubmit = (data: VehicleFormValues) => {
    toast.success(isEditing ? 'Vehicle updated successfully' : 'New vehicle added to fleet');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Vehicle Details' : 'Add New Vehicle'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update fleet information and assignment.' : 'Register a new truck into the CleanNigeria fleet.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <Truck className="h-4 w-4 text-green-600" />
              Vehicle Specifications
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model Name</Label>
                <Input id="model" {...register('model')} placeholder="E.g. Mercedes Econic" />
                {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input id="plateNumber" {...register('plateNumber')} placeholder="LA 000 XX" />
                {errors.plateNumber && <p className="text-xs text-red-500">{errors.plateNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <Select onValueChange={(val) => setValue('type', val)} defaultValue={vehicle?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compactor">Compactor Truck</SelectItem>
                    <SelectItem value="Mini Truck">Mini Truck</SelectItem>
                    <SelectItem value="Roll-off">Roll-off Truck</SelectItem>
                    <SelectItem value="Skip Loader">Skip Loader</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Load Capacity</Label>
                <Input id="capacity" {...register('capacity')} placeholder="e.g. 12 Tons" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <Wrench className="h-4 w-4 text-blue-600" />
              Operational Status
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select onValueChange={(val) => setValue('status', val)} defaultValue={vehicle?.status || 'Active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active / On Duty</SelectItem>
                    <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="Repair">Awaiting Repair</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedCollector">Assigned Collector</Label>
                <Input id="assignedCollector" {...register('assignedCollector')} placeholder="Staff Name" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Save Changes' : 'Register Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

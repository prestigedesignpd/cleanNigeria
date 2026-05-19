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
import { Truck, ShieldCheck, User, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAdminZones, useCreateCollector, useUpdateCollector } from '@/hooks/useAdminEntities';
import { useEffect } from 'react';

const collectorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(11, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  zone: z.string().min(1, 'Please select a zone'),
  vehicleNumber: z.string().min(4, 'Vehicle number is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleCapacity: z.string().min(1, 'Capacity is required'),
});

type CollectorFormValues = z.infer<typeof collectorSchema>;

interface CollectorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  collector?: any;
}

export function CollectorFormModal({ isOpen, onClose, collector }: CollectorFormModalProps) {
  const isEditing = !!collector;
  const { data: zones = [] } = useAdminZones();
  
  const createMutation = useCreateCollector();
  const updateMutation = useUpdateCollector();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch
  } = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorSchema)
  });

  const selectedZone = watch('zone');
  const selectedVehicleType = watch('vehicleType');

  // Sync default values when collector changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (collector) {
        const name = collector.fullName || (collector.firstName && collector.lastName ? `${collector.firstName} ${collector.lastName}` : '');
        const zoneId = collector.currentZoneId?._id || collector.currentZoneId || '';
        
        reset({
          name,
          phone: collector.phone || '',
          email: collector.email || '',
          zone: zoneId,
          vehicleNumber: collector.vehicle?.plateNumber || '',
          vehicleType: collector.vehicle?.type || 'SMALL_TRUCK',
          vehicleCapacity: collector.vehicle?.capacity || '5 Tons'
        });
      } else {
        reset({
          name: '',
          phone: '',
          email: '',
          zone: '',
          vehicleNumber: '',
          vehicleType: 'SMALL_TRUCK',
          vehicleCapacity: '5 Tons'
        });
      }
    }
  }, [collector, isOpen, reset]);

  const onSubmit = async (data: CollectorFormValues) => {
    const [firstName = '', ...lastNameParts] = data.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || 'Collector';

    // Map compactor/mini/roll-off label or type
    let finalVehicleType = 'SMALL_TRUCK';
    if (data.vehicleType === 'LARGE_TRUCK' || data.vehicleType === 'Compactor Truck' || data.vehicleType === 'Roll-off Truck') {
      finalVehicleType = 'LARGE_TRUCK';
    } else if (data.vehicleType === 'TRICYCLE') {
      finalVehicleType = 'TRICYCLE';
    } else if (data.vehicleType === 'MOTORCYCLE') {
      finalVehicleType = 'MOTORCYCLE';
    }

    const payload = {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      currentZoneId: data.zone,
      vehicle: {
        type: finalVehicleType,
        plateNumber: data.vehicleNumber,
        model: finalVehicleType.toLowerCase().replace('_', ' '),
        color: 'Green'
      }
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: collector._id || collector.id, data: payload });
        toast.success('Collector updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Collector registered successfully');
      }
      onClose();
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-neutral-950 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Collector Profile' : 'Register New Collector'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update field staff profile and equipment assignment.' : 'Register a new waste collector for operations.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Staff Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <User className="h-4 w-4 text-green-600" />
              Staff Information
            </h4>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="E.g. Samuel Ojo" disabled={isLoading} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" type="email" {...register('email')} placeholder="samuel@cleannigeria.com" disabled={isLoading} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} placeholder="+234..." disabled={isLoading} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Operational Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Operational Assignment
            </h4>
            <div className="space-y-2">
              <Label htmlFor="zone">Assigned Operations Zone</Label>
              <Select onValueChange={(val) => setValue('zone', val)} value={selectedZone} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {zones.length === 0 ? (
                    <SelectItem value="no-zones" disabled>No active zones available</SelectItem>
                  ) : (
                    zones.map((zone: any) => (
                      <SelectItem key={zone._id || zone.id} value={zone._id || zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.zone && <p className="text-xs text-red-500">{errors.zone.message}</p>}
            </div>
          </div>

          <Separator />

          {/* Vehicle Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <Truck className="h-4 w-4 text-amber-600" />
              Vehicle & Equipment
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(val) => setValue('vehicleType', val)} value={selectedVehicleType} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="SMALL_TRUCK">Small Truck</SelectItem>
                    <SelectItem value="LARGE_TRUCK">Large Truck (Compactor)</SelectItem>
                    <SelectItem value="TRICYCLE">Tricycle</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Plate Number</Label>
                <Input id="vehicleNumber" {...register('vehicleNumber')} placeholder="LA 000 XX" disabled={isLoading} />
                {errors.vehicleNumber && <p className="text-xs text-red-500">{errors.vehicleNumber.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleCapacity">Load Capacity (Tons)</Label>
              <Input id="vehicleCapacity" {...register('vehicleCapacity')} placeholder="e.g. 5 Tons" disabled={isLoading} />
              {errors.vehicleCapacity && <p className="text-xs text-red-500">{errors.vehicleCapacity.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Register Collector'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

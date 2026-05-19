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
import { MapPin, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const estateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(1, 'Please select a type'),
  lga: z.string().min(2, 'LGA is required'),
  state: z.string().min(2, 'State is required'),
  lat: z.string().optional(),
  lng: z.string().optional(),
  units: z.number().min(1, 'Units must be at least 1'),
  managerName: z.string().min(2, 'Manager name is required'),
  managerEmail: z.string().email('Invalid email address'),
  plan: z.string().min(1, 'Please select a plan'),
});

type EstateFormValues = z.infer<typeof estateSchema>;

interface EstateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate?: any; // If provided, we are editing
}

export function EstateFormModal({ isOpen, onClose, estate }: EstateFormModalProps) {
  const isEditing = !!estate;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<EstateFormValues>({
    resolver: zodResolver(estateSchema),
    defaultValues: estate ? {
      name: estate.name,
      type: estate.type,
      lga: estate.location.lga,
      state: estate.location.state,
      lat: estate.location.coordinates?.lat?.toString() || '',
      lng: estate.location.coordinates?.lng?.toString() || '',
      units: estate.stats.units,
      managerName: estate.manager.name,
      managerEmail: estate.manager.email,
      plan: estate.subscription.plan
    } : {
      units: 0
    }
  });

  const onSubmit = (data: EstateFormValues) => {
    console.log('Form data:', data);
    toast.success(isEditing ? 'Estate updated successfully' : 'Estate created successfully');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-white dark:bg-neutral-950 max-h-[90vh] overflow-y-auto text-neutral-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Estate Profile' : 'Register New Estate'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details and location for this estate.' : 'Enter the information for the new residential estate.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <Globe className="h-4 w-4 text-green-600" />
              General Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Estate Name</Label>
                <Input id="name" {...register('name')} placeholder="E.g. Emerald Greens" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Estate Type</Label>
                <Select onValueChange={(val) => setValue('type', val)} defaultValue={estate?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gated Community">Gated Community</SelectItem>
                    <SelectItem value="Apartment Complex">Apartment Complex</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    <SelectItem value="Government Housing">Government Housing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <MapPin className="h-4 w-4 text-red-500" />
              Location & Mapping
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Input id="lga" {...register('lga')} placeholder="E.g. Eti-Osa" />
                {errors.lga && <p className="text-xs text-red-500">{errors.lga.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} placeholder="E.g. Lagos" />
                {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude (Google Maps)</Label>
                <Input id="lat" {...register('lat')} placeholder="6.5244" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude (Google Maps)</Label>
                <Input id="lng" {...register('lng')} placeholder="3.3792" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <MapPin className="h-4 w-4 text-blue-600" />
              Management & Capacity
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="managerName">Manager Name</Label>
                <Input id="managerName" {...register('managerName')} placeholder="Full Name" />
                {errors.managerName && <p className="text-xs text-red-500">{errors.managerName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Total Household Units</Label>
                <Input id="units" type="number" {...register('units', { valueAsNumber: true })} />
                {errors.units && <p className="text-xs text-red-500">{errors.units.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerEmail">Manager Email</Label>
              <Input id="managerEmail" type="email" {...register('managerEmail')} placeholder="email@example.com" />
              {errors.managerEmail && <p className="text-xs text-red-500">{errors.managerEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select onValueChange={(val) => setValue('plan', val)} defaultValue={estate?.subscription.plan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic (Weekly Collection)</SelectItem>
                  <SelectItem value="Standard">Standard (Bi-weekly)</SelectItem>
                  <SelectItem value="Premium">Premium (Daily)</SelectItem>
                </SelectContent>
              </Select>
              {errors.plan && <p className="text-xs text-red-500">{errors.plan.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Save Changes' : 'Create Estate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

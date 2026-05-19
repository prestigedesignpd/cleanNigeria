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
import { MapPin, Mail, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const businessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(1, 'Please select a category'),
  businessEmail: z.string().email('Invalid business email'),
  address: z.string().min(5, 'Address is required'),
  lga: z.string().min(2, 'LGA is required'),
  state: z.string().min(2, 'State is required'),
  lat: z.string().optional(),
  lng: z.string().optional(),
  contactName: z.string().min(2, 'Contact person name is required'),
  contactPhone: z.string().min(11, 'Invalid phone number'),
  plan: z.string().min(1, 'Please select a plan'),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

interface BusinessFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  business?: any;
}

export function BusinessFormModal({ isOpen, onClose, business }: BusinessFormModalProps) {
  const isEditing = !!business;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: business ? {
      name: business.name,
      type: business.type,
      businessEmail: business.businessEmail,
      address: business.location.address,
      lga: business.location.lga,
      state: business.location.state,
      lat: business.location.coordinates?.lat?.toString() || '',
      lng: business.location.coordinates?.lng?.toString() || '',
      contactName: business.contact.name,
      contactPhone: business.contact.phone,
      plan: business.subscription.plan
    } : {}
  });

  const onSubmit = (data: BusinessFormValues) => {
    console.log('Form data:', data);
    toast.success(isEditing ? 'Business updated successfully' : 'Business registered successfully');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-neutral-950 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Business Profile' : 'Register New Business'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update commercial account details and location.' : 'Register a new commercial or corporate account.'}
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
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" {...register('name')} placeholder="E.g. Zenith Bank PLC" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Category</Label>
                <Select onValueChange={(val) => setValue('type', val)} defaultValue={business?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="Hospitality">Hospitality</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Corporate Office">Corporate Office</SelectItem>
                    <SelectItem value="School">Educational Institution</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Official Business Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input id="businessEmail" {...register('businessEmail')} className="pl-10" placeholder="info@company.com" />
              </div>
              {errors.businessEmail && <p className="text-xs text-red-500">{errors.businessEmail.message}</p>}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-tight">
              <MapPin className="h-4 w-4 text-red-500" />
              Location & Mapping
            </h4>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input id="address" {...register('address')} placeholder="Full Street Address" />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Input id="lga" {...register('lga')} placeholder="E.g. Ikeja" />
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
              <Globe className="h-4 w-4 text-blue-600" />
              Contact & Subscription
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Representative Name</Label>
                <Input id="contactName" {...register('contactName')} placeholder="Full Name" />
                {errors.contactName && <p className="text-xs text-red-500">{errors.contactName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Representative Phone</Label>
                <Input id="contactPhone" {...register('contactPhone')} placeholder="080..." />
                {errors.contactPhone && <p className="text-xs text-red-500">{errors.contactPhone.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Waste Management Plan</Label>
              <Select onValueChange={(val) => setValue('plan', val)} defaultValue={business?.subscription.plan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporate Basic">Corporate Basic (Weekly)</SelectItem>
                  <SelectItem value="Corporate Standard">Corporate Standard (Daily)</SelectItem>
                  <SelectItem value="Enterprise Business">Enterprise Business (Premium)</SelectItem>
                  <SelectItem value="Industrial">Industrial (On-demand)</SelectItem>
                </SelectContent>
              </Select>
              {errors.plan && <p className="text-xs text-red-500">{errors.plan.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Update Profile' : 'Register Business'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

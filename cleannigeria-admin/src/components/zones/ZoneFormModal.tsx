import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Map, 
  Shield, 
  Globe,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateZone, useUpdateZone } from '@/hooks/useAdminEntities';

const zoneSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  lga: z.string().min(2, 'LGA is required'),
});

type ZoneFormValues = z.infer<typeof zoneSchema>;

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: any;
}

export function ZoneFormModal({ isOpen, onClose, zone }: ZoneFormModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const createMutation = useCreateZone();
  const updateMutation = useUpdateZone();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema)
  });

  useEffect(() => {
    if (isOpen) {
      if (zone) {
        reset({
          name: zone.name || '',
          lga: zone.lgas?.[0] || zone.lga || ''
        });
        setSelectedDays(zone.collectionDays || []);
      } else {
        reset({ name: '', lga: '' });
        setSelectedDays([]);
      }
    }
  }, [zone, isOpen, reset]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const onSubmit = async (data: ZoneFormValues) => {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one collection day');
      return;
    }

    const payload = {
      name: data.name,
      lgas: [data.lga],
      state: 'Lagos State',
      collectionDays: selectedDays,
      timeWindows: [
        { label: 'Morning Shift', startTime: '07:00', endTime: '12:00' }
      ],
      boundary: {
        type: 'Polygon',
        coordinates: [[[3.3, 6.5], [3.4, 6.5], [3.4, 6.6], [3.3, 6.6], [3.3, 6.5]]]
      }
    };

    try {
      if (zone) {
        await updateMutation.mutateAsync({ id: zone._id || zone.id, data: payload });
        toast.success('Zone updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('New zone created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  const handleDecommission = async () => {
    try {
      await updateMutation.mutateAsync({ id: zone._id || zone.id, data: { status: 'INACTIVE' } });
      toast.error('Zone has been decommissioned');
      onClose();
    } catch (err: any) {
      toast.error('Failed to decommission zone');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-8 bg-neutral-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20" />
           <div className="relative z-10">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                 <Map className="h-6 w-6 text-green-400" />
                 {zone ? 'Edit Geographic Zone' : 'Define New Operational Zone'}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 mt-1">
                 Configure geographic boundaries and collection schedules for regional waste management.
              </DialogDescription>
           </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-8">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Zone Identity</label>
                   <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input 
                        placeholder="e.g. Ikeja Business District" 
                        {...register('name')}
                        disabled={isLoading}
                        className="pl-10 h-12 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500 font-bold" 
                      />
                   </div>
                   {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Region / LGA</label>
                   <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input 
                        placeholder="e.g. Ikeja" 
                        {...register('lga')}
                        disabled={isLoading}
                        className="pl-10 h-12 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500 font-bold" 
                      />
                   </div>
                   {errors.lga && <p className="text-xs text-red-500">{errors.lga.message}</p>}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Collection Schedule</label>
                   <span className="text-[10px] font-bold text-neutral-500">{selectedDays.length} Days Active</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                   {days.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        disabled={isLoading}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all uppercase",
                          selectedDays.includes(day)
                            ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20"
                            : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-neutral-200"
                        )}
                      >
                         {day.substring(0, 3)}
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4">
                <Shield className="h-6 w-6 text-blue-600 shrink-0" />
                <div>
                   <p className="text-sm font-bold text-blue-800 dark:text-blue-400">Operational Compliance</p>
                   <p className="text-xs text-blue-600/80 font-medium leading-relaxed mt-1">
                      Newly defined zones will require resource assignment (Staff & Fleet) before they can begin active collection cycles. 
                      All boundaries are subject to state environmental regulation audits.
                   </p>
                </div>
             </div>
          </div>

          <DialogFooter className="p-8 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 flex justify-between">
            {zone && (
              <Button type="button" onClick={handleDecommission} disabled={isLoading} variant="ghost" className="text-red-600 hover:bg-red-50 font-bold h-12 px-6">
                 <Trash2 className="h-4 w-4 mr-2" /> Decommission Zone
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="font-bold h-12 px-6">Discard</Button>
              <Button type="submit" disabled={isLoading} className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold h-12 px-8">
                 {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                 {zone ? 'Save Modifications' : 'Initialize Zone'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { toast } from 'sonner';
import { Wrench, CalendarDays, CreditCard, Building2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const logSchema = z.object({
  type: z.string().min(2, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  provider: z.string().min(2, 'Provider name is required'),
  cost: z.coerce.number().min(0, 'Cost must be a positive number'),
});

type LogFormValues = z.infer<typeof logSchema>;

interface MaintenanceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log?: any;
}

export function MaintenanceLogModal({ isOpen, onClose, log }: MaintenanceLogModalProps) {
  const isEditing = !!log;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: log ? {
      type: log.type,
      date: log.date,
      provider: log.provider,
      cost: log.cost
    } : {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = (data: LogFormValues) => {
    toast.success(isEditing ? 'Maintenance entry updated' : 'New maintenance log added');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Maintenance Entry' : 'Add Maintenance Log'}</DialogTitle>
          <DialogDescription>
            Record vehicle repairs, routine services, and operational costs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 text-neutral-400" />
                Service Description
              </Label>
              <Input id="type" {...register('type')} placeholder="e.g. Engine Oil Change" />
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                  Service Date
                </Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost" className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                  Total Cost (₦)
                </Label>
                <Input id="cost" type="number" {...register('cost')} placeholder="0.00" />
                {errors.cost && <p className="text-xs text-red-500">{errors.cost.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider" className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                Service Provider / Workshop
              </Label>
              <Input id="provider" {...register('provider')} placeholder="e.g. Lagos Motors Service Center" />
              {errors.provider && <p className="text-xs text-red-500">{errors.provider.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

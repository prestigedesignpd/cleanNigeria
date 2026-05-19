import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarDays, Clock, Truck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface RescheduleModalProps {
  schedule: any;
  isOpen: boolean;
  onClose: () => void;
}

export function RescheduleModal({ schedule, isOpen, onClose }: RescheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>(schedule ? new Date(schedule.date) : new Date());
  const [time, setTime] = useState(schedule ? format(new Date(schedule.date), 'HH:mm') : '08:00');

  const handleReschedule = () => {
    toast.success(`Manifest ${schedule.id} rescheduled to ${date ? format(date, 'MMM dd') : ''} at ${time}`);
    onClose();
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Reschedule Manifest</DialogTitle>
          <DialogDescription>
            Adjust the collection time for <strong>{schedule.entityName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Select New Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-bold h-11 border-neutral-200 dark:border-neutral-800",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4 text-green-600" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Collection Time</label>
            <div className="relative">
               <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
               <Input 
                 type="time" 
                 value={time}
                 onChange={(e) => setTime(e.target.value)}
                 className="pl-10 h-11 font-bold border-neutral-200 dark:border-neutral-800 shadow-none"
               />
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
             <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs font-bold text-blue-800">Operational Note</p>
                   <p className="text-[10px] text-blue-600 font-medium leading-relaxed mt-0.5">
                      Rescheduling will automatically notify the assigned collector **{schedule.collector?.name || 'Staff'}** via the mobile app.
                   </p>
                </div>
             </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="font-bold">Cancel</Button>
          <Button onClick={handleReschedule} className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold px-8">
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ScheduleDetailsModalProps {
  schedule: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleDetailsModal({ schedule, isOpen, onClose }: ScheduleDetailsModalProps) {
  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 p-0 overflow-hidden">
        <div className="h-32 bg-neutral-900 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20" />
           <div className="absolute -bottom-10 left-8">
              <div className={cn(
                "h-20 w-20 rounded-2xl border-4 border-white dark:border-neutral-950 flex items-center justify-center shadow-xl",
                schedule.status === 'Completed' ? 'bg-green-600' : 'bg-blue-600'
              )}>
                 <Truck className="h-10 w-10 text-white" />
              </div>
           </div>
        </div>

        <div className="pt-14 pb-8 px-8 space-y-8">
           <div className="flex justify-between items-start">
              <div>
                 <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{schedule.entityName}</h2>
                    <Badge variant="outline" className="font-bold">{schedule.entityType}</Badge>
                 </div>
                 <p className="text-neutral-500 font-medium mt-1 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {schedule.address}
                 </p>
              </div>
              <Badge className={cn(
                 "px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]",
                 schedule.status === 'Completed' ? 'bg-green-600' : 'bg-blue-600'
              )}>
                 {schedule.status}
              </Badge>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Route Intelligence</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-500">
                          <Calendar className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-neutral-400">Scheduled Date</p>
                          <p className="text-sm font-bold">{format(new Date(schedule.date), 'MMMM dd, yyyy')}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-500">
                          <Clock className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-neutral-400">Target Time</p>
                          <p className="text-sm font-bold">{format(new Date(schedule.date), 'hh:mm a')}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Ops Assignment</h4>
                 {schedule.collector ? (
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                       <div className="flex items-center gap-3">
                          <User className="h-8 w-8 p-1.5 bg-white dark:bg-neutral-800 rounded-lg text-green-600 shadow-sm" />
                          <div>
                             <p className="text-sm font-bold">{schedule.collector.name}</p>
                             <p className="text-[10px] text-neutral-500 font-medium">Primary Collector</p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 flex items-center gap-2">
                       <AlertCircle className="h-4 w-4 text-amber-600" />
                       <span className="text-xs font-bold text-amber-700">Awaiting Assignment</span>
                    </div>
                 )}
              </div>
           </div>

           {schedule.status === 'Delayed' && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex gap-3">
                 <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                 <div>
                    <p className="text-sm font-bold text-red-700">Delay Warning</p>
                    <p className="text-xs text-red-600/80 font-medium mt-0.5">{schedule.delayReason}</p>
                 </div>
              </div>
           )}

           <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button className="flex-1 bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold h-11">
                 <Edit className="h-4 w-4 mr-2" /> Reschedule Manifest
              </Button>
              <Button variant="outline" className="flex-1 h-11 font-bold border-neutral-200 dark:border-neutral-800">
                 <ExternalLink className="h-4 w-4 mr-2" /> Route Map
              </Button>
              <Button variant="ghost" className="h-11 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold">
                 <Trash2 className="h-5 w-5" />
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

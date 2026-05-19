import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  UserPlus, 
  Truck, 
  MapPin, 
  CheckCircle2,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { mockCollectors } from '@/mock';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface AssignCollectorModalProps {
  schedule: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignCollectorModal({ schedule, isOpen, onClose }: AssignCollectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollectorId, setSelectedCollectorId] = useState<string | null>(null);

  const availableCollectors = mockCollectors.filter(col => 
    col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    const collector = mockCollectors.find(c => c.id === selectedCollectorId);
    toast.success(`Assigned ${collector?.name} to manifest ${schedule.id}`);
    onClose();
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-neutral-950 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-neutral-900 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-400" />
            Operations Assignment
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Assign an available collector and vehicle to <strong>{schedule.entityName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search staff by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500 font-medium" 
            />
          </div>

          <ScrollArea className="h-[300px] -mx-2 px-2">
            <div className="space-y-2">
              {availableCollectors.map((collector) => (
                <div 
                  key={collector.id}
                  onClick={() => setSelectedCollectorId(collector.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all cursor-pointer group",
                    selectedCollectorId === collector.id 
                      ? "border-green-600 bg-green-50 dark:bg-green-900/10" 
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white dark:border-neutral-900">
                        <AvatarImage src={collector.avatar} />
                        <AvatarFallback className="bg-neutral-200 text-neutral-600 font-bold">{collector.name?.[0] || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">{collector.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <Truck className="h-3 w-3 text-neutral-400" />
                           <span className="text-[10px] font-medium text-neutral-500">{collector.id} • ZONE: {collector.zone}</span>
                        </div>
                      </div>
                    </div>
                    {selectedCollectorId === collector.id ? (
                       <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                       <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
             <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-400">
                <span>Route Summary</span>
                <span className="text-neutral-900 dark:text-white">#{schedule.id}</span>
             </div>
             <div className="flex items-center gap-2 mt-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
                <MapPin className="h-4 w-4 text-green-600" />
                {schedule.zone} • {schedule.address}
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex gap-3 w-full">
            <Button variant="ghost" onClick={onClose} className="flex-1 font-bold">Discard</Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedCollectorId}
              className="flex-[2] bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold h-11"
            >
              <UserCheck className="h-4 w-4 mr-2" /> Complete Assignment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

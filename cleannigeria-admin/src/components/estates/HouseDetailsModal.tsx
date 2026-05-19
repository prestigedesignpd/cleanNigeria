import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { House } from '@/mock/houses.mock';
import { Home, User, Phone, MapPin, Calendar, Activity, Clock, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HouseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House | null;
}

export function HouseDetailsModal({ isOpen, onClose, house }: HouseDetailsModalProps) {
  if (!house) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">House Details</DialogTitle>
              <DialogDescription>Detailed overview of {house.id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Status</p>
              <Badge variant="outline" className={
                house.status === 'Active' 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200' 
                  : house.status === 'Inactive'
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-200'
              }>
                {house.status}
              </Badge>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Compliance</p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${
                  house.complianceScore >= 90 ? "text-green-600" : house.complianceScore >= 70 ? "text-amber-600" : "text-red-600"
                }`}>
                  {house.complianceScore}%
                </span>
                <ShieldCheck className={`h-4 w-4 ${
                  house.complianceScore >= 90 ? "text-green-600" : "text-amber-600"
                }`} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              Location Information
            </h4>
            <div className="grid grid-cols-2 gap-y-3 px-1">
              <div>
                <p className="text-xs text-neutral-500">Address</p>
                <p className="text-sm font-medium">{house.block ? `${house.block}, ` : ''}House {house.houseNumber}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Street</p>
                <p className="text-sm font-medium">{house.street}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              Occupant Details
            </h4>
            <div className="grid grid-cols-2 gap-y-3 px-1">
              <div>
                <p className="text-xs text-neutral-500">Primary Contact</p>
                <p className="text-sm font-medium">{house.occupantName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Phone Number</p>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {house.occupantPhone}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-neutral-400" />
              Service History
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Collection
                </span>
                <span className="font-medium">
                  {house.lastCollection !== 'N/A' 
                    ? formatDistanceToNow(new Date(house.lastCollection), { addSuffix: true })
                    : 'No collection yet'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registered Date
                </span>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

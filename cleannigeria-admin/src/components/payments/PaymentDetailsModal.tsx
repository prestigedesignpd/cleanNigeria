import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  CalendarDays, 
  User, 
  Mail, 
  Hash, 
  Download, 
  Undo2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Building2,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
  if (!payment) return null;

  const handleRefund = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Initiating refund via payment gateway...',
        success: 'Refund successful! Customer will be notified.',
        error: 'Refund failed. Please contact support.',
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
             <div className="h-8 w-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                <Receipt className="h-5 w-5" />
             </div>
             <DialogTitle>Transaction Details</DialogTitle>
          </div>
          <DialogDescription>
            Reference: <span className="font-mono text-neutral-900 dark:text-white">{payment.reference}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between border ${
            payment.status === 'Success' ? 'bg-green-50/50 border-green-100 text-green-700' :
            payment.status === 'Pending' ? 'bg-amber-50/50 border-amber-100 text-amber-700' :
            'bg-red-50/50 border-red-100 text-red-700'
          }`}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-tight text-xs">
               {payment.status === 'Success' && <CheckCircle2 className="h-4 w-4" />}
               {payment.status === 'Pending' && <Clock className="h-4 w-4" />}
               {payment.status === 'Failed' && <XCircle className="h-4 w-4" />}
               Payment {payment.status}
            </div>
            <div className="text-xl font-black">
               ₦{payment.amount.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Customer
                   </p>
                   <p className="text-sm font-bold">{payment.subscriberName}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> Email
                   </p>
                   <p className="text-sm font-medium truncate">{payment.customerEmail}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Account Type
                   </p>
                   <p className="text-sm font-medium">{payment.customerType}</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3" /> Method
                   </p>
                   <p className="text-sm font-bold">{payment.method}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" /> Date & Time
                   </p>
                   <p className="text-sm font-medium">{format(new Date(payment.date), 'MMM dd, yyyy • hh:mm a')}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Hash className="h-3 w-3" /> Gateway Ref
                   </p>
                   <p className="text-sm font-mono text-xs">{payment.paystackRef}</p>
                </div>
             </div>
          </div>

          <Separator />

          <div className="space-y-2">
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Payment Context</p>
             <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 flex justify-between items-center">
                <div>
                   <p className="text-sm font-bold">{payment.type}</p>
                   <p className="text-xs text-neutral-500">{payment.billingPeriod}</p>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-neutral-950 font-bold border-neutral-200">
                   #{payment.id}
                </Badge>
             </div>
          </div>

          {payment.status === 'Failed' && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2">
               <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
               <div>
                  <p className="text-xs font-bold uppercase tracking-tight">Failure Reason</p>
                  <p className="text-sm font-medium">{payment.failureReason}</p>
               </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-between sm:justify-between items-center w-full border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <Button variant="outline" size="sm" onClick={handleRefund} className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700">
             <Undo2 className="h-4 w-4 mr-2" /> Refund
          </Button>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
             <Button size="sm" className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold">
                <Download className="h-4 w-4 mr-2" /> Receipt
             </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

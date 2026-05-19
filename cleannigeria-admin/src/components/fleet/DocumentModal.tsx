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
import { FileText, CalendarDays, ShieldCheck } from 'lucide-react';

const documentSchema = z.object({
  name: z.string().min(2, 'Document name is required'),
  type: z.string().min(1, 'Please select a type'),
  expiry: z.string().min(1, 'Expiry date is required'),
  status: z.string().min(1, 'Please select a status'),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any;
}

export function DocumentModal({ isOpen, onClose, document }: DocumentModalProps) {
  const isEditing = !!document;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: document ? {
      name: document.name,
      type: document.type || 'Legal',
      expiry: document.expiry,
      status: document.status
    } : {
      status: 'Valid',
      type: 'Legal'
    }
  });

  const onSubmit = (data: DocumentFormValues) => {
    toast.success(isEditing ? 'Document updated successfully' : 'New document uploaded');
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Document Info' : 'Add Fleet Document'}</DialogTitle>
          <DialogDescription>
            Manage registration, insurance policies, and operational permits.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input id="name" {...register('name')} className="pl-9" placeholder="e.g. Comprehensive Insurance" />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Category</Label>
                <Select onValueChange={(val) => setValue('type', val)} defaultValue={document?.type || 'Legal'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legal">Legal / Reg</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Permit">Permit / License</SelectItem>
                    <SelectItem value="Maintenance">Maintenance Cert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select onValueChange={(val) => setValue('status', val)} defaultValue={document?.status || 'Valid'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Valid">Valid / Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Pending">Pending Renewal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration Date</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input id="expiry" type="date" {...register('expiry')} className="pl-9" />
              </div>
              {errors.expiry && <p className="text-xs text-red-500">{errors.expiry.message}</p>}
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center py-8">
               <ShieldCheck className="h-8 w-8 text-neutral-300 mb-2" />
               <p className="text-xs text-neutral-500 font-medium text-center px-4">
                 Drag & drop document scan (PDF, JPG) or click to upload. Max 5MB.
               </p>
               <Button type="button" variant="link" className="text-green-600 text-xs h-auto p-0 mt-2">Upload File</Button>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              {isEditing ? 'Save Changes' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

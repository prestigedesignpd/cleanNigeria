import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreatePlan, useUpdatePlan } from '@/hooks/useAdminPlans';

const planSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetType: z.enum(['ESTATE_FULL', 'ESTATE_UNIT', 'BUSINESS_STARTER', 'BUSINESS_GROWTH', 'BUSINESS_ENTERPRISE']),
  pricing: z.object({
    monthly: z.coerce.number().min(0, 'Monthly price cannot be negative'),
    yearly: z.coerce.number().min(0, 'Yearly price cannot be negative'),
  }),
  limits: z.object({
    pickupsPerCycle: z.coerce.number().min(1, 'At least 1 pickup per cycle required'),
    extraPickupPrice: z.coerce.number().min(0, 'Extra pickup price cannot be negative'),
  }),
  collectionsPerMonth: z.coerce.number().min(1, 'Total collections per month is required'),
  allowExtraPickups: z.boolean(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.coerce.number(),
  features: z.array(z.object({
    text: z.string().min(1, 'Feature text is required'),
    included: z.boolean(),
  })).min(1, 'At least one feature is required'),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: any;
}

export function PlanFormModal({ isOpen, onClose, plan }: PlanFormModalProps) {
  const { mutateAsync: createPlan, isPending: isCreating } = useCreatePlan();
  const { mutateAsync: updatePlan, isPending: isUpdating } = useUpdatePlan();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      targetType: 'ESTATE_UNIT',
      pricing: { monthly: 0, yearly: 0 },
      limits: { pickupsPerCycle: 4, extraPickupPrice: 0 },
      collectionsPerMonth: 4,
      allowExtraPickups: true,
      isActive: true,
      isFeatured: false,
      displayOrder: 1,
      features: [{ text: '', included: true }],
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  useEffect(() => {
    if (isOpen && plan) {
      reset({
        name: plan.name,
        description: plan.description,
        targetType: plan.targetType as any,
        pricing: {
          monthly: plan.pricing?.monthly ? plan.pricing.monthly / 100 : 0,
          yearly: plan.pricing?.yearly ? plan.pricing.yearly / 100 : 0,
        },
        limits: {
          pickupsPerCycle: plan.limits?.pickupsPerCycle || 4,
          extraPickupPrice: plan.limits?.extraPickupPrice ? plan.limits.extraPickupPrice / 100 : 0,
        },
        collectionsPerMonth: plan.collectionsPerMonth || 4,
        allowExtraPickups: plan.allowExtraPickups ?? true,
        isActive: plan.isActive ?? true,
        isFeatured: plan.isFeatured ?? false,
        displayOrder: plan.displayOrder || 1,
        features: plan.features?.length > 0 ? plan.features : [{ text: '', included: true }],
      });
    } else if (isOpen && !plan) {
      reset({
        name: '',
        description: '',
        targetType: 'ESTATE_UNIT',
        pricing: { monthly: 0, yearly: 0 },
        limits: { pickupsPerCycle: 4, extraPickupPrice: 0 },
        collectionsPerMonth: 4,
        allowExtraPickups: true,
        isActive: true,
        isFeatured: false,
        displayOrder: 1,
        features: [{ text: '', included: true }],
      });
    }
  }, [isOpen, plan, reset]);

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const formattedData = {
        ...data,
        pricing: {
          monthly: data.pricing.monthly * 100, // Convert NGN to kobo
          yearly: data.pricing.yearly * 100,
          currency: 'NGN'
        },
        limits: {
          ...data.limits,
          extraPickupPrice: data.limits.extraPickupPrice * 100,
        }
      };

      if (plan?._id) {
        await updatePlan({ id: plan._id, data: formattedData });
        toast.success('Subscription plan updated successfully');
      } else {
        await createPlan(formattedData);
        toast.success('Subscription plan created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</DialogTitle>
          <DialogDescription>
            {plan ? 'Update the details and pricing for this subscription tier.' : 'Add a new pricing tier for users to subscribe to.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Premium Estate" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetType">Target Audience</Label>
              <Controller
                control={control}
                name="targetType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESTATE_UNIT">Estate Unit (Individual)</SelectItem>
                      <SelectItem value="ESTATE_FULL">Full Estate</SelectItem>
                      <SelectItem value="BUSINESS_STARTER">Business Starter</SelectItem>
                      <SelectItem value="BUSINESS_GROWTH">Business Growth</SelectItem>
                      <SelectItem value="BUSINESS_ENTERPRISE">Business Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetType && <p className="text-xs text-red-500">{errors.targetType.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="A brief description for the pricing page..." />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricing.monthly">Monthly Price (NGN)</Label>
              <Input id="pricing.monthly" type="number" {...register('pricing.monthly')} />
              {errors.pricing?.monthly && <p className="text-xs text-red-500">{errors.pricing.monthly.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricing.yearly">Yearly Price (NGN)</Label>
              <Input id="pricing.yearly" type="number" {...register('pricing.yearly')} />
              {errors.pricing?.yearly && <p className="text-xs text-red-500">{errors.pricing.yearly.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collectionsPerMonth">Total Collections/Mo</Label>
              <Input id="collectionsPerMonth" type="number" {...register('collectionsPerMonth')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limits.pickupsPerCycle">Pickups Per Cycle</Label>
              <Input id="limits.pickupsPerCycle" type="number" {...register('limits.pickupsPerCycle')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limits.extraPickupPrice">Extra Pickup Fee (NGN)</Label>
              <Input id="limits.extraPickupPrice" type="number" {...register('limits.extraPickupPrice')} />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Plan Features</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => appendFeature({ text: '', included: true })}>
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
            
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input {...register(`features.${index}.text` as const)} placeholder="e.g. Unlimited Collections" className="flex-1" />
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`features.${index}.included` as const}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <Label className="text-xs whitespace-nowrap">Included</Label>
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500 h-10 w-10 shrink-0" onClick={() => removeFeature(index)} disabled={featureFields.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.features && <p className="text-xs text-red-500">{errors.features.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              <Label>Active Status</Label>
              <Controller control={control} name="isActive" render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <span className="text-sm text-neutral-500">{field.value ? 'Active' : 'Hidden'}</span>
                </div>
              )} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Featured Plan</Label>
              <Controller control={control} name="isFeatured" render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <span className="text-sm text-neutral-500">{field.value ? 'Yes' : 'No'}</span>
                </div>
              )} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" {...register('displayOrder')} className="w-24" />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white" disabled={isPending}>
              {isPending ? 'Saving...' : plan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

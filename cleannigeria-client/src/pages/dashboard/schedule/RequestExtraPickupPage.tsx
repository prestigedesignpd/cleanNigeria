import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ChevronLeft, 
  Trash2, 
  Box, 
  Layers, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  CreditCard,
  Info,
  ArrowRight
} from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/formatters'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useBilling } from '@/hooks/useBilling'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '@/services/schedule.service'

const WASTE_TYPES = [
  { id: 'general', label: 'General Waste', icon: Trash2, basePrice: 2500, description: 'Standard household garbage' },
  { id: 'recyclable', label: 'Recyclables', icon: Box, basePrice: 1500, description: 'Plastics, paper, metal cans' },
  { id: 'bulk', label: 'Bulk Items', icon: Layers, basePrice: 5000, description: 'Furniture, appliances, mattresses' },
]

const TIME_WINDOWS = [
  '08:00 AM - 12:00 PM',
  '12:00 PM - 04:00 PM',
  '04:00 PM - 08:00 PM',
]

export default function RequestExtraPickupPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { cards, isLoadingCards } = useBilling()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('general')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedWindow, setSelectedWindow] = useState(TIME_WINDOWS[0])
  const [details, setDetails] = useState('')
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)

  const selectedWasteInfo = WASTE_TYPES.find(t => t.id === selectedType)!
  const totalPrice = selectedWasteInfo.basePrice

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const requestPickupMutation = useMutation({
    mutationFn: async () => {
      let timePref: 'morning' | 'afternoon' | 'evening' = 'morning'
      if (selectedWindow.includes('12:00 PM - 04:00 PM')) {
        timePref = 'afternoon'
      } else if (selectedWindow.includes('04:00 PM - 08:00 PM')) {
        timePref = 'evening'
      }

      return scheduleService.requestExtraPickup({
        preferredDate: selectedDate,
        timePreference: timePref,
        wasteType: selectedType as any,
        specialInstructions: details,
      })
    },
    onSuccess: () => {
      toast.success('Pickup request submitted!', {
        description: `Scheduled for ${formatDate(selectedDate)} between ${selectedWindow}.`,
      })
      queryClient.invalidateQueries({ queryKey: ['saved-cards'] })
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['saved-cards'] })
      navigate(ROUTES.SCHEDULE)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit pickup request. Please try again.')
    }
  })

  const isSubmitting = requestPickupMutation.isPending
  const handleSubmit = () => {
    requestPickupMutation.mutate()
  }


  return (
    <>
      <Helmet><title>Request Extra Pickup | CleanNigeria</title></Helmet>
      
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to={ROUTES.SCHEDULE} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
              <ChevronLeft className="h-3 w-3" />
              Back to Schedule
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Request On-Demand Pickup</h1>
            <p className="text-muted-foreground">Need a collection outside your regular schedule? We've got you covered.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-2 w-8 rounded-full transition-all duration-300",
                  step >= s ? "bg-brand-600" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">What are we picking up?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {WASTE_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={cn(
                            "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center group",
                            selectedType === type.id 
                              ? "border-brand-600 bg-brand-50/50 shadow-brand-sm" 
                              : "border-slate-100 hover:border-slate-200 bg-white"
                          )}
                        >
                          <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                            selectedType === type.id ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                          )}>
                            <type.icon className="h-6 w-6" />
                          </div>
                          <p className={cn("font-bold", selectedType === type.id ? "text-slate-900" : "text-slate-500")}>{type.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{type.description}</p>
                          <p className="text-xs font-bold text-brand-600 mt-2">₦{type.basePrice.toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="details">Additional Details (Optional)</Label>
                    <Textarea 
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g. 3 large boxes, old sofa, extra kitchen waste..."
                      className="min-h-[120px] bg-slate-50/50 border-slate-200 focus-visible:ring-brand-600"
                    />
                  </div>

                  <Button onClick={handleNext} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-brand-sm">
                    Continue to Scheduling
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">When should we come?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label>Select Date</Label>
                        <Input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="h-11 bg-slate-50/50 border-slate-200"
                        />
                        <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 flex gap-3">
                          <Clock className="h-5 w-5 text-brand-600 shrink-0" />
                          <p className="text-xs text-brand-800 leading-relaxed">
                            Same-day requests must be placed before 10:00 AM.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Time Window</Label>
                        <div className="space-y-2">
                          {TIME_WINDOWS.map((window) => (
                            <button
                              key={window}
                              onClick={() => setSelectedWindow(window)}
                              className={cn(
                                "w-full p-4 rounded-xl border text-sm font-medium text-left transition-all",
                                selectedWindow === window 
                                  ? "border-brand-600 bg-brand-50/50 text-brand-700" 
                                  : "border-slate-100 hover:border-slate-200 text-slate-600"
                              )}
                            >
                              {window}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={handleBack} className="h-12 px-8">Back</Button>
                    <Button 
                      disabled={!selectedDate} 
                      onClick={handleNext} 
                      className="flex-1 h-12 bg-brand-600 hover:bg-brand-700 text-white font-bold"
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Review & Pay</h2>
                    <Card className="border-brand-200 bg-brand-50/20 shadow-none">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup Summary</p>
                            <h3 className="font-bold text-slate-900">{selectedWasteInfo.label} Collection</h3>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(selectedDate)} · {selectedWindow}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-brand-600">₦{totalPrice.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">Incl. service fee & VAT</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Label>Payment Method</Label>
                      {isLoadingCards ? (
                        <div className="p-4 rounded-xl border border-slate-100 text-sm text-muted-foreground text-center animate-pulse">Loading saved cards...</div>
                      ) : cards.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
                          <CreditCard className="h-8 w-8 text-slate-300 mx-auto" />
                          <p className="text-sm font-semibold text-slate-700">No saved cards</p>
                          <p className="text-xs text-muted-foreground">You'll be directed to Paystack's secure checkout to complete payment.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {cards.map((card, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedCardIndex(i)}
                              className={cn(
                                "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                selectedCardIndex === i
                                  ? "border-brand-600 bg-brand-50/40 shadow-sm"
                                  : "border-slate-100 hover:border-slate-200 bg-white"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                  <CreditCard className={cn("h-5 w-5", selectedCardIndex === i ? "text-brand-600" : "text-slate-400")} />
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-bold text-slate-900">{card.cardType || 'Card'} •••• {card.last4}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Expires {card.expMonth}/{card.expYear}</p>
                                </div>
                              </div>
                              {selectedCardIndex === i && (
                                <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={handleBack} className="h-12 px-8" disabled={isSubmitting}>Back</Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="flex-1 h-12 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-brand-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ₦{totalPrice.toLocaleString()} & Schedule
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Service Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Priority Dispatch</p>
                      <p className="text-[10px] text-muted-foreground">On-demand requests get a dedicated collector assigned within 2 hours.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Verified Disposal</p>
                      <p className="text-[10px] text-muted-foreground">All waste is tracked to our certified processing centers.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Flexibility</p>
                      <p className="text-[10px] text-muted-foreground">Reschedule or cancel for free up to 4 hours before your window.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Info className="h-24 w-24" />
              </div>
              <h3 className="font-bold text-lg leading-snug">Need help with bulk removal?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For major house clearances or construction waste, please contact our logistics team for a custom quote.
              </p>
              <Button variant="outline" className="w-full h-10 border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link to={ROUTES.SUPPORT}>Contact Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


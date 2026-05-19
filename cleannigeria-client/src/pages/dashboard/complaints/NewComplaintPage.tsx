import { Helmet } from 'react-helmet-async'
import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  ChevronLeft, 
  Send, 
  Info,
  X,
  ImagePlus
} from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintService } from '@/services/complaint.service'

export default function NewComplaintPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const createComplaintMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return complaintService.createComplaint(formData)
    },
    onSuccess: () => {
      toast.success('Complaint filed successfully!', {
        description: 'Our support team will review it and get back to you shortly.',
      })
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      navigate(ROUTES.SUPPORT)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit complaint. Please try again.')
    }
  })

  const handleFilesAdded = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      toast.error('Only image files are accepted.')
      return
    }
    const combined = [...selectedFiles, ...imageFiles].slice(0, 5)
    if (combined.length < selectedFiles.length + imageFiles.length) {
      toast.warning('Maximum 5 photos allowed. Some files were not added.')
    }
    setSelectedFiles(combined)

    // Generate previews for new files only
    combined.forEach((file, idx) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => {
          const updated = [...prev]
          updated[idx] = reader.result as string
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesAdded(Array.from(e.target.files || []))
    // Reset input so same file can be re-added after removal
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFilesAdded(Array.from(e.dataTransfer.files))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !subject || !description) {
      toast.error('Please fill in all required fields')
      return
    }
    if (description.trim().length < 20) {
      toast.error('Description must be at least 20 characters.')
      return
    }

    const formData = new FormData()
    formData.append('category', category.toUpperCase())
    formData.append('subject', subject)
    formData.append('description', description)
    selectedFiles.forEach(file => {
      formData.append('images', file)
    })

    createComplaintMutation.mutate(formData)
  }

  return (
    <>
      <Helmet><title>File a Complaint | CleanNigeria</title></Helmet>
      
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <div className="space-y-1">
          <Link to={ROUTES.SUPPORT} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="h-3 w-3" />
            Back to Support Hub
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">File a Complaint</h1>
          <p className="text-muted-foreground text-sm">Tell us what went wrong and we'll fix it as soon as possible.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg">Complaint Details</CardTitle>
              <CardDescription>Provide as much information as possible to help us resolve the issue.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-brand-600">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missed_pickup">Missed Pickup</SelectItem>
                    <SelectItem value="incomplete_collection">Incomplete Collection</SelectItem>
                    <SelectItem value="rude_collector">Rude Collector / Staff</SelectItem>
                    <SelectItem value="billing_issue">Billing or Payment Issue</SelectItem>
                    <SelectItem value="app_issue">App or Technical Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g. Collector missed my estate today" 
                  required 
                  className="bg-slate-50 border-slate-200 focus-visible:ring-brand-600"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the issue in detail..." 
                  className="min-h-[150px] bg-slate-50 border-slate-200 focus-visible:ring-brand-600"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">Minimum 20 characters required.</p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label>
                  Attach Photos{' '}
                  <span className="text-muted-foreground font-normal">(Optional, up to 5)</span>
                </Label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* Drop Zone */}
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-brand-300 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB each · Max 5 files</p>
                </div>

                {/* Previews */}
                <AnimatePresence>
                  {previews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-3 sm:grid-cols-5 gap-3"
                    >
                      {previews.map((src, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
                        >
                          <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-bold truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                            {selectedFiles[i]?.name}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Note:</strong> If this is an emergency regarding hazardous waste or a spill, please call our 24/7 emergency line at <strong>+234 800 CLEAN NG</strong> immediately.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold h-11 shadow-brand-sm"
              disabled={createComplaintMutation.isPending}
            >
              {createComplaintMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Filing Complaint...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint {selectedFiles.length > 0 && `(+${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''})`}
                </>
              )}
            </Button>
            <Button variant="ghost" asChild className="px-8 h-11" disabled={createComplaintMutation.isPending}>
              <Link to={ROUTES.SUPPORT}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

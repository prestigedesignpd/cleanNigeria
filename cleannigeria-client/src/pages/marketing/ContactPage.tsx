import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { contactSchema, type ContactSchema } from '@/lib/validators'
import { APP_CONFIG } from '@/config/app.config'
import { buildSeoMeta } from '@/lib/seo'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const seo = buildSeoMeta({ title: 'Contact Us' })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactSchema) => {
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent!')
    setSubmitted(true)
    reset()
  }

  return (
    <>
      <Helmet><title>{seo.title}</title></Helmet>
      <section className="gradient-mesh py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Badge className="bg-brand-50 text-brand-700 border-brand-200">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">Get In Touch</h1>
          <p className="text-lg text-muted-foreground">Our team is here to help. We typically respond within 2 business hours.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              {[
                { icon: MapPin, label: 'Office', value: APP_CONFIG.address },
                { icon: Phone, label: 'Phone', value: APP_CONFIG.phone },
                { icon: Mail, label: 'Email', value: APP_CONFIG.email },
                { icon: Clock, label: 'Hours', value: APP_CONFIG.officeHours },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2">
              {submitted ? (
                <Card><CardContent className="p-12 flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                    <CheckCircle2 className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                </CardContent></Card>
              ) : (
                <Card><CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your full name" {...register('name')} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="08012345678" {...register('phone')} />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select id="subject" {...register('subject')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">Select subject</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Press & Media</option>
                      </select>
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={5} placeholder="Tell us how we can help..." {...register('message')} />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent></Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

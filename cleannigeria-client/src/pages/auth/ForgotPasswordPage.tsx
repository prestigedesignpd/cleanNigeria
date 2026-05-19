import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/validators'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/routes'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordSchema) => {
    await authService.forgotPassword(data)
    setEmail(data.email)
    setSent(true)
    toast.success('Reset link sent!')
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            We sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
          Resend Email
        </Button>
        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Forgot Password | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11">
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    </>
  )
}

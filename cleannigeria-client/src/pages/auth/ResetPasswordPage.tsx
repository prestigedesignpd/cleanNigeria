import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/lib/validators'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/routes'

export default function ResetPasswordPage() {
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) {
      toast.error('Invalid or missing password reset token. Please request a new link.')
      return
    }
    
    try {
      await authService.resetPassword({ token, password: data.password })
      toast.success('Password reset successfully!')
      setDone(true)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password.')
    }
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold">Password Changed!</h1>
          <p className="text-muted-foreground text-sm">Your password has been reset. You can now log in.</p>
        </div>
        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white" onClick={() => navigate(ROUTES.LOGIN)}>
          Go to Login
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Reset Password | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="New password" {...register('password')} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm new password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11">
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </>
  )
}

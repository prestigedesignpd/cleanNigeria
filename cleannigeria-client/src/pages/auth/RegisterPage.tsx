import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Check } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { registerSchema, type RegisterSchema } from '@/lib/validators'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/store/authStore'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = ['bg-destructive', 'bg-orange-400', 'bg-yellow-400', 'bg-brand-500', 'bg-brand-600']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all', i <= score ? colors[score] : 'bg-muted')} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[score]}</p>
    </div>
  )
}

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })
  const password = watch('password', '')

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }

      await authService.register(payload as any)
      toast.success('Account created! Check your email for a verification code.')
      navigate(ROUTES.VERIFY_EMAIL)
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <>
      <Helmet><title>Create Account | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground text-sm">Start your free month — no credit card required</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Chukwuemeka" {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Obi" {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center justify-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">🇳🇬 +234</div>
              <Input id="phone" placeholder="08012345678" {...register('phone')} className="flex-1" />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Create a strong password" {...register('password')} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Repeat your password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="agreedToTerms" {...register('agreedToTerms')} className="mt-0.5" />
            <Label htmlFor="agreedToTerms" className="text-sm font-normal leading-relaxed">
              I agree to the{' '}
              <Link to={ROUTES.TERMS} className="text-brand-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to={ROUTES.PRIVACY} className="text-brand-600 hover:underline">Privacy Policy</Link>
            </Label>
          </div>
          {errors.agreedToTerms && <p className="text-xs text-destructive">{errors.agreedToTerms.message}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11">
            {isSubmitting ? 'Creating account...' : 'Create Free Account'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    const res = await authService.googleLogin(credentialResponse.credential)
                    setAuth(res.user, res.tokens)
                    toast.success(`Welcome, ${res.user.firstName}!`)
                    navigate(ROUTES.DASHBOARD)
                  } catch {
                    toast.error('Google signup failed. Please try again.')
                  }
                }
              }}
              onError={() => {
                toast.error('Google signup failed.')
              }}
            />
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </>
  )
}

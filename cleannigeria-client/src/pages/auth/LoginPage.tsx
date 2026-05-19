import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginSchema, type LoginSchema } from '@/lib/validators'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/routes'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await authService.login(data)
      setAuth(res.user, res.tokens)
      toast.success(`Welcome back, ${res.user.fullName.split(' ')[0]}!`)
      navigate(ROUTES.DASHBOARD)
    } catch {
      toast.error('Invalid email or password. Try again.')
    }
  }


  return (
    <>
      <Helmet><title>Log In | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Log in to manage your waste collection</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Your password" autoComplete="current-password" {...register('password')} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">Remember me for 30 days</Label>
          </div>

          <div className="space-y-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative">
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
                      toast.success(`Welcome back, ${res.user.firstName}!`)
                      navigate(ROUTES.DASHBOARD)
                    } catch {
                      toast.error('Google login failed. Please try again.')
                    }
                  }
                }}
                onError={() => {
                  toast.error('Google login failed.')
                }}
              />
            </div>


          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-brand-600 hover:underline font-medium">Create one free</Link>
        </p>
      </div>
    </>
  )
}

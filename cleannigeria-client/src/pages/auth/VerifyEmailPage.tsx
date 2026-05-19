import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle2 } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(59)
  const [error, setError] = useState('')
  const inputs = useRef<HTMLInputElement[]>([])
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const timer = setInterval(() => setResendTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (val: string, i: number) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    setError('')
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the full 6-digit code'); return }
    setIsVerifying(true)
    try {
      const res = await authService.verifyOtp({ code, type: 'email' })
      setAuth(res.user, res.tokens)
      toast.success('Email verified!')
      navigate(ROUTES.ONBOARDING)
    } catch {
      setError('Invalid code. Please try again.')
    } finally { setIsVerifying(false) }
  }

  return (
    <>
      <Helmet><title>Verify Email | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Mail className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-muted-foreground text-sm max-w-xs">We sent a 6-digit verification code to your email address</p>
        </div>

        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { if (el) inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                'h-12 w-12 rounded-lg border-2 text-center text-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-600',
                error ? 'border-destructive animate-shake' : digit ? 'border-brand-500' : 'border-border'
              )}
            />
          ))}
        </div>

        {error && <p className="text-center text-xs text-destructive">{error}</p>}

        <Button onClick={handleVerify} disabled={isVerifying} className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11">
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {resendTimer > 0 ? (
            <span>Resend code in 0:{resendTimer.toString().padStart(2, '0')}</span>
          ) : (
            <button className="text-brand-600 hover:underline font-medium" onClick={() => setResendTimer(59)}>
              Resend Code
            </button>
          )}
        </div>
      </div>
    </>
  )
}

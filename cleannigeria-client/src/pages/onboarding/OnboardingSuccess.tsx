import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactConfetti from 'react-confetti'
import { CheckCircle2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'

export default function OnboardingSuccess() {
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Helmet><title>Welcome to CleanNigeria! | Setup Complete</title></Helmet>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} colors={['#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#ffffff']} />}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center gap-6">
        <div className="animate-bounce-slow">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-600 shadow-brand-lg">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold">You're All Set! 🎉</h1>
          <p className="text-muted-foreground text-lg">Welcome to CleanNigeria. Your first collection is scheduled. Sit back and relax!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-brand-600 hover:bg-brand-700 text-white px-8" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Go to Dashboard
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share with a Friend
          </Button>
        </div>
      </div>
    </>
  )
}

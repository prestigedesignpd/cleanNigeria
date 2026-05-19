import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function AnnouncementBar() {
  const { announcementDismissed, dismissAnnouncement } = useUiStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!announcementDismissed) setVisible(true)
  }, [announcementDismissed])

  if (!visible || announcementDismissed) return null

  return (
    <div className="relative z-50 flex items-center justify-center gap-3 bg-brand-600 px-4 py-2.5 text-sm text-white">
      <Megaphone className="h-4 w-4 shrink-0" />
      <p className="text-center font-medium">
        🎉 Get your <strong>first month free</strong> when you register a new estate!{' '}
        <Link to="/pricing" className="underline underline-offset-2 hover:text-brand-200 font-semibold">
          See Plans →
        </Link>
      </p>
      <button
        onClick={() => { setVisible(false); dismissAnnouncement() }}
        className="absolute right-3 rounded-md p-1 hover:bg-brand-700 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

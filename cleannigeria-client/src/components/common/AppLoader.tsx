import { Truck } from 'lucide-react'

export function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-brand-lg animate-pulse-slow">
          <Truck className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-brand-400/50 animate-ping" />
      </div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-brand-600 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground font-medium">Loading CleanNigeria...</p>
    </div>
  )
}

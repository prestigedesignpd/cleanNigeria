import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo.png'

interface AppLogoProps {
  variant?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg'
  linkTo?: string
}

export function AppLogo({ variant = 'default', size = 'md', linkTo = '/' }: AppLogoProps) {
  const sizes = {
    sm: 'h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12',
    md: 'h-14 w-14 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16',
    lg: 'h-20 w-20 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24'
  }
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }

  const content = (
    <div className="flex items-center gap-2">
      <img
        src={logoImg}
        alt="CleanNigeria"
        className={cn('shrink-0 object-contain', sizes[size])}
      />
      <span
        className={cn(
          'font-bold tracking-tight',
          textSizes[size],
          variant === 'white' ? 'text-white' : 'text-foreground'
        )}
      >
        CleanNigeria
      </span>
    </div>
  )

  return (
    <Link to={linkTo} className="inline-flex hover:opacity-90 transition-opacity">
      {content}
    </Link>
  )
}

import { APP_CONFIG } from '@/config/app.config'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export function buildSeoTitle(pageTitle?: string): string {
  if (!pageTitle) return APP_CONFIG.name
  return `${pageTitle} | ${APP_CONFIG.name}`
}

export function buildSeoMeta(opts: SeoOptions = {}) {
  return {
    title: buildSeoTitle(opts.title),
    description: opts.description || APP_CONFIG.description,
    image: opts.image || `${APP_CONFIG.url}/og-image.png`,
    url: opts.url || APP_CONFIG.url,
    type: opts.type || 'website',
  }
}

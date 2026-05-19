import { Request } from 'express'

export interface PaginationOptions {
  page: number
  limit: number
  skip: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Parse pagination params from query string with safe defaults
 */
export const parsePagination = (query: Request['query']): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * Build pagination metadata for response
 */
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const pages = Math.ceil(total / limit)
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  }
}

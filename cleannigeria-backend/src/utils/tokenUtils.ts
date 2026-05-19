import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'
import { ApiError } from './ApiError'

export interface TokenPayload extends JwtPayload {
  id: string
  email: string
  role: string
  type: 'access' | 'refresh' | 'admin_access' | 'admin_refresh'
}

const getSecret = (type: TokenPayload['type']): string => {
  const secrets: Record<TokenPayload['type'], string | undefined> = {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    admin_access: process.env.JWT_ADMIN_ACCESS_SECRET,
    admin_refresh: process.env.JWT_ADMIN_REFRESH_SECRET,
  }
  const secret = secrets[type]
  if (!secret) throw new Error(`JWT secret not configured for type: ${type}`)
  return secret
}

const getExpiry = (type: TokenPayload['type']): string => {
  const expiries: Record<TokenPayload['type'], string | undefined> = {
    access: process.env.JWT_ACCESS_EXPIRES || '15m',
    refresh: process.env.JWT_REFRESH_EXPIRES || '7d',
    admin_access: process.env.JWT_ADMIN_ACCESS_EXPIRES || '8h',
    admin_refresh: process.env.JWT_ADMIN_REFRESH_EXPIRES || '1d',
  }
  return expiries[type] || '15m'
}

export const signToken = (
  payload: Omit<TokenPayload, 'iat' | 'exp'>,
  options?: SignOptions
): string => {
  return jwt.sign(payload, getSecret(payload.type), {
    expiresIn: getExpiry(payload.type),
    ...options,
  } as SignOptions)
}

export const verifyToken = (token: string, type: TokenPayload['type']): TokenPayload => {
  try {
    const decoded = jwt.verify(token, getSecret(type)) as TokenPayload
    return decoded
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Token has expired', 'TOKEN_EXPIRED')
    }
    throw ApiError.unauthorized('Invalid token', 'TOKEN_INVALID')
  }
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload
  } catch {
    return null
  }
}

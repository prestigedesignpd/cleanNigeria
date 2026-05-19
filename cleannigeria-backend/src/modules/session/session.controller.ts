import { Request, Response } from 'express'
import { Session, RefreshToken } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'

export const getSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) throw ApiError.unauthorized()

  // Find all active sessions for this user
  const sessions = await Session.find({ userId, isActive: true })
    .sort({ lastActiveAt: -1 })
    .select('-refreshToken') // Do not expose the refresh token to the client

  return ApiResponse.success(res, sessions)
})

export const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const { sessionId } = req.params
  
  if (!userId) throw ApiError.unauthorized()

  const session = await Session.findOne({ _id: sessionId, userId })
  if (!session) {
    throw ApiError.notFound('Session not found or already inactive')
  }

  // Mark session inactive
  session.isActive = false
  await session.save()

  // Also revoke the underlying refresh token
  await RefreshToken.findOneAndUpdate(
    { token: session.refreshToken },
    { isRevoked: true }
  )

  return ApiResponse.success(res, null, 'Session revoked successfully')
})

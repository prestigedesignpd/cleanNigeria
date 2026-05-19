import { Request, Response } from 'express'
import { User } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { generateAuthTokens } from './auth.controller'
import { OAuth2Client } from 'google-auth-library'
import { generateReferralCode } from '@utils/referralUtils'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { idToken } = req.body

  if (!idToken) {
    throw ApiError.badRequest('ID Token is required')
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw ApiError.badRequest('Invalid token payload')
    }

    const { email, given_name, family_name, picture } = payload

    if (!email) {
      throw ApiError.badRequest('Email not provided by Google')
    }

    // Find or create user
    let user = await User.findOne({ email })

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        phone: `google_${Date.now()}`, // Placeholder to satisfy schema requirements
        isEmailVerified: true, // Google emails are verified
        avatar: picture,
        referralCode: await generateReferralCode(),
      })
    }

    // Generate tokens
    const tokens = await generateAuthTokens(user)

    ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.accountType,
          avatar: user.avatar,
        },
        ...tokens,
      },
      'Login successful'
    )
  } catch (error: any) {
    console.error('DEBUG: Google Auth failed:', error)
    throw ApiError.badRequest(`Google Auth failed: ${error.message}`)
  }
})

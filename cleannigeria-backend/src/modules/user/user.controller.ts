import { Request, Response } from 'express'
import { User } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { CloudinaryService } from '@services/Cloudinary.service'

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).populate('estateId').populate('businessId')
  if (!user) throw ApiError.notFound('User not found')
  return ApiResponse.success(res, user)
})

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!user) throw ApiError.notFound('User not found')
  return ApiResponse.success(res, user, 'Profile updated successfully')
})

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest('No image file uploaded')
  }

  const user = await User.findById(req.user?.id)
  if (!user) throw ApiError.notFound('User not found')

  // Upload to Cloudinary
  const result = await CloudinaryService.uploadAvatar(req.file.buffer, user._id.toString())

  // Delete old avatar if exists and it's not the same publicId (unlikely with our naming convention but good practice)
  if (user.avatar?.publicId && user.avatar.publicId !== result.publicId) {
    await CloudinaryService.deleteImage(user.avatar.publicId)
  }

  // Update user
  user.avatar = result
  await user.save()

  return ApiResponse.success(res, user.avatar, 'Avatar updated successfully')
})

export const addPushToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body
  const user = await User.findById(req.user?.id)
  if (!user) throw ApiError.notFound('User not found')

  if (!user.pushTokens.includes(token)) {
    user.pushTokens.push(token)
    await user.save()
  }

  return ApiResponse.success(res, null, 'Push token added')
})

export const removePushToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body
  await User.findByIdAndUpdate(req.user?.id, {
    $pull: { pushTokens: token },
  })
  return ApiResponse.success(res, null, 'Push token removed')
})

export const completeOnboarding = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id)
  if (!user) throw ApiError.notFound('User not found')

  // Perform onboarding logic (attach to estate/business, etc.)
  // This is a stub for now — logic depends on the specific onboarding flow
  user.onboardingCompleted = true
  user.onboardingStep = 5 // Final step
  await user.save()

  return ApiResponse.success(res, user, 'Onboarding completed')
})

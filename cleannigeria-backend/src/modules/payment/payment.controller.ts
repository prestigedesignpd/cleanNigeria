import { Request, Response } from 'express'
import { Payment, User } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id

  const payments = await Payment.find({ userId }).sort({ createdAt: -1 })

  ApiResponse.success(res, payments, 'Payments fetched successfully')
})

export const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { id } = req.params

  const payment = await Payment.findOne({ _id: id, userId })

  if (!payment) {
    throw ApiError.notFound('Payment not found')
  }

  ApiResponse.success(res, payment, 'Payment fetched successfully')
})

export const getCards = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const user = await User.findById(userId).select('savedCards')
  if (!user) throw ApiError.notFound('User not found')

  ApiResponse.success(res, user.savedCards || [], 'Saved cards fetched successfully')
})

export const removeCard = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { last4 } = req.params

  const user = await User.findById(userId)
  if (!user) throw ApiError.notFound('User not found')

  user.savedCards = user.savedCards.filter(card => card.last4 !== last4)
  await user.save()

  ApiResponse.success(res, null, 'Card removed successfully')
})

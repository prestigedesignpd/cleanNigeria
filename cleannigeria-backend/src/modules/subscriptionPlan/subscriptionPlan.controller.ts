import { Request, Response } from 'express'
import { SubscriptionPlan } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'

export const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  const filters: any = { isActive: true }
  if (req.query.targetType) filters.targetType = req.query.targetType
  
  // Admins see all plans
  if (req.admin) delete filters.isActive

  const plans = await SubscriptionPlan.find(filters).sort({ displayOrder: 1, name: 1 })
  return ApiResponse.success(res, plans)
})

export const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findById(req.params.id)
  if (!plan) throw ApiError.notFound('Plan not found')
  return ApiResponse.success(res, plan)
})

export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.create({
    ...req.body,
    createdBy: req.admin?.id,
  })
  return ApiResponse.created(res, plan, 'Subscription plan created')
})

export const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!plan) throw ApiError.notFound('Plan not found')
  return ApiResponse.success(res, plan, 'Subscription plan updated')
})

export const deletePlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, { isActive: false })
  if (!plan) throw ApiError.notFound('Plan not found')
  return ApiResponse.success(res, null, 'Plan deactivated')
})

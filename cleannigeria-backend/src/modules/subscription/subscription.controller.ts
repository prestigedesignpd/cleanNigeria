import { Request, Response } from 'express'
import { Subscription, SubscriptionPlan, Payment, User } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { PaystackService } from '@services/Paystack.service'
import { generatePaymentReference } from '@utils/referralUtils'
import { PaymentStatus, PaymentType, SubscriptionStatus, BillingCycle } from '@constants/status.constants'

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const { planId, billingCycle, estateId, businessId, unitId } = req.body
  const userId = req.user?.id

  const plan = await SubscriptionPlan.findById(planId)
  if (!plan) throw ApiError.notFound('Plan not found')

  const amount = billingCycle === 'MONTHLY' ? plan.pricing.monthly : plan.pricing.yearly
  const reference = generatePaymentReference()

  // Initialize Paystack transaction
  const paystackData = await PaystackService.initializeTransaction(
    req.user?.email || '',
    amount,
    {
      userId,
      planId,
      billingCycle,
      estateId,
      businessId,
      unitId,
      reference,
      type: 'SUBSCRIPTION',
    }
  )

  // Create pending payment record
  await Payment.create({
    reference,
    userId,
    amount,
    type: PaymentType.SUBSCRIPTION,
    status: PaymentStatus.PENDING,
    metadata: { planId, billingCycle, estateId, businessId, unitId },
  })

  return ApiResponse.success(res, {
    authorization_url: paystackData.authorization_url,
    reference: paystackData.reference, // Paystack reference
    internal_reference: reference,
  }, 'Checkout initialized')
})

export const verifySubscription = catchAsync(async (req: Request, res: Response) => {
  const { reference } = req.body // Paystack reference

  const paystackData = await PaystackService.verifyTransaction(reference)
  if (paystackData.status !== 'success') {
    throw ApiError.badRequest('Payment verification failed or pending')
  }

  const { metadata } = paystackData
  const internalRef = metadata.reference

  const payment = await Payment.findOne({ reference: internalRef })
  if (!payment) throw ApiError.notFound('Payment record not found')

  if (payment.status === PaymentStatus.SUCCESS) {
    return ApiResponse.success(res, null, 'Subscription already activated')
  }

  // Update payment
  payment.status = PaymentStatus.SUCCESS
  payment.paystackReference = reference
  payment.paidAt = new Date()
  payment.paymentMethod = {
    type: paystackData.channel,
    last4: paystackData.authorization.last4,
    bank: paystackData.authorization.bank,
    authorizationCode: paystackData.authorization.authorization_code,
  }
  await payment.save()

  // Calculate period
  const start = new Date()
  const end = new Date()
  if (metadata.billingCycle === 'MONTHLY') end.setMonth(end.getMonth() + 1)
  else end.setFullYear(end.getFullYear() + 1)

  // Create/Update subscription
  const subscription = await Subscription.create({
    userId: metadata.userId,
    planId: metadata.planId,
    estateId: metadata.estateId,
    businessId: metadata.businessId,
    unitId: metadata.unitId,
    status: SubscriptionStatus.ACTIVE,
    billingCycle: metadata.billingCycle,
    currentPeriodStart: start,
    currentPeriodEnd: end,
    paystackAuthorizationCode: paystackData.authorization.authorization_code,
  })

  // Update user status
  await User.findByIdAndUpdate(metadata.userId, { onboardingCompleted: true })

  return ApiResponse.success(res, subscription, 'Subscription activated successfully')
})

export const getMySubscriptions = catchAsync(async (req: Request, res: Response) => {
  const subscriptions = await Subscription.find({ userId: req.user?.id })
    .populate('planId')
    .sort({ createdAt: -1 })
  return ApiResponse.success(res, subscriptions)
})

export const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
  const subscription = await Subscription.findById(req.params.id).populate('planId')
  if (!subscription) throw ApiError.notFound('Subscription not found')
  
  // Security check: only owner or admin can view
  if (subscription.userId.toString() !== req.user?.id && !req.admin) {
    throw ApiError.forbidden()
  }

  return ApiResponse.success(res, subscription)
})

export const changePlan = catchAsync(async (req: Request, res: Response) => {
  const { planId, billingCycle } = req.body
  const userId = req.user?.id

  const plan = await SubscriptionPlan.findById(planId)
  if (!plan) throw ApiError.notFound('Plan not found')

  const subscription = await Subscription.findOne({ userId, status: SubscriptionStatus.ACTIVE })
  if (!subscription) throw ApiError.notFound('Active subscription not found')

  const upperCycle = billingCycle?.toUpperCase() as BillingCycle
  
  // Calculate new end date if cycle changed
  if (upperCycle && upperCycle !== subscription.billingCycle) {
    const end = new Date(subscription.currentPeriodStart)
    if (upperCycle === 'MONTHLY') end.setMonth(end.getMonth() + 1)
    else end.setFullYear(end.getFullYear() + 1)
    subscription.currentPeriodEnd = end
  }

  subscription.planId = planId
  if (upperCycle) subscription.billingCycle = upperCycle
  await subscription.save()

  // Return populated
  const updatedSub = await Subscription.findById(subscription._id).populate('planId')
  return ApiResponse.success(res, updatedSub, 'Subscription plan updated successfully')
})

export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { reason } = req.body
  const userId = req.user?.id

  const subscription = await Subscription.findOne({ userId, status: SubscriptionStatus.ACTIVE })
  if (!subscription) throw ApiError.notFound('Active subscription not found')

  subscription.status = SubscriptionStatus.CANCELLED
  subscription.cancellationReason = reason
  subscription.cancelledAt = new Date()
  await subscription.save()

  return ApiResponse.success(res, null, 'Subscription cancelled successfully')
})

export const reactivateSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id

  const subscription = await Subscription.findOne({ userId, status: SubscriptionStatus.CANCELLED }).sort({ createdAt: -1 })
  if (!subscription) throw ApiError.notFound('No cancelled subscription found to reactivate')

  subscription.status = SubscriptionStatus.ACTIVE
  subscription.cancellationReason = undefined
  subscription.cancelledAt = undefined
  await subscription.save()

  // Return populated
  const updatedSub = await Subscription.findById(subscription._id).populate('planId')
  return ApiResponse.success(res, updatedSub, 'Subscription reactivated successfully')
})

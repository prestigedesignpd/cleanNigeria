import { Request, Response } from 'express'
import { PickupSchedule, CollectionLog, Collector, User, Subscription, Zone, Estate, Business } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { PickupStatus, CollectorStatus, PickupType, TimeWindow, WasteType } from '@constants/status.constants'

export const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters = { userId: req.user?.id }

  const schedules = await PickupSchedule.find(filters)
    .populate('collectorId', 'firstName lastName phone vehicle')
    .populate('zoneId', 'name')
    .sort({ scheduledDate: 1 })
    .skip(skip)
    .limit(limit)

  const total = await PickupSchedule.countDocuments(filters)

  return ApiResponse.paginated(res, schedules, buildPaginationMeta(total, page, limit))
})

export const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const schedule = await PickupSchedule.findById(req.params.id)
    .populate('collectorId', 'firstName lastName phone vehicle rating totalCollections currentZoneId')
    .populate('zoneId', 'name')
  if (!schedule) throw ApiError.notFound('Schedule not found')
  return ApiResponse.success(res, schedule)
})

export const getCollectorTasks = catchAsync(async (req: Request, res: Response) => {
  const { collectorId } = req.params
  const schedules = await PickupSchedule.find({
    collectorId,
    status: { $in: [PickupStatus.SCHEDULED, PickupStatus.IN_PROGRESS] },
  }).populate('userId', 'firstName lastName phone address')

  return ApiResponse.success(res, schedules)
})

export const updatePickupStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, lat, lng } = req.body

  const schedule = await PickupSchedule.findById(id)
  if (!schedule) throw ApiError.notFound('Schedule not found')

  schedule.status = status
  await schedule.save()

  // If completed, create a log
  if (status === PickupStatus.COMPLETED) {
    await CollectionLog.create({
      scheduleId: schedule._id,
      collectorId: schedule.collectorId,
      completedAt: new Date(),
      location: { type: 'Point', coordinates: [lng, lat] },
      ...req.body.logDetails, // weight, wasteTypes, photos
    })
    
    // Increment collector count
    await Collector.findByIdAndUpdate(schedule.collectorId, { $inc: { totalCollections: 1 } })
  }

  return ApiResponse.success(res, schedule, 'Pickup status updated')
})

export const generateSchedules = catchAsync(async (req: Request, res: Response) => {
  // This would typically be a cron job, but here's the logic
  // 1. Find active subscriptions
  // 2. Based on zone collection days, generate entries in PickupSchedule for the next week
  // ...
  return ApiResponse.success(res, null, 'Schedule generation triggered')
})

export const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const { status, zoneId } = req.query
  const filters: any = {}
  if (status && status !== 'All') {
    filters.status = status
  }
  if (zoneId) {
    filters.zoneId = zoneId
  }

  const schedules = await PickupSchedule.find(filters)
    .populate('userId', 'firstName lastName address')
    .populate('zoneId', 'name')
    .populate('collectorId', 'firstName lastName avatar vehicle')
    .populate('estateId', 'name address')
    .populate('businessId', 'name address')
    .sort({ scheduledDate: 1 })

  const formatted = schedules.map(sch => {
    const user = sch.userId as any
    const collector = sch.collectorId as any
    const zone = sch.zoneId as any
    const estate = sch.estateId as any
    const business = sch.businessId as any

    let entityName = 'Individual Unit'
    let entityType = 'Residential'
    let address = 'N/A'

    if (estate) {
      entityName = estate.name
      entityType = 'Estate'
      address = estate.address || 'N/A'
    } else if (business) {
      entityName = business.name
      entityType = 'Business'
      address = business.address || 'N/A'
    } else if (user) {
      entityName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
      entityType = 'Individual'
      address = user.address || 'N/A'
    }

    // Determine priority
    let priority = 'Normal'
    if (entityType === 'Business') {
      priority = 'High'
    } else if (entityType === 'Estate') {
      priority = 'Urgent'
    }

    return {
      id: sch._id,
      entityName,
      entityType,
      zone: zone?.name || 'Unassigned Zone',
      address,
      collector: collector ? {
        name: `${collector.firstName || ''} ${collector.lastName || ''}`.trim(),
        avatar: collector.avatar || '',
      } : null,
      vehicleId: collector?.vehicle?.plateNumber || collector?.vehicle || null,
      date: sch.scheduledDate,
      priority,
      status: sch.status === PickupStatus.SCHEDULED ? 'Scheduled' : 
              sch.status === PickupStatus.IN_PROGRESS ? 'In Progress' :
              sch.status === PickupStatus.COMPLETED ? 'Completed' :
              sch.status === PickupStatus.MISSED ? 'Delayed' : sch.status,
    }
  })

  return ApiResponse.success(res, formatted)
})

export const requestExtraPickup = catchAsync(async (req: Request, res: Response) => {
  const { preferredDate, timePreference, wasteType, specialInstructions } = req.body
  const userId = req.user?.id

  // 1. Find user's active subscription
  let subscription = await Subscription.findOne({ userId, status: 'ACTIVE' })
  if (!subscription) {
    subscription = await Subscription.findOne({ userId })
  }

  // 2. Determine estate/business or user's own defaults to get zoneId
  const user = await User.findById(userId)
  if (!user) throw ApiError.notFound('User not found')

  let zoneId = null
  let estateId = user.estateId
  let businessId = user.businessId

  if (estateId) {
    const estate = await Estate.findById(estateId)
    if (estate) zoneId = estate.zoneId
  } else if (businessId) {
    const business = await Business.findById(businessId)
    if (business) zoneId = business.zoneId
  }

  if (!zoneId) {
    const defaultZone = await Zone.findOne({ status: 'ACTIVE' })
    if (defaultZone) {
      zoneId = defaultZone._id
    } else {
      const anyZone = await Zone.findOne()
      if (anyZone) zoneId = anyZone._id
    }
  }

  if (!zoneId) {
    throw ApiError.badRequest('No zone is configured for waste collection. Please contact support.')
  }

  // Find or create subscription placeholder
  let subscriptionId = subscription?._id
  if (!subscriptionId) {
    const { SubscriptionPlan } = require('@models/index')
    let defaultPlan = await SubscriptionPlan.findOne()
    if (!defaultPlan) {
      defaultPlan = await SubscriptionPlan.create({
        name: 'Standard Plan',
        description: 'Standard plan',
        targetType: 'ESTATE_UNIT',
        billingCycle: 'MONTHLY',
        price: 5000,
        pickupsPerCycle: 4,
        features: [{ text: 'Weekly collections', included: true }],
        allowExtraPickups: true,
      })
    }
    const newSub = await Subscription.create({
      userId,
      planId: defaultPlan?._id,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    subscriptionId = newSub._id
  }

  // Map inputs to uppercase enums
  const mappedTimeWindow = (timePreference || 'morning').toUpperCase() as TimeWindow
  const mappedWasteType = (wasteType || 'general').toUpperCase() as WasteType

  // Create the extra pickup schedule
  const pickup = await PickupSchedule.create({
    userId,
    subscriptionId,
    zoneId,
    estateId,
    businessId,
    scheduledDate: new Date(preferredDate),
    timeWindow: mappedTimeWindow,
    status: PickupStatus.SCHEDULED,
    type: PickupType.EXTRA,
    adminNote: specialInstructions || '',
    createdBy: 'USER',
  })

  return ApiResponse.success(res, pickup, 'Extra pickup request submitted successfully')
})



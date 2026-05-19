import { Request, Response } from 'express'
import { Collector, CollectorZoneAssignment, Zone } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { generateEmployeeId } from '@utils/referralUtils'
import { hashPassword } from '@utils/hashUtils'
import { CloudinaryService } from '@services/Cloudinary.service'
import { emitToUser, broadcast } from '@config/socket.config'
import { SOCKET_EVENTS } from '@constants/events.constants'

export const getAllCollectors = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status
  if (req.query.zoneId) filters.currentZoneId = req.query.zoneId
  if (req.query.search) {
    filters.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { employeeId: { $regex: req.query.search, $options: 'i' } },
    ]
  }

  const collectors = await Collector.find(filters)
    .populate('currentZoneId', 'name')
    .skip(skip)
    .limit(limit)

  const total = await Collector.countDocuments(filters)

  return ApiResponse.paginated(res, collectors, buildPaginationMeta(total, page, limit))
})

export const getCollectorById = catchAsync(async (req: Request, res: Response) => {
  const collector = await Collector.findById(req.params.id).populate('currentZoneId')
  if (!collector) throw ApiError.notFound('Collector not found')
  return ApiResponse.success(res, collector)
})

export const createCollector = catchAsync(async (req: Request, res: Response) => {
  // Generate employee ID based on count
  const count = await Collector.countDocuments()
  const employeeId = generateEmployeeId(count + 1)

  // Default password is phone number
  const hashedPassword = await hashPassword(req.body.phone)

  const collector = await Collector.create({
    ...req.body,
    employeeId,
    password: hashedPassword,
    createdBy: req.admin?.id,
  })

  return ApiResponse.created(res, collector, 'Collector onboarded successfully')
})

export const updateCollector = catchAsync(async (req: Request, res: Response) => {
  const collector = await Collector.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!collector) throw ApiError.notFound('Collector not found')
  return ApiResponse.success(res, collector, 'Collector updated')
})

export const assignZone = catchAsync(async (req: Request, res: Response) => {
  const { zoneId } = req.body
  const collectorId = req.params.id

  const zone = await Zone.findById(zoneId)
  if (!zone) throw ApiError.notFound('Zone not found')

  // Revoke previous assignments
  await CollectorZoneAssignment.updateMany(
    { collectorId, isActive: true },
    { isActive: false, revokedAt: new Date() }
  )

  // Create new assignment
  const assignment = await CollectorZoneAssignment.create({
    collectorId,
    zoneId,
    assignedBy: req.admin?.id,
  })

  // Update collector's current zone
  await Collector.findByIdAndUpdate(collectorId, { currentZoneId: zoneId })

  return ApiResponse.success(res, assignment, 'Collector assigned to zone')
})


export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('No avatar file uploaded')
    const collector = await Collector.findById(req.params.id)
    if (!collector) throw ApiError.notFound('Collector not found')

    const result = await CloudinaryService.uploadBuffer(req.file.buffer, 'collectors/avatars')
    
    if (collector.avatar?.publicId) {
        await CloudinaryService.deleteImage(collector.avatar.publicId)
    }

    collector.avatar = result
    await collector.save()

    return ApiResponse.success(res, collector.avatar, 'Collector avatar updated')
})

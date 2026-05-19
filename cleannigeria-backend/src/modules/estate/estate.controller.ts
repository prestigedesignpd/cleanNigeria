import { Request, Response } from 'express'
import { Estate, EstateUnit } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { CloudinaryService } from '@services/Cloudinary.service'

export const getAllEstates = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.state) filters['address.state'] = req.query.state
  if (req.query.zoneId) filters.zoneId = req.query.zoneId
  if (req.query.status) filters.status = req.query.status
  if (req.query.search) {
    filters.name = { $regex: req.query.search, $options: 'i' }
  }

  const estates = await Estate.find(filters)
    .populate('zoneId', 'name')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)

  const total = await Estate.countDocuments(filters)

  return ApiResponse.paginated(res, estates, buildPaginationMeta(total, page, limit))
})

export const getEstateById = catchAsync(async (req: Request, res: Response) => {
  const estate = await Estate.findById(req.params.id).populate('zoneId')
  if (!estate) throw ApiError.notFound('Estate not found')
  return ApiResponse.success(res, estate)
})

export const createEstate = catchAsync(async (req: Request, res: Response) => {
  const estate = await Estate.create({
    ...req.body,
    createdBy: req.admin?.id,
  })
  return ApiResponse.created(res, estate, 'Estate created successfully')
})

export const updateEstate = catchAsync(async (req: Request, res: Response) => {
  const estate = await Estate.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!estate) throw ApiError.notFound('Estate not found')
  return ApiResponse.success(res, estate, 'Estate updated successfully')
})

export const updateLogo = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No logo file uploaded')
  const estate = await Estate.findById(req.params.id)
  if (!estate) throw ApiError.notFound('Estate not found')

  const result = await CloudinaryService.uploadBuffer(req.file.buffer, 'estates/logos')
  
  if (estate.logo?.publicId) {
    await CloudinaryService.deleteImage(estate.logo.publicId)
  }

  estate.logo = result
  await estate.save()

  return ApiResponse.success(res, estate.logo, 'Estate logo updated')
})

// Unit management
export const getUnits = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const units = await EstateUnit.find({ estateId: req.params.id })
    .skip(skip)
    .limit(limit)
  
  const total = await EstateUnit.countDocuments({ estateId: req.params.id })
  return ApiResponse.paginated(res, units, buildPaginationMeta(total, page, limit))
})

export const addUnit = catchAsync(async (req: Request, res: Response) => {
  const unit = await EstateUnit.create({
    ...req.body,
    estateId: req.params.id,
  })
  
  // Increment total units count in Estate model
  await Estate.findByIdAndUpdate(req.params.id, { $inc: { totalUnits: 1 } })
  
  return ApiResponse.created(res, unit, 'Unit added to estate')
})

export const bulkAddUnits = catchAsync(async (req: Request, res: Response) => {
  const { units } = req.body // Array of { unitNumber, ... }
  if (!Array.isArray(units)) throw ApiError.badRequest('Units must be an array')

  const unitsWithEstateId = units.map(u => ({ ...u, estateId: req.params.id }))
  const result = await EstateUnit.insertMany(unitsWithEstateId)
  
  await Estate.findByIdAndUpdate(req.params.id, { $inc: { totalUnits: result.length } })
  
  return ApiResponse.created(res, result, `${result.length} units added to estate`)
})

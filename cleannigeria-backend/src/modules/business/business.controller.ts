import { Request, Response } from 'express'
import { Business } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { CloudinaryService } from '@services/Cloudinary.service'

export const getAllBusinesses = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.state) filters['address.state'] = req.query.state
  if (req.query.zoneId) filters.zoneId = req.query.zoneId
  if (req.query.status) filters.status = req.query.status
  if (req.query.businessType) filters.businessType = req.query.businessType
  if (req.query.search) {
    filters.name = { $regex: req.query.search, $options: 'i' }
  }

  const businesses = await Business.find(filters)
    .populate('zoneId', 'name')
    .populate('ownerId', 'firstName lastName email')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)

  const total = await Business.countDocuments(filters)

  return ApiResponse.paginated(res, businesses, buildPaginationMeta(total, page, limit))
})

export const getBusinessById = catchAsync(async (req: Request, res: Response) => {
  const business = await Business.findById(req.params.id)
    .populate('zoneId')
    .populate('ownerId')
  if (!business) throw ApiError.notFound('Business not found')
  return ApiResponse.success(res, business)
})

export const getMyBusinesses = catchAsync(async (req: Request, res: Response) => {
    const businesses = await Business.find({ ownerId: req.user?.id }).populate('zoneId', 'name')
    return ApiResponse.success(res, businesses)
})

export const createBusiness = catchAsync(async (req: Request, res: Response) => {
  const business = await Business.create({
    ...req.body,
    createdBy: req.admin?.id || undefined,
  })
  return ApiResponse.created(res, business, 'Business created successfully')
})

export const updateBusiness = catchAsync(async (req: Request, res: Response) => {
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!business) throw ApiError.notFound('Business not found')
  return ApiResponse.success(res, business, 'Business updated successfully')
})

export const uploadDocument = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No document file uploaded')
  const { type } = req.body
  const business = await Business.findById(req.params.id)
  if (!business) throw ApiError.notFound('Business not found')

  const result = await CloudinaryService.uploadBuffer(req.file.buffer, 'businesses/documents')
  
  business.documents.push({
    type,
    url: result.url,
    publicId: result.publicId,
    uploadedAt: new Date(),
  })
  
  await business.save()

  return ApiResponse.success(res, business.documents, 'Document uploaded successfully')
})

export const updateLogo = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No logo file uploaded')
  const business = await Business.findById(req.params.id)
  if (!business) throw ApiError.notFound('Business not found')

  const result = await CloudinaryService.uploadBuffer(req.file.buffer, 'businesses/logos')
  
  if (business.logo?.publicId) {
    await CloudinaryService.deleteImage(business.logo.publicId)
  }

  business.logo = result
  await business.save()

  return ApiResponse.success(res, business.logo, 'Business logo updated')
})

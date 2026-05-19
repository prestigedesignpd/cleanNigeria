import { Request, Response } from 'express'
import { Zone } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'

export const getAllZones = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.state) filters.state = req.query.state
  if (req.query.status) filters.status = req.query.status

  const zones = await Zone.find(filters)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)

  const total = await Zone.countDocuments(filters)

  return ApiResponse.paginated(res, zones, buildPaginationMeta(total, page, limit))
})

export const getZoneById = catchAsync(async (req: Request, res: Response) => {
  const zone = await Zone.findById(req.params.id)
  if (!zone) throw ApiError.notFound('Zone not found')
  return ApiResponse.success(res, zone)
})

export const createZone = catchAsync(async (req: Request, res: Response) => {
  const zone = await Zone.create({
    ...req.body,
    createdBy: req.admin?.id,
  })
  return ApiResponse.created(res, zone, 'Zone created successfully')
})

export const updateZone = catchAsync(async (req: Request, res: Response) => {
  const zone = await Zone.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
  if (!zone) throw ApiError.notFound('Zone not found')
  return ApiResponse.success(res, zone, 'Zone updated successfully')
})

export const checkCoverage = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng } = req.body

  // Find zone that contains this point
  const zone = await Zone.findOne({
    boundary: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat], // GeoJSON uses [lng, lat]
        },
      },
    },
    status: 'ACTIVE',
  })

  if (!zone) {
    return ApiResponse.success(res, { covered: false }, 'Location not currently covered')
  }

  return ApiResponse.success(res, {
    covered: true,
    zone: {
      id: zone._id,
      name: zone.name,
      collectionDays: zone.collectionDays,
      timeWindows: zone.timeWindows,
    },
  }, 'Location covered by CleanNigeria')
})

import { Request, Response } from 'express'
import { Cms } from '@models/Cms.model'
import { catchAsync } from '@utils/catchAsync'
import { ApiResponse } from '@utils/ApiResponse'
import { ApiError } from '@utils/ApiError'
import { CloudinaryService } from '@services/Cloudinary.service'
import axios from 'axios'

export const getContent = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params
  const cms = await Cms.findOne({ key })
  if (!cms) return ApiResponse.success(res, null)
  return ApiResponse.success(res, cms.content)
})

export const updateContent = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params
  const { content } = req.body

  const cms = await Cms.findOneAndUpdate(
    { key },
    { $set: { content } },
    { new: true, upsert: true }
  )

  return ApiResponse.success(res, cms.content, 'Content updated successfully')
})

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  let fileBuffer: Buffer

  // 1. Device File Upload
  if (req.file) {
    fileBuffer = req.file.buffer
  } 
  // 2. URL-based Image Upload
  else if (req.body.url) {
    if (req.body.url.startsWith('data:')) {
      try {
        const matches = req.body.url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
          throw new Error('Invalid Data URI format')
        }
        fileBuffer = Buffer.from(matches[2], 'base64')
      } catch (err) {
        throw ApiError.badRequest('Invalid Data URI format provided')
      }
    } else {
      try {
        const response = await axios.get(req.body.url, { responseType: 'arraybuffer' })
        fileBuffer = Buffer.from(response.data, 'binary')
      } catch (err) {
        throw ApiError.badRequest('Failed to retrieve image from the provided URL')
      }
    }
  } else {
    throw ApiError.badRequest('No image file or URL was provided')
  }

  // 3. Upload to Cloudinary under the 'cms' folder
  const result = await CloudinaryService.uploadBuffer(fileBuffer, 'cms')

  return ApiResponse.success(res, { url: result.url }, 'Image uploaded successfully')
})

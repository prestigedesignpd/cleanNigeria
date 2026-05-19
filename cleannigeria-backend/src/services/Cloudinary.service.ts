import { v2 as cloudinary } from 'cloudinary'
import { logger } from '@utils/logger'
import { ApiError } from '@utils/ApiError'
import streamifier from 'streamifier'

export interface UploadResponse {
  url: string
  publicId: string
}

export class CloudinaryService {
  /**
   * Upload a buffer to Cloudinary
   */
  static async uploadBuffer(
    buffer: Buffer,
    folder: string,
    options: any = {}
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `cleannigeria/${folder}`,
          resource_type: 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload error:', error)
            
            // Check if it's a network/DNS error or offline condition
            const isNetworkError = 
              error.code === 'ENOTFOUND' || 
              error.code === 'EAI_AGAIN' || 
              error.message?.includes('ENOTFOUND') || 
              error.message?.includes('getaddrinfo') ||
              error.message?.includes('timeout')
            
            if (isNetworkError) {
              logger.warn('Cloudinary unreachable. Falling back to self-contained Base64 Data URI.')
              // Guess simple MIME type from buffer headers if possible
              let mimeType = 'image/jpeg'
              if (buffer.length > 4) {
                const hex = buffer.toString('hex', 0, 4)
                if (hex.startsWith('89504e47')) mimeType = 'image/png'
                else if (hex.startsWith('47494638')) mimeType = 'image/gif'
                else if (hex.startsWith('52494646') && buffer.toString('hex', 8, 12) === '57454250') mimeType = 'image/webp'
              }
              const base64 = buffer.toString('base64')
              return resolve({
                url: `data:${mimeType};base64,${base64}`,
                publicId: `offline_mock_${Date.now()}`
              })
            }
            
            return reject(ApiError.internal('Failed to upload image'))
          }
          if (!result) {
            return reject(ApiError.internal('Cloudinary upload returned no result'))
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        }
      )

      streamifier.createReadStream(buffer).pipe(uploadStream)
    })
  }

  /**
   * Delete an image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result.result === 'ok'
    } catch (error) {
      logger.error('Cloudinary delete error:', error)
      return false
    }
  }

  /**
   * Specific helper for profile avatars
   */
  static async uploadAvatar(buffer: Buffer, userId: string): Promise<UploadResponse> {
    return this.uploadBuffer(buffer, 'avatars', {
      public_id: `avatar_${userId}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
      ],
    })
  }

  /**
   * Specific helper for business documents
   */
  static async uploadDocument(buffer: Buffer, businessId: string, docType: string): Promise<UploadResponse> {
    return this.uploadBuffer(buffer, 'documents', {
      public_id: `${docType}_${businessId}_${Date.now()}`,
    })
  }

  /**
   * Specific helper for collection proof photos
   */
  static async uploadCollectionPhoto(buffer: Buffer, collectorId: string): Promise<UploadResponse> {
    return this.uploadBuffer(buffer, 'collections', {
      transformation: [{ width: 800, quality: 'auto' }],
    })
  }
}

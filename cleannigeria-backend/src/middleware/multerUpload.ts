import multer from 'multer'
import { ApiError } from '@utils/ApiError'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']

import { logger } from '@utils/logger'

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = file.originalname.split('.').pop()?.toLowerCase() || ''
  const isImageMimetype = file.mimetype.startsWith('image/')
  const isImageExtension = ['jpg', 'jpeg', 'png', 'webp', 'jfif', 'svg', 'gif', 'bmp', 'ico', 'avif', 'heic'].includes(ext)

  logger.info(`Upload check - originalname: ${file.originalname}, mimetype: ${file.mimetype}, ext: ${ext}`);

  if (isImageMimetype || isImageExtension) {
    cb(null, true)
  } else {
    cb(ApiError.badRequest('Please select a valid image file.'))
  }
}

const documentFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = file.originalname.split('.').pop()?.toLowerCase() || ''
  const isDocMimetype = file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/') || file.mimetype.startsWith('text/')
  const isDocExtension = ['pdf', 'jpg', 'jpeg', 'png', 'txt', 'csv', 'doc', 'docx'].includes(ext)

  if (isDocMimetype || isDocExtension) {
    cb(null, true)
  } else {
    cb(ApiError.badRequest('Only document and image files are allowed.'))
  }
}

// Memory storage — we stream to Cloudinary directly
const memoryStorage = multer.memoryStorage()

export const uploadSingleImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('image')

export const uploadSingleDocument = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('document')

export const uploadMultipleImages = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
}).array('images', 5)

export const uploadMultipleDocuments = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
}).array('documents', 10)

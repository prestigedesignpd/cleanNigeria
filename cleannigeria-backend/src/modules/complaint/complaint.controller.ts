import { Request, Response } from 'express'
import { Complaint, ComplaintMessage } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { generateTicketId } from '@utils/referralUtils'
import { CloudinaryService } from '@services/Cloudinary.service'
import { ComplaintStatus } from '@constants/status.constants'

export const getAllComplaints = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status
  if (req.query.category) filters.category = req.query.category
  if (req.query.priority) filters.priority = req.query.priority
  if (req.query.userId) filters.userId = req.query.userId
  if (req.admin) {
    // Admin can see all, or filter by assignedTo
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo
  } else {
    // Client only sees their own
    filters.userId = req.user?.id
  }

  const complaints = await Complaint.find(filters)
    .populate('userId', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Complaint.countDocuments(filters)

  return ApiResponse.paginated(res, complaints, buildPaginationMeta(total, page, limit))
})

export const getComplaintById = catchAsync(async (req: Request, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('userId', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName')
    .populate('relatedScheduleId')

  if (!complaint) throw ApiError.notFound('Complaint not found')

  // Security check
  if (!req.admin && complaint.userId._id.toString() !== req.user?.id) {
    throw ApiError.forbidden()
  }

  // Get messages
  const messages = await ComplaintMessage.find({ complaintId: complaint._id })
    .populate('senderId', 'firstName lastName')
    .sort({ createdAt: 1 })

  return ApiResponse.success(res, { complaint, messages })
})

export const createComplaint = catchAsync(async (req: Request, res: Response) => {
  const ticketId = generateTicketId()
  
  // Handle photos
  const photos = []
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const result = await CloudinaryService.uploadBuffer(file.buffer, 'complaints')
      photos.push(result)
    }
  }

  const complaint = await Complaint.create({
    ...req.body,
    ticketId,
    userId: req.user?.id,
    photos,
    status: ComplaintStatus.OPEN,
  })

  return ApiResponse.created(res, complaint, 'Complaint submitted successfully. Ticket ID: ' + ticketId)
})

export const addMessage = catchAsync(async (req: Request, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
  if (!complaint) throw ApiError.notFound('Complaint not found')

  // Security check
  if (!req.admin && complaint.userId.toString() !== req.user?.id) {
    throw ApiError.forbidden()
  }

  const photos = []
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const result = await CloudinaryService.uploadBuffer(file.buffer, 'complaints/messages')
      photos.push(result)
    }
  }

  const message = await ComplaintMessage.create({
    complaintId: complaint._id,
    senderId: req.user?.id || req.admin?.id,
    senderModel: req.admin ? 'AdminUser' : 'User',
    message: req.body.message,
    photos,
  })

  // Re-open if closed and user replied? Or just keep current status
  if (complaint.status === ComplaintStatus.RESOLVED) {
    complaint.status = ComplaintStatus.OPEN
    await complaint.save()
  }

  return ApiResponse.created(res, message, 'Message sent')
})

export const resolveComplaint = catchAsync(async (req: Request, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
  if (!complaint) throw ApiError.notFound('Complaint not found')

  complaint.status = ComplaintStatus.RESOLVED
  complaint.resolutionNote = req.body.resolutionNote
  complaint.resolvedAt = new Date()
  await complaint.save()

  return ApiResponse.success(res, complaint, 'Complaint marked as resolved')
})

export const rateResolution = catchAsync(async (req: Request, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
  if (!complaint || complaint.userId.toString() !== req.user?.id) {
    throw ApiError.notFound('Complaint not found')
  }

  if (complaint.status !== ComplaintStatus.RESOLVED) {
    throw ApiError.badRequest('Can only rate resolved complaints')
  }

  complaint.satisfactionRating = req.body.rating
  complaint.status = ComplaintStatus.CLOSED
  complaint.closedAt = new Date()
  await complaint.save()

  return ApiResponse.success(res, null, 'Thank you for your feedback')
})

import { Request, Response } from 'express'
import { Notification } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'

export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters = { userId: req.user?.id }

  const notifications = await Notification.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Notification.countDocuments(filters)
  const unreadCount = await Notification.countDocuments({ ...filters, isRead: false })

  return ApiResponse.paginated(res, notifications, {
    ...buildPaginationMeta(total, page, limit),
    unreadCount,
  })
})

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
    readAt: new Date(),
  })
  return ApiResponse.success(res, null, 'Marked as read')
})

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { userId: req.user?.id, isRead: false },
    { isRead: true, readAt: new Date() }
  )
  return ApiResponse.success(res, null, 'All marked as read')
})

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user?.id })
    return ApiResponse.success(res, null, 'Notification deleted')
})

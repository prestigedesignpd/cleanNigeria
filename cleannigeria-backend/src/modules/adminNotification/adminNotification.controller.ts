import { Request, Response } from 'express'
import { AdminNotification } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiResponse } from '@utils/ApiResponse'
import { NotificationService } from '@services/Notification.service'

export const getAdminNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await AdminNotification.find().sort({ createdAt: -1 })
  return ApiResponse.success(res, notifications)
})

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notif = await AdminNotification.findByIdAndUpdate(
    req.params.id,
    { isRead: true, readAt: new Date() },
    { new: true }
  )
  return ApiResponse.success(res, notif, 'Notification marked as read')
})

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await AdminNotification.updateMany({ isRead: false }, { isRead: true, readAt: new Date() })
  return ApiResponse.success(res, null, 'All notifications marked as read')
})

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  await AdminNotification.findByIdAndDelete(req.params.id)
  return ApiResponse.success(res, null, 'Notification deleted successfully')
})

export const createBroadcast = catchAsync(async (req: Request, res: Response) => {
  const { title, message, targetRoles, targetZones } = req.body

  // 1. Send the live broadcast to the targeted standard users
  await NotificationService.broadcast({
    title,
    message,
    targetRoles,
    targetZones,
  })

  // 2. Save it in the AdminNotification database so it appears in the admin communication inbox
  const adminNotif = await AdminNotification.create({
    title: title || 'Global Broadcast',
    message,
    type: 'System',
    isRead: false,
  })

  return ApiResponse.success(res, adminNotif, 'Global broadcast successfully transmitted and logged')
})

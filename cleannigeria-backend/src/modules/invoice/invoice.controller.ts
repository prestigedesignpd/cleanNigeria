import { Request, Response } from 'express'
import { Invoice } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'

export const getInvoices = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id

  const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 })

  ApiResponse.success(res, invoices, 'Invoices fetched successfully')
})

export const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { id } = req.params

  const invoice = await Invoice.findOne({ _id: id, userId })

  if (!invoice) {
    throw ApiError.notFound('Invoice not found')
  }

  ApiResponse.success(res, invoice, 'Invoice fetched successfully')
})

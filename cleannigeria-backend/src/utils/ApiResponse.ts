import { Response } from 'express'

interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export class ApiResponse {
  static success(res: Response, data: unknown, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  static created(res: Response, data: unknown, message = 'Created successfully') {
    return this.success(res, data, message, 201)
  }

  static paginated(
    res: Response,
    data: unknown[],
    meta: PaginationMeta,
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    })
  }

  static noContent(res: Response) {
    return res.status(204).send()
  }

  static error(res: Response, message: string, statusCode = 400, errors?: unknown) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors ?? null,
      timestamp: new Date().toISOString(),
    })
  }
}

import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '@utils/ApiResponse'

export const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  ApiResponse.error(res, `Route ${_req.method} ${_req.originalUrl} not found`, 404)
}

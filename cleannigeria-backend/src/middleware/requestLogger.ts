import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { logger } from '@utils/logger'
import fs from 'fs'
import path from 'path'

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Morgan HTTP access log stream → Winston
const morganStream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

// Skip logging for health checks
const skip = (req: Request): boolean => {
  return req.url === '/health'
}

export const requestLogger = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream: morganStream, skip }
)

// Attach request ID and start time to each request
export const requestMetadata = (req: Request, _res: Response, next: NextFunction): void => {
  ;(req as Request & { startTime?: number }).startTime = Date.now()
  next()
}

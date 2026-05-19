export class ApiError extends Error {
  statusCode: number
  isOperational: boolean
  errors?: unknown
  code?: string

  constructor(message: string, statusCode = 400, errors?: unknown, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.isOperational = true
    this.errors = errors
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string, errors?: unknown, code?: string) {
    return new ApiError(message, 400, errors, code)
  }

  static unauthorized(message = 'Unauthorized', code?: string) {
    return new ApiError(message, 401, undefined, code)
  }

  static forbidden(message = 'Access denied', code?: string) {
    return new ApiError(message, 403, undefined, code)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404)
  }

  static conflict(message: string, code?: string) {
    return new ApiError(message, 409, undefined, code)
  }

  static tooManyRequests(message = 'Too many requests, please try again later.') {
    return new ApiError(message, 429)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(message, 500)
  }

  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new ApiError(message, 503)
  }
}

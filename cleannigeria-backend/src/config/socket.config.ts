import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import { corsOptions } from './cors.config'
import { verifyToken } from '@utils/tokenUtils'
import { logger } from '@utils/logger'
import { SOCKET_EVENTS } from '@constants/events.constants'

let io: SocketServer | null = null

export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: corsOptions.origin,
      credentials: true,
    },
    pingTimeout: 60000,
  })

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]
    if (!token) return next(new Error('Authentication required'))

    try {
      const decoded = verifyToken(token, 'access')
      ;(socket as Socket & { userId?: string; userRole?: string }).userId = decoded.id
      ;(socket as Socket & { userId?: string; userRole?: string }).userRole = decoded.role
      next()
    } catch {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    const typedSocket = socket as Socket & { userId?: string }
    const userId = typedSocket.userId

    if (userId) {
      socket.join(`user:${userId}`)
      logger.debug(`Socket connected: user:${userId}`)
    }

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (room: string) => {
      socket.join(room)
    })

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (room: string) => {
      socket.leave(room)
    })

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: user:${userId}`)
    })
  })

  logger.info('✅ Socket.io initialized')
  return io
}

export const getSocketServer = (): SocketServer => {
  if (!io) throw new Error('Socket.io not initialized. Call initializeSocket() first.')
  return io
}

/**
 * Emit an event to a specific user's room
 */
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  getSocketServer().to(`user:${userId}`).emit(event, data)
}

/**
 * Broadcast an event to all connected clients
 */
export const broadcast = (event: string, data: unknown): void => {
  getSocketServer().emit(event, data)
}

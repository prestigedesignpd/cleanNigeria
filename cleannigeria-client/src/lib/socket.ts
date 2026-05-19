import { io, type Socket } from 'socket.io-client'
import { env } from '@/config/env'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.socketUrl, {
      autoConnect: false,
      transports: ['websocket'],
    })
  }
  return socket
}

export function connectSocket(token: string) {
  const s = getSocket()
  s.auth = { token }
  s.connect()
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

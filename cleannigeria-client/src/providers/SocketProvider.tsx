import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { connectSocket, disconnectSocket } from '@/lib/socket'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (isAuthenticated && token && !connectedRef.current) {
      connectSocket(token)
      connectedRef.current = true
    }
    if (!isAuthenticated && connectedRef.current) {
      disconnectSocket()
      connectedRef.current = false
    }
    return () => {
      // cleanup on unmount
    }
  }, [isAuthenticated, token])

  return <>{children}</>
}

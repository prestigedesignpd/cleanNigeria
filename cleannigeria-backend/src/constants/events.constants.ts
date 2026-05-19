// Socket.io event name constants
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Collector tracking
  COLLECTOR_LOCATION_UPDATE: 'collector:location-update',
  COLLECTOR_ONLINE: 'collector:online',
  COLLECTOR_OFFLINE: 'collector:offline',

  // Pickup
  PICKUP_STATUS_UPDATE: 'pickup:status-update',
  PICKUP_COLLECTOR_ASSIGNED: 'pickup:collector-assigned',

  // Complaint
  COMPLAINT_NEW_MESSAGE: 'complaint:new-message',
  COMPLAINT_STATUS_CHANGE: 'complaint:status-change',

  // Admin
  ADMIN_BROADCAST: 'admin:broadcast',
  ADMIN_ALERT: 'admin:alert',
} as const

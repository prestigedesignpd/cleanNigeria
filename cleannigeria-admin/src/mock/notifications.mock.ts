export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Alert' | 'Payment' | 'System' | 'Message';
  read: boolean;
  date: string;
}

export interface Broadcast {
  id: string;
  subject: string;
  message: string;
  target: 'All' | 'Estates' | 'Businesses' | 'Collectors';
  sentBy: string;
  sentAt: string;
  reach: number;
  status: 'Sent' | 'Failed';
}

export const mockNotifications: Notification[] = [
  {
    id: "NOT-001",
    title: "High Priority Complaint",
    message: "A critical billing issue was reported by Sarah Smith.",
    type: "Alert",
    read: false,
    date: "2026-05-13T08:20:00Z",
  },
  {
    id: "NOT-002",
    title: "Large Payment Received",
    message: "₦1,250,000 received from Victoria Garden City.",
    type: "Payment",
    read: true,
    date: "2026-05-13T09:05:00Z",
  },
  {
    id: "NOT-003",
    title: "System Maintenance",
    message: "Scheduled database backup completed successfully.",
    type: "System",
    read: true,
    date: "2026-05-13T02:00:00Z",
  },
  {
    id: "NOT-004",
    title: "New Service Request",
    message: "Chevron Staff Quarters requested additional bins for Block C.",
    type: "Message",
    read: false,
    date: "2026-05-14T10:15:00Z",
  }
];

export const mockBroadcasts: Broadcast[] = [
  {
    id: "BRD-001",
    subject: "Holiday Schedule Update",
    message: "Please note that collection times will be delayed by 2 hours on the upcoming public holiday.",
    target: "All",
    sentBy: "Admin Operations",
    sentAt: "2026-05-10T14:00:00Z",
    reach: 1240,
    status: "Sent"
  },
  {
    id: "BRD-002",
    subject: "New Billing Guidelines",
    message: "Updated billing procedures for commercial businesses are now active. Please review the updated policy.",
    target: "Businesses",
    sentBy: "Finance Dept",
    sentAt: "2026-05-08T09:30:00Z",
    reach: 450,
    status: "Sent"
  }
];

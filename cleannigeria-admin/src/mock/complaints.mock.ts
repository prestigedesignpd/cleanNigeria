export interface Complaint {
  id: string;
  customerName: string;
  userId: string;
  category: 'Missed Pickup' | 'Overfill' | 'Billing Issue' | 'Staff Conduct' | 'Service Request' | 'App Issue';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string | null;
  dateFiled: string;
  slaDeadline: string;
  slaStatus: 'safe' | 'warning' | 'breached';
  thread: {
    id: string;
    sender: string;
    role: 'user' | 'admin';
    message: string;
    timestamp: string;
  }[];
  internalNotes?: {
    id: string;
    author: string;
    note: string;
    timestamp: string;
  }[];
}

export const mockComplaints: Complaint[] = [
  {
    id: "TKT-1042",
    customerName: "Adeoluwa Bamidele",
    userId: "USR-001",
    category: "Missed Pickup",
    subject: "Trash not collected on Tuesday",
    description: "The garbage collectors didn't show up at my street (Victoria Island) on Tuesday morning as scheduled. My bin is overflowing and starting to smell.",
    priority: "High",
    status: "Open",
    assignedTo: null,
    dateFiled: "2026-05-12T09:30:00Z",
    slaDeadline: "2026-05-13T09:30:00Z",
    slaStatus: "breached",
    thread: [
      {
        id: "MSG-001",
        sender: "Adeoluwa Bamidele",
        role: "user",
        message: "The garbage collectors didn't show up at my street (Victoria Island) on Tuesday morning as scheduled. My bin is overflowing and starting to smell.",
        timestamp: "2026-05-12T09:30:00Z"
      }
    ],
    internalNotes: [
      {
        id: "NOTE-001",
        author: "System Admin",
        note: "Checking truck GPS logs for Victoria Island Zone 4.",
        timestamp: "2026-05-12T10:15:00Z"
      }
    ]
  },
  {
    id: "TKT-1043",
    customerName: "Sarah Smith",
    userId: "USR-002",
    category: "Billing Issue",
    subject: "Charged twice for monthly subscription",
    description: "I noticed two separate deductions for the month of May on my bank statement. Please investigate and refund the duplicate charge.",
    priority: "Critical",
    status: "In Progress",
    assignedTo: "John Finance",
    dateFiled: "2026-05-14T08:15:00Z",
    slaDeadline: "2026-05-14T12:15:00Z",
    slaStatus: "warning",
    thread: [
      {
        id: "MSG-002",
        sender: "Sarah Smith",
        role: "user",
        message: "I noticed two separate deductions for the month of May on my bank statement.",
        timestamp: "2026-05-14T08:15:00Z"
      },
      {
        id: "MSG-003",
        sender: "John Finance",
        role: "admin",
        message: "Hello Sarah, we've received your complaint and are looking into our payment gateway logs. We will get back to you shortly.",
        timestamp: "2026-05-14T10:00:00Z"
      }
    ]
  },
  {
    id: "TKT-1044",
    customerName: "Shoprite Surulere",
    userId: "BIZ-001",
    category: "Service Request",
    subject: "Need extra bins for supermarket",
    description: "We are expecting higher footfall this weekend and will need 2 additional large bins delivered by Friday.",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Support Agent",
    dateFiled: "2026-05-10T14:00:00Z",
    slaDeadline: "2026-05-12T14:00:00Z",
    slaStatus: "safe",
    thread: [
      {
        id: "MSG-004",
        sender: "Shoprite Surulere",
        role: "user",
        message: "We are expecting higher footfall this weekend and will need 2 additional large bins delivered by Friday.",
        timestamp: "2026-05-10T14:00:00Z"
      },
      {
        id: "MSG-005",
        sender: "Support Agent",
        role: "admin",
        message: "Request approved. Two extra bins will be delivered tomorrow morning.",
        timestamp: "2026-05-10T16:30:00Z"
      },
      {
        id: "MSG-006",
        sender: "Shoprite Surulere",
        role: "user",
        message: "Thank you, they have been delivered.",
        timestamp: "2026-05-11T09:00:00Z"
      }
    ]
  },
  {
    id: "TKT-1045",
    customerName: "Michael Okeke",
    userId: "USR-005",
    category: "Overfill",
    subject: "Commercial bin in my street is leaking",
    description: "The communal bin at the corner of Herbert Macaulay is overflowing and leaking liquids onto the sidewalk.",
    priority: "High",
    status: "Open",
    assignedTo: null,
    dateFiled: "2026-05-14T11:45:00Z",
    slaDeadline: "2026-05-15T11:45:00Z",
    slaStatus: "safe",
    thread: [
      {
        id: "MSG-007",
        sender: "Michael Okeke",
        role: "user",
        message: "The communal bin at the corner of Herbert Macaulay is overflowing and leaking liquids onto the sidewalk.",
        timestamp: "2026-05-14T11:45:00Z"
      }
    ]
  },
  {
    id: "TKT-1046",
    customerName: "Chevron Staff Quarters",
    userId: "EST-012",
    category: "Staff Conduct",
    subject: "Collector was rude to security staff",
    description: "Our security team reported that the driver of truck TRK-004 was very unprofessional during the pickup this morning.",
    priority: "Medium",
    status: "Open",
    assignedTo: "Operations Manager",
    dateFiled: "2026-05-14T14:20:00Z",
    slaDeadline: "2026-05-16T14:20:00Z",
    slaStatus: "safe",
    thread: [
      {
        id: "MSG-008",
        sender: "Chevron Staff Quarters",
        role: "user",
        message: "Our security team reported that the driver of truck TRK-004 was very unprofessional during the pickup this morning.",
        timestamp: "2026-05-14T14:20:00Z"
      }
    ]
  }
];

export const complaintStats = {
  totalTickets: 124,
  resolvedToday: 18,
  avgResponseTime: "45m",
  criticalOpen: 3,
  slaCompliance: 94.2
};

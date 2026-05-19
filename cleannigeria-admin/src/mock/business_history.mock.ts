export interface BusinessBilling {
  id: string;
  businessId: string;
  period: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  invoiceUrl: string;
}

export interface BusinessCollectionLog {
  id: string;
  businessId: string;
  date: string;
  collectorName: string;
  status: 'Completed' | 'Partial' | 'Missed';
  volumeCollected: number; // in Tons
  remarks?: string;
}

export const mockBusinessBillings: BusinessBilling[] = [
  {
    id: "INV-BIZ-2024-001",
    businessId: "BIZ-001",
    period: "May 2024",
    amount: 150000,
    status: 'Paid',
    dueDate: "2024-05-05T00:00:00Z",
    paidDate: "2024-05-03T11:20:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-BIZ-2024-002",
    businessId: "BIZ-001",
    period: "April 2024",
    amount: 150000,
    status: 'Paid',
    dueDate: "2024-04-05T00:00:00Z",
    paidDate: "2024-04-04T09:45:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-BIZ-2024-003",
    businessId: "BIZ-001",
    period: "March 2024",
    amount: 150000,
    status: 'Paid',
    dueDate: "2024-03-05T00:00:00Z",
    paidDate: "2024-03-05T16:30:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-BIZ-2024-004",
    businessId: "BIZ-002",
    period: "Year 2024",
    amount: 600000,
    status: 'Paid',
    dueDate: "2024-01-15T00:00:00Z",
    paidDate: "2024-01-12T14:00:00Z",
    invoiceUrl: "#"
  }
];

export const mockBusinessCollections: BusinessCollectionLog[] = [
  {
    id: "COL-BIZ-001",
    businessId: "BIZ-001",
    date: "2024-05-14T08:00:00Z",
    collectorName: "Sani Abacha",
    status: 'Completed',
    volumeCollected: 0.8,
    remarks: "Daily pickup completed."
  },
  {
    id: "COL-BIZ-002",
    businessId: "BIZ-001",
    date: "2024-05-13T08:15:00Z",
    collectorName: "Sani Abacha",
    status: 'Completed',
    volumeCollected: 0.75,
  },
  {
    id: "COL-BIZ-003",
    businessId: "BIZ-001",
    date: "2024-05-12T08:30:00Z",
    collectorName: "Sani Abacha",
    status: 'Completed',
    volumeCollected: 0.9,
  },
  {
    id: "COL-BIZ-004",
    businessId: "BIZ-002",
    date: "2024-05-10T10:00:00Z",
    collectorName: "Ibrahim Badamasi",
    status: 'Completed',
    volumeCollected: 2.5,
    remarks: "Weekly bulk collection."
  }
];

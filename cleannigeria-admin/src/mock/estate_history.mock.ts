export interface EstateBilling {
  id: string;
  estateId: string;
  period: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  invoiceUrl: string;
}

export interface EstateCollectionLog {
  id: string;
  estateId: string;
  date: string;
  collectorName: string;
  status: 'Completed' | 'Missed' | 'Partial';
  volumeCollected: number; // in Tons
  remarks?: string;
}

export const mockEstateBillings: EstateBilling[] = [
  {
    id: "INV-2024-001",
    estateId: "EST-001",
    period: "May 2024",
    amount: 1250000,
    status: 'Paid',
    dueDate: "2024-05-10T00:00:00Z",
    paidDate: "2024-05-08T14:30:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-2024-002",
    estateId: "EST-001",
    period: "April 2024",
    amount: 1250000,
    status: 'Paid',
    dueDate: "2024-04-10T00:00:00Z",
    paidDate: "2024-04-09T10:15:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-2024-003",
    estateId: "EST-001",
    period: "March 2024",
    amount: 1100000,
    status: 'Paid',
    dueDate: "2024-03-10T00:00:00Z",
    paidDate: "2024-03-11T16:00:00Z",
    invoiceUrl: "#"
  },
  {
    id: "INV-2024-004",
    estateId: "EST-002",
    period: "May 2024",
    amount: 3000000,
    status: 'Pending',
    dueDate: "2024-05-30T00:00:00Z",
    invoiceUrl: "#"
  }
];

export const mockEstateCollections: EstateCollectionLog[] = [
  {
    id: "COL-LOG-001",
    estateId: "EST-001",
    date: "2024-05-13T09:00:00Z",
    collectorName: "Musa Ibrahim",
    status: 'Completed',
    volumeCollected: 4.5,
    remarks: "All blocks cleared."
  },
  {
    id: "COL-LOG-002",
    estateId: "EST-001",
    date: "2024-05-10T09:30:00Z",
    collectorName: "Ade Bakare",
    status: 'Completed',
    volumeCollected: 4.2,
  },
  {
    id: "COL-LOG-003",
    estateId: "EST-001",
    date: "2024-05-07T08:45:00Z",
    collectorName: "Musa Ibrahim",
    status: 'Partial',
    volumeCollected: 2.1,
    remarks: "Block D inaccessible due to road work."
  },
  {
    id: "COL-LOG-004",
    estateId: "EST-001",
    date: "2024-05-03T10:00:00Z",
    collectorName: "Ade Bakare",
    status: 'Missed',
    volumeCollected: 0,
    remarks: "Truck breakdown."
  }
];

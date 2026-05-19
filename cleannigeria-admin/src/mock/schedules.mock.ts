export const mockSchedules = [
  {
    id: "SCH-001",
    entityName: "Victoria Garden City",
    entityType: "Estate",
    address: "Lekki-Epe Expressway, Lagos",
    zone: "ZONE-LKK-01",
    collector: {
      name: "Samuel Ojo",
      avatar: "https://i.pravatar.cc/150?u=COL-001"
    },
    date: "2026-05-14T08:00:00Z",
    status: "Scheduled",
    priority: "High",
    expectedLoad: "12 tons",
    vehicleId: "TRK-001"
  },
  {
    id: "SCH-002",
    entityName: "Grace International School",
    entityType: "Business",
    address: "Gbagada Phase 1, Lagos",
    zone: "ZONE-KOS-01",
    collector: {
      name: "Tunde Bakare",
      avatar: "https://i.pravatar.cc/150?u=COL-002"
    },
    date: "2026-05-13T10:00:00Z",
    status: "Completed",
    completedAt: "2026-05-13T10:15:00Z",
    priority: "Normal",
    actualLoad: "4 tons",
    vehicleId: "TRK-002"
  },
  {
    id: "SCH-003",
    entityName: "Surulere Plaza",
    entityType: "Business",
    address: "Adeniran Ogunsanya, Surulere",
    zone: "ZONE-SRL-01",
    collector: null,
    date: "2026-05-13T14:00:00Z",
    status: "Unassigned",
    priority: "Urgent",
    expectedLoad: "8 tons",
    vehicleId: null
  },
  {
    id: "SCH-004",
    entityName: "Chevron Estate",
    entityType: "Estate",
    address: "Chevron Drive, Lekki",
    zone: "ZONE-LKK-02",
    collector: {
      name: "Samuel Ojo",
      avatar: "https://i.pravatar.cc/150?u=COL-001"
    },
    date: "2026-05-14T11:00:00Z",
    status: "In Progress",
    priority: "High",
    expectedLoad: "15 tons",
    vehicleId: "TRK-001"
  },
  {
    id: "SCH-005",
    entityName: "Ikeja City Mall",
    entityType: "Business",
    address: "Obafemi Awolowo Way, Ikeja",
    zone: "ZONE-IKJ-01",
    collector: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=COL-003"
    },
    date: "2026-05-14T09:30:00Z",
    status: "Delayed",
    delayReason: "Traffic Congestion",
    priority: "Urgent",
    expectedLoad: "20 tons",
    vehicleId: "TRK-005"
  }
];

export const scheduleStats = {
  totalToday: 12,
  completed: 5,
  inProgress: 3,
  delayed: 2,
  unassigned: 2
};

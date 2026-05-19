export const mockCollectors = [
  {
    id: "COL-001",
    name: "Samuel Ojo",
    phone: "+2348044445555",
    email: "samuel.ojo@cleannigeria.com",
    zone: "ZONE-LKK-01",
    status: "Active",
    rating: 4.8,
    todayCollections: { completed: 12, assigned: 15 },
    avatar: "https://i.pravatar.cc/150?u=COL-001",
    joinedAt: "2023-05-10T09:00:00Z",
    vehicle: {
      type: "Compactor Truck",
      plateNumber: "LA 450 AB",
      capacity: "10 Tons",
      lastMaintenance: "2026-04-15"
    },
    performance: {
      attendance: 98,
      efficiency: 92,
      complaints: 2
    }
  },
  {
    id: "COL-002",
    name: "Tunde Bakare",
    phone: "+2348055556666",
    email: "tunde.b@cleannigeria.com",
    zone: "ZONE-LKK-02",
    status: "Active",
    rating: 4.5,
    todayCollections: { completed: 8, assigned: 10 },
    avatar: "https://i.pravatar.cc/150?u=COL-002",
    joinedAt: "2023-08-22T10:30:00Z",
    vehicle: {
      type: "Mini Truck",
      plateNumber: "LA 112 XY",
      capacity: "3 Tons",
      lastMaintenance: "2026-05-01"
    },
    performance: {
      attendance: 95,
      efficiency: 88,
      complaints: 5
    }
  },
  {
    id: "COL-003",
    name: "Emeka Nwosu",
    phone: "+2348066667777",
    email: "emeka.n@cleannigeria.com",
    zone: "ZONE-IKY-01",
    status: "On Leave",
    rating: 4.2,
    todayCollections: { completed: 0, assigned: 0 },
    avatar: "https://i.pravatar.cc/150?u=COL-003",
    joinedAt: "2024-01-05T08:15:00Z",
    vehicle: {
      type: "Compactor Truck",
      plateNumber: "LA 988 JK",
      capacity: "12 Tons",
      lastMaintenance: "2026-03-20"
    },
    performance: {
      attendance: 82,
      efficiency: 75,
      complaints: 12
    }
  }
];

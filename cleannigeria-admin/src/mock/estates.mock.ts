export const mockEstates = [
  {
    id: "EST-001",
    name: "Victoria Garden City",
    type: "Unit-Based",
    location: {
      address: "Lekki-Epe Expressway",
      state: "Lagos",
      lga: "Eti-Osa",
      coordinates: [6.4526, 3.5511],
    },
    manager: {
      name: "John Doe",
      phone: "+2348012345678",
      email: "john.doe@vgc.com",
    },
    subscription: {
      status: "Active",
      plan: "Premium Estate",
      billingCycle: "Monthly",
    },
    stats: {
      units: 450,
      activeSubscribers: 420,
      monthlyRevenue: 1250000,
    },
    collection: {
      frequency: "Twice a week",
      preferredDays: ["Tuesday", "Friday"],
      assignedZone: "ZONE-LKK-01",
      assignedCollectors: ["COL-001", "COL-002"],
    },
    status: "Active",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "EST-002",
    name: "Banana Island",
    type: "Full-Estate",
    location: {
      address: "Ikoyi",
      state: "Lagos",
      lga: "Ikoyi",
      coordinates: [6.4536, 3.4471],
    },
    manager: {
      name: "Sarah Smith",
      phone: "+2348098765432",
      email: "sarah@bananaisland.com",
    },
    subscription: {
      status: "Active",
      plan: "Enterprise",
      billingCycle: "Yearly",
    },
    stats: {
      units: 200,
      activeSubscribers: 200,
      monthlyRevenue: 3000000,
    },
    collection: {
      frequency: "Daily",
      preferredDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      assignedZone: "ZONE-IKY-01",
      assignedCollectors: ["COL-003", "COL-004"],
    },
    status: "Active",
    createdAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "EST-003",
    name: "Gwarinpa Estate",
    type: "Unit-Based",
    location: {
      address: "Gwarinpa",
      state: "FCT",
      lga: "Abuja Municipal",
      coordinates: [9.1062, 7.4093],
    },
    manager: {
      name: "Ahmed Musa",
      phone: "+2348023456789",
      email: "ahmed@gwarinpa.com",
    },
    subscription: {
      status: "Pending",
      plan: "Standard Estate",
      billingCycle: "Monthly",
    },
    stats: {
      units: 1200,
      activeSubscribers: 850,
      monthlyRevenue: 850000,
    },
    collection: {
      frequency: "Weekly",
      preferredDays: ["Saturday"],
      assignedZone: "ZONE-ABJ-02",
      assignedCollectors: ["COL-005"],
    },
    status: "Pending",
    createdAt: "2024-05-10T00:00:00Z",
  }
];

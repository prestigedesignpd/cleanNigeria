export const mockBusinesses = [
  {
    id: "BIZ-001",
    name: "Shoprite Surulere",
    type: "Supermarket",
    size: "Large",
    businessEmail: "info@shoprite.com.ng",
    location: {
      address: "Adeniran Ogunsanya Shopping Mall",
      state: "Lagos",
      lga: "Surulere",
      coordinates: { lat: 6.5059, lng: 3.3619 }
    },
    contact: {
      name: "Manager Dan",
      phone: "+2348055555555",
      email: "surulere@shoprite.com.ng",
    },
    subscription: {
      status: "Active",
      plan: "Enterprise Business",
      billingCycle: "Monthly",
    },
    status: "Active",
    monthlyRevenue: 150000,
    createdAt: "2023-06-12T00:00:00Z",
  },
  {
    id: "BIZ-002",
    name: "Grace International School",
    type: "School",
    size: "Medium",
    businessEmail: "admin@graceschool.edu.ng",
    location: {
      address: "Plot 241, Gbagada Phase 1",
      state: "Lagos",
      lga: "Kosofe",
      coordinates: { lat: 6.5568, lng: 3.3915 }
    },
    contact: {
      name: "Principal Grace",
      phone: "+2348033333333",
      email: "info@graceschool.edu.ng",
    },
    subscription: {
      status: "Active",
      plan: "Standard Business",
      billingCycle: "Yearly",
    },
    status: "Active",
    monthlyRevenue: 50000,
    createdAt: "2023-09-01T00:00:00Z",
  }
];

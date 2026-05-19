export const mockUsers = [
  {
    id: "USR-001",
    name: "Adeoluwa Bamidele",
    email: "ade.bam@example.com",
    phone: "+2348011112222",
    avatar: "https://i.pravatar.cc/150?u=USR-001",
    accountType: "Estate Resident",
    status: "Active",
    registeredAt: "2023-11-20T10:30:00Z",
    lastLogin: "2026-05-13T08:00:00Z",
    linkedEntity: "EST-001",
    subscription: {
      plan: "Premium",
      billingCycle: "Monthly",
      price: 5000,
      nextBillingDate: "2026-06-20T10:30:00Z",
      paymentMethod: "Visa ending in 4242",
      autoRenew: true
    }
  },
  {
    id: "USR-002",
    name: "Chidinma Okeke",
    email: "chidi.o@example.com",
    phone: "+2348022223333",
    avatar: "https://i.pravatar.cc/150?u=USR-002",
    accountType: "Business Owner",
    status: "Active",
    registeredAt: "2024-01-15T14:45:00Z",
    lastLogin: "2026-05-12T16:20:00Z",
    linkedEntity: "BIZ-001",
    subscription: {
      plan: "Enterprise",
      billingCycle: "Annual",
      price: 55000,
      nextBillingDate: "2027-01-15T14:45:00Z",
      paymentMethod: "Bank Transfer",
      autoRenew: true
    }
  },
  {
    id: "USR-003",
    name: "Musa Ibrahim",
    email: "musa.ib@example.com",
    phone: "+2348033334444",
    avatar: "https://i.pravatar.cc/150?u=USR-003",
    accountType: "Estate Resident",
    status: "Suspended",
    registeredAt: "2024-03-10T09:15:00Z",
    lastLogin: "2026-04-20T11:00:00Z",
    linkedEntity: "EST-003",
    subscription: {
      plan: "Basic",
      billingCycle: "Monthly",
      price: 2500,
      nextBillingDate: "2026-05-10T09:15:00Z",
      paymentMethod: "None",
      autoRenew: false
    }
  }
];

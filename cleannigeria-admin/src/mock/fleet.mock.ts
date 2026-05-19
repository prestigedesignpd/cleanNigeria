export const mockFleet = [
  {
    id: "TRK-001",
    model: "Mercedes-Benz Econic",
    type: "Compactor",
    plateNumber: "LA 450 AB",
    status: "Active",
    capacity: "12 Tons",
    lastMaintenance: "2026-04-15",
    totalCosts: 450000, // In Naira
    fuelEfficiency: "4.5 km/L",
    assignedCollector: "Samuel Ojo",
    mileage: 24500,
    nextService: "2026-07-15",
    maintenanceLogs: [
      { id: "MNT-001", date: "2026-04-15", type: "Engine Oil Change", cost: 45000, provider: "Lagos Motors" },
      { id: "MNT-002", date: "2026-02-10", type: "Hydraulic System Repair", cost: 120000, provider: "Elite Tech" }
    ]
  },
  {
    id: "TRK-002",
    model: "Isuzu Forward",
    type: "Mini Truck",
    plateNumber: "LA 112 XY",
    status: "Maintenance",
    capacity: "4 Tons",
    lastMaintenance: "2026-05-10",
    totalCosts: 280000,
    fuelEfficiency: "6.2 km/L",
    assignedCollector: "Tunde Bakare",
    mileage: 18200,
    nextService: "2026-05-20",
    maintenanceLogs: [
      { id: "MNT-003", date: "2026-05-10", type: "Brake Pad Replacement", cost: 35000, provider: "QuickFix Auto" }
    ]
  },
  {
    id: "TRK-003",
    model: "Scania P-series",
    type: "Roll-off",
    plateNumber: "LA 988 JK",
    status: "Active",
    capacity: "15 Tons",
    lastMaintenance: "2026-03-20",
    totalCosts: 620000,
    fuelEfficiency: "3.8 km/L",
    assignedCollector: "Emeka Nwosu",
    mileage: 32100,
    nextService: "2026-06-20",
    maintenanceLogs: [
      { id: "MNT-004", date: "2026-03-20", type: "Tire Replacement (x6)", cost: 240000, provider: "Dunlop Service" }
    ]
  }
];

export const fleetStats = {
  totalVehicles: 42,
  active: 38,
  inMaintenance: 4,
  totalMonthlyCosts: 1250000,
  avgFuelEfficiency: "4.8 km/L"
};

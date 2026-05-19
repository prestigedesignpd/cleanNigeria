export interface Zone {
  id: string;
  name: string;
  lga: string;
  state: string;
  status: 'Active' | 'Maintenance' | 'Restricted' | 'Pending';
  estates: number;
  businesses: number;
  collectors: number;
  fleetCount: number;
  collectionDays: string[];
  metrics: {
    coveragePercent: number;
    collectionRate: number;
    revenueGrowth: number;
  };
  leads: {
    name: string;
    avatar: string;
  }[];
}

export const mockZones: Zone[] = [
  {
    id: 'ZN-001',
    name: 'Ikeja Central',
    lga: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
    estates: 24,
    businesses: 156,
    collectors: 12,
    fleetCount: 8,
    collectionDays: ['Mon', 'Wed', 'Fri'],
    metrics: {
      coveragePercent: 92,
      collectionRate: 98,
      revenueGrowth: 12.5
    },
    leads: [
      { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
      { name: 'Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=sarah' }
    ]
  },
  {
    id: 'ZN-002',
    name: 'Victoria Island North',
    lga: 'Eti-Osa',
    state: 'Lagos',
    status: 'Active',
    estates: 18,
    businesses: 342,
    collectors: 15,
    fleetCount: 10,
    collectionDays: ['Tue', 'Thu', 'Sat'],
    metrics: {
      coveragePercent: 88,
      collectionRate: 95,
      revenueGrowth: 8.2
    },
    leads: [
      { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' }
    ]
  },
  {
    id: 'ZN-003',
    name: 'Lekki Phase 1',
    lga: 'Eti-Osa',
    state: 'Lagos',
    status: 'Active',
    estates: 45,
    businesses: 89,
    collectors: 20,
    fleetCount: 12,
    collectionDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    metrics: {
      coveragePercent: 95,
      collectionRate: 99,
      revenueGrowth: 15.8
    },
    leads: [
      { name: 'Blessing Okoro', avatar: 'https://i.pravatar.cc/150?u=blessing' }
    ]
  },
  {
    id: 'ZN-004',
    name: 'Surulere West',
    lga: 'Surulere',
    state: 'Lagos',
    status: 'Maintenance',
    estates: 32,
    businesses: 210,
    collectors: 8,
    fleetCount: 5,
    collectionDays: ['Wed', 'Sat'],
    metrics: {
      coveragePercent: 75,
      collectionRate: 82,
      revenueGrowth: -2.4
    },
    leads: [
      { name: 'David Wilson', avatar: 'https://i.pravatar.cc/150?u=david' }
    ]
  },
  {
    id: 'ZN-005',
    name: 'Yaba Tech District',
    lga: 'Lagos Mainland',
    state: 'Lagos',
    status: 'Active',
    estates: 12,
    businesses: 450,
    collectors: 18,
    fleetCount: 9,
    collectionDays: ['Mon', 'Thu'],
    metrics: {
      coveragePercent: 91,
      collectionRate: 94,
      revenueGrowth: 22.1
    },
    leads: [
      { name: 'Amina Yusuf', avatar: 'https://i.pravatar.cc/150?u=amina' }
    ]
  },
  {
    id: 'ZN-006',
    name: 'Apapa Port Zone',
    lga: 'Apapa',
    state: 'Lagos',
    status: 'Restricted',
    estates: 5,
    businesses: 670,
    collectors: 10,
    fleetCount: 15,
    collectionDays: ['Fri', 'Sun'],
    metrics: {
      coveragePercent: 62,
      collectionRate: 70,
      revenueGrowth: 5.4
    },
    leads: [
      { name: 'Ibrahim Bala', avatar: 'https://i.pravatar.cc/150?u=ibrahim' }
    ]
  }
];

export const zoneStats = {
  totalZones: 42,
  avgCoverage: 84.5,
  efficiency: 91.2,
  activeStaff: 328
};

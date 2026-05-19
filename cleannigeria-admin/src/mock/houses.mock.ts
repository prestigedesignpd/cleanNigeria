export interface House {
  id: string;
  estateId: string;
  houseNumber: string;
  street: string;
  block?: string;
  occupantName: string;
  occupantPhone: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastCollection: string;
  complianceScore: number;
}

export const mockHouses: House[] = [
  {
    id: "HSE-001",
    estateId: "EST-001",
    houseNumber: "4",
    street: "Emerald Way",
    block: "Block A",
    occupantName: "Adeoluwa Bamidele",
    occupantPhone: "+2348011112222",
    status: 'Active',
    lastCollection: "2026-05-12T10:00:00Z",
    complianceScore: 98
  },
  {
    id: "HSE-002",
    estateId: "EST-001",
    houseNumber: "7",
    street: "Emerald Way",
    block: "Block A",
    occupantName: "Ibrahim Lawal",
    occupantPhone: "+2348011113333",
    status: 'Active',
    lastCollection: "2026-05-12T10:15:00Z",
    complianceScore: 100
  },
  {
    id: "HSE-003",
    estateId: "EST-001",
    houseNumber: "2",
    street: "Sunset Boulevard",
    block: "Block B",
    occupantName: "Sarah Johnson",
    occupantPhone: "+2348011114444",
    status: 'Inactive',
    lastCollection: "2026-04-30T09:00:00Z",
    complianceScore: 45
  },
  {
    id: "HSE-004",
    estateId: "EST-001",
    houseNumber: "1",
    street: "Palm Avenue",
    block: "Block C",
    occupantName: "Oluwaseun Tobi",
    occupantPhone: "+2348011115555",
    status: 'Active',
    lastCollection: "2026-05-12T10:30:00Z",
    complianceScore: 92
  },
  {
    id: "HSE-005",
    estateId: "EST-002",
    houseNumber: "Villa 5",
    street: "Luxury Circle",
    occupantName: "Chief Okoro",
    occupantPhone: "+2348055556666",
    status: 'Active',
    lastCollection: "2026-05-11T14:00:00Z",
    complianceScore: 100
  },
  {
    id: "HSE-006",
    estateId: "EST-001",
    houseNumber: "12",
    street: "Palm Avenue",
    block: "Block D",
    occupantName: "Daniel Peters",
    occupantPhone: "+2348011117777",
    status: 'Pending',
    lastCollection: "N/A",
    complianceScore: 0
  }
];

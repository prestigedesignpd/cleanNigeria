export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Billing' | 'Scheduling' | 'Account' | 'Technical' | 'General';
  status: 'Active' | 'Hidden';
  order: number;
}

export const mockFAQs: FAQ[] = [
  {
    id: "FAQ-001",
    question: "When is my next waste pickup scheduled?",
    answer: "You can view your pickup schedule on the 'Schedule' tab of your dashboard. We typically pick up once a week for residential estates.",
    category: "Scheduling",
    status: "Active",
    order: 1
  },
  {
    id: "FAQ-002",
    question: "How do I pay my subscription fee?",
    answer: "Go to the 'Payments' tab, select your pending invoice, and pay via Bank Transfer, Card, or USSD.",
    category: "Billing",
    status: "Active",
    order: 2
  },
  {
    id: "FAQ-003",
    question: "What should I do if my bin is overfilled before pickup?",
    answer: "You can request an 'Extra Pickup' via the dashboard for a small additional fee.",
    category: "General",
    status: "Active",
    order: 3
  }
];

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: 'Educational' | 'Company News' | 'Sustainability' | 'Service Updates';
  status: 'Published' | 'Draft' | 'Archived';
  date: string;
  coverImage?: string;
  views: number;
  shares: number;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: "ART-001",
    title: "5 Ways to Reduce Household Waste",
    summary: "Practical tips for Lagos residents to minimize their carbon footprint through effective waste sorting.",
    content: "Lagos is a bustling city, but with great size comes great waste...",
    author: "Sustainability Team",
    category: "Sustainability",
    status: "Published",
    date: "2026-05-12T10:00:00Z",
    views: 1240,
    shares: 45
  },
  {
    id: "ART-002",
    title: "Introducing Smart Collection Schedules",
    summary: "Our new algorithmic routing ensures timely pickups even in high-traffic zones.",
    content: "We are excited to announce a major upgrade to our fleet dispatch system...",
    author: "Admin Operations",
    category: "Service Updates",
    status: "Published",
    date: "2026-05-10T14:30:00Z",
    views: 890,
    shares: 12
  },
  {
    id: "ART-003",
    title: "The Future of Waste Management in Nigeria",
    summary: "How technology is reshaping urban sanitation and public health across the nation.",
    content: "Waste management has traditionally been a challenge in sub-Saharan Africa...",
    author: "Dr. Ola Williams",
    category: "Educational",
    status: "Draft",
    date: "2026-05-14T09:00:00Z",
    views: 0,
    shares: 0
  }
];

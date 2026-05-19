export const mockReferral = {
  code: 'EMEKA2025',
  link: 'https://cleannigeria.com/join?ref=EMEKA2025',
  rewardPerReferral: 2000,
  totalReferred: 3,
  totalEarned: 6000,
  pendingRewards: 2000,
  paidRewards: 4000,
  referrals: [
    {
      id: 'ref_001',
      name: 'Adaeze O.',
      dateJoined: '2026-02-10T00:00:00Z',
      status: 'subscribed' as const,
      reward: 2000,
    },
    {
      id: 'ref_002',
      name: 'Biodun A.',
      dateJoined: '2026-03-22T00:00:00Z',
      status: 'subscribed' as const,
      reward: 2000,
    },
    {
      id: 'ref_003',
      name: 'Chiamaka N.',
      dateJoined: '2026-05-01T00:00:00Z',
      status: 'pending' as const,
      reward: 2000,
    },
  ],
}


export const mockTestimonials = [
  {
    id: 't1',
    name: 'Barr. Chidi Okonkwo',
    role: 'Estate Manager',
    estate: 'Green Court Estate, Lekki',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=chidi',
    rating: 5,
    quote: 'CleanNigeria has transformed our estate. Residents no longer complain about overflowing bins. The collectors are punctual and professional.',
  },
  {
    id: 't2',
    name: 'Mrs. Folake Adewale',
    role: 'Business Owner',
    estate: 'Folake\'s Supermarket, Ikeja',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=folake',
    rating: 5,
    quote: 'Running a supermarket generates a lot of waste. CleanNigeria\'s business plan handles everything seamlessly. Worth every kobo!',
  },
  {
    id: 't3',
    name: 'Engr. Seun Bakare',
    role: 'Property Developer',
    estate: 'Sunrise Gardens, Ajah',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=seun',
    rating: 4,
    quote: 'The live tracking feature is impressive. I can see exactly when the collector will arrive. My residents love it.',
  },
]

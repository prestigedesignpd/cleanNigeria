export const mockRevenueAnalytics = {
  monthly: [
    { name: 'Jan', residential: 12000000, business: 18000000 },
    { name: 'Feb', residential: 13000000, business: 19000000 },
    { name: 'Mar', residential: 15000000, business: 20000000 },
    { name: 'Apr', residential: 14000000, business: 20000000 },
    { name: 'May', residential: 16000000, business: 22000000 },
    { name: 'Jun', residential: 18000000, business: 24000000 },
    { name: 'Jul', residential: 20000000, business: 25000000 },
  ],
  byPlan: [
    { name: 'Basic', value: 30 },
    { name: 'Standard', value: 45 },
    { name: 'Premium', value: 25 },
  ]
};

export const mockCollectionAnalytics = {
  weekly: [
    { name: 'Mon', completed: 420, missed: 20 },
    { name: 'Tue', completed: 450, missed: 15 },
    { name: 'Wed', completed: 380, missed: 40 },
    { name: 'Thu', completed: 460, missed: 10 },
    { name: 'Fri', completed: 490, missed: 5 },
    { name: 'Sat', completed: 350, missed: 30 },
    { name: 'Sun', completed: 150, missed: 10 },
  ],
  byZone: [
    { name: 'Zone A', efficiency: 98 },
    { name: 'Zone B', efficiency: 92 },
    { name: 'Zone C', efficiency: 85 },
    { name: 'Zone D', efficiency: 95 },
    { name: 'Zone E', efficiency: 88 },
  ]
};

export const mockUserAnalytics = {
  growth: [
    { name: 'Week 1', users: 11200 },
    { name: 'Week 2', users: 11500 },
    { name: 'Week 3', users: 11900 },
    { name: 'Week 4', users: 12450 },
  ],
  types: [
    { name: 'Households', value: 8500 },
    { name: 'Small Business', value: 3200 },
    { name: 'Large Estate', value: 750 },
  ]
};

export const mockZoneAnalytics = {
  performance: [
    { name: 'Zone 1', volume: 4500 },
    { name: 'Zone 2', volume: 3800 },
    { name: 'Zone 3', volume: 5200 },
    { name: 'Zone 4', volume: 2900 },
    { name: 'Zone 5', volume: 4100 },
  ]
};

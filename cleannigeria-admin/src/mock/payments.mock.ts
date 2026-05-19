export const mockPayments = [
  {
    id: "PAY-1001",
    reference: "REF-987654321",
    subscriberName: "Victoria Garden City",
    customerEmail: "admin@vgc-estate.com",
    customerType: "Estate",
    amount: 1250000,
    type: "Subscription",
    status: "Success",
    method: "Paystack",
    paystackRef: "T123456789",
    date: "2026-05-13T09:00:00Z",
    billingPeriod: "May 2026",
    failureReason: null
  },
  {
    id: "PAY-1002",
    reference: "REF-987654322",
    subscriberName: "Shoprite Surulere",
    customerEmail: "finance@shoprite.ng",
    customerType: "Business",
    amount: 150000,
    type: "Subscription",
    status: "Success",
    method: "Bank Transfer",
    paystackRef: "TRF_98231",
    date: "2026-05-12T14:30:00Z",
    billingPeriod: "Q2 2026",
    failureReason: null
  },
  {
    id: "PAY-1003",
    reference: "REF-987654323",
    subscriberName: "Adeoluwa Bamidele",
    customerEmail: "ade@gmail.com",
    customerType: "Household",
    amount: 15000,
    type: "Extra Pickup",
    status: "Failed",
    method: "Flutterwave",
    paystackRef: "FLW_88291",
    date: "2026-05-13T10:15:00Z",
    billingPeriod: "N/A",
    failureReason: "Insufficient Funds"
  },
  {
    id: "PAY-1004",
    reference: "REF-987654324",
    subscriberName: "Lekki Phase 1",
    customerEmail: "lekki1@lagos.gov.ng",
    customerType: "Estate",
    amount: 2500000,
    type: "Subscription",
    status: "Pending",
    method: "Bank Transfer",
    paystackRef: "TRF_98232",
    date: "2026-05-14T11:00:00Z",
    billingPeriod: "May 2026",
    failureReason: null
  },
  {
    id: "PAY-1005",
    reference: "REF-987654325",
    subscriberName: "Chevron Estate",
    customerEmail: "facility@chevron.com",
    customerType: "Estate",
    amount: 850000,
    type: "Subscription",
    status: "Success",
    method: "Paystack",
    paystackRef: "T123456795",
    date: "2026-05-11T16:45:00Z",
    billingPeriod: "May 2026",
    failureReason: null
  }
];

export const paymentStats = {
  totalRevenue: 4765000,
  successRate: 94.5,
  activeSubscriptions: 1240,
  pendingSettlements: 2500000,
  growth: 12.5
};

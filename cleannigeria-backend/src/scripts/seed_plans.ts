import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedPlans() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected! Seeding Subscription Plans...');

  const { SubscriptionPlan } = await import('../models/index');

  // Clear existing plans
  await SubscriptionPlan.deleteMany({});

  const plansToCreate = [
    {
      name: 'Basic',
      slug: 'basic',
      description: 'Perfect for small estates and unit holders',
      targetType: 'ESTATE_UNIT',
      pricing: {
        monthly: 500000,
        yearly: 4800000,
      },
      features: [
        { text: '2 collections per month', included: true },
        { text: 'Standard waste collection', included: true },
        { text: 'Email support', included: true },
        { text: 'Basic dashboard', included: true },
        { text: 'Live collector tracking', included: false },
        { text: 'Priority scheduling', included: false },
      ],
      limits: {
        pickupsPerCycle: 2,
        extraPickupPrice: 150000,
      },
      allowExtraPickups: true,
      collectionsPerMonth: 2,
      isFeatured: false,
      isActive: true,
      displayOrder: 1,
    },
    {
      name: 'Standard',
      slug: 'standard',
      description: 'Best for medium estates with regular needs',
      targetType: 'ESTATE_FULL',
      pricing: {
        monthly: 1200000,
        yearly: 11520000,
      },
      features: [
        { text: '4 collections per month', included: true },
        { text: 'Priority scheduling', included: true },
        { text: 'Live collector tracking', included: true },
        { text: 'Phone & email support', included: true },
        { text: 'Complaint management', included: true },
        { text: 'Referral rewards', included: true },
      ],
      limits: {
        pickupsPerCycle: 4,
        extraPickupPrice: 120000,
      },
      allowExtraPickups: true,
      collectionsPerMonth: 4,
      isFeatured: true,
      isActive: true,
      displayOrder: 2,
    },
    {
      name: 'Premium',
      slug: 'premium',
      description: 'For large estates and high-volume businesses',
      targetType: 'BUSINESS_GROWTH',
      pricing: {
        monthly: 2500000,
        yearly: 24000000,
      },
      features: [
        { text: 'Unlimited collections', included: true },
        { text: 'Same-day extra pickups', included: true },
        { text: 'Dedicated collector team', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Custom scheduling', included: true },
        { text: 'Bulk waste handling', included: true },
      ],
      limits: {
        pickupsPerCycle: 999,
        extraPickupPrice: 0,
      },
      allowExtraPickups: true,
      collectionsPerMonth: 999,
      isFeatured: false,
      isActive: true,
      displayOrder: 3,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Custom solutions for large corporations',
      targetType: 'BUSINESS_ENTERPRISE',
      pricing: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Custom contract terms', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA guarantees', included: true },
        { text: 'API integration', included: true },
        { text: 'White-label options', included: true },
      ],
      limits: {
        pickupsPerCycle: 999,
        extraPickupPrice: 0,
      },
      allowExtraPickups: true,
      collectionsPerMonth: 999,
      isFeatured: false,
      isActive: true,
      displayOrder: 4,
    },
  ];

  for (const p of plansToCreate) {
    await SubscriptionPlan.create(p);
    console.log(`  ✓ Seeded Plan: ${p.name}`);
  }

  console.log('\n✅ Subscription Plans seeded successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seedPlans().catch((err) => {
  console.error('❌ Seeding failed:', err.message || err);
  process.exit(1);
});

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Import models after connection to avoid path alias issues
  const { User, Payment, Subscription, Complaint, Estate, Business, Collector } = await import('../models/index');

  // Seed Users — only ESTATE and BUSINESS are valid AccountType values
  console.log('Seeding users...');
  const usersToCreate = [
    { firstName: 'Grace', lastName: 'International School', email: 'grace@school.com', accountType: 'BUSINESS' },
    { firstName: 'Victoria', lastName: 'Garden City', email: 'vgc@estate.com', accountType: 'ESTATE' },
    { firstName: 'Shoprite', lastName: 'Surulere', email: 'shoprite@surulere.com', accountType: 'BUSINESS' },
  ];

  const createdUsers: any[] = [];
  for (const u of usersToCreate) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      const daysAgo = Math.floor(Math.random() * 7);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      user = await User.create({
        ...u,
        password: '$2b$12$YK.G2q0CZ7sXGEHKJscQFOjZi2BmSnqAJEwQmMR5VzQT2hcqfAoQS',
        phone: `080${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        referralCode: `REF${Math.floor(Math.random() * 99999)}`,
        isEmailVerified: true,
        createdAt: d,
      });
      console.log(`  ✓ Created user: ${user.email}`);
    } else {
      console.log(`  → Already exists: ${user.email}`);
    }
    createdUsers.push(user);
  }

  // Seed Payments — last 6 months for charts
  console.log('Seeding payments...');
  for (let i = 5; i >= 0; i--) {
    const base = new Date();
    base.setMonth(base.getMonth() - i);
    base.setDate(15);
    const numPayments = Math.floor(Math.random() * 15) + 10;
    for (let j = 0; j < numPayments; j++) {
      const d = new Date(base);
      d.setDate(base.getDate() + Math.floor(Math.random() * 8));
      await Payment.create({
        userId: createdUsers[j % createdUsers.length]._id,
        amount: (Math.floor(Math.random() * 500) + 100) * 1000,
        currency: 'NGN',
        reference: `REF-${Date.now()}-${j}-${Math.random().toString(36).substring(7)}`,
        status: 'SUCCESS',
        paymentMethod: 'CARD',
        type: 'SUBSCRIPTION',
        createdAt: d,
      });
    }
    console.log(`  ✓ Month -${i}: seeded ${numPayments} payments`);
  }

  // Recent specific payments visible in the widget
  await Payment.create({
    userId: createdUsers[1]._id,
    amount: 125000000, // ₦1.25M
    currency: 'NGN',
    reference: `REF-VGC-PREMIUM-${Date.now()}`,
    status: 'SUCCESS',
    paymentMethod: 'BANK_TRANSFER',
    type: 'SUBSCRIPTION',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  });

  await Payment.create({
    userId: createdUsers[2]._id,
    amount: 4500000, // ₦45k
    currency: 'NGN',
    reference: `REF-SHOPRITE-FAILED-${Date.now()}`,
    status: 'FAILED',
    paymentMethod: 'CARD',
    type: 'SUBSCRIPTION',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  });
  console.log('  ✓ Seeded specific recent payments');

  // Seed Subscriptions — last 6 months for chart
  console.log('Seeding subscriptions...');
  const fakePlanId = new mongoose.Types.ObjectId();
  for (let i = 5; i >= 0; i--) {
    const base = new Date();
    base.setMonth(base.getMonth() - i);
    base.setDate(10);
    const numSubs = Math.floor(Math.random() * 20) + 10;
    for (let j = 0; j < numSubs; j++) {
      await Subscription.create({
        userId: createdUsers[j % createdUsers.length]._id,
        planId: fakePlanId,
        status: 'ACTIVE',
        startDate: base,
        endDate: new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000),
        currentPeriodStart: base,
        currentPeriodEnd: new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000),
        billingCycle: 'MONTHLY',
        amount: 500000,
        currency: 'NGN',
        createdAt: base,
      });
    }
    console.log(`  ✓ Month -${i}: seeded ${numSubs} subscriptions`);
  }

  // Seed a Complaint for activity feed
  console.log('Seeding complaint...');
  await Complaint.create({
    userId: createdUsers[0]._id,
    ticketId: `TICKET-${Date.now()}`,
    subject: 'Missed pickup reported in Zone-LKK-01',
    description: 'The truck never arrived on schedule today.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'MISSED_PICKUP',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  });
  console.log('  ✓ Seeded complaint');

  // Seed Zone
  console.log('Seeding Zone...');
  const { Zone, AdminUser } = await import('../models/index');
  let zone = await Zone.findOne();
  if (!zone) {
    let admin = await AdminUser.findOne();
    if (!admin) {
      admin = await AdminUser.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@cleannigeria.gov.ng',
        password: '$2b$12$YK.G2q0CZ7sXGEHKJscQFOjZi2BmSnqAJEwQmMR5VzQT2hcqfAoQS',
        role: 'ADMIN',
        isActive: true,
      });
    }
    zone = await Zone.create({
      name: 'Zone-LKK-01',
      description: 'Lekki Corridor',
      state: 'Lagos',
      lgas: ['Eti-Osa'],
      boundary: {
        type: 'Polygon',
        coordinates: [
          [
            [3.4, 6.4],
            [3.5, 6.4],
            [3.5, 6.5],
            [3.4, 6.5],
            [3.4, 6.4],
          ]
        ]
      },
      status: 'ACTIVE',
      createdBy: admin._id,
    });
  }
  console.log('  ✓ Zone set up');

  // Seed Estates
  console.log('Seeding pending estates...');
  const estateExists = await Estate.findOne({ name: 'Victoria Island Residences' });
  if (!estateExists) {
    await Estate.create({
      name: 'Victoria Island Residences',
      collectionType: 'FULL',
      address: {
        street: 'Adetokunbo Ademola St',
        lga: 'Eti-Osa',
        state: 'Lagos',
      },
      zoneId: zone._id,
      managerName: 'VGC Admin',
      managerPhone: '+234 800 123 4567',
      managerEmail: 'admin@viresidences.com',
      status: 'PENDING',
      createdBy: createdUsers[0]._id,
    });
  }

  // Seed Businesses
  console.log('Seeding pending businesses...');
  const businessExists = await Business.findOne({ name: 'Dangote Logistics Hub' });
  if (!businessExists) {
    await Business.create({
      name: 'Dangote Logistics Hub',
      businessType: 'SCHOOL',
      address: {
        street: 'Dangote Hub Rd',
        lga: 'Eti-Osa',
        state: 'Lagos',
      },
      zoneId: zone._id,
      ownerId: createdUsers[0]._id,
      contactPerson: {
        name: 'Facilities Mgr',
        phone: '+234 812 987 6543',
        email: 'facilities@dangotelogistics.com',
      },
      status: 'PENDING',
    });
  }

  // Seed Collectors
  console.log('Seeding pending collectors...');
  const collectorExists = await Collector.findOne({ email: 'hello@greenearth.ng' });
  if (!collectorExists) {
    await Collector.create({
      employeeId: 'COL-009',
      firstName: 'Green Earth',
      lastName: 'Recyclers',
      email: 'hello@greenearth.ng',
      phone: '+234 703 444 5555',
      password: '$2b$12$YK.G2q0CZ7sXGEHKJscQFOjZi2BmSnqAJEwQmMR5VzQT2hcqfAoQS',
      vehicle: {
        type: 'SMALL_TRUCK',
        plateNumber: 'LA-123-ENG',
      },
      currentZoneId: zone._id,
      status: 'OFF_DUTY',
    });
  }
  console.log('  ✓ Seeded verification entities');

  console.log('\n✅ Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message || err);
  process.exit(1);
});

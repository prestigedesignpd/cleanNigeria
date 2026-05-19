import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import {
  User,
  OTPVerification,
  RefreshToken,
  PasswordReset,
  Zone,
  Estate,
  EstateUnit,
  Business,
  SubscriptionPlan,
  Subscription,
  Payment,
  Invoice,
  Refund,
  Collector,
  CollectorZoneAssignment,
  PickupSchedule,
  CollectionLog,
  Complaint,
  ComplaintMessage,
  Notification,
  NotificationTemplate,
  BroadcastLog,
  BlogPost,
  BlogCategory,
  AuditLog,
  Referral,
  SystemSetting,
  WaitlistEntry
} from '../models'

async function clearDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
  }

  try {
    console.log('Connecting to MongoDB for clearing...')
    await mongoose.connect(uri)
    console.log('Connected!')

    console.log('Clearing operational collections...')
    
    await Promise.all([
      User.deleteMany({}),
      OTPVerification.deleteMany({}),
      RefreshToken.deleteMany({}),
      PasswordReset.deleteMany({}),
      Zone.deleteMany({}),
      Estate.deleteMany({}),
      EstateUnit.deleteMany({}),
      Business.deleteMany({}),
      Subscription.deleteMany({}),
      Payment.deleteMany({}),
      Invoice.deleteMany({}),
      Refund.deleteMany({}),
      Collector.deleteMany({}),
      CollectorZoneAssignment.deleteMany({}),
      PickupSchedule.deleteMany({}),
      CollectionLog.deleteMany({}),
      Complaint.deleteMany({}),
      ComplaintMessage.deleteMany({}),
      Notification.deleteMany({}),
      BroadcastLog.deleteMany({}),
      BlogPost.deleteMany({}),
      BlogCategory.deleteMany({}),
      AuditLog.deleteMany({}),
      Referral.deleteMany({}),
      WaitlistEntry.deleteMany({})
    ])

    console.log('✅ All operational collections cleared successfully!')
    
    await mongoose.disconnect()
    console.log('Disconnected.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    process.exit(1)
  }
}

clearDatabase()

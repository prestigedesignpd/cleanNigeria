import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { AdminNotification } from '../models'

async function clearAdminNotifications() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
  }

  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(uri)
    console.log('Connected!')

    console.log('Clearing AdminNotification collection...')
    const result = await AdminNotification.deleteMany({})
    console.log(`✅ Cleared all admin notifications! Deleted count: ${result.deletedCount}`)

    await mongoose.disconnect()
    console.log('Disconnected.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing collection:', error)
    process.exit(1)
  }
}

clearAdminNotifications()

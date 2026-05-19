import mongoose from 'mongoose'
import { Cms } from './models/Cms.model'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env') })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleannigeria'

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to DB')

  const heroContent = {
    title: 'A Cleaner Nigeria Starts Here',
    subtitle: 'Reliable, tech-powered waste collection for estates and businesses. Subscribe once, enjoy scheduled pickups, live tracking, and 24/7 support.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2070&auto=format&fit=crop'
    ]
  }

  await Cms.findOneAndUpdate(
    { key: 'home_hero' },
    { $set: { content: heroContent } },
    { upsert: true, new: true }
  )

  console.log('Seeded home_hero')
  await mongoose.disconnect()
}

seed().catch(console.error)

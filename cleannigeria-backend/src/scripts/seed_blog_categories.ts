import mongoose from 'mongoose'
import { config } from 'dotenv'
import path from 'path'
import { BlogCategory } from '../models/BlogCategory.model'

// Load environment variables
config({ path: path.join(__dirname, '../../.env') })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleannigeria'

const defaultCategories = [
  { name: 'Educational', description: 'Educational articles and guides on waste management' },
  { name: 'Sustainability', description: 'Insights into sustainable practices and eco-friendly tips' },
  { name: 'Company News', description: 'Latest updates and announcements from CleanNigeria' },
  { name: 'Guides', description: 'How-to guides for using the CleanNigeria platform' },
  { name: 'Service Updates', description: 'Updates about service areas, pricing, and features' }
]

async function seedBlogCategories() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    console.log('Clearing existing categories...')
    await BlogCategory.deleteMany({})

    console.log('Seeding new categories...')
    const created: any[] = []
    for (const cat of defaultCategories) {
      const newCat = await BlogCategory.create(cat)
      created.push(newCat)
      console.log(`✓ Created: ${newCat.name} (${newCat._id}) [slug: ${newCat.slug}]`)
    }

    console.log(`\nSuccessfully seeded ${created.length} categories!`)

  } catch (error) {
    console.error('Error seeding categories:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedBlogCategories()

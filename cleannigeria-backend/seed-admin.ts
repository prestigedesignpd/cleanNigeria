import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { AdminUser } from './src/models/AdminUser.model'
import { AdminRole } from './src/constants/roles.constants'
import { hashPassword } from './src/utils/hashUtils'
import { logger } from './src/utils/logger'

async function seedSuperAdmin() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    logger.info('Connected to MongoDB for seeding...')

    const email = 'admin@cleannigeria.com'
    const password = 'SuperSecurePassword123!'

    const existingAdmin = await AdminUser.findOne({ email })
    if (existingAdmin) {
      logger.warn(`Admin with email ${email} already exists. Skipping...`)
    } else {
      const hashedPassword = await hashPassword(password)
      await AdminUser.create({
        firstName: 'System',
        lastName: 'Administrator',
        email,
        password: hashedPassword,
        role: AdminRole.SUPER_ADMIN,
        permissions: ['*'], // All permissions
        isActive: true,
      })
      logger.info('✅ Super Admin created successfully!')
      logger.info(`Email: ${email}`)
      logger.info(`Password: ${password}`)
    }

    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB.')
    process.exit(0)
  } catch (error) {
    logger.error('Error seeding super admin:', error)
    process.exit(1)
  }
}

seedSuperAdmin()

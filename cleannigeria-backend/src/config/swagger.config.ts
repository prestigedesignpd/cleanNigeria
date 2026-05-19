import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CleanNigeria API',
      version: '1.0.0',
      description: 'Professional waste management platform API for Nigeria',
      contact: {
        name: 'CleanNigeria Support',
        email: 'support@cleannigeria.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Client authentication' },
      { name: 'Admin Auth', description: 'Admin portal authentication' },
      { name: 'Users', description: 'User profile and settings' },
      { name: 'Estates', description: 'Estate management' },
      { name: 'Businesses', description: 'Business account management' },
      { name: 'Zones', description: 'Service zone management' },
      { name: 'Collectors', description: 'Waste collector management' },
      { name: 'Subscription Plans', description: 'Plan catalogue' },
      { name: 'Subscriptions', description: 'User subscriptions' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Invoices', description: 'Invoice management' },
      { name: 'Schedules', description: 'Pickup scheduling' },
      { name: 'Complaints', description: 'Complaint management' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'Referrals', description: 'Referral program' },
      { name: 'Blog', description: 'Blog posts' },
      { name: 'Analytics', description: 'Admin analytics' },
      { name: 'Reports', description: 'Report generation' },
      { name: 'Settings', description: 'System settings' },
      { name: 'Uploads', description: 'File uploads' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)

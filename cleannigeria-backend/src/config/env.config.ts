import { cleanEnv, str, port, url, num, bool } from 'envalid'

export const env = cleanEnv(process.env, {
  // App
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: port({ default: 5000 }),
  APP_NAME: str({ default: 'CleanNigeria' }),
  APP_URL: url({ default: 'http://localhost:5000' }),
  CLIENT_URL: str({ default: 'http://localhost:3000' }),
  ADMIN_URL: str({ default: 'http://localhost:3001' }),
  ADMIN_EMAIL: str({ default: 'admin@cleannigeria.com' }),
  ADMIN_PASSWORD: str({ default: 'password' }),

  // MongoDB
  MONGODB_URI: str(),

  // Redis
  REDIS_URL: str({ default: 'redis://localhost:6379' }),
  REDIS_PASSWORD: str({ default: '' }),

  // JWT
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES: str({ default: '15m' }),
  JWT_REFRESH_EXPIRES: str({ default: '7d' }),
  JWT_ADMIN_ACCESS_SECRET: str(),
  JWT_ADMIN_REFRESH_SECRET: str(),
  JWT_ADMIN_ACCESS_EXPIRES: str({ default: '8h' }),
  JWT_ADMIN_REFRESH_EXPIRES: str({ default: '1d' }),

  // Paystack
  PAYSTACK_PUBLIC_KEY: str({ default: 'pk_test_mock' }),
  PAYSTACK_SECRET_KEY: str({ default: 'sk_test_mock' }),
  PAYSTACK_WEBHOOK_SECRET: str({ default: 'whsec_mock' }),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),

  // Email
  SMTP_HOST: str({ default: 'smtp.gmail.com' }),
  SMTP_PORT: num({ default: 587 }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  EMAIL_FROM_NAME: str({ default: 'CleanNigeria' }),
  EMAIL_FROM_ADDRESS: str(),

  // SendGrid (backup)
  SENDGRID_API_KEY: str({ default: '' }),

  // Termii SMS
  TERMII_API_KEY: str({ default: '' }),
  TERMII_SENDER_ID: str({ default: 'CleanNG' }),
  TERMII_BASE_URL: str({ default: 'https://api.ng.termii.com/api' }),

  // 2FA
  TWO_FA_APP_NAME: str({ default: 'CleanNigeria' }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }),
  RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
  AUTH_RATE_LIMIT_MAX: num({ default: 10 }),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: num({ default: 12 }),

  // OTP
  OTP_EXPIRES_MINUTES: num({ default: 10 }),

  // Session
  SESSION_SECRET: str({ default: 'cleannigeria-session-secret' }),

  // Maintenance
  MAINTENANCE_MODE: bool({ default: false }),
})

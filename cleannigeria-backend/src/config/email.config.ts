import nodemailer from 'nodemailer'
import { logger } from '@utils/logger'

let transporter: nodemailer.Transporter | null = null

export const getEmailTransporter = (): nodemailer.Transporter => {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  logger.info('✅ Email transporter configured')
  return transporter
}

export const EMAIL_FROM = `${process.env.EMAIL_FROM_NAME || 'CleanNigeria'} <${process.env.EMAIL_FROM_ADDRESS}>`

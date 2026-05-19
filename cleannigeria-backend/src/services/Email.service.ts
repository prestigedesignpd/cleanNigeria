import { getEmailTransporter, EMAIL_FROM } from '@config/email.config'
import { logger } from '@utils/logger'
import path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'

export class EmailService {
  /**
   * Send a generic email using a template
   */
  static async sendEmail(to: string, subject: string, templateName: string, data: any): Promise<boolean> {
    try {
      const transporter = getEmailTransporter()

      // In a real app, we'd use a template engine or pre-compiled Handlebars
      // For now, let's just use a simple string replacement or a basic template loader
      const html = this.loadTemplate(templateName, data)

      await transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        html,
      })

      logger.info(`Email sent to ${to}: ${subject}`)
      return true
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error)
      return false
    }
  }

  /**
   * Specific helper for OTP emails
   */
  static async sendOtpEmail(to: string, name: string, otp: string): Promise<boolean> {
    return this.sendEmail(to, 'Verify your email - CleanNigeria', 'otp', {
      name,
      otp,
      expiresIn: '10 minutes',
    })
  }

  /**
   * Specific helper for Password Reset emails
   */
  static async sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<boolean> {
    return this.sendEmail(to, 'Reset your password - CleanNigeria', 'password-reset', {
      name,
      resetUrl,
    })
  }

  /**
   * Dummy template loader for now
   */
  private static loadTemplate(name: string, data: any): string {
    // For now, just return a simple HTML string
    // In production, we would read from src/templates/email/*.hbs
    if (name === 'otp') {
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2e7d32;">CleanNigeria</h2>
          <p>Hello ${data.name},</p>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1b5e20; margin: 20px 0; text-align: center; background: #f1f8e9; padding: 10px;">${data.otp}</div>
          <p>This code expires in ${data.expiresIn}. If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">Waste Management Simplified.</p>
        </div>
      `
    }

    if (name === 'password-reset') {
        return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2e7d32;">CleanNigeria</h2>
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">Waste Management Simplified.</p>
        </div>
      `
    }

    return `<p>${JSON.stringify(data)}</p>`
  }
}

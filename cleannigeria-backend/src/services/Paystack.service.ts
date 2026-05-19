import axios from 'axios'
import { env } from '@config/env.config'
import { logger } from '@utils/logger'
import { ApiError } from '@utils/ApiError'

const PAYSTACK_URL = 'https://api.paystack.co'

export class PaystackService {
  private static getHeaders() {
    return {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Initialize a transaction
   */
  static async initializeTransaction(email: string, amount: number, metadata: any = {}) {
    try {
      const response = await axios.post(
        `${PAYSTACK_URL}/transaction/initialize`,
        {
          email,
          amount, // in kobo
          metadata,
          callback_url: `${env.CLIENT_URL}/payment/verify`,
        },
        { headers: this.getHeaders() }
      )
      return response.data.data
    } catch (error: any) {
      logger.error('Paystack initialize error:', error.response?.data || error.message)
      throw ApiError.badRequest('Failed to initialize payment with Paystack')
    }
  }

  /**
   * Verify a transaction
   */
  static async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${PAYSTACK_URL}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      )
      return response.data.data
    } catch (error: any) {
      logger.error('Paystack verify error:', error.response?.data || error.message)
      throw ApiError.badRequest('Failed to verify payment with Paystack')
    }
  }

  /**
   * Create a plan on Paystack
   */
  static async createPlan(name: string, interval: 'monthly' | 'annually', amount: number) {
    try {
      const response = await axios.post(
        `${PAYSTACK_URL}/plan`,
        {
          name,
          interval,
          amount,
        },
        { headers: this.getHeaders() }
      )
      return response.data.data
    } catch (error: any) {
      logger.error('Paystack plan creation error:', error.response?.data || error.message)
      throw ApiError.badRequest('Failed to create plan on Paystack')
    }
  }
}

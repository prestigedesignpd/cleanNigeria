import axios from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const url: string = error.config?.url ?? ''
    const is401 = error.response?.status === 401

    // Only force logout if the auth token itself is invalid (not just a permissions issue)
    // Don't logout for endpoints like /notifications fetching before token is saved
    if (is401 && !url.includes('/auth/')) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
      return Promise.reject(new Error('Unauthorized'))
    }

    if (is401 && url.includes('/auth/')) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }

    // Standardize backend ApiError structure
    const backendError = error.response?.data
    if (backendError && !backendError.success) {
       return Promise.reject(new Error(backendError.message || 'An error occurred'))
    }

    return Promise.reject(error)
  }
)

export default api

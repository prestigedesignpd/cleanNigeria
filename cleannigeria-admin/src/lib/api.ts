import axios from 'axios'
import { useAdminAuthStore } from '@/store/adminAuthStore'

const rawApiUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1'
const apiBaseUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`

export const env = {
  apiBaseUrl,
}

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      useAdminAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }

    // Standardize backend ApiError structure
    const backendError = error.response?.data
    if (backendError && !backendError.success) {
      let msg = backendError.message || 'An error occurred'
      if (backendError.errors && Array.isArray(backendError.errors) && backendError.errors.length > 0) {
        const details = backendError.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
        msg = `${msg} - ${details}`
      }
      return Promise.reject(new Error(msg))
    }

    return Promise.reject(error)
  }
)

export default api

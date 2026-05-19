import api from './api'

export const userService = {
  async updateProfile(data: { fullName?: string; phone?: string }) {
    const payload: any = {}
    if (data.fullName) {
      const parts = data.fullName.trim().split(/\s+/)
      payload.firstName = parts[0]
      payload.lastName = parts.slice(1).join(' ') || parts[0] // Fallback if only one name
    }
    if (data.phone) payload.phone = data.phone

    const res = await api.patch('/users/profile', payload)
    return res.data.data
  },

  async updateAvatar(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data.data
  },
}

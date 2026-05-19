import api from './api'

export const cmsService = {
  async getContent(key: string) {
    const res = await api.get(`/cms/${key}`)
    return res.data.data
  },
}

import api from './api'

export const blogService = {
  async getPosts(params?: any) {
    const res = await api.get('/blog/posts', { params })
    // Backend returns paginated response: { success, data: [], meta: {} }
    return res.data.data || []
  },

  async getPostBySlug(slug: string) {
    const res = await api.get(`/blog/posts/${slug}`)
    return res.data.data
  },

  async getCategories() {
    const res = await api.get('/blog/categories')
    return res.data.data
  },
}

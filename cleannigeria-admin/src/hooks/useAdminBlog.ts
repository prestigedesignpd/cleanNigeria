import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminBlogPosts(params?: any) {
  return useQuery({
    queryKey: ['adminBlogPosts', params],
    queryFn: async () => {
      const res = await api.get('/blog/admin/posts', { params })
      return res.data.data
    },
  })
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await api.get('/blog/categories')
      return res.data.data
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/blog/posts', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await api.patch(`/blog/posts/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/blog/posts/${id}`)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] })
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useAdminZones(params?: any) {
  return useQuery({
    queryKey: ['adminZones', params],
    queryFn: async () => {
      const res = await api.get('/zones', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useAdminEstates(params?: any) {
  return useQuery({
    queryKey: ['adminEstates', params],
    queryFn: async () => {
      const res = await api.get('/estates', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useAdminBusinesses(params?: any) {
  return useQuery({
    queryKey: ['adminBusinesses', params],
    queryFn: async () => {
      const res = await api.get('/businesses', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useAdminCollectors(params?: any) {
  return useQuery({
    queryKey: ['adminCollectors', params],
    queryFn: async () => {
      const res = await api.get('/collectors', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useAdminComplaints(params?: any) {
  return useQuery({
    queryKey: ['adminComplaints', params],
    queryFn: async () => {
      const res = await api.get('/complaints', { params })
      return res.data.data?.data || res.data.data || []
    },
  })
}

export function useEstateById(id: string) {
  return useQuery({
    queryKey: ['estate', id],
    queryFn: async () => {
      const res = await api.get(`/estates/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useEstateUnits(id: string, params?: any) {
  return useQuery({
    queryKey: ['estateUnits', id, params],
    queryFn: async () => {
      const res = await api.get(`/estates/${id}/units`, { params })
      return res.data.data?.data || res.data.data || []
    },
    enabled: !!id,
  })
}

export function useBusinessById(id: string) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      const res = await api.get(`/businesses/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCollectorById(id: string) {
  return useQuery({
    queryKey: ['collector', id],
    queryFn: async () => {
      const res = await api.get(`/collectors/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateCollector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/collectors', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCollectors'] })
    },
  })
}

export function useUpdateCollector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/collectors/${id}`, data)
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminCollectors'] })
      queryClient.invalidateQueries({ queryKey: ['collector', variables.id] })
    },
  })
}

export function useAssignZoneCollector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, zoneId }: { id: string; zoneId: string }) => {
      const res = await api.post(`/collectors/${id}/assign-zone`, { zoneId })
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminCollectors'] })
      queryClient.invalidateQueries({ queryKey: ['collector', variables.id] })
    },
  })
}

export function useZoneById(id: string) {
  return useQuery({
    queryKey: ['zone', id],
    queryFn: async () => {
      const res = await api.get(`/zones/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCreateZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/zones', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminZones'] })
    },
  })
}

export function useUpdateZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/zones/${id}`, data)
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminZones'] })
      queryClient.invalidateQueries({ queryKey: ['zone', variables.id] })
    },
  })
}

export function useComplaintById(id: string) {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const res = await api.get(`/complaints/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, resolutionNotes }: { id: string; status: string; resolutionNotes?: string }) => {
      const res = await api.patch(`/complaints/${id}/resolve`, { status, resolutionNote: resolutionNotes })
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] })
    },
  })
}

export function useAddComplaintMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const res = await api.post(`/complaints/${id}/messages`, { message })
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] })
    },
  })
}

export function useAdminNotifications(params?: any) {
  return useQuery({
    queryKey: ['adminNotifications', params],
    queryFn: async () => {
      const res = await api.get('/admin/notifications', { params })
      return res.data.data || []
    },
  })
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/notifications/broadcast', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/admin/notifications/${id}/read`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/notifications/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    },
  })
}

export function useAdminCms(key: string) {
  return useQuery({
    queryKey: ['adminCms', key],
    queryFn: async () => {
      try {
        const res = await api.get(`/cms/${key}`)
        return res.data.data
      } catch (err: any) {
        // If content not found (e.g., fresh DB), return null gracefully
        return null
      }
    },
    enabled: !!key,
  })
}

export function useUpdateAdminCms() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, content }: { key: string; content: any }) => {
      const res = await api.patch(`/cms/${key}`, { content })
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminCms', variables.key] })
    },
  })
}



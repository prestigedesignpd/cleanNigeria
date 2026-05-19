import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAdminPlans(params?: any) {
  return useQuery({
    queryKey: ['adminPlans', params],
    queryFn: async () => {
      const res = await api.get('/plans', { params });
      return res.data.data?.data || res.data.data || [];
    },
  });
}

export function usePlanById(id: string) {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: async () => {
      const res = await api.get(`/plans/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/plans', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/plans/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', variables.id] });
    },
  });
}

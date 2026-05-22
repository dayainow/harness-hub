import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toolService } from '@/services/product.service';
import { GetToolsParams } from '@/models/product';

// 쿼리 키 상수 정의
export const TOOL_KEYS = {
  all: ['products'] as const,
  lists: () => [...TOOL_KEYS.all, 'list'] as const,
  list: (params: GetToolsParams) => [...TOOL_KEYS.lists(), params] as const,
  pending: () => [...TOOL_KEYS.all, 'pending'] as const,
};

// 1. 도구 목록 조회 (모든 도구 또는 필터링)
export function useToolsList(params: GetToolsParams = {}) {
  return useQuery({
    queryKey: TOOL_KEYS.list(params),
    queryFn: async () => {
      const res = await toolService.getTools(params);
      if (!res.success) throw new Error(res.error || 'Failed to fetch products');
      // NestJS res => { success: true, response: { data: { success: true, data: [...] } } }
      const responseData = (res as any).response?.data || (res as any).data;
      return Array.isArray(responseData) ? responseData : (responseData?.data || []);
    },
  });
}

// 2. 승인 대기 목록 조회
export function usePendingTools() {
  return useQuery({
    queryKey: TOOL_KEYS.pending(),
    queryFn: async () => {
      const res = await toolService.getPendingTools();
      if (!res.success) throw new Error(res.error || 'Failed to fetch pending products');
      const responseData = (res as any).response?.data || (res as any).data;
      return Array.isArray(responseData) ? responseData : (responseData?.data || []);
    },
  });
}

// 3. 도구 승인 (Mutation)
export function useApproveTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toolService.approveTool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOOL_KEYS.all });
    },
  });
}

// 4. 도구 반려 (Mutation)
export function useRejectTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toolService.rejectTool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOOL_KEYS.all });
    },
  });
}

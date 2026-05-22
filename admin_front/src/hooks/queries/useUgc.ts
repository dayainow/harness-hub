import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ugcService } from '@/services/ugc.service';
import { GetUgcParams } from '@/models/ugc';

// 쿼리 키 정의
export const UGC_KEYS = {
  prompts: (params: GetUgcParams) => ['prompts', params] as const,
  posts: (params: GetUgcParams) => ['posts', params] as const,
  market: (params: { category?: string }) => ['market', params] as const,
};

// 1. 프롬프트 목록
export function usePromptsList(params: GetUgcParams = {}) {
  return useQuery({
    queryKey: UGC_KEYS.prompts(params),
    queryFn: async () => {
      const res = await ugcService.getPrompts(params);
      if (!res.success) throw new Error(res.error || 'Failed to fetch prompts');
      const data = res.response?.data || res.data;
      return Array.isArray(data) ? data : (data?.data || data?.items || []);
    },
  });
}

// 2. 게시글 목록
export function usePostsList(params: GetUgcParams = {}) {
  return useQuery({
    queryKey: UGC_KEYS.posts(params),
    queryFn: async () => {
      const res = await ugcService.getPosts(params);
      if (!res.success) throw new Error(res.error || 'Failed to fetch posts');
      const data = res.response?.data || res.data;
      return Array.isArray(data) ? data : (data?.data || data?.items || []);
    },
  });
}

// 3. 실험실 목록
export function useLabsList(params: { category?: string } = {}) {
  return useQuery({
    queryKey: UGC_KEYS.market(params),
    queryFn: async () => {
      const res = await ugcService.getLabs(params);
      if (!res.success) throw new Error(res.error || 'Failed to fetch market');
      const data = res.response?.data || res.data;
      return Array.isArray(data) ? data : (data?.data || data?.items || []);
    },
  });
}

// 4. 삭제 Mutations
export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ugcService.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ugcService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ugcService.deleteLab(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

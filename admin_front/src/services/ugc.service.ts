import { apiService } from '@/lib/api';
import { PROMPTS_API, POSTS_API, LABS_API } from '@/constants/api-paths';
import { Prompt, Post, Lab, GetUgcParams } from '@/models/ugc';

class UgcService {
  /**
   * 1. 프롬프트 목록 조회
   */
  async getPrompts(params?: GetUgcParams): Promise<{ success: boolean; data?: { data: Prompt[], total?: number }; error?: string }> {
    const res = await apiService.callWithErrorHandling<{ data: Prompt[], total?: number }>(
      () => apiService.get(PROMPTS_API.PREFIX, { ...params, admin: true }),
      '프롬프트 목록을 가져오는데 실패했습니다.'
    );
    return { success: res.success, data: res.response?.data, error: res.finalMessage };
  }

  /**
   * 2. 게시글 목록 조회
   */
  async getPosts(params?: GetUgcParams): Promise<{ success: boolean; data?: { data: Post[], total?: number }; error?: string }> {
    const res = await apiService.callWithErrorHandling<{ data: Post[], total?: number }>(
      () => apiService.get(POSTS_API.PREFIX, { ...params, admin: true }),
      '게시글 목록을 가져오는데 실패했습니다.'
    );
    return { success: res.success, data: res.response?.data, error: res.finalMessage };
  }

  /**
   * 3. 실험실 목록 조회
   */
  async getLabs(params?: { category?: string }): Promise<{ success: boolean; data?: { data: Lab[] }; error?: string }> {
    const res = await apiService.callWithErrorHandling<{ data: Lab[] }>(
      () => apiService.get(LABS_API.PREFIX, params),
      '실험실 목록을 가져오는데 실패했습니다.'
    );
    return { success: res.success, data: res.response?.data, error: res.finalMessage };
  }

  async deletePrompt(id: string) {
    return apiService.callWithErrorHandling(
      () => apiService.delete(`${PROMPTS_API.PREFIX}/${id}`),
      '프롬프트 삭제에 실패했습니다.'
    );
  }

  async deletePost(id: string) {
    return apiService.callWithErrorHandling(
      () => apiService.delete(`${POSTS_API.PREFIX}/${id}`),
      '게시글 삭제에 실패했습니다.'
    );
  }

  async deleteLab(id: string) {
    return apiService.callWithErrorHandling(
      () => apiService.delete(`${LABS_API.PREFIX}/${id}`),
      '실험실 콘텐츠 삭제에 실패했습니다.'
    );
  }
}

export const ugcService = new UgcService();

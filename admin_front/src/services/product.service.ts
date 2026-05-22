import { apiService } from '@/lib/api';
import { TOOLS_API } from '@/constants/api-paths';
import { Product, GetToolsParams } from '@/models/product';

class ToolService {
  /**
   * 1. 등록된 모든(혹은 조건별) 도구 조회
   */
  async getTools(params?: GetToolsParams): Promise<{ success: boolean; data?: { success: boolean, data: Product[] }; error?: string }> {
    return await apiService.callWithErrorHandling(
      () => apiService.get(TOOLS_API.PREFIX, params),
      '도구 목록을 가져오는데 실패했습니다.'
    ) as any;
  }

  /**
   * 2. 승인 대기 중인 도구 조회
   */
  async getPendingTools(): Promise<{ success: boolean; data?: { success: boolean, data: Product[] }; error?: string }> {
    return await apiService.callWithErrorHandling(
      () => apiService.get(`${TOOLS_API.PREFIX}/pending`),
      '승인 대기중인 도구 목록을 가져오는데 실패했습니다.'
    ) as any;
  }

  /**
   * 3. 도구 승인 처리
   */
  async approveTool(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return await apiService.callWithErrorHandling(
      () => apiService.patch(`${TOOLS_API.ID(id)}/approve`),
      '도구 승인 처리에 실패했습니다.'
    ) as any;
  }

  /**
   * 4. 도구 반려 처리
   */
  async rejectTool(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return await apiService.callWithErrorHandling(
      () => apiService.patch(`${TOOLS_API.ID(id)}/reject`),
      '도구 반려 처리에 실패했습니다.'
    ) as any;
  }
}

export const toolService = new ToolService();


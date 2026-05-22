import { create } from "zustand"
import { apiService } from "@/lib/api"
import {toast} from "sonner";

interface PresignedUrlResponse {
  id: string | number
  presignedUrl: string
  publicUrl: string
  url?: string
}

interface   UploadState {
  // 상태
  loading: boolean
  error: string | null

  // 액션
  postPresignedUrl: (data:{directory:string, filename:string | string[]}) => Promise<PresignedUrlResponse | undefined>
  confirmUpload: (id:number) => Promise<string | undefined>
}

export const useUploadStore = create<UploadState>(() => ({
  // 초기 상태
  loading: false,
  error: null,

  // 파일업로드
   postPresignedUrl:async (data:{directory:string, filename:string | string[]}) => {
    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 300))

      const firstFilename = Array.isArray(data.filename) ? data.filename[0] : data.filename
      const mockId = Date.now()
      const mockUrl = `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(firstFilename)}`

      return {
        id: mockId,
        presignedUrl: mockUrl,
        publicUrl: mockUrl,
        url: mockUrl,
      }
    }

    // Real API mode
    try {
      const response = await apiService.post<{data: PresignedUrlResponse[]}>(`/files/uploadUrls/`, {
        directory: data.directory,
        filenames: Array.isArray(data.filename) ? data.filename : [data.filename]
      });
      if (response.status === 200 || response.status === 201) {
        return response.data.data[0];
      }
    } catch {toast.error('업로드 에러')}
  },
  confirmUpload:async (id:number) => {
    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return `https://via.placeholder.com/800x600.png?text=Uploaded-${id}`
    }

    // Real API mode
    try {
      const requestBody: any = {
        ids: [id]
      };

      const response = await apiService.put<{data: any}>(`/files/uploadUrls/`, requestBody);

      if (response.status === 200 || response.status === 201) {
        const responseData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data
        return responseData?.url || responseData?.publicUrl || 'success';
      }
    } catch (error) {
      console.error('[Confirm Upload] Error:', error);
      toast.error('업로드 확인에 실패했습니다.')
      return undefined;
    }
  },
}))

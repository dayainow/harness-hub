import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";


/**
 * Defines the minimal structure that may contain an error message in server response data.
 */
interface ServerErrorResponseData {
  data?: {
    message?: string | null;
    [key: string]: unknown;
  };

  // Top-level message property
  message?: string;
  // Top-level msg property
  msg?: string;
  // In case the message is nested inside a result object
  result?: {
    msg?: string;
    [key: string]: unknown; // Allow other properties within the result object
  };
  // Allow other top-level properties
  [key: string]: unknown;
}

const BASE_URL: string = import.meta.env.VITE_BASE_URL || "";
const ADMIN_SECRET: string = import.meta.env.VITE_ADMIN_SECRET || "";

class ApiService {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 100000,
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor - Automatically attach token
    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Retrieve token from localStorage (SSR-safe)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['x-admin-secret'] = token;
          }
        }
        if (ADMIN_SECRET && config.headers) {
          config.headers['X-Admin-Secret'] = ADMIN_SECRET;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response Interceptor - Handle 401 errors
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('auth-storage')

            // Show alert dialog then redirect to login page
            window.alert('Session expired. Redirecting to login page.');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }


  public async request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios(config);
  }

  public async callWithErrorHandling<T>(
    apiCall: () => Promise<AxiosResponse<T>>,
    fallbackMessage: string,
    errorPass: boolean = false
  ): Promise<{ success: boolean; response?: AxiosResponse<T>; error?: unknown, finalMessage?: string}> {
    try {
      const response = await apiCall();

      // 2xx status codes are considered successful
      if (response.status >= 200 && response.status < 300) {
        return { success: true, response };
      }

      // Handle non-2xx responses: assert response.data as the declared type
      const serverMessage = (response.data as ServerErrorResponseData)?.msg;
      if (!errorPass) {
        console.error(serverMessage || fallbackMessage);
      }
      return { success: false, response };

    } catch (error) {
      let messageToReturn: string = fallbackMessage; // Initialize the message to return

      if (!errorPass) {
        // Assert the data portion of AxiosError as the declared type
        const axiosError = error as AxiosError<ServerErrorResponseData>;
        const responseData = axiosError.response?.data; // Safe access

        // 1. Primary convention (response.data.data.message)
        const errorMessage = responseData?.data?.message;

        // 2. Check top-level msg (response.data.msg)
        const topLevelMsg = responseData?.msg;

        // Use the first valid message found, or fall back to fallbackMessage
        messageToReturn = errorMessage || topLevelMsg || fallbackMessage;
      }
      return { success: false, error, finalMessage: messageToReturn };
    }
  }

  public get<T = unknown>(url: string, params: object = {}, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "get", url, params, ...options });
  }

  public post<T = unknown>(url: string, data: unknown = {}, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "post", url, data, ...options });
  }

  public patch<T = unknown>(url: string, data: unknown = {}, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "patch", url, data, ...options });
  }

  public put<T = unknown>(url: string, data: unknown = {}, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "put", url, data, ...options });
  }

  public delete<T = unknown>(url: string, data: unknown = {}, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "delete", url, data, ...options });
  }

  public upload(url: string, formData: FormData, onProgress?: (progressEvent: unknown) => void): Promise<AxiosResponse> {
    return this.request({
      method: "post",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    });
  }

  public isExternalUrl(linkUrl: string): boolean {
    if (typeof window === 'undefined' || !linkUrl.startsWith('http')) {
      return false;
    }
    try {
      const url = new URL(linkUrl, window.location.origin);
      const flag = url.searchParams.get('isExternalUrl')?.toLowerCase();

      if (flag === 'true') {
        url.searchParams.delete('isExternalUrl');
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
        return true;
      }
    } catch (error) {
      console.error("isExternalUrl error:", error);
    }
    return false;
  }
}

export const apiService = new ApiService();

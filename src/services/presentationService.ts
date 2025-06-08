import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, isUsingCloudBackend } from '../config/api';

// Types
export interface PresentationRequest {
  script: string;
  options?: Record<string, any>;
  enhanced_mode: boolean;
}

export interface PresentationData {
  title: string;
  slides: number;
  ai_backgrounds: number;
  powerpoint_file: string;
  bucket: string;
  models_used: Record<string, string>;
  json_path?: string;
  background_images?: string[];
  timestamp?: string;
  processing_type?: string;
}

export interface SlideProgress {
  number: number;
  title: string;
  type: string;
  background_status?: string;
}

export interface ProcessingDetails {
  title?: string;
  slides_count?: number;
  current_slide?: SlideProgress;
  progress?: number;
  saving?: string;
}

export interface JobResponse {
  job_id: string;
  status_url: string;
  presentation_data?: PresentationData;
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export interface StatusResponse {
  job_id: string;
  status: JobStatus;
  message?: string;
  result_url?: string;
  presentation_data?: PresentationData;
  processing_details?: ProcessingDetails;
}

class PresentationService {
  private api: AxiosInstance;
  private pollingIntervals: Map<string, number>;
  private presentationDataCache: Map<string, PresentationData>;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });
    this.pollingIntervals = new Map();
    this.presentationDataCache = new Map();

    // Add response interceptor for better error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response?.data || error.message);
        
        // Different error handling for cloud vs local
        if (isUsingCloudBackend()) {
          if (error.response?.status === 404) {
            throw new Error('API endpoint not found. The backend service might be starting up.');
          }
          if (error.response?.status === 503) {
            throw new Error('Backend service is temporarily unavailable. Please try again in a moment.');
          }
        } else {
          if (error.response?.status === 404) {
            throw new Error('API endpoint not found. Please check if the backend server is running locally.');
          }
        }
        
        throw error;
      }
    );

    // Log the configuration for debugging
    console.log('API Configuration:', {
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      isCloudBackend: isUsingCloudBackend(),
    });
  }

  async createPresentation(request: PresentationRequest): Promise<JobResponse> {
    try {
      console.log('Creating presentation with request:', request);
      const response = await this.api.post<JobResponse>('/api/v1/presentations', request);
      console.log('Create presentation response:', response.data);
      
      // Cache presentation data if available
      if (response.data.presentation_data) {
        this.presentationDataCache.set(response.data.job_id, response.data.presentation_data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to create presentation:', error);
      throw this.handleError(error);
    }
  }

  async getPresentationStatus(jobId: string): Promise<StatusResponse> {
    try {
      console.log('Checking status for job:', jobId);
      const response = await this.api.get<StatusResponse>(`/api/v1/presentations/status/${jobId}`);
      console.log('Status response:', response.data);
      
      // Add cached presentation data to the response if available
      if (this.presentationDataCache.has(jobId)) {
        response.data.presentation_data = this.presentationDataCache.get(jobId);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to get presentation status:', error);
      throw this.handleError(error);
    }
  }

  async getPresentation(resultUrl: string): Promise<PresentationData> {
    try {
      console.log('Fetching presentation details from:', resultUrl);
      const response = await this.api.get<PresentationData>(resultUrl);
      console.log('Presentation details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch presentation details:', error);
      throw this.handleError(error);
    }
  }

  startPolling(jobId: string, callbacks: {
    onProgress?: (status: StatusResponse) => void;
    onSuccess?: (status: StatusResponse, presentationData?: PresentationData) => void;
    onError?: (error: Error) => void;
  }): void {
    // Clear any existing polling for this job
    this.stopPolling(jobId);

    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const poll = async () => {
      try {
        const status = await this.getPresentationStatus(jobId);
        retryCount = 0; // Reset retry count on successful request
        
        if (callbacks.onProgress) {
          callbacks.onProgress(status);
        }

        if (status.status === JobStatus.SUCCESS) {
          // Use presentation data from cache or status response
          let presentationData = status.presentation_data;
          
          // If not available and we have a result URL, try to fetch it
          if (!presentationData && status.result_url) {
            try {
              presentationData = await this.getPresentation(status.result_url);
              // Cache the fetched data
              if (presentationData) {
                this.presentationDataCache.set(jobId, presentationData);
              }
            } catch (error) {
              console.warn('Could not fetch presentation details:', error);
            }
          }

          if (callbacks.onSuccess) {
            callbacks.onSuccess(status, presentationData);
          }
          this.stopPolling(jobId);
        } else if (status.status === JobStatus.FAILURE) {
          throw new Error(status.message || 'Presentation generation failed');
        }
      } catch (error) {
        console.error('Polling error:', error);
        
        // Handle 404 errors specially - the server might have restarted
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          retryCount++;
          if (retryCount <= MAX_RETRIES) {
            console.log(`Server might have restarted. Retry ${retryCount}/${MAX_RETRIES} in ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return; // Continue polling
          }
          
          // If we've run out of retries but have cached data, consider it a success
          const cachedData = this.presentationDataCache.get(jobId);
          if (cachedData && callbacks.onSuccess) {
            console.log('Using cached presentation data after server restart');
            callbacks.onSuccess({ 
              job_id: jobId, 
              status: JobStatus.SUCCESS,
              presentation_data: cachedData
            }, cachedData);
            this.stopPolling(jobId);
            return;
          }
        }
        
        if (callbacks.onError) {
          callbacks.onError(error as Error);
        }
        this.stopPolling(jobId);
      }
    };

    // Start polling every 3 seconds
    const interval = window.setInterval(poll, 3000);
    this.pollingIntervals.set(jobId, interval);

    // Initial poll
    poll();
  }

  stopPolling(jobId: string): void {
    const interval = this.pollingIntervals.get(jobId);
    if (interval) {
      window.clearInterval(interval);
      this.pollingIntervals.delete(jobId);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.detail) {
        // Handle FastAPI validation errors
        const detail = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail[0]?.msg 
          : error.response.data.detail;
        return new Error(`API Error: ${detail}`);
      }
      return new Error(error.message);
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export const presentationService = new PresentationService(); 
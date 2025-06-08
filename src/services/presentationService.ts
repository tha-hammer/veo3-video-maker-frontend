import axios, { AxiosInstance } from 'axios';

// Types
export interface PresentationRequest {
  script: string;
  options?: Record<string, any>;
  enhanced_mode: boolean;
}

export interface JobResponse {
  job_id: string;
  status_url: string;
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
}

class PresentationService {
  private api: AxiosInstance;
  private pollingIntervals: Map<string, number>;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.pollingIntervals = new Map();
  }

  async createPresentation(request: PresentationRequest): Promise<JobResponse> {
    try {
      const response = await this.api.post<JobResponse>('/presentations', request);
      return response.data;
    } catch (error) {
      console.error('Failed to create presentation:', error);
      throw this.handleError(error);
    }
  }

  async getPresentationStatus(jobId: string): Promise<StatusResponse> {
    try {
      const response = await this.api.get<StatusResponse>(`/presentations/status/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get presentation status:', error);
      throw this.handleError(error);
    }
  }

  startPolling(jobId: string, callbacks: {
    onProgress?: (status: StatusResponse) => void;
    onSuccess?: (status: StatusResponse) => void;
    onError?: (error: Error) => void;
  }): void {
    // Clear any existing polling for this job
    this.stopPolling(jobId);

    const poll = async () => {
      try {
        const status = await this.getPresentationStatus(jobId);
        
        if (callbacks.onProgress) {
          callbacks.onProgress(status);
        }

        if (status.status === JobStatus.SUCCESS) {
          if (callbacks.onSuccess) {
            callbacks.onSuccess(status);
          }
          this.stopPolling(jobId);
        } else if (status.status === JobStatus.FAILURE) {
          throw new Error(status.message || 'Presentation generation failed');
        }
      } catch (error) {
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
      const message = error.response?.data?.detail || error.message;
      return new Error(`API Error: ${message}`);
    }
    return error;
  }
}

export const presentationService = new PresentationService(); 
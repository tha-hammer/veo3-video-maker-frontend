// src/config/api.ts
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    headers: {
      'Content-Type': 'application/json',
    },
  } as const;
  
  export const getApiUrl = (endpoint: string): string => {
    const baseUrl = API_CONFIG.baseURL.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  };
  
  // Helper to check if we're in production
  export const isProduction = (): boolean => {
    return import.meta.env.PROD;
  };
  
  // Helper to check if we're using cloud backend
  export const isUsingCloudBackend = (): boolean => {
    return API_CONFIG.baseURL.includes('run.app');
  };
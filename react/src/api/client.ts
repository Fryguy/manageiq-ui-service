import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

/**
 * API Client for ManageIQ REST API
 *
 * Implements session-token authentication via X-Auth-Token header
 * and handles 401 responses by triggering session teardown.
 *
 * Based on the Angular implementation in:
 * - client/app/core/session.service.js (setAuthToken, getUserAuthorizations)
 * - client/app/core/authorization.config.js (401 handling)
 */

export interface ApiClientConfig {
  baseURL?: string;
  getToken: () => string | null;
  onUnauthorized: () => void;
}

export class ApiClient {
  private client: AxiosInstance;
  private getToken: () => string | null;
  private onUnauthorized: () => void;

  constructor(config: ApiClientConfig) {
    this.getToken = config.getToken;
    this.onUnauthorized = config.onUnauthorized;

    this.client = axios.create({
      baseURL: config.baseURL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: Add X-Auth-Token header
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['X-Auth-Token'] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle 401 responses
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Get the underlying Axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Singleton instance (will be initialized in store setup)
let apiClientInstance: ApiClient | null = null;

/**
 * Initialize the API client singleton
 */
export function initializeApiClient(config: ApiClientConfig): ApiClient {
  apiClientInstance = new ApiClient(config);
  return apiClientInstance;
}

/**
 * Get the API client singleton instance
 */
export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call initializeApiClient first.');
  }
  return apiClientInstance;
}

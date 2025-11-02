// Cliente HTTP usando fetch nativo
// Base URL já inclui /api - todos os endpoints devem começar com /
const API_BASE_URL = 'http://localhost:8080/api';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(requiresAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = false, ...fetchConfig } = config;

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(requiresAuth);

    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...headers,
        ...fetchConfig.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Erro ao processar requisição',
      }));
      throw new Error(error.message || `Erro HTTP: ${response.status}`);
    }

    // Se for 204 No Content, não tenta fazer parse do JSON
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

export const httpClient = new HttpClient(API_BASE_URL);


import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (!baseURL) {
    throw new ApiError('NEXT_PUBLIC_API_BASE_URL is not configured', 0);
  }

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    const message = data?.detail ?? data?.message ?? (status === 0 ? 'Unable to connect to the server.' : error.message);
    return Promise.reject(new ApiError(message, status, data?.errors));
  },
);

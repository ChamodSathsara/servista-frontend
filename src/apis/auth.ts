import { api, ApiError } from './http';

export { ApiError } from './http';

export interface LoginRequest {
  email: string;
  password: string;
  deviceLabel?: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: number;
  userName: string;
  email: string;
  role: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>('/api/auth/login', request);
    return data;
  } catch (error) {
    if (error instanceof ApiError && !error.message) {
      throw new ApiError('Login failed. Please try again.', error.status, error.fieldErrors);
    }
    throw error;
  }
}

export function saveLoginSession(data: LoginResponse, persistent = true): void {
  const storage = persistent ? localStorage : sessionStorage;

  storage.setItem('accessToken', data.accessToken);
  storage.setItem('refreshToken', data.refreshToken);
  storage.setItem('accessTokenExpiresAt', data.expiresAt);
  storage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
  storage.setItem(
    'currentUser',
    JSON.stringify({
      userId: data.userId,
      userName: data.userName,
      email: data.email,
      role: data.role,
    }),
  );
}

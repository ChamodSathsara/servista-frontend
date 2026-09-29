const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

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

interface ApiErrorResponse {
  detail?: string;
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

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<LoginResponse> & ApiErrorResponse;

  if (!response.ok) {
    throw new ApiError(data.detail || 'Login failed. Please try again.', response.status, data.errors);
  }

  return data as LoginResponse;
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

import { api } from './http';

export interface RepResponse {
  repId: number;
  repCode: string;
  repName: string;
  repMobileNumber: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: number | null;
}

export interface RepRequest {
  repCode: string;
  repName: string;
  repMobileNumber: string | null;
  isActive: boolean;
  createdBy: number;
}

export async function getReps(): Promise<RepResponse[]> {
  const { data } = await api.get<RepResponse[]>('/api/reps');
  return data;
}

export async function createRep(request: RepRequest): Promise<RepResponse> {
  const { data } = await api.post<RepResponse>('/api/reps', request);
  return data;
}

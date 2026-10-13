import { api } from './http';

export interface DealerResponse {
  dealerId: number;
  dealerName: string;
  dealerAddress: string | null;
  dealerContactNumber: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: number | null;
}

export interface DealerRequest {
  dealerName: string;
  dealerAddress: string | null;
  dealerContactNumber: string | null;
  isActive: boolean;
  createdBy: number;
}

export const getDealers = async () =>
  (await api.get<DealerResponse[]>('/api/dealers')).data;

export const createDealer = async (request: DealerRequest) =>
  (await api.post<DealerResponse>('/api/dealers', request)).data;

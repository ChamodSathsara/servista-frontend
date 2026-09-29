import { api } from './http';

export type SalesmanCompany = 'GESTETNER' | 'FINTECH';
export type SalesmanDivision = 'OUTRIGHT' | 'RENTAL';
export type SalesmanArea = 'COLOMBO' | 'SUBURB';

export interface SalesmanUser {
  userId: number;
  userName: string;
  mobileNumber: string;
  email: string;
  isActive: boolean;
  division: SalesmanDivision;
  area: SalesmanArea;
  role: 'SALESMAN';
  createdAt: string;
  createdBy: number;
}

export interface SalesmanResponse {
  user: SalesmanUser;
  salesmanId: number;
  salesmanCode: string;
  company: SalesmanCompany;
  companies: SalesmanCompany[];
}

export interface CreateSalesmanRequest {
  userName: string;
  mobileNumber: string;
  email: string;
  password: string;
  isActive: boolean;
  division: SalesmanDivision;
  area: SalesmanArea;
  createdBy: number;
  companies: SalesmanCompany[];
  salesmanCode: string;
  company: SalesmanCompany;
}

export interface UpdateSalesmanRequest extends Omit<CreateSalesmanRequest, 'createdBy' | 'companies' | 'password'> {
  password?: string;
  updatedBy: number;
}

export async function getSalesmen(): Promise<SalesmanResponse[]> {
  const { data } = await api.get<SalesmanResponse[]>('/api/users/salesman');
  return data;
}

export async function getSalesman(salesmanId: number): Promise<SalesmanResponse> {
  const { data } = await api.get<SalesmanResponse>(`/api/users/salesman/${salesmanId}`);
  return data;
}

export async function createSalesman(request: CreateSalesmanRequest): Promise<SalesmanResponse> {
  const { data } = await api.post<SalesmanResponse>('/api/users/salesman', request);
  return data;
}

export async function updateSalesman(salesmanId: number, request: UpdateSalesmanRequest): Promise<SalesmanResponse> {
  const { data } = await api.put<SalesmanResponse>(`/api/users/salesman/${salesmanId}`, request);
  return data;
}

export async function deleteSalesman(salesmanId: number): Promise<void> {
  await api.delete(`/api/users/salesman/${salesmanId}`);
}

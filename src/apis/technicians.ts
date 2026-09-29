import { api } from './http';

export type TechnicianCompany = 'GESTETNER' | 'FINTECH';
export type TechnicianDivision = 'OUTRIGHT' | 'RENTAL' | 'WORKSHOP';
export type TechnicianArea = 'COLOMBO' | 'SUBURB';
export type TechnicianRole = 'TECHNICIAN' | 'TEAM_LEADER' | 'WORKSHOP_TECHNICIAN';

export interface TechnicianUser {
  userId: number;
  userName: string;
  mobileNumber: string;
  email: string;
  isActive: boolean;
  division: TechnicianDivision;
  area: TechnicianArea;
  role: 'TECHNICIAN';
  createdAt: string;
  createdBy: number;
}

export interface TechnicianResponse {
  user: TechnicianUser;
  technicianId: number;
  techCode: string;
  technicianRole: TechnicianRole;
  companies: TechnicianCompany[];
}

export interface CreateTechnicianRequest {
  userName: string;
  mobileNumber: string;
  email: string;
  password: string;
  isActive: boolean;
  division: TechnicianDivision;
  area: TechnicianArea;
  createdBy: number;
  companies: TechnicianCompany[];
  techCode: string;
  technicianRole: TechnicianRole;
}

export interface UpdateTechnicianRequest extends Omit<CreateTechnicianRequest, 'createdBy' | 'companies' | 'password'> {
  password?: string | null;
  updatedBy: number;
}

export async function getTechnicians(): Promise<TechnicianResponse[]> {
  const { data } = await api.get<TechnicianResponse[]>('/api/users/technician');
  return data;
}

export async function getTechnician(technicianId: number): Promise<TechnicianResponse> {
  const { data } = await api.get<TechnicianResponse>(`/api/users/technician/${technicianId}`);
  return data;
}

export async function createTechnician(request: CreateTechnicianRequest): Promise<TechnicianResponse> {
  const { data } = await api.post<TechnicianResponse>('/api/users/technician', request);
  return data;
}

export async function updateTechnician(technicianId: number, request: UpdateTechnicianRequest): Promise<TechnicianResponse> {
  const { data } = await api.put<TechnicianResponse>(`/api/users/technician/${technicianId}`, request);
  return data;
}

export async function deleteTechnician(technicianId: number): Promise<void> {
  await api.delete(`/api/users/technician/${technicianId}`);
}

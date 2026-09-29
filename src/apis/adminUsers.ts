import { api } from './http';

export type AdminUserCompany = 'GESTETNER' | 'FINTECH';
export type AdminUserDivision = 'RENTAL' | 'OUTRIGHT' | 'WORKSHOP' | 'AC' | 'PRODUCTION' | 'ELECTRONIC';
export type AdminUserArea = 'COLOMBO' | 'OUTSTATION' | 'SUBURB';
export type CoordinatorRole = 'AREA_MANAGER' | 'MANAGER' | 'DATA_ENTRY_OPERATOR';
export type ManagedUserKind = 'coordinator' | 'finance';

export interface AdminUserDetails { userId: number; userName: string; mobileNumber: string; email: string; isActive: boolean; division: AdminUserDivision; area: AdminUserArea; role: 'COORDINATOR' | 'FINANCE'; createdAt: string; createdBy: number }
export interface CoordinatorResponse { user: AdminUserDetails; coordinatorId: number; coordinatorRole: CoordinatorRole; companies: AdminUserCompany[] }
export interface FinanceResponse { user: AdminUserDetails; financeId: number; companies: AdminUserCompany[] }
export type ManagedUserResponse = CoordinatorResponse | FinanceResponse;

export interface ManagedUserCreateRequest { userName: string; mobileNumber: string; email: string; password: string; isActive: boolean; division: AdminUserDivision; area: AdminUserArea; createdBy: number; companies: AdminUserCompany[]; coordinatorRole?: CoordinatorRole }
export interface ManagedUserUpdateRequest { userName: string; mobileNumber: string; email: string; password?: string; isActive: boolean; division: AdminUserDivision; area: AdminUserArea; updatedBy: number; coordinatorRole?: CoordinatorRole }

const base = (kind: ManagedUserKind) => `/api/users/${kind}`;
export const getManagedUsers = async (kind: ManagedUserKind) => (await api.get<ManagedUserResponse[]>(base(kind))).data;
export const getManagedUser = async (kind: ManagedUserKind, id: number) => (await api.get<ManagedUserResponse>(`${base(kind)}/${id}`)).data;
export const createManagedUser = async (kind: ManagedUserKind, request: ManagedUserCreateRequest) => (await api.post<ManagedUserResponse>(base(kind), request)).data;
export const updateManagedUser = async (kind: ManagedUserKind, id: number, request: ManagedUserUpdateRequest) => (await api.put<ManagedUserResponse>(`${base(kind)}/${id}`, request)).data;
export const deleteManagedUser = async (kind: ManagedUserKind, id: number) => { await api.delete(`${base(kind)}/${id}`); };
export const managedUserId = (kind: ManagedUserKind, user: ManagedUserResponse) => kind === 'coordinator' ? (user as CoordinatorResponse).coordinatorId : (user as FinanceResponse).financeId;

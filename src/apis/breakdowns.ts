import { api } from './http';

export type BreakdownReportedByType = 'PORTAL_CONTACT' | 'DATA_ENTRY_OPERATOR' | 'TECHNICIAN' | 'DEALER' | 'SALESMAN';
export type BreakdownStatus = 'PROCESSING' | 'ASSIGNED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

export interface BreakdownResponse {
  breakdownId: number; breakdownNumber: string; machineId: number; machineReferenceNumber: string;
  customerSiteId: number; siteName: string; reportedByType: BreakdownReportedByType;
  reportedByPortalAccountId: number | null; reportedByUserId: number | null; reportedNote: string | null;
  informedSolutionTypeId: number | null; status: BreakdownStatus; approvedBy: number | null; approvedAt: string | null;
  startNote: string | null; startedAt: string | null; actualSolutionTypeId: number | null; solutionNote: string | null;
  completedAt: string | null; cancelledBy: number | null; cancelledAt: string | null; cancelReason: string | null;
  createdAt: string; expectedCompletionAt: string | null; contactEmail: string;
}

export interface TechnicianAssignmentResponse {
  assignmentId: number; breakdownId: number; technicianId: number; assignedAt: string; assignedBy: number;
  unassignedAt: string | null; assignmentStatus: string; reason: string | null;
}

export interface CreateBreakdownRequest {
  breakdown: {
    machineId: number; customerSiteId: number; reportedByType: BreakdownReportedByType;
    reportedByPortalAccountId: number | null; reportedByUserId: number | null; reportedNote: string | null;
    informedSolutionTypeId: number | null; status: 'PROCESSING'; approvedBy: number | null; startNote: null;
    actualSolutionTypeId: null; solutionNote: null; cancelledBy: null; cancelReason: null;
    expectedCompletionAt: string | null; contactEmail: string;
  };
  technicianAssignment: { technicianId: number; assignedBy: number; assignmentStatus: 'CURRENT'; reason: string | null };
}

export interface CreateBreakdownResponse { breakdown: BreakdownResponse; technicianAssignment: TechnicianAssignmentResponse }

export const getBreakdowns = async () => (await api.get<BreakdownResponse[]>('/api/breakdowns')).data;
export const getBreakdown = async (id: number) => (await api.get<BreakdownResponse>(`/api/breakdowns/${id}`)).data;
export const createBreakdown = async (request: CreateBreakdownRequest) => (await api.post<CreateBreakdownResponse>('/api/breakdowns', request)).data;
export const changeBreakdownTechnician = async (id: number, request: { technicianId: number; assignedBy: number; reason: string | null }) =>
  (await api.patch<TechnicianAssignmentResponse>(`/api/breakdowns/${id}/technician`, request)).data;
export const cancelBreakdown = async (id: number, request: { cancelledBy: number; cancelReason: string }) =>
  (await api.patch<BreakdownResponse>(`/api/breakdowns/${id}/cancel`, request)).data;

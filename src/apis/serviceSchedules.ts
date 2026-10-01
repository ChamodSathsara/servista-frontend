import { api } from './http';

export type ServiceVisitStatus =
  | 'SCHEDULED'
  | 'DUE'
  | 'STARTED'
  | 'COMPLETED'
  | 'RECALLED'
  | 'CANCELLED';

export interface ServiceScheduleResponse {
  serviceScheduleId: number;
  agreementId: number;
  agreementNumber: string;
  machineId: number;
  machineReferenceNumber: string;
  agreementYearNumber: number;
  visitNumber: number;
  expectedVisitDate: string;
  scheduledDate: string | null;
  actualVisitDate: string | null;
  status: ServiceVisitStatus;
  assignedTechnicianId: number | null;
  assignedTechnicianName: string | null;
  startNote: string | null;
  startedAt: string | null;
  completedAt: string | null;
  solutionTypeId: number | null;
  solutionNote: string | null;
  createdAt: string;
}

export const getServiceSchedules = async () =>
  (await api.get<ServiceScheduleResponse[]>('/api/service-schedules')).data;

export const getServiceSchedule = async (scheduleId: number) =>
  (await api.get<ServiceScheduleResponse>(`/api/service-schedules/${scheduleId}`)).data;

export const getServiceSchedulesByAgreement = async (agreementId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/agreement/${agreementId}`)).data;

export const getServiceSchedulesByMachine = async (machineId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/machine/${machineId}`)).data;

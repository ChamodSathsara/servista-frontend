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

export interface StartServiceScheduleRequest {
  startNote: string;
  meterCounterTypeId: number;
  meterReading: number;
  capturedByUserId: number;
  meterReadingNote: string | null;
}

export interface CompleteServiceScheduleRequest {
  solutionTypeId: number;
  solutionNote: string;
}

export interface ServiceVisitStartResponse {
  serviceSchedule: ServiceScheduleResponse;
  meterReading: {
    meterReadingId: number;
    machineId: number;
    meterCounterTypeId: number;
    readingValue: number;
    readingDatetime: string;
    sourceCode: 'SERVICE';
    serviceScheduleId: number;
    capturedByUserId: number;
    note: string | null;
    createdAt: string;
  };
}

export const getServiceSchedules = async () =>
  (await api.get<ServiceScheduleResponse[]>('/api/service-schedules')).data;

export const getServiceSchedule = async (scheduleId: number) =>
  (await api.get<ServiceScheduleResponse>(`/api/service-schedules/${scheduleId}`)).data;

export const getServiceSchedulesByAgreement = async (agreementId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/agreement/${agreementId}`)).data;

export const getServiceSchedulesByMachine = async (machineId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/machine/${machineId}`)).data;

export const startServiceSchedule = async (scheduleId: number, request: StartServiceScheduleRequest) =>
  (await api.patch<ServiceVisitStartResponse>(`/api/service-schedules/${scheduleId}/start`, request)).data;

export const completeServiceSchedule = async (scheduleId: number, request: CompleteServiceScheduleRequest) =>
  (await api.patch<ServiceScheduleResponse>(`/api/service-schedules/${scheduleId}/complete`, request)).data;

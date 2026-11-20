import { api } from './http';
import { getCurrentUser, isTechnician } from '../utils/session';

const scheduleBase = () => isTechnician(getCurrentUser())
  ? '/api/technician/me/service-schedules'
  : '/api/service-schedules';

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

export interface ServiceSchedulePage {
  content: ServiceScheduleResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ServiceSchedulePageParams {
  page?: number;
  size?: number;
  search?: string;
  status?: ServiceVisitStatus;
}

export const getServiceSchedules = async (params: ServiceSchedulePageParams = {}): Promise<ServiceSchedulePage> => {
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  if (isTechnician(getCurrentUser())) {
    const all = (await api.get<ServiceScheduleResponse[]>(scheduleBase())).data;
    const search = params.search?.trim().toLowerCase();
    const filtered = all.filter((visit) =>
      (!search || visit.machineReferenceNumber.toLowerCase().includes(search))
      && (!params.status || visit.status === params.status));
    const content = filtered.slice(page * size, (page + 1) * size);
    const totalPages = Math.ceil(filtered.length / size);
    return { content, totalElements: filtered.length, totalPages, number: page, size, first: page === 0, last: page + 1 >= totalPages };
  }
  return (await api.get<ServiceSchedulePage>('/api/service-schedules', { params: {
    page, size, search: params.search?.trim() || undefined, status: params.status,
  } })).data;
};

export const getServiceSchedule = async (scheduleId: number) =>
  (await api.get<ServiceScheduleResponse>(`${scheduleBase()}/${scheduleId}`)).data;

export const getServiceSchedulesByAgreement = async (agreementId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/agreement/${agreementId}`)).data;

export const getServiceSchedulesByMachine = async (machineId: number) =>
  (await api.get<ServiceScheduleResponse[]>(`/api/service-schedules/machine/${machineId}`)).data;

export const startServiceSchedule = async (scheduleId: number, request: StartServiceScheduleRequest) =>
  (await api.patch<ServiceVisitStartResponse>(`${scheduleBase()}/${scheduleId}/start`, request)).data;

export const completeServiceSchedule = async (scheduleId: number, request: CompleteServiceScheduleRequest) =>
  (await api.patch<ServiceScheduleResponse>(`${scheduleBase()}/${scheduleId}/complete`, request)).data;

import { api } from './http';

export interface MeterReadingResponse {
  meterReadingId: number;
  machineId: number;
  machineReferenceNumber: string;
  meterCounterTypeId: number;
  counterCode: string;
  counterName: string;
  readingValue: number;
  readingDatetime: string;
  sourceCode: string;
  installationSubmissionId: number | null;
  serviceScheduleId: number | null;
  breakdownId: number | null;
  capturedByUserId: number | null;
  capturedByPortalAccountId: number | null;
  note: string | null;
  createdAt: string;
}

export const getMeterReadingsByMachineReference = async (machineReferenceNumber: string) =>
  (await api.get<MeterReadingResponse[]>(
    `/api/meter-readings/machine/${encodeURIComponent(machineReferenceNumber)}`,
  )).data;

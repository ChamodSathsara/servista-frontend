import { api } from './http';
import { getCurrentUser, isTechnician } from '../utils/session';

const installationBase = () => isTechnician(getCurrentUser())
  ? '/api/technician/me/installation-jobs'
  : '/api/installation-jobs';

export type InstallationJobStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface InstallationStatusHistory {
  installationStatusHistoryId: number;
  previousStatus: string | null;
  newStatus: InstallationJobStatus;
  changedAt: string;
  changedBy: number;
  note: string | null;
}

export interface InstallationJobResponse {
  installationJobId: number;
  jobNumber: string;
  company: string;
  division: string;
  customerId: number;
  customerName: string;
  customerSiteId: number;
  siteName: string;
  machineInvoiceId: number;
  invoiceNumber: string;
  dealerId: number | null;
  repId: number | null;
  assignedTechnicianId: number;
  technicianName: string;
  expectedInstallDate: string | null;
  status: InstallationJobStatus;
  createdBy: number;
  createdAt: string;
  statusHistory: InstallationStatusHistory[];
}

export const getInstallationJobs = async () =>
  (await api.get<InstallationJobResponse[]>(installationBase())).data;

export const getInstallationJob = async (jobId: number) =>
  (await api.get<InstallationJobResponse>(`${installationBase()}/${jobId}`)).data;

export interface CompleteInstallationJobRequest {
  performedBy: number;
  note: string | null;
}

export const completeInstallationJob = async (
  jobId: number,
  request: CompleteInstallationJobRequest,
) => (await api.post<InstallationJobResponse>(
  `${installationBase()}/${jobId}/complete`,
  request,
)).data;

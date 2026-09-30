import { api } from './http';

export interface InstallationStatusHistory {
  installationStatusHistoryId: number;
  previousStatus: string | null;
  newStatus: string;
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
  dealerId: number;
  repId: number;
  assignedTechnicianId: number;
  technicianName: string;
  expectedInstallDate: string | null;
  status: string;
  createdBy: number;
  createdAt: string;
  statusHistory: InstallationStatusHistory[];
}

export const getInstallationJobs = async () =>
  (await api.get<InstallationJobResponse[]>('/api/installation-jobs')).data;

export const getInstallationJob = async (jobId: number) =>
  (await api.get<InstallationJobResponse>(`/api/installation-jobs/${jobId}`)).data;

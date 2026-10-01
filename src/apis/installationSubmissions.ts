import { api } from './http';

export type AgreementTypeRequested = 'FS' | 'MA' | 'NS';
export type SubmissionVerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface InstallationSubmissionRequest {
  installationJobId: number;
  machineId: number;
  modelId: number;
  customerSiteId: number;
  siteContactId: number;
  installDate: string;
  initialMeterReading: number | null;
  agreementTypeRequested: AgreementTypeRequested | null;
  warrantyNote: string | null;
  submittedBy: number;
  verificationStatus: SubmissionVerificationStatus;
  verifiedBy: number | null;
  verificationNote: string | null;
  statusNote: string | null;
}

export interface InstallationSubmissionResponse {
  installationSubmissionId: number;
  installationJobId: number;
  jobNumber: string;
  jobStatus: string;
  machineId: number;
  machineReferenceNumber: string;
  modelId: number;
  modelNumber: string;
  customerSiteId: number;
  siteName: string;
  siteContactId: number;
  contactName: string;
  installDate: string;
  initialMeterReading: number | null;
  agreementTypeRequested: AgreementTypeRequested | null;
  warrantyNote: string | null;
  submittedBy: number;
  submittedAt: string;
  verificationStatus: SubmissionVerificationStatus;
  verifiedBy: number | null;
  verifiedAt: string | null;
  verificationNote: string | null;
}

export const createInstallationSubmission = async (request: InstallationSubmissionRequest) =>
  (await api.post<InstallationSubmissionResponse>('/api/installation-submissions', request)).data;

export const getInstallationSubmissions = async () =>
  (await api.get<InstallationSubmissionResponse[]>('/api/installation-submissions')).data;

export const getInstallationSubmission = async (submissionId: number) =>
  (await api.get<InstallationSubmissionResponse>(`/api/installation-submissions/${submissionId}`)).data;

export const updateInstallationSubmission = async (submissionId: number, request: InstallationSubmissionRequest) =>
  (await api.put<InstallationSubmissionResponse>(`/api/installation-submissions/${submissionId}`, request)).data;

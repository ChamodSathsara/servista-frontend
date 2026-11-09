import { api } from './http';

export type AgreementReportType = 'ns' | 'fs' | 'ma';
export type ReportArea = 'COLOMBO' | 'OUTSTATION' | 'SUBURB';
export type ReportDivision = 'RENTAL' | 'OUTRIGHT' | 'WORKSHOP' | 'AC' | 'PRODUCTION' | 'ELECTRONIC';
export type ReportCompany = 'GESTETNER' | 'FINTECH';

export interface MachineAgreementReportRow {
  agreementId: number;
  agreementNumber: string;
  agreementType: 'NS' | 'FS' | 'MA';
  agreementStatus: string;
  agreementStartDate: string;
  agreementEndDate: string;
  annualPayment: number | null;
  fullPayment: number | null;
  machineId: number;
  machineReferenceNumber: string;
  serialNumber: string;
  modelNumber: string | null;
  modelName: string | null;
  customerId: number | null;
  customerName: string | null;
  customerSiteId: number | null;
  siteName: string | null;
  area: ReportArea | null;
  mainTechnicianId: number | null;
  mainTechnicianName: string | null;
  division: ReportDivision | null;
}

export interface ReportPage {
  content: MachineAgreementReportRow[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type BreakdownReportStatus = 'ASSIGNED' | 'STARTED' | 'COMPLETED' | 'RECALL' | 'CANCELLED';
export type BreakdownAgreementType = 'FS' | 'MA' | 'NS';

export interface BreakdownJobReportRow {
  breakdownId: number;
  breakdownNumber: string;
  machineReferenceNumber: string;
  serialNumber: string;
  company: ReportCompany;
  division: ReportDivision;
  customerName: string | null;
  siteName: string;
  area: ReportArea;
  agreementType: BreakdownAgreementType | null;
  agreementStatus: string | null;
  jobStatus: BreakdownReportStatus;
  technicianCode: string | null;
  technicianName: string | null;
  reportedNote: string | null;
  solutionNote: string | null;
  contactEmail: string;
  expectedCompletionAt: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  responseTimeHours: number | null;
}

export interface BreakdownReportFilters {
  company?: ReportCompany;
  division?: ReportDivision;
  area?: ReportArea;
  agreementType?: BreakdownAgreementType;
  jobStatus?: BreakdownReportStatus;
  search?: string;
  page: number;
  size: number;
}

export interface BreakdownReportPage {
  content: BreakdownJobReportRow[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ReportFilters {
  startDate: string;
  lastDate: string;
  area?: ReportArea;
  mainTechnicianId?: number;
  division?: ReportDivision;
  company?: ReportCompany;
  page: number;
  size: number;
}

const params = (filters: ReportFilters) => ({
  startDate: filters.startDate,
  lastDate: filters.lastDate,
  area: filters.area || undefined,
  mainTechnicianId: filters.mainTechnicianId || undefined,
  division: filters.division || undefined,
  company: filters.company || undefined,
  page: filters.page,
  size: filters.size,
});

export async function getAgreementReport(type: AgreementReportType, filters: ReportFilters): Promise<ReportPage> {
  const { data } = await api.get<ReportPage>(`/api/reports/machine-agreements/${type}`, { params: params(filters) });
  return data;
}

export async function downloadAgreementReport(
  type: AgreementReportType,
  format: 'pdf' | 'excel',
  filters: ReportFilters,
): Promise<void> {
  const response = await api.get<Blob>(`/api/reports/machine-agreements/${type}/${format}`, {
    params: params(filters),
    responseType: 'blob',
  });
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${type}-machine-agreements.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

const breakdownParams = (filters: BreakdownReportFilters) => ({
  company: filters.company || undefined,
  division: filters.division || undefined,
  area: filters.area || undefined,
  agreementType: filters.agreementType || undefined,
  jobStatus: filters.jobStatus || undefined,
  search: filters.search?.trim() || undefined,
  page: filters.page,
  size: filters.size,
});

export async function getBreakdownJobReport(filters: BreakdownReportFilters): Promise<BreakdownReportPage> {
  const { data } = await api.get<BreakdownReportPage>('/api/reports/breakdown-jobs', { params: breakdownParams(filters) });
  return data;
}

export async function downloadBreakdownJobReport(format: 'pdf' | 'excel', filters: BreakdownReportFilters): Promise<void> {
  const response = await api.get<Blob>(`/api/reports/breakdown-jobs/${format}`, {
    params: breakdownParams(filters),
    responseType: 'blob',
  });
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `breakdown-job-report.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

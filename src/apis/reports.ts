import { api } from './http';

export type AgreementReportType = 'ns' | 'fs' | 'ma';
export type ReportArea = 'COLOMBO' | 'OUTSTATION' | 'SUBURB';
export type ReportDivision = 'RENTAL' | 'OUTRIGHT' | 'WORKSHOP' | 'AC' | 'PRODUCTION' | 'ELECTRONIC';

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

export interface ReportFilters {
  startDate: string;
  lastDate: string;
  area?: ReportArea;
  mainTechnicianId?: number;
  division?: ReportDivision;
  page: number;
  size: number;
}

const params = (filters: ReportFilters) => ({
  startDate: filters.startDate,
  lastDate: filters.lastDate,
  area: filters.area || undefined,
  mainTechnicianId: filters.mainTechnicianId || undefined,
  division: filters.division || undefined,
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

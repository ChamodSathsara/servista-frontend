import { api } from './http';
import type { MachineArea, MachineCompany, MachineCurrentStatus, MachineDivision } from './machines';

export type AssignmentType = 'OUTRIGHT_SALE' | 'RENTAL';
export type WarrantyType = 'MACHINE' | 'COMPANY';
export type WarrantyStatus = 'ACTIVE' | 'EXPIRED' | 'VOID';
export type InstallationStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type AgreementType = 'FS' | 'MA' | 'NS';
export type AgreementStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'CANCELLED';

export interface NewSaleRequest {
  machine: { serialNumber: string; company: MachineCompany; division: MachineDivision; modelId: number; currentStatus: MachineCurrentStatus; machineInvoiceId: number; dealerId: number | null; repId: number | null; salesmanId: number | null; originalInstallDate: string | null; note: string | null; creditNoteNumber: string | null };
  customerSite: { customerId: number; siteName: string; addressLine1: string; addressLine2: string | null; addressLine3: string | null; area: MachineArea; cityId: number; latitude: number | null; longitude: number | null; isHeadOffice: boolean; isActive: boolean };
  siteContact: { contactName: string; mobileNumber: string | null; email: string; designation: string | null; isPrimary: boolean; isActive: boolean };
  assignment: { customerId: number; assignmentType: AssignmentType; assignedFrom: string };
  technicians: { mainTechnicianId: number; serviceTechnicianId: number; assignedFrom: string };
  warranty: { warrantyType: WarrantyType; startDate: string; endDate: string; durationMonths: number | null; status: WarrantyStatus; note: string | null };
  liveLocation: { latitude: number; longitude: number };
  installation: { expectedInstallDate: string; status: InstallationStatus; statusNote: string | null };
  agreement: { agreementType: AgreementType; startDate: string; endDate: string; periodYears: number; visitsPerYear: number; annualPayment: number; fullPayment: number; discount: number; vatPercentage: number; vatAmount: number; status: AgreementStatus; isActive: boolean; previousAgreementId: number | null; note: string | null; statusReason: string | null };
  performedBy: number;
  machineStatusReason: string | null;
}

export interface NewSaleResponse { machineId: number; machineReferenceNumber: string; serialNumber: string; machineStatus: MachineCurrentStatus; customerSiteId: number; siteContactId: number; machineStatusHistoryId: number; machineAssignmentId: number; mainTechnicianAssignmentId: number; serviceTechnicianAssignmentId: number; machineWarrantyId: number; warrantyStatus: WarrantyStatus; liveLocationMachineId: number; installationJobId: number; installationJobNumber: string; installationStatus: InstallationStatus; agreementId: number; agreementNumber: string; agreementStatus: AgreementStatus; createdAt: string }

export const createNewSale = async (request: NewSaleRequest) => (await api.post<NewSaleResponse>('/api/new-sales', request)).data;

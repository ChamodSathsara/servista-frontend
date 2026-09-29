import { api } from './http';

export type MachineCompany = 'FINTECH' | 'GESTETNER';
export type MachineDivision = 'RENTAL' | 'OUTRIGHT' | 'WORKSHOP' | 'AC' | 'PRODUCTION' | 'ELECTRONIC';
export type MachineArea = 'COLOMBO' | 'OUTSTATION' | 'SUBURB';
export type MachineCurrentStatus = 'AVAILABLE' | 'INSTALLATION_PENDING' | 'ACTIVE_FS' | 'ACTIVE_MA' | 'NO_SERVICE' | 'OUT_OF_SERVICE' | 'RETURNED' | 'CREDIT_NOTE' | 'REMOVED';

export interface MachineRequest {
  customerSite: { customerId: number; siteName: string; addressLine1: string; addressLine2: string | null; addressLine3: string | null; area: MachineArea; cityId: number; latitude: number | null; longitude: number | null; isHeadOffice: boolean; isActive: boolean };
  siteContact: { contactName: string; mobileNumber: string | null; email: string; designation: string | null; isPrimary: boolean; isActive: boolean };
  machineInvoice: { invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; note: string | null };
  machine: { serialNumber: string; company: MachineCompany; division: MachineDivision; modelId: number; currentStatus: MachineCurrentStatus; currentMainTechnicianId: number | null; currentServiceTechnicianId: number | null; dealerId: number | null; repId: number | null; salesmanId: number | null; originalInstallDate: string | null; note: string | null; creditNoteNumber: string | null };
  performedBy: number;
  statusReason: string | null;
}

export interface MachineResponse {
  machineId: number; machineReferenceNumber: string; serialNumber: string; company: MachineCompany; division: MachineDivision;
  modelId: number; modelNumber: string; modelName: string; currentStatus: MachineCurrentStatus;
  currentMainTechnicianId: number | null; currentServiceTechnicianId: number | null; dealerId: number | null; repId: number | null; salesmanId: number | null;
  originalInstallDate: string | null; machineNote: string | null; creditNoteNumber: string | null;
  customerSiteId: number; customerId: number; siteName: string; addressLine1: string; addressLine2: string | null; addressLine3: string | null;
  area: MachineArea; cityId: number; latitude: number | null; longitude: number | null; isHeadOffice: boolean; siteActive: boolean;
  siteContactId: number; contactName: string; mobileNumber: string | null; email: string; designation: string | null; isPrimaryContact: boolean; contactActive: boolean;
  machineInvoiceId: number; invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; invoiceNote: string | null;
  createdBy: number; createdAt: string; updatedBy: number | null; updatedAt: string | null;
}

export interface MachineModelResponse { modelId: number; company: MachineCompany; manufacturerName: string; modelNumber: string; modelName: string; isActive: boolean }

export const getMachines = async () => (await api.get<MachineResponse[]>('/api/machines')).data;
export const searchMachines = async (query: string) => (await api.get<MachineResponse[]>('/api/machines/search', { params: { query } })).data;
export const getMachine = async (id: number) => (await api.get<MachineResponse>(`/api/machines/${id}`)).data;
export const createMachine = async (request: MachineRequest) => (await api.post<MachineResponse>('/api/machines', request)).data;
export const updateMachine = async (id: number, request: MachineRequest) => (await api.put<MachineResponse>(`/api/machines/${id}`, request)).data;
export const deleteMachine = async (id: number) => { await api.delete(`/api/machines/${id}`); };
export const getMachineModels = async () => (await api.get<MachineModelResponse[]>('/api/machine-models')).data;

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

export interface MachineModelResponse { modelId: number; company: MachineCompany; manufacturerId: number; manufacturerName: string; machineTypeId: number; machineTypeName: string; modelNumber: string; modelName: string; description: string | null; isActive: boolean; createdAt: string; createdBy: number }
export interface MachineModelRequest { company: MachineCompany; manufacturerId: number; machineTypeId: number; modelNumber: string; modelName: string; description: string | null; isActive: boolean; createdBy?: number }

export const getMachines = async () => (await api.get<MachineResponse[]>('/api/machines')).data;
export const searchMachines = async (query: string) => (await api.get<MachineResponse[]>('/api/machines/search', { params: { query } })).data;
export const getMachine = async (id: number) => (await api.get<MachineResponse>(`/api/machines/${id}`)).data;
export const createMachine = async (request: MachineRequest) => (await api.post<MachineResponse>('/api/machines', request)).data;
export const updateMachine = async (id: number, request: MachineRequest) => (await api.put<MachineResponse>(`/api/machines/${id}`, request)).data;
export const deleteMachine = async (id: number) => { await api.delete(`/api/machines/${id}`); };
export interface CustomerSiteOption { customerSiteId: number; customerId: number; siteName: string; address: string; area: MachineArea }
export interface MachineHistoryEvent { eventType: 'STATUS' | 'CUSTOMER' | 'TECHNICIAN'; title: string; description: string; occurredAt: string; performedBy: string }
export const getCustomerSites = async (customerId: number) => (await api.get<CustomerSiteOption[]>('/api/machines/customer-sites', { params: { customerId } })).data;
export const createCustomerSite = async (request: { site: { customerId: number; siteName: string; addressLine1: string; addressLine2: string | null; addressLine3: string | null; area: MachineArea; cityId: number; latitude: number | null; longitude: number | null; isHeadOffice: boolean; isActive: boolean }; contact: { contactName: string; mobileNumber: string | null; email: string; designation: string | null; isPrimary: boolean; isActive: boolean }; performedBy: number }) => (await api.post<CustomerSiteOption>('/api/machines/customer-sites', request)).data;
export const getMachineHistory = async (id: number) => (await api.get<MachineHistoryEvent[]>(`/api/machines/${id}/history`)).data;
export const transferMachineCustomer = async (id: number, request: { customerId: number; customerSiteId: number; assignmentType: 'OUTRIGHT_SALE' | 'RENTAL'; effectiveDate: string; performedBy: number; reason: string | null }) => (await api.post<MachineResponse>(`/api/machines/${id}/customer-transfer`, request)).data;
export const changeMachineTechnicians = async (id: number, request: { mainTechnicianId: number | null; serviceTechnicianId: number | null; effectiveDate: string; performedBy: number; reason: string | null }) => (await api.post<MachineResponse>(`/api/machines/${id}/technicians`, request)).data;
export const returnMachineToStock = async (id: number, request: { returnDate: string; performedBy: number; reason: string }) => (await api.post<MachineResponse>(`/api/machines/${id}/return-to-stock`, request)).data;
export const getMachineModels = async () => (await api.get<MachineModelResponse[]>('/api/machine-models')).data;
export const createMachineModel = async (request: MachineModelRequest) => (await api.post<MachineModelResponse>('/api/machine-models', request)).data;
export const updateMachineModel = async (id: number, request: MachineModelRequest) => (await api.put<MachineModelResponse>(`/api/machine-models/${id}`, request)).data;
export const deleteMachineModel = async (id: number) => { await api.delete(`/api/machine-models/${id}`); };

import { api } from './http';

export interface MachineInvoiceResponse { machineInvoiceId: number; invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; customerId: number; customerName: string; note: string | null; createdBy: number | null; createdAt: string }
export interface MachineInvoiceRequest { invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; customerId: number; note: string | null; createdBy?: number }
export const getMachineInvoices = async () => (await api.get<MachineInvoiceResponse[]>('/api/machine-invoices')).data;
export const getMachineInvoice = async (id: number) => (await api.get<MachineInvoiceResponse>(`/api/machine-invoices/${id}`)).data;
export const createMachineInvoice = async (request: MachineInvoiceRequest) => (await api.post<MachineInvoiceResponse>('/api/machine-invoices', request)).data;
export const updateMachineInvoice = async (id: number, request: MachineInvoiceRequest) => (await api.put<MachineInvoiceResponse>(`/api/machine-invoices/${id}`, request)).data;
export const deleteMachineInvoice = async (id: number) => { await api.delete(`/api/machine-invoices/${id}`); };

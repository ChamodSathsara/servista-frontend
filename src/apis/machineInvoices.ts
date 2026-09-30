import { api, ApiError, getBearerAuthorization } from './http';

export interface MachineInvoiceResponse { machineInvoiceId: number; invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; customerId: number; customerName: string; note: string | null; createdBy: number | null; createdAt: string }
export interface MachineInvoiceRequest { invoiceNumber: string; belitaInvoiceNumber: string | null; invoiceDate: string | null; customerId: number; note: string | null; createdBy?: number }

const authorizedRequest = () => {
  const authorization = getBearerAuthorization();
  if (!authorization) {
    throw new ApiError('Your access token is missing. Please sign in again.', 401);
  }

  const storedUser = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
  let role = '';
  try {
    role = storedUser ? String((JSON.parse(storedUser) as { role?: string }).role ?? '').toUpperCase() : '';
  } catch {
    throw new ApiError('Your login session is invalid. Please sign out and sign in again.', 401);
  }

  if (!['ADMIN', 'COORDINATOR'].includes(role)) {
    throw new ApiError(
      'Machine invoices require ADMIN or COORDINATOR access. Please sign out and sign in with an authorized account.',
      403,
    );
  }

  return { headers: { Authorization: authorization } };
};

export const getMachineInvoices = async () =>
  (await api.get<MachineInvoiceResponse[]>('/api/machine-invoices', authorizedRequest())).data;

export const getMachineInvoice = async (id: number) =>
  (await api.get<MachineInvoiceResponse>(`/api/machine-invoices/${id}`, authorizedRequest())).data;

export const createMachineInvoice = async (request: MachineInvoiceRequest) =>
  (await api.post<MachineInvoiceResponse>('/api/machine-invoices', request, authorizedRequest())).data;

export const updateMachineInvoice = async (id: number, request: MachineInvoiceRequest) =>
  (await api.put<MachineInvoiceResponse>(`/api/machine-invoices/${id}`, request, authorizedRequest())).data;

export const deleteMachineInvoice = async (id: number) => {
  await api.delete(`/api/machine-invoices/${id}`, authorizedRequest());
};

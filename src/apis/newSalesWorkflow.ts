import { api } from './http';
import type { MachineModelRequest, MachineModelResponse } from './machines';
import type { MachineInvoiceRequest, MachineInvoiceResponse } from './machineInvoices';
import type { DealerRequest, DealerResponse } from './dealers';
import type { RepRequest, RepResponse } from './reps';
import type { CreateCustomerRequest, CustomerResponse } from './customers';
export type WorkflowStatus='AWAITING_STORES'|'AWAITING_COORDINATOR'|'AWAITING_INSTALLATION'|'COMPLETED'|'CANCELLED';
export interface FinanceStage{serialNumber:string;company:string;modelId:number;machineInvoiceId:number;dealerId:number|null;repId:number|null;creditNoteNumber:string|null;machineNote:string|null;statusReason:string|null;customerId:number;warrantyType:string;warrantyStart:string;warrantyEnd:string;durationMonths:number|null;warrantyNote:string|null;division:string;performedBy:number}
export interface CoordinatorStage{mainTechnicianId:number;serviceTechnicianId:number;techniciansAssignedFrom:string;expectedInstallDate:string;agreementType:string;agreementStart:string;agreementEnd:string;periodYears:number;visitsPerYear:number;annualPayment:number;fullPayment:number;discount:number;vatPercentage:number;vatAmount:number;agreementNote:string|null;performedBy:number}
export interface SaleWorkflow{workflowId:number;status:WorkflowStatus;finance:FinanceStage;machineReferenceNumber:string|null;despatchedFromStores:boolean;coordinator:CoordinatorStage|null;installationJobId:number|null;machineId:number|null;createdAt:string;updatedAt:string|null}
export const getSaleWorkflows=async()=>(await api.get<SaleWorkflow[]>('/api/new-sales/workflow')).data;
export const getSaleWorkflowOptions=async()=>(await api.get<any>('/api/new-sales/workflow/options')).data;
export const createFinanceStage=async(payload:FinanceStage)=>(await api.post<SaleWorkflow>('/api/new-sales/workflow/finance',payload)).data;
export const createWorkflowModel=async(payload:MachineModelRequest)=>(await api.post<MachineModelResponse>('/api/new-sales/workflow/options/models',payload)).data;
export const createWorkflowInvoice=async(payload:MachineInvoiceRequest)=>(await api.post<MachineInvoiceResponse>('/api/new-sales/workflow/options/invoices',payload)).data;
export const createWorkflowDealer=async(payload:DealerRequest)=>(await api.post<DealerResponse>('/api/new-sales/workflow/options/dealers',payload)).data;
export const createWorkflowRepresentative=async(payload:RepRequest)=>(await api.post<RepResponse>('/api/new-sales/workflow/options/representatives',payload)).data;
export const createWorkflowCustomer=async(payload:CreateCustomerRequest)=>(await api.post<CustomerResponse>('/api/new-sales/workflow/options/customers',payload)).data;
export const dispatchSale=async(id:number,payload:{machineReferenceNumber:string;despatchedFromStores:true;performedBy:number})=>(await api.post<SaleWorkflow>(`/api/new-sales/workflow/${id}/stores`,payload)).data;
export const coordinateSale=async(id:number,payload:CoordinatorStage)=>(await api.post<SaleWorkflow>(`/api/new-sales/workflow/${id}/coordinator`,payload)).data;

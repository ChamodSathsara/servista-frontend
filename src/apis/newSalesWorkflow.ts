import { api } from './http';
export type WorkflowStatus='AWAITING_STORES'|'AWAITING_COORDINATOR'|'AWAITING_INSTALLATION'|'COMPLETED'|'CANCELLED';
export interface FinanceStage{serialNumber:string;company:string;modelId:number;machineInvoiceId:number;dealerId:number|null;repId:number|null;creditNoteNumber:string|null;machineNote:string|null;statusReason:string|null;customerId:number;warrantyType:string;warrantyStart:string;warrantyEnd:string;durationMonths:number|null;warrantyNote:string|null;division:string;performedBy:number}
export interface CoordinatorStage{mainTechnicianId:number;serviceTechnicianId:number;techniciansAssignedFrom:string;expectedInstallDate:string;agreementType:string;agreementStart:string;agreementEnd:string;periodYears:number;visitsPerYear:number;annualPayment:number;fullPayment:number;discount:number;vatPercentage:number;vatAmount:number;agreementNote:string|null;performedBy:number}
export interface SaleWorkflow{workflowId:number;status:WorkflowStatus;finance:FinanceStage;machineReferenceNumber:string|null;despatchedFromStores:boolean;coordinator:CoordinatorStage|null;installationJobId:number|null;machineId:number|null;createdAt:string;updatedAt:string|null}
export const getSaleWorkflows=async()=>(await api.get<SaleWorkflow[]>('/api/new-sales/workflow')).data;
export const getSaleWorkflowOptions=async()=>(await api.get<any>('/api/new-sales/workflow/options')).data;
export const createFinanceStage=async(payload:FinanceStage)=>(await api.post<SaleWorkflow>('/api/new-sales/workflow/finance',payload)).data;
export const dispatchSale=async(id:number,payload:{machineReferenceNumber:string;despatchedFromStores:true;performedBy:number})=>(await api.post<SaleWorkflow>(`/api/new-sales/workflow/${id}/stores`,payload)).data;
export const coordinateSale=async(id:number,payload:CoordinatorStage)=>(await api.post<SaleWorkflow>(`/api/new-sales/workflow/${id}/coordinator`,payload)).data;

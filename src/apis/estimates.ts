import { api } from './http';
import type { MachineModelResponse, MachineResponse } from './machines';
import type { PartCategoryResponse, PartResponse } from './parts';
import type { TechnicianResponse } from './technicians';

export type EstimateLineStatus = 'CATALOG' | 'PENDING' | 'RESOLVED';
export interface EstimateLineRequest { partId:number|null; pendingPartName:string|null; qty:number; note:string|null; lineStatus:EstimateLineStatus; resolvedBy:number|null }
export interface EstimateRequest { machineId:number; serviceScheduleId:number|null; breakdownId:number|null; technicianId:number; status:'DRAFT'; approvedBy:null; performedBy:number; statusReason:string|null; lines:EstimateLineRequest[]; acceptance:null }
export interface EstimateLineResponse { estimateLineId:number; partId:number|null; partCode:string|null; pendingPartName:string|null; qty:number; note:string|null; lineStatus:EstimateLineStatus }
export interface EstimateResponse { estimateId:number; estimateNumber:string; machineId:number; machineReferenceNumber:string; serviceScheduleId:number|null; breakdownId:number|null; technicianId:number; technicianName:string; status:string; createdBy:number; createdAt:string; lines:EstimateLineResponse[] }
export interface EstimateOptions { machines:MachineResponse[]; technicians:TechnicianResponse[]; models:MachineModelResponse[]; categories:PartCategoryResponse[]; parts:PartResponse[] }

export const getEstimates=async()=>(await api.get<EstimateResponse[]>('/api/estimates')).data;
export const getEstimateOptions=async()=>(await api.get<EstimateOptions>('/api/estimates/options')).data;
export const createEstimate=async(payload:EstimateRequest)=>(await api.post<EstimateResponse>('/api/estimates',payload)).data;

import { api } from './http';
export interface DailyJobSummary { date:string; pending:number; completed:number; started:number; cancelled:number; total:number }
export interface TechnicianPerformance { technicianId:number; techCode:string; technicianName:string; totalJobs:number; completedJobs:number; percentage:number }
export interface OverdueBreakdown { breakdownId:number; breakdownNumber:string; machineReferenceNumber:string; siteName:string; expectedCompletionAt:string; overdueDays:number }
export interface OverdueServiceVisit { serviceScheduleId:number; agreementNumber:string; machineReferenceNumber:string; siteName:string; expectedVisitDate:string; overdueDays:number }
export interface WarrantySummary { company:'GESTETNER'|'FINTECH'|null; total:number; active:number; expiringNext30Days:number; expired:number; voided:number }
export interface DashboardSummary { year:number; totalBreakdownsYtd:number; completedBreakdownsYtd:number; totalServiceVisitsYtd:number; completedServiceVisitsYtd:number; dailyJobs:DailyJobSummary[]; topTechnicians:TechnicianPerformance[]; overdueBreakdowns:OverdueBreakdown[]; overdueServiceVisits:OverdueServiceVisit[]; warrantySummary:WarrantySummary }
export const getDashboardSummary=async(company?:string)=>(await api.get<DashboardSummary>('/api/dashboard/summary',{params:company?{company}:undefined})).data;

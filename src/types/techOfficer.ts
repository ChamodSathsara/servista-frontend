import type { Area } from './customer';

export type TechStatus = 'Available' | 'On Job' | 'On Leave' | 'Inactive';
export type Specialization =
'Ricoh MFP' |
'Production Print' |
'Riso Duplicators' |
'Large Format' |
'Networking & Scan';

export interface TechOfficer {
  techId: number;
  techCode: string;
  name: string;
  mobileNumber: string;
  email: string;
  region: Area;
  specializations: Specialization[];
  status: TechStatus;
  joinedDate: string;
  jobsCompleted: number;
  jobsThisMonth: number;
  avgResponseHrs: number;
  rating: number;
}

export type JobType = 'Service Visit' | 'Breakdown' | 'Installation' | 'Meter Reading';
export type JobOutcome = 'Completed' | 'Pending Parts' | 'Escalated';

export interface TechJob {
  jobId: number;
  techId: number;
  date: string;
  type: JobType;
  customerName: string;
  machine: string;
  summary: string;
  outcome: JobOutcome;
  durationHrs: number;
}
import type { BadgeTone } from '../components/ui/StatusBadge';
import type { MachineStatus } from '../types/customer';
import type { JobOutcome, TechStatus } from '../types/techOfficer';

export const machineStatusTone: Record<MachineStatus, BadgeTone> = {
  Operational: 'success',
  Breakdown: 'danger',
  'Under Service': 'warning',
  Decommissioned: 'neutral'
};

export const techStatusTone: Record<TechStatus, BadgeTone> = {
  Available: 'success',
  'On Job': 'info',
  'On Leave': 'warning',
  Inactive: 'neutral'
};

export const jobOutcomeTone: Record<JobOutcome, BadgeTone> = {
  Completed: 'success',
  'Pending Parts': 'warning',
  Escalated: 'danger'
};
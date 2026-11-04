import { api } from './http';
import { getCurrentUser, isTechnician } from '../utils/session';

export interface SolutionTypeResponse {
  solutionTypeId: number;
  solutionCode: string;
  solutionDescription: string;
  isActive: boolean;
}

export const getSolutionTypes = async () =>
  (await api.get<SolutionTypeResponse[]>(isTechnician(getCurrentUser())
    ? '/api/technician/me/solution-types'
    : '/api/solution-types')).data;

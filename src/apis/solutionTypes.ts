import { api } from './http';

export interface SolutionTypeResponse {
  solutionTypeId: number;
  solutionCode: string;
  solutionDescription: string;
  isActive: boolean;
}

export const getSolutionTypes = async () =>
  (await api.get<SolutionTypeResponse[]>('/api/solution-types')).data;

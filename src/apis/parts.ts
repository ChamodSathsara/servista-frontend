import { api } from './http';

export interface PartResponse {
  partId: number;
  partCode: string;
  partName: string;
  description: string | null;
  unitPrice: number | null;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string | null;
  modelIds: number[];
  categoryIds: number[];
}

export interface PartCategoryResponse {
  partCategoryId: number;
  categoryCode: string;
  categoryName: string;
  description: string | null;
  isActive: boolean;
}

export const getParts = async () => (await api.get<PartResponse[]>('/api/parts')).data;
export const getPartCategories = async () => (await api.get<PartCategoryResponse[]>('/api/part-categories')).data;

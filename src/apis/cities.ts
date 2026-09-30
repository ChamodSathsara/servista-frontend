import { api } from './http';
import type { MachineArea } from './machines';

export interface CityResponse { cityId: number; area: MachineArea; cityName: string; isActive: boolean }
export interface CityRequest { area: MachineArea; cityName: string; isActive: boolean }
export const getCities = async () => (await api.get<CityResponse[]>('/api/cities')).data;
export const getCity = async (id: number) => (await api.get<CityResponse>(`/api/cities/${id}`)).data;
export const createCity = async (request: CityRequest) => (await api.post<CityResponse>('/api/cities', request)).data;
export const updateCity = async (id: number, request: CityRequest) => (await api.put<CityResponse>(`/api/cities/${id}`, request)).data;
export const deleteCity = async (id: number) => { await api.delete(`/api/cities/${id}`); };

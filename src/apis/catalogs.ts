import { api } from './http';

export interface ManufacturerResponse { manufacturerId: number; manufacturerName: string; isActive: boolean; createdAt: string; createdBy: number }
export interface ManufacturerRequest { manufacturerName: string; isActive: boolean; createdBy?: number }
export interface MachineTypeResponse { machineTypeId: number; machineTypeName: string; machineTypeDescription: string | null; isActive: boolean }
export interface MachineTypeRequest { machineTypeName: string; machineTypeDescription: string | null; isActive: boolean }

export const getManufacturers = async () => (await api.get<ManufacturerResponse[]>('/api/manufacturers')).data;
export const getManufacturer = async (id: number) => (await api.get<ManufacturerResponse>(`/api/manufacturers/${id}`)).data;
export const createManufacturer = async (request: ManufacturerRequest) => (await api.post<ManufacturerResponse>('/api/manufacturers', request)).data;
export const updateManufacturer = async (id: number, request: ManufacturerRequest) => (await api.put<ManufacturerResponse>(`/api/manufacturers/${id}`, request)).data;
export const deleteManufacturer = async (id: number) => { await api.delete(`/api/manufacturers/${id}`); };

export const getMachineTypes = async () => (await api.get<MachineTypeResponse[]>('/api/machine-types')).data;
export const getMachineType = async (id: number) => (await api.get<MachineTypeResponse>(`/api/machine-types/${id}`)).data;
export const createMachineType = async (request: MachineTypeRequest) => (await api.post<MachineTypeResponse>('/api/machine-types', request)).data;
export const updateMachineType = async (id: number, request: MachineTypeRequest) => (await api.put<MachineTypeResponse>(`/api/machine-types/${id}`, request)).data;
export const deleteMachineType = async (id: number) => { await api.delete(`/api/machine-types/${id}`); };

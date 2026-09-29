import type { ApiCompany, ApiCustomerGrade, ApiCustomerSegment, ApiCustomerType } from '../apis/customers';

export type CustomerGrade = ApiCustomerGrade | 'A' | 'B' | 'C' | 'D';
export type CustomerType = ApiCustomerType | 'Corporate' | 'Government' | 'SME' | 'Individual';
export type CustomerSegment = ApiCustomerSegment |
'Banking & Finance' |
'Education' |
'Healthcare' |
'Manufacturing' |
'Retail' |
'Hospitality' |
'Telecommunications';
export type Company = ApiCompany | 'Gestetner' | 'Ricoh Division' | 'Riso Division';
export type Area =
'Colombo' |
'Western' |
'Central' |
'Southern' |
'North Western' |
'Northern' |
'Eastern';

export interface SiteContact {
  contactName: string;
  designation: string;
  mobileNumber: string;
  email: string;
}

export interface Customer {
  customerId: number;
  sageCode: string;
  customerName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  headOfficeTel: string;
  headOfficeEmail: string;
  isActive: boolean;
  grade: CustomerGrade;
  type: CustomerType;
  segment: CustomerSegment;
  companies: Company[];
  salesmanId: number;
  headOfficeArea?: Area;
  primaryContact?: SiteContact;
  createdAt: string;
}

export interface Salesman {
  salesmanId: number;
  salesmanCode: string;
  salesmanName: string;
  company: Company;
  mobileNumber: string;
}

export type ContractType = 'Rental' | 'Service Agreement' | 'Warranty' | 'Per Copy';
export type MachineStatus = 'Operational' | 'Breakdown' | 'Under Service' | 'Decommissioned';

export interface Machine {
  machineId: number;
  customerId: number;
  serialNumber: string;
  model: string;
  brand: string;
  siteName: string;
  installDate: string;
  contractType: ContractType;
  status: MachineStatus;
  lastServiceDate: string;
  meterReading: number;
}

export interface City {
  cityId: number;
  name: string;
  area: Area;
}

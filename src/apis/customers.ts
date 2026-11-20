import { api } from './http';

export type ApiCustomerGrade = 'STRONG' | 'GOOD' | 'WEAK' | 'UNKNOWN';
export type ApiCustomerType = 'DEALER' | 'CREDIT_CUSTOMER' | 'INTERNAL_CUSTOMER' | 'EXISTING_CUSTOMER';
export type ApiCompany = 'FINTECH' | 'GESTETNER';
export type ApiCustomerSegment =
  | 'AIRLINE_TRAVEL_TOUR'
  | 'ARMED_FORCES'
  | 'BANK_GOV'
  | 'BANK_PRIVATE'
  | 'CONSTRUCTION'
  | 'CORPORATE'
  | 'DEALER'
  | 'DEPARTMENTS'
  | 'EDUCATION_GOV'
  | 'EDUCATION_PRIVATE'
  | 'EMBASSIES'
  | 'FINANCIAL_INSTITUTE'
  | 'GOVERNMENT'
  | 'GOVERNMENT_BANKS'
  | 'HEALTH'
  | 'INDIVIDUAL'
  | 'MANUFACTURING_DISTRIBUTION'
  | 'MEDIA'
  | 'MINISTRIES'
  | 'NGO'
  | 'OTHERS'
  | 'PRIVATE'
  | 'PRIVATE_BANKS'
  | 'SHIPPING_FREIGHT_FORWARDING'
  | 'SME'
  | 'TELECOMMUNICATION';

export interface SalesmanAssignment {
  assignmentId: number;
  salesmanId: number;
  validFrom: string;
  validTo: string | null;
  isCurrent: boolean;
  assignedBy: number;
  createdAt: string;
}

export interface CustomerResponse {
  customerId: number;
  sageCode: string | null;
  customerName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  headOfficeTelNumber: string | null;
  headOfficeEmail: string | null;
  isActive: boolean;
  customerGrade: ApiCustomerGrade;
  customerType: ApiCustomerType;
  customerSegment: ApiCustomerSegment;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
  companies: ApiCompany[];
  salesmanAssignment: SalesmanAssignment | null;
}

export interface CreateCustomerRequest {
  sageCode?: string;
  customerName: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  headOfficeTelNumber?: string;
  headOfficeEmail?: string;
  isActive: boolean;
  customerGrade: ApiCustomerGrade;
  customerType: ApiCustomerType;
  customerSegment: ApiCustomerSegment;
  createdBy: number;
  companies: ApiCompany[];
  salesmanId: number;
}

export type UpdateCustomerRequest = Omit<CreateCustomerRequest, 'createdBy' | 'companies' | 'salesmanId'> & {
  updatedBy?: number;
};

export async function getCustomers(): Promise<CustomerResponse[]> {
  const { data } = await api.get<CustomerResponse[]>('/api/customers');
  return data;
}

export interface CustomerPage {
  content: CustomerResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export async function getCustomersPage(params: {
  page?: number;
  size?: number;
  query?: string;
  searchById?: boolean;
  active?: boolean;
  grade?: ApiCustomerGrade;
} = {}): Promise<CustomerPage> {
  const { data } = await api.get<CustomerPage>('/api/customers/page', { params: {
    page: params.page ?? 0,
    size: params.size ?? 20,
    query: params.query?.trim() || undefined,
    searchById: params.searchById ?? false,
    active: params.active,
    grade: params.grade,
  } });
  return data;
}

export async function createCustomer(request: CreateCustomerRequest): Promise<CustomerResponse> {
  const { data } = await api.post<CustomerResponse>('/api/customers', request);
  return data;
}

export async function updateCustomer(customerId: number, request: UpdateCustomerRequest): Promise<CustomerResponse> {
  const { data } = await api.put<CustomerResponse>(`/api/customers/${customerId}`, request);
  return data;
}

export async function deleteCustomer(customerId: number): Promise<void> {
  await api.delete(`/api/customers/${customerId}`);
}

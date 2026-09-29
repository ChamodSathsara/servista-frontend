'use client';

import { useState } from 'react';
import type { ApiCompany as Company, ApiCustomerGrade as CustomerGrade, ApiCustomerSegment as CustomerSegment, ApiCustomerType as CustomerType } from '../apis/customers';
import type { Area } from '../types/customer';
import { todayIso } from '../utils/format';

export interface CustomerFormValues {
  customerName: string;
  sageCode: string;
  headOfficeTel: string;
  headOfficeEmail: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  grade: CustomerGrade | '';
  type: CustomerType | '';
  segment: CustomerSegment | '';
  companies: Company[];
  isActive: boolean;
  siteName: string;
  siteAddress1: string;
  siteAddress2: string;
  area: Area | '';
  cityId: string;
  contactName: string;
  contactDesignation: string;
  contactMobile: string;
  contactEmail: string;
  salesmanId: string;
  validFrom: string;
}

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;

export const customerSteps = [
{ id: 'details', label: 'Customer details' },
{ id: 'assignment', label: 'Salesman & review' }];


const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createEmptyValues(): CustomerFormValues {
  return {
    customerName: '', sageCode: '', headOfficeTel: '', headOfficeEmail: '',
    addressLine1: '', addressLine2: '', addressLine3: '',
    grade: '', type: '', segment: '', companies: [], isActive: true,
    siteName: 'Head Office', siteAddress1: '', siteAddress2: '', area: '', cityId: '',
    contactName: '', contactDesignation: '', contactMobile: '', contactEmail: '',
    salesmanId: '', validFrom: todayIso()
  };
}

function validateStep(step: number, v: CustomerFormValues): CustomerFormErrors {
  const e: CustomerFormErrors = {};
  if (step === 0) {
    if (!v.customerName.trim()) e.customerName = 'Customer name is required';
    if (!v.grade) e.grade = 'Choose a grade';
    if (!v.type) e.type = 'Choose a customer type';
    if (!v.segment) e.segment = 'Choose a segment';
    if (v.companies.length === 0) e.companies = 'Select at least one company';
    if (v.headOfficeEmail && !emailPattern.test(v.headOfficeEmail)) e.headOfficeEmail = 'Enter a valid email address';
  }
  if (step === 1) {
    if (!v.salesmanId) e.salesmanId = 'Assign a salesman';
  }
  return e;
}

export function useCreateCustomerForm(onSubmit: (values: CustomerFormValues) => Promise<void>) {
  const [values, setValues] = useState<CustomerFormValues>(createEmptyValues);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const clearError = (key: keyof CustomerFormValues) =>
  setErrors((prev) => {
    if (!prev[key]) return prev;
    const next = { ...prev };
    delete next[key];
    return next;
  });

  const setField = <K extends keyof CustomerFormValues,>(key: K, value: CustomerFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const toggleCompany = (company: Company) =>
  setField(
    'companies',
    values.companies.includes(company) ? values.companies.filter((c) => c !== company) : [...values.companies, company]
  );

  const copyCustomerAddress = () => {
    setValues((prev) => ({ ...prev, siteAddress1: prev.addressLine1, siteAddress2: prev.addressLine2 }));
    clearError('siteAddress1');
  };

  const next = () => {
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep((s) => Math.min(s + 1, customerSteps.length - 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));
  const goTo = (target: number) => {
    if (target < step) setStep(target);
  };

  const reset = () => {
    setValues(createEmptyValues());
    setErrors({});
    setStep(0);
    setSubmitting(false);
  };

  const submit = async () => {
    for (let i = 0; i < customerSteps.length; i += 1) {
      const stepErrors = validateStep(i, values);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setStep(i);
        return;
      }
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
      reset();
    } catch {
      // The page displays the API error; keep the dialog values so the user can retry.
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, step, submitting, setField, toggleCompany, copyCustomerAddress, next, back, goTo, submit, reset };
}

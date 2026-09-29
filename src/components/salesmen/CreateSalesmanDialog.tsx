'use client';

import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';
import type { CreateSalesmanRequest, SalesmanArea, SalesmanCompany, SalesmanDivision } from '../../apis/salesmen';

type FormValues = Omit<CreateSalesmanRequest, 'createdBy'>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  userName: '', mobileNumber: '', email: '', password: '', isActive: true,
  division: 'OUTRIGHT', area: 'COLOMBO', companies: [], salesmanCode: '', company: 'GESTETNER',
};

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (values: FormValues) => Promise<void>;
}

export function CreateSalesmanDialog({ open, onClose, onCreate }: Props) {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const close = () => {
    if (submitting) return;
    setValues(emptyForm);
    setErrors({});
    onClose();
  };

  const submit = async () => {
    const next: FormErrors = {};
    if (!values.userName.trim()) next.userName = 'Salesman name is required';
    if (!values.mobileNumber.trim()) next.mobileNumber = 'Mobile number is required';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address';
    if (values.password.length < 8) next.password = 'Use at least 8 characters';
    if (!values.salesmanCode.trim()) next.salesmanCode = 'Salesman code is required';
    if (values.companies.length === 0) next.companies = 'Select at least one company';
    if (!values.companies.includes(values.company)) next.company = 'Primary company must be selected above';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await onCreate({ ...values, userName: values.userName.trim(), mobileNumber: values.mobileNumber.trim(), email: values.email.trim(), salesmanCode: values.salesmanCode.trim() });
      setValues(emptyForm);
      setErrors({});
    } catch {
      // The parent displays the API error and the entered values remain available.
    } finally {
      setSubmitting(false);
    }
  };

  const input = (key: 'userName' | 'mobileNumber' | 'email' | 'password' | 'salesmanCode', label: string, type = 'text') => (
    <FormField label={label} htmlFor={`salesman-${key}`} required error={errors[key]}>
      <input id={`salesman-${key}`} type={type} value={values[key]} onChange={(event) => setField(key, event.target.value)} className={fieldClass(!!errors[key])} />
    </FormField>
  );

  return (
    <Modal open={open} onClose={close} title="Create salesman" description="Create the user account and salesman record." widthClass="max-w-2xl"
      footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={close} disabled={submitting}>Cancel</Button><Button onClick={() => void submit()} loading={submitting}>Create salesman</Button></div>}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {input('userName', 'Salesman name')}
        {input('salesmanCode', 'Salesman code')}
        {input('mobileNumber', 'Mobile number', 'tel')}
        {input('email', 'Email', 'email')}
        {input('password', 'Temporary password', 'password')}
        <FormField label="Division" htmlFor="salesman-division" required>
          <select id="salesman-division" value={values.division} onChange={(event) => setField('division', event.target.value as SalesmanDivision)} className={fieldClass()}>
            <option value="OUTRIGHT">OUTRIGHT</option><option value="RENTAL">RENTAL</option>
          </select>
        </FormField>
        <FormField label="Area" htmlFor="salesman-area" required>
          <select id="salesman-area" value={values.area} onChange={(event) => setField('area', event.target.value as SalesmanArea)} className={fieldClass()}>
            <option value="COLOMBO">COLOMBO</option><option value="SUBURB">SUBURB</option>
          </select>
        </FormField>
        <FormField label="Primary company" htmlFor="salesman-company" required error={errors.company}>
          <select id="salesman-company" value={values.company} onChange={(event) => setField('company', event.target.value as SalesmanCompany)} className={fieldClass(!!errors.company)}>
            <option value="GESTETNER">GESTETNER</option><option value="FINTECH">FINTECH</option>
          </select>
        </FormField>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-ink">Companies <span className="text-accent-500">*</span></legend>
          <div className="flex gap-2">
            {(['GESTETNER', 'FINTECH'] as SalesmanCompany[]).map((company) => {
              const selected = values.companies.includes(company);
              return <button key={company} type="button" onClick={() => setField('companies', selected ? values.companies.filter((item) => item !== company) : [...values.companies, company])}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm ${selected ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink-muted'}`}>
                {selected && <CheckIcon className="h-3.5 w-3.5" />}{company}
              </button>;
            })}
          </div>
          {errors.companies && <p className="mt-1.5 text-xs text-danger-700">{errors.companies}</p>}
        </fieldset>
        <label className="flex items-center justify-between rounded-lg border border-line px-4 py-3 sm:col-span-2">
          <span><span className="block text-sm font-medium text-ink">Active salesman</span><span className="block text-xs text-ink-muted">Allow this salesman to access the system.</span></span>
          <input type="checkbox" checked={values.isActive} onChange={(event) => setField('isActive', event.target.checked)} className="h-4 w-4" />
        </label>
      </div>
    </Modal>
  );
}

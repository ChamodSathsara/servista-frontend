'use client';

import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';
import type { CreateTechnicianRequest, TechnicianArea, TechnicianCompany, TechnicianDivision, TechnicianRole } from '../../apis/technicians';

type Values = Omit<CreateTechnicianRequest, 'createdBy'>;
type Errors = Partial<Record<keyof Values, string>>;
const empty: Values = { userName: '', mobileNumber: '', email: '', password: '', isActive: true, division: 'RENTAL', area: 'COLOMBO', companies: [], techCode: '', technicianRole: 'TECHNICIAN' };

interface Props { open: boolean; onClose: () => void; onCreate: (values: Values) => Promise<void> }

export function CreateTechOfficerDialog({ open, onClose, onCreate }: Props) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const set = <K extends keyof Values>(key: K, value: Values[K]) => { setValues((previous) => ({ ...previous, [key]: value })); setErrors((previous) => ({ ...previous, [key]: undefined })); };
  const close = () => { if (submitting) return; setValues(empty); setErrors({}); onClose(); };

  const submit = async () => {
    const next: Errors = {};
    if (!values.userName.trim()) next.userName = 'Full name is required';
    if (!values.mobileNumber.trim()) next.mobileNumber = 'Mobile number is required';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address';
    if (values.password.length < 8) next.password = 'Use at least 8 characters';
    if (!values.techCode.trim()) next.techCode = 'Tech code is required';
    if (!values.companies.length) next.companies = 'Select at least one company';
    setErrors(next); if (Object.keys(next).length) return;
    setSubmitting(true);
    try { await onCreate({ ...values, userName: values.userName.trim(), mobileNumber: values.mobileNumber.trim(), email: values.email.trim(), techCode: values.techCode.trim() }); setValues(empty); setErrors({}); }
    catch { /* Parent displays the API error; retain the form for retry. */ }
    finally { setSubmitting(false); }
  };

  const input = (key: 'userName' | 'mobileNumber' | 'email' | 'password' | 'techCode', label: string, type = 'text') => <FormField label={label} htmlFor={`tech-${key}`} required error={errors[key]}>
    <input id={`tech-${key}`} type={type} value={values[key]} onChange={(event) => set(key, event.target.value)} className={fieldClass(!!errors[key])} />
  </FormField>;

  return <Modal open={open} onClose={close} title="Create technician" description="Create the user account and technician record." widthClass="max-w-2xl"
    footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={close} disabled={submitting}>Cancel</Button><Button onClick={() => void submit()} loading={submitting}>Create technician</Button></div>}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {input('userName', 'Full name')}{input('techCode', 'Tech code')}{input('mobileNumber', 'Mobile number', 'tel')}{input('email', 'Email', 'email')}{input('password', 'Temporary password', 'password')}
      <FormField label="Technician role" htmlFor="tech-role" required><select id="tech-role" value={values.technicianRole} onChange={(event) => set('technicianRole', event.target.value as TechnicianRole)} className={fieldClass()}>
        <option value="TECHNICIAN">TECHNICIAN</option><option value="TEAM_LEADER">TEAM LEADER</option><option value="WORKSHOP_TECHNICIAN">WORKSHOP TECHNICIAN</option></select></FormField>
      <FormField label="Division" htmlFor="tech-division" required><select id="tech-division" value={values.division} onChange={(event) => set('division', event.target.value as TechnicianDivision)} className={fieldClass()}>
        <option value="OUTRIGHT">OUTRIGHT</option><option value="RENTAL">RENTAL</option><option value="WORKSHOP">WORKSHOP</option></select></FormField>
      <FormField label="Area" htmlFor="tech-area" required><select id="tech-area" value={values.area} onChange={(event) => set('area', event.target.value as TechnicianArea)} className={fieldClass()}>
        <option value="COLOMBO">COLOMBO</option><option value="SUBURB">SUBURB</option></select></FormField>
      <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium text-ink">Companies <span className="text-accent-500">*</span></legend><div className="flex gap-2">
        {(['GESTETNER', 'FINTECH'] as TechnicianCompany[]).map((company) => { const selected = values.companies.includes(company); return <button key={company} type="button" onClick={() => set('companies', selected ? values.companies.filter((item) => item !== company) : [...values.companies, company])}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm ${selected ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink-muted'}`}>{selected && <CheckIcon className="h-3.5 w-3.5" />}{company}</button>; })}
      </div>{errors.companies && <p className="mt-1.5 text-xs text-danger-700">{errors.companies}</p>}</fieldset>
      <label className="flex items-center justify-between rounded-lg border border-line px-4 py-3 sm:col-span-2"><span><span className="block text-sm font-medium text-ink">Active technician</span><span className="block text-xs text-ink-muted">Allow this technician to access the system.</span></span>
        <input type="checkbox" checked={values.isActive} onChange={(event) => set('isActive', event.target.checked)} className="h-4 w-4" /></label>
    </div>
  </Modal>;
}

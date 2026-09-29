'use client';

import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';
import { todayIso } from '../../utils/format';
import { areas } from '../../data/locations';
import type { Area } from '../../types/customer';
import type { Specialization, TechOfficer } from '../../types/techOfficer';

interface CreateTechOfficerDialogProps {
  open: boolean;
  nextCode: string;
  onClose: () => void;
  onCreate: (officer: Omit<TechOfficer, 'techId'>) => void;
}

interface FormState {
  name: string;
  mobileNumber: string;
  email: string;
  region: Area | '';
  joinedDate: string;
  specializations: Specialization[];
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const allSpecializations: Specialization[] = ['Ricoh MFP', 'Production Print', 'Riso Duplicators', 'Large Format', 'Networking & Scan'];
const emptyForm = (): FormState => ({ name: '', mobileNumber: '', email: '', region: '', joinedDate: todayIso(), specializations: [] });

export function CreateTechOfficerDialog({ open, nextCode, onClose, onCreate }: CreateTechOfficerDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState,>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const toggleSpec = (s: Specialization) =>
  set('specializations', form.specializations.includes(s) ? form.specializations.filter((x) => x !== s) : [...form.specializations, s]);

  const close = () => {
    if (submitting) return;
    setForm(emptyForm());
    setErrors({});
    onClose();
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.mobileNumber.trim()) next.mobileNumber = 'Mobile number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.region) next.region = 'Choose a region';
    if (form.specializations.length === 0) next.specializations = 'Pick at least one specialization';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    window.setTimeout(() => {
      onCreate({
        techCode: nextCode,
        name: form.name.trim(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim(),
        region: form.region as Area,
        specializations: form.specializations,
        status: 'Available',
        joinedDate: form.joinedDate,
        jobsCompleted: 0,
        jobsThisMonth: 0,
        avgResponseHrs: 0,
        rating: 0
      });
      setSubmitting(false);
      setForm(emptyForm());
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Create tech officer"
      description="New officers start as Available and can be dispatched right away."
      widthClass="max-w-xl"
      footer={
      <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
          <Button onClick={() => submit()} loading={submitting}>{submitting ? 'Creating…' : 'Create tech officer'}</Button>
        </div>
      }>
      
      <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Tech code" htmlFor="to-code" hint="Assigned automatically">
          <input id="to-code" value={nextCode} disabled className={`${fieldClass()} font-mono`} />
        </FormField>
        <FormField label="Joined on" htmlFor="to-joined">
          <input id="to-joined" type="date" value={form.joinedDate} onChange={(e) => set('joinedDate', e.target.value)} className={fieldClass()} />
        </FormField>
        <FormField label="Full name" htmlFor="to-name" required error={errors.name} className="sm:col-span-2">
          <input id="to-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chaminda Rathnayake" aria-invalid={!!errors.name} className={fieldClass(!!errors.name)} />
        </FormField>
        <FormField label="Mobile number" htmlFor="to-mobile" required error={errors.mobileNumber}>
          <input id="to-mobile" type="tel" value={form.mobileNumber} onChange={(e) => set('mobileNumber', e.target.value)} placeholder="07X XXX XXXX" aria-invalid={!!errors.mobileNumber} className={fieldClass(!!errors.mobileNumber)} />
        </FormField>
        <FormField label="Email" htmlFor="to-email" required error={errors.email}>
          <input id="to-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@gestetner.lk" aria-invalid={!!errors.email} className={fieldClass(!!errors.email)} />
        </FormField>
        <FormField label="Region" htmlFor="to-region" required error={errors.region} className="sm:col-span-2">
          <select id="to-region" value={form.region} onChange={(e) => set('region', e.target.value as Area)} className={fieldClass(!!errors.region)}>
            <option value="">Select region</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </FormField>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-sm font-medium text-ink">Specializations<span className="ml-0.5 text-accent-500" aria-hidden="true">*</span></legend>
          <div className="flex flex-wrap gap-2">
            {allSpecializations.map((s) => {
              const active = form.specializations.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSpec(s)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors duration-150 ${active ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink-muted hover:bg-canvas'}`}>
                  
                  {active && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                  {s}
                </button>);

            })}
          </div>
          {errors.specializations && <p className="mt-1.5 text-xs text-danger-700" role="alert">{errors.specializations}</p>}
        </fieldset>
      </form>
    </Modal>);

}
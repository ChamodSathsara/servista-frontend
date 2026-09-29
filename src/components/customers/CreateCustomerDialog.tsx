'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';
import { customerSteps, useCreateCustomerForm, type CustomerFormValues } from '../../hooks/useCreateCustomerForm';
import { areas, cities } from '../../data/locations';
import { salesmen } from '../../data/salesmen';
import type { Area, Company, CustomerGrade, CustomerSegment, CustomerType } from '../../types/customer';

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CustomerFormValues) => void;
}

const grades: {value: CustomerGrade;hint: string;}[] = [
{ value: 'A', hint: 'Key account' },
{ value: 'B', hint: 'High value' },
{ value: 'C', hint: 'Standard' },
{ value: 'D', hint: 'Occasional' }];

const types: CustomerType[] = ['Corporate', 'Government', 'SME', 'Individual'];
const segments: CustomerSegment[] = ['Banking & Finance', 'Education', 'Healthcare', 'Manufacturing', 'Retail', 'Hospitality', 'Telecommunications'];
const companies: Company[] = ['Gestetner', 'Ricoh Division', 'Riso Division'];

export function CreateCustomerDialog({ open, onClose, onCreate }: CreateCustomerDialogProps) {
  const form = useCreateCustomerForm(onCreate);
  const { values: v, errors: e, step, setField } = form;
  const isLast = step === customerSteps.length - 1;
  const cityOptions = cities.filter((c) => c.area === v.area);
  const selectedSalesman = salesmen.find((s) => String(s.salesmanId) === v.salesmanId);
  const selectedCity = cities.find((c) => String(c.cityId) === v.cityId);

  const handleClose = () => {
    if (form.submitting) return;
    form.reset();
    onClose();
  };

  const text = (key: keyof CustomerFormValues, label: string, opts: {required?: boolean;placeholder?: string;type?: string;className?: string;} = {}) =>
  <FormField label={label} htmlFor={`cc-${key}`} required={opts.required} error={e[key]} className={opts.className}>
      <input
      id={`cc-${key}`}
      type={opts.type ?? 'text'}
      value={v[key] as string}
      onChange={(ev) => setField(key, ev.target.value as never)}
      placeholder={opts.placeholder}
      aria-invalid={!!e[key]}
      className={fieldClass(!!e[key])} />
    
    </FormField>;


  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create customer"
      description="Add the customer, their head office site and who looks after them."
      widthClass="max-w-3xl"
      footer={
      <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={step === 0 ? handleClose : form.back} disabled={form.submitting}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          {isLast ?
        <Button onClick={form.submit} loading={form.submitting}>
              {form.submitting ? 'Creating…' : 'Create customer'}
            </Button> :

        <Button onClick={form.next}>Continue</Button>
        }
        </div>
      }>
      
      <ol className="mb-6 grid grid-cols-3 gap-2" aria-label="Progress">
        {customerSteps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => form.goTo(i)}
                disabled={i > step}
                aria-current={current ? 'step' : undefined}
                className="group w-full text-left disabled:cursor-default">
                
                <span className={`block h-1 rounded-full transition-colors duration-200 ${done || current ? 'bg-brand-500' : 'bg-line'}`} />
                <span className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${current ? 'text-ink' : done ? 'text-brand-600 group-hover:text-brand-700' : 'text-ink-subtle'}`}>
                  {done && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span className="truncate">{s.label}</span>
                </span>
              </button>
            </li>);

        })}
      </ol>

      {step === 0 &&
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {text('customerName', 'Customer name', { required: true, placeholder: 'e.g. Commercial Bank of Ceylon PLC', className: 'sm:col-span-2' })}
          {text('sageCode', 'Sage code', { placeholder: 'e.g. SG-C0400' })}
          <FormField label="Customer type" htmlFor="cc-type" required error={e.type}>
            <select id="cc-type" value={v.type} onChange={(ev) => setField('type', ev.target.value as CustomerType)} className={fieldClass(!!e.type)}>
              <option value="">Select type</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>

          <fieldset className="sm:col-span-2">
            <legend className="mb-1.5 text-sm font-medium text-ink">Grade<span className="ml-0.5 text-accent-500" aria-hidden="true">*</span></legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {grades.map((g) => {
              const active = v.grade === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setField('grade', g.value)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 ${active ? 'border-brand-500 bg-brand-50' : 'border-line hover:bg-canvas'}`}>
                  
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md text-sm font-semibold ${active ? 'bg-brand-500 text-white' : 'bg-canvas text-ink'}`}>{g.value}</span>
                    <span className="text-xs text-ink-muted">{g.hint}</span>
                  </button>);

            })}
            </div>
            {e.grade && <p className="mt-1.5 text-xs text-danger-700" role="alert">{e.grade}</p>}
          </fieldset>

          <FormField label="Segment" htmlFor="cc-segment" required error={e.segment}>
            <select id="cc-segment" value={v.segment} onChange={(ev) => setField('segment', ev.target.value as CustomerSegment)} className={fieldClass(!!e.segment)}>
              <option value="">Select segment</option>
              {segments.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          {text('headOfficeTel', 'Head office telephone', { placeholder: '011 000 0000', type: 'tel' })}
          {text('headOfficeEmail', 'Head office email', { placeholder: 'admin@company.lk', type: 'email', className: 'sm:col-span-2' })}
          {text('addressLine1', 'Address line 1', { placeholder: 'Building / street', className: 'sm:col-span-2' })}
          {text('addressLine2', 'Address line 2')}
          {text('addressLine3', 'Address line 3', { placeholder: 'City' })}

          <fieldset className="sm:col-span-2">
            <legend className="mb-1.5 text-sm font-medium text-ink">Serviced by<span className="ml-0.5 text-accent-500" aria-hidden="true">*</span></legend>
            <div className="flex flex-wrap gap-2">
              {companies.map((c) => {
              const active = v.companies.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => form.toggleCompany(c)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors duration-150 ${active ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink-muted hover:bg-canvas'}`}>
                  
                    {active && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                    {c}
                  </button>);

            })}
            </div>
            {e.companies && <p className="mt-1.5 text-xs text-danger-700" role="alert">{e.companies}</p>}
          </fieldset>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line px-4 py-3 sm:col-span-2">
            <span>
              <span className="block text-sm font-medium text-ink">Active customer</span>
              <span className="block text-xs text-ink-muted">Inactive customers can&apos;t be assigned new jobs.</span>
            </span>
            <input type="checkbox" className="peer sr-only" checked={v.isActive} onChange={(ev) => setField('isActive', ev.target.checked)} />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors duration-150 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-150 peer-checked:bg-brand-500 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40" aria-hidden="true" />
          </label>
        </div>
      }

      {step === 1 &&
      <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-ink">Head office site</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {text('siteName', 'Site name', { required: true, className: 'sm:col-span-2' })}
              <FormField
              label="Address line 1"
              htmlFor="cc-siteAddress1"
              required
              error={e.siteAddress1}
              className="sm:col-span-2"
              action={
              v.addressLine1 ?
              <button type="button" onClick={form.copyCustomerAddress} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                      <CopyIcon className="h-3 w-3" aria-hidden="true" />
                      Use customer address
                    </button> :
              undefined
              }>
              
                <input id="cc-siteAddress1" value={v.siteAddress1} onChange={(ev) => setField('siteAddress1', ev.target.value)} aria-invalid={!!e.siteAddress1} className={fieldClass(!!e.siteAddress1)} />
              </FormField>
              {text('siteAddress2', 'Address line 2', { className: 'sm:col-span-2' })}
              <FormField label="Area" htmlFor="cc-area" required error={e.area}>
                <select
                id="cc-area"
                value={v.area}
                onChange={(ev) => {
                  setField('area', ev.target.value as Area);
                  setField('cityId', '');
                }}
                className={fieldClass(!!e.area)}>
                
                  <option value="">Select area</option>
                  {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </FormField>
              <FormField label="City" htmlFor="cc-city" required error={e.cityId} hint={!v.area ? 'Choose an area first' : undefined}>
                <select id="cc-city" value={v.cityId} disabled={!v.area} onChange={(ev) => setField('cityId', ev.target.value)} className={fieldClass(!!e.cityId)}>
                  <option value="">Select city</option>
                  {cityOptions.map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
                </select>
              </FormField>
            </div>
          </section>
          <section className="border-t border-line pt-6">
            <h3 className="text-sm font-semibold text-ink">Primary contact</h3>
            <p className="mt-0.5 text-xs text-ink-muted">Receives job updates and feedback requests for this site.</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {text('contactName', 'Contact name', { required: true })}
              {text('contactDesignation', 'Designation', { placeholder: 'e.g. Admin Manager' })}
              {text('contactMobile', 'Mobile number', { type: 'tel', placeholder: '07X XXX XXXX' })}
              {text('contactEmail', 'Email', { required: true, type: 'email' })}
            </div>
          </section>
        </div>
      }

      {step === 2 &&
      <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Assign salesman<span className="ml-0.5 text-accent-500" aria-hidden="true">*</span></legend>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {salesmen.map((s) => {
              const active = v.salesmanId === String(s.salesmanId);
              return (
                <label key={s.salesmanId} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-150 ${active ? 'border-brand-500 bg-brand-50' : 'border-line hover:bg-canvas'}`}>
                    <input type="radio" name="salesman" value={s.salesmanId} checked={active} onChange={() => setField('salesmanId', String(s.salesmanId))} className="h-4 w-4 text-brand-500 focus:ring-brand-500/30" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{s.salesmanName}</span>
                      <span className="block text-xs text-ink-muted">{s.salesmanCode} · {s.company}</span>
                    </span>
                  </label>);

            })}
            </div>
            {e.salesmanId && <p className="mt-1.5 text-xs text-danger-700" role="alert">{e.salesmanId}</p>}
          </fieldset>
          <div className="max-w-xs">{text('validFrom', 'Assignment starts', { required: true, type: 'date' })}</div>

          <section className="rounded-lg bg-canvas p-4">
            <h3 className="text-sm font-semibold text-ink">Review</h3>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {[
            ['Customer', v.customerName],
            ['Grade · Type', `${v.grade} · ${v.type}`],
            ['Segment', v.segment],
            ['Serviced by', v.companies.join(', ')],
            ['Head office', [v.siteName, selectedCity?.name].filter(Boolean).join(', ')],
            ['Primary contact', `${v.contactName} (${v.contactEmail})`],
            ['Salesman', selectedSalesman?.salesmanName ?? '—'],
            ['Status', v.isActive ? 'Active' : 'Inactive']].
            map(([label, value]) =>
            <div key={label}>
                  <dt className="text-xs text-ink-subtle">{label}</dt>
                  <dd className="mt-0.5 text-ink">{value || '—'}</dd>
                </div>
            )}
            </dl>
          </section>
        </div>
      }
    </Modal>);

}
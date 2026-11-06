'use client';

import { useState } from 'react';
import type { RepRequest } from '../../apis/reps';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { fieldClass } from '../../utils/styles';

interface CreateRepDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (request: Omit<RepRequest, 'createdBy'>) => Promise<void>;
}

export function CreateRepDialog({ open, onClose, onSave }: CreateRepDialogProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setCode(''); setName(''); setMobile(''); setIsActive(true); setError(''); };
  const close = () => { reset(); onClose(); };
  const submit = async () => {
    if (!code.trim()) { setError('Representative code is required.'); return; }
    if (!name.trim()) { setError('Representative name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({ repCode: code.trim(), repName: name.trim(), repMobileNumber: mobile.trim() || null, isActive });
      reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create representative.');
    } finally {
      setSaving(false);
    }
  };

  return <Modal open={open} onClose={() => !saving && close()} title="Create representative" description="Add a representative and select them for this machine sale." widthClass="max-w-lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" disabled={saving} onClick={close}>Cancel</Button><Button loading={saving} onClick={() => void submit()}>Create & select</Button></div>}>
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      <FormField label="Representative code" htmlFor="rep-code" required><input id="rep-code" maxLength={20} value={code} onChange={(event) => setCode(event.target.value)} className={fieldClass(!!error && !code.trim())} autoFocus /></FormField>
      <FormField label="Representative name" htmlFor="rep-name" required><input id="rep-name" maxLength={150} value={name} onChange={(event) => setName(event.target.value)} className={fieldClass(!!error && !name.trim())} /></FormField>
      <FormField label="Mobile number" htmlFor="rep-mobile"><input id="rep-mobile" type="tel" maxLength={20} value={mobile} onChange={(event) => setMobile(event.target.value)} className={fieldClass()} /></FormField>
      <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />Active representative</label>
    </div>
  </Modal>;
}

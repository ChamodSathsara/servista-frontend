'use client';

import { useState } from 'react';
import type { DealerRequest } from '../../apis/dealers';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { fieldClass } from '../../utils/styles';

interface CreateDealerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (request: Omit<DealerRequest, 'createdBy'>) => Promise<void>;
}

export function CreateDealerDialog({ open, onClose, onSave }: CreateDealerDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setName(''); setAddress(''); setContactNumber(''); setIsActive(true); setError(''); };
  const close = () => { reset(); onClose(); };

  const submit = async () => {
    if (!name.trim()) { setError('Dealer name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({ dealerName: name.trim(), dealerAddress: address.trim() || null, dealerContactNumber: contactNumber.trim() || null, isActive });
      reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create dealer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={() => !saving && close()} title="Create dealer" description="Add a dealer and select it for this machine sale." widthClass="max-w-lg" footer={<div className="flex justify-end gap-3"><Button variant="ghost" disabled={saving} onClick={close}>Cancel</Button><Button loading={saving} onClick={() => void submit()}>Create & select</Button></div>}>
      <div className="space-y-4">
        {error && <p className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
        <FormField label="Dealer name" htmlFor="dealer-name" required><input id="dealer-name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass(!!error && !name.trim())} autoFocus /></FormField>
        <FormField label="Address" htmlFor="dealer-address"><textarea id="dealer-address" value={address} onChange={(event) => setAddress(event.target.value)} rows={3} className={`${fieldClass()} py-2`} /></FormField>
        <FormField label="Contact number" htmlFor="dealer-contact"><input id="dealer-contact" type="tel" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} className={fieldClass()} /></FormField>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />Active dealer</label>
      </div>
    </Modal>
  );
}

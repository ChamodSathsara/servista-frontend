'use client';

import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate, initials } from '../../utils/format';
import type { TechnicianResponse } from '../../apis/technicians';

interface Props { technician: TechnicianResponse | null; loading: boolean; error: string | null; onClose: () => void }

export function TechOfficerDrawer({ technician, loading, error, onClose }: Props) {
  return <Drawer open={loading || !!error || !!technician} onClose={onClose} labelledBy="tech-drawer-title" widthClass="max-w-xl">
    <div className="px-6 py-7 sm:px-8">
      {loading && <p className="py-16 text-center text-sm text-ink-muted">Loading technician details…</p>}
      {error && <p className="py-16 text-center text-sm text-danger-700">{error}</p>}
      {technician && <>
        <header className="pr-10"><div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-lg font-semibold text-white">{initials(technician.user.userName)}</span>
          <div><div className="flex items-center gap-2"><span className="font-mono text-xs text-ink-muted">{technician.techCode}</span><StatusBadge tone={technician.user.isActive ? 'success' : 'neutral'} label={technician.user.isActive ? 'Active' : 'Inactive'} /></div>
            <h2 id="tech-drawer-title" className="mt-1 text-xl font-semibold text-ink">{technician.user.userName}</h2><p className="text-sm text-ink-muted">Created {formatDate(technician.user.createdAt)}</p></div>
        </div></header>
        <ul className="mt-7 space-y-3 border-t border-line pt-6 text-sm">
          <li className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-ink-subtle" /><a href={`tel:${technician.user.mobileNumber}`} className="hover:text-brand-600">{technician.user.mobileNumber}</a></li>
          <li className="flex items-center gap-2"><MailIcon className="h-4 w-4 text-ink-subtle" /><a href={`mailto:${technician.user.email}`} className="break-all hover:text-brand-600">{technician.user.email}</a></li>
          <li className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-ink-subtle" />{technician.user.area}</li>
        </ul>
        <dl className="mt-7 grid grid-cols-1 gap-5 rounded-xl bg-canvas p-5 sm:grid-cols-2">
          {[
            ['Technician ID', String(technician.technicianId)], ['User ID', String(technician.user.userId)],
            ['Technician role', technician.technicianRole.replaceAll('_', ' ')], ['System role', technician.user.role],
            ['Division', technician.user.division], ['Area', technician.user.area],
            ['Companies', technician.companies.join(', ')], ['Created by', String(technician.user.createdBy)],
          ].map(([label, value]) => <div key={label}><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 text-sm font-medium text-ink">{value || '—'}</dd></div>)}
        </dl>
      </>}
    </div>
  </Drawer>;
}

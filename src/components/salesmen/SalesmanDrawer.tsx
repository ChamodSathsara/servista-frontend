'use client';

import { Drawer } from '../ui/Drawer';
import { StatusBadge } from '../ui/StatusBadge';
import type { SalesmanResponse } from '../../apis/salesmen';

interface Props { salesman: SalesmanResponse | null; loading: boolean; error: string | null; onClose: () => void }

export function SalesmanDrawer({ salesman, loading, error, onClose }: Props) {
  return (
    <Drawer open={loading || !!error || !!salesman} onClose={onClose} labelledBy="salesman-drawer-title" widthClass="max-w-xl">
      <div className="px-6 py-7 sm:px-8">
        {loading && <p className="py-16 text-center text-sm text-ink-muted">Loading salesman details…</p>}
        {error && <p className="py-16 text-center text-sm text-danger-700">{error}</p>}
        {salesman && <>
          <div className="pr-10">
            <div className="flex items-center gap-2 text-xs text-ink-subtle"><span className="font-mono">#{salesman.salesmanId}</span><span>·</span><span>{salesman.salesmanCode}</span></div>
            <h2 id="salesman-drawer-title" className="mt-2 text-xl font-semibold text-ink">{salesman.user.userName}</h2>
            <div className="mt-3"><StatusBadge tone={salesman.user.isActive ? 'success' : 'neutral'} label={salesman.user.isActive ? 'Active' : 'Inactive'} /></div>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-2">
            {[
              ['Email', salesman.user.email], ['Mobile number', salesman.user.mobileNumber],
              ['Division', salesman.user.division], ['Area', salesman.user.area],
              ['Primary company', salesman.company], ['Companies', salesman.companies.join(', ')],
              ['Role', salesman.user.role], ['User ID', String(salesman.user.userId)],
              ['Created at', new Date(salesman.user.createdAt).toLocaleString()], ['Created by', String(salesman.user.createdBy)],
            ].map(([label, value]) => <div key={label}><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{value || '—'}</dd></div>)}
          </dl>
        </>}
      </div>
    </Drawer>
  );
}

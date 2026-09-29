'use client';

import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import type { SalesmanResponse } from '../../apis/salesmen';

interface Props { salesmen: SalesmanResponse[]; onSelect: (salesman: SalesmanResponse) => void }

export function SalesmenTable({ salesmen, onSelect }: Props) {
  return <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted"><tr>
        <th className="px-5 py-3 font-medium">ID</th><th className="px-5 py-3 font-medium">Salesman</th>
        <th className="px-5 py-3 font-medium">Contact</th><th className="px-5 py-3 font-medium">Division · Area</th>
        <th className="px-5 py-3 font-medium">Company</th><th className="px-5 py-3 font-medium">Status</th><th className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
      </tr></thead>
      <tbody className="divide-y divide-line">{salesmen.map((salesman) => <tr key={salesman.salesmanId} tabIndex={0}
        onClick={() => onSelect(salesman)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(salesman); } }}
        className="group cursor-pointer hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
        <td className="px-5 py-3.5 font-mono text-xs text-ink-muted">{salesman.salesmanId}</td>
        <td className="px-5 py-3.5"><p className="font-medium text-ink group-hover:text-brand-700">{salesman.user.userName}</p><p className="text-xs text-ink-subtle">{salesman.salesmanCode}</p></td>
        <td className="px-5 py-3.5"><p className="text-ink">{salesman.user.mobileNumber}</p><p className="text-xs text-ink-subtle">{salesman.user.email}</p></td>
        <td className="px-5 py-3.5 text-ink-muted">{salesman.user.division} · {salesman.user.area}</td>
        <td className="px-5 py-3.5 text-ink-muted">{salesman.company}</td>
        <td className="px-5 py-3.5"><StatusBadge tone={salesman.user.isActive ? 'success' : 'neutral'} label={salesman.user.isActive ? 'Active' : 'Inactive'} /></td>
        <td className="px-3 py-3.5 text-ink-subtle"><ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 group-hover:text-brand-600" /></td>
      </tr>)}</tbody>
    </table>
  </div>;
}

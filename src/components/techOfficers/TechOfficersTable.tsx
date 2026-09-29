'use client';

import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { initials } from '../../utils/format';
import type { TechnicianResponse } from '../../apis/technicians';

interface Props { technicians: TechnicianResponse[]; onSelect: (technician: TechnicianResponse) => void }

export function TechOfficersTable({ technicians, onSelect }: Props) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm">
    <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted"><tr>
      <th className="px-5 py-3 font-medium">Tech code</th><th className="px-5 py-3 font-medium">Technician</th>
      <th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Division · Area</th>
      <th className="px-5 py-3 font-medium">Companies</th><th className="px-5 py-3 font-medium">Status</th>
      <th className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
    </tr></thead>
    <tbody className="divide-y divide-line">{technicians.map((technician) => <tr key={technician.technicianId} tabIndex={0}
      onClick={() => onSelect(technician)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(technician); } }}
      aria-label={`View details for ${technician.user.userName}`} className="group cursor-pointer hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
      <td className="px-5 py-3.5 font-mono text-xs font-medium text-ink">{technician.techCode}</td>
      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{initials(technician.user.userName)}</span>
        <div><p className="font-medium text-ink group-hover:text-brand-700">{technician.user.userName}</p><p className="text-xs text-ink-subtle">{technician.user.mobileNumber}</p></div></div></td>
      <td className="px-5 py-3.5 text-ink-muted">{technician.technicianRole.replaceAll('_', ' ')}</td>
      <td className="px-5 py-3.5 text-ink-muted">{technician.user.division} · {technician.user.area}</td>
      <td className="px-5 py-3.5 text-ink-muted">{technician.companies.join(', ')}</td>
      <td className="px-5 py-3.5"><StatusBadge tone={technician.user.isActive ? 'success' : 'neutral'} label={technician.user.isActive ? 'Active' : 'Inactive'} /></td>
      <td className="px-3 py-3.5 text-ink-subtle"><ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 group-hover:text-brand-600" /></td>
    </tr>)}</tbody>
  </table></div>;
}

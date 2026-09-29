'use client';

import { ChevronRightIcon, StarIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { initials } from '../../utils/format';
import { techStatusTone } from '../../utils/status';
import type { TechOfficer } from '../../types/techOfficer';

interface TechOfficersTableProps {
  officers: TechOfficer[];
  onSelect: (officer: TechOfficer) => void;
}

export function TechOfficersTable({ officers, onSelect }: TechOfficersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">Tech code</th>
            <th scope="col" className="px-5 py-3 font-medium">Officer</th>
            <th scope="col" className="px-5 py-3 font-medium">Region</th>
            <th scope="col" className="hidden px-5 py-3 font-medium xl:table-cell">Specialization</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Jobs this month</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Rating</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {officers.map((o) =>
          <tr
            key={o.techId}
            tabIndex={0}
            onClick={() => onSelect(o)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(o);
              }
            }}
            aria-label={`View details for ${o.name}`}
            className="group cursor-pointer transition-colors duration-150 hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
            
              <td className="px-5 py-3.5 font-mono text-xs font-medium text-ink">{o.techCode}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                    {initials(o.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink group-hover:text-brand-700">{o.name}</p>
                    <p className="truncate text-xs text-ink-subtle">{o.mobileNumber}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-ink-muted">{o.region}</td>
              <td className="hidden px-5 py-3.5 text-ink-muted xl:table-cell">{o.specializations.join(', ')}</td>
              <td className="px-5 py-3.5 text-right tabular-nums text-ink">{o.jobsThisMonth}</td>
              <td className="px-5 py-3.5 text-right">
                {o.rating > 0 ?
              <span className="inline-flex items-center gap-1 tabular-nums text-ink">
                    <StarIcon className="h-3.5 w-3.5 fill-warning-600 text-warning-600" aria-hidden="true" />
                    {o.rating.toFixed(1)}
                  </span> :

              <span className="text-xs text-ink-subtle">New</span>
              }
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge tone={techStatusTone[o.status]} label={o.status} />
              </td>
              <td className="px-3 py-3.5 text-ink-subtle">
                <ChevronRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}
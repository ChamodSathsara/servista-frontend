'use client';

import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import type { Customer } from '../../types/customer';

interface CustomersTableProps {
  customers: Customer[];
  machineCounts: Map<number, number>;
  onSelect: (customer: Customer) => void;
}

export function CustomersTable({ customers, machineCounts, onSelect }: CustomersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">Customer ID</th>
            <th scope="col" className="px-5 py-3 font-medium">Customer</th>
            <th scope="col" className="px-5 py-3 font-medium">Head office</th>
            <th scope="col" className="hidden px-5 py-3 font-medium xl:table-cell">Type · Segment</th>
            <th scope="col" className="px-5 py-3 text-center font-medium">Grade</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Machines</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {customers.map((c) =>
          <tr
            key={c.customerId}
            tabIndex={0}
            onClick={() => onSelect(c)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(c);
              }
            }}
            aria-label={`View machines for ${c.customerName}`}
            className="group cursor-pointer transition-colors duration-150 hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
            
              <td className="px-5 py-3.5 font-mono text-xs text-ink-muted">{c.customerId}</td>
              <td className="px-5 py-3.5">
                <p className="font-medium text-ink group-hover:text-brand-700">{c.customerName}</p>
                <p className="text-xs text-ink-subtle">{c.sageCode || 'No Sage code'}</p>
              </td>
              <td className="px-5 py-3.5">
                <p className="text-ink">{c.headOfficeTel || '—'}</p>
                <p className="max-w-[220px] truncate text-xs text-ink-subtle">{c.headOfficeEmail}</p>
              </td>
              <td className="hidden px-5 py-3.5 text-ink-muted xl:table-cell">
                {c.type} · {c.segment}
              </td>
              <td className="px-5 py-3.5 text-center">
                <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${
                c.grade === 'A' ? 'bg-brand-500 text-white' : 'bg-canvas text-ink ring-1 ring-inset ring-line'}`
                }>
                
                  {c.grade}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums text-ink">{machineCounts.get(c.customerId) ?? 0}</td>
              <td className="px-5 py-3.5">
                <StatusBadge tone={c.isActive ? 'success' : 'neutral'} label={c.isActive ? 'Active' : 'Inactive'} />
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
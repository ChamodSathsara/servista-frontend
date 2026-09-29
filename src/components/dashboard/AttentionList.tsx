'use client';

import { useRouter } from 'next/navigation';
import { ChevronRightIcon, CircleCheckIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { machines } from '../../data/machines';
import { customers } from '../../data/customers';
import { formatDate } from '../../utils/format';
import { machineStatusTone } from '../../utils/status';

export function AttentionList() {
  const router = useRouter();
  const items = machines.
  filter((m) => m.status === 'Breakdown' || m.status === 'Under Service').
  sort((a, b) => a.status === b.status ? 0 : a.status === 'Breakdown' ? -1 : 1).
  map((m) => ({ ...m, customerName: customers.find((c) => c.customerId === m.customerId)?.customerName ?? '—' }));

  return (
    <section aria-labelledby="attention-heading" className="rounded-xl border border-line bg-white lg:col-span-2">
      <div className="flex items-baseline justify-between gap-3 px-6 pt-6">
        <h2 id="attention-heading" className="text-base font-semibold text-ink">
          Machines needing attention
        </h2>
        <span className="text-sm text-ink-muted">{items.length} open</span>
      </div>

      {items.length === 0 ?
      <div className="flex flex-col items-center px-6 py-12 text-center">
          <CircleCheckIcon className="h-8 w-8 text-success-600" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-ink">Every machine is running</p>
        </div> :

      <ul className="mt-3 divide-y divide-line">
          {items.map((m) =>
        <li key={m.machineId}>
              <button
            type="button"
            onClick={() => router.push(`/customers?customer=${m.customerId}`)}
            className="group flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors duration-150 hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
            
                <div className="w-28 shrink-0">
                  <StatusBadge tone={machineStatusTone[m.status]} label={m.status} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink group-hover:text-brand-700">{m.customerName}</p>
                  <p className="truncate text-xs text-ink-subtle">
                    {m.brand} {m.model} · <span className="font-mono">{m.serialNumber}</span> · {m.siteName}
                  </p>
                </div>
                <p className="hidden shrink-0 text-xs text-ink-muted sm:block">Last visit {formatDate(m.lastServiceDate)}</p>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-subtle group-hover:text-brand-600" aria-hidden="true" />
              </button>
            </li>
        )}
        </ul>
      }
    </section>);

}
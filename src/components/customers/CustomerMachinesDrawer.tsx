'use client';

import { useMemo, useState } from 'react';
import { MailIcon, MapPinIcon, PhoneIcon, PrinterIcon, UserIcon } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { StatusBadge } from '../ui/StatusBadge';
import { SegmentedControl } from '../ui/SegmentedControl';
import { machines } from '../../data/machines';
import { salesmen } from '../../data/salesmen';
import { formatDate, formatNumber } from '../../utils/format';
import { machineStatusTone } from '../../utils/status';
import type { Customer, MachineStatus } from '../../types/customer';

interface CustomerMachinesDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

type MachineFilter = 'all' | 'attention';

export function CustomerMachinesDrawer({ customer, onClose }: CustomerMachinesDrawerProps) {
  const [filter, setFilter] = useState<MachineFilter>('all');

  const customerMachines = useMemo(
    () => customer ? machines.filter((m) => m.customerId === customer.customerId) : [],
    [customer]
  );
  const needsAttention = (s: MachineStatus) => s === 'Breakdown' || s === 'Under Service';
  const attentionCount = customerMachines.filter((m) => needsAttention(m.status)).length;
  const visible = filter === 'attention' ? customerMachines.filter((m) => needsAttention(m.status)) : customerMachines;
  const salesman = customer ? salesmen.find((s) => s.salesmanId === customer.salesmanId) : undefined;

  return (
    <Drawer open={!!customer} onClose={onClose} labelledBy="customer-drawer-title">
      {customer &&
      <div>
          <header className="border-b border-line px-6 pb-6 pt-6 pr-16">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span className="font-mono">#{customer.customerId}</span>
              {customer.sageCode && <span>· Sage {customer.sageCode}</span>}
              <StatusBadge tone={customer.isActive ? 'success' : 'neutral'} label={customer.isActive ? 'Active' : 'Inactive'} />
            </div>
            <h2 id="customer-drawer-title" className="mt-2 text-xl font-semibold tracking-tight text-ink">
              {customer.customerName}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Grade {customer.grade} · {customer.type} · {customer.segment}
            </p>

            <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd className="text-ink">{[customer.addressLine1, customer.addressLine2, customer.addressLine3].filter(Boolean).join(', ') || '—'}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <UserIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Primary contact</dt>
                  <dd className="text-ink">{customer.primaryContact?.contactName ?? '—'}</dd>
                  {customer.primaryContact && <dd className="text-xs text-ink-muted">{customer.primaryContact.designation} · {customer.primaryContact.mobileNumber}</dd>}
                </div>
              </div>
              <div className="flex gap-2.5">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Telephone</dt>
                  <dd className="text-ink">{customer.headOfficeTel || '—'}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="sr-only">Email</dt>
                  <dd className="truncate text-ink">{customer.headOfficeEmail || '—'}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4 text-sm">
              <div>
                <span className="text-ink-subtle">Salesman </span>
                <span className="font-medium text-ink">{salesman ? `${salesman.salesmanName} (${salesman.salesmanCode})` : '—'}</span>
              </div>
              <div>
                <span className="text-ink-subtle">Serviced by </span>
                <span className="font-medium text-ink">{customer.companies.join(', ')}</span>
              </div>
            </div>
          </header>

          <section className="px-6 py-6" aria-labelledby="machines-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 id="machines-heading" className="text-base font-semibold text-ink">
                  Machines <span className="font-normal text-ink-subtle">({customerMachines.length})</span>
                </h3>
                {customerMachines.length > 0 &&
              <p className="mt-0.5 text-sm text-ink-muted">
                    {attentionCount === 0 ? 'All machines are running normally.' : `${attentionCount} need${attentionCount === 1 ? 's' : ''} attention.`}
                  </p>
              }
              </div>
              {customerMachines.length > 0 &&
            <SegmentedControl
              compact
              ariaLabel="Filter machines"
              value={filter}
              onChange={setFilter}
              options={[
              { value: 'all', label: 'All', count: customerMachines.length },
              { value: 'attention', label: 'Needs attention', count: attentionCount }]
              } />

            }
            </div>

            {customerMachines.length === 0 ?
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
                <PrinterIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink">No machines registered yet</p>
                <p className="mt-1 max-w-xs text-sm text-ink-muted">Machines sold or installed for this customer will appear here.</p>
              </div> :
          visible.length === 0 ?
          <p className="mt-6 rounded-xl bg-canvas px-4 py-8 text-center text-sm text-ink-muted">No machines need attention right now.</p> :

          <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-canvas text-xs text-ink-muted">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">Machine</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Site</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Contract</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">Meter</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {visible.map((m) =>
                <tr key={m.machineId}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{m.brand} {m.model}</p>
                          <p className="font-mono text-xs text-ink-subtle">{m.serialNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{m.siteName}</td>
                        <td className="px-4 py-3">
                          <p className="text-ink">{m.contractType}</p>
                          <p className="text-xs text-ink-subtle">Serviced {formatDate(m.lastServiceDate)}</p>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{formatNumber(m.meterReading)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={machineStatusTone[m.status]} label={m.status} />
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
          }
          </section>
        </div>
      }
    </Drawer>);

}

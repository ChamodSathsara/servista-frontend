import { machines } from '../../data/machines';
import { customers } from '../../data/customers';
import { techOfficers } from '../../data/techOfficers';
import type { MachineStatus } from '../../types/customer';

const segments: {status: MachineStatus;color: string;}[] = [
{ status: 'Operational', color: 'bg-success-600' },
{ status: 'Under Service', color: 'bg-warning-600' },
{ status: 'Breakdown', color: 'bg-danger-600' },
{ status: 'Decommissioned', color: 'bg-line' }];


export function FleetHealthPanel() {
  const total = machines.length;
  const customersWithMachines = new Set(machines.map((m) => m.customerId)).size;
  const counts = segments.map((s) => ({ ...s, count: machines.filter((m) => m.status === s.status).length }));
  const operational = counts[0].count;
  const uptime = Math.round(operational / Math.max(1, total - counts[3].count) * 100);

  const activeCustomers = customers.filter((c) => c.isActive).length;
  const jobsThisMonth = techOfficers.reduce((sum, t) => sum + t.jobsThisMonth, 0);
  const rated = techOfficers.filter((t) => t.rating > 0);
  const avgRating = rated.reduce((sum, t) => sum + t.rating, 0) / Math.max(1, rated.length);

  return (
    <section aria-labelledby="fleet-heading" className="rounded-xl border border-line bg-white p-6 lg:col-span-2">
      <h2 id="fleet-heading" className="text-sm font-medium text-ink-muted">
        Machine fleet
      </h2>
      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
        <p className="text-5xl font-semibold tracking-tight tabular-nums text-ink">{uptime}%</p>
        <p className="pb-1.5 text-sm text-ink-muted">
          of {total - counts[3].count} active machines running normally, across {customersWithMachines} customers
        </p>
      </div>

      <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-canvas" role="img" aria-label="Machine status breakdown">
        {counts.map((s) =>
        s.count > 0 ? <div key={s.status} className={`${s.color} h-full`} style={{ width: `${s.count / total * 100}%` }} /> : null
        )}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((s) =>
        <li key={s.status} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.color}`} aria-hidden="true" />
            <span className="truncate text-ink-muted">{s.status}</span>
            <span className="ml-auto font-medium tabular-nums text-ink sm:ml-0">{s.count}</span>
          </li>
        )}
      </ul>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
        <div>
          <dt className="text-xs text-ink-subtle">Active customers</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{activeCustomers}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-subtle">Jobs this month</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{jobsThisMonth}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-subtle">Avg. customer rating</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{avgRating.toFixed(1)}</dd>
        </div>
      </dl>
    </section>);

}
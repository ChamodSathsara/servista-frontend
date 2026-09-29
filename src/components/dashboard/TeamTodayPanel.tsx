import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { techOfficers } from '../../data/techOfficers';
import { initials } from '../../utils/format';
import type { TechStatus } from '../../types/techOfficer';

const statusRows: {status: TechStatus;color: string;}[] = [
{ status: 'Available', color: 'bg-success-600' },
{ status: 'On Job', color: 'bg-brand-500' },
{ status: 'On Leave', color: 'bg-warning-600' }];


export function TeamTodayPanel() {
  const available = techOfficers.filter((t) => t.status === 'Available');

  return (
    <section aria-labelledby="team-heading" className="flex flex-col rounded-xl border border-line bg-white p-6">
      <h2 id="team-heading" className="text-sm font-medium text-ink-muted">
        Tech officers today
      </h2>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {statusRows.map((row) =>
        <div key={row.status}>
            <dt className="flex items-center gap-1.5 text-xs text-ink-subtle">
              <span className={`h-2 w-2 rounded-full ${row.color}`} aria-hidden="true" />
              {row.status}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">
              {techOfficers.filter((t) => t.status === row.status).length}
            </dd>
          </div>
        )}
      </dl>

      <h3 className="mt-6 text-xs font-medium text-ink-subtle">Ready to dispatch</h3>
      <ul className="mt-2 divide-y divide-line">
        {available.slice(0, 4).map((t) =>
        <li key={t.techId} className="flex items-center gap-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
              {initials(t.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{t.name}</p>
              <p className="truncate text-xs text-ink-subtle">
                {t.techCode} · {t.region}
              </p>
            </div>
          </li>
        )}
      </ul>

      <Link
        href="/tech-officers"
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-brand-600 hover:text-brand-700">
        
        All tech officers
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>);

}
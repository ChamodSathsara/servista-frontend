'use client';

import { useMemo, useState } from 'react';
import { ClipboardListIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { StatusBadge } from '../ui/StatusBadge';
import { SegmentedControl } from '../ui/SegmentedControl';
import { techJobs } from '../../data/techOfficers';
import { formatDate, formatNumber, initials } from '../../utils/format';
import { jobOutcomeTone, techStatusTone } from '../../utils/status';
import type { JobType, TechOfficer } from '../../types/techOfficer';

interface TechOfficerDrawerProps {
  officer: TechOfficer | null;
  onClose: () => void;
}

type HistoryFilter = 'all' | JobType;

const jobTypeDot: Record<JobType, string> = {
  Breakdown: 'bg-danger-600',
  'Service Visit': 'bg-brand-500',
  Installation: 'bg-success-600',
  'Meter Reading': 'bg-ink-subtle'
};

export function TechOfficerDrawer({ officer, onClose }: TechOfficerDrawerProps) {
  const [filter, setFilter] = useState<HistoryFilter>('all');

  // Reset the filter when a different officer is opened (adjusting state during render, not in an effect).
  const techId = officer?.techId;
  const [prevTechId, setPrevTechId] = useState(techId);
  if (prevTechId !== techId) {
    setPrevTechId(techId);
    setFilter('all');
  }

  const history = useMemo(
    () => officer ? techJobs.filter((j) => j.techId === officer.techId).sort((a, b) => b.date.localeCompare(a.date)) : [],
    [officer]
  );
  const visible = filter === 'all' ? history : history.filter((j) => j.type === filter);
  const countOf = (t: JobType) => history.filter((j) => j.type === t).length;

  return (
    <Drawer open={!!officer} onClose={onClose} labelledBy="tech-drawer-title" widthClass="max-w-2xl">
      {officer &&
      <div>
          <header className="border-b border-line px-6 py-6 pr-16">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-500 text-lg font-semibold text-white">
                {initials(officer.name)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-medium text-ink-muted">{officer.techCode}</span>
                  <StatusBadge tone={techStatusTone[officer.status]} label={officer.status} />
                </div>
                <h2 id="tech-drawer-title" className="mt-1 truncate text-xl font-semibold tracking-tight text-ink">
                  {officer.name}
                </h2>
                <p className="text-sm text-ink-muted">Joined {formatDate(officer.joinedDate)}</p>
              </div>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2 text-ink">
                <PhoneIcon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <a href={`tel:${officer.mobileNumber.replace(/\s/g, '')}`} className="hover:text-brand-600">{officer.mobileNumber}</a>
              </li>
              <li className="flex min-w-0 items-center gap-2 text-ink">
                <MailIcon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                <a href={`mailto:${officer.email}`} className="truncate hover:text-brand-600">{officer.email}</a>
              </li>
              <li className="flex items-center gap-2 text-ink">
                <MapPinIcon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                {officer.region} region
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {officer.specializations.map((s) =>
            <span key={s} className="rounded-md bg-canvas px-2.5 py-1 text-xs font-medium text-ink-muted ring-1 ring-inset ring-line">
                  {s}
                </span>
            )}
            </div>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-xl border border-line">
              <div className="px-4 py-3">
                <dt className="text-xs text-ink-subtle">Jobs completed</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">{formatNumber(officer.jobsCompleted)}</dd>
                <dd className="text-xs text-ink-muted">{officer.jobsThisMonth} this month</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-ink-subtle">Avg. response</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{officer.avgResponseHrs > 0 ? `${officer.avgResponseHrs} hrs` : '—'}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-ink-subtle">Customer rating</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{officer.rating > 0 ? `${officer.rating.toFixed(1)} / 5` : '—'}</dd>
              </div>
            </dl>
          </header>

          <section className="px-6 py-6" aria-labelledby="history-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 id="history-heading" className="text-base font-semibold text-ink">Job history</h3>
              {history.length > 0 &&
            <div className="overflow-x-auto">
                  <SegmentedControl
                compact
                ariaLabel="Filter history"
                value={filter}
                onChange={setFilter}
                options={[
                { value: 'all', label: 'All', count: history.length },
                { value: 'Breakdown', label: 'Breakdowns', count: countOf('Breakdown') },
                { value: 'Service Visit', label: 'Visits', count: countOf('Service Visit') },
                { value: 'Installation', label: 'Installs', count: countOf('Installation') }]
                } />
              
                </div>
            }
            </div>

            {history.length === 0 ?
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
                <ClipboardListIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink">No jobs yet</p>
                <p className="mt-1 max-w-xs text-sm text-ink-muted">Jobs assigned to {officer.name.split(' ')[0]} will build up a history here.</p>
              </div> :
          visible.length === 0 ?
          <p className="mt-6 rounded-xl bg-canvas px-4 py-8 text-center text-sm text-ink-muted">No jobs of this type yet.</p> :

          <ol className="relative mt-5 space-y-5 border-l border-line pl-6">
                {visible.map((job) =>
            <li key={job.jobId} className="relative">
                    <span className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${jobTypeDot[job.type]}`} aria-hidden="true" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-ink-muted">
                        <time dateTime={job.date}>{formatDate(job.date)}</time> · {job.type} · {job.durationHrs} hrs
                      </p>
                      <StatusBadge tone={jobOutcomeTone[job.outcome]} label={job.outcome} />
                    </div>
                    <p className="mt-1 font-medium text-ink">{job.customerName}</p>
                    <p className="text-xs text-ink-subtle">{job.machine}</p>
                    <p className="mt-1.5 text-sm text-ink-muted">{job.summary}</p>
                  </li>
            )}
              </ol>
          }
          </section>
        </div>
      }
    </Drawer>);

}
import { techJobs, techOfficers } from '../../data/techOfficers';
import { formatDate } from '../../utils/format';
import type { JobType } from '../../types/techOfficer';

const dotColor: Record<JobType, string> = {
  Breakdown: 'bg-danger-600',
  'Service Visit': 'bg-brand-500',
  Installation: 'bg-success-600',
  'Meter Reading': 'bg-ink-subtle'
};

export function RecentActivity() {
  const recent = [...techJobs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <section aria-labelledby="activity-heading" className="rounded-xl border border-line bg-white p-6">
      <h2 id="activity-heading" className="text-base font-semibold text-ink">
        Recent field activity
      </h2>
      <ol className="relative mt-5 space-y-4 border-l border-line pl-5">
        {recent.map((job) => {
          const tech = techOfficers.find((t) => t.techId === job.techId);
          return (
            <li key={job.jobId} className="relative">
              <span className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${dotColor[job.type]}`} aria-hidden="true" />
              <p className="text-sm text-ink">
                <span className="font-medium">{tech?.name ?? 'Unknown'}</span>
                <span className="text-ink-muted"> — {job.type.toLowerCase()}</span>
              </p>
              <p className="truncate text-xs text-ink-subtle">{job.customerName}</p>
              <p className="mt-0.5 text-xs text-ink-subtle">
                <time dateTime={job.date}>{formatDate(job.date)}</time> · {job.outcome}
              </p>
            </li>);

        })}
      </ol>
    </section>);

}
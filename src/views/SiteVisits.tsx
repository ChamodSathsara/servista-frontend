'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheckIcon,
  ChevronRightIcon,
  Clock3Icon,
  FileTextIcon,
  PrinterIcon,
  RotateCcwIcon,
  SearchIcon,
  SearchXIcon,
  UserRoundIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getServiceSchedule,
  getServiceSchedules,
  getServiceSchedulesByAgreement,
  getServiceSchedulesByMachine,
  type ServiceScheduleResponse,
  type ServiceVisitStatus,
} from '../apis/serviceSchedules';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { StatusBadge, type BadgeTone } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/format';

type LookupMode = 'all' | 'agreement' | 'machine';

const statusTone = (status: ServiceVisitStatus): BadgeTone => {
  if (status === 'COMPLETED') return 'success';
  if (status === 'DUE' || status === 'RECALLED') return 'warning';
  if (status === 'CANCELLED') return 'danger';
  if (status === 'STARTED') return 'info';
  return 'neutral';
};

const statusLabel = (status: string) =>
  status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

const optionalDate = (date: string | null) => date ? formatDate(date) : '—';
const optionalDateTime = (date: string | null) => date ? new Date(date).toLocaleString() : '—';

export function SiteVisits() {
  const [visits, setVisits] = useState<ServiceScheduleResponse[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | ServiceVisitStatus>('ALL');
  const [lookupMode, setLookupMode] = useState<LookupMode>('all');
  const [lookupId, setLookupId] = useState('');
  const [activeLookup, setActiveLookup] = useState('All service visits');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ServiceScheduleResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVisits(await getServiceSchedules());
      setLookupMode('all');
      setLookupId('');
      setActiveLookup('All service visits');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load service visits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getServiceSchedules()
      .then((result) => { if (!cancelled) setVisits(result); })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load service visits.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const runLookup = async () => {
    if (lookupMode === 'all') {
      await loadAll();
      return;
    }
    const id = Number(lookupId);
    if (!Number.isInteger(id) || id <= 0) {
      toast.error(`Enter a valid ${lookupMode} ID.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = lookupMode === 'agreement'
        ? await getServiceSchedulesByAgreement(id)
        : await getServiceSchedulesByMachine(id);
      setVisits(result);
      setActiveLookup(`${lookupMode === 'agreement' ? 'Agreement' : 'Machine'} ID ${id}`);
    } catch (lookupError) {
      setVisits([]);
      setError(lookupError instanceof Error ? lookupError.message : 'Unable to load service visits.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return visits.filter((visit) => {
      const matchesStatus = status === 'ALL' || visit.status === status;
      const matchesQuery = !normalizedQuery || [
        visit.agreementNumber,
        visit.machineReferenceNumber,
        visit.assignedTechnicianName ?? '',
        String(visit.serviceScheduleId),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [query, status, visits]);

  const openVisit = async (visit: ServiceScheduleResponse) => {
    setSelected(null);
    setDetailLoading(true);
    try {
      setSelected(await getServiceSchedule(visit.serviceScheduleId));
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : 'Unable to load service visit.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <CalendarCheckIcon className="h-4 w-4" /> Service operations
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-ink">Site Visits</h1>
          <p className="mt-1 text-sm text-ink-muted">{activeLookup} · {visits.length} visits</p>
        </div>
        {lookupMode !== 'all' && (
          <Button variant="secondary" icon={<RotateCcwIcon className="h-4 w-4" />} onClick={() => void loadAll()}>
            Show all visits
          </Button>
        )}
      </div>

      <section className="mt-6 rounded-xl border border-line bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-ink-muted">Find visits from the server</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <select
            value={lookupMode}
            onChange={(event) => {
              const mode = event.target.value as LookupMode;
              setLookupMode(mode);
              if (mode === 'all') setLookupId('');
            }}
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand-500"
            aria-label="Visit lookup type"
          >
            <option value="all">All visits</option>
            <option value="agreement">By agreement ID</option>
            <option value="machine">By machine ID</option>
          </select>
          {lookupMode !== 'all' && (
            <input
              type="number"
              min="1"
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void runLookup(); }}
              placeholder={`Enter ${lookupMode} ID`}
              aria-label={`${lookupMode} ID`}
              className="h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500 sm:w-56"
            />
          )}
          <Button onClick={() => void runLookup()} loading={loading}>Load visits</Button>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="flex h-10 flex-1 items-center rounded-lg border border-line sm:max-w-xl">
            <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search machine, agreement or technician"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"
              aria-label="Search site visits"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="mr-2"><XIcon className="h-4 w-4" /></button>}
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'ALL' | ServiceVisitStatus)}
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand-500"
            aria-label="Filter visit status"
          >
            <option value="ALL">All statuses</option>
            {(['SCHEDULED', 'DUE', 'STARTED', 'COMPLETED', 'RECALLED', 'CANCELLED'] as ServiceVisitStatus[])
              .map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="px-6 py-16 text-center text-sm text-ink-muted">Loading site visits…</p>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-danger-700">{error}</p>
            <Button variant="secondary" className="mt-5" onClick={() => void loadAll()}>Load all visits</Button>
          </div>
        ) : filteredVisits.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Visit</th>
                  <th className="px-5 py-3 font-medium">Machine</th>
                  <th className="px-5 py-3 font-medium">Agreement</th>
                  <th className="px-5 py-3 font-medium">Expected date</th>
                  <th className="px-5 py-3 font-medium">Technician</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredVisits.map((visit) => (
                  <tr key={visit.serviceScheduleId} onClick={() => void openVisit(visit)} className="group cursor-pointer hover:bg-brand-50/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink group-hover:text-brand-700">Visit {visit.visitNumber}</p>
                      <p className="text-xs text-ink-subtle">Year {visit.agreementYearNumber} · ID {visit.serviceScheduleId}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium text-ink">{visit.machineReferenceNumber}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-muted">{visit.agreementNumber}</td>
                    <td className="px-5 py-3.5 text-ink-muted">{formatDate(visit.expectedVisitDate)}</td>
                    <td className="px-5 py-3.5 text-ink-muted">{visit.assignedTechnicianName || 'Unassigned'}</td>
                    <td className="px-5 py-3.5"><StatusBadge tone={statusTone(visit.status)} label={statusLabel(visit.status)} /></td>
                    <td className="pr-4"><ChevronRightIcon className="h-4 w-4 text-ink-subtle group-hover:text-brand-700" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <SearchXIcon className="mx-auto h-8 w-8 text-ink-subtle" />
            <p className="mt-3 text-sm font-medium text-ink">No site visits found</p>
            <p className="mt-1 text-xs text-ink-subtle">Try another lookup, search term, or status.</p>
          </div>
        )}
      </div>

      <Drawer open={detailLoading || !!selected} onClose={() => { setSelected(null); setDetailLoading(false); }} labelledBy="site-visit-title" widthClass="max-w-2xl">
        <div className="px-6 py-7 sm:px-8">
          {detailLoading ? (
            <p className="py-16 text-center text-sm text-ink-muted">Loading visit details…</p>
          ) : selected && (
            <>
              <div className="pr-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ink-muted">Schedule #{selected.serviceScheduleId}</span>
                  <StatusBadge tone={statusTone(selected.status)} label={statusLabel(selected.status)} />
                </div>
                <h2 id="site-visit-title" className="mt-2 text-xl font-semibold text-ink">Service visit {selected.visitNumber}</h2>
                <p className="mt-1 text-sm text-ink-muted">Agreement year {selected.agreementYearNumber}</p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-canvas/50 p-4"><PrinterIcon className="h-4 w-4 text-brand-600" /><p className="mt-2 text-xs text-ink-subtle">Machine</p><p className="mt-0.5 font-mono text-sm font-medium">{selected.machineReferenceNumber}</p></div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4"><FileTextIcon className="h-4 w-4 text-brand-600" /><p className="mt-2 text-xs text-ink-subtle">Agreement</p><p className="mt-0.5 font-mono text-sm font-medium">{selected.agreementNumber}</p></div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4"><CalendarCheckIcon className="h-4 w-4 text-brand-600" /><p className="mt-2 text-xs text-ink-subtle">Expected visit</p><p className="mt-0.5 text-sm font-medium">{formatDate(selected.expectedVisitDate)}</p></div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4"><UserRoundIcon className="h-4 w-4 text-brand-600" /><p className="mt-2 text-xs text-ink-subtle">Assigned technician</p><p className="mt-0.5 text-sm font-medium">{selected.assignedTechnicianName || 'Unassigned'}</p></div>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-3">
                {[
                  ['Agreement ID', selected.agreementId],
                  ['Machine ID', selected.machineId],
                  ['Technician ID', selected.assignedTechnicianId ?? '—'],
                  ['Scheduled date', optionalDate(selected.scheduledDate)],
                  ['Actual visit date', optionalDate(selected.actualVisitDate)],
                  ['Created at', new Date(selected.createdAt).toLocaleString()],
                ].map(([label, value]) => <div key={String(label)}><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 text-sm font-medium text-ink">{value}</dd></div>)}
              </dl>

              <section className="mt-7 border-t border-line pt-6">
                <div className="flex items-center gap-2"><Clock3Icon className="h-4 w-4 text-ink-muted" /><h3 className="text-sm font-semibold">Visit progress</h3></div>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ['Started at', optionalDateTime(selected.startedAt)],
                    ['Completed at', optionalDateTime(selected.completedAt)],
                    ['Start note', selected.startNote || '—'],
                    ['Solution type ID', selected.solutionTypeId ?? '—'],
                    ['Solution note', selected.solutionNote || '—'],
                  ].map(([label, value]) => <div key={String(label)}><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm text-ink">{value}</dd></div>)}
                </dl>
              </section>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}

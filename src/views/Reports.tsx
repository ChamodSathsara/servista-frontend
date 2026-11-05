'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  WrenchIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { getTechnicians, type TechnicianResponse } from '../apis/technicians';
import {
  downloadAgreementReport,
  getAgreementReport,
  type AgreementReportType,
  type ReportArea,
  type ReportFilters,
  type MachineAgreementReportRow,
  type ReportPage,
  type ReportTeam,
} from '../apis/reports';

const cards = [
  {
    type: 'ns' as const,
    number: '01',
    title: 'NS Base Report',
    subtitle: 'No Service Machines',
    description: 'Find all machines that have not received any service. Identify gaps in coverage and unserviced units across all regions.',
    icon: SearchIcon,
    accent: 'bg-rose-50 text-rose-700',
  },
  {
    type: 'fs' as const,
    number: '02',
    title: 'FS Report',
    subtitle: 'Free Service Due Next Month',
    description: 'Locate machines whose free service period ends next month. Plan ahead and schedule timely service visits before expiry.',
    icon: WrenchIcon,
    accent: 'bg-blue-50 text-blue-700',
  },
  {
    type: 'ma' as const,
    number: '03',
    title: 'MA Base Report',
    subtitle: 'Maintenance Agreement Expiry',
    description: 'Discover machines under maintenance agreements expiring next month. Ensure renewals and continued coverage are handled proactively.',
    icon: ShieldCheckIcon,
    accent: 'bg-emerald-50 text-emerald-700',
  },
];

const iso = (date: Date) => date.toISOString().slice(0, 10);
const thisYear = () => ({ startDate: `${new Date().getFullYear()}-01-01`, lastDate: `${new Date().getFullYear()}-12-31` });

export function Reports() {
  const [selected, setSelected] = useState<AgreementReportType | null>(null);
  const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({ ...thisYear(), page: 0, size: 20 });
  const [result, setResult] = useState<ReportPage | null>(null);
  const [selectedRow, setSelectedRow] = useState<MachineAgreementReportRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<'pdf' | 'excel' | null>(null);
  const selectedCard = useMemo(() => cards.find((card) => card.type === selected), [selected]);

  useEffect(() => {
    getTechnicians().then(setTechnicians).catch(() => setTechnicians([]));
  }, []);

  const open = (type: AgreementReportType) => {
    const now = new Date();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    setSelected(type);
    setResult(null);
    setFilters({
      ...(type === 'ns' ? thisYear() : { startDate: iso(nextMonthStart), lastDate: iso(nextMonthEnd) }),
      page: 0,
      size: 20,
    });
  };

  const load = async (next: ReportFilters = filters) => {
    if (!selected) return;
    setLoading(true);
    try {
      const data = await getAgreementReport(selected, next);
      setFilters(next);
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load the report.');
    } finally {
      setLoading(false);
    }
  };

  const download = async (format: 'pdf' | 'excel') => {
    if (!selected) return;
    setDownloading(format);
    try {
      await downloadAgreementReport(selected, format, filters);
      toast.success(`${format === 'pdf' ? 'PDF' : 'Excel'} report downloaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed.');
    } finally {
      setDownloading(null);
    }
  };

  if (!selected || !selectedCard) {
    return <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Insights</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Reports</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Review service coverage and upcoming agreement deadlines. Open a report to filter, inspect and export its machine list.</p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return <button key={card.type} type="button" onClick={() => open(card.type)} className="group rounded-2xl border border-line bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}><Icon className="h-6 w-6" /></div>
              <span className="text-sm font-semibold text-ink-subtle">{card.number}</span>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-ink">{card.title}</h2>
            <p className="mt-2 text-sm font-semibold text-brand-700">{card.subtitle}</p>
            <p className="mt-4 text-sm leading-6 text-ink-muted">{card.description}</p>
            <p className="mt-6 text-sm font-semibold text-brand-700">Open report <span className="transition group-hover:translate-x-1">→</span></p>
          </button>;
        })}
      </div>
    </div>;
  }

  return <div className="mx-auto max-w-7xl">
    <button type="button" onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-brand-700"><ArrowLeftIcon className="h-4 w-4" />All reports</button>
    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{selectedCard.title}</h1>
        <p className="mt-1 text-sm font-medium text-brand-700">{selectedCard.subtitle}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={!!downloading} onClick={() => void download('pdf')} className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink shadow-sm hover:bg-canvas disabled:opacity-50"><FileTextIcon className="h-4 w-4 text-rose-600" />{downloading === 'pdf' ? 'Preparing…' : 'Download PDF'}</button>
        <button type="button" disabled={!!downloading} onClick={() => void download('excel')} className="flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"><FileSpreadsheetIcon className="h-4 w-4" />{downloading === 'excel' ? 'Preparing…' : 'Download Excel'}</button>
      </div>
    </div>

    <div className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Field label="Start date"><input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value, page: 0 }))} className="control" /></Field>
        <Field label="End date"><input type="date" value={filters.lastDate} onChange={(e) => setFilters((f) => ({ ...f, lastDate: e.target.value, page: 0 }))} className="control" /></Field>
        <Field label="Area"><select value={filters.area ?? ''} onChange={(e) => setFilters((f) => ({ ...f, area: (e.target.value || undefined) as ReportArea | undefined, page: 0 }))} className="control"><option value="">All areas</option><option value="COLOMBO">Colombo</option><option value="SUBURB">Suburb</option><option value="OUTSTATION">Outstation</option></select></Field>
        <Field label="Main technician"><select value={filters.mainTechnicianId ?? ''} onChange={(e) => setFilters((f) => ({ ...f, mainTechnicianId: e.target.value ? Number(e.target.value) : undefined, page: 0 }))} className="control"><option value="">All technicians</option>{technicians.map((technician) => <option key={technician.technicianId} value={technician.technicianId}>{technician.user.userName}</option>)}</select></Field>
        <Field label="Team"><select value={filters.team ?? ''} onChange={(e) => setFilters((f) => ({ ...f, team: (e.target.value || undefined) as ReportTeam | undefined, page: 0 }))} className="control"><option value="">All teams</option><option value="TECHNICIAN">Technician</option><option value="TEAM_LEADER">Team leader</option><option value="WORKSHOP_TECHNICIAN">Workshop technician</option></select></Field>
        <div className="flex items-end"><button type="button" onClick={() => void load()} disabled={loading} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"><SearchIcon className="h-4 w-4" />{loading ? 'Loading…' : 'Apply filters'}</button></div>
      </div>
    </div>

    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      {!result && !loading ? <div className="px-6 py-20 text-center"><DownloadIcon className="mx-auto h-8 w-8 text-ink-subtle" /><p className="mt-3 text-sm font-medium text-ink">Choose filters and run the report</p><p className="mt-1 text-xs text-ink-muted">Results will appear here.</p></div> : loading ? <p className="px-6 py-20 text-center text-sm text-ink-muted">Loading report…</p> : result?.content.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-ink-subtle"><tr>{['Agreement','Machine','Customer / site','Area','Agreement period','Main technician','Status'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-line">{result.content.map((row) => <tr key={row.agreementId} tabIndex={0} role="button" onClick={() => setSelectedRow(row)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedRow(row); }} className="cursor-pointer hover:bg-canvas/60 focus:bg-brand-50 focus:outline-none"><td className="px-4 py-4"><p className="font-semibold text-ink">{row.agreementNumber}</p><p className="mt-1 text-xs text-ink-muted">{row.agreementType}</p></td><td className="px-4 py-4"><p className="font-medium text-ink">{row.machineReferenceNumber}</p><p className="mt-1 text-xs text-ink-muted">{row.serialNumber} · {row.modelNumber || 'No model'}</p></td><td className="px-4 py-4"><p className="font-medium text-ink">{row.customerName || '—'}</p><p className="mt-1 text-xs text-ink-muted">{row.siteName || '—'}</p></td><td className="px-4 py-4 text-ink-muted">{pretty(row.area)}</td><td className="whitespace-nowrap px-4 py-4"><p className="text-ink">{row.agreementStartDate}</p><p className="mt-1 text-xs text-ink-muted">to {row.agreementEndDate}</p></td><td className="px-4 py-4"><p className="text-ink">{row.mainTechnicianName || 'Unassigned'}</p><p className="mt-1 text-xs text-ink-muted">{pretty(row.team)}</p></td><td className="px-4 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{pretty(row.agreementStatus)}</span></td></tr>)}</tbody></table></div> : <p className="px-6 py-20 text-center text-sm text-ink-muted">No machines match these filters.</p>}
      {result && <div className="flex items-center justify-between border-t border-line px-5 py-3"><p className="text-xs text-ink-muted">Showing {result.content.length} of {result.totalElements} machines · Page {result.number + 1} of {Math.max(result.totalPages, 1)}</p><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={result.first || loading} onClick={() => void load({ ...filters, page: filters.page - 1 })} className="rounded-lg border border-line p-2 text-ink-muted disabled:opacity-40"><ChevronLeftIcon className="h-4 w-4" /></button><button type="button" aria-label="Next page" disabled={result.last || loading} onClick={() => void load({ ...filters, page: filters.page + 1 })} className="rounded-lg border border-line p-2 text-ink-muted disabled:opacity-40"><ChevronRightIcon className="h-4 w-4" /></button></div></div>}
    </div>
    <ReportDetailsDrawer row={selectedRow} onClose={() => setSelectedRow(null)} />
    <style jsx>{`.control{height:40px;width:100%;border:1px solid #e3e8ef;border-radius:8px;background:white;padding:0 12px;font-size:14px;outline:none}.control:focus{border-color:#1b64b5;box-shadow:0 0 0 3px rgba(27,100,181,.13)}`}</style>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-ink-muted">{label}</span>{children}</label>;
}

function ReportDetailsDrawer({ row, onClose }: { row: MachineAgreementReportRow | null; onClose: () => void }) {
  if (!row) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35" onMouseDown={onClose}>
    <aside role="dialog" aria-modal="true" aria-label="Machine agreement details" onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-line bg-white px-6 py-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{row.agreementType} agreement</p><h2 className="mt-1 text-xl font-semibold text-ink">{row.agreementNumber}</h2><p className="mt-1 text-sm text-ink-muted">Complete machine and coverage details</p></div>
        <button type="button" onClick={onClose} aria-label="Close details" className="rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink"><XIcon className="h-5 w-5" /></button>
      </div>
      <div className="space-y-5 p-6">
        <DetailSection title="Agreement details" entries={[
          ['Agreement number', row.agreementNumber], ['Agreement type', row.agreementType], ['Status', pretty(row.agreementStatus)],
          ['Start date', row.agreementStartDate], ['End date', row.agreementEndDate],
          ['Annual payment', money(row.annualPayment)], ['Full payment', money(row.fullPayment)],
        ]} />
        <DetailSection title="Machine details" entries={[
          ['Machine reference', row.machineReferenceNumber], ['Serial number', row.serialNumber],
          ['Model number', row.modelNumber || '—'], ['Model name', row.modelName || '—'],
        ]} />
        <DetailSection title="Customer and site" entries={[
          ['Customer', row.customerName || '—'], ['Customer site', row.siteName || '—'], ['Area', pretty(row.area)],
        ]} />
        <DetailSection title="Service assignment" entries={[
          ['Main technician', row.mainTechnicianName || 'Unassigned'], ['Team', pretty(row.team)],
        ]} />
      </div>
    </aside>
  </div>;
}

function DetailSection({ title, entries }: { title: string; entries: Array<[string, string]> }) {
  return <section className="overflow-hidden rounded-xl border border-line">
    <h3 className="border-b border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink">{title}</h3>
    <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
      {entries.map(([label, value]) => <div key={label} className="border-line px-4 py-3 sm:border-b sm:odd:border-r"><dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd></div>)}
    </dl>
  </section>;
}

function money(value: number | null) {
  return value == null ? '—' : new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
}

function pretty(value: string | null | undefined) {
  return value ? value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) : '—';
}

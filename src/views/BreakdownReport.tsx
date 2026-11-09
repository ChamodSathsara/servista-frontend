'use client';

import { useState } from 'react';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, FileSpreadsheetIcon, FileTextIcon, SearchIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  downloadBreakdownJobReport,
  getBreakdownJobReport,
  type BreakdownAgreementType,
  type BreakdownJobReportRow,
  type BreakdownReportFilters,
  type BreakdownReportPage,
  type BreakdownReportStatus,
  type ReportArea,
  type ReportCompany,
  type ReportDivision,
} from '../apis/reports';

export function BreakdownReport({ onBack }: { onBack: () => void }) {
  const [filters, setFilters] = useState<BreakdownReportFilters>({ page: 0, size: 20 });
  const [result, setResult] = useState<BreakdownReportPage | null>(null);
  const [selectedRow, setSelectedRow] = useState<BreakdownJobReportRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<'pdf' | 'excel' | null>(null);

  const load = async (next: BreakdownReportFilters = filters) => {
    setLoading(true);
    try {
      const data = await getBreakdownJobReport(next);
      setFilters(next);
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load the breakdown report.');
    } finally {
      setLoading(false);
    }
  };

  const download = async (format: 'pdf' | 'excel') => {
    setDownloading(format);
    try {
      await downloadBreakdownJobReport(format, { ...filters, page: 0, size: 5000 });
      toast.success(`${format === 'pdf' ? 'PDF' : 'Excel'} report downloaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed.');
    } finally {
      setDownloading(null);
    }
  };

  return <div className="mx-auto max-w-7xl">
    <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-brand-700"><ArrowLeftIcon className="h-4 w-4" />All reports</button>
    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><h1 className="text-2xl font-semibold text-ink">Breakdown Job Report</h1><p className="mt-1 text-sm font-medium text-brand-700">Breakdown jobs by machine, technician and service coverage</p></div>
      <div className="flex gap-2">
        <button type="button" disabled={!!downloading} onClick={() => void download('pdf')} className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink shadow-sm hover:bg-canvas disabled:opacity-50"><FileTextIcon className="h-4 w-4 text-rose-600" />{downloading === 'pdf' ? 'Preparing…' : 'Download PDF'}</button>
        <button type="button" disabled={!!downloading} onClick={() => void download('excel')} className="flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"><FileSpreadsheetIcon className="h-4 w-4" />{downloading === 'excel' ? 'Preparing…' : 'Download Excel'}</button>
      </div>
    </div>

    <div className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Search Q-number / Tech code"><input value={filters.search ?? ''} onChange={(event) => setFilters((value) => ({ ...value, search: event.target.value, page: 0 }))} onKeyDown={(event) => { if (event.key === 'Enter') void load(); }} placeholder="Q000001 or T001" className="report-control" /></Field>
        <Field label="Company"><select value={filters.company ?? ''} onChange={(event) => setFilters((value) => ({ ...value, company: (event.target.value || undefined) as ReportCompany | undefined, page: 0 }))} className="report-control"><option value="">All companies</option><option value="GESTETNER">Gestetner</option><option value="FINTECH">Fintech</option></select></Field>
        <Field label="Division"><select value={filters.division ?? ''} onChange={(event) => setFilters((value) => ({ ...value, division: (event.target.value || undefined) as ReportDivision | undefined, page: 0 }))} className="report-control"><option value="">All divisions</option>{['RENTAL','OUTRIGHT','WORKSHOP','AC','PRODUCTION','ELECTRONIC'].map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></Field>
        <Field label="Area"><select value={filters.area ?? ''} onChange={(event) => setFilters((value) => ({ ...value, area: (event.target.value || undefined) as ReportArea | undefined, page: 0 }))} className="report-control"><option value="">All areas</option>{['COLOMBO','SUBURB','OUTSTATION'].map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></Field>
        <Field label="Agreement type"><select value={filters.agreementType ?? ''} onChange={(event) => setFilters((value) => ({ ...value, agreementType: (event.target.value || undefined) as BreakdownAgreementType | undefined, page: 0 }))} className="report-control"><option value="">All agreements</option><option value="FS">FS</option><option value="MA">MA</option><option value="NS">NS</option></select></Field>
        <Field label="Job status"><select value={filters.jobStatus ?? ''} onChange={(event) => setFilters((value) => ({ ...value, jobStatus: (event.target.value || undefined) as BreakdownReportStatus | undefined, page: 0 }))} className="report-control"><option value="">All job statuses</option>{['ASSIGNED','STARTED','COMPLETED','RECALL','CANCELLED'].map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></Field>
        <div className="flex items-end xl:col-span-2"><button type="button" onClick={() => void load()} disabled={loading} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"><SearchIcon className="h-4 w-4" />{loading ? 'Loading…' : 'Apply filters'}</button></div>
      </div>
    </div>

    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      {!result && !loading ? <p className="px-6 py-20 text-center text-sm text-ink-muted">Choose filters and run the breakdown report.</p> : loading ? <p className="px-6 py-20 text-center text-sm text-ink-muted">Loading report…</p> : result?.content.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-ink-subtle"><tr>{['Breakdown','Machine','Customer / site','Company / division','Agreement','Technician','Status','Created'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-line">{result.content.map((row) => <tr key={row.breakdownId} role="button" tabIndex={0} onClick={() => setSelectedRow(row)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedRow(row); }} className="cursor-pointer hover:bg-canvas/60 focus:bg-brand-50 focus:outline-none"><td className="px-4 py-4 font-semibold text-ink">{row.breakdownNumber}</td><td className="px-4 py-4"><p className="font-medium text-ink">{row.machineReferenceNumber}</p><p className="mt-1 text-xs text-ink-muted">{row.serialNumber}</p></td><td className="px-4 py-4"><p className="font-medium text-ink">{row.customerName || '—'}</p><p className="mt-1 text-xs text-ink-muted">{row.siteName} · {pretty(row.area)}</p></td><td className="px-4 py-4"><p>{pretty(row.company)}</p><p className="mt-1 text-xs text-ink-muted">{pretty(row.division)}</p></td><td className="px-4 py-4"><p>{row.agreementType || '—'}</p><p className="mt-1 text-xs text-ink-muted">{pretty(row.agreementStatus)}</p></td><td className="px-4 py-4"><p>{row.technicianName || 'Unassigned'}</p><p className="mt-1 text-xs text-ink-muted">{row.technicianCode || '—'}</p></td><td className="px-4 py-4"><Status value={row.jobStatus} /></td><td className="whitespace-nowrap px-4 py-4 text-ink-muted">{dateTime(row.createdAt)}</td></tr>)}</tbody></table></div> : <p className="px-6 py-20 text-center text-sm text-ink-muted">No breakdown jobs match these filters.</p>}
      {result && <div className="flex items-center justify-between border-t border-line px-5 py-3"><p className="text-xs text-ink-muted">Showing {result.content.length} of {result.totalElements} jobs · Page {result.number + 1} of {Math.max(result.totalPages, 1)}</p><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={result.first || loading} onClick={() => void load({ ...filters, page: filters.page - 1 })} className="rounded-lg border border-line p-2 text-ink-muted disabled:opacity-40"><ChevronLeftIcon className="h-4 w-4" /></button><button type="button" aria-label="Next page" disabled={result.last || loading} onClick={() => void load({ ...filters, page: filters.page + 1 })} className="rounded-lg border border-line p-2 text-ink-muted disabled:opacity-40"><ChevronRightIcon className="h-4 w-4" /></button></div></div>}
    </div>
    <BreakdownDetailsDrawer row={selectedRow} onClose={() => setSelectedRow(null)} />
    <style jsx>{`.report-control{height:40px;width:100%;border:1px solid #e3e8ef;border-radius:8px;background:white;padding:0 12px;font-size:14px;outline:none}.report-control:focus{border-color:#1b64b5;box-shadow:0 0 0 3px rgba(27,100,181,.13)}`}</style>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-ink-muted">{label}</span>{children}</label>;
}

function BreakdownDetailsDrawer({ row, onClose }: { row: BreakdownJobReportRow | null; onClose: () => void }) {
  if (!row) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35" onMouseDown={onClose}><aside role="dialog" aria-modal="true" aria-label="Breakdown job details" onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-line bg-white px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Breakdown job</p><h2 className="mt-1 text-xl font-semibold text-ink">{row.breakdownNumber}</h2><p className="mt-1 text-sm text-ink-muted">{row.machineReferenceNumber} · {row.technicianCode || 'Unassigned'}</p></div><button type="button" onClick={onClose} aria-label="Close details" className="rounded-lg p-2 text-ink-muted hover:bg-canvas"><XIcon className="h-5 w-5" /></button></div><div className="space-y-5 p-6"><Detail title="Job details" entries={[["Status",pretty(row.jobStatus)],["Created",dateTime(row.createdAt)],["Expected completion",dateTime(row.expectedCompletionAt)],["Started",dateTime(row.startedAt)],["Response time",workingTime(row.responseTimeHours)],["Completed",dateTime(row.completedAt)],["Contact email",row.contactEmail]]}/><Detail title="Machine and customer" entries={[["Machine reference",row.machineReferenceNumber],["Serial number",row.serialNumber],["Company",pretty(row.company)],["Division",pretty(row.division)],["Customer",row.customerName || '—'],["Site",row.siteName],["Area",pretty(row.area)]]}/><Detail title="Coverage and technician" entries={[["Agreement type",row.agreementType || '—'],["Agreement status",pretty(row.agreementStatus)],["Tech code",row.technicianCode || '—'],["Technician",row.technicianName || 'Unassigned']]}/><Detail title="Notes" entries={[["Reported note",row.reportedNote || '—'],["Solution note",row.solutionNote || '—']]}/></div></aside></div>;
}

function Detail({ title, entries }: { title: string; entries: Array<[string, string]> }) {
  return <section className="overflow-hidden rounded-xl border border-line"><h3 className="border-b border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink">{title}</h3><dl className="grid grid-cols-1 sm:grid-cols-2">{entries.map(([label,value]) => <div key={label} className="border-b border-line px-4 py-3 sm:odd:border-r"><dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd></div>)}</dl></section>;
}

function Status({ value }: { value: BreakdownReportStatus }) {
  const tone = value === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : value === 'CANCELLED' ? 'bg-rose-50 text-rose-700' : value === 'RECALL' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{pretty(value)}</span>;
}

function pretty(value: string | null | undefined) {
  return value ? value.replaceAll('_',' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) : '—';
}

function dateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : '—';
}

function workingTime(value: number | null) {
  if (value == null) return '—';
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m (${value.toFixed(2)} hours)`;
}

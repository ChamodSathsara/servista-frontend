'use client';

import { useMemo, useState } from 'react';
import { ChevronRightIcon, GaugeIcon, SearchIcon, SearchXIcon } from 'lucide-react';
import { getMeterReadingsByMachineReference, type MeterReadingResponse } from '../apis/meterReadings';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { StatusBadge, type BadgeTone } from '../components/ui/StatusBadge';
import { formatNumber } from '../utils/format';

const sourceTone = (source: string): BadgeTone => {
  if (source === 'BREAKDOWN') return 'danger';
  if (source === 'SERVICE') return 'info';
  if (source === 'INSTALLATION') return 'success';
  return 'neutral';
};

export function MeterReadings() {
  const [reference, setReference] = useState('');
  const [searchedReference, setSearchedReference] = useState('');
  const [readings, setReadings] = useState<MeterReadingResponse[]>([]);
  const [selected, setSelected] = useState<MeterReadingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const orderedReadings = useMemo(
    () => [...readings].sort((a, b) => Date.parse(b.readingDatetime) - Date.parse(a.readingDatetime)),
    [readings],
  );

  const findReadings = async () => {
    const normalizedReference = reference.trim().toUpperCase();
    if (!normalizedReference) {
      setError('Enter a machine reference number.');
      return;
    }
    setReference(normalizedReference);
    setSearchedReference(normalizedReference);
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSelected(null);
    try {
      setReadings(await getMeterReadingsByMachineReference(normalizedReference));
    } catch (loadError) {
      setReadings([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load meter readings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700"><GaugeIcon className="h-4 w-4" />Machine usage</div>
        <h1 className="mt-1 text-2xl font-semibold text-ink">Meter Readings</h1>
        <p className="mt-1 text-sm text-ink-muted">Find the complete meter history for a machine.</p>
      </div>

      <section className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
        <label htmlFor="machine-reference" className="text-sm font-medium text-ink">Machine reference number</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <div className={`flex h-11 flex-1 items-center rounded-lg border ${error && !hasSearched ? 'border-danger-600' : 'border-line'} sm:max-w-xl`}>
            <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" />
            <input
              id="machine-reference"
              value={reference}
              onChange={(event) => { setReference(event.target.value); setError(null); }}
              onKeyDown={(event) => { if (event.key === 'Enter') void findReadings(); }}
              placeholder="e.g. Q000010"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-sm uppercase outline-none"
            />
          </div>
          <Button className="h-11 px-6" loading={loading} icon={<SearchIcon className="h-4 w-4" />} onClick={() => void findReadings()}>
            Find readings
          </Button>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-20 text-center text-sm text-ink-muted">Loading meter readings…</p>
        ) : error ? (
          <div className="px-6 py-20 text-center">
            <SearchXIcon className="mx-auto h-9 w-9 text-danger-600" />
            <p className="mt-3 text-sm font-medium text-danger-700">{error}</p>
            <p className="mt-1 text-xs text-ink-subtle">Check the machine reference number and try again.</p>
          </div>
        ) : orderedReadings.length ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div><p className="font-mono text-sm font-semibold text-ink">{searchedReference}</p><p className="text-xs text-ink-subtle">Machine ID #{orderedReadings[0].machineId}</p></div>
              <p className="text-sm text-ink-muted">{orderedReadings.length} {orderedReadings.length === 1 ? 'reading' : 'readings'}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted"><tr><th className="px-5 py-3 font-medium">Date &amp; time</th><th className="px-5 py-3 font-medium">Counter</th><th className="px-5 py-3 text-right font-medium">Reading</th><th className="px-5 py-3 font-medium">Source</th><th className="px-5 py-3 font-medium">Note</th><th /></tr></thead>
                <tbody className="divide-y divide-line">{orderedReadings.map((reading) => (
                  <tr key={reading.meterReadingId} onClick={() => setSelected(reading)} className="group cursor-pointer hover:bg-brand-50/50">
                    <td className="px-5 py-3.5"><p className="font-medium text-ink">{new Date(reading.readingDatetime).toLocaleDateString()}</p><p className="text-xs text-ink-subtle">{new Date(reading.readingDatetime).toLocaleTimeString()}</p></td>
                    <td className="px-5 py-3.5"><p className="font-medium">{reading.counterName}</p><p className="font-mono text-xs text-ink-subtle">{reading.counterCode}</p></td>
                    <td className="px-5 py-3.5 text-right font-mono text-base font-semibold text-ink">{formatNumber(reading.readingValue)}</td>
                    <td className="px-5 py-3.5"><StatusBadge tone={sourceTone(reading.sourceCode)} label={reading.sourceCode.replaceAll('_', ' ')} /></td>
                    <td className="max-w-xs truncate px-5 py-3.5 text-ink-muted">{reading.note || '—'}</td>
                    <td className="pr-4"><ChevronRightIcon className="h-4 w-4 text-ink-subtle group-hover:text-brand-700" /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        ) : hasSearched ? (
          <div className="px-6 py-20 text-center"><GaugeIcon className="mx-auto h-9 w-9 text-ink-subtle" /><p className="mt-3 text-sm font-medium">No meter readings found</p><p className="mt-1 text-xs text-ink-subtle">This machine does not have recorded readings yet.</p></div>
        ) : (
          <div className="px-6 py-20 text-center"><GaugeIcon className="mx-auto h-10 w-10 text-ink-subtle" /><p className="mt-3 text-sm font-medium text-ink">Enter a machine reference to begin</p><p className="mt-1 text-xs text-ink-subtle">The newest reading will appear first.</p></div>
        )}
      </section>

      <Drawer open={!!selected} onClose={() => setSelected(null)} labelledBy="meter-reading-title" widthClass="max-w-lg">
        {selected && <div className="px-6 py-7 sm:px-8"><div className="pr-10"><StatusBadge tone={sourceTone(selected.sourceCode)} label={selected.sourceCode.replaceAll('_', ' ')} /><h2 id="meter-reading-title" className="mt-3 text-xl font-semibold">{selected.counterName}</h2><p className="font-mono text-sm text-ink-muted">{selected.machineReferenceNumber} · Reading #{selected.meterReadingId}</p></div><p className="mt-7 rounded-xl bg-canvas p-5 text-center font-mono text-3xl font-semibold text-ink">{formatNumber(selected.readingValue)}</p><dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6">{[['Reading date',new Date(selected.readingDatetime).toLocaleString()],['Counter code',selected.counterCode],['Counter type ID',selected.meterCounterTypeId],['Breakdown ID',selected.breakdownId??'—'],['Service schedule ID',selected.serviceScheduleId??'—'],['Installation submission ID',selected.installationSubmissionId??'—'],['Captured by user',selected.capturedByUserId??'—'],['Captured by portal',selected.capturedByPortalAccountId??'—'],['Created at',new Date(selected.createdAt).toLocaleString()],['Note',selected.note||'—']].map(([key,value])=><div key={String(key)}><dt className="text-xs text-ink-subtle">{key}</dt><dd className="mt-1 break-words text-sm text-ink">{value}</dd></div>)}</dl></div>}
      </Drawer>
    </div>
  );
}

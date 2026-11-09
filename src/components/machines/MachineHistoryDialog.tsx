'use client';
import { Modal } from '../ui/Modal';
import type { MachineHistoryEvent, MachineResponse } from '../../apis/machines';

export function MachineHistoryDialog({ machine, events, loading, onClose }: { machine: MachineResponse | null; events: MachineHistoryEvent[]; loading: boolean; onClose: () => void }) {
  return <Modal open={!!machine} onClose={onClose} title={`History · ${machine?.machineReferenceNumber ?? ''}`} description="Customer, technician, return and status changes in newest-first order." widthClass="max-w-2xl">
    {loading ? <p className="py-12 text-center text-sm text-ink-muted">Loading machine history…</p> : events.length ? <div className="space-y-3">{events.map((event, index) => <article key={`${event.occurredAt}-${index}`} className="rounded-xl border border-line p-4"><div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">{event.eventType}</span><h3 className="mt-2 text-sm font-semibold text-ink">{event.title}</h3></div><time className="whitespace-nowrap text-xs text-ink-subtle">{new Date(event.occurredAt).toLocaleString()}</time></div><p className="mt-2 text-sm text-ink-muted">{event.description}</p><p className="mt-2 text-xs text-ink-subtle">By {event.performedBy}</p></article>)}</div> : <p className="py-12 text-center text-sm text-ink-muted">No history records found.</p>}
  </Modal>;
}

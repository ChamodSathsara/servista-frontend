'use client';
import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import type { MachineResponse } from '../../apis/machines';

export function MachinesTable({ machines, onSelect }: { machines: MachineResponse[]; onSelect: (machine: MachineResponse) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted"><tr>
    <th className="px-5 py-3 font-medium">Reference</th><th className="px-5 py-3 font-medium">Machine</th><th className="px-5 py-3 font-medium">Customer site</th><th className="px-5 py-3 font-medium">Company · Division</th><th className="px-5 py-3 font-medium">Status</th><th className="w-10 px-3 py-3" />
  </tr></thead><tbody className="divide-y divide-line">{machines.map((machine) => <tr key={machine.machineId} tabIndex={0} onClick={() => onSelect(machine)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(machine); } }} className="group cursor-pointer hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
    <td className="px-5 py-3.5 font-mono text-xs font-medium text-ink">{machine.machineReferenceNumber}</td>
    <td className="px-5 py-3.5"><p className="font-medium text-ink group-hover:text-brand-700">{machine.modelName}</p><p className="font-mono text-xs text-ink-subtle">{machine.serialNumber}</p></td>
    <td className="px-5 py-3.5"><p className="text-ink">{machine.siteName}</p><p className="text-xs text-ink-subtle">Customer #{machine.customerId}</p></td>
    <td className="px-5 py-3.5 text-ink-muted">{machine.company} · {machine.division}</td>
    <td className="px-5 py-3.5"><StatusBadge tone={machine.currentStatus.startsWith('ACTIVE') || machine.currentStatus === 'AVAILABLE' ? 'success' : 'neutral'} label={machine.currentStatus.replaceAll('_', ' ')} /></td>
    <td className="px-3 py-3.5 text-ink-subtle"><ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 group-hover:text-brand-600" /></td>
  </tr>)}</tbody></table></div>;
}

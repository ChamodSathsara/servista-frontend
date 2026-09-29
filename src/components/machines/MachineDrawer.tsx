'use client';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import type { MachineResponse } from '../../apis/machines';

interface Props { machine: MachineResponse | null; loading: boolean; error: string | null; deleting: boolean; onClose: () => void; onEdit: (machine: MachineResponse) => void; onDelete: (machine: MachineResponse) => void }
export function MachineDrawer({ machine, loading, error, deleting, onClose, onEdit, onDelete }: Props) {
  return <Drawer open={loading || !!error || !!machine} onClose={onClose} labelledBy="machine-drawer-title" widthClass="max-w-2xl"><div className="px-6 py-7 sm:px-8">
    {loading && <p className="py-16 text-center text-sm text-ink-muted">Loading machine details…</p>}{error && <p className="py-16 text-center text-sm text-danger-700">{error}</p>}
    {machine && <><header className="pr-10"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-ink-muted">{machine.machineReferenceNumber}</span><StatusBadge tone={machine.currentStatus.startsWith('ACTIVE') || machine.currentStatus === 'AVAILABLE' ? 'success' : 'neutral'} label={machine.currentStatus.replaceAll('_', ' ')} /></div>
      <h2 id="machine-drawer-title" className="mt-2 text-xl font-semibold text-ink">{machine.modelName}</h2><p className="mt-1 font-mono text-sm text-ink-muted">{machine.serialNumber}</p></header>
      <div className="mt-6 flex gap-2"><Button onClick={() => onEdit(machine)}>Edit machine</Button><Button variant="secondary" loading={deleting} onClick={() => onDelete(machine)}>Delete</Button></div>
      {[
        ['Machine', [['Machine ID', machine.machineId], ['Model', `${machine.modelNumber} · ${machine.modelName}`], ['Company', machine.company], ['Division', machine.division], ['Install date', machine.originalInstallDate], ['Machine note', machine.machineNote], ['Credit note', machine.creditNoteNumber]]],
        ['Customer site', [['Customer ID', machine.customerId], ['Site', machine.siteName], ['Address', [machine.addressLine1, machine.addressLine2, machine.addressLine3].filter(Boolean).join(', ')], ['Area', machine.area], ['City ID', machine.cityId], ['Head office', machine.isHeadOffice ? 'Yes' : 'No']]],
        ['Site contact', [['Name', machine.contactName], ['Mobile', machine.mobileNumber], ['Email', machine.email], ['Designation', machine.designation]]],
        ['Invoice', [['Invoice number', machine.invoiceNumber], ['Belita invoice', machine.belitaInvoiceNumber], ['Invoice date', machine.invoiceDate], ['Note', machine.invoiceNote]]],
        ['Assignments', [['Main technician ID', machine.currentMainTechnicianId], ['Service technician ID', machine.currentServiceTechnicianId], ['Salesman ID', machine.salesmanId], ['Dealer ID', machine.dealerId], ['Rep ID', machine.repId]]],
      ].map(([heading, entries]) => <section key={heading as string} className="mt-7 border-t border-line pt-5"><h3 className="text-sm font-semibold text-ink">{heading as string}</h3><dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{(entries as (string | number | null)[][]).map(([label, value]) => <div key={String(label)}><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm text-ink">{value ?? '—'}</dd></div>)}</dl></section>)}
    </>}
  </div></Drawer>;
}

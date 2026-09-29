'use client';

import { useMemo, useState } from 'react';
import { PlusIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { TechOfficersTable } from '../components/techOfficers/TechOfficersTable';
import { TechOfficerDrawer } from '../components/techOfficers/TechOfficerDrawer';
import { CreateTechOfficerDialog } from '../components/techOfficers/CreateTechOfficerDialog';
import { techOfficers as initialOfficers } from '../data/techOfficers';
import type { TechOfficer, TechStatus } from '../types/techOfficer';

type StatusFilter = 'all' | TechStatus;

export function TechOfficers() {
  const [officers, setOfficers] = useState<TechOfficer[]>(initialOfficers);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s/g, '');
    return officers.filter((o) => {
      if (status !== 'all' && o.status !== status) return false;
      if (!q) return true;
      const code = o.techCode.toLowerCase();
      return code.includes(q) || code.replace('-', '').includes(q) || o.name.toLowerCase().replace(/\s/g, '').includes(q);
    });
  }, [officers, query, status]);

  const countOf = (s: TechStatus) => officers.filter((o) => o.status === s).length;
  const nextCode = `TO-${String(Math.max(...officers.map((o) => o.techId)) + 1).padStart(3, '0')}`;

  const handleCreate = (data: Omit<TechOfficer, 'techId'>) => {
    const techId = Math.max(...officers.map((o) => o.techId)) + 1;
    setOfficers((prev) => [{ ...data, techId }, ...prev]);
    setCreateOpen(false);
    toast.success(`${data.name} added as ${data.techCode}`, {
      action: { label: 'View', onClick: () => setSelectedId(techId) }
    });
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
  };

  const selected = officers.find((o) => o.techId === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Tech Officers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {countOf('Available')} available now · {countOf('On Job')} on a job. Select an officer to see their history.
          </p>
        </div>
        <Button icon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Create tech officer
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="flex h-10 flex-1 items-center rounded-lg border border-line bg-white transition-[border-color,box-shadow] duration-150 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 lg:max-w-md">
            <SearchIcon className="ml-3 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tech code, e.g. TO-004"
              aria-label="Search tech officers by tech code"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none" />
            
            {query &&
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="mr-2 rounded p-1 text-ink-subtle hover:text-ink">
                <XIcon className="h-4 w-4" />
              </button>
            }
          </div>
          <div className="overflow-x-auto lg:ml-auto">
            <SegmentedControl
              ariaLabel="Filter by status"
              value={status}
              onChange={setStatus}
              options={[
              { value: 'all', label: 'All', count: officers.length },
              { value: 'Available', label: 'Available', count: countOf('Available') },
              { value: 'On Job', label: 'On job', count: countOf('On Job') },
              { value: 'On Leave', label: 'On leave', count: countOf('On Leave') },
              { value: 'Inactive', label: 'Inactive', count: countOf('Inactive') }]
              } />
            
          </div>
        </div>

        {filtered.length === 0 ?
        <div className="flex flex-col items-center px-6 py-16 text-center">
            <SearchXIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-ink">No tech officers found</p>
            <p className="mt-1 text-sm text-ink-muted">Check the tech code — they look like TO-001.</p>
            <Button variant="secondary" className="mt-5" onClick={clearFilters}>Clear filters</Button>
          </div> :

        <TechOfficersTable officers={filtered} onSelect={(o) => setSelectedId(o.techId)} />
        }

        <div className="border-t border-line px-5 py-3 text-xs text-ink-muted">
          Showing {filtered.length} of {officers.length} tech officers
        </div>
      </div>

      <TechOfficerDrawer officer={selected} onClose={() => setSelectedId(null)} />
      <CreateTechOfficerDialog open={createOpen} nextCode={nextCode} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>);

}
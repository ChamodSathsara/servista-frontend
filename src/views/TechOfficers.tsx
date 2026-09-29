'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createTechnician, getTechnician, getTechnicians, type CreateTechnicianRequest, type TechnicianResponse } from '../apis/technicians';
import { ApiError } from '../apis/http';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { TechOfficersTable } from '../components/techOfficers/TechOfficersTable';
import { TechOfficerDrawer } from '../components/techOfficers/TechOfficerDrawer';
import { CreateTechOfficerDialog } from '../components/techOfficers/CreateTechOfficerDialog';

type CreateValues = Omit<CreateTechnicianRequest, 'createdBy'>;
type StatusFilter = 'all' | 'active' | 'inactive';

export function TechOfficers() {
  const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<TechnicianResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadTechnicians = useCallback(async () => {
    setLoading(true); setLoadError(null);
    try { setTechnicians(await getTechnicians()); }
    catch (error) { setLoadError(error instanceof Error ? error.message : 'Unable to load technicians.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getTechnicians().then((data) => { if (!cancelled) setTechnicians(data); })
      .catch((error: unknown) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load technicians.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase().replaceAll(' ', '');
    return technicians.filter((technician) => {
      if (status === 'active' && !technician.user.isActive) return false;
      if (status === 'inactive' && technician.user.isActive) return false;
      if (!search) return true;
      return technician.user.userName.toLowerCase().replaceAll(' ', '').includes(search) || technician.techCode.toLowerCase().replaceAll('-', '').includes(search.replaceAll('-', ''));
    });
  }, [query, status, technicians]);

  const activeCount = technicians.filter((technician) => technician.user.isActive).length;
  const currentUserId = () => {
    const raw = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
    const userId = raw ? Number((JSON.parse(raw) as { userId?: number }).userId) : 0;
    if (!userId) throw new Error('Your user session is missing. Please sign in again.');
    return userId;
  };

  const handleCreate = async (values: CreateValues) => {
    try {
      const created = await createTechnician({ ...values, createdBy: currentUserId() });
      setTechnicians((previous) => [created, ...previous]); setCreateOpen(false);
      toast.success(`${created.user.userName} created`, { description: `Technician ID ${created.technicianId}` });
    } catch (error) {
      toast.error(error instanceof ApiError || error instanceof Error ? error.message : 'Technician creation failed.');
      throw error;
    }
  };

  const openDetails = async (technician: TechnicianResponse) => {
    setSelected(null); setDetailError(null); setDetailLoading(true);
    try { setSelected(await getTechnician(technician.technicianId)); }
    catch (error) { setDetailError(error instanceof Error ? error.message : 'Unable to load technician details.'); }
    finally { setDetailLoading(false); }
  };
  const closeDetails = () => { setSelected(null); setDetailError(null); setDetailLoading(false); };

  return <div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight text-ink">Tech Officers</h1>
      <p className="mt-1 text-sm text-ink-muted">{technicians.length} technicians · {activeCount} active. Select a technician to see all details.</p></div>
      <Button icon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>Create technician</Button></div>
    <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center"><div className="flex h-10 flex-1 items-center rounded-lg border border-line focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 lg:max-w-md">
        <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or tech code" aria-label="Search technicians" className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none" />
        {query && <button type="button" onClick={() => setQuery('')} className="mr-2 p-1 text-ink-subtle" aria-label="Clear search"><XIcon className="h-4 w-4" /></button>}</div>
        <div className="lg:ml-auto"><SegmentedControl ariaLabel="Filter by status" value={status} onChange={setStatus} options={[
          { value: 'all', label: 'All', count: technicians.length }, { value: 'active', label: 'Active', count: activeCount }, { value: 'inactive', label: 'Inactive', count: technicians.length - activeCount },
        ]} /></div></div>
      {loading ? <p className="px-6 py-16 text-center text-sm text-ink-muted">Loading technicians…</p> : loadError ?
        <div className="px-6 py-16 text-center"><p className="text-sm text-danger-700">{loadError}</p><Button variant="secondary" className="mt-5" onClick={() => void loadTechnicians()}>Try again</Button></div> : filtered.length ?
        <TechOfficersTable technicians={filtered} onSelect={(technician) => void openDetails(technician)} /> :
        <div className="px-6 py-16 text-center"><SearchXIcon className="mx-auto h-8 w-8 text-ink-subtle" /><p className="mt-3 text-sm font-medium text-ink">No technicians found</p><p className="mt-1 text-sm text-ink-muted">Try another name or tech code.</p></div>}
      <div className="border-t border-line px-5 py-3 text-xs text-ink-muted">Showing {filtered.length} of {technicians.length} technicians</div>
    </div>
    <CreateTechOfficerDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    <TechOfficerDrawer technician={selected} loading={detailLoading} error={detailError} onClose={closeDetails} />
  </div>;
}

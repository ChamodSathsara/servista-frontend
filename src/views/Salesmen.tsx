'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createSalesman, getSalesman, getSalesmen, type CreateSalesmanRequest, type SalesmanResponse } from '../apis/salesmen';
import { ApiError } from '../apis/http';
import { Button } from '../components/ui/Button';
import { CreateSalesmanDialog } from '../components/salesmen/CreateSalesmanDialog';
import { SalesmenTable } from '../components/salesmen/SalesmenTable';
import { SalesmanDrawer } from '../components/salesmen/SalesmanDrawer';

type CreateValues = Omit<CreateSalesmanRequest, 'createdBy'>;

export function Salesmen() {
  const [salesmen, setSalesmen] = useState<SalesmanResponse[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<SalesmanResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadSalesmen = useCallback(async () => {
    setLoading(true); setLoadError(null);
    try { setSalesmen(await getSalesmen()); }
    catch (error) { setLoadError(error instanceof Error ? error.message : 'Unable to load salesmen.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSalesmen().then((data) => { if (!cancelled) setSalesmen(data); })
      .catch((error: unknown) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load salesmen.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? salesmen.filter((item) => item.user.userName.toLowerCase().includes(search)) : salesmen;
  }, [query, salesmen]);

  const currentUserId = () => {
    const raw = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
    const userId = raw ? Number((JSON.parse(raw) as { userId?: number }).userId) : 0;
    if (!userId) throw new Error('Your user session is missing. Please sign in again.');
    return userId;
  };

  const handleCreate = async (values: CreateValues) => {
    try {
      const created = await createSalesman({ ...values, createdBy: currentUserId() });
      setSalesmen((previous) => [created, ...previous]); setCreateOpen(false);
      toast.success(`${created.user.userName} created`, { description: `Salesman ID ${created.salesmanId}` });
    } catch (error) {
      toast.error(error instanceof ApiError || error instanceof Error ? error.message : 'Salesman creation failed.');
      throw error;
    }
  };

  const openDetails = async (item: SalesmanResponse) => {
    setSelected(null); setDetailError(null); setDetailLoading(true);
    try { setSelected(await getSalesman(item.salesmanId)); }
    catch (error) { setDetailError(error instanceof Error ? error.message : 'Unable to load salesman details.'); }
    finally { setDetailLoading(false); }
  };

  const closeDetails = () => { setSelected(null); setDetailError(null); setDetailLoading(false); };

  return <div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-semibold tracking-tight text-ink">Salesmen</h1><p className="mt-1 text-sm text-ink-muted">{salesmen.length} salesmen · {salesmen.filter((item) => item.user.isActive).length} active</p></div>
      <Button icon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>Create salesman</Button>
    </div>
    <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="border-b border-line p-4"><div className="flex h-10 max-w-xl items-center rounded-lg border border-line focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by salesman name" aria-label="Search by salesman name" className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none" />
        {query && <button type="button" onClick={() => setQuery('')} className="mr-2 p-1 text-ink-subtle" aria-label="Clear search"><XIcon className="h-4 w-4" /></button>}
      </div></div>
      {loading ? <p className="px-6 py-16 text-center text-sm text-ink-muted">Loading salesmen…</p> : loadError ?
        <div className="px-6 py-16 text-center"><p className="text-sm text-danger-700">{loadError}</p><Button variant="secondary" className="mt-5" onClick={() => void loadSalesmen()}>Try again</Button></div> :
        filtered.length ? <SalesmenTable salesmen={filtered} onSelect={(item) => void openDetails(item)} /> :
        <div className="px-6 py-16 text-center"><SearchXIcon className="mx-auto h-8 w-8 text-ink-subtle" /><p className="mt-3 text-sm font-medium text-ink">No salesmen found</p><p className="mt-1 text-sm text-ink-muted">Try another salesman name.</p></div>}
      <div className="border-t border-line px-5 py-3 text-xs text-ink-muted">Showing {filtered.length} of {salesmen.length} salesmen</div>
    </div>
    <CreateSalesmanDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    <SalesmanDrawer salesman={selected} loading={detailLoading} error={detailError} onClose={closeDetails} />
  </div>;
}

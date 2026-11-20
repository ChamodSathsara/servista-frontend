'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { CustomersTable } from '../components/customers/CustomersTable';
import { CustomerMachinesDrawer } from '../components/customers/CustomerMachinesDrawer';
import { CreateCustomerDialog } from '../components/customers/CreateCustomerDialog';
import { machines } from '../data/machines';
import { createCustomer, getCustomersPage, type ApiCustomerGrade, type ApiCustomerSegment, type ApiCustomerType, type CustomerResponse } from '../apis/customers';
import { ApiError } from '../apis/http';
import type { CustomerFormValues } from '../hooks/useCreateCustomerForm';
import type { Customer, CustomerGrade } from '../types/customer';

type SearchScope = 'name' | 'id';
type StatusFilter = 'all' | 'active' | 'inactive';

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searching, setSearching] = useState(false);
  const [scope, setScope] = useState<SearchScope>('name');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [grade, setGrade] = useState<'all' | CustomerGrade>('all');
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(() => searchParams.get('create') === '1');
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const id = searchParams.get('customer');
    return id ? Number(id) : null;
  });

  const toCustomer = useCallback((customer: CustomerResponse): Customer => ({
    customerId: customer.customerId,
    sageCode: customer.sageCode ?? '',
    customerName: customer.customerName,
    addressLine1: customer.addressLine1 ?? '',
    addressLine2: customer.addressLine2 ?? undefined,
    addressLine3: customer.addressLine3 ?? undefined,
    headOfficeTel: customer.headOfficeTelNumber ?? '',
    headOfficeEmail: customer.headOfficeEmail ?? '',
    isActive: customer.isActive,
    grade: customer.customerGrade,
    type: customer.customerType,
    segment: customer.customerSegment,
    companies: customer.companies,
    salesmanId: customer.salesmanAssignment?.salesmanId ?? 0,
    createdAt: customer.createdAt,
  }), []);

  const loadCustomers = useCallback(async (targetPage = page) => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await getCustomersPage({
        page: targetPage,
        size: 20,
        query,
        searchById: scope === 'id',
        active: status === 'all' ? undefined : status === 'active',
        grade: grade === 'all' ? undefined : grade as ApiCustomerGrade,
      });
      setCustomers(response.content.map(toCustomer));
      setPage(response.number);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  }, [grade, page, query, scope, status, toCustomer]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearching(true);
      setLoadError(null);
      getCustomersPage({
        page,
        size: 20,
        query,
        searchById: scope === 'id',
        active: status === 'all' ? undefined : status === 'active',
        grade: grade === 'all' ? undefined : grade as ApiCustomerGrade,
      })
      .then((response) => {
        if (!cancelled) {
          setCustomers(response.content.map(toCustomer));
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load customers.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setSearching(false);
        }
      });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [grade, page, query, scope, status, toCustomer]);

  const machineCounts = useMemo(() => {
    const counts = new Map<number, number>();
    machines.forEach((m) => counts.set(m.customerId, (counts.get(m.customerId) ?? 0) + 1));
    return counts;
  }, []);

  const filtered = customers;

  const hasFilters = query !== '' || status !== 'all' || grade !== 'all';
  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setGrade('all');
    setPage(0);
  };

  const handleCreate = async (v: CustomerFormValues) => {
    try {
      const storedUser = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
      const createdBy = storedUser ? Number((JSON.parse(storedUser) as { userId?: number }).userId) : 0;
      if (!createdBy) throw new Error('Your user session is missing. Please sign in again.');

      const response = await createCustomer({
        ...(v.sageCode.trim() ? { sageCode: v.sageCode.trim() } : {}),
        customerName: v.customerName.trim(),
        addressLine1: v.addressLine1.trim() || undefined,
        addressLine2: v.addressLine2.trim() || undefined,
        addressLine3: v.addressLine3.trim() || undefined,
        headOfficeTelNumber: v.headOfficeTel.trim() || undefined,
        headOfficeEmail: v.headOfficeEmail.trim() || undefined,
        isActive: v.isActive,
        customerGrade: v.grade as ApiCustomerGrade,
        customerType: v.type as ApiCustomerType,
        customerSegment: v.segment as ApiCustomerSegment,
        createdBy,
        companies: v.companies,
        salesmanId: Number(v.salesmanId),
      });
      const created = toCustomer(response);
    setCustomers((prev) => [created, ...prev]);
    setCreateOpen(false);
    toast.success(`${created.customerName} created`, {
        description: `Customer ID ${created.customerId}`,
        action: { label: 'View', onClick: () => setSelectedId(created.customerId) }
    });
    } catch (error) {
      toast.error(error instanceof ApiError || error instanceof Error ? error.message : 'Customer creation failed.');
      throw error;
    }
  };

  const selected = customers.find((c) => c.customerId === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Customers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {totalElements} customers. Select a customer to see their machines.
          </p>
        </div>
        <Button icon={<PlusIcon className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Create customer
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="flex h-10 flex-1 items-center rounded-lg border border-line bg-white transition-[border-color,box-shadow] duration-150 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 lg:max-w-xl">
            <SearchIcon className="ml-3 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              inputMode={scope === 'id' ? 'numeric' : 'text'}
              placeholder={scope === 'name' ? 'Search by customer name or Sage code' : 'Search by customer ID, e.g. 10004'}
              aria-label="Search customers"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none" />
            
            {query &&
            <button type="button" onClick={() => { setQuery(''); setPage(0); }} aria-label="Clear search" className="mr-1 rounded p-1 text-ink-subtle hover:text-ink">
                <XIcon className="h-4 w-4" />
              </button>
            }
            <div className="mr-1 border-l border-line pl-1">
              <SegmentedControl
                compact
                ariaLabel="Search by"
                value={scope}
                onChange={(value) => { setScope(value); setPage(0); }}
                options={[
                { value: 'name', label: 'Name' },
                { value: 'id', label: 'Customer ID' }]
                } />
              
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
            <SegmentedControl
              ariaLabel="Filter by status"
              value={status}
              onChange={(value) => { setStatus(value); setPage(0); }}
              options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }]
              } />
            
            <select
              value={grade}
              onChange={(e) => { setGrade(e.target.value as 'all' | CustomerGrade); setPage(0); }}
              aria-label="Filter by grade"
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
              
              <option value="all">All grades</option>
              {(['STRONG', 'GOOD', 'WEAK', 'UNKNOWN'] as CustomerGrade[]).map((g) =>
              <option key={g} value={g}>{g}</option>
              )}
            </select>
          </div>
        </div>

        {loading ?
        <div className="px-6 py-16 text-center text-sm text-ink-muted">Loading customers…</div> :
        loadError ?
        <div className="flex flex-col items-center px-6 py-16 text-center">
            <p className="text-sm font-medium text-danger-700">{loadError}</p>
            <Button variant="secondary" className="mt-5" onClick={() => void loadCustomers()}>Try again</Button>
          </div> :
        filtered.length === 0 ?
        <div className="flex flex-col items-center px-6 py-16 text-center">
            <SearchXIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-ink">No customers match your search</p>
            <p className="mt-1 text-sm text-ink-muted">
              {scope === 'id' ? 'Check the customer ID, or switch to searching by name.' : 'Try a different name or clear your filters.'}
            </p>
            <Button variant="secondary" className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          </div> :

        <CustomersTable customers={filtered} machineCounts={machineCounts} onSelect={(c) => setSelectedId(c.customerId)} />
        }

        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-muted">
          <span>
            {searching ? 'Searching…' : `Showing ${filtered.length} of ${totalElements} customers · Page ${page + 1} of ${Math.max(totalPages, 1)}`}
          </span>
          <div className="flex items-center gap-2">
            {hasFilters && filtered.length > 0 &&
            <button type="button" onClick={clearFilters} className="mr-2 font-medium text-brand-600 hover:text-brand-700">
                Clear filters
              </button>
            }
            <button type="button" aria-label="Previous page" disabled={page === 0 || searching} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded-lg border border-line p-2 disabled:opacity-40">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next page" disabled={page + 1 >= totalPages || searching} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-line p-2 disabled:opacity-40">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <CustomerMachinesDrawer customer={selected} onClose={() => setSelectedId(null)} />
      <CreateCustomerDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>);

}

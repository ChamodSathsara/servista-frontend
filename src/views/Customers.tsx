'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusIcon, SearchIcon, SearchXIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { CustomersTable } from '../components/customers/CustomersTable';
import { CustomerMachinesDrawer } from '../components/customers/CustomerMachinesDrawer';
import { CreateCustomerDialog } from '../components/customers/CreateCustomerDialog';
import { customers as initialCustomers } from '../data/customers';
import { machines } from '../data/machines';
import type { CustomerFormValues } from '../hooks/useCreateCustomerForm';
import type { Customer, CustomerGrade } from '../types/customer';

type SearchScope = 'name' | 'id';
type StatusFilter = 'all' | 'active' | 'inactive';

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('name');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [grade, setGrade] = useState<'all' | CustomerGrade>('all');
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(() => searchParams.get('create') === '1');
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const id = searchParams.get('customer');
    return id ? Number(id) : null;
  });

  const machineCounts = useMemo(() => {
    const counts = new Map<number, number>();
    machines.forEach((m) => counts.set(m.customerId, (counts.get(m.customerId) ?? 0) + 1));
    return counts;
  }, []);

  const activeCount = customers.filter((c) => c.isActive).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (status === 'active' && !c.isActive) return false;
      if (status === 'inactive' && c.isActive) return false;
      if (grade !== 'all' && c.grade !== grade) return false;
      if (!q) return true;
      if (scope === 'name') return c.customerName.toLowerCase().includes(q) || c.sageCode.toLowerCase().includes(q);
      const digits = q.replace(/\D/g, '');
      return digits.length > 0 && String(c.customerId).includes(digits);
    });
  }, [customers, query, scope, status, grade]);

  const hasFilters = query !== '' || status !== 'all' || grade !== 'all';
  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setGrade('all');
  };

  const handleCreate = (v: CustomerFormValues) => {
    const newId = Math.max(...customers.map((c) => c.customerId)) + 1;
    const created: Customer = {
      customerId: newId,
      sageCode: v.sageCode.trim(),
      customerName: v.customerName.trim(),
      addressLine1: v.addressLine1,
      addressLine2: v.addressLine2 || undefined,
      addressLine3: v.addressLine3 || undefined,
      headOfficeTel: v.headOfficeTel,
      headOfficeEmail: v.headOfficeEmail,
      isActive: v.isActive,
      grade: v.grade as CustomerGrade,
      type: v.type as Customer['type'],
      segment: v.segment as Customer['segment'],
      companies: v.companies,
      salesmanId: Number(v.salesmanId),
      headOfficeArea: v.area as Customer['headOfficeArea'],
      primaryContact: { contactName: v.contactName, designation: v.contactDesignation, mobileNumber: v.contactMobile, email: v.contactEmail },
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [created, ...prev]);
    setCreateOpen(false);
    toast.success(`${created.customerName} created`, {
      description: `Customer ID ${newId}`,
      action: { label: 'View', onClick: () => setSelectedId(newId) }
    });
  };

  const selected = customers.find((c) => c.customerId === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Customers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {customers.length} customers · {activeCount} active. Select a customer to see their machines.
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
              onChange={(e) => setQuery(e.target.value)}
              inputMode={scope === 'id' ? 'numeric' : 'text'}
              placeholder={scope === 'name' ? 'Search by customer name or Sage code' : 'Search by customer ID, e.g. 10004'}
              aria-label="Search customers"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none" />
            
            {query &&
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="mr-1 rounded p-1 text-ink-subtle hover:text-ink">
                <XIcon className="h-4 w-4" />
              </button>
            }
            <div className="mr-1 border-l border-line pl-1">
              <SegmentedControl
                compact
                ariaLabel="Search by"
                value={scope}
                onChange={setScope}
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
              onChange={setStatus}
              options={[
              { value: 'all', label: 'All', count: customers.length },
              { value: 'active', label: 'Active', count: activeCount },
              { value: 'inactive', label: 'Inactive', count: customers.length - activeCount }]
              } />
            
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as 'all' | CustomerGrade)}
              aria-label="Filter by grade"
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
              
              <option value="all">All grades</option>
              {(['A', 'B', 'C', 'D'] as CustomerGrade[]).map((g) =>
              <option key={g} value={g}>Grade {g}</option>
              )}
            </select>
          </div>
        </div>

        {filtered.length === 0 ?
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
            Showing {filtered.length} of {customers.length} customers
          </span>
          {hasFilters && filtered.length > 0 &&
          <button type="button" onClick={clearFilters} className="font-medium text-brand-600 hover:text-brand-700">
              Clear filters
            </button>
          }
        </div>
      </div>

      <CustomerMachinesDrawer customer={selected} onClose={() => setSelectedId(null)} />
      <CreateCustomerDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>);

}
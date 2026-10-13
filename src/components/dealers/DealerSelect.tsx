'use client';

import { useMemo, useState } from 'react';
import { CheckIcon, SearchIcon } from 'lucide-react';
import type { DealerResponse } from '../../apis/dealers';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';

interface DealerSelectProps {
  dealers: DealerResponse[];
  value: string;
  onChange: (value: string) => void;
  onCreate: () => void;
  error?: string;
}

export function DealerSelect({ dealers, value, onChange, onCreate, error }: DealerSelectProps) {
  const selected = dealers.find((dealer) => String(dealer.dealerId) === value);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return dealers
      .filter((dealer) => dealer.isActive)
      .filter((dealer) => !search || [dealer.dealerName, dealer.dealerAddress, dealer.dealerContactNumber]
        .some((field) => field?.toLowerCase().includes(search)))
      .slice(0, 12);
  }, [dealers, query]);

  const displayValue = open ? query : selected?.dealerName ?? '';

  return (
    <FormField
      label="Dealer"
      htmlFor="sale-dealerId"
      error={error}
      action={<button type="button" onClick={onCreate} className="text-xs font-medium text-brand-700 hover:text-brand-800">+ Create new</button>}
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
        <input
          id="sale-dealerId"
          role="combobox"
          aria-expanded={open}
          aria-controls="sale-dealer-options"
          aria-autocomplete="list"
          autoComplete="off"
          value={displayValue}
          placeholder="Search and select dealer"
          onFocus={() => { setQuery(''); setOpen(true); }}
          onBlur={() => setOpen(false)}
          onChange={(event) => { setQuery(event.target.value); onChange(''); setOpen(true); }}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
          className={`${fieldClass(!!error)} pl-9`}
        />
        {open && (
          <div id="sale-dealer-options" role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-lg">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { onChange(''); setQuery(''); setOpen(false); }}
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-ink-muted hover:bg-canvas"
            >
              No dealer
            </button>
            {filtered.map((dealer) => (
              <button
                key={dealer.dealerId}
                type="button"
                role="option"
                aria-selected={String(dealer.dealerId) === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { onChange(String(dealer.dealerId)); setQuery(''); setOpen(false); }}
                className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-brand-50"
              >
                <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 text-brand-600 ${String(dealer.dealerId) === value ? 'opacity-100' : 'opacity-0'}`} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{dealer.dealerName}</span>
                  <span className="block truncate text-xs text-ink-subtle">{dealer.dealerContactNumber || dealer.dealerAddress || `Dealer #${dealer.dealerId}`}</span>
                </span>
              </button>
            ))}
            {!filtered.length && (
              <div className="px-3 py-3 text-sm text-ink-muted">
                <p>No matching dealers.</p>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setOpen(false); onCreate(); }} className="mt-1 font-medium text-brand-700 hover:text-brand-800">Create “{query.trim()}”</button>
              </div>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}

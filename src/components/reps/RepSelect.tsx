'use client';

import { useMemo, useState } from 'react';
import { CheckIcon, SearchIcon } from 'lucide-react';
import type { RepResponse } from '../../apis/reps';
import { FormField } from '../ui/FormField';
import { fieldClass } from '../../utils/styles';

interface RepSelectProps {
  reps: RepResponse[];
  value: string;
  onChange: (value: string) => void;
  onCreate: () => void;
  error?: string;
}

export function RepSelect({ reps, value, onChange, onCreate, error }: RepSelectProps) {
  const selected = reps.find((rep) => String(rep.repId) === value);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return reps
      .filter((rep) => rep.isActive)
      .filter((rep) => !search || [rep.repName, rep.repCode, rep.repMobileNumber]
        .some((field) => field?.toLowerCase().includes(search)))
      .slice(0, 12);
  }, [reps, query]);

  return (
    <FormField label="Representative" htmlFor="sale-repId" error={error} action={<button type="button" onClick={onCreate} className="text-xs font-medium text-brand-700 hover:text-brand-800">+ Create new</button>}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
        <input
          id="sale-repId"
          role="combobox"
          aria-expanded={open}
          aria-controls="sale-rep-options"
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? query : selected ? `${selected.repName} · ${selected.repCode}` : ''}
          placeholder="Search and select representative"
          onFocus={() => { setQuery(''); setOpen(true); }}
          onBlur={() => setOpen(false)}
          onChange={(event) => { setQuery(event.target.value); onChange(''); setOpen(true); }}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
          className={`${fieldClass(!!error)} pl-9`}
        />
        {open && (
          <div id="sale-rep-options" role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-lg">
            <button type="button" role="option" aria-selected={!value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(''); setQuery(''); setOpen(false); }} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-ink-muted hover:bg-canvas">
              No representative
            </button>
            {filtered.map((rep) => (
              <button key={rep.repId} type="button" role="option" aria-selected={String(rep.repId) === value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(String(rep.repId)); setQuery(''); setOpen(false); }} className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-brand-50">
                <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 text-brand-600 ${String(rep.repId) === value ? 'opacity-100' : 'opacity-0'}`} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{rep.repName}</span>
                  <span className="block truncate text-xs text-ink-subtle">{rep.repCode}{rep.repMobileNumber ? ` · ${rep.repMobileNumber}` : ''}</span>
                </span>
              </button>
            ))}
            {!filtered.length && <div className="px-3 py-3 text-sm text-ink-muted"><p>No matching representatives.</p><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setOpen(false); onCreate(); }} className="mt-1 font-medium text-brand-700 hover:text-brand-800">Create “{query.trim()}”</button></div>}
          </div>
        )}
      </div>
    </FormField>
  );
}

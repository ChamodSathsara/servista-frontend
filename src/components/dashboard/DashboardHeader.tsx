'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';

const subscribeNoop = () => () => {};

function greeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader() {
  // Only true in the browser, so the server-rendered HTML never contains a stale build-time date/greeting.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const now = mounted ? new Date() : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="min-h-5 text-sm text-ink-muted">{now ? format(now, 'EEEE, d MMMM yyyy') : '\u00A0'}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
          {now ? greeting(now.getHours()) : 'Welcome'}, Amaya
        </h1>
      </div>
      <Link
        href="/customers?create=1"
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-canvas"
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        New customer
      </Link>
    </div>
  );
}

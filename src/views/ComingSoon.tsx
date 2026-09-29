'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { navSections } from '../data/navigation';

export function ComingSoon() {
  const pathname = usePathname();
  const item = navSections.flatMap((s) => s.items).find((i) => i.path === pathname);
  const Icon = item?.icon;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
      {Icon &&
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      }
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">{item?.label ?? 'This module'} is coming soon</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item?.description}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        We&apos;re building it now — it will appear here automatically once it&apos;s ready.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-canvas">
        
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>);

}
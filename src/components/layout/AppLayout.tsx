'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, MenuIcon } from 'lucide-react';
import { Sidebar, LOGO_URL, LOGO_W, LOGO_H } from './Sidebar';
import { easeOut } from '../../utils/styles';
import { clearLoginSession } from '../../apis/auth';

const COLLAPSE_KEY = 'erp.sidebarCollapsed';

// Sidebar preference lives in localStorage. useSyncExternalStore renders `false` on the server and during
// hydration, then switches to the saved value, so there is no hydration mismatch.
const listeners = new Set<() => void>();
let memoryFallback = false;

function subscribeCollapsed(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function getCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === 'true';
  } catch {
    return memoryFallback;
  }
}

function setCollapsedStored(value: boolean) {
  memoryFallback = value;
  try {
    window.localStorage.setItem(COLLAPSE_KEY, String(value));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSyncExternalStore(subscribeCollapsed, getCollapsed, () => false);
  const router = useRouter();
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const handleSignOut = () => {
    clearLoginSession();
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] lg:block ${
        collapsed ? 'w-[72px]' : 'w-64'}`
        }>
        
        <div className="h-full overflow-hidden">
          <Sidebar onSignOut={handleSignOut} collapsed={collapsed} />
        </div>
        <button
          type="button"
          onClick={() => setCollapsedStored(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[52px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-ink-muted shadow-sm transition-colors duration-150 hover:border-brand-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
          
          <ChevronLeftIcon
            className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            aria-hidden="true" />
          
        </button>
      </aside>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          key="nav-backdrop"
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileOpen(false)} />

        }
        {mobileOpen &&
        <motion.aside
          key="nav-panel"
          className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.25, ease: easeOut }}>
          
            <Sidebar onSignOut={handleSignOut} onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        }
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-line bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-muted hover:bg-canvas">
            
            <MenuIcon className="h-5 w-5" />
          </button>
          <Image src={LOGO_URL} alt="Gestetner of Ceylon PLC" width={LOGO_W} height={LOGO_H} className="h-8 w-auto" />
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>);

}

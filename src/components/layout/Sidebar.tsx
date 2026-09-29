'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';
import { navSections } from '../../data/navigation';

export const LOGO_URL = "/footer-logo-removebg-preview.png";
export const LOGO_W = 363;
export const LOGO_H = 148;

interface SidebarProps {
  onNavigate?: () => void;
  onSignOut: () => void;
  collapsed?: boolean;
}

export function Sidebar({ onNavigate, onSignOut, collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col border-r border-line bg-white">
      <div className={`flex h-16 shrink-0 items-center border-b border-line ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        {collapsed ?
        <div className="h-10 w-9 overflow-hidden">
            <Image src={LOGO_URL} alt="Gestetner of Ceylon PLC" width={LOGO_W} height={LOGO_H} priority className="h-10 w-auto max-w-none" />
          </div> :

        <Image src={LOGO_URL} alt="Gestetner of Ceylon PLC" width={LOGO_W} height={LOGO_H} priority className="h-10 w-auto" />
        }
      </div>

      <nav aria-label="Main" className={`flex-1 overflow-y-auto overflow-x-hidden py-5 ${collapsed ? 'space-y-3 px-3' : 'space-y-6 px-3'}`}>
        {navSections.map((section, index) =>
        <div key={section.title}>
            {collapsed ?
          index > 0 && <div className="mx-2 mb-3 border-t border-line" aria-hidden="true" /> :

          <p className="mb-1.5 whitespace-nowrap px-3 text-xs font-medium text-ink-subtle">{section.title}</p>
          }
            <ul className="space-y-0.5">
              {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <li key={item.key}>
                    <Link
                    href={item.path}
                    onClick={onNavigate}
                    title={collapsed ? `${item.label}${item.comingSoon ? ' (coming soon)' : ''}` : undefined}
                    aria-label={collapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={
                    `flex h-9 items-center rounded-lg text-sm transition-colors duration-150 ${
                    collapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${
                    isActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`
                    }>
                    
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      {!collapsed &&
                    <>
                          <span className="flex-1 truncate whitespace-nowrap">{item.label}</span>
                          {item.comingSoon && <span className="text-[11px] text-ink-subtle">Soon</span>}
                        </>
                    }
                    </Link>
                  </li>);

            })}
            </ul>
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        {collapsed ?
        <div className="flex flex-col items-center gap-2">
            <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
            title="Amaya De Silva — Service Manager">
            
              AD
            </div>
            <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-lg p-2 text-ink-subtle transition-colors duration-150 hover:bg-canvas hover:text-accent-500">
            
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div> :

        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">Amaya De Silva</p>
              <p className="truncate text-xs text-ink-subtle">Service Manager</p>
            </div>
            <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-lg p-2 text-ink-subtle transition-colors duration-150 hover:bg-canvas hover:text-accent-500">
            
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        }
      </div>
    </div>);

}
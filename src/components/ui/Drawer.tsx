'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { easeOut } from '../../utils/styles';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  widthClass?: string;
}

export function Drawer({ open, onClose, labelledBy, children, widthClass = 'max-w-3xl' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        key="drawer-backdrop"
        className="fixed inset-0 z-40 bg-ink/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose} />

      }
      {open &&
      <motion.aside
        key="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`fixed inset-y-0 right-0 z-40 flex w-full flex-col bg-white shadow-2xl ${widthClass}`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: easeOut }}>
        
          <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-ink-subtle transition-colors duration-150 hover:bg-canvas hover:text-ink">
          
            <XIcon className="h-5 w-5" />
          </button>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </motion.aside>
      }
    </AnimatePresence>);

}
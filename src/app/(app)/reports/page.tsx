import type { Metadata } from 'next';
import { Reports } from '@/views/Reports';

export const metadata: Metadata = { title: 'Reports · ERP System' };

export default function ReportsPage() {
  return <Reports />;
}

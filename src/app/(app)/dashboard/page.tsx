import type { Metadata } from 'next';
import { Dashboard } from '@/views/Dashboard';

export const metadata: Metadata = { title: 'Dashboard · ERP System' };

export default function DashboardPage() {
  return <Dashboard />;
}

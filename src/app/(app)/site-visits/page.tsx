import type { Metadata } from 'next';
import { SiteVisits } from '@/views/SiteVisits';

export const metadata: Metadata = { title: 'Site Visits · ERP System' };

export default function SiteVisitsPage() {
  return <SiteVisits />;
}

import type { Metadata } from 'next';
import { TechOfficers } from '@/views/TechOfficers';

export const metadata: Metadata = { title: 'Tech Officers · ERP System' };

export default function TechOfficersPage() {
  return <TechOfficers />;
}

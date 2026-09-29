import type { Metadata } from 'next';
import { Salesmen } from '@/views/Salesmen';

export const metadata: Metadata = { title: 'Salesman · ERP System' };

export default function SalesmanPage() {
  return <Salesmen />;
}

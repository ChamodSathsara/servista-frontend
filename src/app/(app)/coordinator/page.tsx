import type { Metadata } from 'next';
import { ManagedUsers } from '@/views/ManagedUsers';
export const metadata: Metadata = { title: 'Coordinators · ERP System' };
export default function CoordinatorPage() { return <ManagedUsers kind="coordinator" />; }

import type { Metadata } from 'next';
import { ManagedUsers } from '@/views/ManagedUsers';

export const metadata: Metadata = { title: 'Stores Users · ERP System' };

export default function StoresUsersPage() {
  return <ManagedUsers kind="stores-user" />;
}

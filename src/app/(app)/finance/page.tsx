import type { Metadata } from 'next';
import { ManagedUsers } from '@/views/ManagedUsers';
export const metadata: Metadata = { title: 'Finance Users · ERP System' };
export default function FinancePage() { return <ManagedUsers kind="finance" />; }

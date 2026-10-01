import type { Metadata } from 'next';
import { Breakdowns } from '@/views/Breakdowns';
export const metadata: Metadata = { title: 'Breakdowns · ERP System' };
export default function BreakdownsPage(){ return <Breakdowns/>; }

import type { Metadata } from 'next';
import { Machines } from '@/views/Machines';

export const metadata: Metadata = { title: 'Machines · ERP System' };
export default function MachinesPage() { return <Machines />; }

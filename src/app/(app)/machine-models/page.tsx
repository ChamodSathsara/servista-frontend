import type { Metadata } from 'next';
import { MachineModels } from '@/views/MachineModels';
export const metadata: Metadata = { title: 'Machine Models · ERP System' };
export default function MachineModelsPage() { return <MachineModels />; }

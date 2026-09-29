import type { Metadata } from 'next'; import { Catalog } from '@/views/Catalog';
export const metadata: Metadata = { title: 'Machine Types · ERP System' };
export default function MachineTypesPage(){return <Catalog kind="machineType"/>;}

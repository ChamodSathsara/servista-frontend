import type { Metadata } from 'next'; import { Catalog } from '@/views/Catalog';
export const metadata: Metadata = { title: 'Manufacturers · ERP System' };
export default function ManufacturersPage(){return <Catalog kind="manufacturer"/>;}

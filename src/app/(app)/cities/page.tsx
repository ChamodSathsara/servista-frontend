import type { Metadata } from 'next'; import { Cities } from '@/views/Cities';
export const metadata: Metadata = { title: 'Cities · ERP System' };
export default function CitiesPage(){return <Cities/>;}

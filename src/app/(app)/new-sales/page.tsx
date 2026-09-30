import type { Metadata } from 'next'; import { NewSale } from '@/views/NewSale';
export const metadata: Metadata = { title: 'New Sale · ERP System' };
export default function NewSalePage(){return <NewSale/>;}

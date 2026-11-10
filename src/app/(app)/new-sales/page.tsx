import type { Metadata } from 'next'; import { RoleBasedNewSales } from '@/views/RoleBasedNewSales';
export const metadata: Metadata = { title: 'New Sale · ERP System' };
export default function NewSalePage(){return <RoleBasedNewSales/>;}

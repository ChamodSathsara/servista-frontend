import type { Metadata } from 'next'; import { MachineInvoices } from '@/views/MachineInvoices';
export const metadata: Metadata = { title: 'Machine Invoices · ERP System' };
export default function MachineInvoicePage(){return <MachineInvoices/>;}

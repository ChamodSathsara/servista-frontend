import type { Metadata } from 'next';
import { MeterReadings } from '@/views/MeterReadings';
export const metadata: Metadata = { title: 'Meter Readings · ERP System' };
export default function MeterReadingsPage(){ return <MeterReadings/>; }

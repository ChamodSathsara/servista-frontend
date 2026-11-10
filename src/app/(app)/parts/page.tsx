import type { Metadata } from 'next';
import { Parts } from '@/views/Parts';

export const metadata: Metadata = { title: 'Parts · ERP System' };

export default function PartsPage() { return <Parts/>; }

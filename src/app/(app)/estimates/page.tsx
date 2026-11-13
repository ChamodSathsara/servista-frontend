import type { Metadata } from 'next';
import { Estimates } from '@/views/Estimates';
export const metadata: Metadata = { title: 'Estimates' };
export default function EstimatesPage(){ return <Estimates/>; }

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Customers } from '@/views/Customers';

export const metadata: Metadata = { title: 'Customers · ERP System' };

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <Customers />
    </Suspense>
  );
}

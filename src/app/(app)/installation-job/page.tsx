import type { Metadata } from 'next';
import { InstallationJobs } from '@/views/InstallationJobs';

export const metadata: Metadata = { title: 'Installation Jobs · ERP System' };

export default function InstallationJobsPage() {
  return <InstallationJobs />;
}

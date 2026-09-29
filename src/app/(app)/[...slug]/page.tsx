import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ComingSoon } from '@/views/ComingSoon';
import { navSections } from '@/data/navigation';

const comingSoon = navSections.flatMap((s) => s.items).filter((i) => i.comingSoon);

type Params = Promise<{ slug: string[] }>;

const findItem = (slug: string[]) => comingSoon.find((i) => i.path === `/${slug.join('/')}`);

// Pre-render every "coming soon" module listed in src/data/navigation.ts
export function generateStaticParams() {
  return comingSoon.map((i) => ({ slug: [i.path.replace(/^\//, '')] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = findItem((await params).slug);
  return { title: item ? `${item.label} · ERP System` : 'ERP System Dashboard' };
}

export default async function ComingSoonPage({ params }: { params: Params }) {
  const { slug } = await params;
  // Same behaviour as the old `<Route path="*" element={<Navigate to="/login" />}>`
  if (!findItem(slug)) redirect('/login');
  return <ComingSoon />;
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PackageIcon, SearchIcon, XIcon } from 'lucide-react';
import { getMachineModels, type MachineModelResponse } from '../apis/machines';
import { getPartCategories, getParts, type PartCategoryResponse, type PartResponse } from '../apis/parts';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';

const PAGE_SIZE = 25;

export function Parts() {
  const [parts, setParts] = useState<PartResponse[]>([]);
  const [categories, setCategories] = useState<PartCategoryResponse[]>([]);
  const [models, setModels] = useState<MachineModelResponse[]>([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [modelId, setModelId] = useState('');
  const [status, setStatus] = useState<'all'|'active'|'inactive'>('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<PartResponse|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [partData, categoryData, modelData] = await Promise.all([getParts(), getPartCategories(), getMachineModels()]);
      setParts(partData); setCategories(categoryData); setModels(modelData);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load parts.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { setPage(0); }, [query, categoryId, modelId, status]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return parts.filter(part => {
      if (status === 'active' && !part.isActive) return false;
      if (status === 'inactive' && part.isActive) return false;
      if (categoryId && !part.categoryIds.includes(Number(categoryId))) return false;
      if (modelId && !part.modelIds.includes(Number(modelId))) return false;
      return !text || part.partCode.toLowerCase().includes(text) || part.partName.toLowerCase().includes(text) || (part.description ?? '').toLowerCase().includes(text);
    });
  }, [parts, query, categoryId, modelId, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const categoryMap = useMemo(() => new Map(categories.map(item => [item.partCategoryId, item.categoryName])), [categories]);
  const modelMap = useMemo(() => new Map(models.map(item => [item.modelId, `${item.modelNumber} · ${item.modelName}`])), [models]);

  return <div className="mx-auto max-w-7xl">
    <div className="flex items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-semibold text-brand-700"><PackageIcon className="h-4 w-4"/>PARTS CATALOGUE</div><h1 className="mt-1 text-2xl font-semibold text-ink">Parts</h1><p className="mt-1 text-sm text-ink-muted">{parts.length} parts · {parts.filter(part => part.isActive).length} active</p></div></div>
    <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="grid gap-3 border-b border-line p-4 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_230px_260px_170px]">
        <div className="flex h-10 items-center rounded-lg border border-line focus-within:border-brand-500"><SearchIcon className="ml-3 h-4 w-4 text-ink-subtle"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search part code, name or description" className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"/>{query && <button onClick={() => setQuery('')} className="mr-2"><XIcon className="h-4 w-4"/></button>}</div>
        <select value={categoryId} onChange={event => setCategoryId(event.target.value)} className="h-10 rounded-lg border border-line bg-white px-3 text-sm"><option value="">All categories</option>{categories.filter(item => item.isActive).map(item => <option key={item.partCategoryId} value={item.partCategoryId}>{item.categoryName}</option>)}</select>
        <select value={modelId} onChange={event => setModelId(event.target.value)} className="h-10 rounded-lg border border-line bg-white px-3 text-sm"><option value="">All machine models</option>{models.filter(item => item.isActive).sort((a,b) => a.modelNumber.localeCompare(b.modelNumber, undefined, { numeric: true })).map(item => <option key={item.modelId} value={item.modelId}>{item.modelNumber} · {item.modelName}</option>)}</select>
        <select value={status} onChange={event => setStatus(event.target.value as typeof status)} className="h-10 rounded-lg border border-line bg-white px-3 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
      {loading ? <p className="px-6 py-20 text-center text-sm text-ink-muted">Loading parts…</p> : error ? <div className="px-6 py-20 text-center"><p className="text-sm text-danger-700">{error}</p><Button className="mt-4" variant="secondary" onClick={() => void load()}>Try again</Button></div> : visible.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-ink-subtle"><tr>{['ID','Part code','Part name','Category','Models','Unit price','Status'].map(item => <th key={item} className="whitespace-nowrap px-4 py-3 font-semibold">{item}</th>)}</tr></thead><tbody className="divide-y divide-line">{visible.map(part => <tr key={part.partId} tabIndex={0} role="button" onClick={() => setSelected(part)} onKeyDown={event => { if (event.key === 'Enter') setSelected(part); }} className="cursor-pointer hover:bg-brand-50/50"><td className="px-4 py-3 font-mono text-xs text-ink-muted">{part.partId}</td><td className="px-4 py-3 font-mono font-semibold text-brand-700">{part.partCode}</td><td className="px-4 py-3 font-medium text-ink">{part.partName}</td><td className="max-w-64 px-4 py-3 text-ink-muted">{part.categoryIds.map(id => categoryMap.get(id) ?? `#${id}`).join(', ') || '—'}</td><td className="px-4 py-3 text-ink-muted">{part.modelIds.length}</td><td className="whitespace-nowrap px-4 py-3">{part.unitPrice == null ? '—' : Number(part.unitPrice).toLocaleString(undefined,{minimumFractionDigits:2})}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${part.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{part.isActive ? 'Active' : 'Inactive'}</span></td></tr>)}</tbody></table></div> : <p className="px-6 py-20 text-center text-sm text-ink-muted">No parts match these filters.</p>}
      <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-muted"><span>Showing {visible.length} of {filtered.length}</span><div className="flex items-center gap-2"><button disabled={page===0} onClick={() => setPage(value => value-1)} className="rounded-md border border-line p-1.5 disabled:opacity-40"><ChevronLeftIcon className="h-4 w-4"/></button><span>Page {page+1} of {pages}</span><button disabled={page>=pages-1} onClick={() => setPage(value => value+1)} className="rounded-md border border-line p-1.5 disabled:opacity-40"><ChevronRightIcon className="h-4 w-4"/></button></div></div>
    </div>
    <Drawer open={!!selected} onClose={() => setSelected(null)} labelledBy="part-detail-title" widthClass="max-w-xl">{selected && <div className="p-7 sm:p-8"><p className="font-mono text-xs font-semibold text-brand-700">PART #{selected.partId}</p><h2 id="part-detail-title" className="mt-2 text-2xl font-semibold text-ink">{selected.partName}</h2><p className="mt-1 font-mono text-sm text-ink-muted">{selected.partCode}</p><div className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6"><Detail label="Status" value={selected.isActive?'Active':'Inactive'}/><Detail label="Unit price" value={selected.unitPrice==null?'—':Number(selected.unitPrice).toLocaleString(undefined,{minimumFractionDigits:2})}/><div className="col-span-2"><Detail label="Description" value={selected.description||'—'}/></div><div className="col-span-2"><Detail label="Categories" value={selected.categoryIds.map(id=>categoryMap.get(id)??`#${id}`).join(', ')||'—'}/></div><div className="col-span-2"><Detail label="Compatible machine models" value={selected.modelIds.map(id=>modelMap.get(id)??`Model #${id}`).join(', ')||'—'}/></div><Detail label="Created by" value={selected.createdBy??'—'}/><Detail label="Created at" value={selected.createdAt?new Date(selected.createdAt).toLocaleString():'—'}/></div></div>}</Drawer>
  </div>;
}

function Detail({label,value}:{label:string;value:React.ReactNode}){return <div><dt className="text-xs text-ink-subtle">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd></div>}

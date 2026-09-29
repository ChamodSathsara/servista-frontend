'use client';
import { ChevronRightIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { initials } from '../../utils/format';
import { managedUserId, type CoordinatorResponse, type ManagedUserKind, type ManagedUserResponse } from '../../apis/adminUsers';

export function ManagedUsersTable({ kind, users, onSelect }: { kind: ManagedUserKind; users: ManagedUserResponse[]; onSelect: (user: ManagedUserResponse) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted"><tr><th className="px-5 py-3 font-medium">ID</th><th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Division · Area</th>{kind === 'coordinator' && <th className="px-5 py-3 font-medium">Coordinator role</th>}<th className="px-5 py-3 font-medium">Companies</th><th className="px-5 py-3 font-medium">Status</th><th className="w-10 px-3 py-3" /></tr></thead>
    <tbody className="divide-y divide-line">{users.map((item) => <tr key={managedUserId(kind, item)} tabIndex={0} onClick={() => onSelect(item)} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(item);}}} className="group cursor-pointer hover:bg-brand-50/50 focus:bg-brand-50/60 focus:outline-none">
      <td className="px-5 py-3.5 font-mono text-xs text-ink-muted">{managedUserId(kind,item)}</td><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{initials(item.user.userName)}</span><div><p className="font-medium text-ink group-hover:text-brand-700">{item.user.userName}</p><p className="text-xs text-ink-subtle">{item.user.email}</p></div></div></td>
      <td className="px-5 py-3.5 text-ink-muted">{item.user.division} · {item.user.area}</td>{kind === 'coordinator' && <td className="px-5 py-3.5 text-ink-muted">{(item as CoordinatorResponse).coordinatorRole.replaceAll('_',' ')}</td>}<td className="px-5 py-3.5 text-ink-muted">{item.companies.join(', ')}</td><td className="px-5 py-3.5"><StatusBadge tone={item.user.isActive?'success':'neutral'} label={item.user.isActive?'Active':'Inactive'} /></td><td className="px-3 py-3.5 text-ink-subtle"><ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5" /></td>
    </tr>)}</tbody></table></div>;
}
